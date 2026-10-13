import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Upload,
  Link as LinkIcon,
  Code2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Sliders,
  X,
  RefreshCw
} from 'lucide-react';

export type AdSlotId =
  | 'card_01_cricket'
  | 'card_02_football'
  | 'card_03_tennis'
  | 'card_04_ludo'
  | 'card_05_caram'
  | 'card_06_golive'
  | 'card_07_live_video'
  | 'card_08_my_team'
  | 'card_09_quick_access'
  | 'card_10_sports_store'
  | 'cricket_hub_card'
  | 'football_hub_card'
  | 'tennis_hub_card';

export type AdBannerType = 'IMAGE' | 'SCRIPT' | 'PROMO';
export type AdBannerHeight = 'COMPACT_70' | 'STANDARD_95' | 'LARGE_130' | 'AUTO';

export interface AdSlotItem {
  slotId: AdSlotId;
  cardNumber: string;
  slotTitle: string;
  slotBanglaDesc: string;
  enabled: boolean;
  adType: AdBannerType;
  imageUrl: string;
  targetUrl: string;
  sponsorLabel: string;
  headline: string;
  subText: string;
  ctaText: string;
  scriptCode: string;
  bannerHeight: AdBannerHeight;
}

export interface GlobalAdSystemConfig {
  masterEnabled: boolean;
  showSlotPlaceholders: boolean;
  adminPin: string;
  updatedAt: string;
  slots: Record<AdSlotId, AdSlotItem>;
}

export const AD_SLOTS_META: {
  slotId: AdSlotId;
  cardNumber: string;
  slotTitle: string;
  slotBanglaDesc: string;
}[] = [
  {
    slotId: 'card_01_cricket',
    cardNumber: '01',
    slotTitle: 'Card 01: CRICKET Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ১ নম্বর Cricket কার্ডের ঠিক নিচে এই অ্যাড ব্যানারটি দেখাবে'
  },
  {
    slotId: 'card_02_football',
    cardNumber: '02',
    slotTitle: 'Card 02: FOOTBALL Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ২ নম্বর Football কার্ডের ঠিক নিচে এই অ্যাড ব্যানারটি দেখাবে'
  },
  {
    slotId: 'card_03_tennis',
    cardNumber: '03',
    slotTitle: 'Card 03: TENNIS Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ৩ নম্বর Tennis কার্ডের ঠিক নিচে এই অ্যাড ব্যানারটি দেখাবে'
  },
  {
    slotId: 'card_04_ludo',
    cardNumber: '04',
    slotTitle: 'Card 04: LUDO KING Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ৪ নম্বর Ludo King কার্ডের ঠিক নিচে এই অ্যাড ব্যানারটি দেখাবে'
  },
  {
    slotId: 'card_05_caram',
    cardNumber: '05',
    slotTitle: 'Card 05: CARAM Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ৫ নম্বর Caram কার্ডের ঠিক নিচে এই অ্যাড ব্যানারটি দেখাবে'
  },
  {
    slotId: 'card_06_golive',
    cardNumber: '06',
    slotTitle: 'Card 06: LIVE MATCH Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের ৬ নম্বর Live Match (Ball by Ball) কার্ডের ঠিক নিচে দেখাবে'
  },
  {
    slotId: 'card_07_live_video',
    cardNumber: '07',
    slotTitle: 'Card 07: LIVE VIDEO Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'সরাসরি গ্রামের ক্রিকেট ভিডিও প্রোগ্রাম কার্ডের ঠিক নিচে দেখাবে'
  },
  {
    slotId: 'card_08_my_team',
    cardNumber: '08',
    slotTitle: 'Card 08: MY TEAM & PIN Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'আমার টিম সাজান ও পিন অ্যাক্টিভেশন কার্ডের ঠিক নিচে দেখাবে'
  },
  {
    slotId: 'card_09_quick_access',
    cardNumber: '09',
    slotTitle: 'Card 09: QUICK ACCESS Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'Quick Access (Find Player, Membership, Quiz, Support) কার্ডের নিচে দেখাবে'
  },
  {
    slotId: 'card_10_sports_store',
    cardNumber: '10',
    slotTitle: 'Card 10: SPORTS STORE Card-এর নিচে অ্যাড ব্যানার',
    slotBanglaDesc: 'হোম পেজের Sports Store ব্যানার কার্ডের ঠিক নিচে দেখাবে'
  },
  {
    slotId: 'cricket_hub_card',
    cardNumber: '11',
    slotTitle: 'Cricket Guru: ম্যাচ ও নিউজ কার্ডের নিচে ব্যানার',
    slotBanglaDesc: 'Cricket Guru পেজের ফিচার্ড ম্যাচ ও নিউজ কার্ডের নিচে দেখাবে'
  },
  {
    slotId: 'football_hub_card',
    cardNumber: '12',
    slotTitle: 'Football Guru: ম্যাচ ও নিউজ কার্ডের নিচে ব্যানার',
    slotBanglaDesc: 'Football Guru পেজের ফিচার্ড ম্যাচ ও নিউজ কার্ডের নিচে দেখাবে'
  },
  {
    slotId: 'tennis_hub_card',
    cardNumber: '13',
    slotTitle: 'Tennis Guru: ম্যাচ ও নিউজ কার্ডের নিচে ব্যানার',
    slotBanglaDesc: 'Tennis Guru পেজের ফিচার্ড ম্যাচ ও নিউজ কার্ডের নিচে দেখাবে'
  }
];

const STORAGE_KEY = 'sv_global_ad_system_v4';
const AD_UPDATE_EVENT = 'sv-ads-config-updated';

