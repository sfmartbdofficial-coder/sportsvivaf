import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Trophy,
  ShoppingBag,
  Sparkles,
  Users,
  Shield,
  Target,
  Award,
  RefreshCw,
  HelpCircle,
  X,
  CheckCircle2,
  Zap,
  Crown,
  Flame,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings,
  Mail,
  Info
} from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS FOR 100% AUTHENTIC MINICLIP CARROM POOL CLONE
// ============================================================================
export type CarromGameMode = 'DISC_POOL' | 'CARROM_CLASSIC' | 'FREESTYLE' | 'PRACTICE';
export type CarromScreen = 'HOME' | 'ARENA_SELECT' | 'MATCHMAKING' | 'BOARD' | 'WINNER';
export type CarromBottomTab = 'SHOP' | 'EQUIP' | 'HOME' | 'LEADERBOARD' | 'EVENTS';
export type CarromEquipCategory = 'STRIKERS' | 'PUCKS' | 'POWERS' | 'BOARDS' | 'EMOJIS';
export type CarromPlayerCount = 2 | 4;

export interface CarromPuck {
  id: string;
  type: 'WHITE' | 'BLACK' | 'QUEEN' | 'STRIKER';
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pocketed: boolean;
}

const ENTRY_POINT_TIERS = [10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000, 5000];

const CARROM_ARENAS = [
  {
    id: 'delhi',
    name: 'DELHI LOUNGE',
    bangla: 'দিল্লি লাউঞ্জ',
    entry: 100,
    onlineCount: '39,254',
    accentFrom: '#10B981',
    accentVia: '#047857',
    accentTo: '#064E3B',
    borderGold: '#FACC15',
    monument: '🕌'
  },
  {
    id: 'dhaka',
    name: 'DHAKA ROYAL CLUB',
    bangla: 'ঢাকা রয়েল ক্লাব',
    entry: 20,
    onlineCount: '44,810',
    accentFrom: '#0EA5E9',
    accentVia: '#0369A1',
    accentTo: '#0C4A6E',
    borderGold: '#FDE047',
    monument: '🏛️'
  },
  {
    id: 'dubai',
    name: 'DUBAI GRAND PLAZA',
    bangla: 'দুবাই গ্র্যান্ড প্লাজা',
    entry: 200,
    onlineCount: '28,640',
    accentFrom: '#F59E0B',
    accentVia: '#B45309',
    accentTo: '#451A03',
    borderGold: '#FEF08A',
    monument: '🏙️'
  },
  {
    id: 'mumbai',
    name: 'MUMBAI ARENA',
    bangla: 'মুম্বাই অ্যারেনা',
    entry: 500,
    onlineCount: '19,420',
    accentFrom: '#EC4899',
    accentVia: '#9D174D',
    accentTo: '#500724',
    borderGold: '#FBCFE8',
    monument: '⛩️'
  },
  {
    id: 'singapore',
    name: 'SINGAPORE MARINA',
    bangla: 'সিঙ্গাপুর মেরিনা বে',
    entry: 1000,
    onlineCount: '12,305',
    accentFrom: '#8B5CF6',
    accentVia: '#5B21B6',
    accentTo: '#2E1065',
    borderGold: '#DDD6FE',
    monument: '🎡'
  },
  {
    id: 'london',
    name: 'LONDON VICTORIA HALL',
    bangla: 'লন্ডন ভিক্টোরিয়া হল',
    entry: 5000,
    onlineCount: '8,910',
    accentFrom: '#EF4444',
    accentVia: '#991B1B',
    accentTo: '#450A0A',
    borderGold: '#FCA5A5',
    monument: '🕰️'
  }
];

const CARROM_RANDOM_OPPONENTS = [
  'AshNero',
  'Sohan',
  'Tanvir Ahmed',
  'Rakib Hasan',
  'BeeFuzzy',
  'Nusrat Jahan',
  'Sabbir Hossain',
  'Arafat Islam',
  'Mehedi Hasan',
  'Anggabtr',
  'Tahmid Khan',
  'Rifat Chowdhury',
  'Imran Kabir',
  'Nayeem R.',
  'Zahidul Islam'
];

const pickDistinctCarromOpponents = (): { top: string; left: string; right: string } => {
  const shuffled = [...CARROM_RANDOM_OPPONENTS].sort(() => Math.random() - 0.5);
  return {
    top: shuffled[0] || 'AshNero',
    left: shuffled[1] || 'Sohan',
    right: shuffled[2] || 'Tanvir Ahmed'
  };
};

const STRIKER_SKINS = [
  {
    id: 'standard_ivory',
    name: 'Standard',
    tier: 'STANDARD',
    force: 6,
    aim: 6,
    time: 6,
    outer: '#F59E0B',
    inner: '#FEF3C7',
    core: '#B45309',
    pattern: 'MANDALA',
    cost: 0
  },
  {
    id: 'demon_mecha',
    name: 'Crimson Demon',
    tier: 'LEGENDARY',
    force: 9,
    aim: 9,
    time: 8,
    outer: '#EF4444',
    inner: '#450A0A',
    core: '#FACC15',
    pattern: 'MECHA',
    cost: 0
  },
  {
    id: 'royal_gold',
    name: 'Royal Bengal Gold',
    tier: 'RARE',
    force: 8,
    aim: 8,
    time: 8,
    outer: '#FACC15',
    inner: '#78350F',
    core: '#FEF08A',
    pattern: 'STAR',
    cost: 0
  },
  {
    id: 'cyber_prism',
    name: 'Prism Force',
    tier: 'EPIC',
    force: 9,
    aim: 10,
    time: 9,
    outer: '#38BDF8',
    inner: '#0C4A6E',
    core: '#E0F2FE',
    pattern: 'PRISM',
    cost: 200
  },
  {
    id: 'emerald_cobra',
    name: 'Emerald Cobra',
    tier: 'EPIC',
    force: 10,
    aim: 9,
    time: 9,
    outer: '#22C55E',
    inner: '#064E3B',
    core: '#A7F3D0',
    pattern: 'STAR',
    cost: 300
  },
  {
    id: 'maharaja_ruby',
    name: 'Maharaja Ruby',
    tier: 'LEGENDARY',
    force: 10,
    aim: 10,
    time: 10,
    outer: '#F43F5E',
    inner: '#881337',
    core: '#FFE4E6',
    pattern: 'MANDALA',
    cost: 500
  }
];

const PUCK_SKINS = [
  { id: 'classic_wood', name: 'Classic Moulded', tier: 'STANDARD', accent: '#D97706' },
  { id: 'royal_lotus', name: 'Royal Lotus', tier: 'RARE', accent: '#FACC15' },
  { id: 'neon_ring', name: 'Cyber Ring', tier: 'EPIC', accent: '#38BDF8' },
  { id: 'crimson_crown', name: 'Imperial Crown', tier: 'LEGENDARY', accent: '#EF4444' }
];

const CARROM_SHOP_ITEMS = [
  { id: 'cp-1', name: 'Pro Wooden Carrom Board Set', pts: 2500, tk: 500, icon: '🎯' },
  { id: 'cp-2', name: 'Bangladesh Premium Jersey', pts: 750, tk: 150, icon: '👕' },
  { id: 'cp-3', name: 'FIFA Pro Match Football', pts: 1500, tk: 300, icon: '⚽' },
  { id: 'cp-4', name: 'Wireless Gaming Earbuds', pts: 2000, tk: 400, icon: '🎧' },
  { id: 'cp-5', name: 'Sports Smart Watch', pts: 3000, tk: 600, icon: '⌚' },
  { id: 'cp-6', name: 'English Willow Cricket Bat', pts: 4500, tk: 900, icon: '🏏' }
];

const QUICK_CHATS = [
  '🔥 Good Shot!',
  '😎 Watch This!',
  '👏 Well Played!',
  '😅 Oops!',
  '👑 Queen is Mine!',
  '🤝 Good Luck!'
];

