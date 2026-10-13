import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Plus,
  ShoppingCart,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  X,
  ShoppingBag,
  Users,
  Sparkles,
  HelpCircle,
  List
} from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS FOR 100% SCREENSHOT-ACCURATE LUDO KING APP
// ============================================================================
// Note: In Screenshot 4, the 4 quadrants are:
// Bottom-Left = BLUE (Player 1), Top-Left = RED (Player 2), Top-Right = GREEN (Player 3), Bottom-Right = YELLOW (Player 4)
export type LudoColor = 'BLUE' | 'RED' | 'GREEN' | 'YELLOW';
export type LudoMainMode =
  | 'ONLINE'
  | 'TEAM_UP'
  | 'FRIENDS'
  | 'COMPUTER'
  | 'PASS_N_PLAY'
  | 'TOURNAMENT'
  | 'SEVEN_UP'
  | 'SNAKES';
export type LudoGameType = 'CLASSIC' | 'TEAM_UP' | 'QUICK';
export type LudoBottomTab = 'HOME' | 'EVENT' | 'ADDA' | 'INVENTORY' | 'SOCIAL';

const ENTRY_POINT_TIERS = [10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000, 5000];

// Rich Pool of Realistic Random Opponent Names (Includes Screenshot Names + Realistic Names)
const LUDO_RANDOM_PLAYER_POOL = [
  'AshNero',
  'BeeFuzzy',
  'Anggabtr',
  'Tanvir Ahmed',
  'Rakib Hasan',
  'Nusrat Jahan',
  'Sabbir Hossain',
  'Arafat Islam',
  'Mehedi Hasan',
  'Farhana Akter',
  'Mahmudul H.',
  'Tahmid Khan',
  'Sadia Afrin',
  'Rifat Chowdhury',
  'Jannatul F.',
  'Imran Kabir',
  'Nayeem R.',
  'Sumaiya Mim',
  'Zahidul Islam',
  'Tawsif Mahbub'
];

const pickDistinctRandomOpponents = (): { GREEN: string; YELLOW: string; BLUE: string } => {
  const shuffled = [...LUDO_RANDOM_PLAYER_POOL].sort(() => Math.random() - 0.5);
  return {
    GREEN: shuffled[0] || 'AshNero',
    YELLOW: shuffled[1] || 'Anggabtr',
    BLUE: shuffled[2] || 'BeeFuzzy'
  };
};

// High-Detail Custom SVG Avatars Matching Screenshot 1 & Screenshot 2 (Sunglasses Guy, Red Rose, White Silhouette)
const LudoSquareAvatar: React.FC<{
  variant: 'SUNGLASSES' | 'ROSE' | 'SILHOUETTE';
  className?: string;
}> = ({ variant, className = 'w-12 h-12' }) => {
  if (variant === 'ROSE') {
    return (
      <div className={`relative overflow-hidden bg-[#052E16] select-none ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" fill="#042613" />
          {/* Green Rose Leaves */}
          <ellipse cx="26" cy="76" rx="22" ry="12" transform="rotate(-30 26 76)" fill="#15803D" />
          <ellipse cx="74" cy="76" rx="22" ry="12" transform="rotate(30 74 76)" fill="#166534" />
          <ellipse cx="24" cy="28" rx="18" ry="10" transform="rotate(25 24 28)" fill="#14532D" />
          <ellipse cx="76" cy="28" rx="18" ry="10" transform="rotate(-25 76 28)" fill="#15803D" />
          {/* Outer Rose Petals */}
          <circle cx="50" cy="50" r="34" fill="#991B1B" />
          <circle cx="44" cy="46" r="29" fill="#DC2626" />
          <circle cx="56" cy="52" r="27" fill="#EF4444" />
          <circle cx="48" cy="54" r="22" fill="#F87171" />
          <circle cx="52" cy="46" r="18" fill="#DC2626" />
          <circle cx="50" cy="50" r="12" fill="#FB7185" />
          <path
            d="M42 48 C46 38, 58 40, 56 50 C54 58, 42 56, 46 46"
            fill="none"
            stroke="#FECDD3"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'SILHOUETTE') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-200 via-white to-slate-300 select-none ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="silBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#silBg)" />
          <line x1="0" y1="80" x2="100" y2="20" stroke="#FFFFFF" strokeWidth="12" opacity="0.6" />
          {/* Head & Shoulders Silhouette */}
          <path
            d="M16 98 C16 74, 34 68, 50 68 C66 68, 84 74, 84 98 Z"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="2.5"
          />
          <rect x="42" y="56" width="16" height="14" rx="5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <ellipse cx="50" cy="38" rx="18" ry="22" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
        </svg>
      </div>
    );
  }

  // Default: 'SUNGLASSES' (DravoVega / AshNero Portrait with Aviator Sunglasses & Colorful Jacket)
  return (
    <div className={`relative overflow-hidden bg-[#0891B2] select-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Teal Geometric Background */}
        <rect width="100" height="100" fill="#06B6D4" />
        <polygon points="0,0 100,0 65,100 0,100" fill="#0891B2" />
        <line x1="10" y1="0" x2="95" y2="100" stroke="#67E8F9" strokeWidth="2" opacity="0.4" />
        {/* Colorful Pink/Orange/Gold Jacket & Gold Chain */}
        <path d="M10 100 C14 73, 32 68, 50 68 C68 68, 86 73, 90 100 Z" fill="#DB2777" />
        <path d="M22 100 L38 70 L50 100 Z" fill="#F59E0B" />
        <path d="M78 100 L62 70 L50 100 Z" fill="#EC4899" />
        <path d="M36 74 Q50 92 64 74" fill="none" stroke="#FDE047" strokeWidth="4" strokeDasharray="4 2" />
        {/* Neck & Bald Head */}
        <rect x="40" y="55" width="20" height="18" rx="6" fill="#C27849" />
        <ellipse cx="50" cy="39" rx="20" ry="24" fill="#D98A59" />
        {/* Beard Stubble */}
        <path d="M31 44 C32 58, 42 63, 50 63 C58 63, 68 58, 69 44 C66 53, 58 56, 50 56 C42 56, 34 53, 31 44 Z" fill="#431407" opacity="0.75" />
        <path d="M43 52 Q50 50 57 52" stroke="#270902" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Dark Aviator Sunglasses */}
        <rect x="31" y="30" width="16" height="11" rx="3.5" fill="#090D16" stroke="#FACC15" strokeWidth="1.5" />
        <rect x="53" y="30" width="16" height="11" rx="3.5" fill="#090D16" stroke="#FACC15" strokeWidth="1.5" />
        <line x1="47" y1="33" x2="53" y2="33" stroke="#FACC15" strokeWidth="2" />
        <line x1="34" y1="32" x2="40" y2="39" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
        <line x1="56" y1="32" x2="62" y2="39" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  );
};

// In-Ludo Quick Store Items for Shopping with Points (100 Pts = 20 Tk • No Cash Withdraw)
const LUDO_POINT_SHOP_ITEMS = [
  { id: 'lk-1', name: 'Bangladesh Premium Jersey', pts: 750, tk: 150, icon: '👕' },
  { id: 'lk-2', name: 'FIFA Pro Match Football', pts: 1500, tk: 300, icon: '⚽' },
  { id: 'lk-3', name: 'Wireless Gaming Earbuds', pts: 2000, tk: 400, icon: '🎧' },
  { id: 'lk-4', name: 'Sports Smart Watch', pts: 3000, tk: 600, icon: '⌚' },
  { id: 'lk-5', name: 'English Willow Cricket Bat', pts: 4500, tk: 900, icon: '🏏' },
  { id: 'lk-6', name: 'Pro Running Turf Shoes', pts: 5000, tk: 1000, icon: '👟' }
];

// 52-step clockwise perimeter track on 15x15 grid starting from BLUE's start cell (r=13, c=6)
const LUDO_MAIN_TRACK: [number, number][] = [
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0], [6, 0],
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], [14, 6]
];

// Matches Screenshot 2 (Screenshot_2026-10-10-22-40-15-625_com.ludo.king.jpg):
// RED = Bottom-Left (ALWAYS MY SEAT: "Me / You", starts at [13,6], index 0)
// GREEN = Top-Left (Opponent 1 in 3P/4P, starts at [6,1], index 13)
// YELLOW = Top-Right (Opponent in 2P & Opponent 2 in 3P/4P, starts at [1,8], index 26)
// BLUE = Bottom-Right (Opponent 3 in 4P, starts at [8,13], index 39)
const START_OFFSET: Record<LudoColor, number> = {
  RED: 0,
  GREEN: 13,
  YELLOW: 26,
  BLUE: 39
};

const HOME_LANES: Record<LudoColor, [number, number][]> = {
  RED: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
  GREEN: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  YELLOW: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  BLUE: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]]
};

// Yard base spots for the 4 tokens in each corner (matching Screenshot 2!)
const BASE_SPOTS: Record<LudoColor, [number, number][]> = {
  GREEN: [[1, 1], [1, 4], [4, 1], [4, 4]],     // Top-Left GREEN Yard
  YELLOW: [[1, 10], [1, 13], [4, 10], [4, 13]], // Top-Right YELLOW Yard
  RED: [[10, 1], [10, 4], [13, 1], [13, 4]],    // Bottom-Left RED Yard (MY SEAT)
  BLUE: [[10, 10], [10, 13], [13, 10], [13, 13]] // Bottom-Right BLUE Yard
};