export const DEFAULT_MONETAG_ZONE_SCRIPT = `<script src="https://nap5k.com/88/tag.min.js" data-zone="12011838" async data-cfasync="false"></script>`;

// Enabled after each category card on homepage:
const DEFAULT_ENABLED_MARKED_SLOTS = new Set<AdSlotId>([
  'card_01_cricket',
  'card_02_football',
  'card_03_tennis',
  'card_04_ludo',
  'card_05_caram',
  'card_06_golive',
  'card_07_live_video',
  'card_08_my_team',
  'card_09_quick_access',
  'card_10_sports_store'
]);

export function buildDefaultAdSystemConfig(): GlobalAdSystemConfig {
  const slots = {} as Record<AdSlotId, AdSlotItem>;
  for (const meta of AD_SLOTS_META) {
    const isMarkedSlot = DEFAULT_ENABLED_MARKED_SLOTS.has(meta.slotId);
    slots[meta.slotId] = {
      slotId: meta.slotId,
      cardNumber: meta.cardNumber,
      slotTitle: meta.slotTitle,
      slotBanglaDesc: meta.slotBanglaDesc,
      enabled: isMarkedSlot,
      adType: 'SCRIPT',
      imageUrl: '',
      targetUrl: 'https://',
      sponsorLabel: 'SPONSORED • MONETAG',
      headline: `স্পনসর বিজ্ঞাপন — ${meta.slotTitle.split(':')[0]}`,
      subText: 'Monetag Official Sponsored Ad Banner (Zone #12011838)',
      ctaText: 'বিস্তারিত দেখুন →',
      scriptCode: DEFAULT_MONETAG_ZONE_SCRIPT,
      bannerHeight: 'COMPACT_70'
    };
  }
  return {
    masterEnabled: true,
    showSlotPlaceholders: false,
    adminPin: '1234',
    updatedAt: new Date().toLocaleTimeString(),
    slots
  };
}

export function normalizeAdSystemConfig(raw: any): GlobalAdSystemConfig {
  const defaults = buildDefaultAdSystemConfig();
  if (!raw || typeof raw !== 'object') return defaults;

  const mergedSlots = { ...defaults.slots };
  if (raw.slots && typeof raw.slots === 'object') {
    for (const meta of AD_SLOTS_META) {
      const existing = raw.slots[meta.slotId];
      if (existing && typeof existing === 'object') {
        const rawScript = typeof existing.scriptCode === 'string' ? existing.scriptCode.trim() : '';
        const isLegacyDefaultScript = rawScript.includes('12006775');
        const hasExistingScript = rawScript.length > 0 && !isLegacyDefaultScript;
        const hasExistingImage =
          typeof existing.imageUrl === 'string' && existing.imageUrl.trim().length > 0;
        const isDefaultMarked = DEFAULT_ENABLED_MARKED_SLOTS.has(meta.slotId);

        mergedSlots[meta.slotId] = {
          ...defaults.slots[meta.slotId],
          ...existing,
          enabled:
            typeof existing.enabled === 'boolean'
              ? existing.enabled || (isDefaultMarked && !hasExistingScript && !hasExistingImage)
              : defaults.slots[meta.slotId].enabled,
          adType:
            hasExistingScript || (!hasExistingImage && isDefaultMarked)
              ? 'SCRIPT'
              : existing.adType || defaults.slots[meta.slotId].adType,
          scriptCode: hasExistingScript
            ? existing.scriptCode
            : defaults.slots[meta.slotId].scriptCode,
          slotId: meta.slotId,
          cardNumber: meta.cardNumber,
          slotTitle: meta.slotTitle,
          slotBanglaDesc: meta.slotBanglaDesc
        };
      }
    }
  }

  return {
    masterEnabled: typeof raw.masterEnabled === 'boolean' ? raw.masterEnabled : defaults.masterEnabled,
    showSlotPlaceholders:
      typeof raw.showSlotPlaceholders === 'boolean'
        ? raw.showSlotPlaceholders
        : defaults.showSlotPlaceholders,
    adminPin: typeof raw.adminPin === 'string' && raw.adminPin.trim() ? raw.adminPin.trim() : '1234',
    updatedAt: raw.updatedAt || defaults.updatedAt,
    slots: mergedSlots
  };
}

export function loadLocalAdConfig(): GlobalAdSystemConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return normalizeAdSystemConfig(JSON.parse(saved));
    }
  } catch {
    // ignore storage read error
  }
  return buildDefaultAdSystemConfig();
}

export async function saveAdSystemConfigEverywhere(
  newConfig: GlobalAdSystemConfig
): Promise<GlobalAdSystemConfig> {
  const normalized = normalizeAdSystemConfig({
    ...newConfig,
    updatedAt: new Date().toLocaleTimeString()
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore quota error
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AD_UPDATE_EVENT, { detail: normalized }));
  }

  try {
    await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: normalized })
    });
  } catch {
    // fallback to localStorage if offline
  }

  return normalized;
}

