import React, { useEffect, useRef, useState } from 'react';
import { Clock, X, ShieldCheck, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { MonetagSettings, AdNetworkConfig } from './lib/supabase';

/**
 * Selects 1 active ad network per page load when 1 or more networks have `is_active = true`.
 * If multiple networks are active, rotates ads in round-robin order across page loads.
 * If all networks are Off (`is_active = false`), returns null (show no ads).
 */
export function selectRotatedActiveNetworkOnLoad(
  networks: AdNetworkConfig[],
  advanceRotation = false
): AdNetworkConfig | null {
  const activeNetworks = (networks || []).filter((n) => Boolean(n.is_active));
  if (activeNetworks.length === 0) {
    return null;
  }
  if (activeNetworks.length === 1) {
    return activeNetworks[0];
  }

  const STORAGE_KEY = 'sfmartbd_ad_rotation_index_v1';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prevIdx = raw !== null ? parseInt(raw, 10) : -1;
    const nextIdx = advanceRotation
      ? (prevIdx + 1) % activeNetworks.length
      : Math.max(0, prevIdx) % activeNetworks.length;
    if (advanceRotation || raw === null) {
      localStorage.setItem(STORAGE_KEY, String(nextIdx));
    }
    return activeNetworks[nextIdx] || activeNetworks[0];
  } catch {
    return activeNetworks[0];
  }
}

/**
 * Safely renders and executes Ad Network HTML/script tags inside a container ref.
 * Works with <script src="...">, inline <script>...</script>, <iframe>, and standard HTML banners
 * from Monetag, Adsterra, PropellerAds, AdMook, PopAds, and Galaksion.
 */
export const MonetagCodeRenderer: React.FC<{
  code: string;
  className?: string;
}> = ({ code, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';

    const trimmed = (code || '').trim();
    if (!trimmed) return;

    try {
      const range = document.createRange();
      range.selectNode(el);
      const fragment = range.createContextualFragment(trimmed);
      el.appendChild(fragment);
    } catch {
      el.innerHTML = trimmed;
    }
  }, [code]);

  return <div ref={containerRef} className={className} />;
};

/**
 * Injects Popup Code for the currently active rotated Ad Network (`popup_code`),
 * only when `activeNetwork.is_active === true` and `popup_code` is non-empty.
 */
export const ActiveNetworkPopupInjector: React.FC<{
  activeNetwork: AdNetworkConfig | null;
}> = ({ activeNetwork }) => {
  if (!activeNetwork || !activeNetwork.is_active) {
    return null;
  }
  const popupCode = (activeNetwork.popup_code || '').trim();
  if (!popupCode) {
    return null;
  }
  return <MonetagCodeRenderer code={popupCode} className="hidden" />;
};

/**
 * Rendered on Homepage after every 2 cards when either:
 * 1) An active network from `ad_networks` is ON (`activeNetwork.is_active === true`), OR
 * 2) `monetag_settings.banner_enabled === true`.
 * If all networks are OFF and `banner_enabled === false`, renders nothing (shows no ads).
 */
