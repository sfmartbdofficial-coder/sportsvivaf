import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  LogOut,
  Eye,
  EyeOff,
  Layers,
  Store,
  KeyRound,
  ExternalLink,
  Trash2,
  PlusCircle,
} from 'lucide-react';
import { AdminAdBannerPanel, AdSlotId } from './AdBannerSystem';
import { ShutkiAdminPanel } from './ShutkiAdminPanel';

export const SIMPLE_ADMIN_ADS_STORAGE_KEY = 'sfmart_admin_banners_v2';
export const SIMPLE_ADMIN_CRED_STORAGE_KEY = 'sfmart_admin_credentials_v1';
export const SIMPLE_ADMIN_SESSION_KEY = 'sfmart_admin_auth_session_v1';
export const SIMPLE_ADMIN_ADS_UPDATED_EVENT = 'sfmart-admin-banners-updated';

export const DEFAULT_MIDDLE_MONETAG_CODE = `<script src="https://nap5k.com/88/tag.min.js" data-zone="12011838" async data-cfasync="false"></script>`;
export const DEFAULT_MULTITAG_HEAD_CODE = '';

export interface SingleBannerSlotConfig {
  enabled: boolean;
  code: string;
  label: string;
  zoneTitle: string;
  directLinkUrl?: string;
  bannerImageUrl?: string;
}

export interface SimpleAdminBannersConfig {
  topBanner: SingleBannerSlotConfig;
  middleBanner: SingleBannerSlotConfig;
  bottomBanner: SingleBannerSlotConfig;
  globalHeadCode: string;
  globalHeadEnabled: boolean;
  extraCodeSlots: {
    id: string;
    title: string;
    code: string;
    enabled: boolean;
  }[];
  updatedAt: string;
}

export function getDefaultSimpleAdminBannersConfig(): SimpleAdminBannersConfig {
  return {
    topBanner: {
      enabled: true,
      code: DEFAULT_MIDDLE_MONETAG_CODE,
      label: 'SPONSORED • MONETAG',
      zoneTitle: 'Top Banner • Zone 12011838',
      directLinkUrl: '',
      bannerImageUrl: '',
    },
    middleBanner: {
      enabled: true,
      code: DEFAULT_MIDDLE_MONETAG_CODE,
      label: 'SPONSORED • MONETAG',
      zoneTitle: 'Banner #01 • Zone 12011838',
      directLinkUrl: '',
      bannerImageUrl: '',
    },
    bottomBanner: {
      enabled: true,
      code: DEFAULT_MIDDLE_MONETAG_CODE,
      label: 'SPONSORED • MONETAG',
      zoneTitle: 'Bottom Banner • Zone 12011838',
      directLinkUrl: '',
      bannerImageUrl: '',
    },
    globalHeadCode: '',
    globalHeadEnabled: false,
    extraCodeSlots: [],
    updatedAt: new Date().toLocaleTimeString(),
  };
}

export function normalizeSimpleAdminBannersConfig(raw: any): SimpleAdminBannersConfig {
  const defaults = getDefaultSimpleAdminBannersConfig();
  if (!raw || typeof raw !== 'object') return defaults;

  return {
    topBanner: {
      ...defaults.topBanner,
      ...(raw.topBanner || {}),
      enabled:
        typeof raw.topBanner?.enabled === 'boolean'
          ? raw.topBanner.enabled
          : defaults.topBanner.enabled,
      code: typeof raw.topBanner?.code === 'string' ? raw.topBanner.code : defaults.topBanner.code,
    },
    middleBanner: {
      ...defaults.middleBanner,
      ...(raw.middleBanner || {}),
      enabled:
        typeof raw.middleBanner?.enabled === 'boolean'
          ? raw.middleBanner.enabled
          : defaults.middleBanner.enabled,
      code:
        typeof raw.middleBanner?.code === 'string' && raw.middleBanner.code.trim().length > 0
          ? raw.middleBanner.code
          : defaults.middleBanner.code,
    },
    bottomBanner: {
      ...defaults.bottomBanner,
      ...(raw.bottomBanner || {}),
      enabled:
        typeof raw.bottomBanner?.enabled === 'boolean'
          ? raw.bottomBanner.enabled
          : defaults.bottomBanner.enabled,
      code:
        typeof raw.bottomBanner?.code === 'string'
          ? raw.bottomBanner.code
          : defaults.bottomBanner.code,
    },
    globalHeadCode:
      typeof raw.globalHeadCode === 'string' ? raw.globalHeadCode : defaults.globalHeadCode,
    globalHeadEnabled:
      typeof raw.globalHeadEnabled === 'boolean'
        ? raw.globalHeadEnabled
        : defaults.globalHeadEnabled,
    extraCodeSlots: Array.isArray(raw.extraCodeSlots) ? raw.extraCodeSlots : [],
    updatedAt: raw.updatedAt || defaults.updatedAt,
  };
}