export function useAdSystemConfig() {
  const [config, setConfig] = useState<GlobalAdSystemConfig>(() => loadLocalAdConfig());

  useEffect(() => {
    let mounted = true;

    // Sync from server /api/ads on mount so all visitors see the Admin's saved ads
    fetch('/api/ads')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data?.ok && data.config) {
          const normalized = normalizeAdSystemConfig(data.config);
          setConfig(normalized);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});

    const handleCustomUpdate = (e: Event) => {
      const ce = e as CustomEvent<GlobalAdSystemConfig>;
      if (ce.detail) {
        setConfig(normalizeAdSystemConfig(ce.detail));
      } else {
        setConfig(loadLocalAdConfig());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setConfig(loadLocalAdConfig());
      }
    };

    window.addEventListener(AD_UPDATE_EVENT, handleCustomUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      mounted = false;
      window.removeEventListener(AD_UPDATE_EVENT, handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return { config, setConfig };
}

function formatSafeTargetUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getHeightClass(h: AdBannerHeight): string {
  switch (h) {
    case 'COMPACT_70':
      return 'h-[72px] sm:h-[82px]';
    case 'STANDARD_95':
      return 'h-[95px] sm:h-[110px]';
    case 'LARGE_130':
      return 'h-[130px] sm:h-[150px]';
    case 'AUTO':
    default:
      return 'min-h-[75px] max-h-[240px]';
  }
}

// ============================================================================
// SAFE HTML / ADSENSE / ADSTERRA / MONETAG SCRIPT RUNNER (ISOLATED IFRAME)
// ============================================================================
const SafeScriptAdFrame: React.FC<{
  scriptCode: string;
  slotId: string;
  cardNumber?: string;
  bannerHeight: AdBannerHeight;
}> = ({ scriptCode, slotId, cardNumber = '01', bannerHeight }) => {
  const heightPx =
    bannerHeight === 'COMPACT_70'
      ? 58
      : bannerHeight === 'LARGE_130'
      ? 126
      : bannerHeight === 'STANDARD_95'
      ? 88
      : 72;

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: linear-gradient(90deg, #04240D 0%, #073818 50%, #04240D 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${heightPx}px;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
    color: #ffffff;
    position: relative;
  }
  .ad-backdrop {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    z-index: 1;
    pointer-events: none;
  }
  .ad-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .ad-badge {
    background: linear-gradient(135deg, #FFD700, #00FF66);
    color: #021A0A;
    font-weight: 900;
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .ad-title {
    font-size: 12px;
    font-weight: 800;
    color: #FFD700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ad-sub {
    font-size: 10px;
    color: #A7F3D0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ad-pill {
    border: 1px solid rgba(0, 255, 102, 0.6);
    background: rgba(2, 26, 10, 0.85);
    color: #00FF66;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }
  #ad-root-${slotId} {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img, iframe {
    max-width: 100%;
    max-height: ${heightPx}px;
    height: auto;
    border: 0;
  }
</style>
</head>
<body>
  <div class="ad-backdrop">
    <div class="ad-left">
      <span class="ad-badge">AD BANNER #${cardNumber}</span>
      <div style="min-width:0;">
        <div class="ad-title">Monetag Sponsored Ad Banner • Zone #12011838</div>
        <div class="ad-sub">nap5k.com/88/tag.min.js • Active Ad Slot</div>
      </div>
    </div>
    <span class="ad-pill">SPONSORED</span>
  </div>
  <div id="ad-root-${slotId}">
    ${scriptCode}
  </div>
</body>
</html>`;

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: `${heightPx}px` }}>
      <iframe
        title={`Sponsored Ad ${slotId}`}
        srcDoc={srcDoc}
        style={{ height: `${heightPx}px` }}
        className="w-full border-0 overflow-hidden bg-[#031A0B] block"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    </div>
  );
};

// ============================================================================
// REUSABLE <CardAdBanner /> COMPONENT PLACED EXACTLY IN THE GAP BETWEEN TWO CARDS
// ============================================================================
export const CardAdBanner: React.FC<{
  slotId: AdSlotId;
  onOpenAdminSlot?: (slotId: AdSlotId) => void;
  className?: string;
}> = ({ slotId, onOpenAdminSlot, className = '' }) => {
  const { config } = useAdSystemConfig();
  const [imgError, setImgError] = useState(false);

  const slot = config.slots[slotId];
  useEffect(() => {
    setImgError(false);
  }, [slot?.imageUrl]);

  if (!slot) return null;

  const isSlotActive = config.masterEnabled && slot.enabled;

  // If slot is NOT active and Admin placeholder preview is OFF -> render nothing (100% clean UI)
  if (!isSlotActive && !config.showSlotPlaceholders) {
    return null;
  }

  // If slot is NOT active, but Admin turned ON "Show Slot Placeholders" to inspect card positions
  if (!isSlotActive && config.showSlotPlaceholders) {
    return (
      <div
        onClick={() => onOpenAdminSlot && onOpenAdminSlot(slotId)}
        className={`my-0.5 relative overflow-hidden rounded-2xl border-2 border-dashed border-[#FFD700]/60 bg-[#04220D]/90 px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:border-[#00FF66] transition-all ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-[10px] shrink-0">
            AD SLOT #{slot.cardNumber}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-display font-black text-[#FFD700] truncate">
              {slot.slotTitle}
            </div>
            <div className="text-[10px] text-emerald-200 truncate">
              {slot.slotBanglaDesc} (বর্তমানে বন্ধ আছে — অ্যাড বসাতে এখানে ক্লিক করুন)
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-[#00FF66] text-[#021A0A] font-display font-black text-[10px] shrink-0">
          + অ্যাড বসান
        </span>
      </div>
    );
  }

  const safeLink = formatSafeTargetUrl(slot.targetUrl);
  const heightCls = getHeightClass(slot.bannerHeight);

  // 1. SCRIPT / MONETAG / ADSENSE / ADSTERRA / HTML CODE BANNER (CENTERED IN INTER-CARD GAP)
  if (slot.adType === 'SCRIPT' && slot.scriptCode.trim()) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`my-0.5 w-full relative rounded-2xl overflow-hidden bg-[#031A0B] border border-[#00FF66]/55 shadow-[0_0_14px_rgba(0,255,102,0.2)] ${className}`}
      >
        <div className="flex items-center justify-between px-3 py-1 bg-[#021408] border-b border-[#00FF66]/25 text-[9px] text-emerald-300 font-semibold">
          <span className="uppercase tracking-wider text-[#FFD700] font-bold">
            {slot.sponsorLabel || 'SPONSORED • MONETAG'}
          </span>
          <span className="text-emerald-300 font-mono-num">
            Banner #{slot.cardNumber} • Zone 12011838
          </span>
        </div>
        <SafeScriptAdFrame
          scriptCode={slot.scriptCode}
          slotId={slot.slotId}
          cardNumber={slot.cardNumber}
          bannerHeight={slot.bannerHeight}
        />
      </div>
    );
  }

  // 2. IMAGE / GIF BANNER (UPLOADED OR URL)
  if (slot.adType === 'IMAGE' && slot.imageUrl.trim() && !imgError) {
    const BannerInner = (
      <div
        className={`group relative w-full rounded-2xl overflow-hidden bg-[#031C0B] border border-[#FFD700]/65 shadow-[0_0_18px_rgba(255,215,0,0.22)] transition-all hover:brightness-105 ${className}`}
      >
        {/* Top subtle Sponsored Pill */}
        <div className="absolute top-1.5 left-2 z-20 px-2 py-0.5 rounded bg-black/75 border border-[#FFD700]/60 text-[8px] font-display font-black text-[#FFD700] uppercase tracking-wider">
          {slot.sponsorLabel || 'SPONSORED'}
        </div>

        {safeLink && (
          <div className="absolute top-1.5 right-2 z-20 px-2 py-0.5 rounded bg-[#00FF66]/90 text-[#021A0A] text-[8px] font-display font-black flex items-center gap-0.5 shadow">
            <span>{slot.ctaText || 'Visit'}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </div>
        )}

        <div className={`w-full ${heightCls} overflow-hidden flex items-center justify-center bg-[#021508]`}>
          <img
            src={slot.imageUrl}
            alt={slot.headline || slot.slotTitle}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>

        {(slot.headline?.trim() || slot.subText?.trim()) && (
          <div className="px-3 py-1.5 bg-gradient-to-r from-[#04240E] via-[#073316] to-[#04240E] border-t border-[#00FF66]/30 flex items-center justify-between gap-2">
            <div className="min-w-0">
              {slot.headline && (
                <div className="text-xs font-display font-black text-[#FFD700] truncate">
                  {slot.headline}
                </div>
              )}
              {slot.subText && (
                <div className="text-[10px] text-emerald-100 truncate">{slot.subText}</div>
              )}
            </div>
            {safeLink && (
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                {slot.ctaText || 'দেখুন →'}
              </span>
            )}
          </div>
        )}
      </div>
    );

    if (safeLink) {
      return (
        <a
          href={safeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full no-underline"
        >
          {BannerInner}
        </a>
      );
    }
    return BannerInner;
  }

  // 3. PROMO / CUSTOM TEXT & BUTTON BANNER (OR FALLBACK WHEN IMAGE URL IS EMPTY/BROKEN)
  const PromoInner = (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062E14] via-[#0B3B2A] to-[#1F1135] border-[1.5px] border-[#FFD700]/80 px-3.5 py-3 shadow-[0_0_18px_rgba(0,255,102,0.24)] flex items-center justify-between gap-3 transition-all hover:brightness-105 ${className}`}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00F0FF]" />
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] p-0.5 shrink-0 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          <div className="w-full h-full rounded-[10px] bg-[#021A0A] flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-[#FFD700]" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#FFD700]/20 border border-[#FFD700]/60 text-[8px] font-display font-black text-[#FFD700] uppercase">
              {slot.sponsorLabel || 'SPONSORED'}
            </span>
            <span className="text-xs sm:text-sm font-display font-black text-white truncate">
              {slot.headline || slot.slotTitle}
            </span>
          </div>
          <p className="text-[11px] text-emerald-100 truncate mt-0.5">
            {slot.subText || 'অ্যাডমিন প্যানেল থেকে আপনার বিজ্ঞাপন ব্যানার বা লিংক যুক্ত করুন'}
          </p>
        </div>
      </div>

      <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFE54C] via-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-[11px] shrink-0 flex items-center gap-1 shadow-[0_0_12px_rgba(255,215,0,0.65)]">
        <span>{slot.ctaText || 'বিস্তারিত →'}</span>
        <ExternalLink className="w-3 h-3" />
      </span>
    </div>
  );

  if (safeLink) {
    return (
      <a
        href={safeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full no-underline"
      >
        {PromoInner}
      </a>
    );
  }

  return PromoInner;
};

// ============================================================================
// FULL ADMIN PANEL FOR AD BANNER MANAGEMENT (প্রতিটা কার্ডের নিচে অ্যাড সেটআপ)
// ============================================================================
export const AdminAdBannerPanel: React.FC<{
  onClose: () => void;
  initialFocusSlot?: AdSlotId | null;
}> = ({ onClose, initialFocusSlot = null }) => {
  const { config, setConfig } = useAdSystemConfig();
  const [draft, setDraft] = useState<GlobalAdSystemConfig>(() => config);
  const [selectedSlotId, setSelectedSlotId] = useState<AdSlotId>(
    initialFocusSlot || 'card_01_cricket'
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync when initialFocusSlot changes
  useEffect(() => {
    if (initialFocusSlot) {
      setSelectedSlotId(initialFocusSlot);
    }
  }, [initialFocusSlot]);

  const currentSlot = draft.slots[selectedSlotId] || draft.slots.card_01_cricket;

  const updateCurrentSlot = (patch: Partial<AdSlotItem>) => {
    setDraft((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [selectedSlotId]: {
          ...prev.slots[selectedSlotId],
          ...patch
        }
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateCurrentSlot({
          adType: 'IMAGE',
          imageUrl: reader.result,
          enabled: true
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async (customDraft?: GlobalAdSystemConfig, customToast?: string) => {
    setIsSaving(true);
    const toSave = customDraft || draft;
    const saved = await saveAdSystemConfigEverywhere(toSave);
    setDraft(saved);
    setConfig(saved);
    setIsSaving(false);
    setSaveMessage(
      customToast ||
        '✅ আলহামদুলিল্লাহ! অ্যাড ব্যানার সেটিংস সফলভাবে সেভ ও লাইভ করা হয়েছে!'
    );
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Copy current card's ad settings to ALL 13 card slots in 1 click
  const handleApplyCurrentToAllCards = async () => {
    const updatedSlots = { ...draft.slots };
    for (const meta of AD_SLOTS_META) {
      updatedSlots[meta.slotId] = {
        ...updatedSlots[meta.slotId],
        enabled: currentSlot.enabled,
        adType: currentSlot.adType,
        imageUrl: currentSlot.imageUrl,
        targetUrl: currentSlot.targetUrl,
        sponsorLabel: currentSlot.sponsorLabel,
        headline: currentSlot.headline,
        subText: currentSlot.subText,
        ctaText: currentSlot.ctaText,
        scriptCode: currentSlot.scriptCode,
        bannerHeight: currentSlot.bannerHeight
      };
    }
    const nextConfig: GlobalAdSystemConfig = {
      ...draft,
      masterEnabled: true,
      slots: updatedSlots
    };
    await handleSaveAll(
      nextConfig,
      '✅ বর্তমান অ্যাড ব্যানারটি সবগুলো কার্ডের নিচে একসাথে বসিয়ে সেভ করা হয়েছে!'
    );
  };

  // Enable Demo/Test Banner on all cards so Admin can test how all 13 slots look
  const handleEnableTestDemoAll = async () => {
    const updatedSlots = { ...draft.slots };
    for (const meta of AD_SLOTS_META) {
      updatedSlots[meta.slotId] = {
        ...updatedSlots[meta.slotId],
        enabled: true,
        adType: updatedSlots[meta.slotId].imageUrl
          ? 'IMAGE'
          : updatedSlots[meta.slotId].scriptCode
          ? 'SCRIPT'
          : 'PROMO',
        headline:
          updatedSlots[meta.slotId].headline ||
          `🔥 স্পনসর অ্যাড #${meta.cardNumber} — ${meta.slotTitle.split(':')[0]}`,
        subText:
          updatedSlots[meta.slotId].subText ||
          'অ্যাডমিন প্যানেল থেকে যেকোনো ছবি, লিংক বা AdSense/Adsterra কোড বসাতে পারবেন',
        ctaText: updatedSlots[meta.slotId].ctaText || 'এখনই দেখুন →'
      };
    }
    const nextConfig: GlobalAdSystemConfig = {
      ...draft,
      masterEnabled: true,
      slots: updatedSlots
    };
    await handleSaveAll(
      nextConfig,
      '🎉 সবগুলো কার্ডের নিচে ডেমো অ্যাড ব্যানার চালু করা হয়েছে! এখন হোম পেজে গিয়ে দেখুন।'
    );
  };

  // Turn OFF / Hide all ads in 1 click
  const handleDisableAllAds = async () => {
    const updatedSlots = { ...draft.slots };
    for (const meta of AD_SLOTS_META) {
      updatedSlots[meta.slotId] = {
        ...updatedSlots[meta.slotId],
        enabled: false
      };
    }
    const nextConfig: GlobalAdSystemConfig = {
      ...draft,
      showSlotPlaceholders: false,
      slots: updatedSlots
    };
    await handleSaveAll(
      nextConfig,
      '✅ সবগুলো কার্ডের নিচের অ্যাড ব্যানার হাইড (বন্ধ) করা হয়েছে!'
    );
  };

  const activeCount = AD_SLOTS_META.filter((m) => draft.slots[m.slotId]?.enabled).length;

  return (
    <div className="space-y-4 pb-10">
      {/* Top Admin Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#062E14] via-[#0B3B2A] to-[#240B36] border-2 border-[#FFD700] p-4 shadow-[0_0_25px_rgba(255,215,0,0.3)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] p-0.5 shadow-[0_0_15px_rgba(255,215,0,0.6)] shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#021A0A] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#FFD700]" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px]">
                  🛡️ ADMIN AD BANNER PANEL
                </span>
                <span className="px-2 py-0.5 rounded bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] font-mono-num font-bold text-[10px]">
                  সচল অ্যাড স্লট: {activeCount}/{AD_SLOTS_META.length}টি
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-display font-black text-white mt-0.5">
                প্রতিটা কার্ডের নিচে অ্যাড ব্যানার ম্যানেজমেন্ট সিস্টেম
              </h1>
              <p className="text-xs text-emerald-200">
                হোম পেজের প্রতিটি কার্ড (01–10) এবং Cricket, Football, Tennis পেজের নিচে ইমেজ ব্যানার, লিংক বা AdSense/Adsterra কোড বসান
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF00] via-[#22C55E] to-[#FFD700] text-[#021A0A] font-display font-black text-xs sm:text-sm shadow-[0_0_18px_rgba(0,255,0,0.5)] hover:brightness-110 cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>সেভ ও লাইভ করুন</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/60 text-white font-display font-bold text-xs hover:border-[#FFD700] cursor-pointer flex items-center gap-1"
            >
              <X className="w-4 h-4 text-[#FFD700]" />
              <span>হোমে ফিরুন</span>
            </button>
          </div>
        </div>

        {/* Global Quick Action Bar */}
        <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Master Switch */}
            <button
              type="button"
              onClick={() => {
                const next = { ...draft, masterEnabled: !draft.masterEnabled };
                handleSaveAll(
                  next,
                  next.masterEnabled
                    ? '✅ মাস্টার অ্যাড সুইচ চালু (ON) করা হয়েছে!'
                    : '⏸️ মাস্টার অ্যাড সুইচ সাময়িকভাবে বন্ধ (OFF) করা হয়েছে!'
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-black border flex items-center gap-1.5 cursor-pointer transition-all ${
                draft.masterEnabled
                  ? 'bg-[#00FF66] text-[#021A0A] border-white shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                  : 'bg-red-600/25 text-red-200 border-red-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>মাস্টার অ্যাড সিস্টেম: {draft.masterEnabled ? 'চালু (ON)' : 'বন্ধ (OFF)'}</span>
            </button>

            {/* Show/Hide Empty Slot Preview Boxes below every card */}
            <button
              type="button"
              onClick={() => {
                const next = {
                  ...draft,
                  showSlotPlaceholders: !draft.showSlotPlaceholders
                };
                handleSaveAll(
                  next,
                  next.showSlotPlaceholders
                    ? '👁️ প্রতিটি কার্ডের নিচে অ্যাড স্লট পজিশন প্রিভিউ বক্স চালু করা হয়েছে!'
                    : '✅ খালি অ্যাড স্লট প্রিভিউ বক্স হাইড করা হয়েছে (শুধু চালু থাকা অ্যাড দেখাবে)।'
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                draft.showSlotPlaceholders
                  ? 'bg-[#FFD700] text-[#021A0A] border-white'
                  : 'bg-[#021A0A] text-emerald-200 border-emerald-600/60 hover:border-[#FFD700]'
              }`}
            >
              {draft.showSlotPlaceholders ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              <span>
                {draft.showSlotPlaceholders
                  ? 'খালি স্লট প্রিভিউ: চালু আছে'
                  : 'কার্ডের নিচে স্লট পজিশন প্রিভিউ দেখুন'}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleEnableTestDemoAll}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer hover:brightness-110"
            >
              ⚡ ১ ক্লিকে সব কার্ডের নিচে টেস্ট অ্যাড চালু করুন
            </button>
            <button
              type="button"
              onClick={handleDisableAllAds}
              className="px-3 py-1.5 rounded-xl bg-rose-600/30 border border-rose-400 text-rose-100 font-display font-bold text-xs cursor-pointer hover:bg-rose-600/50 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>সব অ্যাড বন্ধ/হাইড করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Toast Banner */}
      {saveMessage && (
        <div className="rounded-2xl bg-[#0D4A1C] border-2 border-[#00FF66] px-4 py-3 text-xs sm:text-sm font-display font-black text-[#FFD700] flex items-center justify-between shadow-[0_0_20px_rgba(0,255,102,0.4)]">
          <span>{saveMessage}</span>
          <button onClick={() => setSaveMessage(null)} className="text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main 2-Column Layout: Left = All 13 Card Slots List | Right = Selected Card Ad Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: 13 Card Slots Selector + Individual ON/OFF Switches */}
        <div className="lg:col-span-5 bg-[#062910] border border-[#00FF66]/50 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
            <h2 className="text-xs sm:text-sm font-display font-black text-[#FFD700]">
              📋 কোন কার্ডের নিচে অ্যাড বসাবেন সিলেক্ট করুন (১–১৩):
            </h2>
            <span className="text-[10px] text-emerald-300">ক্লিক করে এডিট করুন</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {AD_SLOTS_META.map((meta) => {
              const item = draft.slots[meta.slotId];
              const isSelected = selectedSlotId === meta.slotId;
              const isOn = Boolean(item?.enabled);

              return (
                <div
                  key={meta.slotId}
                  onClick={() => setSelectedSlotId(meta.slotId)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0E4A1E] to-[#083014] border-2 border-[#FFD700] shadow-[0_0_14px_rgba(255,215,0,0.35)]'
                      : 'bg-[#031A0A] border-emerald-800/70 hover:border-[#00FF66]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono-num font-black text-xs flex items-center justify-center shrink-0 ${
                        isOn
                          ? 'bg-[#00FF66] text-[#021A0A]'
                          : 'bg-[#0A3516] text-[#FFD700] border border-[#FFD700]/40'
                      }`}
                    >
                      {meta.cardNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-display font-black text-white truncate">
                        {meta.slotTitle}
                      </div>
                      <div className="text-[10px] text-emerald-300 truncate">
                        ধরন: {item?.adType === 'IMAGE' ? '🖼️ Image Banner' : item?.adType === 'SCRIPT' ? '💻 Script/AdSense' : '✨ Promo Banner'}
                      </div>
                    </div>
                  </div>

                  {/* Quick ON/OFF Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextSlots = {
                        ...draft.slots,
                        [meta.slotId]: {
                          ...draft.slots[meta.slotId],
                          enabled: !isOn
                        }
                      };
                      const nextDraft = { ...draft, slots: nextSlots };
                      handleSaveAll(
                        nextDraft,
                        !isOn
                          ? `✅ ${meta.slotTitle} চালু (ON) করা হয়েছে!`
                          : `⏸️ ${meta.slotTitle} বন্ধ (OFF) করা হয়েছে!`
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg font-display font-black text-[10px] shrink-0 cursor-pointer border transition-all ${
                      isOn
                        ? 'bg-[#00FF66] text-[#021A0A] border-white shadow'
                        : 'bg-[#021407] text-emerald-300 border-emerald-700 hover:border-[#FFD700]'
                    }`}
                  >
                    {isOn ? '✔ চালু (ON)' : 'বন্ধ (OFF)'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Editor & Live Preview for Selected Card Slot */}
        <div className="lg:col-span-7 bg-[#062910] border-2 border-[#FFD700]/80 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Selected Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-xs">
                CARD #{currentSlot.cardNumber}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-display font-black text-[#FFD700]">
                  {currentSlot.slotTitle}
                </h3>
                <p className="text-[11px] text-emerald-200">{currentSlot.slotBanglaDesc}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateCurrentSlot({ enabled: !currentSlot.enabled })}
              className={`px-3.5 py-1.5 rounded-xl font-display font-black text-xs border-2 cursor-pointer transition-all ${
                currentSlot.enabled
                  ? 'bg-[#00FF66] text-[#021A0A] border-white shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                  : 'bg-[#021A0A] text-amber-300 border-amber-400/60'
              }`}
            >
              {currentSlot.enabled ? '🟢 এই কার্ডের অ্যাড চালু আছে (ON)' : '⚪ এই কার্ডের অ্যাড বন্ধ আছে (OFF)'}
            </button>
          </div>

          {/* Step 1: Choose Ad Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-bold text-[#FFD700]">
              ১. অ্যাডের ধরন সিলেক্ট করুন (Select Ad Format):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'IMAGE' as AdBannerType,
                  label: '🖼️ ইমেজ / GIF ব্যানার',
                  sub: 'ছবি আপলোড বা Image URL',
                  icon: ImageIcon
                },
                {
                  id: 'SCRIPT' as AdBannerType,
                  label: '💻 AdSense / Script কোড',
                  sub: 'HTML / JS / Adsterra / Iframe',
                  icon: Code2
                },
                {
                  id: 'PROMO' as AdBannerType,
                  label: '✨ প্রমো টেক্সট ব্যানার',
                  sub: 'টাইটেল, অফার ও বাটন লিংক',
                  icon: Sparkles
                }
              ].map((t) => {
                const IconComp = t.icon;
                const active = currentSlot.adType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateCurrentSlot({ adType: t.id, enabled: true })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#115E24] border-2 border-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                        : 'bg-[#021A0A] border-emerald-700/70 hover:border-[#00FF66]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-display font-black text-white">
                      <IconComp className="w-4 h-4 text-[#FFD700] shrink-0" />
                      <span className="truncate">{t.label}</span>
                    </div>
                    <div className="text-[10px] text-emerald-200 mt-0.5 truncate">{t.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Fields Based on Ad Type */}
          {currentSlot.adType === 'IMAGE' && (
            <div className="space-y-3 bg-[#031A0A] border border-emerald-700/60 rounded-xl p-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    মোবাইল বা কম্পিউটার থেকে ব্যানার ছবি আপলোড করুন:
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0A3818] border-2 border-dashed border-[#00FF66] text-xs font-display font-bold text-white cursor-pointer hover:bg-[#115224] transition-all">
                    <Upload className="w-4 h-4 text-[#FFD700]" />
                    <span>+ গ্যালারি থেকে ব্যানার ছবি নিন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    অথবা সরাসরি ব্যানার ছবির লিংক (Image/GIF URL) দিন:
                  </label>
                  <input
                    type="text"
                    value={currentSlot.imageUrl}
                    onChange={(e) =>
                      updateCurrentSlot({ imageUrl: e.target.value, enabled: true })
                    }
                    placeholder="https://example.com/ad-banner.jpg"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    অ্যাডে ক্লিক করলে কোন লিংকে যাবে (Target Website / WhatsApp URL):
                  </label>
                  <div className="relative flex items-center">
                    <LinkIcon className="w-3.5 h-3.5 text-[#00FF66] absolute left-3" />
                    <input
                      type="text"
                      value={currentSlot.targetUrl}
                      onChange={(e) => updateCurrentSlot({ targetUrl: e.target.value })}
                      placeholder="https://your-sponsor-link.com"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    ব্যানারের উচ্চতা (Banner Size / Height):
                  </label>
                  <select
                    value={currentSlot.bannerHeight}
                    onChange={(e) =>
                      updateCurrentSlot({ bannerHeight: e.target.value as AdBannerHeight })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="COMPACT_70">Compact Banner (72px)</option>
                    <option value="STANDARD_95">Standard Banner (95px — Recommended)</option>
                    <option value="LARGE_130">Large Banner (130px)</option>
                    <option value="AUTO">Auto Full Responsive Height</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    নিচের ক্যাপশন / হেডলাইন (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.headline}
                    onChange={(e) => updateCurrentSlot({ headline: e.target.value })}
                    placeholder="যেমন: ৫০% ডিসকাউন্ট চলছে!"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    বাটন টেক্সট (CTA Button):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.ctaText}
                    onChange={(e) => updateCurrentSlot({ ctaText: e.target.value })}
                    placeholder="বিস্তারিত দেখুন →"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {currentSlot.adType === 'SCRIPT' && (
            <div className="space-y-3 bg-[#031A0A] border border-emerald-700/60 rounded-xl p-3.5">
              <div>
                <label className="block text-xs font-bold text-[#FFD700] mb-1">
                  Google AdSense / Adsterra / Monetag / HTML &amp; Script কোড পেস্ট করুন:
                </label>
                <textarea
                  rows={5}
                  value={currentSlot.scriptCode}
                  onChange={(e) =>
                    updateCurrentSlot({ scriptCode: e.target.value, enabled: true })
                  }
                  placeholder={`<!-- এখানে আপনার AdSense, Adsterra বা কাস্টম HTML/Script কোড পেস্ট করুন -->\n<script async src="..."></script>\n<ins class="adsbygoogle" ...></ins>`}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-[#00FF66] font-mono focus:outline-none focus:border-[#FFD700]"
                />
                <p className="text-[11px] text-emerald-300 mt-1">
                  💡 টিপস: এই বক্সে যেকোনো <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code> বা AdSense কোড বসালে সেটি অটোমেটিক আইসোলেটেড কন্টেইনারে রান হবে, ফলে সাইটে কখনোই কোনো সমস্যা হবে না।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFD700] mb-1">
                  অ্যাড বক্সের উচ্চতা (Ad Container Height):
                </label>
                <select
                  value={currentSlot.bannerHeight}
                  onChange={(e) =>
                    updateCurrentSlot({ bannerHeight: e.target.value as AdBannerHeight })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                >
                  <option value="COMPACT_70">76px (Mobile Leaderboard 320x50 / 728x90)</option>
                  <option value="STANDARD_95">100px (Standard Banner)</option>
                  <option value="LARGE_130">136px (Large Banner)</option>
                  <option value="AUTO">Auto</option>
                </select>
              </div>
            </div>
          )}

          {currentSlot.adType === 'PROMO' && (
            <div className="space-y-3 bg-[#031A0A] border border-emerald-700/60 rounded-xl p-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    বিজ্ঞাপনের মূল টাইটেল (Headline):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.headline}
                    onChange={(e) =>
                      updateCurrentSlot({ headline: e.target.value, enabled: true })
                    }
                    placeholder="আপনার ব্র্যান্ড বা অফারের নাম"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    স্পনসর ট্যাগ (Sponsor Tag):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.sponsorLabel}
                    onChange={(e) => updateCurrentSlot({ sponsorLabel: e.target.value })}
                    placeholder="SPONSORED"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFD700] mb-1">
                  বিজ্ঞাপনের সাব-টেক্সট (Subtitle / Offer Details):
                </label>
                <input
                  type="text"
                  value={currentSlot.subText}
                  onChange={(e) => updateCurrentSlot({ subText: e.target.value })}
                  placeholder="যেমন: আজই অর্ডার করুন এবং বিশেষ ছাড় পান"
                  className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    টার্গেট লিংক (Target Link URL):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.targetUrl}
                    onChange={(e) => updateCurrentSlot({ targetUrl: e.target.value })}
                    placeholder="https://your-link.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">
                    বাটনের লেখা (Button Text):
                  </label>
                  <input
                    type="text"
                    value={currentSlot.ctaText}
                    onChange={(e) => updateCurrentSlot({ ctaText: e.target.value })}
                    placeholder="বিস্তারিত দেখুন →"
                    className="w-full px-3 py-2 rounded-xl bg-[#021407] border border-emerald-500/70 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Live Preview Box inside Admin Panel */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display font-bold text-[#FFD700]">
                👁️ কার্ডের নিচে এই অ্যাডটি যেমন দেখাবে (Live Preview):
              </span>
              <span className="text-[11px] text-emerald-300">
                স্ট্যাটাস: {currentSlot.enabled ? 'চালু (ON)' : 'বন্ধ (OFF)'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#021206] border border-emerald-800/80">
              {/* Render preview regardless of whether enabled is false so admin can see how it looks */}
              {(() => {
                const previewSlot = { ...currentSlot, enabled: true };
                const safeLink = formatSafeTargetUrl(previewSlot.targetUrl);
                if (previewSlot.adType === 'SCRIPT' && previewSlot.scriptCode.trim()) {
                  return (
                    <SafeScriptAdFrame
                      scriptCode={previewSlot.scriptCode}
                      slotId={previewSlot.slotId}
                      bannerHeight={previewSlot.bannerHeight}
                    />
                  );
                }
                if (previewSlot.adType === 'IMAGE' && previewSlot.imageUrl.trim()) {
                  return (
                    <div className="rounded-xl overflow-hidden border border-[#FFD700]/60 bg-[#031C0B]">
                      <img
                        src={previewSlot.imageUrl}
                        alt={previewSlot.headline}
                        className="w-full max-h-[120px] object-cover"
                      />
                    </div>
                  );
                }
                return (
                  <div className="rounded-xl bg-gradient-to-r from-[#062E14] via-[#0B3B2A] to-[#1F1135] border border-[#FFD700]/70 p-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-display font-black text-[#FFD700]">
                        {previewSlot.headline || previewSlot.slotTitle}
                      </div>
                      <div className="text-[11px] text-emerald-100 mt-0.5">
                        {previewSlot.subText}
                      </div>
                      {safeLink && (
                        <div className="text-[10px] text-[#00F0FF] mt-0.5 truncate">
                          🔗 {safeLink}
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                      {previewSlot.ctaText || 'বিস্তারিত →'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Step 4: Save This Card / Copy to All Cards Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSaveAll(
                  draft,
                  `✅ ${currentSlot.slotTitle} সফলভাবে সেভ ও আপডেট করা হয়েছে!`
                )
              }
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00FF00] via-[#22C55E] to-[#FFD700] text-[#021A0A] font-display font-black text-xs sm:text-sm shadow-[0_0_18px_rgba(0,255,0,0.45)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>এই কার্ডের অ্যাড সেভ করুন (Save Card #{currentSlot.cardNumber})</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCurrentToAllCards}
              className="py-3 px-3.5 rounded-xl bg-[#021A0A] border-2 border-[#00F0FF] text-[#00F0FF] font-display font-black text-xs hover:bg-[#062C36] cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>এই অ্যাড সব কার্ডের নিচে একসাথে বসান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