export const MonetagHomepageBannerAfterTwoCards: React.FC<{
  settings: MonetagSettings;
  activeNetwork?: AdNetworkConfig | null;
  activeNetworksCount?: number;
  pairNumber: number;
  onOpenMonetagAdmin?: () => void;
  onOpenAdsManagerAdmin?: () => void;
}> = ({
  settings,
  activeNetwork,
  activeNetworksCount = 0,
  pairNumber,
  onOpenMonetagAdmin,
  onOpenAdsManagerAdmin,
}) => {
  const isNetworkActive = Boolean(activeNetwork && activeNetwork.is_active);
  const isMonetagBannerActive = Boolean(settings.banner_enabled);

  // If all networks are Off and Monetag banner is Off -> show no ads
  if (!isNetworkActive && !isMonetagBannerActive) {
    return null;
  }

  const displayNetworkName = isNetworkActive ? activeNetwork!.network_name : 'Monetag';
  const effectiveBannerCode = isNetworkActive
    ? activeNetwork!.banner_code || settings.banner_code
    : settings.banner_code;
  const hasBannerCode = Boolean(effectiveBannerCode && effectiveBannerCode.trim().length > 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#04240B] via-[#073314] to-[#04240B] border border-[#00FF66]/45 px-3.5 py-3 shadow-[0_0_18px_rgba(0,255,102,0.18)]">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#00FF66]/20 text-[10px] text-emerald-200">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="font-display font-bold text-[#FFD700]">
            SPONSORED · {displayNetworkName.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-300">Ad #{pairNumber}</span>
      </div>

      {hasBannerCode ? (
        <MonetagCodeRenderer
          code={effectiveBannerCode}
          className="w-full min-h-[60px] flex items-center justify-center overflow-x-auto text-center text-xs text-white"
        />
      ) : (
        <div className="py-3 px-4 rounded-xl bg-[#021A0A]/85 border border-[#FFD700]/35 flex items-center justify-center text-center">
          <div className="text-xs font-display font-bold text-[#FFD700]">
            Sponsored Partner Advertisement · SportsViva Official
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Fullscreen Vignette Popup shown on page navigation when either:
 * 1) An active rotated network in `ad_networks` is ON and has vignette enabled/configured, OR
 * 2) `monetag_settings.vignette_enabled === true`.
 * Shows countdown timer (3/5/10 sec from settings), then reveals Close button. On close, navigates to next page.
 */
export const MonetagVignetteFullscreenModal: React.FC<{
  isOpen: boolean;
  settings: MonetagSettings;
  activeNetwork?: AdNetworkConfig | null;
  targetPageName: string;
  onCloseAndNavigate: () => void;
  onOpenMonetagAdmin?: () => void;
}> = ({
  isOpen,
  settings,
  activeNetwork,
  targetPageName,
  onCloseAndNavigate,
  onOpenMonetagAdmin,
}) => {
  const configuredTimer = [3, 5, 10].includes(Number(settings.timer)) ? Number(settings.timer) : 5;
  const [secondsLeft, setSecondsLeft] = useState<number>(configuredTimer);

  useEffect(() => {
    if (!isOpen) return;
    const validDuration = [3, 5, 10].includes(Number(settings.timer)) ? Number(settings.timer) : 5;
    setSecondsLeft(validDuration);

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isOpen, settings.timer, targetPageName]);

  if (!isOpen) return null;

  const isNetworkActive = Boolean(activeNetwork && activeNetwork.is_active);
  const displayNetworkName = isNetworkActive ? activeNetwork!.network_name : 'Monetag';
  const effectiveVignetteCode = isNetworkActive
    ? activeNetwork!.vignette_code || settings.vignette_code
    : settings.vignette_code;

  const hasVignetteCode = Boolean(
    effectiveVignetteCode && effectiveVignetteCode.trim().length > 0
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-[#021A0A]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white">
      {/* Top Bar with Countdown Timer -> Close Button */}
      <div className="max-w-4xl w-full mx-auto bg-gradient-to-r from-[#04280D] via-[#063312] to-[#04280D] border-2 border-[#FFD700] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 shadow-[0_0_24px_rgba(255,215,0,0.3)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#021A0A] border border-[#00FF66] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-display font-black text-[#FFD700] truncate">
              SPONSORED · {displayNetworkName.toUpperCase()} VIGNETTE FULLSCREEN AD
            </div>
            <div className="text-[11px] text-emerald-200 truncate">
              Next Destination: <span className="font-bold text-white">{targetPageName}</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer OR Close Button */}
        <div className="shrink-0">
          {secondsLeft > 0 ? (
            <div className="px-4 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66] text-[#FFD700] font-mono-num font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,102,0.35)]">
              <Clock className="w-4 h-4 text-[#00FF66] animate-spin" />
              <span>Wait {secondsLeft}s to Close...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onCloseAndNavigate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_18px_rgba(255,215,0,0.75)] hover:brightness-110 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.75]" />
              <span>Close &amp; Continue →</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Fullscreen Vignette Content Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto my-4 rounded-2xl bg-gradient-to-b from-[#04240B] via-[#031B08] to-[#021406] border-2 border-[#00FF66]/60 shadow-[0_0_32px_rgba(0,255,102,0.2)] flex flex-col items-center justify-center p-6 overflow-auto relative">
        {hasVignetteCode ? (
          <MonetagCodeRenderer
            code={effectiveVignetteCode}
            className="w-full h-full flex flex-col items-center justify-center text-center"
          />
        ) : (
          <div className="max-w-lg w-full text-center space-y-4 p-6 rounded-2xl bg-[#021A0A]/90 border border-[#FFD700]/60">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              AD
            </div>
            <h2 className="text-lg sm:text-xl font-display font-black text-[#FFD700]">
              {displayNetworkName} Sponsored Advertisement
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Please wait for the <strong className="text-[#FFD700]">{configuredTimer}-second countdown timer</strong> to finish before continuing to your destination.
            </p>

            {secondsLeft > 0 ? (
              <div className="py-3 px-4 rounded-xl bg-[#04280D] border border-[#00FF66]/50 text-xs font-mono-num font-bold text-[#FFD700]">
                ⏳ Close button will unlock in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}...
              </div>
            ) : (
              <button
                type="button"
                onClick={onCloseAndNavigate}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-sm cursor-pointer shadow-lg hover:brightness-110"
              >
                ✕ Close Ad &amp; Go to {targetPageName} →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs text-emerald-300 px-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
          <span>Synced from Supabase · Network: {displayNetworkName}</span>
        </span>
        <span className="font-mono-num">
          Timer Setting: {configuredTimer}s ·{' '}
          {secondsLeft > 0 ? `${secondsLeft}s remaining` : 'Ready to close'}
        </span>
      </div>
    </div>
  );
};