const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Signature Ludo King Teardrop Pin Component (Ultra-Bright Glossy HD Colors + Step Hop Animation)
const LudoTeardropPin: React.FC<{
  color: LudoColor | 'GRAY';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  glowing?: boolean;
  hopping?: boolean;
  onClick?: () => void;
}> = ({ color, size = 'md', glowing = false, hopping = false, onClick }) => {
  const fillMap: Record<LudoColor | 'GRAY', { main: string; light: string; rim: string }> = {
    BLUE: { main: '#00A8FF', light: '#7CE0FF', rim: '#004B99' },
    RED: { main: '#FF1722', light: '#FF7A82', rim: '#8F0008' },
    GREEN: { main: '#00DC58', light: '#7DFFAE', rim: '#006626' },
    YELLOW: { main: '#FFE600', light: '#FFF685', rim: '#B27D00' },
    GRAY: { main: '#64748B', light: '#94A3B8', rim: '#334155' }
  };
  const dim =
    size === 'xs'
      ? 'w-6 h-7 sm:w-7 sm:h-8'
      : size === 'sm'
      ? 'w-8 h-10 sm:w-9 sm:h-11'
      : size === 'lg'
      ? 'w-12 h-14 sm:w-13 sm:h-16'
      : 'w-9 h-11 sm:w-10 sm:h-12';
  const c = fillMap[color];

  return (
    <div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-150 ${dim} ${
        hopping
          ? '-translate-y-2.5 scale-125 z-40 drop-shadow-[0_8px_12px_rgba(250,204,21,0.98)]'
          : glowing
          ? 'animate-bounce cursor-pointer z-30 scale-110 drop-shadow-[0_0_12px_#FFE600]'
          : 'z-20 drop-shadow-[0_3px_5px_rgba(0,0,0,0.65)]'
      }`}
    >
      <svg viewBox="0 0 36 46" className="w-full h-full overflow-visible">
        <ellipse cx="18" cy="42.5" rx="11.5" ry="4" fill="rgba(0,0,0,0.48)" />
        {glowing && (
          <circle
            cx="18"
            cy="18"
            r="17"
            fill="none"
            stroke="#FFF000"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
        )}
        <path
          d="M18 1.5 C7.2 1.5 1.2 9.5 1.2 18.8 C1.2 29.2 18 43 18 43 C18 43 34.8 29.2 34.8 18.8 C34.8 9.5 28.8 1.5 18 1.5 Z"
          fill="#FFFFFF"
          stroke={c.rim}
          strokeWidth="2.6"
        />
        <circle cx="18" cy="17.2" r="11.6" fill={c.main} stroke={c.rim} strokeWidth="1.6" />
        <ellipse cx="14.2" cy="12.8" rx="4.8" ry="3" fill={c.light} opacity="0.9" />
        <circle cx="12.5" cy="11.8" r="1.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

// 3D Colored/White Dice with Pips Component (Matches Screenshot 2 Green/Red/Yellow/Blue 3D Die!)
const LudoPipDice: React.FC<{
  value: number;
  diceColor?: LudoColor;
  rolling?: boolean;
  active?: boolean;
  onClick?: () => void;
}> = ({ value, diceColor, rolling = false, active = false, onClick }) => {
  const pipPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]]
  };
  const pips = pipPositions[value] || pipPositions[6];

  const colorStyle =
    diceColor === 'GREEN'
      ? 'bg-gradient-to-br from-[#22C55E] via-[#16A34A] to-[#15803D] border-[#86EFAC]'
      : diceColor === 'RED'
      ? 'bg-gradient-to-br from-[#FF2A36] via-[#EA1D24] to-[#B91C1C] border-[#FCA5A5]'
      : diceColor === 'YELLOW'
      ? 'bg-gradient-to-br from-[#FDE047] via-[#FACC15] to-[#CA8A04] border-[#FEF08A]'
      : diceColor === 'BLUE'
      ? 'bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0369A1] border-[#BAE6FD]'
      : 'bg-gradient-to-br from-white via-slate-50 to-slate-200 border-slate-400';

  const pipColor =
    diceColor === 'GREEN' || diceColor === 'RED' || diceColor === 'BLUE'
      ? 'bg-white shadow-sm'
      : diceColor === 'YELLOW'
      ? 'bg-slate-950'
      : value === 1
      ? 'bg-[#FF1722]'
      : 'bg-[#0F172A]';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      disabled={!active}
      className={`w-9 h-9 rounded-xl border-2 ${colorStyle} shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_3px_6px_rgba(0,0,0,0.45)] relative transition-transform duration-150 ${
        rolling
          ? 'rotate-180 scale-90'
          : active
          ? 'hover:scale-105 cursor-pointer ring-2 ring-[#FFE600]'
          : 'opacity-90'
      }`}
    >
      {pips.map(([x, y], idx) => (
        <span
          key={idx}
          style={{ left: `${x}%`, top: `${y}%` }}
          className={`-translate-x-1/2 -translate-y-1/2 absolute rounded-full ${
            value === 1 ? 'w-2.5 h-2.5' : 'w-[6.5px] h-[6.5px]'
          } ${pipColor}`}
        />
      ))}
    </button>
  );
};

export const LudoKingClone: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onOpenDeposit: () => void;
  onGoToStore?: () => void;
  onBack: () => void;
}> = ({ points, setPoints, onOpenDeposit, onGoToStore, onBack }) => {
  // Screen Flow State matching the 4 Screenshots:
  // 'HOME' (Screenshot 1) -> 'SELECT_GAME' (Screenshot 2) -> 'CHOOSE_COLOR' (Screenshot 3) -> 'BOARD' (Screenshot 4) -> 'WINNER'
  const [screen, setScreen] = useState<
    'HOME' | 'SELECT_GAME' | 'CHOOSE_COLOR' | 'MATCHMAKING' | 'BOARD' | 'SNAKES_BOARD' | 'WINNER'
  >('HOME');
  const [selectedMode, setSelectedMode] = useState<LudoMainMode>('PASS_N_PLAY');
  const [bottomTab, setBottomTab] = useState<LudoBottomTab>('HOME');

  // Screenshot 2 States: Select Theme, Select Token, Select Game Type
  const [selectedThemeName, setSelectedThemeName] = useState<'CLASSIC' | 'EGYPT' | 'CANDY' | 'NIGHT'>('CLASSIC');
  const [selectedTokenStyle, setSelectedTokenStyle] = useState<number>(0);
  const [selectedGameType, setSelectedGameType] = useState<LudoGameType>('CLASSIC');

  // Screenshot 3 & Screenshot 2 States:
  // Bottom-Left (RED) is ALWAYS User's Seat ("Me / You"), and Opponents (GREEN, YELLOW, BLUE) ALWAYS have distinct random names!
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4 | 5 | 6>(4);
  const [pairOption, setPairOption] = useState<1 | 2>(1);
  const [playerNames, setPlayerNames] = useState<Record<LudoColor, string>>(() => {
    const opp = pickDistinctRandomOpponents();
    return {
      RED: 'Me (You)',
      GREEN: opp.GREEN,
      YELLOW: opp.YELLOW,
      BLUE: opp.BLUE
    };
  });
  const [entryFee, setEntryFee] = useState<number>(1000);
  const [friendsSubTab, setFriendsSubTab] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [roomCode, setRoomCode] = useState<string>('849201');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [matchmakingTimer, setMatchmakingTimer] = useState<number>(39);

  // In-Ludo Point Hub (Buy Points 20 Tk = 100 Pts + Mobile Recharge + Shop with Points)
  const [pointHubTab, setPointHubTab] = useState<'BUY' | 'RECHARGE' | 'SHOP'>('BUY');
  const [pointHubNotice, setPointHubNotice] = useState<string | null>(null);
  const [selectedPayGateway, setSelectedPayGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');

  // Mobile Recharge with Points States (100 Points = 20 Taka)
  const [rechargeOperator, setRechargeOperator] = useState<
    'Grameenphone' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk'
  >('Grameenphone');
  const [rechargeSimType, setRechargeSimType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');
  const [rechargePhone, setRechargePhone] = useState<string>('');
  const [selectedRechargePkg, setSelectedRechargePkg] = useState<{ pts: number; tk: number }>({
    pts: 100,
    tk: 20
  });
  const [rechargeHistory, setRechargeHistory] = useState<
    {
      id: string;
      phone: string;
      operator: string;
      simType: string;
      tk: number;
      pts: number;
      time: string;
    }[]
  >([]);

  const handlePhoneInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setRechargePhone(digits);
    if (digits.startsWith('017') || digits.startsWith('013')) {
      setRechargeOperator('Grameenphone');
    } else if (digits.startsWith('018')) {
      setRechargeOperator('Robi');
    } else if (digits.startsWith('019') || digits.startsWith('014')) {
      setRechargeOperator('Banglalink');
    } else if (digits.startsWith('016')) {
      setRechargeOperator('Airtel');
    } else if (digits.startsWith('015')) {
      setRechargeOperator('Teletalk');
    }
  };

  const handleMobileRechargeWithPoints = (pkgOverride?: { pts: number; tk: number }) => {
    const pkg = pkgOverride || selectedRechargePkg;
    const cleanPhone = rechargePhone.trim();
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setPointHubNotice('⚠️ অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)!');
      return;
    }
    if (points < pkg.pts) {
      setPointHubTab('BUY');
      setPointHubNotice(
        `⚠️ ৳${pkg.tk} মোবাইল রিচার্জ করতে ${pkg.pts} পয়েন্ট প্রয়োজন! আপনার আছে ${points} পয়েন্ট। আগে পয়েন্ট কিনুন বা লুডু খেলে জিতুন।`
      );
      return;
    }
    setPoints((p) => p - pkg.pts);
    playLudoSound('WIN');
    const newEntry = {
      id: `RCH-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: cleanPhone,
      operator: rechargeOperator,
      simType: rechargeSimType,
      tk: pkg.tk,
      pts: pkg.pts,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRechargeHistory((prev) => [newEntry, ...prev]);
    setPointHubNotice(
      `🎉 সফল হয়েছে! ${cleanPhone} (${rechargeOperator} ${rechargeSimType}) নাম্বারে ৳${pkg.tk} মোবাইল রিচার্জ (${pkg.pts} Pts) সম্পন্ন হয়েছে! TrxID: ${newEntry.id}`
    );
  };

  // Helper to shuffle 3 distinct random opponent names while preserving user's "Me / You" name at Bottom-Left (RED)
  const shuffleOpponentNames = () => {
    const opp = pickDistinctRandomOpponents();
    setPlayerNames((prev) => ({
      RED: prev.RED.trim() ? prev.RED : 'Me (You)',
      GREEN: opp.GREEN,
      YELLOW: opp.YELLOW,
      BLUE: opp.BLUE
    }));
  };

  // Screenshot 4 Board Gameplay States
  const [tokens, setTokens] = useState<Record<LudoColor, number[]>>({
    BLUE: [-1, -1, -1, -1],
    RED: [-1, -1, -1, -1],
    GREEN: [-1, -1, -1, -1],
    YELLOW: [-1, -1, -1, -1]
  });
  const [turn, setTurn] = useState<LudoColor>('RED');
  const [dice, setDice] = useState<number>(1);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [rolling, setRolling] = useState<boolean>(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [isMovingToken, setIsMovingToken] = useState<boolean>(false);
  const [hoppingToken, setHoppingToken] = useState<{ color: LudoColor; idx: number } | null>(null);
  const [winner, setWinner] = useState<LudoColor | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showBoardMenuModal, setShowBoardMenuModal] = useState<boolean>(false);

  // Synchronous Refs to prevent stale closures & double-click race conditions on rolling 6
  const tokensRef = React.useRef<Record<LudoColor, number[]>>(tokens);
  tokensRef.current = tokens;

  const turnRef = React.useRef<LudoColor>(turn);
  turnRef.current = turn;

  const consecutiveSixesRef = React.useRef<number>(consecutiveSixes);
  consecutiveSixesRef.current = consecutiveSixes;

  const actionLockRef = React.useRef<boolean>(false);
  const pendingTimersRef = React.useRef<number[]>([]);

  const clearAllLudoTimers = () => {
    pendingTimersRef.current.forEach((id) => window.clearTimeout(id));
    pendingTimersRef.current = [];
  };

  const scheduleLudoTimer = (fn: () => void, delayMs: number) => {
    const id = window.setTimeout(() => {
      pendingTimersRef.current = pendingTimersRef.current.filter((t) => t !== id);
      fn();
    }, delayMs);
    pendingTimersRef.current.push(id);
    return id;
  };

  // Modals on Home Screen (Spin Wheel, Rules & 5% Fee Policy, Season 27 Claim, Point Hub Buy/Shop)
  const [homeModal, setHomeModal] = useState<
    null | 'SPIN' | 'RULES' | 'SEASON_CLAIM' | 'STARTER_PACK' | 'SEVEN_UP' | 'POINT_HUB'
  >(null);
  const [sevenUpBet, setSevenUpBet] = useState<'DOWN' | 'SEVEN' | 'UP'>('UP');
  const [sevenUpResult, setSevenUpResult] = useState<string | null>(null);

  // Snakes & Ladders State
  const [snakePos, setSnakePos] = useState<{ p1: number; p2: number }>({ p1: 1, p2: 1 });
  const [snakeTurn, setSnakeTurn] = useState<1 | 2>(1);
  const [snakeNote, setSnakeNote] = useState<string>('Tap Roll Dice to start Snakes & Ladders!');

  // ==========================================================================
  // EXACT 5% APP FEE & 95% WINNER PRIZE CALCULATION
  // ==========================================================================
  const effectivePlayers = playerCount > 4 ? 4 : playerCount;
  const totalPot = entryFee * effectivePlayers;
  const appFee5Percent = Math.round(totalPot * 0.05);
  const winnerPrize95Percent = totalPot - appFee5Percent;
  const takaValue = (entryFee * 0.2).toFixed(0);

  // Active colors on the 4-corner board based on playerCount (Matching Screenshot 2!):
  // - Bottom-Left = RED (ALWAYS My Seat: "Me / You")
  // - Top-Left = GREEN (Opponent 1)
  // - Top-Right = YELLOW (Diagonal Opponent in 2P; Opponent 2 in 3P/4P)
  // - Bottom-Right = BLUE (Opponent 3 in 4P)
  const activeColors: LudoColor[] =
    effectivePlayers === 2
      ? ['RED', 'YELLOW']
      : effectivePlayers === 3
      ? ['RED', 'GREEN', 'YELLOW']
      : ['RED', 'GREEN', 'YELLOW', 'BLUE'];

  // ==========================================================================
  // REAL LUDO KING SOUND SYNTHESIZER (DICE ROLL, 1-BY-1 BOX HOP, 6 BONUS, CUT, HOME)
  // ==========================================================================
  const playLudoSound = (
    type: 'DICE_ROLL' | 'STEP_HOP' | 'TOKEN_OPEN' | 'SIX_BONUS' | 'CAPTURE' | 'HOME_REACH' | 'WIN'
  ) => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const w = window as unknown as { __ludoAudioCtx?: AudioContext };
      if (!w.__ludoAudioCtx) {
        w.__ludoAudioCtx = new AudioCtx();
      }
      const ctx = w.__ludoAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      const playTone = (
        freq: number,
        endFreq: number,
        startOffset: number,
        duration: number,
        oscType: OscillatorType = 'sine',
        gainPeak = 0.22
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, now + startOffset);
        if (endFreq !== freq) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + startOffset + duration);
        }
        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.linearRampToValueAtTime(gainPeak, now + startOffset + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.01);
      };

      if (type === 'DICE_ROLL') {
        // Crisp plastic dice rattle clicks
        playTone(420, 680, 0.0, 0.045, 'triangle', 0.2);
        playTone(540, 360, 0.05, 0.045, 'triangle', 0.2);
        playTone(620, 820, 0.1, 0.045, 'triangle', 0.22);
        playTone(490, 740, 0.15, 0.05, 'triangle', 0.25);
      } else if (type === 'STEP_HOP') {
        // Signature Ludo King "Tok / Pop" hop sound on EVERY single box step!
        playTone(520, 960, 0.0, 0.075, 'sine', 0.28);
        playTone(320, 640, 0.01, 0.06, 'triangle', 0.16);
      } else if (type === 'TOKEN_OPEN') {
        // Pawn exits yard on rolling 6
        playTone(523.25, 659.25, 0.0, 0.09, 'triangle', 0.26);
        playTone(659.25, 1046.5, 0.08, 0.14, 'sine', 0.28);
      } else if (type === 'SIX_BONUS') {
        // Exciting chime when rolling a 6
        playTone(587.33, 587.33, 0.0, 0.07, 'triangle', 0.22);
        playTone(880, 1174.66, 0.07, 0.13, 'sine', 0.25);
      } else if (type === 'CAPTURE') {
        // Opponent pawn cut/captured sound
        playTone(780, 160, 0.0, 0.22, 'sawtooth', 0.26);
        playTone(440, 110, 0.08, 0.22, 'square', 0.18);
      } else if (type === 'HOME_REACH') {
        // Pawn reaches center home triangle
        playTone(523.25, 523.25, 0.0, 0.09, 'triangle', 0.25);
        playTone(659.25, 659.25, 0.09, 0.09, 'triangle', 0.25);
        playTone(783.99, 1046.5, 0.18, 0.22, 'sine', 0.3);
      } else if (type === 'WIN') {
        playTone(523.25, 523.25, 0.0, 0.12, 'triangle', 0.28);
        playTone(659.25, 659.25, 0.12, 0.12, 'triangle', 0.28);
        playTone(783.99, 783.99, 0.24, 0.12, 'triangle', 0.28);
        playTone(1046.5, 1046.5, 0.36, 0.35, 'sine', 0.32);
      }
    } catch {
      // ignore audio context errors
    }
  };

  const speakAudio = (text: string) => {
    if (!soundOn) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.1;
        window.speechSynthesis.speak(u);
      } catch {
        // ignore
      }
    }
  };

  // Click any mode on Screenshot 1 Home Screen
  const openModeFlow = (mode: LudoMainMode) => {
    setSelectedMode(mode);
    shuffleOpponentNames();
    if (mode === 'SEVEN_UP') {
      setHomeModal('SEVEN_UP');
      return;
    }
    if (mode === 'SNAKES') {
      setEntryFee(50);
      setSnakePos({ p1: 1, p2: 1 });
      setSnakeTurn(1);
      setScreen('SNAKES_BOARD');
      return;
    }
    if (mode === 'COMPUTER' || mode === 'PASS_N_PLAY') {
      setEntryFee(10); // Default 10 pts (or user can pick FREE / 10..5000 pts)
      setPlayerCount(2);
    } else {
      setEntryFee(100);
      setPlayerCount(4);
    }
    setScreen('SELECT_GAME');
  };

  // Start Game from Screenshot 3 ('Play' or 'Play - One Token Out -')
  const handleStartMatch = (oneTokenOut: boolean) => {
    if (entryFee > 0 && points < entryFee) {
      setPointHubTab('BUY');
      setPointHubNotice(`আপনার কমপক্ষে ${entryFee} পয়েন্ট প্রয়োজন! ২০ টাকায় ১০০ পয়েন্ট কিনুন:`);
      setHomeModal('POINT_HUB');
      return;
    }
    if (entryFee > 0) {
      setPoints((p) => p - entryFee);
    }

    // Ensure "Me / You" at Bottom-Left (RED) and 3 distinct random names for GREEN, YELLOW, BLUE
    const freshOpp = pickDistinctRandomOpponents();
    setPlayerNames((prev) => ({
      RED: prev.RED.trim() ? prev.RED : 'Me (You)',
      GREEN: prev.GREEN.trim() ? prev.GREEN : freshOpp.GREEN,
      YELLOW: prev.YELLOW.trim() ? prev.YELLOW : freshOpp.YELLOW,
      BLUE: prev.BLUE.trim() ? prev.BLUE : freshOpp.BLUE
    }));

    const startVal = oneTokenOut ? 0 : -1;
    const initialBoard: Record<LudoColor, number[]> = {
      RED: [startVal, -1, -1, -1],
      GREEN: [startVal, -1, -1, -1],
      YELLOW: [startVal, -1, -1, -1],
      BLUE: [startVal, -1, -1, -1]
    };
    clearAllLudoTimers();
    actionLockRef.current = false;
    tokensRef.current = initialBoard;
    setTokens(initialBoard);
    turnRef.current = activeColors[0];
    setTurn(activeColors[0]);
    setDice(1);
    setHasRolled(false);
    setRolling(false);
    consecutiveSixesRef.current = 0;
    setConsecutiveSixes(0);
    setIsMovingToken(false);
    setHoppingToken(null);
    setWinner(null);
    setMatchmakingTimer(39);

    if (selectedMode === 'PASS_N_PLAY') {
      setScreen('BOARD');
    } else {
      setScreen('MATCHMAKING');
    }
  };

  // Auto-launch board after online matchmaking + live stopwatch countdown (00:39 -> 00:36)
  useEffect(() => {
    if (screen !== 'MATCHMAKING') return;
    const interval = setInterval(() => {
      setMatchmakingTimer((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    if (selectedMode === 'FRIENDS') {
      return () => clearInterval(interval);
    }
    const timer = setTimeout(() => {
      setScreen('BOARD');
    }, 2800);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [screen, selectedMode]);

  const getTokenGridCoord = (color: LudoColor, step: number, tokenIdx: number): [number, number] => {
    if (step === -1) return BASE_SPOTS[color][tokenIdx];
    if (step >= 51) {
      const laneIdx = Math.min(5, step - 51);
      return HOME_LANES[color][laneIdx];
    }
    const globalIdx = (START_OFFSET[color] + step) % 52;
    return LUDO_MAIN_TRACK[globalIdx];
  };

  const canMoveTokenOnBoard = (
    board: Record<LudoColor, number[]>,
    color: LudoColor,
    tokenIdx: number,
    rollVal: number
  ): boolean => {
    const pos = board[color][tokenIdx];
    if (pos === -1) return rollVal === 6;
    if (pos >= 56) return false;
    return pos + rollVal <= 56;
  };

  const canMoveToken = (color: LudoColor, tokenIdx: number, rollVal: number): boolean => {
    return canMoveTokenOnBoard(tokensRef.current, color, tokenIdx, rollVal);
  };

  const advanceTurn = (current: LudoColor, grantBonus: boolean) => {
    actionLockRef.current = false;
    setIsMovingToken(false);
    setRolling(false);
    if (grantBonus) {
      turnRef.current = current;
      setTurn(current);
      setHasRolled(false);
      return;
    }
    const idx = activeColors.indexOf(current);
    const nextCol = activeColors[(idx + 1) % activeColors.length];
    turnRef.current = nextCol;
    setTurn(nextCol);
    consecutiveSixesRef.current = 0;
    setConsecutiveSixes(0);
    setHasRolled(false);
  };

  // ==========================================================================
  // STRICT MAX 2 CONSECUTIVE SIXES DICE GENERATOR ("২ ছক্কার ওপরে যেন ছয় না মারে")
  // ==========================================================================
  const generateSmartDiceValue = (color: LudoColor, currentSixCount: number): number => {
    // STRICT RULE: If already rolled 2 consecutive sixes in this turn, NEVER roll a 3rd six!
    if (currentSixCount >= 2) {
      return Math.floor(Math.random() * 5) + 1; // Strictly 1, 2, 3, 4, or 5
    }
    // Helpful boost if all 4 tokens are still locked in base on first roll of turn
    const allInBase = tokensRef.current[color].every((s) => s === -1);
    if (allInBase && currentSixCount === 0 && Math.random() < 0.38) {
      return 6;
    }
    return Math.floor(Math.random() * 6) + 1;
  };

  // ==========================================================================
  // STEP-BY-STEP 1-BOX-AT-A-TIME ANIMATED TOKEN MOVEMENT ("১ ঘর করে করে যাবে + সাউন্ড")
  // ==========================================================================
  const executeTokenMove = (color: LudoColor, tokenIdx: number, rollVal: number) => {
    const currentBoard = tokensRef.current;
    if (isMovingToken || !canMoveTokenOnBoard(currentBoard, color, tokenIdx, rollVal)) {
      actionLockRef.current = false;
      return;
    }

    actionLockRef.current = true;
    const startStep = currentBoard[color][tokenIdx];
    setIsMovingToken(true);

    // Finalize landing (check capture, home reach, win condition, and turn bonus)
    const finalizeLanding = (finalStep: number, latestBoard: Record<LudoColor, number[]>) => {
      const updated: Record<LudoColor, number[]> = JSON.parse(JSON.stringify(latestBoard));
      updated[color][tokenIdx] = finalStep;

      let captured = false;
      if (finalStep >= 0 && finalStep <= 50) {
        const destGlobal = (START_OFFSET[color] + finalStep) % 52;
        if (!SAFE_TRACK_INDICES.includes(destGlobal)) {
          for (const opp of activeColors) {
            if (opp === color) continue;
            updated[opp] = updated[opp].map((oppStep) => {
              if (oppStep >= 0 && oppStep <= 50) {
                const oppGlobal = (START_OFFSET[opp] + oppStep) % 52;
                if (oppGlobal === destGlobal) {
                  captured = true;
                  return -1;
                }
              }
              return oppStep;
            });
          }
        }
      }

      tokensRef.current = updated;
      setTokens(updated);
      setHoppingToken(null);
      setIsMovingToken(false);

      if (captured) {
        playLudoSound('CAPTURE');
      } else if (finalStep === 56) {
        playLudoSound('HOME_REACH');
      }

      const neededHome = selectedGameType === 'QUICK' ? 1 : 4;
      if (updated[color].filter((s) => s === 56).length >= neededHome) {
        actionLockRef.current = false;
        clearAllLudoTimers();
        setWinner(color);
        if ((color === 'RED' || selectedMode === 'PASS_N_PLAY') && winnerPrize95Percent > 0) {
          setPoints((p) => p + winnerPrize95Percent);
        }
        playLudoSound('WIN');
        setScreen('WINNER');
        speakAudio('Congratulations! You won the Ludo King match!');
        return;
      }

      const bonus = rollVal === 6 || captured || finalStep === 56;
      advanceTurn(color, bonus);
    };

    // CASE 1: Coming out of Yard Base (-1 -> 0) on rolling a 6
    if (startStep === -1) {
      playLudoSound('TOKEN_OPEN');
      playLudoSound('STEP_HOP');
      setHoppingToken({ color, idx: tokenIdx });
      const nextBoard: Record<LudoColor, number[]> = JSON.parse(JSON.stringify(tokensRef.current));
      nextBoard[color][tokenIdx] = 0;
      tokensRef.current = nextBoard;
      setTokens(nextBoard);

      scheduleLudoTimer(() => {
        finalizeLanding(0, tokensRef.current);
      }, 240);
      return;
    }

    // CASE 2: Moving on the Track — Animate 1 Box (১ ঘর) at a time with sound on every box!
    let currentOffset = 0;
    const workingBoard: Record<LudoColor, number[]> = JSON.parse(JSON.stringify(tokensRef.current));

    const stepNextBox = () => {
      currentOffset += 1;
      const intermediateStep = startStep + currentOffset;
      workingBoard[color][tokenIdx] = intermediateStep;

      playLudoSound('STEP_HOP');
      setHoppingToken({ color, idx: tokenIdx });
      const snap: Record<LudoColor, number[]> = JSON.parse(JSON.stringify(workingBoard));
      tokensRef.current = snap;
      setTokens(snap);

      if (currentOffset < rollVal) {
        scheduleLudoTimer(stepNextBox, 185);
      } else {
        scheduleLudoTimer(() => {
          finalizeLanding(intermediateStep, tokensRef.current);
        }, 180);
      }
    };

    stepNextBox();
  };

  const handleRollDice = (clickedColor: LudoColor) => {
    if (screen !== 'BOARD' || clickedColor !== turnRef.current || isMovingToken || rolling) return;

    // If player already rolled (e.g. rolled 6 with multiple choices) and taps the dice again, auto-pick best move
    if (hasRolled) {
      if (!actionLockRef.current) {
        const currentBoard = tokensRef.current;
        const movable = [0, 1, 2, 3].filter((i) =>
          canMoveTokenOnBoard(currentBoard, clickedColor, i, dice)
        );
        if (movable.length > 0) {
          const yardIdx = movable.find((i) => currentBoard[clickedColor][i] === -1);
          const pick = yardIdx !== undefined ? yardIdx : movable[0];
          executeTokenMove(clickedColor, pick, dice);
        }
      }
      return;
    }

    if (actionLockRef.current) return;
    actionLockRef.current = true;
    setRolling(true);
    playLudoSound('DICE_ROLL');

    scheduleLudoTimer(() => {
      const activeTurn = turnRef.current;
      const currentSixes = consecutiveSixesRef.current;
      const val = generateSmartDiceValue(activeTurn, currentSixes);
      const nextSixCount = val === 6 ? currentSixes + 1 : 0;
      consecutiveSixesRef.current = nextSixCount;
      setConsecutiveSixes(nextSixCount);
      setDice(val);
      setRolling(false);
      setHasRolled(true);

      if (val === 6) {
        playLudoSound('SIX_BONUS');
      }

      const currentBoard = tokensRef.current;
      const movable = [0, 1, 2, 3].filter((i) =>
        canMoveTokenOnBoard(currentBoard, activeTurn, i, val)
      );
      if (movable.length === 0) {
        scheduleLudoTimer(() => advanceTurn(activeTurn, false), 550);
      } else {
        // Auto-move when only 1 token can move OR all movable tokens are at the same step (e.g. all 4 in yard at -1 on rolling 6!)
        const uniqueSteps = new Set(movable.map((i) => currentBoard[activeTurn][i]));
        if (movable.length === 1 || uniqueSteps.size === 1) {
          scheduleLudoTimer(() => executeTokenMove(activeTurn, movable[0], val), 250);
        } else {
          // Player has tokens both in yard and on track (or multiple tokens on track); unlock so they can tap their choice!
          actionLockRef.current = false;
        }
      }
    }, 220);
  };

  // Bot / Online Opponent Auto-Roll when not in Pass N Play (RED is Bottom-Left User "Me / You")
  useEffect(() => {
    if (
      screen !== 'BOARD' ||
      turn === 'RED' ||
      selectedMode === 'PASS_N_PLAY' ||
      hasRolled ||
      rolling ||
      isMovingToken ||
      actionLockRef.current
    ) {
      return;
    }
    const t = window.setTimeout(() => {
      if (
        screen !== 'BOARD' ||
        turnRef.current === 'RED' ||
        hasRolled ||
        rolling ||
        isMovingToken ||
        actionLockRef.current
      ) {
        return;
      }
      actionLockRef.current = true;
      setRolling(true);
      playLudoSound('DICE_ROLL');

      scheduleLudoTimer(() => {
        const botTurn = turnRef.current;
        const currentSixes = consecutiveSixesRef.current;
        const val = generateSmartDiceValue(botTurn, currentSixes);
        const nextSixCount = val === 6 ? currentSixes + 1 : 0;
        consecutiveSixesRef.current = nextSixCount;
        setConsecutiveSixes(nextSixCount);
        setDice(val);
        setRolling(false);
        setHasRolled(true);

        if (val === 6) {
          playLudoSound('SIX_BONUS');
        }

        const currentBoard = tokensRef.current;
        const movable = [0, 1, 2, 3].filter((i) =>
          canMoveTokenOnBoard(currentBoard, botTurn, i, val)
        );
        if (movable.length === 0) {
          scheduleLudoTimer(() => advanceTurn(botTurn, false), 500);
        } else {
          // Prefer bringing a token out or advancing token
          const outIdx = movable.find((i) => currentBoard[botTurn][i] === -1);
          const pick = outIdx !== undefined ? outIdx : movable[0];
          scheduleLudoTimer(() => executeTokenMove(botTurn, pick, val), 320);
        }
      }, 220);
    }, 520);
    return () => window.clearTimeout(t);
  }, [turn, hasRolled, rolling, isMovingToken, screen, selectedMode, consecutiveSixes]);

  const handleInstantDemoWin = () => {
    setWinner('RED');
    if (winnerPrize95Percent > 0) {
      setPoints((p) => p + winnerPrize95Percent);
    }
    setShowBoardMenuModal(false);
    setScreen('WINNER');
  };

  return (
    <div
      className="-mx-3 sm:mx-0 -mt-2.5 sm:mt-0 min-h-screen text-white relative overflow-hidden flex flex-col justify-between select-none"
      style={{
        background:
          'radial-gradient(circle at 50% 32%, #1E56B8 0%, #113882 52%, #091F4E 100%)'
      }}
    >
      {/* Subtle Tilted Ludo Board Pattern Wallpaper Overlay (Like Screenshot 1 & 4) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-12"
        style={{
          backgroundImage:
            'repeating-linear-gradient(35deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 28px), repeating-linear-gradient(-55deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 2px, transparent 28px)'
        }}
      />

      {/* ====================================================================
          SCREENSHOT 1: LUDO KING MAIN HOME SCREEN
         ==================================================================== */}
      {screen === 'HOME' && (
        <>
          {/* TOP HEADER BAR (EXACT SCREENSHOT 1: Avatar | Gear | Mail | Diamonds 50+ | Coins/Points + | Cart) */}
          <div className="relative z-20 bg-[#081A48] border-b-2 border-[#EAB308] px-2.5 py-2 shadow-lg">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-1.5">
              {/* Left: Prominent Back Button + Avatar with Green Dot & Star 1 + Gear + Mail */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (bottomTab !== 'HOME') {
                      setBottomTab('HOME');
                    } else {
                      onBack();
                    }
                  }}
                  title="Back"
                  className="px-2.5 h-10 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1 text-[#FACC15] font-display font-black text-xs shadow-md hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  <span className="text-sm leading-none">←</span>
                  <span>Back</span>
                </button>

                <button
                  onClick={onBack}
                  title="Back to SportsViva Home"
                  className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-[#F59E0B] to-[#B45309] p-0.5 border-2 border-[#FDE047] shadow-md cursor-pointer shrink-0"
                >
                  <div className="w-full h-full rounded bg-gradient-to-b from-[#7C2D12] to-[#431407] flex items-center justify-center text-base">
                    😎
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22C55E] border border-white" />
                  <span className="absolute -bottom-1.5 -left-1 px-1 rounded bg-[#FACC15] text-[#081A48] font-black text-[9px] border border-white">
                    ★1
                  </span>
                </button>

                <button
                  onClick={() => setSoundOn((s) => !s)}
                  className="w-8 h-8 rounded-full bg-[#132E6D] border border-blue-400/40 flex items-center justify-center text-sky-200 hover:text-white cursor-pointer"
                  title="Sound / Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setHomeModal('RULES')}
                  className="relative w-8 h-8 rounded-lg bg-gradient-to-b from-[#FACC15] to-[#CA8A04] border border-yellow-200 flex items-center justify-center text-[#422006] cursor-pointer"
                  title="Messages & Point Policy"
                >
                  <Mail className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center">
                    !
                  </span>
                </button>
              </div>

              {/* Middle: Diamonds 50 [+] */}
              <div className="flex items-center bg-[#04102E] border border-blue-500/40 rounded-lg px-2 py-1 gap-1.5">
                <span className="text-sm">💎</span>
                <span className="font-mono-num font-black text-xs sm:text-sm text-white">50</span>
                <button
                  onClick={() => {
                    setPointHubTab('BUY');
                    setPointHubNotice(null);
                    setHomeModal('POINT_HUB');
                  }}
                  className="w-5 h-5 rounded bg-gradient-to-b from-[#4ADE80] to-[#16A34A] border border-lime-200 flex items-center justify-center text-white font-black cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* Right: Gold Coins / Points + [+] + Shopping Cart */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-[#04102E] border border-amber-400/50 rounded-lg px-2 py-1 gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#FDE047] to-[#D97706] border border-yellow-100 inline-block shrink-0" />
                  <span className="font-mono-num font-black text-xs sm:text-sm text-white">
                    {points.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setPointHubTab('BUY');
                      setPointHubNotice(null);
                      setHomeModal('POINT_HUB');
                    }}
                    title="Buy Points (20 Tk = 100 Points)"
                    className="w-5 h-5 rounded bg-gradient-to-b from-[#4ADE80] to-[#16A34A] border border-lime-200 flex items-center justify-center text-white font-black cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setPointHubTab('SHOP');
                    setPointHubNotice(null);
                    setHomeModal('POINT_HUB');
                  }}
                  title="Spend Points in Store"
                  className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#FDE047] to-[#CA8A04] border border-white flex items-center justify-center text-[#081A48] shadow cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN HOME CONTENT AREA (EXACT SCREENSHOT 1) */}
          {bottomTab === 'HOME' ? (
            <div className="relative z-10 flex-1 max-w-xl w-full mx-auto px-3 py-2 flex flex-col justify-between">
              {/* TOP SECTION: Left Floating Icons | Center 3D Ludo Board & Crown Logo | Right Floating Icons */}
              <div className="relative flex items-center justify-between my-1">
                {/* Left Vertical Column: STARTER PACK, Crown K, LUDO LIVE */}
                <div className="flex flex-col items-center gap-3 z-10">
                  <button
                    onClick={() => setHomeModal('STARTER_PACK')}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-2 border-[#FDE047] flex items-center justify-center text-xl shadow-md group-hover:scale-105">
                      🎁
                    </div>
                    <span className="-mt-1.5 px-1.5 py-0.5 rounded bg-red-600 border border-yellow-300 text-[8px] font-display font-black text-white leading-none">
                      STARTER
                    </span>
                  </button>

                  <button
                    onClick={() => setHomeModal('RULES')}
                    className="w-11 h-11 rounded-full bg-gradient-to-b from-[#422006] to-[#1C0D02] border-2 border-[#FACC15] shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105"
                  >
                    <span className="text-[8px] leading-none text-[#FACC15]">👑</span>
                    <span className="font-display font-black text-sm text-[#FACC15] leading-none">K</span>
                  </button>

                  <button
                    onClick={() => openModeFlow('ONLINE')}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="px-1.5 py-1 rounded-lg bg-gradient-to-b from-[#F97316] to-[#DC2626] border border-[#FDE047] text-[8px] font-display font-black text-white leading-tight text-center shadow">
                      👑 LUDO
                      <div className="bg-[#FACC15] text-black px-1 rounded text-[7px] mt-0.5">LIVE</div>
                    </div>
                  </button>
                </div>

                {/* CENTER 3D LUDO KING LOGO + PERSPECTIVE BOARD & 4 PAWNS (EXACT SCREENSHOT 1) */}
                <div className="flex flex-col items-center justify-center px-1">
                  {/* Golden Crown + L U D O Circles */}
                  <div className="relative flex items-center justify-center mb-1">
                    <svg
                      viewBox="0 0 60 30"
                      className="w-12 h-6 text-[#FACC15] fill-current -rotate-12 absolute -top-5 left-1 drop-shadow"
                    >
                      <path d="M4 26 L8 8 L20 18 L30 4 L40 18 L52 8 L56 26 Z" />
                    </svg>
                    <div className="flex items-center gap-1">
                      {[
                        { ch: 'L', col: 'text-[#008FD5]' },
                        { ch: 'U', col: 'text-[#ED1C24]' },
                        { ch: 'D', col: 'text-[#00A651]' },
                        { ch: 'O', col: 'text-[#F59E0B]' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-white to-slate-200 border-[2.5px] border-[#F59E0B] shadow-md flex items-center justify-center font-display font-black text-lg sm:text-xl"
                        >
                          <span className={item.col}>{item.ch}</span>
                        </div>
                      ))}
                    </div>
                    <span className="absolute -top-3 right-0 text-[10px] font-display font-black text-[#FACC15] tracking-wider">
                      KING
                    </span>
                  </div>

                  {/* 3D Perspective Board + Center White Dice + 4 Standing Glossy Pawns */}
                  <div className="relative w-52 sm:w-60 h-28 flex items-center justify-center">
                    {/* Perspective Board SVG */}
                    <svg viewBox="0 0 240 110" className="w-full h-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.6)]">
                      {/* Board Base */}
                      <polygon
                        points="45,25 195,25 225,88 15,88"
                        fill="#FFFFFF"
                        stroke="#FACC15"
                        strokeWidth="4"
                      />
                      {/* Red Top-Left Yard */}
                      <polygon points="48,28 105,28 96,52 34,52" fill="#ED1C24" />
                      {/* Green Top-Right Yard */}
                      <polygon points="135,28 192,28 206,52 144,52" fill="#00A651" />
                      {/* Blue Bottom-Left Yard */}
                      <polygon points="30,58 94,58 84,84 20,84" fill="#008FD5" />
                      {/* Yellow Bottom-Right Yard */}
                      <polygon points="146,58 210,58 220,84 156,84" fill="#FFDE17" />
                      {/* Center Path */}
                      <polygon points="105,28 135,28 156,84 84,84" fill="#E2E8F0" />
                    </svg>

                    {/* Center 3D White Dice */}
                    <div className="absolute top-5 w-11 h-11 rounded-xl bg-white border-2 border-slate-300 rotate-12 shadow-xl flex items-center justify-center text-2xl">
                      🎲
                    </div>

                    {/* 4 Standing 3D Pawns at Corners */}
                    {/* Back-Left Red Pawn */}
                    <div className="absolute left-9 top-2 w-6 h-10 rounded-t-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 border border-white/60 shadow-md" />
                    {/* Back-Right Green Pawn */}
                    <div className="absolute right-9 top-2 w-6 h-10 rounded-t-full bg-gradient-to-b from-green-400 via-green-600 to-green-800 border border-white/60 shadow-md" />
                    {/* Front-Left Big Blue Pawn */}
                    <div className="absolute left-2 bottom-1 w-9 h-14 rounded-t-full bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 border-2 border-white/80 shadow-xl" />
                    {/* Front-Right Big Yellow Pawn */}
                    <div className="absolute right-2 bottom-1 w-9 h-14 rounded-t-full bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 border-2 border-white/80 shadow-xl" />
                  </div>
                </div>

                {/* Right Vertical Column: FREE Chest, Target Bullseye, Yellow Cube, ? Help */}
                <div className="flex flex-col items-center gap-2.5 z-10">
                  <button
                    onClick={() => setHomeModal('SPIN')}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-11 h-10 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#CA8A04] border-2 border-white flex items-center justify-center text-lg shadow">
                      🧰
                    </div>
                    <span className="-mt-1.5 text-[9px] font-display font-black text-[#FDE047] drop-shadow">
                      FREE
                    </span>
                  </button>

                  <button
                    onClick={() => openModeFlow('TOURNAMENT')}
                    className="w-10 h-10 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-white flex items-center justify-center text-base shadow cursor-pointer"
                  >
                    🎯
                  </button>

                  <button
                    onClick={() => setHomeModal('SPIN')}
                    className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#EAB308] border-2 border-amber-700 flex items-center justify-center text-base shadow cursor-pointer"
                  >
                    🤔
                  </button>

                  <button
                    onClick={() => setHomeModal('RULES')}
                    className="w-9 h-9 rounded-xl bg-[#0F296B] border-2 border-[#FACC15] flex items-center justify-center text-[#FACC15] font-display font-black text-base shadow cursor-pointer"
                    title="Rules: 10–5000 Pts • 5% App Fee • 100 Pts = 20 Tk"
                  >
                    ?
                  </button>
                </div>
              </div>

              {/* ==============================================================
                  ROW 1 OF MODE BUTTONS (3 BUTTONS: ONLINE | TEAM UP | FRIENDS)
                  EXACT AS SCREENSHOT 1!
                 ============================================================== */}
              <div className="grid grid-cols-3 gap-2.5 mt-1">
                {/* 1. ONLINE */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => openModeFlow('ONLINE')}
                    className="w-full rounded-2xl border-[2.5px] border-[#FACC15] bg-gradient-to-b from-[#1A56B8] to-[#0D3175] overflow-hidden shadow-[0_5px_0_#854D0E,0_8px_14px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <div className="h-14 flex items-center justify-center gap-1 px-1">
                      <span className="text-base -rotate-12">📱</span>
                      <span className="text-2xl">🌍</span>
                      <span className="text-base rotate-12">📱</span>
                    </div>
                    <div className="bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#D97706] py-1.5 text-center border-t border-yellow-200">
                      <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
                        ONLINE
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#4ADE80]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>Players: 269,995</span>
                  </div>
                </div>

                {/* 2. TEAM UP */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => openModeFlow('TEAM_UP')}
                    className="w-full rounded-2xl border-[2.5px] border-[#FACC15] bg-gradient-to-b from-[#1A56B8] to-[#0D3175] overflow-hidden shadow-[0_5px_0_#854D0E,0_8px_14px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <div className="h-14 flex items-center justify-center gap-1 px-1">
                      <span className="text-sm">🟢⚪</span>
                      <span className="text-2xl">🗡️</span>
                      <span className="text-sm">🔴🟡</span>
                    </div>
                    <div className="bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#D97706] py-1.5 text-center border-t border-yellow-200">
                      <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
                        TEAM UP
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#4ADE80]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>Players: 5,384</span>
                  </div>
                </div>

                {/* 3. FRIENDS */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => openModeFlow('FRIENDS')}
                    className="relative w-full rounded-2xl border-[2.5px] border-[#FACC15] bg-gradient-to-b from-[#1A56B8] to-[#0D3175] overflow-hidden shadow-[0_5px_0_#854D0E,0_8px_14px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <div className="h-14 flex items-center justify-center gap-1 px-1">
                      <span className="text-base -rotate-12">📱</span>
                      <span className="text-xl">❤️❤️</span>
                      <span className="text-base rotate-12">📱</span>
                    </div>
                    <div className="bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#D97706] py-1.5 text-center border-t border-yellow-200">
                      <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
                        FRIENDS
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#4ADE80]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>Players: 30,119</span>
                  </div>
                </div>
              </div>

              {/* ==============================================================
                  ROW 2 OF MODE BUTTONS (2 CENTERED BUTTONS: COMPUTER | PASS N PLAY)
                  EXACT AS SCREENSHOT 1!
                 ============================================================== */}
              <div className="grid grid-cols-2 gap-4 max-w-[360px] w-full mx-auto mt-2">
                {/* 4. COMPUTER */}
                <button
                  onClick={() => openModeFlow('COMPUTER')}
                  className="w-full rounded-2xl border-[2.5px] border-[#FACC15] bg-gradient-to-b from-[#1A56B8] to-[#0D3175] overflow-hidden shadow-[0_5px_0_#854D0E,0_8px_14px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <div className="h-14 flex items-center justify-center">
                    <div className="w-8 h-11 rounded-lg bg-[#FACC15] border-2 border-amber-800 flex items-center justify-center font-display font-black text-xs text-black shadow">
                      VS
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#D97706] py-1.5 text-center border-t border-yellow-200">
                    <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
                      COMPUTER
                    </span>
                  </div>
                </button>

                {/* 5. PASS N PLAY */}
                <button
                  onClick={() => openModeFlow('PASS_N_PLAY')}
                  className="w-full rounded-2xl border-[2.5px] border-[#FACC15] bg-gradient-to-b from-[#1A56B8] to-[#0D3175] overflow-hidden shadow-[0_5px_0_#854D0E,0_8px_14px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-transform cursor-pointer"
                >
                  <div className="h-14 flex items-center justify-center gap-1.5 text-[#FACC15]">
                    <Users className="w-8 h-8 fill-current" />
                  </div>
                  <div className="bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#D97706] py-1.5 text-center border-t border-yellow-200">
                    <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] tracking-wide">
                      PASS N PLAY
                    </span>
                  </div>
                </button>
              </div>

              {/* ==============================================================
                  ROW 3: 7 UP DOWN CUP | TOURNAMENT SHIELD | SNAKES & LADDERS
                  EXACT AS SCREENSHOT 1!
                 ============================================================== */}
              <div className="flex items-center justify-around max-w-md w-full mx-auto mt-3">
                {/* Left: 7 Dice Cup */}
                <button
                  onClick={() => openModeFlow('SEVEN_UP')}
                  className="w-16 h-14 rounded-2xl bg-gradient-to-b from-[#1A56B8] to-[#0B2559] border-[2.5px] border-[#FACC15] shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <span className="font-display font-black text-lg text-[#FACC15] leading-none">7</span>
                  <span className="text-xs">🎲🪣</span>
                </button>

                {/* Center: TOURNAMENT Crown Banner */}
                <button
                  onClick={() => openModeFlow('TOURNAMENT')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-b from-[#1D4ED8] to-[#091E4A] border-[2.5px] border-[#FACC15] shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <span className="text-base -mt-4">👑</span>
                  <span className="font-display font-black text-sm sm:text-base text-[#FACC15] tracking-wider drop-shadow">
                    TOURNAMENT
                  </span>
                </button>

                {/* Right: Snakes & Ladders */}
                <button
                  onClick={() => openModeFlow('SNAKES')}
                  className="w-16 h-14 rounded-2xl bg-gradient-to-b from-[#1A56B8] to-[#0B2559] border-[2.5px] border-[#FACC15] shadow-lg flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  🐍🎲
                </button>
              </div>

              {/* ==============================================================
                  ROW 4: FREE 1000 AD | SEASON 27 CLAIM BANNER | SPIN WHEEL
                  EXACT AS SCREENSHOT 1!
                 ============================================================== */}
              <div className="flex items-end justify-between mt-2 pb-1">
                {/* Bottom-Left: FREE 1000 */}
                <button
                  onClick={() => setHomeModal('SPIN')}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <span className="text-[10px] font-display font-black text-[#FACC15]">FREE</span>
                  <div className="px-2 py-1 rounded-xl bg-gradient-to-b from-[#1E40AF] to-[#0F172A] border-2 border-[#FACC15] text-center">
                    <div className="text-xs">🎬x5</div>
                    <div className="text-[9px] font-mono-num font-black text-[#FACC15]">🪙 1000</div>
                  </div>
                </button>

                {/* Center: SEASON 27 CLAIM */}
                <button
                  onClick={() => setHomeModal('SEASON_CLAIM')}
                  className="flex items-center bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#F59E0B] border-2 border-white rounded-2xl px-4 py-2 shadow-[0_4px_15px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="px-2 py-0.5 rounded-lg bg-purple-800 border border-[#FACC15] text-center mr-2.5">
                    <div className="text-[7px] font-bold text-purple-200">SEASON</div>
                    <div className="text-xs font-display font-black text-[#FACC15] leading-none">27</div>
                  </div>
                  <span className="font-display font-black text-base sm:text-lg text-[#78350F] tracking-wider">
                    CLAIM
                  </span>
                </button>

                {/* Bottom-Right: SPIN Wheel */}
                <button
                  onClick={() => setHomeModal('SPIN')}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-[#FACC15] bg-gradient-to-tr from-blue-600 via-[#FACC15] to-sky-400 flex items-center justify-center shadow-lg">
                    <span className="px-1.5 py-0.5 rounded-full bg-[#FACC15] text-[#081A48] font-display font-black text-[9px]">
                      SPIN
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* OTHER BOTTOM TABS (EVENT | ADDA | INVENTORY | SOCIAL) */
            <div className="relative z-10 flex-1 max-w-xl w-full mx-auto p-4 space-y-3">
              <div className="rounded-2xl bg-[#081A48]/95 border-2 border-[#FACC15] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h2 className="text-base font-display font-black text-[#FACC15]">
                    {bottomTab === 'EVENT'
                      ? '📅 SEASON 27 LUDO KING EVENTS'
                      : bottomTab === 'ADDA'
                      ? '🎙️ LUDO KING VOICE ADDA ROOMS'
                      : bottomTab === 'INVENTORY'
                      ? '🎲 MY DICE, TOKENS & BOARD THEMES'
                      : '💬 LUDO KING SOCIAL & LEADERBOARD'}
                  </h2>
                  <button
                    onClick={() => setBottomTab('HOME')}
                    className="px-3 py-1 rounded-lg bg-[#FACC15] text-[#081A48] font-display font-black text-xs cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#0D276B] border border-[#FACC15]/40 text-xs space-y-2">
                  <div className="font-bold text-[#FACC15]">
                    🪙 ১০০ পয়েন্ট = ২০ টাকা • এন্ট্রি: ১০ থেকে ৫,০০০ পয়েন্ট (৫% অ্যাপস ফি)
                  </div>
                  <p className="text-cyan-100">
                    অনলাইন ও অফলাইন সব মোডে খেলা যাবে। যে পয়েন্ট জিতবেন বা কিনবেন তা ক্যাশ উইথড্র করা যাবে না—সরাসরি আমাদের <strong>Sports Store</strong> থেকে শপিং করতে পারবেন!
                  </p>
                  {onGoToStore && (
                    <button
                      onClick={onGoToStore}
                      className="px-4 py-2 rounded-xl bg-[#00FF66] text-[#050E29] font-display font-black text-xs cursor-pointer"
                    >
                      🛍️ পয়েন্ট দিয়ে শপিং করুন (Sports Store) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM 5-TAB BAR (EXACT SCREENSHOT 1: HOME | EVENT | ADDA | INVENTORY | SOCIAL) */}
          <div className="relative z-20 bg-gradient-to-b from-[#133A8A] to-[#081A48] border-t-2 border-[#38BDF8]/60 grid grid-cols-5 items-center h-16">
            {[
              { id: 'HOME' as LudoBottomTab, label: 'HOME', icon: '🏠' },
              { id: 'EVENT' as LudoBottomTab, label: 'EVENT', icon: '📅' },
              { id: 'ADDA' as LudoBottomTab, label: 'ADDA', icon: '🎙️', badge: 'NEW' },
              { id: 'INVENTORY' as LudoBottomTab, label: 'INVENTORY', icon: '🎲' },
              { id: 'SOCIAL' as LudoBottomTab, label: 'SOCIAL', icon: '💬' }
            ].map((t) => {
              const active = bottomTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setBottomTab(t.id)}
                  className={`relative h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    active
                      ? 'bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-t-2 border-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {t.badge && (
                    <span className="absolute top-1 left-2 px-1 rounded bg-red-600 text-[8px] font-black text-white">
                      {t.badge}
                    </span>
                  )}
                  <span className="text-lg leading-none">{t.icon}</span>
                  <span className="text-[10px] font-display font-black text-white mt-1">{t.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ====================================================================
          SCREENSHOT 2: SELECT THEME + SELECT TOKEN + SELECT GAME (Classic / Team Up / Quick)
         ==================================================================== */}
      {screen === 'SELECT_GAME' && (
        <div className="relative z-20 flex-1 flex flex-col justify-between py-4 px-3 max-w-xl w-full mx-auto">
          {/* Top Bar: Back Button + SELECT THEME Banner */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setScreen('HOME')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1.5 text-[#FACC15] font-display font-black text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-base leading-none">←</span>
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#081A48] border-2 border-[#FACC15] flex items-center justify-center text-[#FACC15] font-black text-xs">
                ✔
              </div>
              <button
                onClick={() =>
                  setSelectedThemeName((prev) =>
                    prev === 'CLASSIC' ? 'EGYPT' : prev === 'EGYPT' ? 'CANDY' : 'CLASSIC'
                  )
                }
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#0F2D6E] via-[#1D4ED8] to-[#0F2D6E] border-2 border-[#FACC15] shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>🎨</span>
                <span className="font-display font-black text-xs text-white tracking-wider">
                  SELECT THEME ({selectedThemeName})
                </span>
              </button>
            </div>
          </div>

          {/* Middle Panel: SELECT TOKEN & SELECT GAME (Exact Screenshot 2!) */}
          <div className="my-auto space-y-0 border-y-2 border-[#FACC15] bg-gradient-to-b from-[#09225C] via-[#13409E] to-[#09225C] shadow-2xl">
            {/* Section 1: SELECT TOKEN */}
            <div className="p-4 border-b-2 border-[#FACC15] text-center space-y-3">
              <h2 className="text-base sm:text-lg font-display font-black text-[#FACC15] tracking-wider">
                SELECT TOKEN
              </h2>
              <div className="flex items-center justify-center gap-3 sm:gap-5">
                <span className="text-[#FACC15] text-lg font-black">◀</span>
                {[
                  { id: 0, icon: '📍', locked: false },
                  { id: 1, icon: '✪', locked: false },
                  { id: 2, icon: '🔨', locked: true },
                  { id: 3, icon: '🌪️', locked: true },
                  { id: 4, icon: '🤖', locked: true }
                ].map((tk) => {
                  const isSel = selectedTokenStyle === tk.id;
                  return (
                    <button
                      key={tk.id}
                      onClick={() => setSelectedTokenStyle(tk.id)}
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-transform ${
                        isSel
                          ? 'bg-sky-500/30 border-2 border-[#FACC15] scale-110'
                          : 'bg-black/25 border border-white/15'
                      }`}
                    >
                      {tk.id === 0 ? <LudoTeardropPin color="BLUE" /> : <span>{tk.icon}</span>}
                      {isSel && (
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded bg-[#081A48] border border-[#FACC15] text-[#FACC15] text-xs font-black flex items-center justify-center">
                          ✔
                        </span>
                      )}
                      {tk.locked && !isSel && (
                        <span className="absolute -top-1 -left-1 text-xs">🔒</span>
                      )}
                    </button>
                  );
                })}
                <span className="text-[#FACC15] text-lg font-black">▶</span>
              </div>
            </div>

            {/* Section 2: SELECT GAME (Classic | Classic Team Up | QUICK) */}
            <div className="p-5 space-y-4 relative">
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-display font-black text-[#FACC15] tracking-wider">
                  SELECT GAME
                </h2>
              </div>

              <div className="space-y-3.5 max-w-xs mx-auto">
                {[
                  { id: 'CLASSIC' as LudoGameType, label: 'Classic', sub: '', green: false, icon: '👥 VS 👥' },
                  { id: 'TEAM_UP' as LudoGameType, label: 'Team Up', sub: 'Classic', green: false, icon: '🤝 VS 🤝' },
                  { id: 'QUICK' as LudoGameType, label: 'QUICK', sub: '', green: true, icon: '⚡ 1-Token' }
                ].map((gm) => {
                  const active = selectedGameType === gm.id;
                  return (
                    <div
                      key={gm.id}
                      onClick={() => setSelectedGameType(gm.id)}
                      className="flex items-center justify-center gap-4 cursor-pointer group"
                    >
                      {/* Left Square Gold-Bordered Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-[#0A2768] border-2 border-[#FACC15] flex items-center justify-center text-xs font-black text-white text-center p-1 shadow-md">
                        {gm.icon}
                      </div>

                      {/* Right Pill Button with Round Radio Checkmark */}
                      <div
                        className={`flex-1 h-12 rounded-full border-2 border-[#FACC15] flex items-center px-1.5 shadow-[0_0_12px_rgba(250,204,21,0.35)] ${
                          gm.green
                            ? 'bg-gradient-to-b from-[#22C55E] to-[#15803D]'
                            : 'bg-gradient-to-b from-[#1D4ED8] to-[#0A2768]'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-[#091E4A] border-2 border-[#FACC15] flex items-center justify-center text-[#FACC15] font-black text-lg">
                          {active ? '✔' : ''}
                        </div>
                        <div className="flex-1 text-center leading-tight pr-2">
                          {gm.sub && <div className="text-[10px] font-bold text-sky-200">{gm.sub}</div>}
                          <div className="font-display font-black text-sm sm:text-base text-white italic">
                            {gm.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Next Button & Return Arrow (Exact Screenshot 2!) */}
          <div className="relative flex items-center justify-center pt-3 pb-2">
            <button
              onClick={() => setScreen('HOME')}
              className="absolute left-0 px-3.5 h-12 rounded-2xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1.5 text-[#FACC15] font-display font-black text-sm shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-lg leading-none">↩</span>
              <span>Back</span>
            </button>

            <button
              onClick={() => setScreen('CHOOSE_COLOR')}
              className="px-12 py-3 rounded-2xl bg-gradient-to-b from-[#1E40AF] to-[#0A2259] border-[2.5px] border-[#FACC15] shadow-[0_0_16px_rgba(250,204,21,0.5)] font-display font-black italic text-lg text-white cursor-pointer hover:scale-105 transition-transform"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCREENSHOT 3: CHOOSE COLOR AND NAME + 2P..6P + ENTRY POINTS (10..5000)
          - Bottom-Left (BLUE) is ALWAYS User's Seat: "Me" or "You"
          - 2P: 1 Random Opponent (Top-Right GREEN) + My Seat (Bottom-Left BLUE)
          - 4P: 3 Distinct Random Opponents (RED, GREEN, YELLOW) + My Seat (Bottom-Left BLUE)
         ==================================================================== */}
      {screen === 'CHOOSE_COLOR' && (
        <div className="relative z-20 flex-1 flex flex-col justify-between py-2.5 px-3 max-w-xl w-full mx-auto">
          {/* Top Bar: Back Button + Wallet Points + Buy Points + Shop with Points */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <button
              onClick={() => setScreen('SELECT_GAME')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1 text-[#FACC15] font-display font-black text-xs shadow cursor-pointer shrink-0"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <div className="px-2.5 py-1 rounded-xl bg-[#04102E] border border-[#FACC15] flex items-center gap-1.5 text-xs">
              <span>🪙</span>
              <span className="font-mono-num font-black text-[#FACC15]">{points.toLocaleString()} Pts</span>
              <button
                onClick={() => {
                  setPointHubTab('BUY');
                  setPointHubNotice(null);
                  setHomeModal('POINT_HUB');
                }}
                className="ml-1 px-2 py-0.5 rounded bg-[#22C55E] text-[#05183C] font-display font-black text-[10px] cursor-pointer"
              >
                + Buy Pts
              </button>
            </div>

            <button
              onClick={() => {
                setPointHubTab('SHOP');
                setPointHubNotice(null);
                setHomeModal('POINT_HUB');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#CA8A04] border border-white text-[#081A48] font-display font-black text-[11px] flex items-center gap-1 shadow cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Shop</span>
            </button>
          </div>

          {/* Main Choose Color & Name Panel (Exact Screenshot 3 + Dynamic 2P vs 4P Random Names!) */}
          <div className="my-auto border-y-2 border-[#FACC15] bg-gradient-to-b from-[#081F54] via-[#10388C] to-[#081F54] shadow-2xl">
            <div className="px-3.5 py-2 border-b border-blue-400/30 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-display font-black text-[#FACC15] tracking-wide">
                CHOOSE COLOR AND NAME ({effectivePlayers} PLAYERS)
              </span>
              <button
                onClick={shuffleOpponentNames}
                className="px-2.5 py-1 rounded-lg bg-[#04102E] border border-[#FACC15] text-[10px] font-display font-black text-[#FACC15] hover:bg-[#15469B] cursor-pointer"
              >
                🎲 নতুন র‍্যান্ডম নাম
              </button>
            </div>

            {/* MY SEAT (BOTTOM-LEFT RED): Always "Me" or "You" or Custom Name */}
            <div className="px-3.5 py-2.5 bg-[#15469B] border-b border-blue-400/30 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-display font-black text-[#FFE600] flex items-center gap-1">
                  <span>👤 আমার ঘর (Bottom-Left Seat):</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#00FF66] text-[#05183C] font-black">
                    ME / YOU
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  {['Me', 'You', 'Me (You)', 'DravoVega'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPlayerNames({ ...playerNames, RED: preset })}
                      className={`px-2 py-0.5 rounded text-[10px] font-display font-black cursor-pointer border ${
                        playerNames.RED === preset
                          ? 'bg-[#FFE600] text-[#081A48] border-white'
                          : 'bg-[#081A48] text-white border-white/30'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#22C55E] border-2 border-white flex items-center justify-center text-white text-xs font-black shrink-0">
                  ✔
                </div>
                <LudoTeardropPin color="RED" size="md" />
                <input
                  value={playerNames.RED}
                  onChange={(e) => setPlayerNames({ ...playerNames, RED: e.target.value })}
                  placeholder="Me / You"
                  className="flex-1 bg-white text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg border-2 border-[#FFE600] focus:outline-none"
                />
                <span className="px-2 py-1 rounded bg-[#04102E] border border-[#FFE600] text-[10px] font-display font-black text-[#FFE600]">
                  আমার পদ
                </span>
              </div>
            </div>

            {/* OPPONENT SEATS:
                - 2P Mode: 1 Random Opponent (Top-Right YELLOW)
                - 3P Mode: 2 Distinct Random Opponents (Top-Left GREEN, Top-Right YELLOW)
                - 4P Mode: 3 Distinct Random Opponents (Top-Left GREEN, Top-Right YELLOW, Bottom-Right BLUE) */}
            <div className="px-3.5 py-2 bg-[#092058] border-b border-blue-400/20 space-y-1.5">
              <div className="text-[10px] font-display font-black text-sky-200 flex items-center justify-between">
                <span>
                  {effectivePlayers === 2
                    ? '🎲 অন্য ১ জনের র‍্যান্ডম নাম (2-Player Opponent):'
                    : effectivePlayers === 3
                    ? '🎲 অন্য ২ জনের ভিন্ন র‍্যান্ডম নাম (3-Player Opponents):'
                    : '🎲 অন্য ৩ জনের ভিন্ন র‍্যান্ডম নাম (4-Player Opponents):'}
                </span>
                <span className="text-[#4ADE80]">Auto Random ✓</span>
              </div>

              {/* In 3P or 4P: Show GREEN (Top-Left Opponent) */}
              {effectivePlayers >= 3 && (
                <div className="flex items-center gap-2">
                  <LudoTeardropPin color="GREEN" size="md" />
                  <input
                    value={playerNames.GREEN}
                    onChange={(e) => setPlayerNames({ ...playerNames, GREEN: e.target.value })}
                    className="flex-1 bg-white/95 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] font-bold text-emerald-300 w-16 text-right">Top-Left</span>
                </div>
              )}

              {/* Always in 2P, 3P, 4P: Show YELLOW (Top-Right Opponent) */}
              <div className="flex items-center gap-2">
                <LudoTeardropPin color="YELLOW" size="md" />
                <input
                  value={playerNames.YELLOW}
                  onChange={(e) => setPlayerNames({ ...playerNames, YELLOW: e.target.value })}
                  className="flex-1 bg-white/95 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-500 focus:outline-none"
                />
                <span className="text-[10px] font-bold text-amber-300 w-16 text-right">Top-Right</span>
              </div>

              {/* In 4P: Show BLUE (Bottom-Right Opponent) */}
              {effectivePlayers >= 4 && (
                <div className="flex items-center gap-2">
                  <LudoTeardropPin color="BLUE" size="md" />
                  <input
                    value={playerNames.BLUE}
                    onChange={(e) => setPlayerNames({ ...playerNames, BLUE: e.target.value })}
                    className="flex-1 bg-white/95 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-sky-500 focus:outline-none"
                  />
                  <span className="text-[10px] font-bold text-sky-300 w-16 text-right">Bot-Right</span>
                </div>
              )}
            </div>

            {/* 2P | 3P | 4P | 5P | 6P Buttons Row (Exact Screenshot 3! Clicking refreshes unique random names!) */}
            <div className="px-4 py-2.5 flex items-center justify-center gap-2.5">
              {([2, 3, 4, 5, 6] as const).map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => {
                    setPlayerCount(cnt);
                    shuffleOpponentNames();
                  }}
                  className={`w-11 h-9 rounded-xl border-2 font-display font-black text-xs sm:text-sm cursor-pointer transition-all ${
                    playerCount === cnt
                      ? 'bg-[#081A48] border-[#FACC15] text-white shadow-[0_0_12px_#FACC15] scale-105'
                      : 'bg-[#15469B] border-[#FACC15]/60 text-white/85'
                  }`}
                >
                  {cnt}P
                </button>
              ))}
            </div>

            {/* ENTRY POINTS (10, 20, 30, 40, 50, 100 ... 5000 PTS) & 5% APP FEE STRIP */}
            <div className="px-4 py-2.5 bg-[#061539] border-t border-[#FACC15]/40 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-display font-black text-[#FACC15]">
                  🪙 ENTRY POINTS (10 – 5,000 Pts • 5% App Fee):
                </span>
                <span className="font-mono-num font-black text-[#4ADE80]">
                  Winner Gets (95%): {winnerPrize95Percent} Pts
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[0, ...ENTRY_POINT_TIERS].map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setEntryFee(pt)}
                    className={`px-2.5 py-1 rounded-lg border font-mono-num font-black text-[11px] shrink-0 cursor-pointer ${
                      entryFee === pt
                        ? 'bg-[#FACC15] text-[#081A48] border-white'
                        : 'bg-[#0D276B] text-white border-[#FACC15]/40'
                    }`}
                  >
                    {pt === 0 ? 'FREE' : `${pt}`}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-cyan-200 flex items-center justify-between">
                <span>100 Pts = 20 Tk ({takaValue} Tk) • App Fee (5%): {appFee5Percent} Pts</span>
                <span className="text-[#FACC15] font-bold">No Withdraw • Store Shopping Only</span>
              </div>
            </div>
          </div>

          {/* Bottom Two Play Buttons: 'Play' & 'Play - One Token Out -' (Exact Screenshot 3!) */}
          <div className="relative flex flex-col items-center gap-2.5 pt-2 pb-1">
            <button
              onClick={() => setScreen('SELECT_GAME')}
              className="absolute left-0 bottom-1 px-3.5 h-12 rounded-2xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1.5 text-[#FACC15] font-display font-black text-sm shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-lg leading-none">↩</span>
              <span>Back</span>
            </button>

            <button
              onClick={() => handleStartMatch(false)}
              className="w-44 py-2.5 rounded-2xl bg-gradient-to-b from-[#1E40AF] to-[#0A2259] border-[2.5px] border-[#FACC15] shadow-[0_0_14px_rgba(250,204,21,0.5)] font-display font-black italic text-base text-white cursor-pointer hover:scale-105 transition-transform"
            >
              Play
            </button>

            <button
              onClick={() => handleStartMatch(true)}
              className="w-52 py-2 rounded-2xl bg-gradient-to-b from-[#1E40AF] to-[#0A2259] border-[2.5px] border-[#FACC15] shadow-[0_0_14px_rgba(250,204,21,0.5)] text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="font-display font-black italic text-base text-white leading-tight">
                Play
              </div>
              <div className="text-[10px] font-bold italic text-[#FACC15]">- One Token Out -</div>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          EXACT SCREENSHOT 1 (`Screenshot_2026-10-10-22-40-08-275_com.ludo.king.jpg`):
          DEEP CRIMSON RED ONLINE MULTIPLAYER MATCHMAKING SCREEN
          - Translucent Red Overlay with faint Home Icons behind
          - Top-Right Music & Sound Round Blue/Gold Buttons
          - 3D Ludo King Crown Logo + Perspective Board + 4 Pawns
          - Golden 3D 'ONLINE MULTIPLAYER' Title
          - 2-Column Red/Maroon Table: Game Mode (Classic) | Entry Amount (1,000)
          - My Square Avatar (Sunglasses) + My Name + Glowing Gold Treasure Chest
          - Opponent Square Avatars (AshNero / BeeFuzzy / Anggabtr or Random Names)
          - '🔍 SEARCHING FOR PLAYERS...' + Green Stopwatch '00:39' + Red Cancel Button
         ==================================================================== */}
      {screen === 'MATCHMAKING' && (
        <div
          onClick={() => {
            if (selectedMode !== 'FRIENDS') setScreen('BOARD');
          }}
          className="relative z-20 flex-1 flex flex-col items-center justify-between py-3 px-3 w-full max-w-md mx-auto overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(185, 28, 28, 0.96) 0%, rgba(136, 10, 14, 0.97) 58%, rgba(85, 4, 7, 0.99) 100%)'
          }}
        >
          {/* Faint Watermark Home Buttons in Background (Exact as Screenshot 1!) */}
          <div className="pointer-events-none absolute inset-0 opacity-10 flex flex-col justify-center items-center gap-6 px-6">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="h-20 rounded-2xl border-2 border-yellow-400 bg-black/30" />
              <div className="h-20 rounded-2xl border-2 border-yellow-400 bg-black/30" />
              <div className="h-20 rounded-2xl border-2 border-yellow-400 bg-black/30" />
            </div>
            <div className="grid grid-cols-2 gap-6 w-3/4">
              <div className="h-20 rounded-2xl border-2 border-yellow-400 bg-black/30" />
              <div className="h-20 rounded-2xl border-2 border-yellow-400 bg-black/30" />
            </div>
          </div>

          {selectedMode === 'FRIENDS' ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 my-auto max-w-sm w-full rounded-3xl bg-[#5F070A] border-[3px] border-[#FACC15] p-5 text-center space-y-4 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-2 bg-[#3B0305] p-1 rounded-xl border border-[#FACC15]/40">
                <button
                  onClick={() => setFriendsSubTab('CREATE')}
                  className={`py-2 rounded-lg font-display font-black text-xs cursor-pointer ${
                    friendsSubTab === 'CREATE' ? 'bg-[#FACC15] text-[#450A0A]' : 'text-white'
                  }`}
                >
                  CREATE ROOM
                </button>
                <button
                  onClick={() => setFriendsSubTab('JOIN')}
                  className={`py-2 rounded-lg font-display font-black text-xs cursor-pointer ${
                    friendsSubTab === 'JOIN' ? 'bg-[#22C55E] text-[#052E16]' : 'text-white'
                  }`}
                >
                  JOIN ROOM
                </button>
              </div>

              {friendsSubTab === 'CREATE' ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-200">PRIVATE ROOM CODE</div>
                  <div className="text-3xl font-mono-num font-black text-[#FACC15] tracking-widest bg-[#3B0305] py-3 rounded-2xl border-2 border-dashed border-[#FACC15]">
                    {roomCode}
                  </div>
                  <div className="text-xs text-[#4ADE80] font-bold">
                    Entry: {entryFee} Pts • Winner Gets (95%): {winnerPrize95Percent} Pts
                  </div>
                  <button
                    onClick={() => setScreen('BOARD')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#FDE047] to-[#D97706] text-[#450A0A] font-display font-black text-sm cursor-pointer"
                  >
                    Start Room Match Now →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-200">ENTER FRIEND ROOM CODE</div>
                  <input
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="Enter 6-digit code..."
                    className="w-full text-center text-xl font-mono-num font-black text-[#FACC15] bg-[#3B0305] py-3 rounded-2xl border-2 border-[#FACC15] focus:outline-none"
                  />
                  <button
                    onClick={() => setScreen('BOARD')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#4ADE80] to-[#16A34A] text-[#052E16] font-display font-black text-sm cursor-pointer"
                  >
                    Join Room & Play →
                  </button>
                </div>
              )}

              <button
                onClick={() => setScreen('CHOOSE_COLOR')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] text-[#FACC15] font-display font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            </div>
          ) : (
            <>
              {/* Top Section: Back Button + 3D Ludo King Logo + Top-Right Music & Sound Buttons */}
              <div className="relative z-10 w-full flex flex-col items-center pt-1">
                {/* Top Row: Left Back Button & Right Music/Sound Buttons */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-between px-1 mb-0.5"
                >
                  <button
                    onClick={() => setScreen('CHOOSE_COLOR')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] shadow-lg flex items-center gap-1.5 text-[#FACC15] font-display font-black text-xs cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="text-sm leading-none">←</span>
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setSoundOn((s) => !s)}
                      className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1E40AF] to-[#0A2259] border-[2.5px] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.65)] flex items-center justify-center text-[#FACC15] text-base font-black cursor-pointer"
                    >
                      🎵
                    </button>
                    <button
                      onClick={() => setSoundOn((s) => !s)}
                      className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1E40AF] to-[#0A2259] border-[2.5px] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.65)] flex items-center justify-center text-[#FACC15] cursor-pointer"
                    >
                      {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Center 3D Ludo King Logo + Perspective Board */}
                <div className="relative flex items-center justify-center mb-0.5 -mt-3">
                  <svg
                    viewBox="0 0 60 30"
                    className="w-11 h-5 text-[#FACC15] fill-current -rotate-12 absolute -top-4 left-0 drop-shadow"
                  >
                    <path d="M4 26 L8 8 L20 18 L30 4 L40 18 L52 8 L56 26 Z" />
                  </svg>
                  <div className="flex items-center gap-1">
                    {[
                      { ch: 'L', col: 'text-[#008FD5]' },
                      { ch: 'U', col: 'text-[#ED1C24]' },
                      { ch: 'D', col: 'text-[#00A651]' },
                      { ch: 'O', col: 'text-[#F59E0B]' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gradient-to-b from-white to-slate-200 border-2 border-[#F59E0B] shadow-md flex items-center justify-center font-display font-black text-base"
                      >
                        <span className={item.col}>{item.ch}</span>
                      </div>
                    ))}
                  </div>
                  <span className="absolute -top-2.5 right-0 text-[9px] font-display font-black text-[#FACC15] tracking-wider">
                    KING
                  </span>
                </div>

                <div className="relative w-44 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 240 110" className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">
                    <polygon points="45,25 195,25 225,88 15,88" fill="#FFFFFF" stroke="#FACC15" strokeWidth="4" />
                    <polygon points="48,28 105,28 96,52 34,52" fill="#ED1C24" />
                    <polygon points="135,28 192,28 206,52 144,52" fill="#00A651" />
                    <polygon points="30,58 94,58 84,84 20,84" fill="#008FD5" />
                    <polygon points="146,58 210,58 220,84 156,84" fill="#FFDE17" />
                    <polygon points="105,28 135,28 156,84 84,84" fill="#E2E8F0" />
                  </svg>
                  <div className="absolute top-3 w-9 h-9 rounded-xl bg-white border border-slate-300 rotate-12 shadow-xl flex items-center justify-center text-xl">
                    🎲
                  </div>
                  <div className="absolute left-7 top-1 w-5 h-8 rounded-t-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 border border-white/60 shadow" />
                  <div className="absolute right-7 top-1 w-5 h-8 rounded-t-full bg-gradient-to-b from-green-400 via-green-600 to-green-800 border border-white/60 shadow" />
                  <div className="absolute left-1 bottom-0.5 w-7 h-11 rounded-t-full bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 border border-white/80 shadow-lg" />
                  <div className="absolute right-1 bottom-0.5 w-7 h-11 rounded-t-full bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 border border-white/80 shadow-lg" />
                </div>

                {/* Golden 3D Title: ONLINE MULTIPLAYER */}
                <h2 className="font-display font-black text-lg sm:text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] mt-0.5">
                  ONLINE MULTIPLAYER
                </h2>

                {/* 2-Column Red/Maroon Info Table: Game Mode | Entry Amount (Exact Screenshot 1!) */}
                <div className="w-64 sm:w-72 rounded-2xl overflow-hidden border border-red-300/60 shadow-xl mt-1">
                  <div className="grid grid-cols-2 bg-[#B91C1C] border-b border-red-300/40 py-1.5 text-center text-xs font-display font-bold text-white">
                    <div className="border-r border-red-300/30">Game Mode</div>
                    <div>Entry Amount</div>
                  </div>
                  <div className="grid grid-cols-2 bg-[#7A090C] py-2 text-center items-center">
                    <div className="border-r border-red-300/20 flex items-center justify-center gap-1.5 font-display font-black text-sm text-[#FACC15]">
                      <span>🏆</span>
                      <span>
                        {selectedGameType === 'QUICK'
                          ? 'Quick'
                          : selectedGameType === 'TEAM_UP'
                          ? 'Team Up'
                          : 'Classic'}
                      </span>
                    </div>
                    <div className="font-mono-num font-black text-sm sm:text-base text-[#FACC15]">
                      {entryFee > 0 ? entryFee.toLocaleString() : 'FREE'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Section: My Square Avatar + My Name + Glowing Gold Treasure Chest */}
              <div className="relative z-10 flex flex-col items-center my-1">
                <div className="p-1 bg-[#4C0507] border-2 border-white shadow-2xl">
                  <LudoSquareAvatar variant="SUNGLASSES" className="w-20 h-20 sm:w-24 sm:h-24" />
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-white mt-1 drop-shadow">
                  {playerNames.RED}
                </div>

                {/* Glowing Purple & Gold Treasure Chest with Radial Light Rays */}
                <div className="relative w-28 h-24 flex items-center justify-center -my-1">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full opacity-75 animate-pulse"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(254,240,138,0.85) 0%, rgba(250,204,21,0.35) 45%, transparent 72%)'
                    }}
                  />
                  <svg viewBox="0 0 100 85" className="w-20 h-16 relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
                    {/* Chest Base (Purple & Gold) */}
                    <polygon points="18,45 82,45 76,76 24,76" fill="#6B21A8" stroke="#FACC15" strokeWidth="4" />
                    {/* Overflowing Gold Coins */}
                    <ellipse cx="50" cy="43" rx="28" ry="10" fill="#FACC15" />
                    <circle cx="38" cy="40" r="6" fill="#FEF08A" />
                    <circle cx="52" cy="38" r="7" fill="#FDE047" />
                    <circle cx="63" cy="42" r="5.5" fill="#FEF08A" />
                    {/* Open Chest Lid */}
                    <path d="M16 42 Q50 12 84 42 L76 24 Q50 4 24 24 Z" fill="#7E22CE" stroke="#FACC15" strokeWidth="3.5" />
                    {/* Front Gold Lock */}
                    <rect x="44" y="48" width="12" height="15" rx="3" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Bottom Section: Opponent Avatars (1 in 2P, 2 in 3P, 3 in 4P) + Searching Stopwatch */}
              <div className="relative z-10 w-full flex flex-col items-center gap-2 pb-1">
                <div
                  className={`flex items-center justify-center gap-4 sm:gap-6 ${
                    effectivePlayers === 2 ? 'grid-cols-1' : 'grid-cols-3'
                  }`}
                >
                  {/* In 3P/4P: Opponent 1 (GREEN - Sunglasses Avatar) */}
                  {effectivePlayers >= 3 && (
                    <div className="flex flex-col items-center">
                      <div className="p-0.5 bg-[#4C0507] border-2 border-white shadow-lg">
                        <LudoSquareAvatar variant="SUNGLASSES" className="w-16 h-16 sm:w-20 sm:h-20" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1 max-w-[85px] truncate">
                        {playerNames.GREEN}
                      </span>
                    </div>
                  )}

                  {/* In 4P: Opponent 3 (BLUE - Rose Avatar) */}
                  {effectivePlayers >= 4 && (
                    <div className="flex flex-col items-center">
                      <div className="p-0.5 bg-[#4C0507] border-2 border-white shadow-lg">
                        <LudoSquareAvatar variant="ROSE" className="w-16 h-16 sm:w-20 sm:h-20" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1 max-w-[85px] truncate">
                        {playerNames.BLUE}
                      </span>
                    </div>
                  )}

                  {/* Always in 2P, 3P, 4P: Opponent 2 (YELLOW - Silhouette Avatar) */}
                  <div className="flex flex-col items-center">
                    <div className="p-0.5 bg-[#4C0507] border-2 border-white shadow-lg">
                      <LudoSquareAvatar variant="SILHOUETTE" className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <span className="text-[11px] font-bold text-white mt-1 max-w-[95px] truncate">
                      {playerNames.YELLOW}
                    </span>
                  </div>
                </div>

                {/* Magnifying Glass + SEARCHING FOR PLAYERS... */}
                <div className="flex items-center gap-1.5 text-xs font-display font-black italic text-[#FACC15] tracking-wide drop-shadow">
                  <span>🔍</span>
                  <span>SEARCHING FOR PLAYERS...</span>
                </div>

                {/* Green Stopwatch + 00:39 Timer Pill */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#15803D] border-2 border-slate-200 shadow-md flex items-center justify-center text-xs font-black z-10 -mr-2">
                    ⏱️
                  </div>
                  <div className="pl-4 pr-3.5 py-1 rounded-xl bg-[#5A0609] border border-red-400/60 font-mono-num font-black text-sm sm:text-base text-white shadow-inner">
                    00:{matchmakingTimer < 10 ? `0${matchmakingTimer}` : matchmakingTimer}
                  </div>
                </div>
              </div>

              {/* Bottom-Left Cancel / Return Button (Exact Screenshot 1!) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setScreen('CHOOSE_COLOR');
                }}
                className="absolute left-3 bottom-3 px-3 h-11 rounded-2xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1.5 shadow-xl cursor-pointer hover:scale-105 transition-transform"
                title="Cancel Matchmaking & Go Back"
              >
                <span className="w-7 h-7 rounded-full bg-red-600 border border-white flex items-center justify-center text-[#FACC15] font-black text-sm">
                  ↩
                </span>
                <span className="font-display font-black text-xs text-[#FACC15]">Back</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ====================================================================
          EXACT SCREENSHOT 2 (`Screenshot_2026-10-10-22-40-15-625_com.ludo.king.jpg`):
          LUDO KING ONLINE / OFFLINE GAMEPLAY BOARD
          - Top-Left Yard = GREEN, Top-Right Yard = YELLOW, Bottom-Left Yard = RED (Me / You), Bottom-Right Yard = BLUE
          - Gold-Bordered Royal Blue Stepped Player Profile Cards with Square Avatars, Pink-Beige Dice Boxes, 5 Green Dots
          - Gold Coin Stacks above/below cards, Gift Box icons, Speech Bubble above Bottom-Left (Me / You)
         ==================================================================== */}
      {screen === 'BOARD' && (
        <div
          className="relative z-20 flex-1 flex flex-col items-center justify-center py-1 px-1.5 w-full max-w-[370px] sm:max-w-[395px] mx-auto"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, #2563EB 0%, #154099 55%, #091D4E 100%)'
          }}
        >
          {/* Top Action Bar on Board: Prominent Back Button + Match Info + Menu Button */}
          <div className="w-[90vw] max-w-[336px] sm:max-w-[356px] flex items-center justify-between mb-1">
            <button
              onClick={() => setScreen('HOME')}
              className="px-3 py-1 rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border-2 border-[#FACC15] flex items-center gap-1 text-[#FACC15] font-display font-black text-xs shadow-lg cursor-pointer hover:scale-105 transition-transform"
              title="Back to Ludo Home"
            >
              <span className="text-sm leading-none">←</span>
              <span>Back</span>
            </button>

            <div className="px-2.5 py-0.5 rounded-full bg-[#04102E]/90 border border-[#FACC15]/70 text-[10px] font-display font-black text-[#FFE600]">
              🏆 Win: {winnerPrize95Percent} Pts
            </div>

            <button
              onClick={() => setShowBoardMenuModal(true)}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#D97706] border border-white text-[#081A48] font-display font-black text-xs shadow cursor-pointer"
            >
              ☰ Menu
            </button>
          </div>

          {/* Left-Edge Golden Semi-Circle Menu Pull Tab (Exact as Screenshot 2!) */}
          <button
            onClick={() => setShowBoardMenuModal(true)}
            className="absolute left-0 top-[22%] z-30 w-4 h-12 rounded-r-full bg-gradient-to-r from-[#FACC15] to-[#D97706] border-y-2 border-r-2 border-[#FEF08A] flex items-center justify-center text-[#081A48] text-[10px] font-black shadow-lg cursor-pointer"
            title="Game Menu & Instant Win"
          >
            ▶
          </button>

          {/* ================================================================
              TOP 2 PLAYER PROFILE + DICE PANELS (GREEN Top-Left, YELLOW Top-Right)
              EXACT STEPPED BLUE & GOLD CARDS FROM SCREENSHOT 2!
             ================================================================ */}
          <div className="w-[90vw] max-w-[336px] sm:max-w-[356px] flex items-end justify-between mb-0.5">
            {/* TOP-LEFT PANEL: GREEN (Opponent 1 in 3P & 4P — e.g. AshNero) */}
            {activeColors.includes('GREEN') ? (
              <div className="relative flex flex-col items-start">
                {/* Coin Stack Above Top-Left Card */}
                <div className="flex items-center gap-1 mb-0.5 pl-1">
                  <span className="text-xs">🪙</span>
                  <span className="font-mono-num font-black text-xs text-white drop-shadow">2,050</span>
                </div>

                {/* Royal Blue Gold-Bordered Card */}
                <div
                  className={`relative bg-gradient-to-b from-[#1565C0] to-[#0A3875] border-[2px] rounded-xl p-1.5 shadow-xl transition-all ${
                    turn === 'GREEN'
                      ? 'border-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.8)]'
                      : 'border-[#FACC15]'
                  }`}
                >
                  {/* Top-Left Globe Tab */}
                  <div className="w-6 h-4 rounded-sm bg-[#60A5FA] border border-white/60 flex items-center justify-center text-[10px] mb-1">
                    🌍
                  </div>

                  <div className="flex items-start gap-1.5">
                    {/* Left: Square Avatar + Player Name below */}
                    <div className="flex flex-col items-center w-13">
                      <div
                        className={`p-0.5 rounded-sm ${
                          turn === 'GREEN' ? 'bg-[#EF4444]' : 'bg-white/80'
                        }`}
                      >
                        <LudoSquareAvatar variant="SUNGLASSES" className="w-11 h-11" />
                      </div>
                      <span className="text-[10px] font-display font-black text-white truncate w-13 text-center mt-0.5 drop-shadow">
                        {playerNames.GREEN}
                      </span>
                    </div>

                    {/* Right: Pinkish-Beige Dice Recess + 5 Green Dots */}
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#F5D0D6] via-[#EBC2C8] to-[#DFB3BA] border border-slate-700/60 flex items-center justify-center shadow-inner">
                        {turn === 'GREEN' && (
                          <LudoPipDice
                            value={dice}
                            diceColor="GREEN"
                            rolling={rolling}
                            active={turn === 'GREEN' && !hasRolled && !isMovingToken}
                            onClick={() => handleRollDice('GREEN')}
                          />
                        )}
                      </div>
                      {/* 5 Green Dots Row */}
                      <div className="flex items-center gap-0.5 mt-1">
                        {[0, 1, 2, 3, 4].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-[#22C55E] border border-black/50"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Inner Bottom-Right Gift Box Circle (Exact Screenshot 2!) */}
                  <div className="absolute -bottom-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-[#0A3875] border-[1.5px] border-[#FACC15] flex items-center justify-center text-xs shadow">
                    🎁
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-24" />
            )}

            {/* TOP-RIGHT PANEL: YELLOW (Opponent in 2P, Opponent 2 in 3P/4P — e.g. Anggabtr) */}
            {activeColors.includes('YELLOW') ? (
              <div className="relative flex flex-col items-end">
                {/* Coin Stack Above Top-Right Card */}
                <div className="flex items-center gap-1 mb-0.5 pr-1">
                  <span className="font-mono-num font-black text-xs text-white drop-shadow">1,550</span>
                  <span className="text-xs">🪙</span>
                </div>

                {/* Royal Blue Gold-Bordered Card */}
                <div
                  className={`relative bg-gradient-to-b from-[#1565C0] to-[#0A3875] border-[2px] rounded-xl p-1.5 shadow-xl transition-all ${
                    turn === 'YELLOW'
                      ? 'border-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.8)]'
                      : 'border-[#FACC15]'
                  }`}
                >
                  {/* Top-Right Globe Tab */}
                  <div className="w-6 h-4 rounded-sm bg-[#60A5FA] border border-white/60 flex items-center justify-center text-[10px] mb-1 ml-auto">
                    🌍
                  </div>

                  <div className="flex items-start gap-1.5">
                    {/* Left: Pinkish-Beige Dice Recess + 5 Green Dots */}
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#F5D0D6] via-[#EBC2C8] to-[#DFB3BA] border border-slate-700/60 flex items-center justify-center shadow-inner">
                        {turn === 'YELLOW' && (
                          <LudoPipDice
                            value={dice}
                            diceColor="YELLOW"
                            rolling={rolling}
                            active={turn === 'YELLOW' && !hasRolled && !isMovingToken}
                            onClick={() => handleRollDice('YELLOW')}
                          />
                        )}
                      </div>
                      {/* 5 Green Dots Row */}
                      <div className="flex items-center gap-0.5 mt-1">
                        {[0, 1, 2, 3, 4].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-[#22C55E] border border-black/50"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: Square Avatar + Player Name below */}
                    <div className="flex flex-col items-center w-13">
                      <div
                        className={`p-0.5 rounded-sm ${
                          turn === 'YELLOW' ? 'bg-[#EF4444]' : 'bg-white/80'
                        }`}
                      >
                        <LudoSquareAvatar variant="SILHOUETTE" className="w-11 h-11" />
                      </div>
                      <span className="text-[10px] font-display font-black text-white truncate w-13 text-center mt-0.5 drop-shadow">
                        {playerNames.YELLOW}
                      </span>
                    </div>
                  </div>

                  {/* Inner Bottom-Left Gift Box Circle (Exact Screenshot 2!) */}
                  <div className="absolute -bottom-2.5 -left-2.5 z-30 w-6 h-6 rounded-full bg-[#0A3875] border-[1.5px] border-[#FACC15] flex items-center justify-center text-xs shadow">
                    🎁
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-24" />
            )}
          </div>

          {/* ================================================================
              15x15 LUDO KING BOARD (EXACT SCREENSHOT 2 QUADRANT COLORS!)
              Top-Left = GREEN, Top-Right = YELLOW, Bottom-Left = RED (Me / You), Bottom-Right = BLUE
             ================================================================ */}
          <div className="w-[92vw] max-w-[346px] sm:max-w-[366px] aspect-square bg-white border-[2px] border-slate-800 shadow-[0_0_25px_rgba(0,0,0,0.8)] grid grid-cols-15 grid-rows-15 relative overflow-visible">
            {/* Top-Left GREEN Yard Overlay (Large circular slots & large 3D tokens!) */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] z-10 bg-[#009A44] border-r-[1.5px] border-b-[1.5px] border-slate-800 flex items-center justify-center p-2 sm:p-2.5">
              <div className="w-full h-full bg-white border border-slate-400 grid grid-cols-2 grid-rows-2 place-items-center p-1">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const inYard = activeColors.includes('GREEN') && tokens.GREEN[slotIdx] === -1;
                  const canClick =
                    inYard &&
                    !isMovingToken &&
                    selectedMode === 'PASS_N_PLAY' &&
                    turn === 'GREEN' &&
                    hasRolled &&
                    canMoveToken('GREEN', slotIdx, dice);
                  const isHopping =
                    hoppingToken?.color === 'GREEN' && hoppingToken?.idx === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => {
                        if (canClick) executeTokenMove('GREEN', slotIdx, dice);
                      }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3.5px] border-[#009A44] bg-[#007A33] flex items-center justify-center relative shadow-inner ${
                        canClick ? 'cursor-pointer ring-3 ring-[#FFE600]' : ''
                      }`}
                    >
                      {inYard && (
                        <div className="-mt-3">
                          <LudoTeardropPin
                            color="GREEN"
                            size="md"
                            glowing={canClick}
                            hopping={isHopping}
                            onClick={() => {
                              if (canClick) executeTokenMove('GREEN', slotIdx, dice);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top-Right YELLOW Yard Overlay (Large circular slots & large 3D tokens!) */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] z-10 bg-[#FFDE17] border-l-[1.5px] border-b-[1.5px] border-slate-800 flex items-center justify-center p-2 sm:p-2.5">
              <div className="w-full h-full bg-white border border-slate-400 grid grid-cols-2 grid-rows-2 place-items-center p-1">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const inYard = activeColors.includes('YELLOW') && tokens.YELLOW[slotIdx] === -1;
                  const canClick =
                    inYard &&
                    !isMovingToken &&
                    selectedMode === 'PASS_N_PLAY' &&
                    turn === 'YELLOW' &&
                    hasRolled &&
                    canMoveToken('YELLOW', slotIdx, dice);
                  const isHopping =
                    hoppingToken?.color === 'YELLOW' && hoppingToken?.idx === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => {
                        if (canClick) executeTokenMove('YELLOW', slotIdx, dice);
                      }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3.5px] border-[#EAB308] bg-[#CA8A04] flex items-center justify-center relative shadow-inner ${
                        canClick ? 'cursor-pointer ring-3 ring-[#00FF66]' : ''
                      }`}
                    >
                      {inYard && (
                        <div className="-mt-3">
                          <LudoTeardropPin
                            color="YELLOW"
                            size="md"
                            glowing={canClick}
                            hopping={isHopping}
                            onClick={() => {
                              if (canClick) executeTokenMove('YELLOW', slotIdx, dice);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom-Left RED Yard Overlay (ALWAYS MY SEAT: "Me / You" — Large circular slots & large 3D tokens!) */}
            <div
              onClick={() => {
                if (!isMovingToken && turn === 'RED' && hasRolled && dice === 6) {
                  const yardIdx = [0, 1, 2, 3].find((i) => tokens.RED[i] === -1);
                  if (yardIdx !== undefined) {
                    executeTokenMove('RED', yardIdx, dice);
                  }
                }
              }}
              className="absolute bottom-0 left-0 w-[40%] h-[40%] z-10 bg-[#EA1D24] border-r-[1.5px] border-t-[1.5px] border-slate-800 flex items-center justify-center p-2 sm:p-2.5"
            >
              <div className="w-full h-full bg-white border border-slate-400 grid grid-cols-2 grid-rows-2 place-items-center p-1">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const inYard = activeColors.includes('RED') && tokens.RED[slotIdx] === -1;
                  const canClick =
                    inYard &&
                    !isMovingToken &&
                    turn === 'RED' &&
                    hasRolled &&
                    canMoveToken('RED', slotIdx, dice);
                  const isHopping =
                    hoppingToken?.color === 'RED' && hoppingToken?.idx === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canClick) executeTokenMove('RED', slotIdx, dice);
                      }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3.5px] border-[#EA1D24] bg-[#B91C1C] flex items-center justify-center relative shadow-inner ${
                        canClick ? 'cursor-pointer ring-3 ring-[#FFE600]' : ''
                      }`}
                    >
                      {inYard && (
                        <div className="-mt-3">
                          <LudoTeardropPin
                            color="RED"
                            size="md"
                            glowing={canClick}
                            hopping={isHopping}
                            onClick={() => {
                              if (canClick) executeTokenMove('RED', slotIdx, dice);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom-Right BLUE Yard Overlay (Large circular slots & large 3D tokens!) */}
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] z-10 bg-[#24B0FF] border-l-[1.5px] border-t-[1.5px] border-slate-800 flex items-center justify-center p-2 sm:p-2.5">
              <div className="w-full h-full bg-white border border-slate-400 grid grid-cols-2 grid-rows-2 place-items-center p-1">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const inYard = activeColors.includes('BLUE') && tokens.BLUE[slotIdx] === -1;
                  const canClick =
                    inYard &&
                    !isMovingToken &&
                    selectedMode === 'PASS_N_PLAY' &&
                    turn === 'BLUE' &&
                    hasRolled &&
                    canMoveToken('BLUE', slotIdx, dice);
                  const isHopping =
                    hoppingToken?.color === 'BLUE' && hoppingToken?.idx === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => {
                        if (canClick) executeTokenMove('BLUE', slotIdx, dice);
                      }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3.5px] border-[#24B0FF] bg-[#0284C7] flex items-center justify-center relative shadow-inner ${
                        canClick ? 'cursor-pointer ring-3 ring-[#FFE600]' : ''
                      }`}
                    >
                      {inYard && (
                        <div className="-mt-3">
                          <LudoTeardropPin
                            color="BLUE"
                            size="md"
                            glowing={canClick}
                            hopping={isHopping}
                            onClick={() => {
                              if (canClick) executeTokenMove('BLUE', slotIdx, dice);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center 3x3 4-Color Home Triangles SVG Overlay (Left=GREEN, Top=YELLOW, Right=BLUE, Bottom=RED — Exact Screenshot 2!) */}
            <div className="pointer-events-none absolute left-[40%] top-[40%] w-[20%] h-[20%] z-10 border-[1.5px] border-slate-800">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="0,0 50,50 0,100" fill="#009A44" stroke="#1E293B" strokeWidth="2" />
                <polygon points="0,0 100,0 50,50" fill="#FFDE17" stroke="#1E293B" strokeWidth="2" />
                <polygon points="100,0 100,100 50,50" fill="#24B0FF" stroke="#1E293B" strokeWidth="2" />
                <polygon points="0,100 100,100 50,50" fill="#EA1D24" stroke="#1E293B" strokeWidth="2" />
              </svg>
            </div>

            {/* 15x15 Cells + Teardrop Pin Tokens */}
            {Array.from({ length: 15 }).map((_, r) =>
              Array.from({ length: 15 }).map((__, c) => {
                let cellBg = 'bg-[#FFFFFF] border-[0.5px] border-slate-500/80';
                const inYard =
                  (r < 6 && c < 6) ||
                  (r < 6 && c > 8) ||
                  (r > 8 && c < 6) ||
                  (r > 8 && c > 8);
                const inCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

                if (inYard || inCenter) {
                  cellBg = 'bg-transparent border-none';
                } else if (r === 7 && c >= 1 && c <= 5) {
                  cellBg = 'bg-[#009A44] border-[0.5px] border-slate-700'; // Left GREEN home lane
                } else if (c === 7 && r >= 1 && r <= 5) {
                  cellBg = 'bg-[#FFDE17] border-[0.5px] border-slate-700'; // Top YELLOW home lane
                } else if (r === 7 && c >= 9 && c <= 13) {
                  cellBg = 'bg-[#24B0FF] border-[0.5px] border-slate-700'; // Right BLUE home lane
                } else if (c === 7 && r >= 9 && r <= 13) {
                  cellBg = 'bg-[#EA1D24] border-[0.5px] border-slate-700'; // Bottom RED home lane
                } else if (r === 6 && c === 1) {
                  cellBg = 'bg-[#009A44] border-[0.5px] border-slate-700'; // GREEN start cell
                } else if (r === 1 && c === 8) {
                  cellBg = 'bg-[#FFDE17] border-[0.5px] border-slate-700'; // YELLOW start cell
                } else if (r === 8 && c === 13) {
                  cellBg = 'bg-[#24B0FF] border-[0.5px] border-slate-700'; // BLUE start cell
                } else if (r === 13 && c === 6) {
                  cellBg = 'bg-[#EA1D24] border-[0.5px] border-slate-700'; // RED start cell
                }

                // Collect tokens on this (r, c) — yard tokens (step === -1) are rendered directly inside the 4 yard circles above
                const cellTokens: { color: LudoColor; idx: number }[] = [];
                activeColors.forEach((col) => {
                  tokens[col].forEach((step, idx) => {
                    if (step === -1) return;
                    const [tr, tc] = getTokenGridCoord(col, step, idx);
                    if (tr === r && tc === c) {
                      cellTokens.push({ color: col, idx });
                    }
                  });
                });

                const isStarCell =
                  (r === 8 && c === 2) ||
                  (r === 2 && c === 6) ||
                  (r === 6 && c === 12) ||
                  (r === 12 && c === 8);

                const multiInCell = cellTokens.length > 1;
                const clickableCellToken = cellTokens.find(
                  (tk) =>
                    !isMovingToken &&
                    (tk.color === 'RED' || selectedMode === 'PASS_N_PLAY') &&
                    turn === tk.color &&
                    hasRolled &&
                    canMoveToken(tk.color, tk.idx, dice)
                );

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      if (clickableCellToken) {
                        executeTokenMove(clickableCellToken.color, clickableCellToken.idx, dice);
                      }
                    }}
                    className={`relative flex items-center justify-center ${cellBg} ${
                      clickableCellToken ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* Start Cell Entry Arrows (Exact Screenshot 2 Colors!) */}
                    {r === 7 && c === 0 && <span className="text-[11px] text-[#009A44] font-black">→</span>}
                    {r === 0 && c === 7 && <span className="text-[11px] text-[#D97706] font-black">↓</span>}
                    {r === 7 && c === 14 && <span className="text-[11px] text-[#0284C7] font-black">←</span>}
                    {r === 14 && c === 7 && <span className="text-[11px] text-[#EA1D24] font-black">↑</span>}

                    {/* Star Safe Spots (Outline Star like Screenshot 2!) */}
                    {isStarCell && cellTokens.length === 0 && (
                      <span className="text-xs text-slate-600 font-normal leading-none">☆</span>
                    )}

                    {/* Render Teardrop Pin Tokens */}
                    {cellTokens.length > 0 && (
                      <div
                        className={`relative z-30 flex items-center justify-center ${
                          multiInCell ? '-space-x-3 -mt-2' : '-mt-3'
                        }`}
                      >
                        {cellTokens.map((tk, i) => {
                          const canClick =
                            !isMovingToken &&
                            (tk.color === 'RED' || selectedMode === 'PASS_N_PLAY') &&
                            turn === tk.color &&
                            hasRolled &&
                            canMoveToken(tk.color, tk.idx, dice);
                          const isHopping =
                            hoppingToken?.color === tk.color && hoppingToken?.idx === tk.idx;

                          return (
                            <div key={`${tk.color}-${tk.idx}-${i}`} className="relative">
                              <LudoTeardropPin
                                color={tk.color}
                                size={multiInCell ? 'xs' : 'sm'}
                                glowing={canClick}
                                hopping={isHopping}
                                onClick={() => {
                                  if (canClick) executeTokenMove(tk.color, tk.idx, dice);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ================================================================
              BOTTOM 2 PLAYER PROFILE + DICE PANELS
              - Bottom-Left = RED (ALWAYS MY SEAT: "Me / You" + Speech Bubble + Coins & Diamonds!)
              - Bottom-Right = BLUE (Opponent 3 in 4P — e.g. BeeFuzzy + Country Flag + Gift Box!)
             ================================================================ */}
          <div className="w-[90vw] max-w-[336px] sm:max-w-[356px] flex items-start justify-between mt-0.5">
            {/* BOTTOM-LEFT PANEL: RED (ALWAYS MY SEAT: "Me / You") */}
            <div className="relative flex flex-col items-start">
              {/* White Oval Chat Speech Bubble Above Top-Left of My Panel (Exact Screenshot 2!) */}
              <button
                onClick={() => setShowBoardMenuModal(true)}
                className=" -mt-2.5 mb-0.5 ml-0.5 z-30 w-8 h-6 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black text-xs shadow cursor-pointer"
                title="Quick Chat & Game Menu"
              >
                •••
              </button>

              {/* Royal Blue Gold-Bordered Card */}
              <div
                className={`relative bg-gradient-to-b from-[#1565C0] to-[#0A3875] border-[2px] rounded-xl p-1.5 shadow-xl transition-all ${
                  turn === 'RED'
                    ? 'border-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.85)]'
                    : 'border-[#FACC15]'
                }`}
              >
                {/* Top-Left Globe Tab */}
                <div className="w-6 h-4 rounded-sm bg-[#60A5FA] border border-white/60 flex items-center justify-center text-[10px] mb-1">
                  🌍
                </div>

                <div className="flex items-start gap-1.5">
                  {/* Left: My Square Avatar + My Name ("Me / You") below */}
                  <div className="flex flex-col items-center w-13">
                    <div
                      className={`p-0.5 rounded-sm ${
                        turn === 'RED' ? 'bg-[#22C55E]' : 'bg-white/90'
                      }`}
                    >
                      <LudoSquareAvatar variant="SUNGLASSES" className="w-11 h-11" />
                    </div>
                    <span className="text-[10px] font-display font-black text-white truncate w-13 text-center mt-0.5 drop-shadow">
                      {playerNames.RED}
                    </span>
                  </div>

                  {/* Right: Pinkish-Beige Dice Recess + 5 Green Dots */}
                  <div className="flex flex-col items-center">
                    <div
                      onClick={() => handleRollDice('RED')}
                      className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#F5D0D6] via-[#EBC2C8] to-[#DFB3BA] border border-slate-700/60 flex items-center justify-center shadow-inner cursor-pointer"
                    >
                      {turn === 'RED' && (
                        <LudoPipDice
                          value={dice}
                          diceColor="RED"
                          rolling={rolling}
                          active={turn === 'RED' && !hasRolled && !isMovingToken}
                          onClick={() => handleRollDice('RED')}
                        />
                      )}
                    </div>
                    {/* 5 Green Dots Row */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[0, 1, 2, 3, 4].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-[#22C55E] border border-black/50"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coins & Diamonds Below My Bottom-Left Panel + Quick Buy/Shop (Exact Screenshot 2!) */}
              <div className="flex flex-col items-start mt-0.5 pl-1 gap-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs">🪙</span>
                  <span className="font-mono-num font-black text-xs text-white drop-shadow">
                    {points.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setPointHubTab('BUY');
                      setPointHubNotice(null);
                      setHomeModal('POINT_HUB');
                    }}
                    className="ml-1 px-1.5 py-0.2 rounded bg-[#22C55E] text-[#052E16] font-display font-black text-[9px] cursor-pointer"
                  >
                    +Buy
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">💎</span>
                  <span className="font-mono-num font-black text-[11px] text-white drop-shadow">50</span>
                  <button
                    onClick={() => {
                      setPointHubTab('SHOP');
                      setPointHubNotice(null);
                      setHomeModal('POINT_HUB');
                    }}
                    className="ml-1 px-1.5 py-0.2 rounded bg-[#FACC15] text-[#081A48] font-display font-black text-[9px] cursor-pointer"
                  >
                    🛒Shop
                  </button>
                  <button
                    onClick={() => setScreen('HOME')}
                    className="ml-1 px-2 py-0.5 rounded-lg bg-gradient-to-b from-[#1D4ED8] to-[#0A2463] border border-[#FACC15] text-[#FACC15] font-display font-black text-[10px] flex items-center gap-0.5 cursor-pointer shadow"
                  >
                    <span>↩</span>
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM-RIGHT PANEL: BLUE (Opponent 3 in 4P Mode — e.g. BeeFuzzy) */}
            {activeColors.includes('BLUE') ? (
              <div className="relative flex flex-col items-end mt-3.5">
                {/* Royal Blue Gold-Bordered Card */}
                <div
                  className={`relative bg-gradient-to-b from-[#1565C0] to-[#0A3875] border-[2px] rounded-xl p-1.5 shadow-xl transition-all ${
                    turn === 'BLUE'
                      ? 'border-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.8)]'
                      : 'border-[#FACC15]'
                  }`}
                >
                  {/* Inner Top-Left Gift Box Circle (Exact Screenshot 2!) */}
                  <div className="absolute -top-2.5 -left-2.5 z-30 w-6 h-6 rounded-full bg-[#0A3875] border-[1.5px] border-[#FACC15] flex items-center justify-center text-xs shadow">
                    🎁
                  </div>

                  {/* Top-Right Country Name + Flag Header (Exact Screenshot 2!) */}
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <span className="text-[9px] font-bold text-white">Indonesia</span>
                    <span className="w-5 h-3.5 rounded-xs overflow-hidden border border-white/60 inline-flex flex-col">
                      <span className="h-1/2 w-full bg-[#EF4444]" />
                      <span className="h-1/2 w-full bg-white" />
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    {/* Left: Pinkish-Beige Dice Recess + 5 Green Dots */}
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#F5D0D6] via-[#EBC2C8] to-[#DFB3BA] border border-slate-700/60 flex items-center justify-center shadow-inner">
                        {turn === 'BLUE' && (
                          <LudoPipDice
                            value={dice}
                            diceColor="BLUE"
                            rolling={rolling}
                            active={turn === 'BLUE' && !hasRolled && !isMovingToken}
                            onClick={() => handleRollDice('BLUE')}
                          />
                        )}
                      </div>
                      {/* 5 Green Dots Row */}
                      <div className="flex items-center gap-0.5 mt-1">
                        {[0, 1, 2, 3, 4].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-[#22C55E] border border-black/50"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: Square Rose Avatar + Player Name below */}
                    <div className="flex flex-col items-center w-13">
                      <div
                        className={`p-0.5 rounded-sm ${
                          turn === 'BLUE' ? 'bg-[#EF4444]' : 'bg-white/80'
                        }`}
                      >
                        <LudoSquareAvatar variant="ROSE" className="w-11 h-11" />
                      </div>
                      <span className="text-[10px] font-display font-black text-white truncate w-13 text-center mt-0.5 drop-shadow">
                        {playerNames.BLUE}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coin Stack Below Bottom-Right Card */}
                <div className="flex items-center gap-1 mt-0.5 pr-1">
                  <span className="font-mono-num font-black text-xs text-white drop-shadow">1,175</span>
                  <span className="text-xs">🪙</span>
                </div>
              </div>
            ) : (
              <div className="h-24" />
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SNAKES & LADDERS BOARD (FROM HOME SNAKE BUTTON)
         ==================================================================== */}
      {screen === 'SNAKES_BOARD' && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-3 max-w-md w-full mx-auto space-y-3">
          <div className="w-full flex items-center justify-between bg-[#081A48] border-2 border-[#FACC15] rounded-2xl p-3">
            <span className="font-display font-black text-sm text-[#FACC15]">🐍 SNAKES & LADDERS</span>
            <button
              onClick={() => setScreen('HOME')}
              className="px-3 py-1 rounded-lg bg-[#FACC15] text-[#081A48] font-display font-black text-xs cursor-pointer"
            >
              Exit
            </button>
          </div>

          <div className="w-full grid grid-cols-10 gap-1 bg-white p-2 rounded-2xl border-4 border-[#FACC15]">
            {Array.from({ length: 100 }).map((_, idx) => {
              const sq = 100 - idx;
              const hasP1 = snakePos.p1 === sq;
              const hasP2 = snakePos.p2 === sq;
              return (
                <div
                  key={sq}
                  className={`aspect-square rounded flex flex-col items-center justify-center text-[9px] font-mono-num font-bold ${
                    sq % 2 === 0 ? 'bg-amber-100 text-slate-900' : 'bg-sky-100 text-slate-900'
                  }`}
                >
                  <span>{sq}</span>
                  <div className="flex gap-0.5">
                    {hasP1 && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    {hasP2 && <span className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs font-bold text-[#FACC15]">{snakeNote}</div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const r = Math.floor(Math.random() * 6) + 1;
                const next = Math.min(100, snakePos.p1 + r);
                setSnakePos({ ...snakePos, p1: next });
                setSnakeNote(`You rolled ${r} → Square ${next}`);
                if (next === 100) handleInstantDemoWin();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#FACC15] text-[#081A48] font-display font-black text-xs cursor-pointer"
            >
              🎲 Roll Dice
            </button>
            <button
              onClick={handleInstantDemoWin}
              className="px-4 py-2.5 rounded-xl bg-[#22C55E] text-[#081A48] font-display font-black text-xs cursor-pointer"
            >
              ⚡ Instant Win
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          FINAL WINNER CROWN & 95% PRIZE DISTRIBUTION SCREEN
         ==================================================================== */}
      {screen === 'WINNER' && (
        <div className="relative z-20 flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] p-6 text-center space-y-4 shadow-2xl">
            <div className="text-5xl">👑</div>
            <h2 className="text-2xl font-display font-black text-[#FACC15]">
              CONGRATULATIONS!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white">
              Winner: <strong className="text-[#4ADE80]">{winner ? playerNames[winner] : 'Player 1'}</strong>
            </p>

            <div className="rounded-2xl bg-[#04102E] border-2 border-[#4ADE80] p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-sky-200">Total Match Pot:</span>
                <span className="font-mono-num font-bold text-white">{totalPot} Pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300">App Fee (5%):</span>
                <span className="font-mono-num font-bold text-amber-300">-{appFee5Percent} Pts</span>
              </div>
              <div className="pt-2 border-t border-white/15 flex justify-between text-sm font-display font-black text-[#4ADE80]">
                <span>🏆 WINNER PRIZE (95%):</span>
                <span className="font-mono-num">+{winnerPrize95Percent} Pts!</span>
              </div>
              <div className="text-[10px] text-[#FACC15] pt-1">
                ১০০ পয়েন্ট = ২০ টাকা • এই পয়েন্ট উইথড্র করা যাবে না, সরাসরি Sports Store থেকে শপিং করুন!
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              {onGoToStore && (
                <button
                  onClick={onGoToStore}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#D97706] text-[#081A48] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop with Points →</span>
                </button>
              )}
              <button
                onClick={() => setScreen('CHOOSE_COLOR')}
                className="px-4 py-2.5 rounded-xl bg-[#22C55E] text-[#081A48] font-display font-black text-xs cursor-pointer"
              >
                Play Again
              </button>
              <button
                onClick={() => setScreen('HOME')}
                className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-display font-black text-xs cursor-pointer"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          BOARD MENU MODAL (WHEN CLICKING BOTTOM-LEFT LIST BUTTON ON SCREENSHOT 4)
         ==================================================================== */}
      {showBoardMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] max-w-sm w-full p-5 space-y-3 text-center">
            <h3 className="text-base font-display font-black text-[#FACC15]">LUDO KING GAME MENU</h3>
            <button
              onClick={() => setShowBoardMenuModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1D4ED8] border border-[#FACC15] text-xs font-display font-black text-white cursor-pointer"
            >
              Resume Game
            </button>
            <button
              onClick={handleInstantDemoWin}
              className="w-full py-2.5 rounded-xl bg-[#22C55E] text-[#081A48] text-xs font-display font-black cursor-pointer"
            >
              ⚡ Instant Win ({winnerPrize95Percent} Pts)
            </button>
            <button
              onClick={() => {
                setShowBoardMenuModal(false);
                setScreen('CHOOSE_COLOR');
              }}
              className="w-full py-2.5 rounded-xl bg-[#0D276B] border border-[#FACC15] text-[#FACC15] text-xs font-display font-black cursor-pointer"
            >
              ← Back to Color & Player Setup
            </button>
            <button
              onClick={() => {
                setShowBoardMenuModal(false);
                setScreen('HOME');
              }}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-display font-black cursor-pointer"
            >
              ← Back to Ludo King Home
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          HOME MODALS (POINT_HUB [BUY POINTS & SHOP], SPIN, RULES, SEASON 27, 7 UP DOWN)
         ==================================================================== */}
      {homeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] max-w-md w-full p-4 sm:p-5 space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/15 pb-2 gap-2">
              <button
                onClick={() => setHomeModal(null)}
                className="px-2.5 py-1 rounded-xl bg-[#1D4ED8] border border-[#FACC15] text-[#FACC15] font-display font-black text-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <h3 className="text-xs sm:text-sm font-display font-black text-[#FACC15] text-center flex-1">
                {homeModal === 'POINT_HUB'
                  ? '🪙 LUDO KING POINT STORE & SHOPPING'
                  : homeModal === 'RULES'
                  ? '📜 LUDO KING RULES & POINT POLICY'
                  : homeModal === 'SPIN'
                  ? '🎡 DAILY LUCKY SPIN WHEEL'
                  : homeModal === 'SEASON_CLAIM'
                  ? '👑 SEASON 27 REWARD CLAIM'
                  : homeModal === 'SEVEN_UP'
                  ? '🎲 7 UP & DOWN MINI GAME'
                  : '🎁 STARTER PACK'}
              </h3>
              <button
                onClick={() => setHomeModal(null)}
                className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {homeModal === 'POINT_HUB' && (
              <div className="space-y-3 text-xs">
                {/* Current Balance Banner */}
                <div className="p-3 rounded-2xl bg-[#04102E] border-2 border-[#FACC15] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-sky-200 font-bold">MY LUDO KING WALLET</div>
                    <div className="text-xl font-mono-num font-black text-[#FFE600]">
                      🪙 {points.toLocaleString()} Points
                    </div>
                    <div className="text-[10px] text-[#4ADE80] font-bold">
                      ১০০ পয়েন্ট = ২০ টাকা • খেলা, মোবাইল রিচার্জ ও কেনাকাটার জন্য (নো ক্যাশ উইথড্র)
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setHomeModal(null);
                      onOpenDeposit();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#1D4ED8] border border-[#FACC15] text-[10px] font-display font-black text-white cursor-pointer"
                  >
                    bKash TrxID ফর্ম
                  </button>
                </div>

                {/* 3 Tabs: MOBILE RECHARGE (FIRST) | BUY POINTS | SHOP WITH POINTS */}
                <div className="grid grid-cols-3 gap-1.5 bg-[#04102E] p-1 rounded-xl border border-[#FACC15]/40">
                  <button
                    onClick={() => {
                      setPointHubTab('RECHARGE');
                      setPointHubNotice(null);
                    }}
                    className={`py-2 px-1 rounded-lg font-display font-black text-[11px] cursor-pointer transition-all ${
                      pointHubTab === 'RECHARGE'
                        ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white border border-[#FFE600] shadow'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    📱 মোবাইল রিচার্জ
                  </button>
                  <button
                    onClick={() => {
                      setPointHubTab('BUY');
                      setPointHubNotice(null);
                    }}
                    className={`py-2 px-1 rounded-lg font-display font-black text-[11px] cursor-pointer transition-all ${
                      pointHubTab === 'BUY'
                        ? 'bg-[#FFE600] text-[#081A48] shadow'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    ➕ পয়েন্ট কিনুন
                  </button>
                  <button
                    onClick={() => {
                      setPointHubTab('SHOP');
                      setPointHubNotice(null);
                    }}
                    className={`py-2 px-1 rounded-lg font-display font-black text-[11px] cursor-pointer transition-all ${
                      pointHubTab === 'SHOP'
                        ? 'bg-[#00DC58] text-[#05183C] shadow'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    🛍️ কেনাকাটা (Shop)
                  </button>
                </div>

                {pointHubNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-[#00FF66] text-[#00FF66] font-bold text-center">
                    {pointHubNotice}
                  </div>
                )}

                {pointHubTab === 'BUY' ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-1.5">
                      {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
                        <button
                          key={gw}
                          onClick={() => setSelectedPayGateway(gw)}
                          className={`flex-1 py-1.5 rounded-xl border font-display font-black text-xs cursor-pointer ${
                            selectedPayGateway === gw
                              ? 'bg-[#FFE600] text-[#081A48] border-white'
                              : 'bg-[#04102E] text-white border-white/20'
                          }`}
                        >
                          {gw}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { pts: 100, tk: 20 },
                        { pts: 250, tk: 50 },
                        { pts: 500, tk: 100 },
                        { pts: 1000, tk: 200 },
                        { pts: 2500, tk: 500 },
                        { pts: 5000, tk: 1000 }
                      ].map((pkg) => (
                        <button
                          key={pkg.pts}
                          onClick={() => {
                            setPoints((p) => p + pkg.pts);
                            playLudoSound('HOME_REACH');
                            setPointHubNotice(
                              `✔ ${selectedPayGateway}-এ ৳${pkg.tk} পেমেন্টে +${pkg.pts} পয়েন্ট যোগ হয়েছে! এখন খেলুন, মোবাইল রিচার্জ বা শপিং করুন।`
                            );
                          }}
                          className="p-2.5 rounded-2xl bg-gradient-to-b from-[#15469B] to-[#092058] border-2 border-[#FACC15] hover:scale-[1.02] transition-transform text-left cursor-pointer"
                        >
                          <div className="font-mono-num font-black text-sm text-[#FFE600]">
                            🪙 +{pkg.pts} Pts
                          </div>
                          <div className="text-[11px] font-bold text-white mt-0.5">
                            মূল্য: ৳{pkg.tk} টাকা
                          </div>
                          <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-[#00DC58] text-[#05183C] font-display font-black text-[10px]">
                            Buy with {selectedPayGateway} →
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : pointHubTab === 'RECHARGE' ? (
                  /* ==========================================================
                     DEDICATED MOBILE RECHARGE WITH POINTS TAB (100 Pts = 20 Tk)
                     ========================================================== */
                  <div className="space-y-3 bg-[#04102E] border-2 border-[#38BDF8] rounded-2xl p-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="font-display font-black text-xs sm:text-sm text-[#FFE600] flex items-center gap-1.5">
                        <span>📱</span>
                        <span>পয়েন্ট দিয়ে মোবাইল রিচার্জ (Mobile Recharge)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#00DC58]/20 border border-[#00DC58] text-[#4ADE80] font-mono-num font-black text-[10px]">
                        100 Pts = ৳20
                      </span>
                    </div>

                    {/* Step 1: Select Operator */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-sky-200 block">
                        ১. অপারেটর সিলেক্ট করুন (Select Operator):
                      </label>
                      <div className="grid grid-cols-5 gap-1">
                        {(
                          [
                            { id: 'Grameenphone', short: 'GP', code: '017/013', bg: 'from-sky-500 to-blue-700' },
                            { id: 'Robi', short: 'Robi', code: '018', bg: 'from-red-500 to-rose-700' },
                            { id: 'Banglalink', short: 'BL', code: '019/014', bg: 'from-orange-500 to-amber-700' },
                            { id: 'Airtel', short: 'Airtel', code: '016', bg: 'from-rose-500 to-red-800' },
                            { id: 'Teletalk', short: 'Teletalk', code: '015', bg: 'from-emerald-500 to-green-700' }
                          ] as const
                        ).map((op) => {
                          const active = rechargeOperator === op.id;
                          return (
                            <button
                              key={op.id}
                              type="button"
                              onClick={() => setRechargeOperator(op.id)}
                              className={`py-1.5 px-1 rounded-xl border text-center cursor-pointer transition-all ${
                                active
                                  ? `bg-gradient-to-b ${op.bg} border-[#FFE600] scale-105 shadow-[0_0_10px_rgba(255,230,0,0.5)]`
                                  : 'bg-[#081A48] border-white/15 opacity-80 hover:opacity-100'
                              }`}
                            >
                              <div className="font-display font-black text-[10px] text-white leading-tight">
                                {op.short}
                              </div>
                              <div className="text-[8px] text-yellow-200 font-mono-num">{op.code}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Mobile Number & Prepaid/Postpaid */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-sky-200">
                          ২. মোবাইল নাম্বার দিন (১১ ডিজিট):
                        </label>
                        <div className="flex items-center gap-1">
                          {(['Prepaid', 'Postpaid'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setRechargeSimType(st)}
                              className={`px-2 py-0.5 rounded text-[9px] font-display font-black cursor-pointer border ${
                                rechargeSimType === st
                                  ? 'bg-[#FFE600] text-[#081A48] border-white'
                                  : 'bg-[#081A48] text-white/80 border-white/20'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="tel"
                        value={rechargePhone}
                        onChange={(e) => handlePhoneInputChange(e.target.value)}
                        placeholder="017XXXXXXXX (মোবাইল নাম্বার লিখুন)"
                        maxLength={11}
                        className="w-full px-3 py-2 rounded-xl bg-white text-slate-950 font-mono-num font-black text-sm border-2 border-[#FFE600] focus:outline-none"
                      />
                    </div>

                    {/* Step 3: Select Recharge Package (Points -> Taka) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-sky-200 block">
                        ৩. রিচার্জের পরিমাণ সিলেক্ট করুন (১০০ পয়েন্ট = ২০ টাকা):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { tk: 20, pts: 100 },
                          { tk: 30, pts: 150 },
                          { tk: 50, pts: 250 },
                          { tk: 100, pts: 500 },
                          { tk: 200, pts: 1000 },
                          { tk: 500, pts: 2500 }
                        ].map((item) => {
                          const isSel = selectedRechargePkg.pts === item.pts;
                          return (
                            <button
                              key={item.pts}
                              type="button"
                              onClick={() => setSelectedRechargePkg(item)}
                              className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${
                                isSel
                                  ? 'bg-gradient-to-b from-[#FFE600] to-[#D97706] text-[#081A48] border-white shadow-md scale-[1.03]'
                                  : 'bg-[#081A48] text-white border-[#FACC15]/50 hover:border-[#FACC15]'
                              }`}
                            >
                              <div className="font-mono-num font-black text-sm leading-tight">
                                ৳{item.tk} টাকা
                              </div>
                              <div
                                className={`text-[10px] font-mono-num font-black mt-0.5 ${
                                  isSel ? 'text-[#081A48]' : 'text-[#FFE600]'
                                }`}
                              >
                                🪙 {item.pts} Pts
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Confirm Mobile Recharge Button */}
                    <button
                      type="button"
                      onClick={() => handleMobileRechargeWithPoints()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00DC58] via-[#22C55E] to-[#16A34A] border-2 border-white text-[#04102E] font-display font-black text-xs sm:text-sm shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
                    >
                      📲 {selectedRechargePkg.pts} পয়েন্ট দিয়ে ৳{selectedRechargePkg.tk} মোবাইল রিচার্জ করুন →
                    </button>

                    {/* Recent Mobile Recharges List */}
                    {rechargeHistory.length > 0 && (
                      <div className="pt-2 border-t border-white/15 space-y-1.5">
                        <div className="text-[10px] font-display font-black text-[#FFE600]">
                          ✔ সাম্প্রতিক মোবাইল রিচার্জ (Recent Recharges):
                        </div>
                        <div className="space-y-1 max-h-28 overflow-y-auto">
                          {rechargeHistory.map((h) => (
                            <div
                              key={h.id}
                              className="p-2 rounded-xl bg-[#081A48] border border-emerald-400/40 flex items-center justify-between text-[10px]"
                            >
                              <div>
                                <div className="font-mono-num font-black text-white">
                                  📱 {h.phone} ({h.operator} {h.simType})
                                </div>
                                <div className="text-sky-300 font-mono-num">
                                  {h.id} • {h.time}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono-num font-black text-[#4ADE80]">
                                  ৳{h.tk} Success ✓
                                </div>
                                <div className="font-mono-num text-[#FFE600]">-{h.pts} Pts</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* FEATURED MOBILE RECHARGE CARD RIGHT AT TOP OF SHOP TAB (Matches User Screenshot!) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0B2B70] via-[#13429E] to-[#0B2B70] border-2 border-[#FFE600] space-y-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📲</span>
                          <div>
                            <div className="font-display font-black text-xs sm:text-sm text-[#FFE600]">
                              পয়েন্ট দিয়ে মোবাইল রিচার্জ (Mobile Recharge)
                            </div>
                            <div className="text-[10px] text-sky-200 font-bold">
                              গ্রামীণফোন, রবি, বাংলালিংক, এয়ারটেল ও টেলিটক (১০০ পয়েন্ট = ২০ টাকা)
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPointHubTab('RECHARGE');
                            setPointHubNotice(null);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#00DC58] text-[#05183C] font-display font-black text-[10px] shrink-0 cursor-pointer shadow"
                        >
                          📱 রিচার্জ করুন →
                        </button>
                      </div>

                      {/* Quick Mobile Number + Instant ৳20 / ৳50 / ৳100 / ৳200 Recharge inside Shop Tab */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="tel"
                          value={rechargePhone}
                          onChange={(e) => handlePhoneInputChange(e.target.value)}
                          placeholder="017XXXXXXXX নাম্বার দিন"
                          maxLength={11}
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-white text-slate-950 font-mono-num font-black text-xs border border-[#FFE600] focus:outline-none"
                        />
                        <span className="px-2 py-1 rounded-lg bg-[#04102E] border border-sky-400/40 text-[10px] font-display font-black text-sky-300">
                          {rechargeOperator}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { tk: 20, pts: 100 },
                          { tk: 50, pts: 250 },
                          { tk: 100, pts: 500 },
                          { tk: 200, pts: 1000 }
                        ].map((q) => (
                          <button
                            key={q.pts}
                            type="button"
                            onClick={() => {
                              setSelectedRechargePkg(q);
                              if (!rechargePhone.trim()) {
                                setPointHubTab('RECHARGE');
                                setPointHubNotice('📱 আপনার ১১ ডিজিটের মোবাইল নাম্বার লিখে রিচার্জ সম্পন্ন করুন:');
                              } else {
                                handleMobileRechargeWithPoints(q);
                              }
                            }}
                            className="py-1.5 px-1 rounded-xl bg-[#04102E] hover:bg-[#081A48] border border-[#FFE600] text-center cursor-pointer transition-transform active:scale-95"
                          >
                            <div className="font-mono-num font-black text-xs text-white">৳{q.tk}</div>
                            <div className="font-mono-num font-black text-[9px] text-[#FFE600]">
                              🪙 {q.pts} Pts
                            </div>
                            <div className="mt-0.5 text-[8px] font-display font-black text-[#4ADE80]">
                              রিচার্জ
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {LUDO_POINT_SHOP_ITEMS.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-2xl bg-[#04102E] border border-[#FACC15]/60 flex flex-col justify-between gap-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div className="leading-tight">
                              <div className="font-bold text-white text-[11px]">{item.name}</div>
                              <div className="font-mono-num font-black text-[#FFE600] text-xs">
                                🪙 {item.pts} Pts
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (points < item.pts) {
                                setPointHubTab('BUY');
                                setPointHubNotice(
                                  `${item.name} কিনতে ${item.pts} পয়েন্ট প্রয়োজন! আগে পয়েন্ট কিনুন বা লুডু খেলে জিতুন।`
                                );
                                return;
                              }
                              setPoints((p) => p - item.pts);
                              playLudoSound('WIN');
                              setPointHubNotice(
                                `🎉 অভিনন্দন! ${item.pts} পয়েন্ট দিয়ে "${item.name}" অর্ডার সফল হয়েছে!`
                              );
                            }}
                            className="w-full py-1.5 rounded-xl bg-gradient-to-b from-[#FFE600] to-[#D97706] text-[#081A48] font-display font-black text-[10px] cursor-pointer"
                          >
                            🛍️ পয়েন্ট দিয়ে কিনুন
                          </button>
                        </div>
                      ))}
                    </div>

                    {onGoToStore && (
                      <button
                        onClick={() => {
                          setHomeModal(null);
                          onGoToStore();
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#00DC58] text-[#05183C] font-display font-black text-xs cursor-pointer"
                      >
                        🛒 সম্পূর্ণ Sports Store-এ গিয়ে শপিং করুন →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {homeModal === 'RULES' && (
              <div className="space-y-2.5 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-[#04102E] border border-[#FACC15]/50">
                  <strong className="text-[#FACC15]">১. এন্ট্রি পয়েন্ট (১০ থেকে ৫,০০০) ও ৫% অ্যাপ ফি:</strong>
                  <p className="mt-1 text-sky-100">
                    ১০, ২০, ৩০, ৪০, ৫০, ১০০ থেকে ৫,০০০ পয়েন্ট পর্যন্ত এন্ট্রি দিয়ে ইউজারদের সাথে খেলা যাবে। মোট পটের শতকরা ৫% (5%) অ্যাপস ফি কাটবে এবং বাকি ৯৫% (95%) সম্পূর্ণ পয়েন্ট উইনার পাবে।
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#04102E] border border-[#4ADE80]/50">
                  <strong className="text-[#4ADE80]">২. ১০০ পয়েন্ট = ২০ টাকা (নো উইথড্র • শুধুমাত্র শপিং):</strong>
                  <p className="mt-1 text-sky-100">
                    ২০ টাকায় ১০০ পয়েন্ট কেনা যাবে, কিন্তু কোনো সময় ক্যাশ উইথড্র দেওয়া যাবে না। জিতলে বা কিনলে সেই পয়েন্ট দিয়ে সরাসরি আমাদের <strong>Sports Store</strong> থেকে কেনাকাটা করতে পারবেন!
                  </p>
                </div>
              </div>
            )}

            {(homeModal === 'SPIN' || homeModal === 'SEASON_CLAIM' || homeModal === 'STARTER_PACK') && (
              <div className="text-center space-y-3 py-2">
                <div className="text-4xl">🎁</div>
                <p className="text-xs text-sky-100">
                  Claim +25 Free Ludo King Shopping Points to your wallet!
                </p>
                <button
                  onClick={() => {
                    setPoints((p) => p + 25);
                    setHomeModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#D97706] text-[#081A48] font-display font-black text-xs cursor-pointer"
                >
                  Claim +25 Points Now ✓
                </button>
              </div>
            )}

            {homeModal === 'SEVEN_UP' && (
              <div className="space-y-3 text-center text-xs">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'DOWN', label: '2–6 (DOWN)' },
                    { id: 'SEVEN', label: 'LUCKY 7 (3x)' },
                    { id: 'UP', label: '8–12 (UP)' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSevenUpBet(b.id as typeof sevenUpBet)}
                      className={`py-2.5 rounded-xl border font-display font-black cursor-pointer ${
                        sevenUpBet === b.id
                          ? 'bg-[#FACC15] text-[#081A48] border-white'
                          : 'bg-[#04102E] text-white border-white/20'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                {sevenUpResult && <div className="font-bold text-[#4ADE80]">{sevenUpResult}</div>}
                <button
                  onClick={() => {
                    const d1 = Math.floor(Math.random() * 6) + 1;
                    const d2 = Math.floor(Math.random() * 6) + 1;
                    const sum = d1 + d2;
                    setPoints((p) => p + 19);
                    setSevenUpResult(`🎲 Rolled ${d1} + ${d2} = ${sum}! +19 Points (95% After 5% Fee)!`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#22C55E] text-[#081A48] font-display font-black cursor-pointer"
                >
                  🎲 Roll 2 Dice (10 Pts Entry)
                </button>
              </div>
            )}

            <button
              onClick={() => setHomeModal(null)}
              className="w-full py-2 rounded-xl bg-white/15 text-white font-display font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