export function loadSimpleAdminBannersConfig(): SimpleAdminBannersConfig {
  try {
    const raw = localStorage.getItem(SIMPLE_ADMIN_ADS_STORAGE_KEY);
    if (raw) {
      return normalizeSimpleAdminBannersConfig(JSON.parse(raw));
    }
  } catch {
    // ignore localStorage read errors
  }
  return getDefaultSimpleAdminBannersConfig();
}

export async function saveSimpleAdminBannersConfig(
  nextConfig: SimpleAdminBannersConfig
): Promise<SimpleAdminBannersConfig> {
  const normalized = normalizeSimpleAdminBannersConfig({
    ...nextConfig,
    updatedAt: new Date().toLocaleTimeString(),
  });

  try {
    localStorage.setItem(SIMPLE_ADMIN_ADS_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore quota errors
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SIMPLE_ADMIN_ADS_UPDATED_EVENT, { detail: normalized }));
  }

  // Also sync to /api/ads on the backend so server state stays updated
  try {
    const res = await fetch('/api/ads');
    const existing = res.ok ? await res.json() : null;
    const mergedServerConfig = {
      ...(existing?.config || {}),
      simpleAdminBanners: normalized,
    };
    await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: mergedServerConfig }),
    });
  } catch {
    // localStorage is primary fallback
  }

  return normalized;
}