// ============================================================================
// MAIN CARROM POOL CLONE COMPONENT
// ============================================================================
export const CarromPoolClone: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  awardPoints: (pts: number, reason?: string) => void;
  onOpenDeposit: () => void;
  onGoToStore?: () => void;
  onBack: () => void;
}> = ({ points, setPoints, awardPoints, onOpenDeposit, onGoToStore, onBack }) => {
  const [screen, setScreen] = useState<CarromScreen>('HOME');
  const [bottomTab, setBottomTab] = useState<CarromBottomTab>('HOME');
  const [equipCategory, setEquipCategory] = useState<CarromEquipCategory>('STRIKERS');
  const [gameMode, setGameMode] = useState<CarromGameMode>('CARROM_CLASSIC');
  const [playerCount, setPlayerCount] = useState<CarromPlayerCount>(2);
  const [entryPoints, setEntryPoints] = useState<number>(100);
  const [arenaIndex, setArenaIndex] = useState<number>(0);
  const [matchOrigin, setMatchOrigin] = useState<
    'ONLINE' | 'COMPUTER' | 'FRIENDS' | 'PASS_N_PLAY' | 'PRACTICE'
  >('ONLINE');
  const [selectedStrikerId, setSelectedStrikerId] = useState<string>('standard_ivory');
  const [selectedPuckSkinId, setSelectedPuckSkinId] = useState<string>('classic_wood');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [releaseToShoot, setReleaseToShoot] = useState<boolean>(true);
  const [gemsCount, setGemsCount] = useState<number>(350);

  // Player Names: Bottom/Left is ALWAYS "Me (You)", Opponents are distinct random names
  const [playerNames, setPlayerNames] = useState<{
    me: string;
    top: string;
    left: string;
    right: string;
  }>(() => {
    const ops = pickDistinctCarromOpponents();
    return {
      me: 'Me (You)',
      top: ops.top,
      left: ops.left,
      right: ops.right
    };
  });

  // Point Hub & Mobile Recharge Modal State (First Option = RECHARGE)
  const [showPointHubModal, setShowPointHubModal] = useState<boolean>(false);
  const [pointHubTab, setPointHubTab] = useState<'RECHARGE' | 'BUY' | 'SHOP'>('RECHARGE');
  const [pointHubNotice, setPointHubNotice] = useState<string | null>(null);
  const [selectedPayGateway, setSelectedPayGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [rechargeOperator, setRechargeOperator] = useState<
    'Grameenphone' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk'
  >('Grameenphone');
  const [rechargeSimType, setRechargeSimType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');
  const [rechargePhone, setRechargePhone] = useState<string>('');
  const [selectedRechargePkg, setSelectedRechargePkg] = useState<{ tk: number; pts: number }>({
    tk: 20,
    pts: 100
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

  // Board Modals & Quick Chat
  const [showBoardMenuModal, setShowBoardMenuModal] = useState<boolean>(false);
  const [showChatPopup, setShowChatPopup] = useState<boolean>(false);
  const [activeChatBubble, setActiveChatBubble] = useState<{ who: 'ME' | 'OPP'; text: string } | null>(
    null
  );
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // ============================================================================
  // WEB AUDIO API SOUND SYNTHESIZER FOR REALISTIC CARROM SOUNDS
  // ============================================================================
  const playCarromSound = (
    type: 'STRIKE' | 'COLLIDE' | 'POCKET' | 'QUEEN' | 'FOUL' | 'WIN',
    intensity = 1
  ) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'STRIKE') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(310, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.085);
        gain.gain.setValueAtTime(Math.min(0.45, 0.35 * intensity), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'COLLIDE') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650 + Math.random() * 190, now);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.045);
        gain.gain.setValueAtTime(Math.min(0.32, 0.2 * intensity), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'POCKET') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(820, now + 0.13);
        gain.gain.setValueAtTime(0.36, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'QUEEN') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.28, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
      } else if (type === 'FOUL') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(105, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'WIN') {
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.32, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      }
    } catch {
      // Ignore audio unlock errors
    }
  };

  // ============================================================================
  // CARROM BOARD INITIAL PUCK FORMATION (420x420 COORDINATE SPACE)
  // Center is (210, 210). Tightly packed hexagonal rack like Screenshot 5!
  // ============================================================================
  const buildRack = (mode: CarromGameMode): CarromPuck[] => {
    const cx = 210;
    const cy = 210;
    const r = 14.2; // Large, crisp 3D Carrom pucks!
    const d1 = 29; // First ring radius (6 pucks)
    const d2 = 57; // Outer ring radius (12 pucks)
    const pucks: CarromPuck[] = [];

    // Center puck: Red Queen in Carrom Classic & Freestyle; White in Disc Pool
    if (mode !== 'DISC_POOL') {
      pucks.push({
        id: 'queen',
        type: 'QUEEN',
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        r: 14.5,
        pocketed: false
      });
    } else {
      pucks.push({
        id: 'w-center',
        type: 'WHITE',
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        r,
        pocketed: false
      });
    }

    // Inner ring of 6 alternating pucks
    for (let i = 0; i < 6; i++) {
      const ang = ((i * 60 - 90) * Math.PI) / 180;
      const isWhite = i % 2 === 0;
      pucks.push({
        id: `inner-${i}`,
        type: isWhite ? 'WHITE' : 'BLACK',
        x: Number((cx + Math.cos(ang) * d1).toFixed(2)),
        y: Number((cy + Math.sin(ang) * d1).toFixed(2)),
        vx: 0,
        vy: 0,
        r,
        pocketed: false
      });
    }

    // Outer ring of 12 alternating pucks
    for (let i = 0; i < 12; i++) {
      const ang = ((i * 30 - 90) * Math.PI) / 180;
      const isWhite = i % 2 === 1;
      pucks.push({
        id: `outer-${i}`,
        type: isWhite ? 'WHITE' : 'BLACK',
        x: Number((cx + Math.cos(ang) * d2).toFixed(2)),
        y: Number((cy + Math.sin(ang) * d2).toFixed(2)),
        vx: 0,
        vy: 0,
        r,
        pocketed: false
      });
    }

    // Striker on Bottom Player ("Me (You)") baseline (y = 348)
    pucks.push({
      id: 'striker',
      type: 'STRIKER',
      x: 210,
      y: 348,
      vx: 0,
      vy: 0,
      r: 17.5,
      pocketed: false
    });

    return pucks;
  };

  // Gameplay State
  const [pucks, setPucks] = useState<CarromPuck[]>(() => buildRack('CARROM_CLASSIC'));
  const [turn, setTurn] = useState<'ME' | 'OPPONENT'>('ME');
  const [strikerX, setStrikerX] = useState<number>(210);
  const [aimAngle, setAimAngle] = useState<number>(-90);
  const [aimPower, setAimPower] = useState<number>(80);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isDraggingBoard, setIsDraggingBoard] = useState<boolean>(false);
  const [hasDraggedAim, setHasDraggedAim] = useState<boolean>(false);
  const [myScore, setMyScore] = useState<number>(0);
  const [oppScore, setOppScore] = useState<number>(0);
  const [queenPocketedBy, setQueenPocketedBy] = useState<'NONE' | 'ME' | 'OPPONENT'>('NONE');
  const [statusBanner, setStatusBanner] = useState<string>(
    'আপনার দান (Me / You)! স্ট্রাইকার স্লাইড করুন, বোর্ডে টেনে ছাড়ুন অথবা STRIKE চাপুন!'
  );
  const [winnerWho, setWinnerWho] = useState<'ME' | 'OPPONENT' | null>(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(25);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const turnRef = useRef<'ME' | 'OPPONENT'>('ME');
  turnRef.current = turn;

  // Pot & Prize Calculation (Exact 5% App Fee, 95% Winner Prize!)
  const totalPot = entryPoints * playerCount;
  const appFee5Percent = Math.round(totalPot * 0.05);
  const winnerPrize95Percent = totalPot - appFee5Percent;

  const activeStrikerSkin =
    STRIKER_SKINS.find((s) => s.id === selectedStrikerId) || STRIKER_SKINS[0];
  const currentArena = CARROM_ARENAS[arenaIndex % CARROM_ARENAS.length] || CARROM_ARENAS[0];

  // Auto-Find Non-Overlapping Baseline X for Striker
  const findSafeBaselineX = (preferredX: number, baselineY: number, currentPucks: CarromPuck[]) => {
    const clamped = Math.max(84, Math.min(336, preferredX));
    const hasOverlap = (testX: number) =>
      currentPucks.some(
        (p) =>
          !p.pocketed &&
          p.type !== 'STRIKER' &&
          Math.hypot(p.x - testX, p.y - baselineY) < p.r + 18.5
      );
    if (!hasOverlap(clamped)) return clamped;
    for (let offset = 8; offset <= 240; offset += 8) {
      if (clamped + offset <= 336 && !hasOverlap(clamped + offset)) return clamped + offset;
      if (clamped - offset >= 84 && !hasOverlap(clamped - offset)) return clamped - offset;
    }
    return clamped;
  };

  // Start Match with Authentic Carrom Pool "VS" Matchmaking Screen (Screenshot 4)
  const handleStartMatch = (customEntry?: number, customMode?: CarromGameMode, skipVs?: boolean) => {
    const fee = customEntry ?? entryPoints;
    const modeToUse = customMode ?? gameMode;

    if (matchOrigin !== 'PRACTICE' && points < fee) {
      setPointHubTab('BUY');
      setPointHubNotice(
        `ম্যাচ শুরু করতে ${fee} পয়েন্ট প্রয়োজন! আপনার ওয়ালেটে আছে ${points} পয়েন্ট। আগে পয়েন্ট কিনুন।`
      );
      setShowPointHubModal(true);
      return;
    }

    if (matchOrigin !== 'PRACTICE') {
      setPoints((p) => Math.max(0, p - fee));
    }

    const ops = pickDistinctCarromOpponents();
    setPlayerNames((prev) => ({
      ...prev,
      top: ops.top,
      left: ops.left,
      right: ops.right
    }));

    const freshRack = buildRack(modeToUse);
    setPucks(freshRack);
    setTurn('ME');
    setStrikerX(210);
    setAimAngle(-90);
    setAimPower(82);
    setIsMoving(false);
    setMyScore(0);
    setOppScore(0);
    setQueenPocketedBy('NONE');
    setWinnerWho(null);
    setTurnTimeLeft(25);
    setStatusBanner(
      'ব্রেক শট (Me / You)! স্ট্রাইকার স্লাইড করুন, বোর্ডে নিশানা টেনে ছাড়ুন বা STRIKE চাপুন!'
    );

    if (skipVs) {
      setScreen('BOARD');
    } else {
      setScreen('MATCHMAKING');
    }
  };

  // Automatically transition from MATCHMAKING ('VS' Screen) to BOARD after 1.5s
  useEffect(() => {
    if (screen !== 'MATCHMAKING') return;
    const timer = setTimeout(() => {
      setScreen('BOARD');
    }, 1500);
    return () => clearTimeout(timer);
  }, [screen]);

  // Turn Countdown Timer on BOARD
  useEffect(() => {
    if (screen !== 'BOARD' || isMoving || winnerWho) return;
    const t = setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          const nextTurn = turnRef.current === 'ME' ? 'OPPONENT' : 'ME';
          setTurn(nextTurn);
          const nextY = nextTurn === 'ME' ? 348 : 72;
          setPucks((old) =>
            old.map((p) =>
              p.type === 'STRIKER' ? { ...p, x: 210, y: nextY, vx: 0, vy: 0, pocketed: false } : p
            )
          );
          setStrikerX(210);
          setAimAngle(nextTurn === 'ME' ? -90 : 90);
          setStatusBanner(
            nextTurn === 'ME'
              ? 'টাইম শেষ! এখন আপনার দান (Me / You)!'
              : `${playerNames.top}-এর দান চলছে...`
          );
          return 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen, isMoving, winnerWho, playerNames.top]);

  // AI / Opponent Auto-Shot when turn === 'OPPONENT'
  useEffect(() => {
    if (screen !== 'BOARD' || turn !== 'OPPONENT' || isMoving || winnerWho) return;

    const timer = setTimeout(() => {
      const targets = pucks.filter(
        (p) => !p.pocketed && (p.type === 'BLACK' || (p.type === 'QUEEN' && gameMode !== 'DISC_POOL'))
      );
      const target =
        targets[Math.floor(Math.random() * targets.length)] ||
        pucks.find((p) => !p.pocketed && p.type !== 'STRIKER');

      const aiStartX = findSafeBaselineX(
        target ? Math.max(95, Math.min(325, target.x + (Math.random() * 32 - 16))) : 210,
        72,
        pucks
      );
      const tx = target ? target.x : 210;
      const ty = target ? target.y : 210;
      const rad = Math.atan2(ty - 72, tx - aiStartX) + (Math.random() * 0.07 - 0.035);
      const speed = 14 + Math.random() * 3.5;

      playCarromSound('STRIKE', 0.9);
      setStrikerX(aiStartX);
      setAimAngle(Math.round((rad * 180) / Math.PI));
      setPucks((prev) =>
        prev.map((d) =>
          d.type === 'STRIKER'
            ? {
                ...d,
                x: aiStartX,
                y: 72,
                vx: Math.cos(rad) * speed,
                vy: Math.sin(rad) * speed,
                pocketed: false
              }
            : d
        )
      );
      setIsMoving(true);
      setStatusBanner(`${playerNames.top} শট খেলেছেন!`);
    }, 1150);

    return () => clearTimeout(timer);
  }, [screen, turn, isMoving, winnerWho, pucks, gameMode, playerNames.top]);

  // ============================================================================
  // HIGH-PRECISION 60FPS CARROM PHYSICS & POCKET ENGINE
  // ============================================================================
  useEffect(() => {
    if (!isMoving || screen !== 'BOARD') return;

    const pockets = [
      { x: 42, y: 42 },
      { x: 378, y: 42 },
      { x: 42, y: 378 },
      { x: 378, y: 378 }
    ];

    let pocketedWhiteThisShot = 0;
    let pocketedBlackThisShot = 0;
    let pocketedQueenThisShot = false;
    let strikerFoulThisShot = false;
    let lastSoundTime = 0;

    const interval = setInterval(() => {
      setPucks((prev) => {
        const next: CarromPuck[] = prev.map((d) => ({ ...d }));
        let anyVelocity = false;

        // 1. Update positions, friction & cushion rebounds
        for (const d of next) {
          if (d.pocketed) continue;
          d.x += d.vx;
          d.y += d.vy;
          d.vx *= 0.968;
          d.vy *= 0.968;

          if (Math.abs(d.vx) < 0.07) d.vx = 0;
          if (Math.abs(d.vy) < 0.07) d.vy = 0;
          if (d.vx !== 0 || d.vy !== 0) anyVelocity = true;

          const minWall = 26;
          const maxWall = 394;
          if (d.x - d.r < minWall) {
            d.x = minWall + d.r;
            d.vx = -d.vx * 0.84;
          }
          if (d.x + d.r > maxWall) {
            d.x = maxWall - d.r;
            d.vx = -d.vx * 0.84;
          }
          if (d.y - d.r < minWall) {
            d.y = minWall + d.r;
            d.vy = -d.vy * 0.84;
          }
          if (d.y + d.r > maxWall) {
            d.y = maxWall - d.r;
            d.vy = -d.vy * 0.84;
          }

          // 2. Corner Pocket Detection
          for (const p of pockets) {
            const dist = Math.hypot(d.x - p.x, d.y - p.y);
            if (dist < 24.5) {
              if (d.type === 'STRIKER') {
                strikerFoulThisShot = true;
                d.pocketed = true;
                d.vx = 0;
                d.vy = 0;
                playCarromSound('FOUL');
              } else {
                d.pocketed = true;
                d.vx = 0;
                d.vy = 0;
                if (d.type === 'QUEEN') {
                  pocketedQueenThisShot = true;
                  playCarromSound('QUEEN');
                } else if (d.type === 'WHITE') {
                  pocketedWhiteThisShot += 1;
                  playCarromSound('POCKET');
                } else if (d.type === 'BLACK') {
                  pocketedBlackThisShot += 1;
                  playCarromSound('POCKET');
                }
              }
              break;
            }
          }
        }

        // 3. Elastic Pairwise Disc Collisions
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];
            if (a.pocketed || b.pocketed) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.r + b.r;
            if (dist > 0 && dist < minDist) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minDist - dist;
              a.x -= (nx * overlap) / 2;
              a.y -= (ny * overlap) / 2;
              b.x += (nx * overlap) / 2;
              b.y += (ny * overlap) / 2;

              const kx = a.vx - b.vx;
              const ky = a.vy - b.vy;
              const impact = nx * kx + ny * ky;
              if (impact > 0) {
                a.vx -= impact * nx * 0.93;
                a.vy -= impact * ny * 0.93;
                b.vx += impact * nx * 0.93;
                b.vy += impact * ny * 0.93;

                const nowMs = Date.now();
                if (impact > 1.2 && nowMs - lastSoundTime > 45) {
                  lastSoundTime = nowMs;
                  playCarromSound('COLLIDE', Math.min(1, impact / 10));
                }
              }
            }
          }
        }

        // 4. When all discs stop moving, resolve shot outcome & next turn
        if (!anyVelocity) {
          const activeTurn = turnRef.current;

          const addWhitePts =
            gameMode === 'FREESTYLE' ? pocketedWhiteThisShot * 20 : pocketedWhiteThisShot * 10;
          const addBlackPts =
            gameMode === 'FREESTYLE' ? pocketedBlackThisShot * 10 : pocketedBlackThisShot * 10;
          const addQueenPts = pocketedQueenThisShot ? (gameMode === 'FREESTYLE' ? 50 : 30) : 0;

          if (addWhitePts > 0 || (pocketedQueenThisShot && activeTurn === 'ME')) {
            setMyScore((s) => s + addWhitePts + (activeTurn === 'ME' ? addQueenPts : 0));
          }
          if (addBlackPts > 0 || (pocketedQueenThisShot && activeTurn === 'OPPONENT')) {
            setOppScore((s) => s + addBlackPts + (activeTurn === 'OPPONENT' ? addQueenPts : 0));
          }
          if (pocketedQueenThisShot) {
            setQueenPocketedBy(activeTurn);
          }

          if (pocketedWhiteThisShot > 0 && activeTurn === 'ME') {
            awardPoints(5);
          }

          const remainingWhites = next.filter((p) => p.type === 'WHITE' && !p.pocketed).length;
          const remainingBlacks = next.filter((p) => p.type === 'BLACK' && !p.pocketed).length;
          const remainingQueen = next.find((p) => p.type === 'QUEEN' && !p.pocketed);

          if (remainingWhites === 0 && (!remainingQueen || gameMode === 'DISC_POOL')) {
            setIsMoving(false);
            setWinnerWho('ME');
            setPoints((p) => p + winnerPrize95Percent);
            playCarromSound('WIN');
            setScreen('WINNER');
            return next;
          }

          if (remainingBlacks === 0 && (!remainingQueen || gameMode === 'DISC_POOL')) {
            setIsMoving(false);
            setWinnerWho('OPPONENT');
            playCarromSound('WIN');
            setScreen('WINNER');
            return next;
          }

          let nextTurn: 'ME' | 'OPPONENT' = activeTurn;
          if (strikerFoulThisShot) {
            nextTurn = activeTurn === 'ME' ? 'OPPONENT' : 'ME';
            setStatusBanner(
              activeTurn === 'ME'
                ? `ফাউল! স্ট্রাইকার পকেটে গেছে! এখন ${playerNames.top}-এর দান।`
                : `${playerNames.top} স্ট্রাইকার ফাউল করেছেন! এখন আপনার দান (Me / You)!`
            );
          } else if (activeTurn === 'ME') {
            if (pocketedWhiteThisShot > 0 || pocketedQueenThisShot) {
              nextTurn = 'ME';
              setStatusBanner(
                pocketedQueenThisShot
                  ? '👑 অসাধারণ! রেড কুইন পকেটে! আপনার বোনাস দান (Me / You)!'
                  : `🔥 চমৎকার শট! সাদা গুটি পকেটে গেছে! আবার আপনার দান (Me / You)!`
              );
            } else {
              nextTurn = 'OPPONENT';
              setStatusBanner(`${playerNames.top}-এর দান চলছে...`);
            }
          } else {
            if (pocketedBlackThisShot > 0 || pocketedQueenThisShot) {
              nextTurn = 'OPPONENT';
              setStatusBanner(`${playerNames.top} গুটি ফেলেছেন! আবার শট নিচ্ছেন...`);
            } else {
              nextTurn = 'ME';
              setStatusBanner('আপনার দান (Me / You)! নিশানা করে STRIKE চাপুন বা বোর্ডে টেনে ছাড়ুন!');
            }
          }

          const nextBaselineY = nextTurn === 'ME' ? 348 : 72;
          const safeX = findSafeBaselineX(210, nextBaselineY, next);

          for (const d of next) {
            if (d.type === 'STRIKER') {
              d.pocketed = false;
              d.x = safeX;
              d.y = nextBaselineY;
              d.vx = 0;
              d.vy = 0;
            }
          }

          setTurn(nextTurn);
          setStrikerX(safeX);
          setAimAngle(nextTurn === 'ME' ? -90 : 90);
          setTurnTimeLeft(25);
          setIsMoving(false);
        }

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isMoving, screen, gameMode, winnerPrize95Percent, playerNames.top, awardPoints, setPoints]);

  // Slide Striker Along Baseline
  const handleStrikerSlide = (newX: number) => {
    if (isMoving || turn !== 'ME') return;
    const clamped = Math.max(84, Math.min(336, newX));
    setStrikerX(clamped);
    setPucks((prev) =>
      prev.map((d) =>
        d.type === 'STRIKER' ? { ...d, x: clamped, y: 348, vx: 0, vy: 0, pocketed: false } : d
      )
    );
  };

  // Smart Auto-Aim Helper Button
  const handleAutoAimBestShot = () => {
    if (isMoving || turn !== 'ME') return;
    const myTargets = pucks.filter(
      (p) => !p.pocketed && (p.type === 'QUEEN' || p.type === 'WHITE')
    );
    if (myTargets.length === 0) return;
    const chosen =
      myTargets.find((p) => p.type === 'QUEEN') || myTargets.sort((a, b) => a.y - b.y)[0];

    const deg = (Math.atan2(chosen.y - 348, chosen.x - strikerX) * 180) / Math.PI;
    setAimAngle(Math.round(deg));
    setAimPower(84);
    setStatusBanner(
      `🎯 Auto-Aim লক করা হয়েছে (${chosen.type === 'QUEEN' ? 'Red Queen 👑' : 'White Puck'})! এখন STRIKE চাপুন!`
    );
  };

  // Fire Striker Shot
  const handleStrikeShot = (customAngle?: number, customPower?: number) => {
    if (isMoving || turn !== 'ME') return;
    const useAngle = customAngle ?? aimAngle;
    const usePower = customPower ?? aimPower;
    const rad = (useAngle * Math.PI) / 180;
    const speed = (usePower / 100) * 18.8;
    playCarromSound('STRIKE', usePower / 100);
    setPucks((prev) =>
      prev.map((d) =>
        d.type === 'STRIKER'
          ? {
              ...d,
              vx: Math.cos(rad) * speed,
              vy: Math.sin(rad) * speed,
              pocketed: false
            }
          : d
      )
    );
    setIsMoving(true);
    setStatusBanner('🔥 শট ফায়ার করা হয়েছে!');
  };

  // Board Pointer Aiming (Pull-back slingshot or direct target aim like Screenshot 8)
  const handleBoardPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingBoard || !svgRef.current || isMoving || turn !== 'ME') return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 420;
    const py = ((e.clientY - rect.top) / rect.height) * 420;
    const striker = pucks.find((d) => d.type === 'STRIKER') || { x: strikerX, y: 348 };

    const dx = px - striker.x;
    const dy = py - striker.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 14) {
      setHasDraggedAim(true);
    }

    if (py > striker.y + 10) {
      // Pull-back slingshot style (like Screenshot 8!)
      const deg = (Math.atan2(-dy, -dx) * 180) / Math.PI;
      setAimAngle(Math.round(deg));
      setAimPower(Math.max(35, Math.min(100, Math.round(dist * 1.45))));
    } else {
      // Direct point-at-target style
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      setAimAngle(Math.round(deg));
      setAimPower(Math.max(35, Math.min(100, Math.round((dist / 210) * 100))));
    }
  };

  const handleBoardPointerUp = () => {
    if (isDraggingBoard && hasDraggedAim && releaseToShoot && !isMoving && turn === 'ME') {
      handleStrikeShot();
    }
    setIsDraggingBoard(false);
    setHasDraggedAim(false);
  };

  // Mobile Phone Input Auto-Operator Detection
  const handlePhoneInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setRechargePhone(digits);
    if (digits.startsWith('017') || digits.startsWith('013')) setRechargeOperator('Grameenphone');
    else if (digits.startsWith('018')) setRechargeOperator('Robi');
    else if (digits.startsWith('019') || digits.startsWith('014')) setRechargeOperator('Banglalink');
    else if (digits.startsWith('016')) setRechargeOperator('Airtel');
    else if (digits.startsWith('015')) setRechargeOperator('Teletalk');
  };

  const handleMobileRechargeWithPoints = (customPkg?: { tk: number; pts: number }) => {
    const pkg = customPkg || selectedRechargePkg;
    const cleaned = rechargePhone.replace(/\D/g, '');
    if (cleaned.length !== 11 || !cleaned.startsWith('01')) {
      setPointHubNotice('⚠ অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)');
      return;
    }
    if (points < pkg.pts) {
      setPointHubTab('BUY');
      setPointHubNotice(
        `⚠ ৳${pkg.tk} রিচার্জ করতে ${pkg.pts} পয়েন্ট প্রয়োজন! আপনার আছে ${points} পয়েন্ট। আগে পয়েন্ট কিনুন।`
      );
      return;
    }
    setPoints((p) => p - pkg.pts);
    playCarromSound('WIN');
    const newRec = {
      id: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: cleaned,
      operator: rechargeOperator,
      simType: rechargeSimType,
      tk: pkg.tk,
      pts: pkg.pts,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRechargeHistory((prev) => [newRec, ...prev]);
    setPointHubNotice(
      `✔ সফল! ${cleaned} (${rechargeOperator}) নাম্বারে ${pkg.pts} পয়েন্ট দিয়ে ৳${pkg.tk} মোবাইল রিচার্জ সম্পন্ন হয়েছে!`
    );
  };

  // Counts of pocketed pucks for HUD
  const whitePocketedCount = pucks.filter((p) => p.type === 'WHITE' && p.pocketed).length;
  const whiteTotalCount = pucks.filter((p) => p.type === 'WHITE').length;
  const blackPocketedCount = pucks.filter((p) => p.type === 'BLACK' && p.pocketed).length;
  const blackTotalCount = pucks.filter((p) => p.type === 'BLACK').length;
  const queenOnBoard = pucks.some((p) => p.type === 'QUEEN' && !p.pocketed);

  const strikerDisk = pucks.find((p) => p.type === 'STRIKER') || {
    x: strikerX,
    y: 348,
    r: 17.5
  };
  const aimRad = (aimAngle * Math.PI) / 180;
  const guideLen = (aimPower / 100) * 195;
  const guideX = strikerDisk.x + Math.cos(aimRad) * guideLen;
  const guideY = strikerDisk.y + Math.sin(aimRad) * guideLen;
  const powerRingColor =
    aimPower >= 85 ? '#EF4444' : aimPower >= 60 ? '#F59E0B' : '#22C55E';

  // Helper to render a custom Striker SVG icon
  const renderStrikerBadge = (skin: (typeof STRIKER_SKINS)[0], sizeClass = 'w-14 h-14') => (
    <svg viewBox="0 0 64 64" className={`${sizeClass} shrink-0 drop-shadow-md`}>
      <circle cx="32" cy="32" r="28" fill={skin.inner} stroke={skin.outer} strokeWidth="4.5" />
      <circle
        cx="32"
        cy="32"
        r="20"
        fill="none"
        stroke={skin.core}
        strokeWidth="2.2"
        strokeDasharray="5 3"
      />
      {Array.from({ length: 8 }).map((_, idx) => (
        <line
          key={idx}
          x1="32"
          y1="10"
          x2="32"
          y2="18"
          stroke={skin.outer}
          strokeWidth="2.5"
          transform={`rotate(${idx * 45} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="9.5" fill={skin.outer} stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="27" cy="26" r="3" fill="#FFFFFF" opacity="0.75" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A3E] via-[#0B2552] to-[#041026] text-white flex flex-col justify-between relative overflow-hidden select-none rounded-2xl border-2 border-[#D97706] shadow-2xl">
      {/* Ornate Radial Mandala & Wood Tile Background Pattern (Like Screenshots 1-8) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 42%, #1E40AF 0%, transparent 58%), repeating-radial-gradient(circle at 50% 42%, rgba(250,204,21,0.08) 0px, rgba(250,204,21,0.08) 2px, transparent 2px, transparent 28px)'
        }}
      />

      {/* ====================================================================
          TOP HEADER BAR FOR HOME LOBBY (EXACT SCREENSHOT 1 & 2 LAYOUT)
         ==================================================================== */}
      {screen === 'HOME' && (
        <header className="relative z-20 bg-gradient-to-b from-[#0C2756] to-[#061533] border-b-2 border-[#D97706] px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-lg">
          {/* Left: Back Button + Avatar with Shield Level 1 + Gear + Mail */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#22C55E] to-[#15803D] border-2 border-[#FEF08A] text-white font-display font-black text-xs flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
              title="Back"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            {/* Square Gold Framed Player Avatar with Blue Shield Badge '1' */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#FDE047] via-[#D97706] to-[#78350F] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-[9px] bg-gradient-to-b from-[#1E3A8A] to-[#091534] flex items-center justify-center text-lg">
                👤
              </div>
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-white text-white font-mono-num font-black text-[10px] flex items-center justify-center shadow">
                1
              </span>
            </div>

            <div className="hidden xs:block leading-tight min-w-0">
              <div className="text-xs font-display font-black text-white truncate">
                {playerNames.me}
              </div>
              <div className="text-[10px] font-bold text-[#FDE047]">Carrom Pro</div>
            </div>

            {/* Settings & Messages Mini Icons (Screenshot 1 Top-Left) */}
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#1E3A8A] to-[#0A1938] border border-[#60A5FA]/60 flex items-center justify-center text-sky-200 cursor-pointer hover:border-[#FACC15]"
              title="Settings / Sound"
            >
              {soundEnabled ? <Settings className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={() => setShowRulesModal(true)}
              className="hidden sm:flex w-8 h-8 rounded-lg bg-gradient-to-b from-[#1E3A8A] to-[#0A1938] border border-[#60A5FA]/60 items-center justify-center text-sky-200 cursor-pointer hover:border-[#FACC15]"
              title="Carrom Rules & Info"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Gems Pill + Points/Coins Pill + Mobile Recharge Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Gems Pill (Screenshot 1) */}
            <div
              onClick={() => {
                setGemsCount((g) => g + 10);
                playCarromSound('POCKET');
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#040E24] border-2 border-[#38BDF8]/70 rounded-full pl-1 pr-2.5 py-0.5 cursor-pointer hover:scale-105 transition-transform shadow-inner"
              title="Bonus Gems"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#15803D] border border-white text-white flex items-center justify-center font-black text-xs shadow">
                +
              </span>
              <span className="font-mono-num font-black text-xs text-white">{gemsCount}</span>
              <span className="text-xs">💎</span>
            </div>

            {/* Coins / Points Pill (Exact Screenshot 1 Style) */}
            <div
              onClick={() => {
                setPointHubTab('BUY');
                setPointHubNotice(null);
                setShowPointHubModal(true);
              }}
              className="flex items-center gap-1.5 bg-[#040E24] border-2 border-[#FACC15] rounded-full pl-1 pr-2.5 py-0.5 cursor-pointer hover:scale-105 transition-transform shadow-[0_0_12px_rgba(250,204,21,0.35)]"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#15803D] border border-white text-white flex items-center justify-center font-black text-xs shadow">
                +
              </span>
              <span className="font-mono-num font-black text-xs sm:text-sm text-[#FEF08A]">
                {points.toLocaleString()}
              </span>
              <span className="text-sm">🪙</span>
            </div>

            {/* Direct Mobile Recharge & Shop Button */}
            <button
              onClick={() => {
                setPointHubTab('RECHARGE');
                setPointHubNotice(null);
                setShowPointHubModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#B45309] border border-white text-[#041028] font-display font-black text-[11px] flex items-center gap-1 shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              <span>📱</span>
              <span>রিচার্জ / শপ</span>
            </button>
          </div>
        </header>
      )}

      {/* ====================================================================
          SCREEN 1: CARROM POOL HOME LOBBY (SCREENSHOT 1 & SCREENSHOT 2)
         ==================================================================== */}
      {screen === 'HOME' && (
        <div className="relative z-10 flex-1 overflow-y-auto px-2.5 sm:px-4 py-2.5 space-y-3 max-w-4xl w-full mx-auto flex flex-col justify-between">
          {/* ----------------------------------------------------------------
              TAB 2: EQUIP SCREEN (EXACT SCREENSHOT 2 REPLICA!)
              STRIKERS | PUCKS | POWERS | BOARDS | EMOJIS + FORCE/AIM/TIME BARS
             ---------------------------------------------------------------- */}
          {bottomTab === 'EQUIP' && (
            <div className="space-y-3 flex-1">
              {/* Top 5 Sub-Tabs Bar (STRIKERS | PUCKS | POWERS | BOARDS | EMOJIS) */}
              <div className="flex items-center justify-between gap-1 bg-[#05132E] border-2 border-[#D97706] rounded-xl p-1">
                <button
                  onClick={() => setBottomTab('HOME')}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-b from-[#22C55E] to-[#15803D] border border-[#FEF08A] text-white font-display font-black text-[11px] cursor-pointer shrink-0"
                >
                  ← Back
                </button>
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {(['STRIKERS', 'PUCKS', 'POWERS', 'BOARDS', 'EMOJIS'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEquipCategory(cat)}
                      className={`py-1.5 rounded-lg font-display font-black text-[10px] sm:text-xs transition-all cursor-pointer ${
                        equipCategory === cat
                          ? 'bg-gradient-to-b from-[#1E40AF] to-[#0F296B] text-[#FEF08A] border border-[#FACC15] shadow'
                          : 'text-sky-200/80 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* EQUIPPED STRIKER SHOWCASE BANNER WITH FORCE / AIM / TIME BARS (Screenshot 2) */}
              <div className="rounded-2xl bg-gradient-to-b from-[#102A63] via-[#0B1E47] to-[#071430] border-2 border-[#60A5FA]/60 p-3.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Glowing Pedestal with Active Striker */}
                <div className="flex items-center gap-3.5">
                  <div className="w-20 h-20 rounded-2xl bg-radial from-[#1E40AF] to-[#051026] border-2 border-[#FACC15] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {renderStrikerBadge(activeStrikerSkin, 'w-16 h-16')}
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#FACC15]/20 border border-[#FACC15] text-[9px] font-display font-black text-[#FEF08A]">
                      EQUIPPED {equipCategory.slice(0, -1)}
                    </span>
                    <h3 className="text-lg font-display font-black text-white mt-0.5">
                      {activeStrikerSkin.name}
                    </h3>
                    <p className="text-[11px] text-sky-300 font-bold">
                      Tier: {activeStrikerSkin.tier}
                    </p>
                  </div>
                </div>

                {/* Right: FORCE / AIM / TIME Stat Bars (Exact Screenshot 2 Visual) */}
                <div className="w-full sm:w-64 space-y-2 bg-[#051129]/90 border border-white/15 rounded-xl p-2.5">
                  {[
                    { label: 'FORCE', val: activeStrikerSkin.force, icon: '✊', color: 'bg-[#FACC15]' },
                    { label: 'AIM', val: activeStrikerSkin.aim, icon: '🎯', color: 'bg-[#38BDF8]' },
                    { label: 'TIME', val: activeStrikerSkin.time, icon: '⏱️', color: 'bg-[#4ADE80]' }
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0">
                        {stat.icon}
                      </span>
                      <span className="w-12 text-[10px] font-display font-black text-white">
                        {stat.label}
                      </span>
                      <div className="flex-1 grid grid-cols-10 gap-0.5 bg-black/50 p-0.5 rounded">
                        {Array.from({ length: 10 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 rounded-xs ${
                              idx < stat.val ? stat.color : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STRIKERS / PUCKS COLLECTION GRID (3-Column Ornate Cards like Screenshot 2) */}
              <div className="space-y-1.5">
                <div className="text-center font-display font-black text-xs tracking-wider text-[#FEF08A] uppercase">
                  — {equipCategory} COLLECTION —
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {STRIKER_SKINS.map((sk) => {
                    const isEquipped = selectedStrikerId === sk.id;
                    return (
                      <div
                        key={sk.id}
                        onClick={() => {
                          setSelectedStrikerId(sk.id);
                          playCarromSound('POCKET');
                        }}
                        className={`rounded-2xl p-3 border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                          isEquipped
                            ? 'bg-gradient-to-b from-[#1D4ED8] via-[#1E3A8A] to-[#091945] border-[#FEF08A] shadow-[0_0_18px_rgba(250,204,21,0.45)] scale-[1.02]'
                            : 'bg-gradient-to-b from-[#0E2452] to-[#071430] border-[#60A5FA]/40 hover:border-[#FACC15]'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between text-[9px] font-display font-black">
                          <span className="px-1.5 py-0.5 rounded bg-black/40 text-sky-300">
                            {sk.tier}
                          </span>
                          <span className="text-[#FEF08A]">
                            ⚡{sk.force} 🎯{sk.aim}
                          </span>
                        </div>

                        <div className="my-2.5 p-2 rounded-full bg-[#040D21]/80 border border-white/15">
                          {renderStrikerBadge(sk, 'w-14 h-14')}
                        </div>

                        <div className="w-full">
                          <div className="font-display font-black text-xs text-white truncate">
                            {sk.name}
                          </div>
                          <button
                            type="button"
                            className={`mt-1.5 w-full py-1 rounded-lg font-display font-black text-[10px] ${
                              isEquipped
                                ? 'bg-[#22C55E] text-[#041028]'
                                : 'bg-gradient-to-b from-[#FDE047] to-[#D97706] text-[#041028]'
                            }`}
                          >
                            {isEquipped ? 'EQUIPPED ✓' : 'EQUIP NOW'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 4: LEADERBOARD
             ---------------------------------------------------------------- */}
          {bottomTab === 'LEADERBOARD' && (
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between bg-[#091E46] border-2 border-[#FACC15] rounded-2xl p-3">
                <button
                  onClick={() => setBottomTab('HOME')}
                  className="px-3 py-1 rounded-xl bg-[#22C55E] border border-[#FEF08A] text-[#041028] font-display font-black text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <h2 className="text-sm sm:text-base font-display font-black text-[#FFE600]">
                  🏆 CARROM POOL GRANDMASTER RANKS
                </h2>
                <span className="text-xs font-bold text-[#4ADE80]">Live</span>
              </div>

              <div className="rounded-2xl bg-[#071838] border-2 border-[#38BDF8]/50 divide-y divide-white/10 overflow-hidden">
                {[
                  { rank: 1, name: playerNames.me, pts: points, winRate: '95%', badge: '🥇' },
                  { rank: 2, name: 'AshNero', pts: 18450, winRate: '89%', badge: '🥈' },
                  { rank: 3, name: 'Sohan', pts: 15200, winRate: '86%', badge: '🥉' },
                  { rank: 4, name: 'Tanvir Ahmed', pts: 12900, winRate: '82%', badge: '4' },
                  { rank: 5, name: 'Rakib Hasan', pts: 11400, winRate: '80%', badge: '5' }
                ].map((r) => (
                  <div
                    key={r.rank}
                    className={`px-4 py-3 flex items-center justify-between ${
                      r.rank === 1 ? 'bg-[#12367A]/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#041028] border border-[#FACC15]/50 flex items-center justify-center font-display font-black text-sm text-[#FFE600]">
                        {r.badge}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-display font-black text-white">
                          {r.name}
                        </div>
                        <div className="text-[10px] text-sky-300">Win Rate: {r.winRate}</div>
                      </div>
                    </div>
                    <div className="font-mono-num font-black text-sm text-[#FFE600]">
                      🪙 {r.pts.toLocaleString()} Pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 5: EVENTS / GOLDEN SHOT
             ---------------------------------------------------------------- */}
          {bottomTab === 'EVENTS' && (
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between bg-[#091E46] border-2 border-[#FACC15] rounded-2xl p-3">
                <button
                  onClick={() => setBottomTab('HOME')}
                  className="px-3 py-1 rounded-xl bg-[#22C55E] border border-[#FEF08A] text-[#041028] font-display font-black text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <h2 className="text-sm sm:text-base font-display font-black text-[#FFE600]">
                  🎯 GOLDEN SHOT & CARROM PASS EVENTS
                </h2>
                <span className="text-xs font-bold text-[#4ADE80]">7d 9h</span>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#78350F] via-[#B45309] to-[#451A03] border-2 border-[#FFE600] text-center space-y-3 shadow-xl">
                <div className="text-4xl">🎯👑</div>
                <h3 className="text-lg font-display font-black text-[#FFE600]">
                  GOLDEN SHOT BULLSEYE CHALLENGE
                </h3>
                <p className="text-xs text-amber-100 max-w-md mx-auto">
                  Win bonus points in Golden Shot and use your points for instant Mobile Recharge (100 Pts = ৳20) or Sports Store shopping!
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button
                    onClick={() => {
                      awardPoints(25, 'Golden Shot Bonus');
                      playCarromSound('QUEEN');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-[#041028] font-display font-black text-xs cursor-pointer shadow-lg"
                  >
                    🎁 Claim +25 Golden Shot Points
                  </button>
                  <button
                    onClick={() => {
                      setBottomTab('HOME');
                      setScreen('ARENA_SELECT');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#FFE600] text-[#041028] font-display font-black text-xs cursor-pointer shadow-lg"
                  >
                    ▶ Play Arena Match
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              TAB 3 (DEFAULT): 100% AUTHENTIC MINICLIP CARROM POOL HOME LOBBY
              (Exact Screenshot 1 Replica!)
             ---------------------------------------------------------------- */}
          {bottomTab === 'HOME' && (
            <>
              {/* 1. CARROM PASS / POINT RECHARGE GOLDEN FRAME BANNER (Screenshot 1 Top Banner) */}
              <div className="relative rounded-2xl bg-gradient-to-r from-[#091D42] via-[#133B7A] to-[#091D42] border-2 border-[#FACC15] p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#B45309] border border-white flex items-center justify-center text-xl shadow shrink-0">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-black text-xs sm:text-sm text-[#FEF08A] tracking-wide">
                        CARROM PASS & POINT HUB
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/50 border border-[#FACC15]/50 font-mono-num text-[9px] text-amber-300">
                        ⏱ 7d 9h
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-sky-100 font-semibold">
                      ১০০ পয়েন্ট = ২০ টাকা • পয়েন্ট দিয়ে খেলুন (৯৫% উইনার প্রাইজ), মোবাইল রিচার্জ ও কেনাকাটা করুন!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setPointHubTab('RECHARGE');
                      setPointHubNotice(null);
                      setShowPointHubModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-[#FEF08A] text-white font-display font-black text-[11px] cursor-pointer shadow hover:scale-105 transition-transform"
                  >
                    📱 মোবাইল রিচার্জ
                  </button>
                  <button
                    onClick={() => {
                      setPointHubTab('BUY');
                      setPointHubNotice(null);
                      setShowPointHubModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#D97706] border border-white text-[#041028] font-display font-black text-[11px] cursor-pointer shadow hover:scale-105 transition-transform"
                  >
                    ➕ পয়েন্ট কিনুন
                  </button>
                  <button
                    onClick={() => {
                      setPointHubTab('SHOP');
                      setPointHubNotice(null);
                      setShowPointHubModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#4ADE80] to-[#15803D] border border-white text-[#041028] font-display font-black text-[11px] cursor-pointer shadow hover:scale-105 transition-transform"
                  >
                    🛍️ শপ
                  </button>
                </div>
              </div>

              {/* 2. THE 3 ICONIC ARCHED/SHIELD MODE CARDS (DISC POOL | CARROM | FREESTYLE)
                     EXACTLY LIKE SCREENSHOT 1! */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 items-stretch pt-1">
                {/* LEFT ARCH CARD: PLAY DISC POOL (GREEN SHIELD ARCH) */}
                <div
                  onClick={() => {
                    setGameMode('DISC_POOL');
                    setMatchOrigin('ONLINE');
                    setScreen('ARENA_SELECT');
                  }}
                  className="group relative rounded-t-[42px] rounded-b-2xl bg-gradient-to-b from-[#22C55E] via-[#15803D] to-[#064E3B] border-[3px] border-[#FACC15] p-2.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all"
                >
                  {/* Top Info Badge */}
                  <div className="w-full flex justify-end">
                    <span className="w-5 h-5 rounded-full bg-sky-500/80 border border-white text-white font-serif font-black text-[10px] flex items-center justify-center">
                      i
                    </span>
                  </div>

                  {/* Tilted 3D Carrom Corner Pocket Graphic */}
                  <div className="my-1 sm:my-2 flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 96"
                      className="w-20 h-16 sm:w-28 sm:h-22 drop-shadow-lg group-hover:scale-105 transition-transform"
                    >
                      <polygon
                        points="16,46 62,14 106,42 60,82"
                        fill="#FDE68A"
                        stroke="#451A03"
                        strokeWidth="6"
                      />
                      <ellipse cx="62" cy="24" rx="9" ry="6" fill="#090D16" />
                      {/* Flying Black & White Pucks */}
                      <ellipse
                        cx="48"
                        cy="46"
                        rx="9"
                        ry="6.5"
                        fill="#1E293B"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="68"
                        cy="42"
                        rx="9"
                        ry="6.5"
                        fill="#FFFBEB"
                        stroke="#D97706"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="58"
                        cy="58"
                        rx="9"
                        ry="6.5"
                        fill="#FFFBEB"
                        stroke="#D97706"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  {/* Ribbon Banner + Title */}
                  <div className="w-full space-y-0.5">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#064E3B]/90 border border-[#FACC15] text-[9px] sm:text-[10px] font-display font-black text-[#FEF08A] uppercase tracking-wider">
                      PLAY
                    </div>
                    <h2 className="text-sm sm:text-xl font-display font-black text-white leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                      DISC POOL
                    </h2>
                    <div className="mx-auto w-3 h-3 rotate-45 bg-[#4ADE80] border border-white mt-1" />
                  </div>
                </div>

                {/* CENTER ARCH CARD: PLAY CARROM (CRIMSON/RED SHIELD ARCH WITH RED QUEEN) */}
                <div
                  onClick={() => {
                    setGameMode('CARROM_CLASSIC');
                    setMatchOrigin('ONLINE');
                    setScreen('ARENA_SELECT');
                  }}
                  className="group relative rounded-t-[46px] rounded-b-2xl bg-gradient-to-b from-[#EF4444] via-[#B91C1C] to-[#7F1D1D] border-[3px] border-[#FEF08A] p-2.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-[0_12px_30px_rgba(239,68,68,0.45)] hover:-translate-y-1.5 transition-all scale-[1.03]"
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="px-1.5 py-0.5 rounded bg-black/40 text-[8px] sm:text-[9px] font-display font-black text-[#FEF08A]">
                      👑 QUEEN
                    </span>
                    <span className="w-5 h-5 rounded-full bg-sky-500/90 border border-white text-white font-serif font-black text-[10px] flex items-center justify-center">
                      i
                    </span>
                  </div>

                  {/* Tilted 3D Carrom Board with Red Queen Graphic */}
                  <div className="my-1 sm:my-2 flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 96"
                      className="w-22 h-18 sm:w-30 sm:h-24 drop-shadow-xl group-hover:scale-105 transition-transform"
                    >
                      <polygon
                        points="14,46 62,12 108,42 60,84"
                        fill="#FDE68A"
                        stroke="#451A03"
                        strokeWidth="6"
                      />
                      <ellipse cx="62" cy="23" rx="9" ry="6" fill="#090D16" />
                      {/* Red Queen Puck in Center + White & Black Pucks */}
                      <ellipse
                        cx="46"
                        cy="48"
                        rx="8.5"
                        ry="6"
                        fill="#1E293B"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="72"
                        cy="46"
                        rx="8.5"
                        ry="6"
                        fill="#FFFBEB"
                        stroke="#D97706"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="60"
                        cy="39"
                        rx="9.5"
                        ry="7"
                        fill="#E11D48"
                        stroke="#FEF08A"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="w-full space-y-0.5">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#7F1D1D]/95 border border-[#FEF08A] text-[9px] sm:text-[10px] font-display font-black text-[#FEF08A] uppercase tracking-wider">
                      PLAY
                    </div>
                    <h2 className="text-sm sm:text-xl font-display font-black text-white leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                      CARROM
                    </h2>
                    <div className="mx-auto w-3 h-3 rotate-45 bg-[#EF4444] border border-white mt-1" />
                  </div>
                </div>

                {/* RIGHT ARCH CARD: PLAY FREESTYLE (BLUE/CYAN SHIELD ARCH) */}
                <div
                  onClick={() => {
                    setGameMode('FREESTYLE');
                    setMatchOrigin('ONLINE');
                    setScreen('ARENA_SELECT');
                  }}
                  className="group relative rounded-t-[42px] rounded-b-2xl bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#1E3A8A] border-[3px] border-[#FACC15] p-2.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all"
                >
                  <div className="w-full flex justify-end">
                    <span className="w-5 h-5 rounded-full bg-sky-500/80 border border-white text-white font-serif font-black text-[10px] flex items-center justify-center">
                      i
                    </span>
                  </div>

                  {/* Tilted 3D Freestyle Board Graphic */}
                  <div className="my-1 sm:my-2 flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 96"
                      className="w-20 h-16 sm:w-28 sm:h-22 drop-shadow-lg group-hover:scale-105 transition-transform"
                    >
                      <polygon
                        points="16,46 62,14 106,42 60,82"
                        fill="#FDE68A"
                        stroke="#451A03"
                        strokeWidth="6"
                      />
                      <ellipse cx="62" cy="24" rx="9" ry="6" fill="#090D16" />
                      <ellipse
                        cx="52"
                        cy="42"
                        rx="8.5"
                        ry="6"
                        fill="#E11D48"
                        stroke="#FEF08A"
                        strokeWidth="1.8"
                      />
                      <ellipse
                        cx="70"
                        cy="46"
                        rx="8.5"
                        ry="6"
                        fill="#FFFBEB"
                        stroke="#D97706"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="56"
                        cy="58"
                        rx="8.5"
                        ry="6"
                        fill="#1E293B"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <div className="w-full space-y-0.5">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#1E3A8A]/90 border border-[#FACC15] text-[9px] sm:text-[10px] font-display font-black text-[#FEF08A] uppercase tracking-wider">
                      PLAY
                    </div>
                    <h2 className="text-sm sm:text-xl font-display font-black text-white leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                      FREESTYLE
                    </h2>
                    <div className="mx-auto w-3 h-3 rotate-45 bg-[#38BDF8] border border-white mt-1" />
                  </div>
                </div>
              </div>

              {/* 3. TWO WIDE GLOSSY BUTTONS: PLAY WITH FRIENDS (PURPLE) & PRACTICE OFFLINE (TEAL)
                     EXACTLY LIKE SCREENSHOT 1! */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {/* Left: PLAY WITH FRIENDS (Purple Glossy Pill) */}
                <button
                  onClick={() => {
                    setGameMode('CARROM_CLASSIC');
                    setMatchOrigin('FRIENDS');
                    setScreen('ARENA_SELECT');
                  }}
                  className="rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#A855F7] to-[#6B21A8] border-2 border-[#FACC15] p-2.5 sm:p-3 flex items-center gap-2.5 cursor-pointer shadow-[0_6px_16px_rgba(126,34,206,0.5)] hover:scale-[1.02] active:scale-95 transition-transform text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#3B0764]/80 border border-purple-300/60 flex items-center justify-center text-xl shrink-0">
                    👥
                  </div>
                  <div className="leading-tight min-w-0">
                    <div className="font-display font-black text-xs sm:text-sm text-white drop-shadow truncate">
                      PLAY WITH
                    </div>
                    <div className="font-display font-black text-sm sm:text-base text-[#FEF08A] drop-shadow truncate">
                      FRIENDS
                    </div>
                  </div>
                </button>

                {/* Right: PRACTICE OFFLINE (Teal/Cyan Glossy Pill) */}
                <button
                  onClick={() => {
                    setGameMode('CARROM_CLASSIC');
                    setMatchOrigin('PRACTICE');
                    handleStartMatch(0, 'CARROM_CLASSIC', true);
                  }}
                  className="rounded-2xl bg-gradient-to-r from-[#0E7490] via-[#06B6D4] to-[#155E75] border-2 border-[#FACC15] p-2.5 sm:p-3 flex items-center gap-2.5 cursor-pointer shadow-[0_6px_16px_rgba(6,182,212,0.45)] hover:scale-[1.02] active:scale-95 transition-transform text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#083344]/80 border border-cyan-300/60 flex items-center justify-center text-xl shrink-0">
                    🎯
                  </div>
                  <div className="leading-tight min-w-0">
                    <div className="font-display font-black text-xs sm:text-sm text-white drop-shadow truncate">
                      PRACTICE
                    </div>
                    <div className="font-display font-black text-sm sm:text-base text-[#FEF08A] drop-shadow truncate">
                      OFFLINE
                    </div>
                  </div>
                </button>
              </div>

              {/* 4. BOTTOM CHEST SLOTS ROW (4 SLOTS + GOLDEN SHOT / RECHARGE) - SCREENSHOT 1 */}
              <div className="grid grid-cols-4 gap-2 pt-0.5">
                {[
                  {
                    title: 'CHEST SLOT',
                    sub: 'OPEN NOW (+15 Pts)',
                    icon: '📦',
                    bonus: 15,
                    active: true
                  },
                  {
                    title: 'GOLDEN SHOT',
                    sub: 'WIN PRIZES',
                    icon: '🎯',
                    bonus: 25,
                    isGolden: true
                  },
                  {
                    title: '2v2 4-PLAYER',
                    sub: 'Me + 3 Randoms',
                    icon: '🛡️',
                    bonus: 0,
                    is4P: true
                  },
                  {
                    title: 'FREE CHEST',
                    sub: '📱 রিচার্জ / শপ',
                    icon: '🧰',
                    bonus: 0,
                    isRecharge: true
                  }
                ].map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (slot.isRecharge) {
                        setPointHubTab('RECHARGE');
                        setPointHubNotice(null);
                        setShowPointHubModal(true);
                      } else if (slot.is4P) {
                        setPlayerCount(4);
                        setScreen('ARENA_SELECT');
                      } else if (slot.isGolden) {
                        setBottomTab('EVENTS');
                      } else {
                        awardPoints(slot.bonus, 'Victory Chest Reward');
                        playCarromSound('QUEEN');
                      }
                    }}
                    className="rounded-xl bg-[#05122B]/90 border-2 border-[#1E3A8A] hover:border-[#FACC15] p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-inner"
                  >
                    <span className="text-lg sm:text-xl">{slot.icon}</span>
                    <span className="font-display font-black text-[9px] sm:text-[10px] text-sky-200/90 mt-0.5 truncate w-full">
                      {slot.title}
                    </span>
                    <span className="font-display font-bold text-[8px] sm:text-[9px] text-[#FEF08A] truncate w-full">
                      {slot.sub}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ====================================================================
          SCREEN 2: "Select Mode" ARENA CAROUSEL SCREEN (EXACT SCREENSHOT 3!)
         ==================================================================== */}
      {screen === 'ARENA_SELECT' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto p-3 sm:p-4 max-w-4xl w-full mx-auto space-y-3">
          {/* Top Bar: Green Glossy Back Button + "Select Mode" Script Title + Wallet Pills */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setScreen('HOME')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D] border-2 border-[#FEF08A] text-white font-display font-black text-sm flex items-center gap-1 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <span>←</span>
              <span className="text-xs">Back</span>
            </button>

            <h1 className="text-lg sm:text-2xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] drop-shadow">
              Select Mode
            </h1>

            <div className="flex items-center gap-1.5">
              <div
                onClick={() => {
                  setPointHubTab('BUY');
                  setPointHubNotice(null);
                  setShowPointHubModal(true);
                }}
                className="flex items-center gap-1.5 bg-[#040E24] border-2 border-[#FACC15] rounded-full pl-1 pr-2.5 py-0.5 cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-[#22C55E] text-[#041028] flex items-center justify-center font-black text-[10px]">
                  +
                </span>
                <span className="font-mono-num font-black text-xs text-[#FEF08A]">
                  {points.toLocaleString()}
                </span>
                <span className="text-xs">🪙</span>
              </div>
            </div>
          </div>

          {/* 3 Connected Mode Tabs: Disc Pool | Carrom | Freestyle (Exact Screenshot 3!) */}
          <div className="max-w-lg mx-auto w-full grid grid-cols-3 bg-[#05132E] border-2 border-[#D97706] rounded-full p-1 shadow-lg">
            {[
              { id: 'DISC_POOL' as const, label: 'Disc Pool' },
              { id: 'CARROM_CLASSIC' as const, label: 'Carrom' },
              { id: 'FREESTYLE' as const, label: 'Freestyle' }
            ].map((tab) => {
              const active = gameMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setGameMode(tab.id)}
                  className={`py-1.5 px-2 rounded-full font-display font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? 'bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#1D4ED8] text-white border border-[#FEF08A] shadow'
                      : 'text-sky-200/80 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="w-4 h-4 rounded-full bg-sky-400/30 border border-white/60 text-[9px] font-serif flex items-center justify-center">
                    i
                  </span>
                </button>
              );
            })}
          </div>

          {/* Players (1v1 / 2v2) + Entry Point Tiers Selector Strip (10 to 5000 Pts) */}
          <div className="bg-[#061636]/90 border border-[#60A5FA]/40 rounded-2xl p-2.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* 2 Players vs 4 Players */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPlayerCount(2)}
                  className={`px-2.5 py-1 rounded-lg font-display font-black text-[11px] cursor-pointer border ${
                    playerCount === 2
                      ? 'bg-[#FFE600] text-[#041028] border-white'
                      : 'bg-[#040E24] text-sky-200 border-white/15'
                  }`}
                >
                  👥 2 Players (Me vs {playerNames.top})
                </button>
                <button
                  onClick={() => setPlayerCount(4)}
                  className={`px-2.5 py-1 rounded-lg font-display font-black text-[11px] cursor-pointer border ${
                    playerCount === 4
                      ? 'bg-[#FFE600] text-[#041028] border-white'
                      : 'bg-[#040E24] text-sky-200 border-white/15'
                  }`}
                >
                  🛡️ 4 Players (Me + 3 Randoms)
                </button>
              </div>

              <div className="text-[11px] font-mono-num font-black text-[#4ADE80]">
                মোট পট: {totalPot} • ৫% ফি: -{appFee5Percent} • 🏆 উইনার (৯৫%): {winnerPrize95Percent} Pts
              </div>
            </div>

            {/* Entry Point Chips (10, 20, 30, 40, 50, 100 ... 5000) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              <span className="text-[10px] font-display font-black text-[#FEF08A] shrink-0 mr-1">
                Entry Pts:
              </span>
              {ENTRY_POINT_TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setEntryPoints(tier)}
                  className={`px-2.5 py-1 rounded-lg font-mono-num font-black text-[11px] cursor-pointer border shrink-0 transition-all ${
                    entryPoints === tier
                      ? 'bg-gradient-to-b from-[#FEF08A] to-[#F59E0B] text-[#041028] border-white scale-105'
                      : 'bg-[#040E24] text-white border-[#FACC15]/30 hover:border-[#FACC15]'
                  }`}
                >
                  🪙 {tier}
                </button>
              ))}
            </div>
          </div>

          {/* CENTER ARENA CARD CAROUSEL WITH < AND > ARROWS (EXACT SCREENSHOT 3!) */}
          <div className="flex items-center justify-center gap-2 sm:gap-5 my-auto">
            {/* Left Carousel Arrow */}
            <button
              onClick={() => {
                const nextIdx = (arenaIndex - 1 + CARROM_ARENAS.length) % CARROM_ARENAS.length;
                setArenaIndex(nextIdx);
                setEntryPoints(CARROM_ARENAS[nextIdx].entry);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#091534] border-2 border-[#FACC15] flex items-center justify-center text-[#FEF08A] cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-transform shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center Ornate Gold-Framed Arena Card (e.g. DELHI LOUNGE) */}
            <div
              onClick={() => handleStartMatch()}
              className="w-full max-w-[295px] rounded-[28px] p-1 bg-gradient-to-b from-[#FEF08A] via-[#D97706] to-[#78350F] shadow-[0_14px_35px_rgba(0,0,0,0.75)] cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div
                className="rounded-[24px] p-4 flex flex-col items-center justify-between text-center min-h-[255px] relative overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${currentArena.accentFrom}, ${currentArena.accentVia}, ${currentArena.accentTo})`
                }}
              >
                {/* Top Prize Ribbon */}
                <div className="w-full py-1.5 px-3 rounded-xl bg-black/45 border border-[#FEF08A]/70 flex items-center justify-center gap-1.5 shadow">
                  <span className="text-xs font-display font-bold text-emerald-200">Prize:</span>
                  <span className="font-mono-num font-black text-base sm:text-lg text-[#FEF08A]">
                    🏆 {winnerPrize95Percent.toLocaleString()}
                  </span>
                  <span className="text-sm">🪙</span>
                </div>

                {/* Center Monument + 3D Carrom Board Illustration */}
                <div className="my-3 relative flex flex-col items-center">
                  <div className="text-3xl mb-1 drop-shadow">{currentArena.monument}</div>
                  <svg viewBox="0 0 160 88" className="w-40 h-22 drop-shadow-xl">
                    <polygon
                      points="18,44 80,10 142,44 80,78"
                      fill="#FDE68A"
                      stroke="#451A03"
                      strokeWidth="6"
                    />
                    <circle cx="80" cy="44" r="14" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                    {gameMode !== 'DISC_POOL' && (
                      <circle cx="80" cy="41" r="6.5" fill="#E11D48" stroke="#FEF08A" strokeWidth="1.5" />
                    )}
                    <circle cx="65" cy="45" r="6" fill="#FFFBEB" stroke="#B45309" strokeWidth="1.5" />
                    <circle cx="95" cy="45" r="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                    <circle cx="80" cy="54" r="6" fill="#FFFBEB" stroke="#B45309" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Arena Name & Entry Fee Footer */}
                <div className="w-full space-y-1.5">
                  <div className="font-display font-black text-base sm:text-lg text-white tracking-wide drop-shadow">
                    {currentArena.name}
                  </div>
                  <div className="text-[11px] font-bold text-amber-100">{currentArena.bangla}</div>

                  <button
                    type="button"
                    className="w-full py-2 rounded-xl bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] border border-white text-[#041028] font-display font-black text-xs sm:text-sm shadow-lg"
                  >
                    PLAY NOW (🪙 {entryPoints} PTS) ▶
                  </button>
                </div>
              </div>
            </div>

            {/* Right Carousel Arrow */}
            <button
              onClick={() => {
                const nextIdx = (arenaIndex + 1) % CARROM_ARENAS.length;
                setArenaIndex(nextIdx);
                setEntryPoints(CARROM_ARENAS[nextIdx].entry);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#091534] border-2 border-[#FACC15] flex items-center justify-center text-[#FEF08A] cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-transform shrink-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Rule & Online Players Bar (Exact Screenshot 3 Footer!) */}
          <div className="bg-[#040E24]/95 border-t-2 border-[#D97706] rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-bold text-white">
              <span className="text-[#4ADE80] font-black">Rule: </span>
              {gameMode === 'DISC_POOL'
                ? 'Pocket all your White pucks before your opponent (No Red Queen)!'
                : gameMode === 'FREESTYLE'
                ? 'Score highest points! Red Queen = 50, White = 20, Black = 10.'
                : 'Pocket the Red puck (Queen) before the last puck!'}
            </div>
            <div className="font-mono-num font-bold text-[#FEF08A]">
              Online Players: <span className="text-white">{currentArena.onlineCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCREEN 2.5: "VS" MATCHMAKING SCREEN (EXACT SCREENSHOT 4!)
         ==================================================================== */}
      {screen === 'MATCHMAKING' && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-between p-4 max-w-2xl w-full mx-auto text-center">
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setScreen('ARENA_SELECT')}
              className="px-3 py-1.5 rounded-xl bg-[#EF4444] border border-[#FEF08A] text-white font-display font-black text-xs cursor-pointer"
            >
              ← Cancel
            </button>
            <div className="font-serif italic font-black text-xl text-[#FEF08A]">
              {gameMode === 'DISC_POOL'
                ? 'Disc Pool'
                : gameMode === 'FREESTYLE'
                ? 'Freestyle'
                : 'Carrom'}
            </div>
            <button
              onClick={() => setScreen('BOARD')}
              className="px-3 py-1.5 rounded-xl bg-[#22C55E] text-[#041028] font-display font-black text-xs cursor-pointer"
            >
              Skip ▶
            </button>
          </div>

          {/* Center VS Arena Card + Me (You) VS Distinct Random Opponent */}
          <div className="my-auto w-full space-y-6">
            {/* Arena Prize Box */}
            <div className="mx-auto w-56 rounded-3xl p-1 bg-gradient-to-b from-[#FEF08A] to-[#B45309] shadow-2xl">
              <div className="rounded-[20px] bg-gradient-to-b from-[#10B981] to-[#064E3B] p-4 space-y-2">
                <div className="text-xs font-display font-black text-emerald-200 uppercase">
                  {currentArena.name}
                </div>
                <div className="text-3xl">🎯🏆</div>
                <div className="py-1 px-3 rounded-xl bg-black/45 border border-[#FEF08A] font-mono-num font-black text-lg text-[#FEF08A]">
                  PRIZE: {winnerPrize95Percent} 🪙
                </div>
                <div className="text-[10px] text-emerald-100">95% Winner Pot (5% App Fee)</div>
              </div>
            </div>

            {/* Avatars Row: Me (You) VS Opponent */}
            <div className="flex items-center justify-center gap-5 sm:gap-8">
              {/* Left: Me (You) */}
              <div className="space-y-1.5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#FEF08A] to-[#B45309] p-1 shadow-xl mx-auto">
                  <div className="w-full h-full rounded-xl bg-[#0B2552] flex items-center justify-center text-3xl">
                    😎
                  </div>
                </div>
                <div className="font-display font-black text-sm text-[#4ADE80]">
                  {playerNames.me}
                </div>
                <div className="text-[10px] font-mono-num text-[#FEF08A]">Entry: 🪙 {entryPoints}</div>
              </div>

              {/* Center VS Circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#EF4444] to-[#991B1B] border-2 border-white flex items-center justify-center font-display font-black text-base text-white shadow-lg">
                VS
              </div>

              {/* Right: Opponent */}
              <div className="space-y-1.5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#FEF08A] to-[#B45309] p-1 shadow-xl mx-auto">
                  <div className="w-full h-full rounded-xl bg-[#1E1B4B] flex items-center justify-center text-3xl">
                    🧔
                  </div>
                </div>
                <div className="font-display font-black text-sm text-white">{playerNames.top}</div>
                <div className="text-[10px] font-mono-num text-[#FEF08A]">Entry: 🪙 {entryPoints}</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-sky-200 animate-pulse">
            ম্যাচ বোর্ড লোড হচ্ছে... আপনার নাম সর্বদা Me (You)!
          </div>
        </div>
      )}

      {/* ====================================================================
          SCREEN 3: IN-GAME CARROM BOARD SCREEN (EXACT SCREENSHOTS 5, 6, 7, 8!)
         ==================================================================== */}
      {screen === 'BOARD' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-2 sm:p-3 max-w-xl w-full mx-auto">
          {/* ================================================================
              TOP PLAYER VS OPPONENT SCORE HEADER (EXACT SCREENSHOTS 5-8!)
             ================================================================ */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              {/* LEFT PLAYER: ME (YOU) - White Pucks + Queen Indicator Badge Below */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  {/* Avatar with Green Timer Ring on Active Turn */}
                  <div
                    className={`relative w-12 h-12 rounded-xl p-0.5 transition-all ${
                      turn === 'ME'
                        ? 'bg-gradient-to-b from-[#4ADE80] to-[#16A34A] shadow-[0_0_16px_rgba(74,222,128,0.8)] scale-105'
                        : 'bg-gradient-to-b from-[#FACC15] to-[#B45309] opacity-85'
                    }`}
                  >
                    <div className="w-full h-full rounded-[10px] bg-[#091D42] flex items-center justify-center text-xl">
                      😎
                    </div>
                    <span className="absolute -bottom-1 -left-1 px-1 rounded bg-[#0284C7] border border-white text-[8px] font-mono-num font-black text-white">
                      1
                    </span>
                    {turn === 'ME' && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 rounded-full bg-[#22C55E] text-[#041028] font-mono-num font-black text-[9px] border border-white">
                        {turnTimeLeft}s
                      </span>
                    )}
                  </div>

                  {/* Name + White Moulded Puck Score Counter */}
                  <div>
                    <div className="font-display font-black text-xs sm:text-sm text-white leading-tight">
                      {playerNames.me}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#FDE68A] to-[#D97706] border-2 border-[#78350F] flex items-center justify-center shadow">
                        <span className="font-mono-num font-black text-xs text-[#041028]">
                          {gameMode === 'FREESTYLE' ? myScore : whitePocketedCount}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#4ADE80]">
                        ({whitePocketedCount}/{whiteTotalCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Red Queen Indicator Badge below Left Avatar (Exact Screenshot 6/7/8!) */}
                {gameMode !== 'DISC_POOL' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#05132E]/90 border border-[#FACC15]/60">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FB7185] to-[#BE123C] border border-[#FEF08A] flex items-center justify-center text-[8px]">
                      👑
                    </span>
                    <span className="text-[9px] font-display font-black text-[#FEF08A]">
                      {queenOnBoard
                        ? 'Queen (+30)'
                        : queenPocketedBy === 'ME'
                        ? 'Queen: YOU ✓'
                        : `Queen: ${playerNames.top}`}
                    </span>
                  </div>
                )}
              </div>

              {/* CENTER: Back Button + 95% Pot Prize + Recharge Quick Button */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setScreen('HOME')}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border-2 border-[#FEF08A] text-white font-display font-black text-[11px] flex items-center gap-1 shadow cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      setPointHubTab('RECHARGE');
                      setPointHubNotice(null);
                      setShowPointHubModal(true);
                    }}
                    className="px-2 py-1 rounded-xl bg-[#040E24] border border-[#FACC15] text-[#FEF08A] font-mono-num font-black text-[11px] cursor-pointer"
                    title="Points & Mobile Recharge"
                  >
                    🪙 {points}
                  </button>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-[#040E24]/90 border border-[#4ADE80]/60 text-[10px] font-mono-num font-black text-[#4ADE80]">
                  🏆 Pot: {winnerPrize95Percent} Pts
                </div>
              </div>

              {/* RIGHT PLAYER: OPPONENT - Black Pucks */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  {/* Name + Black Moulded Puck Score Counter */}
                  <div className="text-right">
                    <div className="font-display font-black text-xs sm:text-sm text-white leading-tight">
                      {playerNames.top}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1.5">
                      <span className="text-[10px] font-bold text-sky-300">
                        ({blackPocketedCount}/{blackTotalCount})
                      </span>
                      <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-[#475569] via-[#1E293B] to-[#020617] border-2 border-[#94A3B8] flex items-center justify-center shadow">
                        <span className="font-mono-num font-black text-xs text-white">
                          {gameMode === 'FREESTYLE' ? oppScore : blackPocketedCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Opponent Avatar */}
                  <div
                    className={`relative w-12 h-12 rounded-xl p-0.5 transition-all ${
                      turn === 'OPPONENT'
                        ? 'bg-gradient-to-b from-[#4ADE80] to-[#16A34A] shadow-[0_0_16px_rgba(74,222,128,0.8)] scale-105'
                        : 'bg-gradient-to-b from-[#FACC15] to-[#B45309] opacity-85'
                    }`}
                  >
                    <div className="w-full h-full rounded-[10px] bg-[#1E1B4B] flex items-center justify-center text-xl">
                      🧔
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1 rounded bg-[#0284C7] border border-white text-[8px] font-mono-num font-black text-white">
                      2
                    </span>
                    {turn === 'OPPONENT' && (
                      <span className="absolute -top-1.5 -left-1.5 px-1 rounded-full bg-[#EF4444] text-white font-mono-num font-black text-[9px] border border-white">
                        {turnTimeLeft}s
                      </span>
                    )}
                  </div>
                </div>

                {/* 4-Player Partner & Opponent 2 Mini Tags if 4P Mode */}
                {playerCount === 4 && (
                  <div className="text-[9px] font-bold text-sky-200 bg-[#05132E]/90 px-2 py-0.5 rounded border border-white/15">
                    ⚪ {playerNames.left} • ⚫ {playerNames.right}
                  </div>
                )}
              </div>
            </div>

            {/* Active Chat Bubble or Compact Status Strip */}
            {activeChatBubble ? (
              <div className="px-3 py-1 rounded-xl bg-[#FEF08A] text-[#041028] font-display font-black text-xs text-center shadow">
                {activeChatBubble.who === 'ME' ? `${playerNames.me}: ` : `${playerNames.top}: `}
                {activeChatBubble.text}
              </div>
            ) : (
              <div className="px-2.5 py-0.5 rounded-lg bg-[#040E24]/85 border border-sky-400/30 text-center text-[10px] font-bold text-[#FEF08A] truncate">
                {statusBanner}
              </div>
            )}
          </div>

          {/* ================================================================
              CENTER: 100% AUTHENTIC MINICLIP CARROM POOL WOODEN BOARD SVG
              (Exact Match to Screenshots 5, 6, 7, 8!)
             ================================================================ */}
          <div className="my-1 flex items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-[32px] p-3 bg-gradient-to-br from-[#2B0902] via-[#1C0501] to-[#120300] border-[3px] border-[#5C2409] shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
              {/* 4 Ornate Brass/Gold Corner Brackets with Rivets (Exact Screenshots 5-8!) */}
              <div className="pointer-events-none absolute top-0 left-0 w-11 h-11 rounded-tl-[28px] border-t-[5px] border-l-[5px] border-[#D97706] shadow-inner" />
              <div className="pointer-events-none absolute top-0 right-0 w-11 h-11 rounded-tr-[28px] border-t-[5px] border-r-[5px] border-[#D97706] shadow-inner" />
              <div className="pointer-events-none absolute bottom-0 left-0 w-11 h-11 rounded-bl-[28px] border-b-[5px] border-l-[5px] border-[#D97706] shadow-inner" />
              <div className="pointer-events-none absolute bottom-0 right-0 w-11 h-11 rounded-br-[28px] border-b-[5px] border-r-[5px] border-[#D97706] shadow-inner" />

              <svg
                ref={svgRef}
                viewBox="0 0 420 420"
                onPointerDown={(e) => {
                  setIsDraggingBoard(true);
                  setHasDraggedAim(false);
                  handleBoardPointerMove(e);
                }}
                onPointerMove={handleBoardPointerMove}
                onPointerUp={handleBoardPointerUp}
                className="w-full h-full rounded-[22px] touch-none cursor-crosshair select-none"
              >
                <defs>
                  {/* Smooth Warm Cream/Maple Carrom Board Surface (Like Screenshots 5-8) */}
                  <radialGradient id="carromBoardCream" cx="50%" cy="50%" r="62%">
                    <stop offset="0%" stopColor="#FCE7C2" />
                    <stop offset="70%" stopColor="#F3CE93" />
                    <stop offset="100%" stopColor="#E2B26B" />
                  </radialGradient>

                  {/* 3D Moulded White/Ivory Puck Gradient */}
                  <radialGradient id="mouldedWhitePuck" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="55%" stopColor="#FEF3C7" />
                    <stop offset="88%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </radialGradient>

                  {/* 3D Moulded Black/Charcoal Puck Gradient */}
                  <radialGradient id="mouldedBlackPuck" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#64748B" />
                    <stop offset="48%" stopColor="#1E293B" />
                    <stop offset="88%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>

                  {/* 3D Moulded Red Queen Puck Gradient */}
                  <radialGradient id="mouldedQueenPuck" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FDA4AF" />
                    <stop offset="45%" stopColor="#E11D48" />
                    <stop offset="85%" stopColor="#9F1239" />
                    <stop offset="100%" stopColor="#4C0519" />
                  </radialGradient>

                  <filter id="carromDiscShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow
                      dx="0"
                      dy="2.4"
                      stdDeviation="1.9"
                      floodColor="#000000"
                      floodOpacity="0.48"
                    />
                  </filter>
                </defs>

                {/* Dark Mahogany Outer Recess */}
                <rect x="0" y="0" width="420" height="420" rx="22" fill="#1F0601" />

                {/* Smooth Birch/Cream Playfield (22..398) */}
                <rect
                  x="20"
                  y="20"
                  width="380"
                  height="380"
                  rx="20"
                  fill="url(#carromBoardCream)"
                  stroke="#5C2409"
                  strokeWidth="3"
                />

                {/* ============================================================
                    4 AUTHENTIC CARROM BASELINES WITH RED END CIRCLES & DOTS
                    (Exact Match to Screenshots 5, 6, 7, 8!)
                   ============================================================ */}
                {/* Top Baseline */}
                <line x1="84" y1="63" x2="336" y2="63" stroke="#5C2409" strokeWidth="2.2" />
                <line x1="84" y1="81" x2="336" y2="81" stroke="#5C2409" strokeWidth="1.4" />
                <circle cx="84" cy="72" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="336" cy="72" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="84" cy="72" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="336" cy="72" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="145" cy="72" r="2" fill="#5C2409" />
                <circle cx="275" cy="72" r="2" fill="#5C2409" />

                {/* Bottom Baseline (Me / You) */}
                <line x1="84" y1="339" x2="336" y2="339" stroke="#5C2409" strokeWidth="1.4" />
                <line x1="84" y1="357" x2="336" y2="357" stroke="#5C2409" strokeWidth="2.2" />
                <circle cx="84" cy="348" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="336" cy="348" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="84" cy="348" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="336" cy="348" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="145" cy="348" r="2" fill="#5C2409" />
                <circle cx="275" cy="348" r="2" fill="#5C2409" />

                {/* Left Baseline */}
                <line x1="63" y1="84" x2="63" y2="336" stroke="#5C2409" strokeWidth="2.2" />
                <line x1="81" y1="84" x2="81" y2="336" stroke="#5C2409" strokeWidth="1.4" />
                <circle cx="72" cy="84" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="72" cy="336" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="72" cy="84" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="72" cy="336" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="72" cy="145" r="2" fill="#5C2409" />
                <circle cx="72" cy="275" r="2" fill="#5C2409" />

                {/* Right Baseline */}
                <line x1="339" y1="84" x2="339" y2="336" stroke="#5C2409" strokeWidth="1.4" />
                <line x1="357" y1="84" x2="357" y2="336" stroke="#5C2409" strokeWidth="2.2" />
                <circle cx="348" cy="84" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="348" cy="336" r="9" fill="#EF4444" stroke="#5C2409" strokeWidth="2" />
                <circle cx="348" cy="84" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="348" cy="336" r="12" fill="none" stroke="#5C2409" strokeWidth="1" />
                <circle cx="348" cy="145" r="2" fill="#5C2409" />
                <circle cx="348" cy="275" r="2" fill="#5C2409" />

                {/* ============================================================
                    4 DIAGONAL FOUL LINES WITH TRIDENT ARROWS & CURVED C-ARCS
                    (Exact Match to Screenshots 5, 6, 7, 8!)
                   ============================================================ */}
                <line x1="58" y1="58" x2="144" y2="144" stroke="#5C2409" strokeWidth="1.6" />
                <line x1="362" y1="58" x2="276" y2="144" stroke="#5C2409" strokeWidth="1.6" />
                <line x1="58" y1="362" x2="144" y2="276" stroke="#5C2409" strokeWidth="1.6" />
                <line x1="362" y1="362" x2="276" y2="276" stroke="#5C2409" strokeWidth="1.6" />

                {/* Curved C-Arcs & Arrows at Inner Ends of Diagonal Lines */}
                <path
                  d="M 128 148 A 14 14 0 1 1 148 128"
                  fill="none"
                  stroke="#5C2409"
                  strokeWidth="1.5"
                />
                <path
                  d="M 272 128 A 14 14 0 1 1 292 148"
                  fill="none"
                  stroke="#5C2409"
                  strokeWidth="1.5"
                />
                <path
                  d="M 148 292 A 14 14 0 1 1 128 272"
                  fill="none"
                  stroke="#5C2409"
                  strokeWidth="1.5"
                />
                <path
                  d="M 292 272 A 14 14 0 1 1 272 292"
                  fill="none"
                  stroke="#5C2409"
                  strokeWidth="1.5"
                />

                {/* ============================================================
                    CENTER 12-PETAL LOTUS MANDALA & CIRCUMFERENCE DOTS
                    (Exact Match to Screenshots 6, 7, 8!)
                   ============================================================ */}
                <circle cx="210" cy="210" r="56" fill="none" stroke="#5C2409" strokeWidth="1.8" />
                {/* 12 Decorative Dots around Outer Center Ring */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const rad = (i * 30 * Math.PI) / 180;
                  return (
                    <circle
                      key={i}
                      cx={210 + Math.cos(rad) * 51}
                      cy={210 + Math.sin(rad) * 51}
                      r="1.8"
                      fill={i % 2 === 0 ? '#DC2626' : '#5C2409'}
                    />
                  );
                })}
                {/* 12-Pointed Star Mandala Petals */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const deg = i * 30;
                  return (
                    <path
                      key={i}
                      d="M 210 210 L 204 176 L 210 164 L 216 176 Z"
                      transform={`rotate(${deg} 210 210)`}
                      fill={i % 2 === 0 ? '#DC2626' : '#5C2409'}
                      opacity="0.7"
                    />
                  );
                })}
                <circle
                  cx="210"
                  cy="210"
                  r="14.5"
                  fill="#EF4444"
                  stroke="#5C2409"
                  strokeWidth="2"
                />
                <circle cx="210" cy="210" r="5" fill="#FEF08A" />

                {/* ============================================================
                    4 DEEP CORNER POCKETS WITH REALISTIC INNER RIM
                   ============================================================ */}
                {[
                  { x: 42, y: 42 },
                  { x: 378, y: 42 },
                  { x: 42, y: 378 },
                  { x: 378, y: 378 }
                ].map((pk, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pk.x}
                      cy={pk.y}
                      r="23"
                      fill="#130704"
                      stroke="#5C2409"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={pk.x}
                      cy={pk.y}
                      r="18.5"
                      fill="#090D16"
                      stroke="#3E1605"
                      strokeWidth="1.5"
                    />
                    <circle cx={pk.x} cy={pk.y} r="13" fill="#020617" />
                  </g>
                ))}

                {/* ============================================================
                    CARROM POOL GLOWING AIM RING, DIRECTIONAL POINTER & SEGMENTED
                    POWER CIRCLE (EXACT MATCH TO SCREENSHOTS 6, 7 & 8!)
                   ============================================================ */}
                {!isMoving && turn === 'ME' && (
                  <g>
                    {/* Translucent Glowing Halo Around Striker (Screenshots 6 & 7) */}
                    <circle
                      cx={strikerDisk.x}
                      cy={strikerDisk.y}
                      r="33"
                      fill="rgba(255,255,255,0.18)"
                      stroke="rgba(255,255,255,0.75)"
                      strokeWidth="1.8"
                    />

                    {/* Segmented Radial Power Ticks Around Striker (Screenshot 8!) */}
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const tickDeg = idx * 15;
                      const rad = (tickDeg * Math.PI) / 180;
                      const rIn = 24;
                      const rOut = 28 + (aimPower / 100) * 10;
                      return (
                        <line
                          key={idx}
                          x1={strikerDisk.x + Math.cos(rad) * rIn}
                          y1={strikerDisk.y + Math.sin(rad) * rIn}
                          x2={strikerDisk.x + Math.cos(rad) * rOut}
                          y2={strikerDisk.y + Math.sin(rad) * rOut}
                          stroke={powerRingColor}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                      );
                    })}

                    {/* Glowing Dotted Aim Trajectory Line + Target Ghost Ring (Screenshot 8) */}
                    <line
                      x1={strikerDisk.x}
                      y1={strikerDisk.y}
                      x2={guideX}
                      y2={guideY}
                      stroke="#FFFFFF"
                      strokeWidth="3.6"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    <line
                      x1={strikerDisk.x}
                      y1={strikerDisk.y}
                      x2={guideX}
                      y2={guideY}
                      stroke={powerRingColor}
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />

                    {/* Target Impact Ghost Ring */}
                    <circle
                      cx={guideX}
                      cy={guideY}
                      r="12"
                      fill="rgba(255,255,255,0.15)"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <circle cx={guideX} cy={guideY} r="3.5" fill={powerRingColor} />
                  </g>
                )}

                {/* ============================================================
                    RENDER ALL 3D MOULDED CARROM PUCKS (WHITE, BLACK, RED QUEEN)
                    & CUSTOM STRIKER (EXACT SCREENSHOTS 5, 6, 7, 8!)
                   ============================================================ */}
                {pucks.map((d) => {
                  if (d.pocketed) return null;

                  if (d.type === 'STRIKER') {
                    return (
                      <g key={d.id} filter="url(#carromDiscShadow)">
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r}
                          fill={activeStrikerSkin.inner}
                          stroke={activeStrikerSkin.outer}
                          strokeWidth="3.2"
                        />
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.68}
                          fill="none"
                          stroke={activeStrikerSkin.core}
                          strokeWidth="1.8"
                          strokeDasharray="4 2.5"
                        />
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.34}
                          fill={activeStrikerSkin.outer}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                        />
                        <circle cx={d.x - 4.5} cy={d.y - 4.5} r="2.4" fill="#FFFFFF" opacity="0.85" />
                      </g>
                    );
                  }

                  if (d.type === 'QUEEN') {
                    return (
                      <g key={d.id} filter="url(#carromDiscShadow)">
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r}
                          fill="url(#mouldedQueenPuck)"
                          stroke="#881337"
                          strokeWidth="1.6"
                        />
                        {/* Concentric Moulded Acrylic Rings */}
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.72}
                          fill="none"
                          stroke="#FECDD3"
                          strokeWidth="1.4"
                          opacity="0.85"
                        />
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.4}
                          fill="none"
                          stroke="#FEF08A"
                          strokeWidth="1.2"
                        />
                        <circle cx={d.x} cy={d.y} r="2.5" fill="#FEF08A" />
                        <circle cx={d.x - 4} cy={d.y - 4} r="2.2" fill="#FFFFFF" opacity="0.65" />
                      </g>
                    );
                  }

                  if (d.type === 'WHITE') {
                    return (
                      <g key={d.id} filter="url(#carromDiscShadow)">
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r}
                          fill="url(#mouldedWhitePuck)"
                          stroke="#92400E"
                          strokeWidth="1.5"
                        />
                        {/* Concentric Moulded Acrylic Ridges (Like Real Carrom Pool Pucks!) */}
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.72}
                          fill="none"
                          stroke="#D97706"
                          strokeWidth="1.2"
                          opacity="0.65"
                        />
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={d.r * 0.42}
                          fill="none"
                          stroke="#B45309"
                          strokeWidth="1"
                          opacity="0.55"
                        />
                        <circle cx={d.x - 4} cy={d.y - 4} r="2.4" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    );
                  }

                  // BLACK Moulded Puck
                  return (
                    <g key={d.id} filter="url(#carromDiscShadow)">
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={d.r}
                        fill="url(#mouldedBlackPuck)"
                        stroke="#020617"
                        strokeWidth="1.6"
                      />
                      {/* Concentric Moulded Ridges */}
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={d.r * 0.72}
                        fill="none"
                        stroke="#64748B"
                        strokeWidth="1.2"
                        opacity="0.65"
                      />
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={d.r * 0.42}
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      <circle cx={d.x - 4} cy={d.y - 4} r="2.2" fill="#FFFFFF" opacity="0.45" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ================================================================
              BOTTOM WOODEN DIAGONAL-STRIPED STRIKER SLIDER BAR + CHAT + CONTROLS
              (EXACT VISUAL MATCH TO SCREENSHOTS 5, 6, 7, 8!)
             ================================================================ */}
          <div className="space-y-2">
            {/* Row 1: Chat Bubble Button (Left) + Authentic Diagonal-Striped Wooden Slider Track (Center) */}
            <div className="flex items-center gap-2">
              {/* Left Chat Bubble Icon (Exact Screenshots 5-8) */}
              <button
                type="button"
                onClick={() => setShowChatPopup((v) => !v)}
                className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#1E3A8A] to-[#0A1938] border-2 border-[#60A5FA] flex items-center justify-center text-white shadow-lg cursor-pointer hover:border-[#FACC15] shrink-0"
                title="Quick Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* AUTHENTIC CARROM POOL WOODEN DIAGONAL-STRIPED STRIKER SLIDER BAR */}
              <div className="relative flex-1 h-12 rounded-full bg-gradient-to-b from-[#5C2409] via-[#3E1605] to-[#270C02] border-2 border-[#D97706] px-4 flex items-center shadow-[0_6px_18px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Diagonal Wood Chevron Stripes Inside Track (Just like Screenshots 5-8!) */}
                <div
                  className="pointer-events-none absolute inset-1.5 rounded-full opacity-40"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, #92400E 0px, #92400E 10px, #270C02 10px, #270C02 20px)'
                  }}
                />
                {/* Left & Right Circular End Caps Inside Slider Bar */}
                <div className="pointer-events-none w-5 h-5 rounded-full border-2 border-[#D97706]/70 bg-[#1F0601] shrink-0" />
                <input
                  type="range"
                  min={84}
                  max={336}
                  value={strikerX}
                  disabled={isMoving || turn !== 'ME'}
                  onChange={(e) => handleStrikerSlide(Number(e.target.value))}
                  className="relative z-10 w-full mx-2 accent-[#FEF08A] cursor-pointer h-6"
                />
                <div className="pointer-events-none w-5 h-5 rounded-full border-2 border-[#D97706]/70 bg-[#1F0601] shrink-0" />
              </div>
            </div>

            {/* Quick Chat Popup Tray */}
            {showChatPopup && (
              <div className="flex flex-wrap gap-1.5 bg-[#05132E] border border-[#FACC15] rounded-xl p-2">
                {QUICK_CHATS.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => {
                      setActiveChatBubble({ who: 'ME', text: msg });
                      setShowChatPopup(false);
                      setTimeout(() => setActiveChatBubble(null), 2600);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0E295C] hover:bg-[#1D4ED8] text-[11px] font-bold text-white cursor-pointer border border-white/15"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            )}

            {/* Row 2: Bottom-Left Menu/Back Button + Fine Aim/Power/Auto-Aim + Big STRIKE Button */}
            <div className="bg-[#05132E]/95 border border-[#FACC15]/60 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-1.5">
              {/* Left: Menu (☰) & Back (↩) Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowBoardMenuModal(true)}
                  className="w-9 h-9 rounded-xl bg-[#0B224C] border border-sky-400/50 flex items-center justify-center text-sky-200 font-black text-sm cursor-pointer"
                  title="Board Menu"
                >
                  ☰
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('HOME')}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border border-[#FEF08A] text-white font-display font-black text-xs cursor-pointer"
                >
                  ← Back
                </button>
              </div>

              {/* Center: Angle Adjust + Auto-Aim */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAimAngle((a) => Math.max(-175, a - 5))}
                  disabled={isMoving || turn !== 'ME'}
                  className="px-2 py-1.5 rounded-lg bg-[#0E295C] border border-white/20 text-xs font-black text-white cursor-pointer disabled:opacity-40"
                  title="Aim Left"
                >
                  ◄ Aim
                </button>
                <button
                  type="button"
                  onClick={handleAutoAimBestShot}
                  disabled={isMoving || turn !== 'ME'}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-[#FEF08A] text-white font-display font-black text-xs cursor-pointer disabled:opacity-40"
                >
                  🎯 Auto-Aim
                </button>
                <button
                  type="button"
                  onClick={() => setAimAngle((a) => Math.min(-5, a + 5))}
                  disabled={isMoving || turn !== 'ME'}
                  className="px-2 py-1.5 rounded-lg bg-[#0E295C] border border-white/20 text-xs font-black text-white cursor-pointer disabled:opacity-40"
                  title="Aim Right"
                >
                  Aim ►
                </button>
              </div>

              {/* Right: Big Glossy STRIKE Button */}
              <button
                type="button"
                onClick={() => handleStrikeShot()}
                disabled={isMoving || turn !== 'ME'}
                className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] border-2 border-white text-[#041028] font-display font-black text-xs sm:text-sm shadow-[0_0_16px_rgba(250,204,21,0.7)] disabled:opacity-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                {turn === 'ME' ? '🔥 STRIKE!' : '⌛ OPPONENT...'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCREEN 4: WINNER CROWN & 95% PRIZE DISTRIBUTION SCREEN
         ==================================================================== */}
      {screen === 'WINNER' && (
        <div className="relative z-20 flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-start">
              <button
                onClick={() => setScreen('HOME')}
                className="px-3 py-1 rounded-xl bg-[#EF4444] border border-[#FFE600] text-white font-display font-black text-xs cursor-pointer"
              >
                ← Back
              </button>
            </div>
            <div className="text-5xl">👑🎯</div>
            <h2 className="text-2xl font-display font-black text-[#FFE600]">
              {winnerWho === 'ME' ? 'VICTORY! YOU WON!' : 'MATCH COMPLETED'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white">
              Winner:{' '}
              <strong className="text-[#4ADE80]">
                {winnerWho === 'ME' ? playerNames.me : playerNames.top}
              </strong>
            </p>

            <div className="rounded-2xl bg-[#04102E] border-2 border-[#4ADE80] p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-sky-200">Total Carrom Pot:</span>
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
              <div className="text-[10px] text-[#FFE600] pt-1">
                ১০০ পয়েন্ট = ২০ টাকা • এই পয়েন্ট দিয়ে সরাসরি মোবাইল রিচার্জ অথবা Sports Store শপিং করুন!
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setPointHubTab('RECHARGE');
                  setPointHubNotice(null);
                  setShowPointHubModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-[#FFE600] text-white font-display font-black text-xs cursor-pointer"
              >
                📱 মোবাইল রিচার্জ করুন
              </button>
              <button
                onClick={() => handleStartMatch()}
                className="px-4 py-2.5 rounded-xl bg-[#22C55E] text-[#041028] font-display font-black text-xs cursor-pointer"
              >
                ▶ Play Again
              </button>
              <button
                onClick={() => setScreen('HOME')}
                className="px-4 py-2.5 rounded-xl bg-white/15 text-white font-display font-black text-xs cursor-pointer"
              >
                Home Lobby
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          AUTHENTIC CARROM POOL 5-TAB BOTTOM NAVIGATION BAR (SCREENSHOT 1 & 2)
          SHOP | EQUIP | HOME | LEADERBOARD | EVENTS
         ==================================================================== */}
      {screen === 'HOME' && (
        <nav className="relative z-20 bg-gradient-to-t from-[#030A1C] via-[#081A3E] to-[#0E295C] border-t-2 border-[#D97706] px-2 py-1.5">
          <div className="max-w-xl mx-auto grid grid-cols-5 gap-1">
            {[
              { id: 'SHOP' as const, label: 'SHOP', icon: '🪙', badge: 'HOT' },
              { id: 'EQUIP' as const, label: 'EQUIP', icon: '🎯', badge: '6' },
              { id: 'HOME' as const, label: 'HOME', icon: '⚔️' },
              { id: 'LEADERBOARD' as const, label: 'RANKS', icon: '🏆' },
              { id: 'EVENTS' as const, label: 'EVENTS', icon: '📅', badge: '1' }
            ].map((t) => {
              const active = bottomTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (t.id === 'SHOP') {
                      setPointHubTab('RECHARGE');
                      setPointHubNotice(null);
                      setShowPointHubModal(true);
                    } else {
                      setBottomTab(t.id);
                    }
                  }}
                  className={`relative py-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] border-2 border-[#FEF08A] text-[#FEF08A] -translate-y-1 shadow-lg'
                      : 'text-sky-200/80 hover:text-white'
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-1 right-2 px-1.5 rounded-full bg-[#EF4444] border border-white text-[8px] font-mono-num font-black text-white">
                      {t.badge}
                    </span>
                  )}
                  <span className="text-base sm:text-lg leading-none">{t.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-display font-black mt-0.5">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ====================================================================
          MODAL 1: POINT HUB (1. MOBILE RECHARGE FIRST, 2. BUY POINTS, 3. SHOP)
         ==================================================================== */}
      {showPointHubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#0C2766] via-[#071842] to-[#040D26] border-[3px] border-[#FACC15] p-4 sm:p-5 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header with Back & Close */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPointHubModal(false)}
                  className="px-2.5 py-1 rounded-xl bg-[#EF4444] border border-[#FFE600] text-white font-display font-black text-xs cursor-pointer"
                >
                  ← Back
                </button>
                <div>
                  <h3 className="text-sm sm:text-base font-display font-black text-[#FFE600]">
                    📱 মোবাইল রিচার্জ, পয়েন্ট ও কেনাকাটা হাব
                  </h3>
                  <p className="text-[11px] text-sky-200">
                    ১০০ পয়েন্ট = ২০ টাকা • আপনার ব্যালেন্স:{' '}
                    <strong className="text-[#4ADE80]">{points} পয়েন্ট</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPointHubModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white font-black text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 3 Tabs: 1. MOBILE RECHARGE (FIRST!) | 2. BUY POINTS | 3. SHOPPING */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#04102E] p-1.5 rounded-2xl border border-white/15">
              <button
                onClick={() => {
                  setPointHubTab('RECHARGE');
                  setPointHubNotice(null);
                }}
                className={`py-2 rounded-xl font-display font-black text-[11px] sm:text-xs cursor-pointer transition-all ${
                  pointHubTab === 'RECHARGE'
                    ? 'bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border border-[#FFE600] shadow'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                📱 ১. মোবাইল রিচার্জ
              </button>
              <button
                onClick={() => {
                  setPointHubTab('BUY');
                  setPointHubNotice(null);
                }}
                className={`py-2 rounded-xl font-display font-black text-[11px] sm:text-xs cursor-pointer transition-all ${
                  pointHubTab === 'BUY'
                    ? 'bg-[#FFE600] text-[#051438] shadow'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                🪙 ২. পয়েন্ট কিনুন
              </button>
              <button
                onClick={() => {
                  setPointHubTab('SHOP');
                  setPointHubNotice(null);
                }}
                className={`py-2 rounded-xl font-display font-black text-[11px] sm:text-xs cursor-pointer transition-all ${
                  pointHubTab === 'SHOP'
                    ? 'bg-[#22C55E] text-[#051438] shadow'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                🛍️ ৩. কেনাকাটা
              </button>
            </div>

            {pointHubNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-[#4ADE80] text-xs font-bold text-[#4ADE80] text-center">
                {pointHubNotice}
              </div>
            )}

            {/* TAB 1: MOBILE RECHARGE WITH POINTS */}
            {pointHubTab === 'RECHARGE' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0284C7]/30 via-[#1E3A8A]/40 to-[#0284C7]/30 border border-[#38BDF8]/60 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-display font-black text-[#FFE600]">
                      ⚡ পয়েন্ট দিয়ে ইনস্ট্যান্ট মোবাইল রিচার্জ (সকল অপারেটর)
                    </div>
                    <div className="text-[11px] text-sky-200">
                      রেট: ১০০ পয়েন্ট = ২০ টাকা • গ্রামীণফোন, রবি, বাংলালিংক, এয়ারটেল, টেলিটক
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#04102E] border border-[#FFE600] font-mono-num font-black text-xs text-[#4ADE80] shrink-0">
                    = ৳{Math.floor(points * 0.2)}
                  </span>
                </div>

                {/* Operator Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-sky-200 block">
                    ১. সিম অপারেটর সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(
                      [
                        { id: 'Grameenphone', short: 'GP', prefix: '017/013', color: 'from-sky-500 to-blue-700' },
                        { id: 'Robi', short: 'Robi', prefix: '018', color: 'from-red-500 to-rose-700' },
                        { id: 'Banglalink', short: 'BL', prefix: '019/014', color: 'from-orange-500 to-amber-700' },
                        { id: 'Airtel', short: 'Airtel', prefix: '016', color: 'from-rose-500 to-red-800' },
                        { id: 'Teletalk', short: 'Teletalk', prefix: '015', color: 'from-emerald-500 to-green-700' }
                      ] as const
                    ).map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setRechargeOperator(op.id)}
                        className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all bg-gradient-to-b ${op.color} ${
                          rechargeOperator === op.id
                            ? 'border-[#FFE600] scale-105 shadow-lg'
                            : 'border-white/15 opacity-75'
                        }`}
                      >
                        <div className="font-display font-black text-xs text-white">{op.short}</div>
                        <div className="text-[9px] text-white/90 font-mono-num">{op.prefix}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Number Input & Prepaid/Postpaid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-sky-200 block">
                      ২. মোবাইল নাম্বার (১১ ডিজিট):
                    </label>
                    <input
                      type="tel"
                      value={rechargePhone}
                      onChange={(e) => handlePhoneInputChange(e.target.value)}
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#04102E] border-2 border-[#38BDF8] text-white font-mono-num font-black text-sm focus:outline-none focus:border-[#FFE600]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-sky-200 block">সিমের ধরন:</label>
                    <div className="grid grid-cols-2 gap-1 bg-[#04102E] p-1 rounded-xl border border-white/15">
                      {(['Prepaid', 'Postpaid'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRechargeSimType(st)}
                          className={`py-2 rounded-lg font-display font-black text-[11px] cursor-pointer ${
                            rechargeSimType === st
                              ? 'bg-[#FFE600] text-[#051438]'
                              : 'text-white/70'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recharge Packages */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-sky-200 block">
                    ৩. রিচার্জের পরিমাণ সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { tk: 20, pts: 100 },
                      { tk: 30, pts: 150 },
                      { tk: 50, pts: 250 },
                      { tk: 100, pts: 500 },
                      { tk: 200, pts: 1000 },
                      { tk: 500, pts: 2500 }
                    ].map((pkg) => {
                      const active = selectedRechargePkg.tk === pkg.tk;
                      return (
                        <button
                          key={pkg.tk}
                          type="button"
                          onClick={() => setSelectedRechargePkg(pkg)}
                          className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${
                            active
                              ? 'bg-gradient-to-b from-[#FFE600] to-[#F59E0B] text-[#051438] border-white scale-105 shadow'
                              : 'bg-[#04102E] text-white border-[#38BDF8]/40 hover:border-[#FFE600]'
                          }`}
                        >
                          <div className="font-mono-num font-black text-sm">৳{pkg.tk}</div>
                          <div
                            className={`text-[10px] font-mono-num font-bold ${
                              active ? 'text-[#051438]' : 'text-[#4ADE80]'
                            }`}
                          >
                            {pkg.pts} Pts
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMobileRechargeWithPoints()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00DC58] via-[#22C55E] to-[#16A34A] border-2 border-white text-[#04140A] font-display font-black text-sm shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
                >
                  📲 এখনই ৳{selectedRechargePkg.tk} রিচার্জ করুন ({selectedRechargePkg.pts} পয়েন্ট)
                </button>

                {rechargeHistory.length > 0 && (
                  <div className="p-2.5 rounded-2xl bg-[#04102E] border border-white/15 space-y-1.5">
                    <div className="text-[11px] font-display font-black text-[#FFE600]">
                      ✔ সাম্প্রতিক মোবাইল রিচার্জ হিস্ট্রি:
                    </div>
                    {rechargeHistory.slice(0, 3).map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg"
                      >
                        <div>
                          <span className="font-mono-num font-bold text-white">{h.phone}</span>{' '}
                          <span className="text-sky-300">({h.operator})</span>
                        </div>
                        <div className="font-mono-num font-black text-[#4ADE80]">
                          ৳{h.tk} (-{h.pts} Pts)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: BUY POINTS */}
            {pointHubTab === 'BUY' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-[#04102E] p-2.5 rounded-xl border border-white/15">
                  <span className="text-xs font-bold text-sky-200">পেমেন্ট মেথড সিলেক্ট করুন:</span>
                  <div className="flex gap-1.5">
                    {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => (
                      <button
                        key={gw}
                        onClick={() => setSelectedPayGateway(gw)}
                        className={`px-2.5 py-1 rounded-lg font-display font-black text-xs cursor-pointer ${
                          selectedPayGateway === gw
                            ? 'bg-[#FFE600] text-[#051438]'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {gw}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { pts: 100, tk: 20, tag: 'STARTER' },
                    { pts: 250, tk: 50, tag: 'POPULAR' },
                    { pts: 500, tk: 100, tag: 'VALUE' },
                    { pts: 1000, tk: 200, tag: 'PRO PACK' },
                    { pts: 2500, tk: 500, tag: 'ROYAL PACK' },
                    { pts: 5000, tk: 1000, tag: 'VIP KING' }
                  ].map((pack) => (
                    <div
                      key={pack.pts}
                      onClick={() => {
                        setPoints((p) => p + pack.pts);
                        playCarromSound('WIN');
                        setPointHubNotice(
                          `✔ সফল! ${selectedPayGateway} দিয়ে ৳${pack.tk} পেমেন্টে +${pack.pts} পয়েন্ট যোগ হয়েছে!`
                        );
                      }}
                      className="p-3 rounded-2xl bg-gradient-to-b from-[#102A6B] to-[#06143A] border-2 border-[#FACC15]/70 hover:border-[#FFE600] text-center space-y-1.5 cursor-pointer hover:scale-[1.03] transition-transform shadow-md"
                    >
                      <span className="inline-block px-2 py-0.5 rounded bg-[#FFE600]/20 text-[#FFE600] font-display font-black text-[9px]">
                        {pack.tag}
                      </span>
                      <div className="text-2xl">🪙</div>
                      <div className="font-mono-num font-black text-base text-white">
                        {pack.pts} Pts
                      </div>
                      <div className="py-1 rounded-xl bg-[#22C55E] text-[#04140A] font-mono-num font-black text-xs">
                        ৳{pack.tk} কিনুন
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SHOPPING WITH POINTS */}
            {pointHubTab === 'SHOP' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  {CARROM_SHOP_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#04102E] border-2 border-[#38BDF8]/40 flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <div className="text-xs font-display font-black text-white leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-mono-num font-bold text-[#FFE600]">
                            🪙 {item.pts} Pts (৳{item.tk})
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (points < item.pts) {
                            setPointHubTab('BUY');
                            setPointHubNotice(
                              `⚠ "${item.name}" কিনতে ${item.pts} পয়েন্ট প্রয়োজন! আগে পয়েন্ট কিনুন।`
                            );
                            return;
                          }
                          setPoints((p) => p - item.pts);
                          playCarromSound('WIN');
                          setPointHubNotice(
                            `🎉 অভিনন্দন! ${item.pts} পয়েন্ট দিয়ে "${item.name}" অর্ডার সম্পন্ন হয়েছে!`
                          );
                        }}
                        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#FFE600] to-[#F59E0B] text-[#051438] font-display font-black text-xs cursor-pointer"
                      >
                        পয়েন্ট দিয়ে কিনুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: BOARD SETTINGS & QUICK MENU MODAL
         ==================================================================== */}
      {showBoardMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] p-5 space-y-3 text-center shadow-2xl">
            <h3 className="text-base font-display font-black text-[#FFE600]">
              ⚙️ CARROM POOL SETTINGS
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setReleaseToShoot((v) => !v)}
                className="w-full py-2.5 rounded-xl bg-[#041028] border border-[#38BDF8] text-white font-display font-black cursor-pointer"
              >
                🎯 Drag & Release Shot: {releaseToShoot ? 'ON (সক্রিয়)' : 'OFF (শুধু বাটন)'}
              </button>
              <button
                onClick={() => {
                  setShowBoardMenuModal(false);
                  handleStartMatch(undefined, undefined, true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1D4ED8] border border-[#FFE600] text-white font-display font-black cursor-pointer"
              >
                🔄 নতুন ব্রেক র‍্যাক সাজান (Restart Rack)
              </button>
              <button
                onClick={() => {
                  setShowBoardMenuModal(false);
                  setPointHubTab('RECHARGE');
                  setShowPointHubModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#22C55E] text-[#041028] font-display font-black cursor-pointer"
              >
                📱 মোবাইল রিচার্জ ও শপ খুলুন
              </button>
              <button
                onClick={() => {
                  setShowBoardMenuModal(false);
                  setScreen('HOME');
                }}
                className="w-full py-2.5 rounded-xl bg-[#EF4444] text-white font-display font-black cursor-pointer"
              >
                ← ক্যারম লবিতে ফিরে যান (Back to Home)
              </button>
              <button
                onClick={() => setShowBoardMenuModal(false)}
                className="w-full py-2 rounded-xl bg-white/10 text-white font-bold cursor-pointer"
              >
                বন্ধ করুন (Resume Game)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: CARROM POOL RULES MODAL
         ==================================================================== */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#081A48] border-[3px] border-[#FACC15] p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-[#FEF08A]">
                🎯 CARROM POOL RULES & PRIZE SYSTEM
              </h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <ul className="text-xs text-sky-100 space-y-1.5 list-disc pl-4">
              <li>
                <strong>আপনার নাম ও গুটি:</strong> আপনার সিটে সর্বদা <strong>Me (You)</strong> লেখা থাকবে এবং আপনি সর্বদা <strong>সাদা গুটি (White Pucks)</strong> খেলবেন। প্রতিপক্ষের নাম সর্বদা ভিন্ন র‍্যান্ডম নাম হবে।
              </li>
              <li>
                <strong>Play Carrom (Classic):</strong> শেষ সাদা গুটি ফেলার আগে অবশ্যই লাল কুইন (Red Queen) পকেটে ফেলতে হবে।
              </li>
              <li>
                <strong>Play Disc Pool:</strong> লাল কুইন ছাড়া দ্রুত সব সাদা গুটি পকেটে ফেললেই বিজয়ী!
              </li>
              <li>
                <strong>Play Freestyle:</strong> সাদা = ২০ পয়েন্ট, কালো = ১০ পয়েন্ট, রেড কুইন = ৫০ পয়েন্ট।
              </li>
              <li>
                <strong>৯৫% উইনার প্রাইজ ও মোবাইল রিচার্জ:</strong> এন্ট্রি পয়েন্ট ১০ থেকে ৫,০০০। মোট পটের ৫% অ্যাপ ফি বাদে ৯৫% পয়েন্ট বিজয়ী পাবে এবং ১০০ পয়েন্ট = ২০ টাকা রেটে সরাসরি মোবাইল রিচার্জ বা শপিং করা যাবে।
              </li>
            </ul>
            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2 rounded-xl bg-[#FFE600] text-[#041028] font-display font-black text-xs cursor-pointer"
            >
              বুঝেছি (Got It)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