export function useSimpleAdminBanners() {
  const [bannersConfig, setBannersConfig] = useState<SimpleAdminBannersConfig>(() =>
    loadSimpleAdminBannersConfig()
  );

  useEffect(() => {
    let mounted = true;

    // Check server /api/ads if localStorage hasn't been customized yet
    fetch('/api/ads')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data?.ok && data.config?.simpleAdminBanners) {
          const localRaw = localStorage.getItem(SIMPLE_ADMIN_ADS_STORAGE_KEY);
          if (!localRaw) {
            const normalized = normalizeSimpleAdminBannersConfig(data.config.simpleAdminBanners);
            setBannersConfig(normalized);
            try {
              localStorage.setItem(SIMPLE_ADMIN_ADS_STORAGE_KEY, JSON.stringify(normalized));
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(() => {});

    const handleCustomUpdate = (e: Event) => {
      const ce = e as CustomEvent<SimpleAdminBannersConfig>;
      if (ce.detail) {
        setBannersConfig(normalizeSimpleAdminBannersConfig(ce.detail));
      } else {
        setBannersConfig(loadSimpleAdminBannersConfig());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SIMPLE_ADMIN_ADS_STORAGE_KEY) {
        setBannersConfig(loadSimpleAdminBannersConfig());
      }
    };

    window.addEventListener(SIMPLE_ADMIN_ADS_UPDATED_EVENT, handleCustomUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      mounted = false;
      window.removeEventListener(SIMPLE_ADMIN_ADS_UPDATED_EVENT, handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return { bannersConfig, setBannersConfig };
}

/**
 * Safely executes any HTML + <script> code inside a live DOM container.
 * Recreates <script> elements via document.createElement('script') so external
 * and inline Monetag / Adsterra / Google AdSense scripts execute properly.
 */
export const LiveScriptContainer: React.FC<{
  htmlOrScriptCode: string;
  containerId: string;
}> = ({ htmlOrScriptCode, containerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const trimmed = (htmlOrScriptCode || '').trim();
    if (!trimmed) return;

    try {
      const temp = document.createElement('div');
      temp.innerHTML = trimmed;

      // Append non-script nodes first
      Array.from(temp.childNodes).forEach((node) => {
        if (node.nodeName.toLowerCase() !== 'script') {
          container.appendChild(node.cloneNode(true));
        }
      });

      // Recreate and execute every <script> tag
      const scripts = temp.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }
        container.appendChild(newScript);
      });
    } catch {
      container.innerHTML = trimmed;
    }
  }, [htmlOrScriptCode]);

  return <div id={containerId} ref={containerRef} className="w-full min-h-[4px]" />;
};

/**
 * Renders Top Banner, Middle Banner (between Cricket & Football), or Bottom Banner on Homepage
 */
export const HomepageSimpleBannerSlot: React.FC<{
  position: 'top' | 'middle' | 'bottom';
}> = ({ position }) => {
  const { bannersConfig } = useSimpleAdminBanners();

  const slot: SingleBannerSlotConfig =
    position === 'top'
      ? bannersConfig.topBanner
      : position === 'middle'
      ? bannersConfig.middleBanner
      : bannersConfig.bottomBanner;

  const hasCode = Boolean(slot?.code && slot.code.trim().length > 0);
  const hasImageOrLink = Boolean(
    (slot?.bannerImageUrl && slot.bannerImageUrl.trim().length > 0) ||
      (slot?.directLinkUrl && slot.directLinkUrl.trim().length > 0)
  );

  if (!slot?.enabled || (!hasCode && !hasImageOrLink)) {
    return null;
  }

  const containerId =
    position === 'middle' ? 'monetag-banner-01' : `monetag-banner-${position}`;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        margin: '16px 0',
        padding: '8px',
        border: '1px solid rgba(234,179,8,0.3)',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#9ca3af',
          padding: '0 8px',
          marginBottom: '4px',
        }}
      >
        <span>{slot.label || 'SPONSORED • MONETAG'}</span>
        <span>
          {slot.zoneTitle ||
            (position === 'top'
              ? 'Top Banner'
              : position === 'middle'
              ? 'Banner #01 • Zone 1209775'
              : 'Bottom Banner')}
        </span>
      </div>

      {/* Optional clickable banner image / direct link if configured */}
      {hasImageOrLink && (
        <a
          href={slot.directLinkUrl?.trim() || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-1 rounded-lg overflow-hidden border border-[#FFD700]/40 bg-[#04240D] hover:brightness-110 transition-all"
        >
          {slot.bannerImageUrl?.trim() ? (
            <img
              src={slot.bannerImageUrl.trim()}
              alt={slot.zoneTitle}
              referrerPolicy="no-referrer"
              className="w-full max-h-[110px] object-cover block"
            />
          ) : (
            <div className="px-3 py-2 flex items-center justify-between text-xs font-bold text-[#FFD700]">
              <span>🔥 Special Sponsored Offer — Click to View</span>
              <span className="px-2 py-0.5 rounded bg-[#00FF66] text-[#021A0A] text-[10px] font-black">
                OPEN →
              </span>
            </div>
          )}
        </a>
      )}

      {/* Live Script / HTML container */}
      {hasCode && <LiveScriptContainer htmlOrScriptCode={slot.code} containerId={containerId} />}
    </div>
  );
};

/**
 * Injects Global Head/Body Ad Codes & Extra Code Slots across the app
 */
export const GlobalSimpleAdminScripts: React.FC = () => {
  const { bannersConfig } = useSimpleAdminBanners();

  return (
    <div className="hidden">
      {bannersConfig.globalHeadEnabled && bannersConfig.globalHeadCode?.trim() && (
        <LiveScriptContainer
          htmlOrScriptCode={bannersConfig.globalHeadCode}
          containerId="sfmart-global-ad-code"
        />
      )}
      {(bannersConfig.extraCodeSlots || []).map((item) =>
        item.enabled && item.code?.trim() ? (
          <LiveScriptContainer
            key={item.id}
            htmlOrScriptCode={item.code}
            containerId={`sfmart-extra-code-${item.id}`}
          />
        ) : null
      )}
    </div>
  );
};

// ============================================================================
// MAIN /admin PANEL WITH USERNAME: sfmart & PASSWORD: 123456
// ============================================================================
export const SimpleAdminPanel: React.FC<{
  onBackToHome: () => void;
  initialFocusSlot?: AdSlotId | null;
}> = ({ onBackToHome, initialFocusSlot = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIMPLE_ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Saved custom credentials (in addition to default sfmart / 123456)
  const [savedCreds, setSavedCreds] = useState<{ username: string; password: string }>(() => {
    try {
      const raw = localStorage.getItem(SIMPLE_ADMIN_CRED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.username && parsed?.password) return parsed;
      }
    } catch {
      // ignore
    }
    return { username: 'sfmart', password: '123456' };
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'THREE_BANNERS' | 'ALL_CARD_SLOTS' | 'FULL_STORE_ADMIN' | 'CREDENTIALS'
  >(initialFocusSlot ? 'ALL_CARD_SLOTS' : 'THREE_BANNERS');

  const [config, setConfig] = useState<SimpleAdminBannersConfig>(() =>
    loadSimpleAdminBannersConfig()
  );
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);

  // Credential update inputs
  const [newUsername, setNewUsername] = useState(savedCreds.username);
  const [newPassword, setNewPassword] = useState(savedCreds.password);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    window.setTimeout(() => setSaveToast(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    const isDefaultMatch =
      (u === 'sfmart' ||
        u === 'admin' ||
        u === 'sfmartbd' ||
        u === 'sfmartbd.official@gmail.com') &&
      (p === '123456' || p === '1234' || p === 'sfmart123');

    const isCustomMatch =
      u === savedCreds.username.trim().toLowerCase() && p === savedCreds.password.trim();

    if (isDefaultMatch || isCustomMatch) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(SIMPLE_ADMIN_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
      triggerToast('✅ এডমিন প্যানেলে স্বাগতম! (Logged in successfully)');
    } else {
      setLoginError('ভুল ইউজারনেম বা পাসওয়ার্ড! সঠিক তথ্য দিন (Username: sfmart | Password: 123456)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SIMPLE_ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const handleSaveAllBanners = async () => {
    const saved = await saveSimpleAdminBannersConfig(config);
    setConfig(saved);
    triggerToast('✅ সব ব্যানার ও অ্যাড কোড সফলভাবে localStorage ও হোমপেজে সেভ হয়েছে!');
  };

  const handleAddExtraSlot = () => {
    setConfig((prev) => ({
      ...prev,
      extraCodeSlots: [
        ...(prev.extraCodeSlots || []),
        {
          id: String(Date.now()),
          title: `Extra Ad Code #${(prev.extraCodeSlots?.length || 0) + 1}`,
          code: '',
          enabled: true,
        },
      ],
    }));
  };

  const handleRemoveExtraSlot = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      extraCodeSlots: (prev.extraCodeSlots || []).filter((item) => item.id !== id),
    }));
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;
    const next = { username: newUsername.trim(), password: newPassword.trim() };
    setSavedCreds(next);
    try {
      localStorage.setItem(SIMPLE_ADMIN_CRED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    triggerToast('✅ নতুন ইউজারনেম ও পাসওয়ার্ড সেভ হয়েছে! (sfmart / 123456 এবং নতুন পাসওয়ার্ড দুটিই কাজ করবে)');
  };

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://sfmartbd.com';
  const directAdminUrl = `${origin}/admin`;
  const hashAdminUrl = `${origin}/#/admin`;

  const copyLink = (url: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLinkType(type);
      setTimeout(() => setCopiedLinkType(null), 2500);
    }
  };

  // ==========================================================================
  // 1. LOGIN VIEW (/admin)
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#021A0A] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#062E12] via-[#041F0C] to-[#021407] border-2 border-[#FFD700] p-6 sm:p-7 shadow-[0_0_35px_rgba(0,255,102,0.3)] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-[#021A0A] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-black text-white">
                  Admin Panel <span className="text-[#FFD700]">Login</span>
                </h1>
                <p className="text-xs text-emerald-300">
                  Route: <code className="text-[#FFD700] font-mono">/admin</code> • Monetag &amp; Site Control
                </p>
              </div>
            </div>
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-200 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>হোমপেজ</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                Username (ইউজারনেম)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#FFD700] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="sfmart"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#021408] border border-emerald-500/50 text-white text-sm font-semibold focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                Password (পাসওয়ার্ড)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#FFD700] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#021408] border border-emerald-500/50 text-white text-sm font-semibold focus:outline-none focus:border-[#FFD700]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200 font-semibold">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-sm shadow-[0_0_20px_rgba(0,255,102,0.45)] hover:brightness-110 transition-all cursor-pointer"
            >
              🔓 এডমিন প্যানেলে প্রবেশ করুন (Login)
            </button>
          </form>

          <div className="p-3 rounded-xl bg-[#021408]/90 border border-[#FFD700]/30 text-[11px] text-emerald-200 space-y-1">
            <div className="font-bold text-[#FFD700]">📌 সরাসরি এডমিন লিংক:</div>
            <div className="font-mono text-white break-all">{directAdminUrl}</div>
            <div className="text-emerald-300/80">
              ডিফল্ট লগইন — Username: <strong className="text-white">sfmart</strong> | Password:{' '}
              <strong className="text-white">123456</strong> (আগের পাসওয়ার্ড/পিন <strong className="text-white">1234</strong>-ও কাজ করবে)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user switched to Full Store Admin tab
  if (activeTab === 'FULL_STORE_ADMIN') {
    return (
      <div className="min-h-screen bg-[#021A0A]">
        <div className="sticky top-0 z-50 bg-[#04280D] border-b border-[#FFD700] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('THREE_BANNERS')}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← ৩ ব্যানার ও কোড ম্যানেজারে ফিরে যান</span>
          </button>
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
          >
            হোমপেজ দেখুন →
          </button>
        </div>
        <ShutkiAdminPanel onBackToMainApp={() => setActiveTab('THREE_BANNERS')} />
      </div>
    );
  }

  // ==========================================================================
  // 2. LOGGED-IN ADMIN DASHBOARD (/admin)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#021A0A] text-white pb-20">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#063815] border-2 border-[#00FF66] text-[#FFD700] px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,255,102,0.5)] text-xs sm:text-sm font-display font-black flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00FF66] shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Sticky Admin Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#04280D] via-[#063414] to-[#04280D] border-b-2 border-[#FFD700]/70 px-3 sm:px-6 py-3 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] p-0.5">
              <div className="w-full h-full rounded-[10px] bg-[#021A0A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-lg font-display font-black text-white">
                  SFMart <span className="text-[#FFD700]">Admin Panel</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-[10px] font-mono font-bold">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Top Banner • Middle Banner (Cricket &amp; Football) • Bottom Banner • All Codes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAllBanners}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 shadow-[0_0_14px_rgba(0,255,102,0.45)] hover:brightness-110 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save All Ads</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>হোমপেজ দেখুন</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-2.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 space-y-5">
        {/* Direct Admin Links Banner so user always has their dedicated link */}
        <div className="rounded-2xl bg-gradient-to-r from-[#062C12] via-[#07361B] to-[#1A1032] border border-[#FFD700]/70 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-display font-black text-[#FFD700] flex items-center gap-1.5">
              <span>🔗 আপনার এডমিন প্যানেলের আলাদা ডাইরেক্ট লিংক (যেকোনো ব্রাউজার থেকে ঢোকার জন্য):</span>
            </div>
            <div className="text-xs text-emerald-100 flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-black/50 border border-emerald-500/40 font-mono text-[#00FF66]">
                {directAdminUrl}
              </span>
              <span className="text-emerald-300">অথবা</span>
              <span className="px-2 py-0.5 rounded bg-black/50 border border-amber-500/40 font-mono text-[#FFD700]">
                {hashAdminUrl}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyLink(directAdminUrl, 'direct')}
              className="px-3 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLinkType === 'direct' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>/admin লিংক কপি করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('THREE_BANNERS')}
            className={`px-4 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'THREE_BANNERS'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                : 'bg-[#05260E] border border-emerald-500/40 text-emerald-200 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>১. ৩টি মেইন ব্যানার ও সব কোড (Top • Middle • Bottom)</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_CARD_SLOTS')}
            className={`px-4 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'ALL_CARD_SLOTS'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                : 'bg-[#05260E] border border-emerald-500/40 text-emerald-200 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>২. সব ১৩টি কার্ডের ব্যানার স্লট</span>
          </button>

          <button
            onClick={() => setActiveTab('FULL_STORE_ADMIN')}
            className="px-4 py-2.5 rounded-xl bg-[#05260E] border border-emerald-500/40 text-emerald-200 hover:text-white font-display font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <Store className="w-4 h-4 text-[#FFD700]" />
            <span>৩. স্টোর, অর্ডার ও পেমেন্ট ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`px-4 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'CREDENTIALS'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A]'
                : 'bg-[#05260E] border border-emerald-500/40 text-emerald-200 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>৪. নাম ও পাসওয়ার্ড পরিবর্তন</span>
          </button>
        </div>

        {/* ====================================================================
            TAB 1: 3 MAIN BANNER SLOTS (TOP, MIDDLE, BOTTOM) + GLOBAL CODE
           ==================================================================== */}
        {activeTab === 'THREE_BANNERS' && (
          <div className="space-y-5">
            {/* 1. TOP BANNER */}
            <div className="rounded-2xl bg-[#04220D] border-2 border-[#00FF66]/60 p-4 sm:p-5 space-y-3.5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#00FF66] text-[#021A0A] font-display font-black text-[11px]">
                    SLOT #1 • TOP BANNER
                  </span>
                  <h2 className="text-base sm:text-lg font-display font-black text-white mt-1">
                    ১. Top Banner (হোমপেজের একদম উপরে)
                  </h2>
                  <p className="text-xs text-emerald-200">
                    হোমপেজের শুরুতে Cricket কার্ডের উপরে এই ব্যানার কোডটি শো করবে
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none bg-[#021408] px-3 py-1.5 rounded-xl border border-emerald-500/40">
                  <input
                    type="checkbox"
                    checked={config.topBanner.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        topBanner: { ...prev.topBanner, enabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-[#00FF66]"
                  />
                  <span className="text-xs font-bold text-[#00FF66]">
                    {config.topBanner.enabled ? 'চালু আছে (Enabled)' : 'বন্ধ আছে (Disabled)'}
                  </span>
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#FFD700]">
                    Monetag / Ad Script / HTML Code পেস্ট করুন:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        topBanner: { ...prev.topBanner, code: DEFAULT_MIDDLE_MONETAG_CODE },
                      }))
                    }
                    className="text-[11px] text-[#00FF66] hover:underline font-semibold cursor-pointer"
                  >
                    + Default Monetag স্ক্রিপ্ট বসান
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={config.topBanner.code}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      topBanner: { ...prev.topBanner, code: e.target.value },
                    }))
                  }
                  placeholder={`এখানে আপনার Top Banner-এর Monetag কোড বা <script>...</script> পেস্ট করুন...`}
                  className="w-full p-3 rounded-xl bg-[#021206] border border-emerald-500/50 text-emerald-100 font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Direct Link URL (ঐচ্ছিক - ক্লিক করলে যে লিংকে যাবে):
                  </label>
                  <input
                    type="text"
                    value={config.topBanner.directLinkUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        topBanner: { ...prev.topBanner, directLinkUrl: e.target.value },
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    ব্যানার ছবির লিংক / Image URL (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={config.topBanner.bannerImageUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        topBanner: { ...prev.topBanner, bannerImageUrl: e.target.value },
                      }))
                    }
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. MIDDLE BANNER (BETWEEN CRICKET AND FOOTBALL) */}
            <div className="rounded-2xl bg-[#04220D] border-2 border-[#FFD700] p-4 sm:p-5 space-y-3.5 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FFD700] text-[#021A0A] font-display font-black text-[11px]">
                    SLOT #2 • MIDDLE BANNER (CRICKET &amp; FOOTBALL-এর মাঝখানে)
                  </span>
                  <h2 className="text-base sm:text-lg font-display font-black text-white mt-1">
                    ২. Middle Banner (Between CRICKET and FOOTBALL)
                  </h2>
                  <p className="text-xs text-emerald-200">
                    CRICKET কার্ড শেষ হওয়ার পর এবং FOOTBALL কার্ড শুরু হওয়ার ঠিক আগে এই ব্যানারটি শো করবে (Zone 1209775)
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none bg-[#021408] px-3 py-1.5 rounded-xl border border-[#FFD700]/50">
                  <input
                    type="checkbox"
                    checked={config.middleBanner.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        middleBanner: { ...prev.middleBanner, enabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-[#FFD700]"
                  />
                  <span className="text-xs font-bold text-[#FFD700]">
                    {config.middleBanner.enabled ? 'চালু আছে (Enabled)' : 'বন্ধ আছে (Disabled)'}
                  </span>
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#FFD700]">
                    Monetag / Ad Script / HTML Code পেস্ট করুন:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        middleBanner: { ...prev.middleBanner, code: DEFAULT_MIDDLE_MONETAG_CODE },
                      }))
                    }
                    className="text-[11px] text-[#00FF66] hover:underline font-semibold cursor-pointer"
                  >
                    + Zone 1209775 কোড রিস্টোর করুন
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={config.middleBanner.code}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      middleBanner: { ...prev.middleBanner, code: e.target.value },
                    }))
                  }
                  placeholder={`<script src="https://nap5k.com/tag.min.js" data-zone="1209775" async data-cfasync="false"></script>`}
                  className="w-full p-3 rounded-xl bg-[#021206] border border-[#FFD700]/60 text-emerald-100 font-mono text-xs focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Direct Link URL (ঐচ্ছিক - ক্লিক করলে যে লিংকে যাবে):
                  </label>
                  <input
                    type="text"
                    value={config.middleBanner.directLinkUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        middleBanner: { ...prev.middleBanner, directLinkUrl: e.target.value },
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    ব্যানার ছবির লিংক / Image URL (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={config.middleBanner.bannerImageUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        middleBanner: { ...prev.middleBanner, bannerImageUrl: e.target.value },
                      }))
                    }
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. BOTTOM BANNER */}
            <div className="rounded-2xl bg-[#04220D] border-2 border-[#00F0FF]/60 p-4 sm:p-5 space-y-3.5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#00F0FF] text-[#021A0A] font-display font-black text-[11px]">
                    SLOT #3 • BOTTOM BANNER
                  </span>
                  <h2 className="text-base sm:text-lg font-display font-black text-white mt-1">
                    ৩. Bottom Banner (হোমপেজের নিচে)
                  </h2>
                  <p className="text-xs text-emerald-200">
                    হোমপেজের নিচে ফুটারের ঠিক উপরে এই ব্যানার কোডটি শো করবে
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none bg-[#021408] px-3 py-1.5 rounded-xl border border-cyan-500/40">
                  <input
                    type="checkbox"
                    checked={config.bottomBanner.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bottomBanner: { ...prev.bottomBanner, enabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-[#00F0FF]"
                  />
                  <span className="text-xs font-bold text-[#00F0FF]">
                    {config.bottomBanner.enabled ? 'চালু আছে (Enabled)' : 'বন্ধ আছে (Disabled)'}
                  </span>
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#FFD700]">
                    Monetag / Ad Script / HTML Code পেস্ট করুন:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        bottomBanner: { ...prev.bottomBanner, code: DEFAULT_MIDDLE_MONETAG_CODE },
                      }))
                    }
                    className="text-[11px] text-[#00FF66] hover:underline font-semibold cursor-pointer"
                  >
                    + Default Monetag স্ক্রিপ্ট বসান
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={config.bottomBanner.code}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      bottomBanner: { ...prev.bottomBanner, code: e.target.value },
                    }))
                  }
                  placeholder={`এখানে আপনার Bottom Banner-এর Monetag কোড বা <script>...</script> পেস্ট করুন...`}
                  className="w-full p-3 rounded-xl bg-[#021206] border border-cyan-500/50 text-emerald-100 font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Direct Link URL (ঐচ্ছিক - ক্লিক করলে যে লিংকে যাবে):
                  </label>
                  <input
                    type="text"
                    value={config.bottomBanner.directLinkUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bottomBanner: { ...prev.bottomBanner, directLinkUrl: e.target.value },
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    ব্যানার ছবির লিংক / Image URL (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={config.bottomBanner.bannerImageUrl || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bottomBanner: { ...prev.bottomBanner, bannerImageUrl: e.target.value },
                      }))
                    }
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#021206] border border-emerald-500/40 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. ALL EXTRA / GLOBAL CODES (MultiTag, Popunder, In-Page Push, Analytics, etc.) */}
            <div className="rounded-2xl bg-[#1A0926] border-2 border-[#FF2E93]/70 p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FF2E93] text-white font-display font-black text-[11px]">
                    GLOBAL &amp; EXTRA CODES • সব ধরনের কোড বসানোর ঘর
                  </span>
                  <h2 className="text-base sm:text-lg font-display font-black text-white mt-1">
                    ৪. Global Auto-Ad / Popunder / MultiTag / মেটা ও ভেরিফিকেশন কোড
                  </h2>
                  <p className="text-xs text-pink-200">
                    আপনার যত রকমের এক্সট্রা কোড (Monetag Popunder, In-Page Push, Vignette, Adsterra Social Bar ইত্যাদি) আছে, সব এখানে বসাতে পারবেন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddExtraSlot}
                  className="px-3 py-1.5 rounded-xl bg-[#FF2E93] text-white font-display font-black text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ নতুন কোড বক্স যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#FFD700]">
                  মেইন গ্লোবাল স্ক্রিপ্ট কোড (পুরো সাইটে অটোমেটিক চলবে):
                </label>
                <textarea
                  rows={4}
                  value={config.globalHeadCode}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, globalHeadCode: e.target.value }))
                  }
                  placeholder={`এখানে যেকোনো গ্লোবাল <script>...</script> কোড পেস্ট করুন...`}
                  className="w-full p-3 rounded-xl bg-[#0D0414] border border-pink-500/50 text-pink-100 font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Dynamic Extra Code Slots */}
              {(config.extraCodeSlots || []).map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-xl bg-[#0D0414] border border-pink-500/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={slot.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          extraCodeSlots: prev.extraCodeSlots.map((it) =>
                            it.id === slot.id ? { ...it, title: val } : it
                          ),
                        }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black/50 border border-pink-500/40 text-xs font-bold text-[#FFD700]"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-emerald-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.enabled}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setConfig((prev) => ({
                              ...prev,
                              extraCodeSlots: prev.extraCodeSlots.map((it) =>
                                it.id === slot.id ? { ...it, enabled: checked } : it
                              ),
                            }));
                          }}
                        />
                        <span>Active</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraSlot(slot.id)}
                        className="p-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={slot.code}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        extraCodeSlots: prev.extraCodeSlots.map((it) =>
                          it.id === slot.id ? { ...it, code: val } : it
                        ),
                      }));
                    }}
                    placeholder={`Extra Code #${idx + 1} পেস্ট করুন...`}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-pink-500/30 text-pink-100 font-mono text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Sticky/Large Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveAllBanners}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-base shadow-[0_0_25px_rgba(0,255,102,0.5)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>💾 SAVE ALL ADS TO LOCALSTORAGE &amp; HOMEPAGE (সব কোড সেভ করুন)</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: ALL 13 INDIVIDUAL CARD SLOTS MANAGER
           ==================================================================== */}
        {activeTab === 'ALL_CARD_SLOTS' && (
          <AdminAdBannerPanel
            initialFocusSlot={initialFocusSlot}
            onClose={() => setActiveTab('THREE_BANNERS')}
          />
        )}

        {/* ====================================================================
            TAB 4: ADMIN USERNAME & PASSWORD SETTINGS
           ==================================================================== */}
        {activeTab === 'CREDENTIALS' && (
          <div className="max-w-lg rounded-2xl bg-[#04220D] border-2 border-[#FFD700] p-5 space-y-4">
            <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700]">
              🔐 এডমিন প্যানেলের ইউজারনেম ও পাসওয়ার্ড সেটিংস
            </h2>
            <p className="text-xs text-emerald-200">
              ডিফল্ট ইউজারনেম <strong className="text-white">sfmart</strong> এবং পাসওয়ার্ড{' '}
              <strong className="text-white">123456</strong> সবসময় সচল থাকবে। এর পাশাপাশি আপনি চাইলে নিচে নিজের পছন্দমতো ইউজারনেম ও পাসওয়ার্ড সেট করে রাখতে পারেন।
            </p>
            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">
                  Username (ইউজারনেম):
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#021206] border border-emerald-500/50 text-sm text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">
                  Password (পাসওয়ার্ড):
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#021206] border border-emerald-500/50 text-sm text-white font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                ✅ ইউজারনেম ও পাসওয়ার্ড সেভ করুন
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
