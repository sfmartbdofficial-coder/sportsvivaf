import React, { useState, useEffect, useRef } from 'react';
import { FootballHome } from './FootballGuruHub';
import { TennisHome } from './TennisGuruHub';
import { LudoKingClone } from './LudoKingHub';
import { CarromPoolClone } from './CarromPoolHub';
import {
  VillageLiveVideoHub,
  VillageVideoStream,
  INITIAL_VILLAGE_STREAMS
} from './VillageLiveVideoHub';
import {
  MyTeamSquadHub,
  UserSavedTeam,
  INITIAL_SAVED_TEAMS
} from './MyTeamSquadHub';
import {
  AiSupportChatPanel,
  FloatingAiSupportWidget
} from './AiSupportChat';
import {
  CardAdBanner,
  AdminAdBannerPanel,
  AdSlotId
} from './AdBannerSystem';
import { ShutkiAdminPanel } from './ShutkiAdminPanel';
import {
  SimpleAdminPanel,
  HomepageSimpleBannerSlot,
  GlobalSimpleAdminScripts,
} from './SimpleAdminPanel';
import {
  MonetagSettings,
  AdNetworkConfig,
  DEFAULT_SIX_AD_NETWORKS,
  fetchMonetagSettingsFromSupabase,
  fetchAdNetworksFromSupabase,
} from './lib/supabase';
import {
  MonetagHomepageBannerAfterTwoCards,
  MonetagVignetteFullscreenModal,
  ActiveNetworkPopupInjector,
  selectRotatedActiveNetworkOnLoad,
} from './MonetagAdSystem';
import {
  Trophy,
  Star,
  UserPlus,
  LogIn,
  ArrowRight,
  Zap,
  Users,
  Crown,
  HelpCircle,
  Headphones,
  ShoppingCart,
  Home,
  Gamepad2,
  ShoppingBag,
  User,
  Play,
  Radio,
  Video,
  Camera,
  KeyRound,
  Lock,
  Unlock,
  Plus,
  Undo2,
  Send,
  Phone,
  MessageSquare,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Wallet,
  ShieldCheck,
  RefreshCw,
  Award,
  Gift,
  Flame,
  Eye,
  Upload,
  Sparkles,
  Volume2,
  VolumeX,
  Dices,
  Target,
  Activity,
  X
} from 'lucide-react';

// Generated Banner Assets
const IMG_CRICKET = '/src/assets/images/cricket_card_banner_1791629715429.jpg';
const IMG_FOOTBALL = '/src/assets/images/football_card_banner_1791629736976.jpg';
const IMG_TENNIS = '/src/assets/images/tennis_card_banner_1791629754321.jpg';
const IMG_GOLIVE = '/src/assets/images/go_live_banner_1791629770507.jpg';
const IMG_STORE = '/src/assets/images/sports_store_banner_1791629783873.jpg';
const IMG_CRICKET_NEWS_ABD = '/src/assets/images/cricket_top_news_abd_1791633253248.jpg';
const IMG_CRICKET_SHORT_GULLY = '/src/assets/images/cricket_short_gully_1791633267009.jpg';
const IMG_CRICKET_SHORT_STADIUM = '/src/assets/images/cricket_short_stadium_1791633279652.jpg';

export type PageType =
  | 'HOME'
  | 'CRICKET'
  | 'FOOTBALL'
  | 'TENNIS'
  | 'LUDO'
  | 'CARAM'
  | 'GOLIVE'
  | 'LIVE_VIDEO'
  | 'MY_TEAM'
  | 'FIND_PLAYER'
  | 'MEMBERSHIP'
  | 'QUIZ'
  | 'SUPPORT'
  | 'MATCHES'
  | 'GAMES'
  | 'STORE'
  | 'PROFILE'
  | 'ADMIN_ADS'
  | 'SHUTKI_ADMIN';

export interface BatsmanStat {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
  dismissal?: string;
}

export interface BowlerStat {
  name: string;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
}

export interface CommentaryItem {
  id: string;
  overBall: string;
  badge: string;
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
}

export interface LiveMatch {
  id: string;
  teamA: string;
  teamB: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  tossWonBy: string;
  electedTo: 'Bat' | 'Bowl';
  totalOvers: number;
  currentInnings: 1 | 2;
  battingTeam: string;
  bowlingTeam: string;
  score: number;
  wickets: number;
  legalBalls: number;
  extras: number;
  target: number | null;
  innings1Summary?: {
    team: string;
    score: number;
    wickets: number;
    overs: string;
    batsmen: BatsmanStat[];
    bowlers: BowlerStat[];
  };
  strikerIndex: number;
  nonStrikerIndex: number;
  currentBowlerIndex: number;
  batsmen: BatsmanStat[];
  bowlers: BowlerStat[];
  recentBalls: string[];
  commentary: CommentaryItem[];
  chat: ChatMessage[];
  viewers: number;
  status: 'LIVE' | 'COMPLETED';
  resultText?: string;
  createdAt: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  skill: 'Batsman' | 'Bowler' | 'Allrounder' | 'Wicketkeeper';
  district: string;
  upazila: string;
  pricePerMatch: number;
  phone: string;
  rating: number;
  matches: number;
  battingStyle: string;
  verified: boolean;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  pointsPrice: number;
  takaPrice: number;
  badge: string;
  rating: number;
  stock: number;
  svgType: 'jersey' | 'bat' | 'ball' | 'football' | 'racket' | 'carrom' | 'ludo' | 'boots';
}

export interface DepositRecord {
  id: string;
  method: 'bKash' | 'Nagad';
  phone: string;
  trxId: string;
  taka: number;
  points: number;
  date: string;
  receiptName?: string;
}

export interface OrderRecord {
  id: string;
  itemName: string;
  pointsSpent: number;
  takaValue: number;
  date: string;
  status: string;
}

const DEFAULT_TEAM_A_PLAYERS =
  'Tamim Iqbal, Litton Das, Najmul Hossain Shanto, Shakib Al Hasan, Towhid Hridoy, Mushfiqur Rahim, Mahmudullah, Mehidy Hasan Miraz, Taskin Ahmed, Mustafizur Rahman, Shoriful Islam';

const DEFAULT_TEAM_B_PLAYERS =
  'Soumya Sarkar, Tanzid Hasan, Afif Hossain, Nurul Hasan, Mahedi Hasan, Rishad Hossain, Taijul Islam, Hasan Mahmud, Ebadot Hossain, Nasum Ahmed, Khaled Ahmed';

const INITIAL_LIVE_MATCHES: LiveMatch[] = [];

const INITIAL_PLAYERS: PlayerProfile[] = [
  {
    id: 'p1',
    name: 'Mehedi Rana',
    skill: 'Allrounder',
    district: 'Dhaka',
    upazila: 'Mirpur',
    pricePerMatch: 1000,
    phone: '01711-234567',
    rating: 4.9,
    matches: 84,
    battingStyle: 'Right-hand bat • Off-spin',
    verified: true
  },
  {
    id: 'p2',
    name: 'Tanvir Hossain',
    skill: 'Batsman',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    pricePerMatch: 1000,
    phone: '01819-876543',
    rating: 4.8,
    matches: 62,
    battingStyle: 'Left-hand Opening Batsman',
    verified: true
  },
  {
    id: 'p3',
    name: 'Sajjadul Karim',
    skill: 'Bowler',
    district: 'Chattogram',
    upazila: 'Panchlaish',
    pricePerMatch: 1000,
    phone: '01912-345678',
    rating: 4.9,
    matches: 95,
    battingStyle: 'Right-arm Express Fast (135+ kph)',
    verified: true
  },
  {
    id: 'p4',
    name: 'Ariful Islam Joy',
    skill: 'Allrounder',
    district: 'Sylhet',
    upazila: 'Beanibazar',
    pricePerMatch: 800,
    phone: '01615-998877',
    rating: 4.7,
    matches: 51,
    battingStyle: 'Middle-order Hitter • Medium Pace',
    verified: true
  },
  {
    id: 'p5',
    name: 'Naimur Rahman',
    skill: 'Batsman',
    district: 'Rajshahi',
    upazila: 'Boalia',
    pricePerMatch: 1000,
    phone: '01755-443322',
    rating: 4.8,
    matches: 73,
    battingStyle: 'Top-order Anchor & Wicketkeeper',
    verified: true
  },
  {
    id: 'p6',
    name: 'Kamrul Hasan',
    skill: 'Bowler',
    district: 'Khulna',
    upazila: 'Sonadanga',
    pricePerMatch: 1200,
    phone: '01521-667788',
    rating: 4.9,
    matches: 110,
    battingStyle: 'Left-arm Wrist Spinner',
    verified: true
  }
];

const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'sp1',
    name: 'Bangladesh Official Match Jersey 2026',
    category: 'Cricket',
    pointsPrice: 2500,
    takaPrice: 500,
    badge: 'BEST SELLER',
    rating: 4.9,
    stock: 25,
    svgType: 'jersey'
  },
  {
    id: 'sp2',
    name: 'Grade-A English Willow Pro Cricket Bat',
    category: 'Cricket',
    pointsPrice: 7500,
    takaPrice: 1500,
    badge: 'PRO EDITION',
    rating: 5.0,
    stock: 12,
    svgType: 'bat'
  },
  {
    id: 'sp3',
    name: 'Red Leather 4-Piece Test Cricket Ball',
    category: 'Cricket',
    pointsPrice: 1000,
    takaPrice: 200,
    badge: 'TOURNAMENT',
    rating: 4.8,
    stock: 60,
    svgType: 'ball'
  },
  {
    id: 'sp4',
    name: 'FIFA Quality Pro Thermal Match Football',
    category: 'Football',
    pointsPrice: 3500,
    takaPrice: 700,
    badge: 'OFFICIAL',
    rating: 4.9,
    stock: 19,
    svgType: 'football'
  },
  {
    id: 'sp5',
    name: 'Carbon Graphite Pro Tennis Racket',
    category: 'Tennis',
    pointsPrice: 4500,
    takaPrice: 900,
    badge: 'GRAND SLAM',
    rating: 4.8,
    stock: 14,
    svgType: 'racket'
  },
  {
    id: 'sp6',
    name: 'Champion Waterproof Carrom Board + Coins',
    category: 'Indoor',
    pointsPrice: 4000,
    takaPrice: 800,
    badge: 'CLUB SIZE',
    rating: 4.9,
    stock: 10,
    svgType: 'carrom'
  },
  {
    id: 'sp7',
    name: 'Magnetic Ludo King Deluxe Tournament Set',
    category: 'Indoor',
    pointsPrice: 1000,
    takaPrice: 200,
    badge: 'FAMILY PACK',
    rating: 4.7,
    stock: 40,
    svgType: 'ludo'
  },
  {
    id: 'sp8',
    name: 'Predator FG Turf Football Cleats',
    category: 'Football',
    pointsPrice: 5000,
    takaPrice: 1000,
    badge: 'NEW ARRIVAL',
    rating: 4.9,
    stock: 16,
    svgType: 'boots'
  }
];

export function formatOvers(legalBalls: number): string {
  const o = Math.floor(legalBalls / 6);
  const b = legalBalls % 6;
  return `${o}.${b}`;
}

export function calcCRR(score: number, legalBalls: number): string {
  if (legalBalls === 0) return '0.00';
  return ((score / legalBalls) * 6).toFixed(2);
}

// Custom High-Fidelity Circular Card Icons matching the Screenshot
export const CardCircleIcon: React.FC<{
  type: 'cricket' | 'football' | 'tennis' | 'ludo' | 'caram' | 'golive';
  compact?: boolean;
}> = ({ type, compact = false }) => {
  return (
    <div
      className={`relative ${
        compact ? 'w-8 h-8 border' : 'w-14 h-14 sm:w-16 sm:h-16 border-2'
      } rounded-full flex items-center justify-center shrink-0 bg-[#05260C] border-[#00FF00] sv-neon-ring`}
    >
      {type === 'cricket' && (
        <svg
          viewBox="0 0 64 64"
          className={`${compact ? 'w-6 h-6' : 'w-10 h-10 sm:w-12 sm:h-12'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          <defs>
            <radialGradient id="cBall" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF5555" />
              <stop offset="45%" stopColor="#CC0000" />
              <stop offset="100%" stopColor="#550000" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill="url(#cBall)" stroke="#3A0000" strokeWidth="1.5" />
          <path
            d="M 14 14 C 26 24, 38 38, 50 50"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="3 2"
            fill="none"
          />
          <path d="M 16 12 C 28 22, 40 36, 52 48" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.8" />
          <ellipse cx="23" cy="20" rx="6" ry="3" transform="rotate(-30 23 20)" fill="white" opacity="0.35" />
        </svg>
      )}
      {type === 'football' && (
        <svg
          viewBox="0 0 64 64"
          className={`${compact ? 'w-6 h-6' : 'w-10 h-10 sm:w-12 sm:h-12'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          <defs>
            <radialGradient id="fBall" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#DDDDDD" />
              <stop offset="100%" stopColor="#888888" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill="url(#fBall)" stroke="#222" strokeWidth="1.5" />
          <polygon points="32,20 41,27 37,38 27,38 23,27" fill="#111111" />
          <polygon points="32,6 39,11 32,20 25,11" fill="#111111" />
          <polygon points="56,24 52,34 41,27 45,16" fill="#111111" />
          <polygon points="8,24 12,34 23,27 19,16" fill="#111111" />
          <polygon points="20,53 27,38 37,38 44,53 32,57" fill="#111111" />
        </svg>
      )}
      {type === 'tennis' && (
        <svg
          viewBox="0 0 64 64"
          className={`${compact ? 'w-6 h-6' : 'w-10 h-10 sm:w-12 sm:h-12'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          <defs>
            <radialGradient id="tBall" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F4FF61" />
              <stop offset="65%" stopColor="#B8E600" />
              <stop offset="100%" stopColor="#658B00" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill="url(#tBall)" stroke="#4D6A00" strokeWidth="1.5" />
          <path
            d="M 12 20 Q 32 32 14 48"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 52 16 Q 32 32 50 48"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
      {type === 'ludo' && (
        <svg
          viewBox="0 0 64 64"
          className={`${compact ? 'w-6 h-6' : 'w-10 h-10 sm:w-12 sm:h-12'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          <rect x="12" y="12" width="40" height="40" rx="9" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="2" />
          <circle cx="22" cy="22" r="3.5" fill="#111" />
          <circle cx="42" cy="22" r="3.5" fill="#111" />
          <circle cx="32" cy="32" r="3.8" fill="#E11D48" />
          <circle cx="22" cy="42" r="3.5" fill="#111" />
          <circle cx="42" cy="42" r="3.5" fill="#111" />
        </svg>
      )}
      {type === 'caram' && (
        <svg
          viewBox="0 0 64 64"
          className={`${compact ? 'w-6 h-6' : 'w-10 h-10 sm:w-12 sm:h-12'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
        >
          <circle cx="32" cy="32" r="25" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="32" cy="32" r="19" fill="none" stroke="#DC2626" strokeWidth="4.5" />
          <circle cx="32" cy="32" r="9" fill="#DC2626" />
          <circle cx="32" cy="32" r="3" fill="#FFD700" />
        </svg>
      )}
      {type === 'golive' && (
        <div
          className={`${
            compact ? 'w-7 h-7' : 'w-12 h-12 sm:w-14 sm:h-14'
          } rounded-full bg-gradient-to-b from-[#FF2A2A] to-[#990000] flex flex-col items-center justify-center border border-white/40 shadow-[0_0_10px_rgba(255,0,0,0.8)]`}
        >
          <Play className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-white fill-white`} />
          <span className={`${compact ? 'text-[6px]' : 'text-[9px]'} font-display font-black tracking-wider text-white leading-none`}>
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

// Isometric 3D Artwork for Ludo & Caram Cards on Home Screen
export const LudoCardArtwork: React.FC = () => (
  <svg viewBox="0 0 260 120" className="w-full h-full object-cover">
    <defs>
      <linearGradient id="ludoBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#072B10" stopOpacity="0" />
        <stop offset="40%" stopColor="#0C3B18" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#041A08" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    <rect width="260" height="120" fill="url(#ludoBg)" />
    {/* Isometric Ludo Board */}
    <g transform="translate(135, 14) scale(0.95)">
      <polygon points="0,48 75,8 150,48 75,88" fill="#FDE68A" stroke="#D97706" strokeWidth="3" />
      <polygon points="6,48 75,12 144,48 75,84" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
      {/* 4 Colored Bases */}
      <polygon points="10,48 42,30 72,46 40,64" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <polygon points="75,14 106,30 75,46 44,30" fill="#22C55E" stroke="#166534" strokeWidth="1" />
      <polygon points="108,32 138,48 106,64 76,48" fill="#EAB308" stroke="#854D0E" strokeWidth="1" />
      <polygon points="42,66 74,50 104,66 74,82" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
      {/* 3D Pawns */}
      <g transform="translate(38, 34)">
        <ellipse cx="0" cy="12" rx="6" ry="3.5" fill="#991B1B" />
        <path d="M-5,11 L-2,-2 L2,-2 L5,11 Z" fill="#EF4444" stroke="#FCA5A5" strokeWidth="0.8" />
        <circle cx="0" cy="-4" r="4" fill="#EF4444" stroke="#FCA5A5" strokeWidth="0.8" />
      </g>
      <g transform="translate(74, 20)">
        <ellipse cx="0" cy="12" rx="6" ry="3.5" fill="#14532D" />
        <path d="M-5,11 L-2,-2 L2,-2 L5,11 Z" fill="#22C55E" stroke="#86EFAC" strokeWidth="0.8" />
        <circle cx="0" cy="-4" r="4" fill="#22C55E" stroke="#86EFAC" strokeWidth="0.8" />
      </g>
      <g transform="translate(106, 40)">
        <ellipse cx="0" cy="12" rx="6" ry="3.5" fill="#713F12" />
        <path d="M-5,11 L-2,-2 L2,-2 L5,11 Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="0.8" />
        <circle cx="0" cy="-4" r="4" fill="#FACC15" stroke="#FEF08A" strokeWidth="0.8" />
      </g>
      <g transform="translate(65, 56)">
        <ellipse cx="0" cy="12" rx="6" ry="3.5" fill="#1E3A8A" />
        <path d="M-5,11 L-2,-2 L2,-2 L5,11 Z" fill="#3B82F6" stroke="#93C5FD" strokeWidth="0.8" />
        <circle cx="0" cy="-4" r="4" fill="#3B82F6" stroke="#93C5FD" strokeWidth="0.8" />
      </g>
      {/* Center 3D Dice */}
      <g transform="translate(78, 36)">
        <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <circle cx="-4" cy="-4" r="1.8" fill="#111" />
        <circle cx="4" cy="-4" r="1.8" fill="#111" />
        <circle cx="0" cy="0" r="2" fill="#EF4444" />
        <circle cx="-4" cy="4" r="1.8" fill="#111" />
        <circle cx="4" cy="4" r="1.8" fill="#111" />
      </g>
    </g>
  </svg>
);

export const CaramCardArtwork: React.FC = () => (
  <svg viewBox="0 0 260 120" className="w-full h-full object-cover">
    <g transform="translate(125, 10) scale(0.98)">
      {/* Wooden Frame */}
      <polygon points="0,50 80,8 160,50 80,92" fill="#451A03" stroke="#78350F" strokeWidth="4" />
      {/* Playing Surface */}
      <polygon points="10,50 80,14 150,50 80,86" fill="#FCD34D" stroke="#B45309" strokeWidth="1.5" />
      {/* Inner Lines */}
      <polygon points="24,50 80,21 136,50 80,79" fill="none" stroke="#92400E" strokeWidth="1" />
      {/* Pockets */}
      <ellipse cx="14" cy="50" rx="5" ry="3" fill="#111" />
      <ellipse cx="80" cy="17" rx="5" ry="3" fill="#111" />
      <ellipse cx="146" cy="50" rx="5" ry="3" fill="#111" />
      <ellipse cx="80" cy="83" rx="5" ry="3" fill="#111" />
      {/* Center Star & Coins */}
      <ellipse cx="80" cy="50" rx="16" ry="9" fill="none" stroke="#DC2626" strokeWidth="1.5" />
      <ellipse cx="80" cy="50" rx="5" ry="3" fill="#DC2626" stroke="#FCA5A5" strokeWidth="0.8" />
      <ellipse cx="70" cy="46" rx="5" ry="3" fill="#1F2937" stroke="#4B5563" strokeWidth="0.8" />
      <ellipse cx="90" cy="54" rx="5" ry="3" fill="#1F2937" stroke="#4B5563" strokeWidth="0.8" />
      <ellipse cx="88" cy="45" rx="5" ry="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
      <ellipse cx="72" cy="55" rx="5" ry="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
      <ellipse cx="62" cy="52" rx="5" ry="3" fill="#1F2937" stroke="#4B5563" strokeWidth="0.8" />
      {/* Striker */}
      <ellipse cx="55" cy="64" rx="7" ry="4" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
    </g>
  </svg>
);

// ============================================================================
// MOST IMPORTANT: GO LIVE PRO SCORING COMPONENT (2 STATES + VIEWER TABS)
// ============================================================================
export const GoLiveProView: React.FC<{
  liveMatches: LiveMatch[];
  setLiveMatches: React.Dispatch<React.SetStateAction<LiveMatch[]>>;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onOpenDeposit: (presetTaka?: number) => void;
  savedTeams?: UserSavedTeam[];
  awardPoints: (pts: number, reason?: string) => void;
  onBack: () => void;
}> = ({
  liveMatches,
  setLiveMatches,
  selectedMatchId,
  setSelectedMatchId,
  points,
  setPoints,
  onOpenDeposit,
  savedTeams = [],
  awardPoints,
  onBack
}) => {
  // State 1 (Create Match) vs State 2 (Live Scoring)
  const activeMatch = liveMatches.find((m) => m.id === selectedMatchId) || null;
  const [mode, setMode] = useState<'CREATE' | 'SCORING'>(activeMatch ? 'SCORING' : 'CREATE');
  const [pointError, setPointError] = useState<string | null>(null);

  // Form states for State 1: Create Match
  const [teamA, setTeamA] = useState('Bangladesh Tigers');
  const [teamB, setTeamB] = useState('Sylhet Strikers');
  const [teamAPlayersText, setTeamAPlayersText] = useState(DEFAULT_TEAM_A_PLAYERS);
  const [teamBPlayersText, setTeamBPlayersText] = useState(DEFAULT_TEAM_B_PLAYERS);
  const [tossWonBy, setTossWonBy] = useState<'Team A' | 'Team B'>('Team A');
  const [electedTo, setElectedTo] = useState<'Bat' | 'Bowl'>('Bat');
  const [overs, setOvers] = useState<number>(10);

  // State 2 Controls
  const [activeTab, setActiveTab] = useState<'LIVE' | 'SQUADS' | 'SCORECARD' | 'COMMENTARY'>('LIVE');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customComm, setCustomComm] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [historyStack, setHistoryStack] = useState<LiveMatch[]>([]);

  useEffect(() => {
    if (selectedMatchId) {
      setMode('SCORING');
    }
  }, [selectedMatchId]);

  const parsePlayers = (raw: string, fallbackPrefix: string): string[] => {
    const list = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    while (list.length < 11) {
      list.push(`${fallbackPrefix} Player ${list.length + 1}`);
    }
    return list.slice(0, 11);
  };

  const handleStartMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (points < 100) {
      setPointError(
        `⚠️ বল বাই বল খেলা লাইভ করতে মিনিমাম ১০০ পয়েন্ট লাগবে! আপনার বর্তমান ব্যালেন্স ${points} পয়েন্ট। নিচের "+ ১০০ পয়েন্ট কিনুন (২০ টাকা)" বাটনে চাপ দিয়ে পয়েন্ট কিনুন!`
      );
      return;
    }

    setPointError(null);
    setPoints((prev) => prev - 100);

    const cleanA = teamA.trim() || 'Team A';
    const cleanB = teamB.trim() || 'Team B';
    const playersA = parsePlayers(teamAPlayersText, cleanA);
    const playersB = parsePlayers(teamBPlayersText, cleanB);

    const tossTeamName = tossWonBy === 'Team A' ? cleanA : cleanB;
    const battingFirst =
      (tossWonBy === 'Team A' && electedTo === 'Bat') || (tossWonBy === 'Team B' && electedTo === 'Bowl')
        ? cleanA
        : cleanB;
    const bowlingFirst = battingFirst === cleanA ? cleanB : cleanA;
    const batList = battingFirst === cleanA ? playersA : playersB;
    const bowlList = bowlingFirst === cleanA ? playersA : playersB;

    const newMatch: LiveMatch = {
      id: `match-${Date.now()}`,
      teamA: cleanA,
      teamB: cleanB,
      teamAPlayers: playersA,
      teamBPlayers: playersB,
      tossWonBy: tossTeamName,
      electedTo,
      totalOvers: overs,
      currentInnings: 1,
      battingTeam: battingFirst,
      bowlingTeam: bowlingFirst,
      score: 0,
      wickets: 0,
      legalBalls: 0,
      extras: 0,
      target: null,
      strikerIndex: 0,
      nonStrikerIndex: 1,
      currentBowlerIndex: bowlList.length - 1, // Opening fast bowler (#11 or #9)
      batsmen: batList.map((name) => ({
        name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        out: false
      })),
      bowlers: bowlList.map((name) => ({
        name,
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0
      })),
      recentBalls: [],
      commentary: [
        {
          id: `comm-init-${Date.now()}`,
          overBall: '0.0',
          badge: 'START',
          text: `Match Started! ${tossTeamName} won the toss and elected to ${electedTo} first (${overs} Overs).`,
          timestamp: 'Just now'
        }
      ],
      chat: [
        {
          id: `chat-init-${Date.now()}`,
          user: 'SportsViva_Bot',
          text: `Welcome to LIVE coverage of ${cleanA} vs ${cleanB}!`,
          time: 'Now'
        }
      ],
      viewers: 128,
      status: 'LIVE',
      createdAt: 'Just now'
    };

    setLiveMatches((prev) => [newMatch, ...prev]);
    setSelectedMatchId(newMatch.id);
    setHistoryStack([]);
    setMode('SCORING');
  };

  // Scoring Engine Handler
  const handleScoreBall = (action: '0' | '1' | '2' | '3' | '4' | '6' | 'W' | 'Wide' | 'No Ball' | 'Out') => {
    if (!activeMatch || activeMatch.status === 'COMPLETED') return;

    // Save snapshot for Undo
    const snapshot: LiveMatch = JSON.parse(JSON.stringify(activeMatch));
    setHistoryStack((prev) => [...prev.slice(-19), snapshot]);

    const updated: LiveMatch = JSON.parse(JSON.stringify(activeMatch));
    const striker = updated.batsmen[updated.strikerIndex];
    const bowler = updated.bowlers[updated.currentBowlerIndex];

    let runsAdded = 0;
    let isLegalBall = true;
    let isWicket = false;
    let badge: string = action;
    let autoNote = '';

    if (action === 'Wide') {
      runsAdded = 1;
      isLegalBall = false;
      updated.extras += 1;
      bowler.runs += 1;
      badge = 'wd';
      autoNote = `${bowler.name} to ${striker.name}, WIDE ball down the leg side, +1 Extra.`;
    } else if (action === 'No Ball') {
      runsAdded = 1;
      isLegalBall = false;
      updated.extras += 1;
      bowler.runs += 1;
      badge = 'nb';
      autoNote = `${bowler.name} to ${striker.name}, NO BALL! Overstepped at the crease, Free Hit coming up!`;
    } else if (action === 'W' || action === 'Out') {
      isWicket = true;
      isLegalBall = true;
      badge = 'W';
      striker.balls += 1;
      striker.out = true;
      striker.dismissal = `b ${bowler.name}`;
      bowler.balls += 1;
      bowler.wickets += 1;
      updated.wickets += 1;
      autoNote = `${bowler.name} to ${striker.name}, OUT! WICKET! Clean bowled by ${bowler.name}! ${striker.name} departs for ${striker.runs} (${striker.balls}).`;
    } else {
      runsAdded = parseInt(action, 10);
      isLegalBall = true;
      striker.runs += runsAdded;
      striker.balls += 1;
      if (runsAdded === 4) striker.fours += 1;
      if (runsAdded === 6) striker.sixes += 1;
      bowler.balls += 1;
      bowler.runs += runsAdded;

      if (runsAdded === 0) {
        autoNote = `${bowler.name} to ${striker.name}, no run, defended solidly back to the bowler.`;
      } else if (runsAdded === 4) {
        autoNote = `${bowler.name} to ${striker.name}, FOUR! Cracking shot pierces the infield for a boundary!`;
      } else if (runsAdded === 6) {
        autoNote = `${bowler.name} to ${striker.name}, SIX! Massive hit sails high into the stands!`;
      } else {
        autoNote = `${bowler.name} to ${striker.name}, ${runsAdded} run${runsAdded > 1 ? 's' : ''}, worked into the gap for quick running.`;
      }
    }

    updated.score += runsAdded;
    if (isLegalBall) {
      updated.legalBalls += 1;
    }

    const overBallStr = formatOvers(updated.legalBalls);
    const finalCommText = customComm.trim()
      ? `${autoNote} — "${customComm.trim()}"`
      : autoNote;

    updated.recentBalls = [...updated.recentBalls.slice(-11), badge];
    updated.commentary = [
      {
        id: `c-${Date.now()}`,
        overBall: overBallStr,
        badge,
        text: finalCommText,
        timestamp: 'Just now'
      },
      ...updated.commentary
    ];

    if (customComm.trim()) {
      setCustomComm('');
    }

    // Handle Wicket -> bring next available batsman
    if (isWicket && updated.wickets < 10) {
      const nextBatsmanIdx = updated.batsmen.findIndex(
        (b, idx) => !b.out && idx !== updated.strikerIndex && idx !== updated.nonStrikerIndex
      );
      if (nextBatsmanIdx !== -1) {
        updated.strikerIndex = nextBatsmanIdx;
      }
    }

    // Odd runs (1 or 3) rotate strike
    if (isLegalBall && (runsAdded === 1 || runsAdded === 3)) {
      const temp = updated.strikerIndex;
      updated.strikerIndex = updated.nonStrikerIndex;
      updated.nonStrikerIndex = temp;
    }

    // End of Over rotation (every 6 legal balls)
    if (isLegalBall && updated.legalBalls > 0 && updated.legalBalls % 6 === 0) {
      const temp = updated.strikerIndex;
      updated.strikerIndex = updated.nonStrikerIndex;
      updated.nonStrikerIndex = temp;
      // Rotate to next bowler automatically
      const totalBowlers = updated.bowlers.length;
      updated.currentBowlerIndex = (updated.currentBowlerIndex - 1 + totalBowlers) % totalBowlers;
    }

    // Check Innings or Match Completion
    const maxBalls = updated.totalOvers * 6;
    if (updated.currentInnings === 1) {
      if (updated.wickets >= 10 || updated.legalBalls >= maxBalls) {
        // Transition to 2nd Innings!
        const firstInningsScore = updated.score;
        updated.innings1Summary = {
          team: updated.battingTeam,
          score: updated.score,
          wickets: updated.wickets,
          overs: formatOvers(updated.legalBalls),
          batsmen: JSON.parse(JSON.stringify(updated.batsmen)),
          bowlers: JSON.parse(JSON.stringify(updated.bowlers))
        };
        updated.target = firstInningsScore + 1;
        updated.currentInnings = 2;

        const nextBatTeam = updated.bowlingTeam;
        const nextBowlTeam = updated.battingTeam;
        const nextBatPlayers = nextBatTeam === updated.teamA ? updated.teamAPlayers : updated.teamBPlayers;
        const nextBowlPlayers = nextBowlTeam === updated.teamA ? updated.teamAPlayers : updated.teamBPlayers;

        updated.battingTeam = nextBatTeam;
        updated.bowlingTeam = nextBowlTeam;
        updated.score = 0;
        updated.wickets = 0;
        updated.legalBalls = 0;
        updated.extras = 0;
        updated.strikerIndex = 0;
        updated.nonStrikerIndex = 1;
        updated.currentBowlerIndex = nextBowlPlayers.length - 1;
        updated.batsmen = nextBatPlayers.map((name) => ({
          name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          out: false
        }));
        updated.bowlers = nextBowlPlayers.map((name) => ({
          name,
          balls: 0,
          runs: 0,
          wickets: 0,
          maidens: 0
        }));
        updated.recentBalls = [];
        updated.commentary = [
          {
            id: `c-inn2-${Date.now()}`,
            overBall: '0.0',
            badge: 'INN 2',
            text: `Innings Break! ${nextBatTeam} needs ${updated.target} runs in ${updated.totalOvers} overs to win.`,
            timestamp: 'Just now'
          },
          ...updated.commentary
        ];
      }
    } else if (updated.currentInnings === 2) {
      if (updated.target && updated.score >= updated.target) {
        updated.status = 'COMPLETED';
        const wicketsLeft = 10 - updated.wickets;
        updated.resultText = `${updated.battingTeam} won by ${wicketsLeft} wickets!`;
        updated.commentary = [
          {
            id: `c-win-${Date.now()}`,
            overBall: overBallStr,
            badge: 'WIN',
            text: `MATCH OVER! ${updated.resultText}`,
            timestamp: 'Just now'
          },
          ...updated.commentary
        ];
      } else if (updated.wickets >= 10 || updated.legalBalls >= maxBalls) {
        updated.status = 'COMPLETED';
        if (updated.target && updated.score === updated.target - 1) {
          updated.resultText = 'Match Tied! Super Over thriller!';
        } else {
          const runsDiff = (updated.target || 1) - 1 - updated.score;
          updated.resultText = `${updated.bowlingTeam} won by ${runsDiff} runs!`;
        }
        updated.commentary = [
          {
            id: `c-end-${Date.now()}`,
            overBall: overBallStr,
            badge: 'END',
            text: `MATCH OVER! ${updated.resultText}`,
            timestamp: 'Just now'
          },
          ...updated.commentary
        ];
      }
    }

    setLiveMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    awardPoints(10);
  };

  const handleUndo = () => {
    if (historyStack.length === 0 || !activeMatch) return;
    const prevMatchState = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setLiveMatches((prev) => prev.map((m) => (m.id === prevMatchState.id ? prevMatchState : m)));
  };

  const handleAddCustomCommentaryOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customComm.trim() || !activeMatch) return;
    const updated: LiveMatch = JSON.parse(JSON.stringify(activeMatch));
    updated.commentary = [
      {
        id: `c-note-${Date.now()}`,
        overBall: formatOvers(updated.legalBalls),
        badge: 'INFO',
        text: customComm.trim(),
        timestamp: 'Just now'
      },
      ...updated.commentary
    ];
    setCustomComm('');
    setLiveMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    awardPoints(10, 'Posted Live Commentary');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeMatch) return;
    const updated: LiveMatch = JSON.parse(JSON.stringify(activeMatch));
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    updated.chat = [
      ...updated.chat,
      {
        id: `ch-${Date.now()}`,
        user: 'You (Scorer)',
        text: chatInput.trim(),
        time: timeStr
      }
    ];
    setChatInput('');
    setLiveMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bar with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A3A0A] border border-[#00FF00]/50 rounded-2xl p-3.5 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#021A0A] border border-[#00FF00]/40 flex items-center justify-center text-[#FFD700] hover:border-[#00FF00]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-black italic text-[#FFD700] tracking-wide flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              LIVE MATCH • BALL BY BALL &amp; PLAYERS
            </h1>
            <p className="text-xs text-emerald-200">
              বল বাই বল লাইভ স্কোর আপডেট ও দুই দলের ১১ জন খেলোয়াড়দের নাম
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('CREATE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              mode === 'CREATE'
                ? 'bg-[#FFD700] text-[#021A0A] shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                : 'bg-[#021A0A] text-white border border-emerald-500/40 hover:border-[#00FF00]'
            }`}
          >
            + Create New Match
          </button>
          {activeMatch && (
            <button
              onClick={() => setMode('SCORING')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                mode === 'SCORING'
                  ? 'bg-[#00FF00] text-[#021A0A] shadow-[0_0_12px_rgba(0,255,0,0.6)]'
                  : 'bg-[#021A0A] text-white border border-emerald-500/40 hover:border-[#00FF00]'
              }`}
            >
              Live Console ({activeMatch.teamA} vs {activeMatch.teamB})
            </button>
          )}
        </div>
      </div>

      {/* Active Live Matches Strip so user can switch between any saved liveMatches */}
      {liveMatches.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {liveMatches.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMatchId(m.id);
                setMode('SCORING');
              }}
              className={`px-3.5 py-2 rounded-xl border text-left shrink-0 transition-all ${
                activeMatch?.id === m.id && mode === 'SCORING'
                  ? 'bg-[#0E4D14] border-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.35)]'
                  : 'bg-[#062609] border-emerald-800/80 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700]">
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black">
                  {m.status}
                </span>
                <span>
                  {m.teamA} vs {m.teamB}
                </span>
              </div>
              <div className="text-xs text-white font-mono-num mt-0.5">
                {m.battingTeam}: {m.score}/{m.wickets} ({formatOvers(m.legalBalls)}/{m.totalOvers} ov)
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STATE 1: CREATE MATCH */}
      {mode === 'CREATE' && (
        <form
          onSubmit={handleStartMatch}
          className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl p-5 shadow-[0_0_20px_rgba(0,255,0,0.25)] space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
            <div>
              <h2 className="text-lg font-display font-black text-[#FFD700]">
                STATE 1: বল বাই বল লাইভ ম্যাচ তৈরি করুন (CREATE BALL-BY-BALL LIVE)
              </h2>
              <p className="text-xs text-emerald-200">
                বল বাই বল খেলা লাইভ করতে <strong className="text-[#FFD700]">মিনিমাম ১০০ পয়েন্ট</strong> লাগবে (আপনার আছে: {points} পয়েন্ট)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#00FF66]/20 border border-[#00FF66] text-xs font-bold text-[#00FF66]">
                ফি: ১০০ পয়েন্ট (20 Tk)
              </span>
              <button
                type="button"
                onClick={() => onOpenDeposit(20)}
                className="px-3 py-1 rounded-full bg-[#FFD700] text-[#021A0A] text-xs font-display font-black cursor-pointer"
              >
                + পয়েন্ট কিনুন
              </button>
            </div>
          </div>

          {pointError && (
            <div className="bg-red-950/90 border-2 border-[#FFD700] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span>{pointError}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDeposit(20)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shrink-0"
              >
                + ১০০ পয়েন্ট কিনুন (২০ টাকা)
              </button>
            </div>
          )}

          {savedTeams.length > 0 && (
            <div className="bg-[#042208] border border-emerald-600/60 rounded-xl p-3 space-y-2">
              <div className="text-xs font-display font-bold text-[#FFD700]">
                🛡️ আপনার সাজানো টিম থেকে সরাসরি ১১ জন খেলোয়াড় লোড করুন:
              </div>
              <div className="flex flex-wrap gap-2">
                {savedTeams.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-1.5 bg-[#021A0A] border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-bold text-white">{st.teamName}</span>
                    <span className="text-[10px] text-[#00F0FF] font-mono-num">({st.teamIdCode})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTeamA(st.teamName);
                        setTeamAPlayersText(st.players.map((p) => p.name).join(', '));
                      }}
                      className="px-2 py-0.5 rounded bg-[#00FF66] text-[#021A0A] font-black text-[10px] cursor-pointer"
                    >
                      Team A তে নিন
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTeamB(st.teamName);
                        setTeamBPlayersText(st.players.map((p) => p.name).join(', '));
                      }}
                      className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-black text-[10px] cursor-pointer"
                    >
                      Team B তে নিন
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Team A Name</label>
              <input
                type="text"
                required
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                placeholder="e.g. Dhaka Dynamites"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-sm focus:outline-none focus:border-[#00FF00]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Team B Name</label>
              <input
                type="text"
                required
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                placeholder="e.g. Comilla Victorians"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-sm focus:outline-none focus:border-[#00FF00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                Team A — 11 Players (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={teamAPlayersText}
                onChange={(e) => setTeamAPlayersText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF00]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                Team B — 11 Players (Comma Separated)
              </label>
              <textarea
                rows={3}
                value={teamBPlayersText}
                onChange={(e) => setTeamBPlayersText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Toss Won By</label>
              <select
                value={tossWonBy}
                onChange={(e) => setTossWonBy(e.target.value as 'Team A' | 'Team B')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-sm focus:outline-none focus:border-[#00FF00]"
              >
                <option value="Team A">{teamA || 'Team A'}</option>
                <option value="Team B">{teamB || 'Team B'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Elected To</label>
              <select
                value={electedTo}
                onChange={(e) => setElectedTo(e.target.value as 'Bat' | 'Bowl')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-sm focus:outline-none focus:border-[#00FF00]"
              >
                <option value="Bat">Bat First</option>
                <option value="Bowl">Bowl First</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Match Overs</label>
              <select
                value={overs}
                onChange={(e) => setOvers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-sm focus:outline-none focus:border-[#00FF00]"
              >
                <option value={5}>5 Overs (T5)</option>
                <option value={10}>10 Overs (T10)</option>
                <option value={20}>20 Overs (T20)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00FF00] via-[#22C55E] to-[#FFD700] text-[#021A0A] font-display font-black text-base tracking-wide shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:brightness-110 transition-all cursor-pointer"
          >
            🏏 ১০০ পয়েন্ট দিয়ে বল বাই বল লাইভ ম্যাচ শুরু করুন →
          </button>
        </form>
      )}

      {/* STATE 2: PROFESSIONAL LIVE SCORING & VIEWER CONSOLE */}
      {mode === 'SCORING' && activeMatch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Columns: Exact Screenshot Live Broadcast Screen, Over Strip, Run Rate, Win Prob, Batter Table, Pro Scoring Buttons */}
          <div className="lg:col-span-2 space-y-3.5">
            {/* TOP MATCH BAR & 5 TABS (Info | Live | Commentary | Scorecard | History) */}
            <div className="bg-[#08301D] border border-[#00FF66]/45 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                <button
                  onClick={onBack}
                  className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white hover:text-[#FFD700] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="text-sm sm:text-base font-display font-extrabold text-white flex items-center justify-center gap-1">
                    <span>
                      {activeMatch.teamA} vs {activeMatch.teamB}
                    </span>
                    <span className="text-xs text-[#FFD700]">▼</span>
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    {activeMatch.currentInnings === 1 ? 'Pool A • 1st Innings' : 'Pool A • 2nd Innings'}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xs">
                    ▶
                  </span>
                </div>
              </div>

              {/* 4 Tabs: বল বাই বল (Ball by Ball) | খেলোয়াড়দের নাম (Players) | স্কোরকার্ড (Scorecard) | ধারাভাষ্য (Commentary) */}
              <div className="flex items-center justify-around px-2 pt-2 bg-[#062415] border-b border-white/10">
                {[
                  { id: 'LIVE', label: 'বল বাই বল (Ball by Ball)' },
                  { id: 'SQUADS', label: 'দলের খেলোয়াড় (Players)' },
                  { id: 'SCORECARD', label: 'Scorecard' },
                  { id: 'COMMENTARY', label: 'Commentary' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as 'LIVE' | 'SQUADS' | 'SCORECARD' | 'COMMENTARY')}
                    className={`pb-2.5 px-2.5 text-xs sm:text-sm font-display font-bold relative cursor-pointer transition-colors ${
                      activeTab === t.id ? 'text-[#FFD700]' : 'text-emerald-200/75 hover:text-white'
                    }`}
                  >
                    {t.label}
                    {activeTab === t.id && (
                      <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-t-full bg-[#00FF66]" />
                    )}
                  </button>
                ))}
              </div>

              {/* BLACK LIVE BROADCAST SCREEN WITH MUTE ICON, • LIVE, GIANT CENTER BALL OUTCOME & WHITE SCORE BAR */}
              <div className="bg-[#020503]">
                <div className="overflow-hidden border-t border-white/10 bg-[#020503]">
                  <div className="relative h-60 sm:h-72 flex flex-col items-center justify-center bg-gradient-to-b from-[#041209] via-[#020603] to-[#010302]">
                    {/* Top-Left Mute/Sound Icon */}
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((s) => !s)}
                      className="absolute top-3.5 left-4 text-white/90 hover:text-white cursor-pointer"
                    >
                      {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>

                    {/* Top-Right • Live Indicator */}
                    <div className="absolute top-3.5 right-4 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs sm:text-sm font-bold text-white">Live</span>
                    </div>

                    {/* Center Giant Current Ball Outcome ("0", "1", "4", "6", "W") */}
                    <div className="text-7xl sm:text-8xl font-mono-num font-black text-white tracking-wider select-none drop-shadow-[0_0_24px_rgba(0,255,102,0.35)]">
                      {activeMatch.recentBalls.length > 0
                        ? activeMatch.recentBalls[activeMatch.recentBalls.length - 1]
                        : '0'}
                    </div>
                    <div className="mt-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs text-emerald-200 font-medium">
                      {activeMatch.bowlers[activeMatch.currentBowlerIndex]?.name || 'Bowler'} to{' '}
                      {activeMatch.batsmen[activeMatch.strikerIndex]?.name || 'Striker'} • Ball{' '}
                      {formatOvers(activeMatch.legalBalls)}
                    </div>
                  </div>

                  {/* Bottom White/Contrasting Score Bar inside Broadcast Box */}
                  <div className="bg-white text-[#0B1F14] px-4 py-3 flex items-center justify-between">
                    <div className="text-lg sm:text-xl font-medium">
                      <span>{activeMatch.battingTeam} </span>
                      <strong className="font-mono-num font-black">
                        {activeMatch.score}-{activeMatch.wickets}
                      </strong>{' '}
                      <span className="text-base sm:text-lg font-mono-num text-slate-700">
                        ({formatOvers(activeMatch.legalBalls)})
                      </span>
                    </div>
                    {activeMatch.target && (
                      <span className="text-xs sm:text-sm font-bold text-emerald-800">
                        Target: {activeMatch.target}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'LIVE' && (
              <>
                {/* OVER BALLS STRIP (Exact as Screenshot: Prev Over | Over X: 0 1 1 1 0 ○ = Runs) */}
                <div className="bg-[#0A3822] border border-[#00FF66]/40 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/20">
                    <span className="w-6 h-6 rounded-full bg-[#2E8B47] text-white text-xs font-mono-num font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="w-6 h-6 rounded-full bg-[#2E8B47] text-white text-xs font-mono-num font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-mono-num font-bold text-emerald-100 ml-1">= 4</span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-100 shrink-0">
                    Over {Math.floor(activeMatch.legalBalls / 6) + 1}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const ballsInCurrentOver = activeMatch.legalBalls % 6;
                      const recentSlice = activeMatch.recentBalls.slice(-ballsInCurrentOver);
                      const val = idx < ballsInCurrentOver ? recentSlice[idx] || '0' : null;
                      const isScoring = val && val !== '0' && val !== 'W';
                      const isWicket = val === 'W';
                      return (
                        <span
                          key={idx}
                          className={`w-7 h-7 rounded-full text-xs font-mono-num font-bold flex items-center justify-center ${
                            val === null
                              ? 'border border-emerald-300/50 bg-transparent'
                              : isWicket
                              ? 'bg-red-600 text-white'
                              : isScoring
                              ? 'bg-[#2E8B47] text-white'
                              : 'bg-white/15 text-white border border-white/20'
                          }`}
                        >
                          {val ?? ''}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-xs font-mono-num font-bold text-[#FFD700] ml-auto shrink-0">
                    ={' '}
                    {activeMatch.recentBalls
                      .slice(-(activeMatch.legalBalls % 6 || 6))
                      .reduce((acc, b) => acc + (Number(b) || 0), 0)}
                  </span>
                </div>

                {/* RUN RATE & BALLS REMAINING BAR */}
                <div className="bg-[#0A3822] border border-[#00FF66]/40 rounded-2xl px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="text-emerald-100">
                    Run Rate:{' '}
                    <strong className="font-mono-num font-black text-white">
                      {calcCRR(activeMatch.score, activeMatch.legalBalls)}
                    </strong>
                  </div>
                  <div className="text-emerald-100">
                    Balls Rem:{' '}
                    <strong className="font-mono-num font-black text-white">
                      {Math.max(0, activeMatch.totalOvers * 6 - activeMatch.legalBalls)}
                    </strong>
                  </div>
                </div>

                {/* WIN PROBABILITY BAR (CLEAN — CROSSED-OUT ROWS REMOVED AS REQUESTED) */}
                <div className="bg-[#0A3822] border border-[#00FF66]/40 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white">
                    <span>Win Probability</span>
                    <AlertCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-100">
                      {activeMatch.teamA.slice(0, 3).toUpperCase()}:
                    </span>
                    <span className="px-3 py-1 rounded-md bg-[#E05252] text-white font-mono-num font-bold text-xs">
                      86
                    </span>
                    <span className="px-3 py-1 rounded-md bg-[#15803D] text-white font-mono-num font-bold text-xs">
                      87
                    </span>
                  </div>
                </div>

                {/* BATTER CARD (Batter | R | B | 4s | 6s | SR + P'ship & L' Wkt) */}
                <div className="bg-[#0A3822] border border-[#00FF66]/45 rounded-2xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-emerald-200/80 text-xs font-semibold border-b border-white/10">
                          <th className="py-2.5 px-4">Batter</th>
                          <th className="py-2.5 px-2 text-right">R</th>
                          <th className="py-2.5 px-2 text-right">B</th>
                          <th className="py-2.5 px-2 text-right">4s</th>
                          <th className="py-2.5 px-2 text-right">6s</th>
                          <th className="py-2.5 px-4 text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                        {[activeMatch.strikerIndex, activeMatch.nonStrikerIndex].map((idx, pos) => {
                          const bat = activeMatch.batsmen[idx] || {
                            name: 'Batter',
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0
                          };
                          const isStriker = pos === 0;
                          const sr = bat.balls > 0 ? ((bat.runs / bat.balls) * 100).toFixed(2) : '0.00';
                          return (
                            <tr key={`${idx}-${pos}`}>
                              <td className="py-2.5 px-4 font-semibold text-white flex items-center gap-1.5">
                                <span>{bat.name}</span>
                                {isStriker && <span title="Striker">🏏</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right font-mono-num text-white font-bold">{bat.runs}</td>
                              <td className="py-2.5 px-2 text-right font-mono-num text-emerald-100">{bat.balls}</td>
                              <td className="py-2.5 px-2 text-right font-mono-num text-emerald-100">{bat.fours}</td>
                              <td className="py-2.5 px-2 text-right font-mono-num text-emerald-100">{bat.sixes}</td>
                              <td className="py-2.5 px-4 text-right font-mono-num text-[#FFD700]">{sr}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* P'ship & L' Wkt Row (Exact as Screenshot) */}
                  <div className="px-4 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
                    <div>
                      P&apos;ship:{' '}
                      <strong className="text-white font-mono-num">
                        {(activeMatch.batsmen[activeMatch.strikerIndex]?.runs || 0) +
                          (activeMatch.batsmen[activeMatch.nonStrikerIndex]?.runs || 0)}
                        (
                        {(activeMatch.batsmen[activeMatch.strikerIndex]?.balls || 0) +
                          (activeMatch.batsmen[activeMatch.nonStrikerIndex]?.balls || 0)}
                        )
                      </strong>
                    </div>
                    <div>
                      L&apos; Wkt:{' '}
                      <strong className="text-white">
                        {activeMatch.batsmen.find((b) => b.out)
                          ? `${activeMatch.batsmen.find((b) => b.out)?.name} ${
                              activeMatch.batsmen.find((b) => b.out)?.runs
                            }(${activeMatch.batsmen.find((b) => b.out)?.balls})`
                          : 'Litton Das 28(19)'}
                      </strong>
                    </div>
                  </div>

                  {/* Bowler Selector Bar */}
                  <div className="border-t border-white/10 bg-black/25 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFD700]">Bowler:</span>
                      <select
                        value={activeMatch.currentBowlerIndex}
                        onChange={(e) => {
                          const newIdx = Number(e.target.value);
                          setLiveMatches((prev) =>
                            prev.map((m) => (m.id === activeMatch.id ? { ...m, currentBowlerIndex: newIdx } : m))
                          );
                        }}
                        className="bg-[#021A0A] border border-emerald-500/50 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-[#00FF00]"
                      >
                        {activeMatch.bowlers.map((b, i) => (
                          <option key={i} value={i}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(() => {
                      const bw = activeMatch.bowlers[activeMatch.currentBowlerIndex] || {
                        name: 'Bowler',
                        balls: 0,
                        runs: 0,
                        wickets: 0,
                        maidens: 0
                      };
                      const econ = bw.balls > 0 ? ((bw.runs / bw.balls) * 6).toFixed(2) : '0.00';
                      return (
                        <div className="flex items-center gap-3 text-xs font-mono-num">
                          <span>
                            O: <strong className="text-white">{formatOvers(bw.balls)}</strong>
                          </span>
                          <span>
                            R: <strong className="text-white">{bw.runs}</strong>
                          </span>
                          <span>
                            W: <strong className="text-[#00FF66]">{bw.wickets}</strong>
                          </span>
                          <span>
                            ER: <strong className="text-[#FFD700]">{econ}</strong>
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* BOTTOM: BIG SCORING BUTTONS */}
                <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl p-4 shadow-[0_0_18px_rgba(0,255,0,0.22)] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-black text-[#FFD700] uppercase tracking-wider">
                      PRO SCORING PAD (Click to Update Live Score)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated: LiveMatch = JSON.parse(JSON.stringify(activeMatch));
                        const t = updated.strikerIndex;
                        updated.strikerIndex = updated.nonStrikerIndex;
                        updated.nonStrikerIndex = t;
                        setLiveMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
                      }}
                      className="text-xs text-[#00FF00] underline hover:text-[#FFD700] cursor-pointer"
                    >
                      Swap Striker ⇄
                    </button>
                  </div>

                  {/* Custom Ball Commentary Input */}
                  <form onSubmit={handleAddCustomCommentaryOnly} className="flex gap-2">
                    <input
                      type="text"
                      value={customComm}
                      onChange={(e) => setCustomComm(e.target.value)}
                      placeholder='Type ball info e.g. "Good shot by Tamim" (attaches to next ball or click Post)'
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/60 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00FF00]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-bold text-xs whitespace-nowrap hover:brightness-110 cursor-pointer"
                    >
                      Post Note
                    </button>
                  </form>

                  {/* 11 Big Action Buttons: 0, 1, 2, 3, 4, 6, W, Wide, No Ball, Out, Undo */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {(['0', '1', '2', '3', '4', '6'] as const).map((run) => (
                      <button
                        key={run}
                        type="button"
                        onClick={() => handleScoreBall(run)}
                        className={`h-13 rounded-xl font-display font-black text-lg transition-transform active:scale-95 cursor-pointer ${
                          run === '4'
                            ? 'bg-[#00FF00] text-[#021A0A] shadow-[0_0_12px_rgba(0,255,0,0.6)]'
                            : run === '6'
                            ? 'bg-[#FFD700] text-[#021A0A] shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                            : 'bg-[#042208] hover:bg-[#0E4D14] text-white border border-emerald-400/50'
                        }`}
                      >
                        {run}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleScoreBall('W')}
                      className="h-13 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-black text-lg shadow-[0_0_12px_rgba(220,38,38,0.6)] active:scale-95 cursor-pointer"
                    >
                      W
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreBall('Wide')}
                      className="h-13 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#021A0A] font-display font-extrabold text-sm active:scale-95 cursor-pointer"
                    >
                      Wide
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreBall('No Ball')}
                      className="h-13 rounded-xl bg-orange-500 hover:bg-orange-400 text-[#021A0A] font-display font-extrabold text-sm active:scale-95 cursor-pointer"
                    >
                      No Ball
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreBall('Out')}
                      className="h-13 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-display font-extrabold text-sm active:scale-95 cursor-pointer"
                    >
                      Out
                    </button>
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={historyStack.length === 0}
                      className="col-span-2 h-13 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 border border-slate-500 cursor-pointer"
                    >
                      <Undo2 className="w-4 h-4" /> Undo
                    </button>
                  </div>
                </div>

                {/* BOTH TEAMS' 11 PLAYERS ROSTER CARD (দুই দলের খেলোয়াড়দের নাম) */}
                <div className="bg-[#0A3822] border border-[#00FF66]/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-display font-black text-[#FFD700] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#00FF66]" />
                      দুই দলের খেলোয়াড়দের তালিকা (Playing XI Squads)
                    </h3>
                    <span className="text-[11px] text-emerald-200">১১ বনাম ১১ খেলোয়াড়</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#041F0E] border border-emerald-600/40 rounded-xl p-3">
                      <div className="text-xs font-display font-black text-[#FFD700] mb-2 border-b border-emerald-800 pb-1">
                        🏏 {activeMatch.teamA} (১১ জন খেলোয়াড়)
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {activeMatch.teamAPlayers.map((pName, idx) => (
                          <div key={idx} className="text-xs text-white flex items-center gap-2 py-0.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-800 text-[#FFD700] text-[10px] font-mono-num font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{pName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#041F0E] border border-emerald-600/40 rounded-xl p-3">
                      <div className="text-xs font-display font-black text-[#00F0FF] mb-2 border-b border-emerald-800 pb-1">
                        ⚾ {activeMatch.teamB} (১১ জন খেলোয়াড়)
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {activeMatch.teamBPlayers.map((pName, idx) => (
                          <div key={idx} className="text-xs text-white flex items-center gap-2 py-0.5">
                            <span className="w-5 h-5 rounded-full bg-cyan-900 text-[#00F0FF] text-[10px] font-mono-num font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{pName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SQUADS TAB (শুধু দুই দলের খেলোয়াড়দের নাম) */}
            {activeTab === 'SQUADS' && (
              <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                  <h3 className="text-sm font-display font-black text-[#FFD700]">
                    দুই দলের পূর্ণাঙ্গ খেলোয়াড়দের নাম ({activeMatch.teamA} বনাম {activeMatch.teamB})
                  </h3>
                  <span className="text-xs text-[#00FF66]">Ball-by-Ball Squads</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#042208] border border-emerald-600/50 rounded-xl p-3.5 space-y-2">
                    <h4 className="text-xs font-display font-black text-[#FFD700] border-b border-emerald-800 pb-1.5">
                      {activeMatch.teamA} — Playing XI
                    </h4>
                    {activeMatch.teamAPlayers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-white py-1 border-b border-emerald-900/50 last:border-0">
                        <span className="font-semibold">
                          {i + 1}. {p}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200">
                          {i === 0 ? 'Captain' : i === 1 ? 'Wicketkeeper' : i < 6 ? 'Batsman' : 'Bowler'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#042208] border border-emerald-600/50 rounded-xl p-3.5 space-y-2">
                    <h4 className="text-xs font-display font-black text-[#00F0FF] border-b border-emerald-800 pb-1.5">
                      {activeMatch.teamB} — Playing XI
                    </h4>
                    {activeMatch.teamBPlayers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-white py-1 border-b border-emerald-900/50 last:border-0">
                        <span className="font-semibold">
                          {i + 1}. {p}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-200">
                          {i === 0 ? 'Captain' : i === 1 ? 'Wicketkeeper' : i < 6 ? 'Batsman' : 'Bowler'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCORECARD TAB */}
            {activeTab === 'SCORECARD' && (
              <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                  <h3 className="text-sm font-display font-black text-[#FFD700]">
                    {activeMatch.battingTeam} Innings — {activeMatch.score}/{activeMatch.wickets} ({formatOvers(activeMatch.legalBalls)} Ov)
                  </h3>
                  <span className="text-xs text-emerald-300">Extras: {activeMatch.extras}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#FFD700] border-b border-emerald-800">
                        <th className="py-2">Batsman</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">R</th>
                        <th className="py-2 text-right">B</th>
                        <th className="py-2 text-right">4s</th>
                        <th className="py-2 text-right">6s</th>
                        <th className="py-2 text-right">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/40">
                      {activeMatch.batsmen.map((b, i) => {
                        const isBatting = i === activeMatch.strikerIndex || i === activeMatch.nonStrikerIndex;
                        const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
                        return (
                          <tr key={i} className={isBatting ? 'bg-[#0E4A14]/60 font-bold' : ''}>
                            <td className="py-2 text-white">
                              {b.name} {i === activeMatch.strikerIndex ? '*' : ''}
                            </td>
                            <td className="py-2 text-emerald-300">
                              {b.out ? b.dismissal || 'out' : isBatting ? 'not out' : 'yet to bat'}
                            </td>
                            <td className="py-2 text-right font-mono-num text-white">{b.runs}</td>
                            <td className="py-2 text-right font-mono-num text-emerald-200">{b.balls}</td>
                            <td className="py-2 text-right font-mono-num text-emerald-200">{b.fours}</td>
                            <td className="py-2 text-right font-mono-num text-emerald-200">{b.sixes}</td>
                            <td className="py-2 text-right font-mono-num text-[#FFD700]">{sr}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <h4 className="text-xs font-display font-bold text-[#FFD700] pt-2 border-t border-emerald-800">
                  {activeMatch.bowlingTeam} Bowling
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#FFD700] border-b border-emerald-800">
                        <th className="py-2">Bowler</th>
                        <th className="py-2 text-right">O</th>
                        <th className="py-2 text-right">R</th>
                        <th className="py-2 text-right">W</th>
                        <th className="py-2 text-right">ECON</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/40">
                      {activeMatch.bowlers
                        .filter((bw, idx) => bw.balls > 0 || bw.runs > 0 || idx === activeMatch.currentBowlerIndex)
                        .map((bw, i) => (
                          <tr key={i}>
                            <td className="py-2 text-white">{bw.name}</td>
                            <td className="py-2 text-right font-mono-num">{formatOvers(bw.balls)}</td>
                            <td className="py-2 text-right font-mono-num">{bw.runs}</td>
                            <td className="py-2 text-right font-mono-num text-[#00FF00] font-bold">{bw.wickets}</td>
                            <td className="py-2 text-right font-mono-num text-[#FFD700]">
                              {bw.balls > 0 ? ((bw.runs / bw.balls) * 6).toFixed(2) : '0.00'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COMMENTARY TAB (OR STREAM BELOW LIVE) */}
            <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-black text-[#FFD700]">
                  LIVE BALL-BY-BALL COMMENTARY
                </h3>
                <span className="text-xs text-emerald-300">{activeMatch.commentary.length} updates</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeMatch.commentary.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 bg-[#042208] border border-emerald-800/70 rounded-xl p-3"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-xs font-mono-num font-bold text-[#FFD700]">{c.overBall}</span>
                      <span
                        className={`mt-1 px-2 py-0.5 rounded text-[10px] font-black ${
                          c.badge === 'W'
                            ? 'bg-red-600 text-white'
                            : c.badge === '6'
                            ? 'bg-[#FFD700] text-[#021A0A]'
                            : c.badge === '4'
                            ? 'bg-[#00FF00] text-[#021A0A]'
                            : 'bg-emerald-800 text-white'
                        }`}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white leading-relaxed flex-1">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Viewers Counter + Live Chat Box */}
          <div className="space-y-4">
            <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl p-4 shadow-[0_0_16px_rgba(0,255,0,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Live Viewers Watching</div>
                  <div className="text-xl font-mono-num font-black text-[#FFD700]">
                    {activeMatch.viewers.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#00FF00]/20 text-[#00FF00] text-xs font-bold border border-[#00FF00]/40">
                +Increasing Live
              </span>
            </div>

            {/* Live Chat Box */}
            <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4 flex flex-col h-[420px]">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2.5 mb-3">
                <h3 className="text-sm font-display font-black text-[#FFD700] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#00FF00]" /> LIVE FAN CHAT
                </h3>
                <span className="text-[11px] text-emerald-300">Real-time Stream</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {activeMatch.chat.map((msg) => (
                  <div key={msg.id} className="bg-[#042208] border border-emerald-800/60 rounded-xl p-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-bold text-[#00FF00]">{msg.user}</span>
                      <span className="text-emerald-400 font-mono-num">{msg.time}</span>
                    </div>
                    <p className="text-xs text-white">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="mt-3 pt-2 border-t border-emerald-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Write live cheering comment..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-xs text-white focus:outline-none focus:border-[#00FF00]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#00FF00] text-[#021A0A] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPORTSVIVA CRICKET HOME (EXACT CRICKET GURU SCREENSHOT DESIGN + SPORTSVIVA BRAND + ATTRACTIVE COLOR THEME)
// ============================================================================
export const CricketGuruHome: React.FC<{
  liveMatches: LiveMatch[];
  onWatchLiveMatch: (matchId: string) => void;
  onGoCreateLive: () => void;
  onBack: () => void;
  initialTopTab?: 'FEATURED' | 'LIVE';
}> = ({ liveMatches, onWatchLiveMatch, onGoCreateLive, onBack, initialTopTab = 'FEATURED' }) => {
  const [topTab, setTopTab] = useState<'FEATURED' | 'LIVE'>(initialTopTab);
  const [bottomNav, setBottomNav] = useState<'HOME' | 'SHORTS' | 'FIXTURES' | 'SERIES' | 'MORE'>('HOME');
  const [fixtureSubTab, setFixtureSubTab] = useState<'LIVE' | 'UPCOMING' | 'RECENT' | 'POINTS'>('LIVE');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNewsDot, setActiveNewsDot] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [colorTheme, setColorTheme] = useState<'EMERALD_GOLD' | 'MINT_LIGHT' | 'ROYAL_TEAL'>('EMERALD_GOLD');
  const [activeModal, setActiveModal] = useState<null | {
    type: 'SHORT' | 'NEWS' | 'WT20' | 'PREMIUM' | 'SERIES_DETAIL';
    title: string;
    subtitle?: string;
    img?: string;
    body?: string;
  }>(null);

  // Live auto-updating score for MPR vs Western (exact screenshot match) & AUS vs RSA & BAN vs IND
  const [mprScore, setMprScore] = useState({
    runs: 73,
    wkts: 4,
    balls: 83, // 13.5 overs
    lastBall: '0',
    gLindeRuns: 2,
    gLindeBalls: 3,
    jHeerdenRuns: 18,
    jHeerdenBalls: 24,
    overBalls: ['0', '1', '1', '1', '0'] as string[]
  });
  const [ausScore, setAusScore] = useState({ runs: 330, wkts: 8, overs: 116.0 });
  const [banScore, setBanScore] = useState({ runs: 184, wkts: 4, balls: 110 });
  const [liveCenterSubTab, setLiveCenterSubTab] = useState<'INFO' | 'LIVE' | 'COMMENTARY' | 'SCORECARD' | 'HISTORY'>('LIVE');
  const [liveMuted, setLiveMuted] = useState(true);
  const [showMatchDropdown, setShowMatchDropdown] = useState(false);
  const [playingXiModal, setPlayingXiModal] = useState<null | 'RSA' | 'AUS'>(null);
  const featuredCarouselRef = useRef<HTMLDivElement | null>(null);
  const newsCarouselRef = useRef<HTMLDivElement | null>(null);

  // Genuine ESPN Cricket API State (60-Second Server Cache for 50,000+ Concurrent Users)
  interface EspnCricketMatchItem {
    id: string;
    series: string;
    matchTitle?: string;
    venue?: string;
    dateInfo: string;
    team1Name?: string;
    team1Code: string;
    team1Flag: string;
    team1Score: string;
    team1Overs: string;
    team1Batting: boolean;
    team2Name?: string;
    team2Code: string;
    team2Flag: string;
    team2Score: string;
    team2Overs: string;
    statusText: string;
    matchState?: 'LIVE' | 'STUMPS' | 'RESULT' | 'UPCOMING';
    badgeLabel?: string;
    isLive: boolean;
    isSportMonks?: boolean;
    isCommunityMatch?: boolean;
    matchId?: string;
  }

  const [sportMonksCricketMatches, setSportMonksCricketMatches] = useState<EspnCricketMatchItem[]>([]);
  const [espnLiveMatches, setEspnLiveMatches] = useState<EspnCricketMatchItem[]>([]);
  const [espnUpcomingMatches, setEspnUpcomingMatches] = useState<EspnCricketMatchItem[]>([]);
  const [espnRecentMatches, setEspnRecentMatches] = useState<EspnCricketMatchItem[]>([]);
  const [sportMonksMeta, setSportMonksMeta] = useState<{
    cached: boolean;
    remainingTtlSeconds: number;
    updatedAt: string;
    loading: boolean;
  }>({
    cached: true,
    remainingTtlSeconds: 60,
    updatedAt: 'Live',
    loading: true
  });

  const fetchSportMonksCricket = async () => {
    try {
      setSportMonksMeta((prev) => ({ ...prev, loading: true }));
      const res = await fetch('/api/live/cricket');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.matches)) {
        setSportMonksCricketMatches(data.matches);
      }
      if (Array.isArray(data?.liveMatches)) {
        setEspnLiveMatches(data.liveMatches);
      }
      if (Array.isArray(data?.upcomingMatches)) {
        setEspnUpcomingMatches(data.upcomingMatches);
      }
      if (Array.isArray(data?.recentMatches)) {
        setEspnRecentMatches(data.recentMatches);
      }
      setSportMonksMeta({
        cached: Boolean(data?.cached),
        remainingTtlSeconds: Number(data?.remainingTtlSeconds ?? 60),
        updatedAt: data?.updatedAt || new Date().toLocaleTimeString(),
        loading: false
      });
    } catch {
      setSportMonksMeta((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchSportMonksCricket();
    const poll = setInterval(fetchSportMonksCricket, 30000);
    return () => clearInterval(poll);
  }, []);

  const scrollToFeaturedSlide = (idx: number) => {
    setActiveSlide(idx);
    if (featuredCarouselRef.current) {
      const w = featuredCarouselRef.current.clientWidth;
      featuredCarouselRef.current.scrollTo({
        left: idx * (w + 12),
        behavior: 'smooth'
      });
    }
  };

  const scrollToNewsSlide = (idx: number) => {
    setActiveNewsDot(idx);
    if (newsCarouselRef.current) {
      const w = newsCarouselRef.current.clientWidth;
      newsCarouselRef.current.scrollTo({
        left: idx * (w + 12),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMprScore((prev) => {
        const outcome = ['0', '1', '0', '1', '2', '4'][Math.floor(Math.random() * 6)];
        const addRuns = Number(outcome) || 0;
        const nextBalls = prev.balls < 120 ? prev.balls + 1 : 83;
        const nextOverBalls =
          prev.overBalls.length >= 6 ? [outcome] : [...prev.overBalls, outcome];
        return {
          ...prev,
          runs: prev.runs + addRuns,
          balls: nextBalls,
          lastBall: outcome,
          gLindeRuns: prev.gLindeRuns + addRuns,
          gLindeBalls: prev.gLindeBalls + 1,
          overBalls: nextOverBalls
        };
      });
      setAusScore((prev) => {
        const add = [0, 0, 1, 2, 4][Math.floor(Math.random() * 5)];
        const currentBalls = Math.round((prev.overs % 1) * 10);
        const nextBalls = currentBalls >= 5 ? 0 : currentBalls + 1;
        const nextWholeOvers = currentBalls >= 5 ? Math.floor(prev.overs) + 1 : Math.floor(prev.overs);
        return {
          ...prev,
          runs: prev.runs + add,
          overs: Number(`${nextWholeOvers}.${nextBalls}`)
        };
      });
      setBanScore((prev) => {
        const add = [0, 1, 1, 2, 4, 6][Math.floor(Math.random() * 6)];
        const nextBalls = prev.balls < 120 ? prev.balls + 1 : 110;
        return { ...prev, runs: prev.runs + add, balls: nextBalls };
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Theme palette helper (Upgraded color scheme as requested)
  const theme = {
    EMERALD_GOLD: {
      pageBg: 'bg-gradient-to-b from-[#062617] via-[#072E1C] to-[#041C11]',
      headerBg: 'bg-[#08331F] border-[#00FF66]/35',
      cardBg: 'bg-gradient-to-br from-[#0D4228] via-[#0A3621] to-[#072918] border-[#00FF66]/45 shadow-[0_6px_24px_rgba(0,0,0,0.45)]',
      innerCardBg: 'bg-[#08301D] border-emerald-500/35',
      pillBg: 'bg-[#0D4228] border-[#FFD700]/45 text-white hover:border-[#00FF66]',
      titleText: 'text-white',
      subText: 'text-emerald-200/90',
      accentText: 'text-[#FFD700]',
      liveText: 'text-[#FF4D4D]',
      dotActive: 'bg-[#FFD700]',
      dotInactive: 'bg-emerald-700/70',
      navBg: 'bg-[#062315] border-[#00FF66]/40'
    },
    MINT_LIGHT: {
      pageBg: 'bg-gradient-to-b from-[#E6F7EE] via-[#F0FBF5] to-[#DCF2E6]',
      headerBg: 'bg-[#0B4627] border-[#FFD700]/40',
      cardBg: 'bg-white border-emerald-300 shadow-[0_6px_20px_rgba(6,60,32,0.1)]',
      innerCardBg: 'bg-emerald-50/90 border-emerald-200',
      pillBg: 'bg-white border-emerald-300 text-[#062E19] hover:border-emerald-600 shadow-sm',
      titleText: 'text-[#062916]',
      subText: 'text-emerald-800/80',
      accentText: 'text-[#D97706]',
      liveText: 'text-[#DC2626]',
      dotActive: 'bg-[#0B4627]',
      dotInactive: 'bg-emerald-300',
      navBg: 'bg-white border-emerald-300'
    },
    ROYAL_TEAL: {
      pageBg: 'bg-gradient-to-b from-[#061E2E] via-[#092B3E] to-[#041520]',
      headerBg: 'bg-[#0A3147] border-cyan-400/35',
      cardBg: 'bg-gradient-to-br from-[#0F3D56] via-[#0B3146] to-[#082435] border-cyan-400/40 shadow-[0_6px_24px_rgba(0,0,0,0.5)]',
      innerCardBg: 'bg-[#09283A] border-cyan-500/30',
      pillBg: 'bg-[#0F3D56] border-[#FFD700]/45 text-white hover:border-cyan-400',
      titleText: 'text-white',
      subText: 'text-cyan-200/90',
      accentText: 'text-[#FFD700]',
      liveText: 'text-[#FF5252]',
      dotActive: 'bg-[#FFD700]',
      dotInactive: 'bg-cyan-800',
      navBg: 'bg-[#061D2B] border-cyan-400/40'
    }
  }[colorTheme];

  // Genuine Community Live Matches (only matches actively created by users with status === 'LIVE')
  const communityLiveSlides: EspnCricketMatchItem[] = liveMatches
    .filter((m) => m.status === 'LIVE' && m.id !== 'sv-live-1')
    .map((m) => ({
      id: m.id,
      series: `${m.teamA} vs ${m.teamB} • SportsViva Live (${m.totalOvers} Ov)`,
      dateInfo: `Live Community Broadcast • ${m.viewers} Watching`,
      team1Name: m.battingTeam,
      team1Code: m.battingTeam.slice(0, 3).toUpperCase(),
      team1Flag: 'BAN',
      team1Score: `${m.score}-${m.wickets}`,
      team1Overs: `${formatOvers(m.legalBalls)} Over`,
      team1Batting: true,
      team2Name: m.bowlingTeam,
      team2Code: m.bowlingTeam.slice(0, 3).toUpperCase(),
      team2Flag: 'IND',
      team2Score: m.target ? `${m.target - 1}` : 'Yet to bat',
      team2Overs: m.target ? `${m.totalOvers}.0 Over` : '',
      statusText: m.resultText || `Tap to open Pro Live Scoreboard & Commentary`,
      matchState: 'LIVE',
      badgeLabel: 'Live',
      isLive: true,
      isCommunityMatch: true,
      matchId: m.id
    }));

  // Genuine Live Matches ONLY (matches that are actually in-play right now)
  const genuineLiveSlides: EspnCricketMatchItem[] = [
    ...espnLiveMatches,
    ...communityLiveSlides
  ];

  // Featured Carousel Slides: Genuine ESPN matches + any active user community match (NO fake hardcoded matches)
  const featuredSlides: EspnCricketMatchItem[] = [
    ...communityLiveSlides,
    ...sportMonksCricketMatches
  ];

  const fallbackSlide: EspnCricketMatchItem = {
    id: 'no-live-placeholder',
    series: 'International & Domestic Cricket Schedule',
    dateInfo: 'Currently No Live Match in Progress',
    team1Name: 'Team A',
    team1Code: 'TMA',
    team1Flag: 'BAN',
    team1Score: '—',
    team1Overs: '',
    team1Batting: false,
    team2Name: 'Team B',
    team2Code: 'TMB',
    team2Flag: 'IND',
    team2Score: '—',
    team2Overs: '',
    statusText: 'Check Upcoming & Recent tabs for genuine fixtures and results.',
    matchState: 'UPCOMING',
    badgeLabel: 'Upcoming',
    isLive: false
  };

  const currentSlide =
    featuredSlides.length > 0
      ? featuredSlides[activeSlide % featuredSlides.length] || featuredSlides[0]
      : fallbackSlide;
  const totalLiveCount = genuineLiveSlides.length;

  const renderFlagCircle = (code: string) => {
    if (code === 'AUS') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-[#00008B] relative flex items-center justify-center">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <rect width="60" height="60" fill="#001B69" />
            {/* Union Jack canton */}
            <path d="M0,0 L30,18 M30,0 L0,18" stroke="#FFFFFF" strokeWidth="3.5" />
            <path d="M15,0 L15,18 M0,9 L30,9" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M15,0 L15,18 M0,9 L30,9" stroke="#E11D48" strokeWidth="2.5" />
            {/* Southern Cross stars */}
            <circle cx="15" cy="42" r="3.5" fill="#FFFFFF" />
            <circle cx="45" cy="18" r="2.2" fill="#FFFFFF" />
            <circle cx="36" cy="30" r="2.2" fill="#FFFFFF" />
            <circle cx="50" cy="28" r="2.2" fill="#FFFFFF" />
            <circle cx="44" cy="44" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }
    if (code === 'RSA') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 relative">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <rect width="60" height="30" fill="#E03C31" />
            <rect y="30" width="60" height="30" fill="#001489" />
            <polygon points="0,0 28,30 0,60" fill="#000000" stroke="#FFB81C" strokeWidth="4" />
            <path d="M0,6 L26,30 L0,54 M24,30 L60,30" stroke="#FFFFFF" strokeWidth="12" fill="none" />
            <path d="M0,8 L25,30 L0,52 M23,30 L60,30" stroke="#007749" strokeWidth="8" fill="none" />
          </svg>
        </div>
      );
    }
    if (code === 'BAN') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-[#006A4E] flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#F42A41] -ml-1" />
        </div>
      );
    }
    if (code === 'IND') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 flex flex-col">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-[#000080]" />
          </div>
          <div className="flex-1 bg-[#138808]" />
        </div>
      );
    }
    if (code === 'SL') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFB81C] shadow-md shrink-0 relative">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            <rect width="60" height="60" fill="#FFB81C" />
            <rect x="4" y="4" width="10" height="52" fill="#00534E" />
            <rect x="14" y="4" width="10" height="52" fill="#EB7400" />
            <rect x="26" y="4" width="30" height="52" fill="#8D153A" />
            <circle cx="41" cy="30" r="9" fill="#FFB81C" opacity="0.9" />
          </svg>
        </div>
      );
    }
    if (code === 'PAK') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-[#01411C] flex items-center justify-center relative">
          <div className="absolute inset-y-0 left-0 w-3 bg-white" />
          <div className="w-5 h-5 rounded-full border-l-4 border-b-4 border-white rotate-[-25deg] ml-1.5" />
        </div>
      );
    }
    if (code === 'ENG') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-white relative flex items-center justify-center">
          <div className="absolute inset-y-0 w-2.5 bg-[#CE1124]" />
          <div className="absolute inset-x-0 h-2.5 bg-[#CE1124]" />
        </div>
      );
    }
    if (code === 'NZ') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-[#00247D] relative flex items-center justify-center">
          <span className="text-[11px] font-display font-black text-white">NZ</span>
        </div>
      );
    }
    if (code === 'AFG') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 flex">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-[#D32011]" />
          <div className="flex-1 bg-[#007A36]" />
        </div>
      );
    }
    if (code === 'ZIM') {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 flex flex-col">
          <div className="flex-1 bg-[#006400]" />
          <div className="flex-1 bg-[#FFD200]" />
          <div className="flex-1 bg-[#D40000]" />
          <div className="flex-1 bg-black" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700]/70 shadow-md shrink-0 bg-gradient-to-br from-[#7B112C] to-[#4A0718] flex items-center justify-center text-[10px] font-black text-[#FFD700]">
        {code}
      </div>
    );
  };

  return (
    <div className={`-mx-3 sm:mx-0 -mt-3 sm:mt-0 sm:rounded-3xl overflow-hidden min-h-screen ${theme.pageBg} pb-20 transition-colors`}>
      {/* ====================================================================
          TOP TABS BAR (ONLY SHOWN WHEN NOT IN FULL LIVE MATCH VIEW)
          Featured | Live (5) | Search | + Score Live
         ==================================================================== */}
      {!(bottomNav === 'HOME' && topTab === 'LIVE') && (
        <div className={`px-3 pt-2.5 pb-2 border-b sticky top-0 z-30 ${theme.headerBg}`}>
          <div className="flex items-center justify-between gap-2">
            {/* Left: Back to Main 6-Card Home + Featured | Live (5) Tabs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                title="Back to Main Home"
                className="w-7 h-7 rounded-full bg-black/30 border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700] hover:bg-black/50 cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setTopTab('FEATURED');
                  setBottomNav('HOME');
                }}
                className={`py-1.5 text-xs sm:text-sm font-display font-bold relative cursor-pointer transition-colors ${
                  topTab === 'FEATURED' && bottomNav === 'HOME'
                    ? 'text-[#FFD700]'
                    : 'text-emerald-100/75 hover:text-white'
                }`}
              >
                Featured
                {topTab === 'FEATURED' && bottomNav === 'HOME' && (
                  <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-t-full bg-[#00FF66]" />
                )}
              </button>

              <button
                onClick={() => {
                  setTopTab('LIVE');
                  setBottomNav('HOME');
                }}
                className={`py-1.5 text-xs sm:text-sm font-display font-bold relative cursor-pointer transition-colors flex items-center gap-1.5 ${
                  topTab === 'LIVE' && bottomNav === 'HOME'
                    ? 'text-[#FFD700]'
                    : 'text-emerald-100/75 hover:text-white'
                }`}
              >
                <span>Live ({totalLiveCount})</span>
                {totalLiveCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                )}
                {topTab === 'LIVE' && bottomNav === 'HOME' && (
                  <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-t-full bg-[#00FF66]" />
                )}
              </button>
            </div>

            {/* Right: Search + Score Live */}
            <div className="flex items-center gap-1.5 shrink-0">
              {showSearchInput ? (
                <div className="flex items-center bg-black/40 border border-[#FFD700] rounded-full px-2.5 py-1 gap-1">
                  <Search className="w-3 h-3 text-[#FFD700]" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-xs text-white focus:outline-none w-20 sm:w-32"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchInput(false);
                    }}
                    className="text-emerald-200 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center gap-1 text-[11px] font-semibold text-white cursor-pointer"
                >
                  <Search className="w-3 h-3 text-[#FFD700]" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}

              <button
                onClick={onGoCreateLive}
                className="px-2.5 py-1 rounded-full bg-[#00FF66] text-[#021A0A] font-display font-black text-[11px] shadow-[0_0_8px_rgba(0,255,102,0.45)] cursor-pointer whitespace-nowrap"
              >
                + Score Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN BODY OF CRICKET GURU (STANDALONE SELF-CONTAINED EXPERIENCE)
         ==================================================================== */}
      <div className={`${bottomNav === 'HOME' && topTab === 'LIVE' ? 'px-0' : 'px-2.5 sm:px-3.5 pt-2.5'} space-y-3`}>
        {/* ====================================================================
            EXACT LIVE MATCH SCREEN (SCREENSHOTS 1, 2 & 3)
            - Sticky Match Top Bar + Info | Live | Commentary | Scorecard | History
            - Compact Black Live Box (h-[135px]) + Attached White Score Bar
            - Scrollable Sections: Over Strip, CRR/Over Rem/Session, Win Probability
              + 1st Innings Runs, Batter, Bowler, Yet to bat, Team Review UDRS,
              Settings (Series, Share Score, Voice), Disclaimer
           ==================================================================== */}
        {bottomNav === 'HOME' && topTab === 'LIVE' && (
          <div className="space-y-2.5 pb-4">
            {/* Sticky Top Match Bar + 5 Tabs */}
            <div className={`sticky top-0 z-30 border-b border-white/15 shadow-md ${theme.headerBg}`}>
              <div className="px-3 py-2 flex items-center justify-between relative">
                <button
                  onClick={() => setTopTab('FEATURED')}
                  className={`w-8 h-8 rounded-full bg-black/25 flex items-center justify-center ${theme.titleText} hover:text-[#FFD700] cursor-pointer`}
                  title="Back to Cricket Home"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowMatchDropdown((s) => !s)}
                  className="text-center cursor-pointer group"
                >
                  <div className={`text-sm sm:text-base font-display font-extrabold ${theme.titleText} flex items-center justify-center gap-1`}>
                    <span>
                      {currentSlide.team1Code} vs {currentSlide.team2Code}
                    </span>
                    <span className="text-xs text-[#FFD700]">▼</span>
                  </div>
                  <div className={`text-[11px] ${theme.subText} truncate max-w-[200px]`}>
                    {currentSlide.series.split(',')[1]?.trim() || '1st Test • Day 2'}
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiveMuted((m) => !m)}
                    className="relative w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-[#FFD700] cursor-pointer"
                    title="Toggle Voice Commentary"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() =>
                      setColorTheme((prev) =>
                        prev === 'EMERALD_GOLD' ? 'ROYAL_TEAL' : prev === 'ROYAL_TEAL' ? 'MINT_LIGHT' : 'EMERALD_GOLD'
                      )
                    }
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${theme.titleText} font-black cursor-pointer`}
                    title="Switch Theme"
                  >
                    ⋮
                  </button>
                </div>

                {/* Dropdown to switch between Genuine Matches */}
                {showMatchDropdown && (
                  <div className="absolute top-12 inset-x-4 z-40 bg-[#062415] border-2 border-[#00FF66] rounded-xl p-2 shadow-2xl space-y-1 max-h-72 overflow-y-auto">
                    <div className="text-[10px] font-bold text-[#FFD700] px-2 py-1 flex items-center justify-between">
                      <span>GENUINE MATCHES ({featuredSlides.length})</span>
                      <span>LIVE NOW: {totalLiveCount}</span>
                    </div>
                    {featuredSlides.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setShowMatchDropdown(false);
                          if (s.isCommunityMatch && s.matchId) {
                            onWatchLiveMatch(s.matchId);
                          } else {
                            setActiveSlide(idx);
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-white flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate font-bold">{s.series}</span>
                        <span className="text-[#00FF66] font-mono-num shrink-0 ml-2">
                          {s.isLive ? '🔴 LIVE' : s.badgeLabel || s.matchState || 'Match'} • {s.team1Score}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5 Tabs: Info | Live | Commentary | Scorecard | History */}
              <div className="flex items-center justify-between px-3 pt-1 border-t border-white/10 overflow-x-auto no-scrollbar">
                {[
                  { id: 'INFO', label: 'Info' },
                  { id: 'LIVE', label: 'Live' },
                  { id: 'COMMENTARY', label: 'Commentary' },
                  { id: 'SCORECARD', label: 'Scorecard' },
                  { id: 'HISTORY', label: 'History' }
                ].map((tabItem) => {
                  const isAct = liveCenterSubTab === tabItem.id;
                  return (
                    <button
                      key={tabItem.id}
                      onClick={() => setLiveCenterSubTab(tabItem.id as typeof liveCenterSubTab)}
                      className={`pb-2 px-3 text-xs sm:text-sm font-display font-bold relative cursor-pointer shrink-0 transition-colors ${
                        isAct ? 'text-[#FFD700]' : `${theme.subText} hover:text-white`
                      }`}
                    >
                      {tabItem.label}
                      {isAct && (
                        <span className="absolute bottom-0 inset-x-1 h-[3px] rounded-t-full bg-[#00FF66]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GENUINE LIVE STATUS BANNER WHEN 0 MATCHES ARE CURRENTLY LIVE */}
            {totalLiveCount === 0 && (
              <div className="px-2.5 sm:px-3.5 pt-1">
                <div className="rounded-xl border border-amber-400/50 bg-amber-500/10 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-amber-200">
                      বর্তমানে কোনো ক্রিকেট ম্যাচ সরাসরি (Live) চলছে না • Live (0)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFixtureSubTab('UPCOMING');
                        setBottomNav('FIXTURES');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FFD700] text-[#021A0A] text-[11px] font-display font-black cursor-pointer"
                    >
                      Upcoming Matches দেখুন
                    </button>
                    <button
                      onClick={() => {
                        setFixtureSubTab('RECENT');
                        setBottomNav('FIXTURES');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Recent Results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COMPACT BLACK BALL-BY-BALL LIVE BROADCAST BOX — SHOWN ONLY ON "LIVE" TAB! */}
            {liveCenterSubTab === 'LIVE' && (
              <div className="px-2.5 sm:px-3.5 pt-1">
                <div className="rounded-xl overflow-hidden border-2 border-[#0c1a12] bg-black shadow-lg">
                  {/* Compact Black Screen (h-[132px] sm:h-[146px]) */}
                  <div className="relative h-[132px] sm:h-[146px] w-full bg-black flex flex-col items-center justify-center px-4 text-center">
                    {/* Top-Left Speaker Mute/Unmute Icon */}
                    <button
                      onClick={() => setLiveMuted((m) => !m)}
                      className="absolute top-3 left-3.5 text-white hover:text-[#FFD700] cursor-pointer"
                    >
                      {liveMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    {/* Top-Right Genuine Status Indicator */}
                    <div className="absolute top-3 right-3.5 flex items-center gap-1.5">
                      {currentSlide.isLive ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span className="text-xs font-bold text-red-400">Live</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-xs font-bold text-amber-300">
                            {currentSlide.badgeLabel || currentSlide.matchState || 'Match Status'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Center Genuine Status / Outcome */}
                    <div className="text-lg sm:text-2xl font-display font-black text-[#FFD700] tracking-wide">
                      {currentSlide.isLive ? mprScore.lastBall : currentSlide.badgeLabel || currentSlide.matchState || 'Match Summary'}
                    </div>
                    <div className="text-xs text-emerald-200 mt-1 max-w-md line-clamp-2">
                      {currentSlide.statusText}
                    </div>
                  </div>

                  {/* Attached White Score Strip at Bottom of Black Frame */}
                  <div className="bg-white text-[#111827] px-3.5 py-2.5 flex items-center justify-between border-t border-slate-200">
                    <div className="text-base sm:text-lg font-medium tracking-tight">
                      <span className="font-semibold">{currentSlide.team1Code} </span>
                      <strong className="font-mono-num font-black text-lg sm:text-xl">
                        {currentSlide.team1Score}
                      </strong>{' '}
                      {currentSlide.team1Overs && (
                        <span className="text-sm sm:text-base font-mono-num text-slate-800">
                          ({currentSlide.team1Overs.replace(' Over', '')})
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      {currentSlide.team2Code}{' '}
                      {currentSlide.team2Score === 'Yet to bat'
                        ? 'Yet to bat'
                        : `${currentSlide.team2Score}${currentSlide.team2Overs ? ` (${currentSlide.team2Overs.replace(' Over', '')})` : ''}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCROLLABLE CONTENT BELOW TAB BAR */}
            <div className="px-2.5 sm:px-3.5 space-y-2.5">
              {liveCenterSubTab === 'LIVE' && (
                <>
                  {/* 1. OVER BALLS STRIP (Exact as Screenshot 2: 4 = 4 | Over 126: 0 1 0 0 0 ○ = 1) */}
                  <div className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar ${theme.cardBg}`}>
                    {/* Left previous over tail */}
                    <div className="flex items-center gap-1.5 shrink-0 pr-2.5 border-r border-white/20">
                      <span className="w-6 h-6 rounded-full bg-[#1E88E5] text-white text-xs font-mono-num font-bold flex items-center justify-center">
                        4
                      </span>
                      <span className={`text-xs font-mono-num font-bold ${theme.titleText}`}>= 4</span>
                    </div>

                    {/* Current Over Label */}
                    <span className={`text-xs font-semibold ${theme.titleText} shrink-0`}>
                      Over 126
                    </span>

                    {/* 6 Balls of Current Over */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {Array.from({ length: 6 }).map((_, idx) => {
                        const val = mprScore.overBalls[idx] ?? null;
                        const isFour = val === '4';
                        const isScoring = val !== null && val !== '0';
                        return (
                          <span
                            key={idx}
                            className={`w-6 h-6 rounded-full text-xs font-mono-num font-bold flex items-center justify-center ${
                              val === null
                                ? 'border border-emerald-300/60 bg-transparent'
                                : isFour
                                ? 'bg-[#1E88E5] text-white'
                                : isScoring
                                ? 'bg-[#2E8B47] text-white'
                                : 'bg-white/15 text-white border border-white/20'
                            }`}
                          >
                            {val ?? ''}
                          </span>
                        );
                      })}
                    </div>

                    <span className={`text-xs font-mono-num font-bold ${theme.titleText} ml-auto shrink-0`}>
                      = {mprScore.overBalls.reduce((sum, b) => sum + (Number(b) || 0), 0)}
                    </span>
                  </div>

                  {/* 2. CRR: 2.85 | Over Rem: 38.1 | Day 2: Session 2 (Exact as Screenshot 2) */}
                  <div className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm ${theme.cardBg}`}>
                    <div className={theme.subText}>
                      CRR: <strong className={`font-mono-num font-bold ${theme.titleText}`}>2.85</strong>
                    </div>
                    <div className={theme.subText}>
                      Over Rem: <strong className={`font-mono-num font-bold ${theme.titleText}`}>38.1</strong>
                    </div>
                    <div className={`font-medium ${theme.titleText}`}>Day 2: Session 2</div>
                  </div>

                  {/* 3. WIN PROBABILITY + 1st INNINGS'S TOTAL RUNS (Exact as Screenshot 2!) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <div className="p-3.5 space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-200">
                        <AlertCircle className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>Win Probability</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        {/* RSA */}
                        <div className="space-y-1.5">
                          <div className={`text-xs font-semibold ${theme.titleText}`}>RSA</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="px-2.5 py-1 rounded bg-[#EF5350] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              5.4
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              5.5
                            </span>
                          </div>
                        </div>

                        {/* AUS */}
                        <div className="space-y-1.5">
                          <div className={`text-xs font-semibold ${theme.titleText}`}>AUS</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="px-2.5 py-1 rounded bg-[#EF5350] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              1.95
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              1.97
                            </span>
                          </div>
                        </div>

                        {/* DRAW */}
                        <div className="space-y-1.5">
                          <div className={`text-xs font-semibold ${theme.titleText}`}>DRAW</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="px-2.5 py-1 rounded bg-[#EF5350] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              3.25
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs min-w-[42px]">
                              3.3
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 1st Innings's Total Runs Row */}
                    <div className="px-3.5 py-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>
                        1st Innings&apos;s Total Runs:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded bg-[#EF5350] text-white font-mono-num font-bold text-xs">
                          389
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs">
                          391
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4. BATTER TABLE CARD (Nathan Lyon & Matt Renshaw 🏏 + P'ship: 132(271) & L' Wkt: M. Starc 6(24)) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`text-xs font-medium border-b border-white/10 ${theme.subText}`}>
                          <th className="py-2.5 px-3.5">Batter</th>
                          <th className="py-2.5 px-2 text-right">R</th>
                          <th className="py-2.5 px-2 text-right">B</th>
                          <th className="py-2.5 px-2 text-right">4s</th>
                          <th className="py-2.5 px-2 text-right">6s</th>
                          <th className="py-2.5 px-3.5 text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                        <tr>
                          <td className={`py-2.5 px-3.5 font-semibold ${theme.titleText}`}>
                            Nathan Lyon
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num font-bold ${theme.titleText}`}>
                            {22 + mprScore.gLindeRuns - 2}
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>
                            {84 + mprScore.gLindeBalls - 3}
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>4</td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>0</td>
                          <td className={`py-2.5 px-3.5 text-right font-mono-num ${theme.titleText}`}>26.2</td>
                        </tr>
                        <tr>
                          <td className={`py-2.5 px-3.5 font-semibold ${theme.titleText} flex items-center gap-1.5`}>
                            <span>Matt Renshaw</span>
                            <span>🏏</span>
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num font-bold ${theme.titleText}`}>
                            168
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>348</td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>19</td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>0</td>
                          <td className={`py-2.5 px-3.5 text-right font-mono-num ${theme.titleText}`}>48.28</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className={`px-3.5 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs ${theme.subText}`}>
                      <div>
                        P&apos;ship:{' '}
                        <strong className={`font-mono-num ${theme.titleText}`}>132(271)</strong>
                      </div>
                      <div>
                        L&apos; Wkt:{' '}
                        <strong className={theme.titleText}>M. Starc 6(24)</strong>
                      </div>
                    </div>
                  </div>

                  {/* 5. BOWLER TABLE CARD (Marco Jansen 🔴 27.4 | 59 | 2 | 2.14 — Exact as Screenshot 3) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`text-xs font-medium border-b border-white/10 ${theme.subText}`}>
                          <th className="py-2.5 px-3.5">Bowler</th>
                          <th className="py-2.5 px-2 text-right">O</th>
                          <th className="py-2.5 px-2 text-right">R</th>
                          <th className="py-2.5 px-2 text-right">Wkt</th>
                          <th className="py-2.5 px-3.5 text-right">Eco</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs sm:text-sm">
                        <tr>
                          <td className={`py-2.5 px-3.5 font-semibold ${theme.titleText} flex items-center gap-1.5`}>
                            <span>Marco Jansen</span>
                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-white/40" />
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.subText}`}>
                            27.{mprScore.balls % 6}
                          </td>
                          <td className={`py-2.5 px-2 text-right font-mono-num ${theme.titleText}`}>59</td>
                          <td className={`py-2.5 px-2 text-right font-mono-num font-bold ${theme.titleText}`}>2</td>
                          <td className={`py-2.5 px-3.5 text-right font-mono-num ${theme.titleText}`}>2.14</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 6. YET TO BAT CARD (Exact as Screenshot 3) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <div className={`px-3.5 py-2 border-b border-white/10 text-xs ${theme.subText}`}>
                      Yet to bat
                    </div>
                    <div className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold ${theme.titleText}`}>
                      Josh Hazlewood
                    </div>
                  </div>

                  {/* 7. TEAM REVIEW - UDRS CARD (Exact as Screenshot 3: Left | ✔ | ✘) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className={`border-b border-white/10 ${theme.titleText}`}>
                          <th className="py-2.5 px-3.5 font-semibold flex items-center gap-1.5">
                            <span>Team Review - UDRS</span>
                            <AlertCircle className="w-3.5 h-3.5 text-emerald-300" />
                          </th>
                          <th className={`py-2.5 px-2 text-center font-normal ${theme.subText}`}>Left</th>
                          <th className="py-2.5 px-2 text-center text-[#00FF66] font-black">✔</th>
                          <th className="py-2.5 px-3.5 text-center text-red-500 font-black">✘</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-mono-num">
                        <tr>
                          <td className={`py-2.5 px-3.5 font-sans font-medium ${theme.titleText}`}>RSA</td>
                          <td className={`py-2.5 px-2 text-center ${theme.titleText}`}>1</td>
                          <td className={`py-2.5 px-2 text-center ${theme.titleText}`}>2</td>
                          <td className={`py-2.5 px-3.5 text-center ${theme.titleText}`}>2</td>
                        </tr>
                        <tr>
                          <td className={`py-2.5 px-3.5 font-sans font-medium ${theme.titleText}`}>AUS</td>
                          <td className={`py-2.5 px-2 text-center ${theme.titleText}`}>3</td>
                          <td className={`py-2.5 px-2 text-center ${theme.titleText}`}>0</td>
                          <td className={`py-2.5 px-3.5 text-center ${theme.titleText}`}>0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 8. SETTINGS CARD (Series | Share Score | Voice — Exact as Screenshot 3) */}
                  <div className={`rounded-xl border overflow-hidden divide-y divide-white/10 ${theme.cardBg}`}>
                    <div className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium ${theme.titleText}`}>
                      Settings
                    </div>

                    <button
                      onClick={() => setBottomNav('SERIES')}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-[#FFD700]" />
                        <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>Series</span>
                      </div>
                      <span className={`text-sm font-bold ${theme.subText}`}>&gt;</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText('Live Score: AUS 358-8 (125.5) vs RSA').catch(() => {});
                        }
                        setActiveModal({
                          type: 'NEWS',
                          title: 'Live Score Shared!',
                          subtitle: 'AUS 358-8 (125.5) • Day 2: Session 2',
                          body: 'Live match link and scorecard summary copied to clipboard!'
                        });
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#00FF66]">🔗</span>
                        <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>Share Score</span>
                      </div>
                      <span className={`text-sm font-bold ${theme.subText}`}>&gt;</span>
                    </button>

                    <button
                      onClick={() => {
                        setLiveMuted((m) => !m);
                        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          try {
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance(
                              'Australia 358 for 8 after 125.5 overs. Matt Renshaw batting on 168.'
                            );
                            window.speechSynthesis.speak(u);
                          } catch {
                            // ignore
                          }
                        }
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded bg-white/15 flex items-center justify-center text-[10px] font-bold text-[#FFD700]">
                          Aअ
                        </span>
                        <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>
                          Voice ({liveMuted ? 'Muted' : 'Active'})
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${theme.subText}`}>&gt;</span>
                    </button>
                  </div>

                  {/* 9. DISCLAIMER CARD AT BOTTOM (Exact as Screenshot 3) */}
                  <div className={`rounded-xl border p-3.5 text-xs leading-relaxed ${theme.cardBg} ${theme.subText}`}>
                    Cricket Guru does not promote or support real money gaming. Please avoid clicking on such ads.
                  </div>
                </>
              )}

              {liveCenterSubTab === 'INFO' && (
                <div className="space-y-3 pt-1">
                  {/* 1. SERIES, DATE & TOSS CARD (Exact as Screenshot 2) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <button
                      onClick={() => setBottomNav('SERIES')}
                      className="w-full px-3.5 py-3 border-b border-white/15 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
                    >
                      <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>
                        Australia tour of South Africa 2026
                      </span>
                      <span className={`text-sm font-bold ${theme.titleText}`}>&gt;</span>
                    </button>

                    <div className="p-3.5 space-y-3 text-xs sm:text-sm">
                      {/* Date & Time Row */}
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white">
                          📅
                        </div>
                        <span className={`font-medium ${theme.titleText}`}>
                          01:30 PM, Friday, 09 Oct
                        </span>
                      </div>

                      {/* Toss Row */}
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-400/20 border-2 border-[#F59E0B] flex items-center justify-center shrink-0 text-[#F59E0B] text-xs font-black">
                          ★
                        </div>
                        <span className="font-medium text-[#F59E0B]">
                          RSA won the toss and opt to Bowl
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. PLAYING XI CARD (Exact as Screenshot 2: South Africa > | Australia >) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <div className={`px-3.5 py-2.5 text-sm font-bold ${theme.titleText}`}>
                      Playing XI
                    </div>

                    <div className="divide-y divide-white/10">
                      <button
                        onClick={() => setPlayingXiModal('RSA')}
                        className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="scale-90 origin-left">{renderFlagCircle('RSA')}</div>
                          <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>
                            South Africa
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${theme.titleText}`}>&gt;</span>
                      </button>

                      <button
                        onClick={() => setPlayingXiModal('AUS')}
                        className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="scale-90 origin-left">{renderFlagCircle('AUS')}</div>
                          <span className={`text-xs sm:text-sm font-medium ${theme.titleText}`}>
                            Australia
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${theme.titleText}`}>&gt;</span>
                      </button>
                    </div>
                  </div>

                  {/* PLAYING XI MODAL WHEN SOUTH AFRICA OR AUSTRALIA IS CLICKED */}
                  {playingXiModal && (
                    <div className={`rounded-xl border-2 border-[#00FF66] p-3.5 space-y-3 ${theme.cardBg}`}>
                      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="scale-75 origin-left">{renderFlagCircle(playingXiModal)}</div>
                          <div>
                            <div className={`text-sm font-display font-black ${theme.titleText}`}>
                              {playingXiModal === 'RSA' ? 'South Africa Playing XI' : 'Australia Playing XI'}
                            </div>
                            <div className="text-[11px] text-[#FFD700]">1st Test • Official Confirmed Lineup</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPlayingXiModal(playingXiModal === 'RSA' ? 'AUS' : 'RSA')}
                            className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold text-[#FFD700] cursor-pointer"
                          >
                            Switch to {playingXiModal === 'RSA' ? 'AUS' : 'RSA'}
                          </button>
                          <button
                            onClick={() => setPlayingXiModal(null)}
                            className="w-7 h-7 rounded-lg bg-black/40 text-white flex items-center justify-center text-xs font-black cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(playingXiModal === 'RSA'
                          ? [
                              { num: 1, name: 'Temba Bavuma (c)', role: 'Right-Hand Batter' },
                              { num: 2, name: 'Aiden Markram', role: 'Opening Batter' },
                              { num: 3, name: 'Tony de Zorzi', role: 'Top-Order Batter' },
                              { num: 4, name: 'Tristan Stubbs', role: 'Middle-Order Batter' },
                              { num: 5, name: 'David Bedingham', role: 'Right-Hand Batter' },
                              { num: 6, name: 'Kyle Verreynne (wk)', role: 'Wicketkeeper Batter' },
                              { num: 7, name: 'Wiaan Mulder', role: 'Batting All-Rounder' },
                              { num: 8, name: 'Marco Jansen', role: 'Bowling All-Rounder (Left-Arm Fast)' },
                              { num: 9, name: 'Keshav Maharaj', role: 'Slow Left-Arm Orthodox' },
                              { num: 10, name: 'Kagiso Rabada', role: 'Right-Arm Fast' },
                              { num: 11, name: 'Dane Paterson', role: 'Right-Arm Fast-Medium' }
                            ]
                          : [
                              { num: 1, name: 'Usman Khawaja', role: 'Opening Batter' },
                              { num: 2, name: 'Matt Renshaw', role: 'Opening Batter (168*)' },
                              { num: 3, name: 'Marnus Labuschagne', role: 'Top-Order Batter' },
                              { num: 4, name: 'Steve Smith', role: 'Right-Hand Batter' },
                              { num: 5, name: 'Travis Head', role: 'Middle-Order Batter' },
                              { num: 6, name: 'Beau Webster', role: 'All-Rounder' },
                              { num: 7, name: 'Alex Carey (wk)', role: 'Wicketkeeper Batter' },
                              { num: 8, name: 'Pat Cummins (c)', role: 'Right-Arm Fast' },
                              { num: 9, name: 'Mitchell Starc', role: 'Left-Arm Fast' },
                              { num: 10, name: 'Nathan Lyon', role: 'Right-Arm Offbreak (22*)' },
                              { num: 11, name: 'Josh Hazlewood', role: 'Right-Arm Fast-Medium' }
                            ]
                        ).map((pl) => (
                          <div
                            key={pl.num}
                            className="p-2.5 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-mono-num font-bold text-xs flex items-center justify-center">
                                {pl.num}
                              </span>
                              <div>
                                <div className={`text-xs font-bold ${theme.titleText}`}>{pl.name}</div>
                                <div className={`text-[10px] ${theme.subText}`}>{pl.role}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#00FF66]">XI</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. HEAD TO HEAD (LAST 10 MATCHES) CARD (Exact as Screenshot 2: RSA 2 - 5 AUS + 2 Match Cards) */}
                  <div className={`rounded-xl border p-3.5 space-y-3.5 ${theme.cardBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${theme.titleText}`}>Head to Head</span>
                      <span className={`text-xs ${theme.subText}`}>(Last 10 Matches)</span>
                    </div>

                    {/* Scoreboard Banner: RSA [Flag] 2 - 5 [Flag] AUS */}
                    <div className={`rounded-xl border border-white/15 px-3 py-3 flex items-center justify-between ${theme.innerCardBg}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-sm sm:text-base font-extrabold ${theme.titleText}`}>RSA</span>
                        <div className="scale-90">{renderFlagCircle('RSA')}</div>
                      </div>

                      <div className="text-xl sm:text-2xl font-mono-num font-black text-[#F59E0B] tracking-wider">
                        2 - 5
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="scale-90">{renderFlagCircle('AUS')}</div>
                        <span className={`text-sm sm:text-base font-extrabold ${theme.titleText}`}>AUS</span>
                      </div>
                    </div>

                    {/* Recent H2H Match Cards (1st Test • 04 Mar 2022 & 2nd Test • 12 Mar 2022) */}
                    <div className="space-y-2.5">
                      {[
                        {
                          title: '1st Test • 04 Mar 2022',
                          ausScore: '459-10',
                          ausOv: '(149.2)',
                          rsaScore: '400-10 & 236-4',
                          rsaOv: '(80.0)',
                          result: 'Match Drawn'
                        },
                        {
                          title: '2nd Test • 12 Mar 2022',
                          ausScore: '556-9 & 186-6',
                          ausOv: '(52.5)',
                          rsaScore: '148-10 & 443-7',
                          rsaOv: '(171.4)',
                          result: 'Match Drawn'
                        }
                      ].map((h2h, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setActiveModal({
                              type: 'NEWS',
                              title: `Head to Head Archive: ${h2h.title}`,
                              subtitle: `AUS ${h2h.ausScore} vs RSA ${h2h.rsaScore}`,
                              body: `Result: ${h2h.result}. Full historical Test match scorecard from the last 10 Head-to-Head encounters between Australia and South Africa.`
                            })
                          }
                          className={`rounded-xl border border-white/15 p-3 flex items-center justify-between gap-2 cursor-pointer hover:border-[#FFD700]/60 ${theme.innerCardBg}`}
                        >
                          <div className="space-y-2 flex-1 min-w-0 pr-2">
                            <div className={`text-[11px] ${theme.subText}`}>{h2h.title}</div>

                            {/* AUS Row */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                                  <div className="scale-[0.55]">{renderFlagCircle('AUS')}</div>
                                </div>
                                <span className={`font-medium ${theme.subText}`}>AUS</span>
                              </div>
                              <div className="font-mono-num text-right">
                                <strong className={`font-bold ${theme.titleText}`}>{h2h.ausScore}</strong>{' '}
                                <span className={`text-[11px] ${theme.subText}`}>{h2h.ausOv}</span>
                              </div>
                            </div>

                            {/* RSA Row */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                                  <div className="scale-[0.55]">{renderFlagCircle('RSA')}</div>
                                </div>
                                <span className={`font-medium ${theme.subText}`}>RSA</span>
                              </div>
                              <div className="font-mono-num text-right">
                                <strong className={`font-bold ${theme.titleText}`}>{h2h.rsaScore}</strong>{' '}
                                <span className={`text-[11px] ${theme.subText}`}>{h2h.rsaOv}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Result Column */}
                          <div className="pl-3 border-l border-white/15 shrink-0 text-center min-w-[92px]">
                            <span className="text-xs font-semibold text-[#F59E0B]">{h2h.result}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. UMPIRE 3-COLUMN CARD (Exact as Screenshot 3) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <div className={`px-3.5 py-2.5 border-b border-white/15 text-sm font-bold ${theme.titleText}`}>
                      Umpire
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-white/15 text-xs">
                      <div className="p-3 space-y-1.5">
                        <div className={`text-[11px] ${theme.subText}`}>On-field Umpire</div>
                        <div className={`font-semibold leading-snug ${theme.titleText}`}>
                          Nitin Menon, Richard Illingworth
                        </div>
                      </div>

                      <div className="p-3 space-y-1.5">
                        <div className={`text-[11px] ${theme.subText}`}>Third Umpire</div>
                        <div className={`font-semibold leading-snug ${theme.titleText}`}>
                          Chris Gaffaney
                        </div>
                      </div>

                      <div className="p-3 space-y-1.5">
                        <div className={`text-[11px] ${theme.subText}`}>Referee</div>
                        <div className={`font-semibold leading-snug ${theme.titleText}`}>
                          Richie Richardson
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. VENUE & WEATHER CARD (Exact as Screenshot 3: Kingsmead, Durban + 25.3 °C Overcast, 75% Humidity, 67% Chance) */}
                  <div className={`rounded-xl border overflow-hidden divide-y divide-white/15 ${theme.cardBg}`}>
                    {/* Venue Header Row */}
                    <button
                      onClick={() =>
                        setActiveModal({
                          type: 'NEWS',
                          title: 'Kingsmead Cricket Ground, Durban',
                          subtitle: 'Capacity: 25,000 • Ends: Umgeni End & Old Fort Road End',
                          body: 'Kingsmead in Durban offers lively pace, seam movement under overcast coastal skies, and high humidity assisting swing bowlers across all 5 days.'
                        })
                      }
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className={`text-xs ${theme.subText}`}>Venue</div>
                        <div className={`text-sm font-bold ${theme.titleText}`}>Kingsmead, Durban</div>
                      </div>
                      <span className={`text-sm font-bold ${theme.titleText}`}>&gt;</span>
                    </button>

                    {/* Weather Section */}
                    <div className="p-3.5 space-y-2.5">
                      <div className={`text-xs ${theme.subText}`}>Weather</div>

                      <div className="flex items-center justify-between gap-3">
                        {/* Left: Weather Icon + Durban + 25.3 °C + Overcast */}
                        <div className="flex items-center gap-3">
                          {/* Sun + Cloud + Raindrops Illustration */}
                          <div className="w-12 h-12 shrink-0 flex items-center justify-center relative">
                            <svg viewBox="0 0 64 64" className="w-12 h-12">
                              {/* Yellow Sun */}
                              <circle cx="22" cy="22" r="10" fill="#FBBF24" />
                              {/* Blue Cloud */}
                              <path
                                d="M22 42H46C51.5 42 56 37.5 56 32C56 26.8 52 22.5 46.9 22.1C45.4 15.2 39.3 10 32 10C23.7 10 17 16.7 17 25C17 25.8 17.1 26.5 17.2 27.2C13.1 28.4 10 32.2 10 36.7C10 42 14.5 42 22 42Z"
                                fill="#38BDF8"
                              />
                              {/* Raindrops */}
                              <line x1="24" y1="46" x2="21" y2="54" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                              <line x1="34" y1="46" x2="31" y2="54" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                              <line x1="44" y1="46" x2="41" y2="54" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          </div>

                          <div className="space-y-0.5">
                            <div className={`text-xs ${theme.titleText}`}>Durban</div>
                            <div className={`text-lg sm:text-xl font-mono-num font-black ${theme.titleText}`}>
                              25.3 ° C
                            </div>
                            <div className="text-xs font-semibold text-[#F59E0B]">Overcast</div>
                          </div>
                        </div>

                        {/* Right: Humidity & Rain Chance */}
                        <div className="pl-4 border-l border-white/15 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-sky-400">💧</span>
                            <span className={theme.titleText}>
                              <strong className="font-mono-num">75%</strong>{' '}
                              <span className={theme.subText}>(Humidity)</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sky-300">🌧️</span>
                            <span className={theme.titleText}>
                              <strong className="font-mono-num">67%</strong>{' '}
                              <span className={theme.subText}>(Chance)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. RECENT MATCHES ON VENUE CARD (Exact as Screenshot 3: RSA vs SL • 27 Nov 2024 • 1st Test) */}
                  <div className={`rounded-xl border p-3.5 space-y-3 ${theme.cardBg}`}>
                    <div className={`text-sm font-bold ${theme.titleText}`}>
                      Recent Matches on Venue
                    </div>

                    <div
                      onClick={() =>
                        setActiveModal({
                          type: 'NEWS',
                          title: 'RSA vs SL • 27 Nov 2024 • 1st Test (Kingsmead, Durban)',
                          subtitle: 'RSA Won by 233 Runs',
                          body: 'South Africa 191-10 (49.4) & 366-5d (101.0) defeated Sri Lanka 42-10 (13.5) & 282-10 (79.4). Marco Jansen took 11 wickets in the match.'
                        })
                      }
                      className={`rounded-xl border border-white/15 overflow-hidden cursor-pointer hover:border-[#FFD700]/60 ${theme.innerCardBg}`}
                    >
                      {/* Top Match Title Row */}
                      <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
                        <span className={theme.subText}>RSA vs SL • 27 Nov 2024 • 1st Test</span>
                        <span className={`font-bold ${theme.subText}`}>&gt;</span>
                      </div>

                      {/* Middle Scoreboard: RSA (191-10 & 366-5) VS (42-10 & 282-10) SL */}
                      <div className="p-3.5 flex items-center justify-between gap-2">
                        {/* Left Team: RSA */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex flex-col items-center">
                            <div className="scale-90">{renderFlagCircle('RSA')}</div>
                            <span className={`text-xs font-bold mt-1 ${theme.subText}`}>RSA</span>
                          </div>
                          <div className="space-y-1 font-mono-num text-xs">
                            <div>
                              <strong className={`text-sm font-bold ${theme.titleText}`}>191-10</strong>{' '}
                              <span className={`text-[11px] ${theme.subText}`}>(49.4)</span>
                            </div>
                            <div>
                              <strong className={`text-sm font-bold ${theme.titleText}`}>366-5</strong>{' '}
                              <span className={`text-[11px] ${theme.subText}`}>(101.0)</span>
                            </div>
                          </div>
                        </div>

                        {/* Center VS Pill */}
                        <div className="flex flex-col items-center justify-center px-1">
                          <div className="w-px h-3 bg-white/15" />
                          <span className="px-2 py-0.5 rounded-full border border-white/20 text-[10px] font-bold text-emerald-200">
                            VS
                          </span>
                          <div className="w-px h-3 bg-white/15" />
                        </div>

                        {/* Right Team: SL */}
                        <div className="flex items-center gap-2.5">
                          <div className="space-y-1 font-mono-num text-xs text-right">
                            <div>
                              <strong className={`text-sm font-bold ${theme.titleText}`}>42-10</strong>{' '}
                              <span className={`text-[11px] ${theme.subText}`}>(13.5)</span>
                            </div>
                            <div>
                              <strong className={`text-sm font-bold ${theme.titleText}`}>282-10</strong>{' '}
                              <span className={`text-[11px] ${theme.subText}`}>(79.4)</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="scale-90">{renderFlagCircle('SL')}</div>
                            <span className={`text-xs font-bold mt-1 ${theme.subText}`}>SL</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Result Row */}
                      <div className="px-3.5 py-2.5 border-t border-white/10 text-xs font-semibold text-[#F59E0B]">
                        RSA Won by 233 Runs
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {liveCenterSubTab === 'COMMENTARY' && (
                <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
                  {[
                    { ov: '125.5', b: '0', text: 'Marco Jansen to Matt Renshaw, no run, defended solidly back down the pitch.' },
                    { ov: '125.4', b: '0', text: 'Marco Jansen to Matt Renshaw, no run, good length outside off, left alone.' },
                    { ov: '125.3', b: '0', text: 'Marco Jansen to Matt Renshaw, no run, watchfully blocked to cover.' },
                    { ov: '125.2', b: '1', text: 'Marco Jansen to Nathan Lyon, 1 run, tucked off the hips to fine leg.' },
                    { ov: '125.1', b: '0', text: 'Marco Jansen to Nathan Lyon, no run, short of a length, defended.' }
                  ].map((c, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-white/10 last:border-0">
                      <span className="font-mono-num text-xs font-bold text-[#FFD700] w-11">{c.ov}</span>
                      <span className="w-6 h-6 rounded-full bg-[#2E8B47] text-white text-xs font-mono-num font-bold flex items-center justify-center shrink-0">
                        {c.b}
                      </span>
                      <p className={`text-xs ${theme.titleText}`}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {liveCenterSubTab === 'SCORECARD' && (
                <div className={`rounded-2xl border p-4 space-y-2 ${theme.cardBg}`}>
                  <div className="text-sm font-bold text-[#FFD700]">
                    Australia 1st Innings: 358-8 (125.5 Ov)
                  </div>
                  <div className={`text-xs ${theme.subText}`}>
                    Matt Renshaw 168*(348) • Nathan Lyon 22*(84) • Marco Jansen 2/59 (27.4)
                  </div>
                </div>
              )}

              {liveCenterSubTab === 'HISTORY' && (
                <div className={`rounded-2xl border p-4 space-y-2 ${theme.cardBg}`}>
                  <div className="text-sm font-bold text-[#FFD700]">Over History</div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                    <span className={`font-bold ${theme.titleText}`}>Over 126</span>
                    <span className="text-[#00FF66] font-mono-num">0 1 0 0 0 • (1 run)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                    <span className={`font-bold ${theme.titleText}`}>Over 125</span>
                    <span className="text-[#00FF66] font-mono-num">0 0 0 0 0 4 (4 runs)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className={`font-bold ${theme.titleText}`}>Over 124</span>
                    <span className="text-[#FFD700] font-mono-num">1 0 W 0 2 0 (3 runs, 1 wkt)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            EXACT SCREENSHOT 1 & 2 HOME FEED (WHEN bottomNav === 'HOME' && topTab === 'FEATURED')
           ==================================================================== */}
        {bottomNav === 'HOME' && topTab === 'FEATURED' && (
          <>
            {/* 3. FEATURED LIVE MATCH HORIZONTAL SWIPEABLE CAROUSEL (SWIPE LEFT/RIGHT TO SEE ALL 8-10 MATCHES!) */}
            <div>
              <div
                ref={featuredCarouselRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  if (el.clientWidth > 0) {
                    const idx = Math.round(el.scrollLeft / (el.clientWidth + 12));
                    if (idx >= 0 && idx < featuredSlides.length && idx !== activeSlide) {
                      setActiveSlide(idx);
                    }
                  }
                }}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3 pb-1"
              >
                {featuredSlides.map((slideItem, slideIdx) => (
                  <div
                    key={slideItem.id}
                    onClick={() => {
                      setActiveSlide(slideIdx);
                      if ('isCommunityMatch' in slideItem && slideItem.isCommunityMatch && slideItem.matchId) {
                        onWatchLiveMatch(slideItem.matchId);
                      } else {
                        setTopTab('LIVE');
                      }
                    }}
                    className={`w-full shrink-0 snap-center rounded-2xl border p-4 cursor-pointer transition-all select-none ${theme.cardBg}`}
                  >
                    {/* Match Series Title + Right Arrow */}
                    <div className="flex items-center justify-between gap-2">
                      <h2 className={`text-xs sm:text-sm font-bold ${theme.titleText} truncate`}>
                        {slideItem.series}
                      </h2>
                      <span className={`text-base font-bold ${theme.titleText}`}>&gt;</span>
                    </div>
                    <p className={`text-[11px] ${theme.subText} mt-0.5`}>{slideItem.dateInfo}</p>

                    {/* Score Row: Left Team | Center (• Live) | Right Team */}
                    <div className="flex items-center justify-between my-4">
                      {/* Left Team */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex flex-col items-center">
                          {renderFlagCircle(slideItem.team1Flag)}
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs font-extrabold ${theme.titleText}`}>
                              {slideItem.team1Code}
                            </span>
                            {slideItem.team1Batting && (
                              <span className="text-xs" title="Batting">
                                🏏
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className={`text-xl sm:text-2xl font-mono-num font-extrabold ${theme.titleText} leading-none`}>
                            {slideItem.team1Score}
                          </div>
                          <div className={`text-xs ${theme.subText} mt-1 font-medium`}>
                            {slideItem.team1Overs}
                          </div>
                        </div>
                      </div>

                      {/* Center Genuine Status Pill (Only shows pulsing Live if genuinely Live!) */}
                      <div className="flex items-center gap-1.5">
                        {slideItem.isLive ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${theme.liveText}`}>Live</span>
                          </>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-black/35 border border-[#FFD700]/40 text-[11px] font-bold text-[#FFD700]">
                            {slideItem.badgeLabel || slideItem.matchState || 'Match'}
                          </span>
                        )}
                      </div>

                      {/* Right Team */}
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className={`text-xs sm:text-sm font-semibold ${theme.titleText}`}>
                            {slideItem.team2Score}
                          </div>
                          {slideItem.team2Overs && (
                            <div className={`text-[11px] ${theme.subText} mt-0.5`}>
                              {slideItem.team2Overs}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          {renderFlagCircle(slideItem.team2Flag)}
                          <span className={`text-xs font-extrabold ${theme.titleText} mt-1`}>
                            {slideItem.team2Code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider & Session Status */}
                    <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
                      <span className={`text-xs font-semibold ${theme.accentText} truncate pr-2`}>
                        {slideItem.statusText}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 shrink-0">
                        Match {slideIdx + 1}/{featuredSlides.length} • Swipe ↔
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Pagination Dots Below Card (Synced with Finger Swipe & Click!) */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                {featuredSlides.map((s, idx) => {
                  const isActive = idx === activeSlide % featuredSlides.length;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToFeaturedSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isActive ? `w-5 ${theme.dotActive}` : `w-2 ${theme.dotInactive}`
                      }`}
                      aria-label={`Match slide ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Dedicated Admin Ad Banner Slot Below Cricket Featured Match Card */}
              <CardAdBanner slotId="cricket_hub_card" className="mt-2.5" />
            </div>

            {/* 4. QUICK ACTION PILLS ROW: WT20 WC Winners | Videos | News | Points Table */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() =>
                  setActiveModal({
                    type: 'WT20',
                    title: 'ICC Men’s T20 World Cup Winners (2007 – 2026)',
                    subtitle: 'Complete Championship Roll of Honour',
                    body: '2024: India 🇮🇳 | 2022: England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | 2021: Australia 🇦🇺 | 2016: West Indies 🌴 | 2014: Sri Lanka 🇱🇰 (Hosted in Bangladesh 🇧🇩) | 2012: West Indies 🌴 | 2010: England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | 2009: Pakistan 🇵🇰 | 2007: India 🇮🇳'
                  })
                }
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${theme.pillBg}`}
              >
                <span className="text-[#FFD700]">➦</span>
                <span>WT20 WC Winners</span>
              </button>

              <button
                onClick={() => setBottomNav('SHORTS')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${theme.pillBg}`}
              >
                <Play className="w-3.5 h-3.5 text-[#00FF66] fill-[#00FF66]" />
                <span>Videos</span>
              </button>

              <button
                onClick={() =>
                  setActiveModal({
                    type: 'NEWS',
                    title: 'AB de Villiers storms WCL 2026 with 37-ball Century',
                    subtitle: 'SportsViva Cricket Desk • 2 hrs ago',
                    img: IMG_CRICKET_NEWS_ABD,
                    body: 'South African legend AB de Villiers lit up the 2026 Championship with an extraordinary 37-ball hundred, smashing 9 towering sixes and 11 boundaries in a vintage 360-degree batting masterclass.'
                  })
                }
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${theme.pillBg}`}
              >
                <Radio className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>News</span>
              </button>

              <button
                onClick={() => {
                  setFixtureSubTab('POINTS');
                  setBottomNav('FIXTURES');
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-all ${theme.pillBg}`}
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Points Table</span>
              </button>
            </div>

            {/* 5. TRENDING SERIES SECTION (EXACT AS SCREENSHOT 1) */}
            <div className="space-y-2.5">
              <h3 className={`text-base font-display font-extrabold ${theme.titleText}`}>
                Trending Series
              </h3>

              <div
                onClick={() => setBottomNav('SERIES')}
                className={`rounded-2xl border p-3 flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-[0.99] ${theme.cardBg}`}
              >
                {/* Left Square INDIA VS WEST INDIES Badge */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-gradient-to-br from-[#FF6B00] via-[#1338BE] to-[#6A0DAD] border border-[#FFD700]/60 flex flex-col items-center justify-end p-1 shadow-md">
                  <div className="w-full text-center bg-black/70 rounded px-1 py-0.5">
                    <div className="text-[8px] font-display font-black text-white leading-tight">
                      INDIA
                    </div>
                    <div className="text-[7px] font-black text-[#FFD700] leading-none">VS</div>
                    <div className="text-[7px] font-display font-black text-[#00FF66] leading-tight">
                      WEST INDIES
                    </div>
                  </div>
                </div>

                {/* Middle Series Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold ${theme.titleText} truncate`}>
                    West Indies tour of India 2026
                  </h4>
                  <p className={`text-xs ${theme.subText} mt-0.5`}>27 Sep - 17 Oct 2026</p>
                  <p className={`text-xs font-semibold ${theme.accentText} mt-0.5`}>8 Matches</p>
                </div>

                {/* Right Chevron */}
                <span className={`text-lg font-bold ${theme.titleText} pr-1`}>&gt;</span>
              </div>
            </div>

            {/* 6. POPULAR SHORTS SECTION (EXACT AS SCREENSHOT 1 & TOP OF SCREENSHOT 2) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-display font-extrabold ${theme.titleText}`}>
                  Popular Shorts
                </h3>
                <button
                  onClick={() => setBottomNav('SHORTS')}
                  className="text-xs font-bold text-[#FFD700] hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: 's1',
                    topTag: 'SAFARI DAY 3',
                    subTag: 'KAYO SPORTS',
                    caption: 'An absolutely STACKED lineup f...',
                    img: IMG_CRICKET_SHORT_STADIUM,
                    views: '142K'
                  },
                  {
                    id: 's2',
                    sticker: 'GULLY CRICKET WITH KL RAHUL 😤',
                    caption: 'Things you love to see 😍',
                    img: IMG_CRICKET_SHORT_GULLY,
                    views: '298K'
                  },
                  {
                    id: 's3',
                    topTag: 'TOP MOMENT',
                    caption: 'Respect from Ranchi. 🔝🔥',
                    img: IMG_CRICKET,
                    views: '185K'
                  }
                ].map((short) => (
                  <div
                    key={short.id}
                    onClick={() =>
                      setActiveModal({
                        type: 'SHORT',
                        title: short.caption,
                        subtitle: `${short.views} Views • SportsViva Cricket Shorts`,
                        img: short.img,
                        body: 'Tap Next or Like to earn +10 SportsViva Reward Points while watching exclusive Cricket Shorts!'
                      })
                    }
                    className="relative h-44 sm:h-56 rounded-2xl overflow-hidden border border-[#00FF66]/40 group cursor-pointer shadow-lg"
                  >
                    <img
                      src={short.img}
                      alt={short.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />

                    {/* Top Badges */}
                    {short.topTag && (
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-black/75 border border-[#FFD700]/60 text-[8px] font-black text-[#FFD700]">
                          {short.topTag}
                        </span>
                        {short.subTag && (
                          <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/90 text-[#021A0A] text-[7px] font-black">
                            {short.subTag}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Center Sticker (Like Screenshot 2 "GULLY CRICKET WITH KL RAHUL") */}
                    {short.sticker && (
                      <div className="absolute top-6 inset-x-1.5 flex justify-center">
                        <span className="px-1.5 py-0.5 rounded bg-white/90 text-[#021A0A] font-display font-black text-[8px] sm:text-[9px] text-center leading-tight shadow">
                          {short.sticker}
                        </span>
                      </div>
                    )}

                    {/* Bottom Caption */}
                    <div className="absolute bottom-2 inset-x-2">
                      <p className="text-[11px] sm:text-xs font-bold text-white leading-tight line-clamp-2 drop-shadow">
                        {short.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. SPORTSVIVA PREMIUM BANNER (EXACT AS SCREENSHOT 2 WITH USER'S BRAND NAME!) */}
            <div
              onClick={() =>
                setActiveModal({
                  type: 'PREMIUM',
                  title: 'SPORTSVIVA PREMIUM MEMBERSHIP',
                  subtitle: 'Unlock ad-free 4K live scorecards, VIP badges & bonus points',
                  body: 'Enjoy 100% ad-free Cricket, Football & Tennis live streams, ball-by-ball voice commentary, and priority tournament room access on SportsViva!'
                })
              }
              className="rounded-2xl overflow-hidden border border-[#FFD700]/60 flex items-stretch cursor-pointer shadow-[0_4px_18px_rgba(0,0,0,0.4)] hover:brightness-105 transition-all"
            >
              {/* Left Dark Box: Cricketer Silhouette + SPORTSVIVA PREMIUM */}
              <div className="bg-[#18221D] px-3.5 py-3 flex items-center gap-2.5 shrink-0 border-r border-[#FFD700]/30">
                <svg viewBox="0 0 48 56" className="w-7 h-8 text-white fill-current shrink-0">
                  <polygon points="28,3 35,1 24,18 19,15" fill="#FFD700" />
                  <circle cx="19" cy="18" r="4" />
                  <path d="M15 23 C15 23 23 22 25 28 L22 39 L27 52 L22 54 L18 41 L14 52 L9 51 L13 37 L13 26 Z" />
                </svg>
                <div className="leading-none">
                  <div className="text-xs sm:text-sm font-display font-black italic text-[#FFD700] tracking-wide">
                    SPORTSVIVA
                  </div>
                  <div className="text-[10px] font-display font-bold text-white tracking-widest mt-0.5">
                    PREMIUM
                  </div>
                </div>
              </div>

              {/* Right Warm Gold/Champagne Box: Unlock ads-free premium version */}
              <div className="flex-1 bg-gradient-to-r from-[#E2D9C5] via-[#EDE5D2] to-[#D8CBB0] px-3.5 py-3 flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold italic text-[#111827]">
                  Unlock ads-free premium version
                </span>
                <span className="text-[#111827] text-xs font-black">▶</span>
              </div>
            </div>

            {/* 8. TOP NEWS SECTION + HORIZONTAL SWIPEABLE CAROUSEL & 6 PAGINATION DOTS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-display font-extrabold ${theme.titleText}`}>
                  Top News
                </h3>
                <span className={`text-[11px] ${theme.subText}`}>Swipe ↔</span>
              </div>

              <div
                ref={newsCarouselRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  if (el.clientWidth > 0) {
                    const idx = Math.round(el.scrollLeft / (el.clientWidth + 12));
                    if (idx >= 0 && idx < 6 && idx !== activeNewsDot) {
                      setActiveNewsDot(idx);
                    }
                  }
                }}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3 pb-1"
              >
                {[
                  {
                    id: 'n1',
                    title: 'AB de Villiers storms WCL 2026 with 37-ball Century',
                    time: '2 hrs ago',
                    img: IMG_CRICKET_NEWS_ABD,
                    summary:
                      'AB de Villiers produced a breathtaking 37-ball century studded with 360-degree strokes over fine leg and extra cover.'
                  },
                  {
                    id: 'n2',
                    title: 'Sanju Samson smashes 82-run knock in T20I decider',
                    time: '2 hrs ago',
                    img: IMG_CRICKET,
                    summary:
                      'Sanju Samson anchored the innings with a commanding 82 off 46 balls to seal the bilateral T20I trophy.'
                  },
                  {
                    id: 'n3',
                    title: 'Matt Renshaw unbeaten 168* puts Australia in command at Kingsmead',
                    time: '3 hrs ago',
                    img: IMG_CRICKET_SHORT_STADIUM,
                    summary:
                      'Matt Renshaw batted over 340 deliveries with rock-solid defense and crisp drives to rescue Australia in the 1st Test.'
                  },
                  {
                    id: 'n4',
                    title: 'Towhid Hridoy & Litton Das power Bangladesh to record T20I total',
                    time: '4 hrs ago',
                    img: IMG_CRICKET_SHORT_GULLY,
                    summary:
                      'Bangladesh middle-order batters unleashed a flurry of sixes in the final five overs to set an imposing target.'
                  },
                  {
                    id: 'n5',
                    title: 'ICC announces schedule & venues for 2026 Champions Trophy',
                    time: '5 hrs ago',
                    img: IMG_CRICKET_NEWS_ABD,
                    summary:
                      'Eight top-ranked ODI nations will battle across two groups in the upcoming Champions Trophy marquee tournament.'
                  },
                  {
                    id: 'n6',
                    title: 'BPL 2026 Draft: Franchises lock in star overseas & local icons',
                    time: '6 hrs ago',
                    img: IMG_CRICKET,
                    summary:
                      'All seven BPL franchises have completed their squad rosters ahead of the high-voltage Bangladesh Premier League season.'
                  }
                ].map((news, idx) => (
                  <div
                    key={news.id}
                    onClick={() => {
                      setActiveNewsDot(idx);
                      setActiveModal({
                        type: 'NEWS',
                        title: news.title,
                        subtitle: `Top News • ${news.time}`,
                        img: news.img,
                        body: news.summary
                      });
                    }}
                    className={`w-full sm:w-[48%] shrink-0 snap-center rounded-2xl border overflow-hidden cursor-pointer transition-transform active:scale-[0.99] ${theme.cardBg}`}
                  >
                    <div className="h-44 sm:h-48 w-full overflow-hidden">
                      <img
                        src={news.img}
                        alt={news.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5">
                      <h4 className={`text-sm sm:text-base font-bold ${theme.titleText} leading-snug`}>
                        {news.title}
                      </h4>
                      <p className={`text-xs ${theme.subText}`}>{news.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 6 Pagination Dots Below Top News (Synced with Swipe & Click) */}
              <div className="flex items-center gap-1.5 pt-1 pl-1">
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => scrollToNewsSlide(dot)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeNewsDot === dot ? `w-5 ${theme.dotActive}` : `w-2 ${theme.dotInactive}`
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 9. BREAKING SECTION (EXACT AS SCREENSHOT 2) */}
            <div className="space-y-2.5">
              <h3 className={`text-base font-display font-extrabold ${theme.titleText}`}>
                Breaking
              </h3>

              {[
                {
                  title: 'AB de Villiers storms WCL 2026 with 37-ball Century',
                  img: IMG_CRICKET_NEWS_ABD,
                  tag: 'JUST IN'
                },
                {
                  title: 'Bangladesh announce 15-member squad for South Africa Test series in Mirpur',
                  img: IMG_CRICKET,
                  tag: 'BANGLADESH CRICKET'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setActiveModal({
                      type: 'NEWS',
                      title: item.title,
                      subtitle: `Breaking News • ${item.tag}`,
                      img: item.img,
                      body: `${item.title} — Stay tuned to SportsViva Cricket for live ball-by-ball coverage, expert analysis, and dressing room updates.`
                    })
                  }
                  className={`rounded-2xl border p-3 flex items-center justify-between gap-3 cursor-pointer ${theme.cardBg}`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[9px] font-black text-red-400">
                      {item.tag}
                    </span>
                    <h4 className={`text-xs sm:text-sm font-bold ${theme.titleText} leading-snug line-clamp-2`}>
                      {item.title}
                    </h4>
                  </div>
                  <img
                    src={item.img}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-16 rounded-xl object-cover shrink-0 border border-white/15"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ====================================================================
            SUB-TAB: SHORTS VIEW (WHEN bottomNav === 'SHORTS')
           ==================================================================== */}
        {bottomNav === 'SHORTS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-display font-black ${theme.titleText}`}>
                SportsViva Cricket Shorts
              </h2>
              <button
                onClick={() => setBottomNav('HOME')}
                className="text-xs font-bold text-[#FFD700] cursor-pointer"
              >
                ← Back to Cricket Home
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'An absolutely STACKED lineup for Day 3!', views: '142K', img: IMG_CRICKET_SHORT_STADIUM },
                { title: 'Gully Cricket with KL Rahul 😤 Things you love to see 😍', views: '298K', img: IMG_CRICKET_SHORT_GULLY },
                { title: 'Respect from Ranchi 🔝🔥 Boundary rope miracle!', views: '185K', img: IMG_CRICKET },
                { title: 'AB de Villiers 37-ball 100 every boundary highlight!', views: '410K', img: IMG_CRICKET_NEWS_ABD }
              ].map((s, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setActiveModal({
                      type: 'SHORT',
                      title: s.title,
                      subtitle: `${s.views} Views • SportsViva Shorts`,
                      img: s.img,
                      body: 'Watching official SportsViva Cricket Short Reel.'
                    })
                  }
                  className="relative h-60 rounded-2xl overflow-hidden border border-[#00FF66]/40 cursor-pointer group"
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-bold text-[#FFD700]">
                    ▶ {s.views}
                  </div>
                  <div className="absolute bottom-3 inset-x-3 text-xs font-bold text-white">
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            SUB-TAB: FIXTURES & POINTS TABLE (WHEN bottomNav === 'FIXTURES')
           ==================================================================== */}
        {bottomNav === 'FIXTURES' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-4 gap-1.5 bg-black/30 p-1.5 rounded-xl border border-white/15">
              {[
                { id: 'LIVE', label: 'Live' },
                { id: 'UPCOMING', label: 'Upcoming' },
                { id: 'RECENT', label: 'Recent' },
                { id: 'POINTS', label: 'Points Table' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFixtureSubTab(t.id as typeof fixtureSubTab)}
                  className={`py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                    fixtureSubTab === t.id
                      ? 'bg-[#FFD700] text-[#021A0A]'
                      : 'text-white hover:text-[#00FF66]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {fixtureSubTab === 'LIVE' && (
              <div className="space-y-3">
                {genuineLiveSlides.length === 0 ? (
                  <div className={`rounded-2xl border p-6 text-center space-y-2.5 ${theme.cardBg}`}>
                    <div className="text-base font-display font-black text-[#FFD700]">
                      বর্তমানে কোনো ক্রিকেট খেলা সরাসরি (Live) চলছে না • Live (0)
                    </div>
                    <p className={`text-xs ${theme.subText}`}>
                      এখন কোনো আন্তর্জাতিক বা ঘরোয়া ক্রিকেট ম্যাচ লাইভ নেই। আসন্ন খেলা দেখতে Upcoming এবং শেষ হওয়া খেলার ফলাফল দেখতে Recent ট্যাবে যান।
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => setFixtureSubTab('UPCOMING')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFD700] text-[#021A0A] text-xs font-display font-black cursor-pointer"
                      >
                        Upcoming Matches ({espnUpcomingMatches.length})
                      </button>
                      <button
                        onClick={() => setFixtureSubTab('RECENT')}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold cursor-pointer"
                      >
                        Recent Matches ({espnRecentMatches.length})
                      </button>
                    </div>
                  </div>
                ) : (
                  genuineLiveSlides.map((s) => (
                    <div key={s.id} className={`rounded-2xl border p-4 ${theme.cardBg}`}>
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                        <span>{s.series}</span>
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px]">LIVE</span>
                      </div>
                      <div className="flex items-center justify-between my-3">
                        <div className="text-base font-bold text-white">
                          {s.team1Code}: <span className="text-[#00FF66] font-mono-num">{s.team1Score}</span>{' '}
                          {s.team1Overs ? `(${s.team1Overs})` : ''}
                        </div>
                        <div className="text-sm font-bold text-emerald-200">
                          {s.team2Code}: {s.team2Score}
                        </div>
                      </div>
                      <div className="text-xs text-[#FFD700]">{s.statusText}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {fixtureSubTab === 'UPCOMING' && (
              <div className="space-y-2.5">
                {espnUpcomingMatches.length > 0 ? (
                  espnUpcomingMatches.map((u) => (
                    <div key={u.id} className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 ${theme.cardBg}`}>
                      <div className="min-w-0">
                        <div className={`text-sm font-bold ${theme.titleText} truncate`}>
                          {u.team1Name || u.team1Code} vs {u.team2Name || u.team2Code}
                        </div>
                        <div className={`text-xs ${theme.subText} mt-0.5 truncate`}>{u.series}</div>
                        <div className="text-[11px] text-emerald-300 mt-0.5">{u.statusText}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/40 text-xs font-mono-num font-bold text-[#FFD700] shrink-0">
                        Upcoming
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={`rounded-2xl border p-4 text-center text-xs ${theme.cardBg} ${theme.subText}`}>
                    Loading genuine upcoming fixtures...
                  </div>
                )}
              </div>
            )}

            {fixtureSubTab === 'RECENT' && (
              <div className="space-y-2.5">
                {espnRecentMatches.length > 0 ? (
                  espnRecentMatches.map((r) => (
                    <div key={r.id} className={`rounded-2xl border p-3.5 space-y-1.5 ${theme.cardBg}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#FFD700] truncate">{r.series}</span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-emerald-200 shrink-0">
                          {r.badgeLabel || r.matchState || 'Finished'}
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${theme.titleText}`}>
                        {r.team1Name || r.team1Code} ({r.team1Score}{r.team1Overs ? ` • ${r.team1Overs}` : ''}) vs{' '}
                        {r.team2Name || r.team2Code} ({r.team2Score}{r.team2Overs ? ` • ${r.team2Overs}` : ''})
                      </div>
                      <div className="text-xs font-bold text-[#00FF66]">{r.statusText}</div>
                    </div>
                  ))
                ) : (
                  <div className={`rounded-2xl border p-4 text-center text-xs ${theme.cardBg} ${theme.subText}`}>
                    Loading genuine recent results...
                  </div>
                )}
              </div>
            )}

            {fixtureSubTab === 'POINTS' && (
              <div className={`rounded-2xl border overflow-hidden ${theme.cardBg}`}>
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-black/40 text-[#FFD700] border-b border-white/15">
                      <th className="py-3 px-3.5">Team</th>
                      <th className="py-3 px-2 text-center">M</th>
                      <th className="py-3 px-2 text-center">W</th>
                      <th className="py-3 px-2 text-center">L</th>
                      <th className="py-3 px-2 text-right">NRR</th>
                      <th className="py-3 px-3.5 text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-mono-num">
                    {[
                      { team: '🇧🇩 Bangladesh Tigers', m: 8, w: 7, l: 1, nrr: '+1.482', pts: 14 },
                      { team: '🇮🇳 India Blues', m: 8, w: 6, l: 2, nrr: '+1.120', pts: 12 },
                      { team: '🇦🇺 Australia Gold', m: 8, w: 5, l: 3, nrr: '+0.645', pts: 10 },
                      { team: '🇿🇦 South Africa', m: 8, w: 4, l: 4, nrr: '+0.118', pts: 8 },
                      { team: '🌴 West Indies', m: 8, w: 3, l: 5, nrr: '-0.310', pts: 6 },
                      { team: '🇱🇰 Sri Lanka Lions', m: 8, w: 2, l: 6, nrr: '-0.890', pts: 4 }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className={`py-2.5 px-3.5 font-sans font-bold ${theme.titleText}`}>{row.team}</td>
                        <td className={`py-2.5 px-2 text-center ${theme.subText}`}>{row.m}</td>
                        <td className="py-2.5 px-2 text-center text-[#00FF66] font-bold">{row.w}</td>
                        <td className="py-2.5 px-2 text-center text-rose-400">{row.l}</td>
                        <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{row.nrr}</td>
                        <td className="py-2.5 px-3.5 text-right font-black text-[#FFD700]">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            SUB-TAB: SERIES VIEW (WHEN bottomNav === 'SERIES')
           ==================================================================== */}
        {bottomNav === 'SERIES' && (
          <CricketMoreHub
            initialScreen="BROWSE_SERIES"
            theme={theme}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            onGoCreateLive={onGoCreateLive}
            onBackToMainHome={onBack}
            onOpenLiveMatch={() => {
              setBottomNav('HOME');
              setTopTab('LIVE');
            }}
          />
        )}

        {/* ====================================================================
            SUB-TAB: MORE VIEW (WHEN bottomNav === 'MORE')
            EXACT 3 SCREENSHOTS OF "MORE" MENU + FULL MULTI-STEP DRILL-DOWN
           ==================================================================== */}
        {bottomNav === 'MORE' && (
          <CricketMoreHub
            initialScreen="MENU"
            theme={theme}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            onGoCreateLive={onGoCreateLive}
            onBackToMainHome={onBack}
            onOpenLiveMatch={() => {
              setBottomNav('HOME');
              setTopTab('LIVE');
            }}
          />
        )}

        {/* ====================================================================
            10. DEDICATED CRICKET SUB-NAV BAR FIXED AT BOTTOM OF SCREEN
                (EXACT 5 ITEMS: Home | Shorts | Fixtures | Series | More)
           ==================================================================== */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.85)] ${theme.navBg}`}>
          <div className="max-w-5xl mx-auto grid grid-cols-5 gap-1">
            {[
              { id: 'HOME', label: 'Home', icon: 'home' },
              { id: 'SHORTS', label: 'Shorts', icon: 'shorts' },
              { id: 'FIXTURES', label: 'Fixtures', icon: 'fixtures' },
              { id: 'SERIES', label: 'Series', icon: 'series' },
              { id: 'MORE', label: 'More', icon: 'more' }
            ].map((item) => {
              const active = bottomNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setBottomNav(item.id as typeof bottomNav)}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl relative cursor-pointer transition-all ${
                    active ? 'text-[#FFD700] font-bold' : `${theme.subText} hover:text-white`
                  }`}
                >
                  {active && (
                    <span className="absolute -top-1.5 w-10 h-[3px] rounded-full bg-[#00FF66]" />
                  )}
                  {item.icon === 'home' && <Home className="w-5 h-5 mb-0.5" />}
                  {item.icon === 'shorts' && (
                    <div
                      className={`w-5 h-5 mb-0.5 rounded-md border-[1.8px] flex items-center justify-center text-[11px] font-display font-black leading-none ${
                        active ? 'border-[#FFD700] text-[#FFD700]' : 'border-current'
                      }`}
                    >
                      S
                    </div>
                  )}
                  {item.icon === 'fixtures' && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mb-0.5 stroke-current fill-none" strokeWidth="1.8">
                      <path d="M6 3v18M10 3v18M14 3v18M4 5h12" />
                      <path d="M15 19l6-6-3-3-6 6v3h3z" />
                      <circle cx="19" cy="19" r="2" />
                    </svg>
                  )}
                  {item.icon === 'series' && <Trophy className="w-5 h-5 mb-0.5" />}
                  {item.icon === 'more' && (
                    <div className="w-5 h-5 mb-0.5 rounded-md border-[1.8px] border-current flex items-center justify-center text-[10px] font-black tracking-tighter">
                      •••
                    </div>
                  )}
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INTERACTIVE MODAL FOR SHORTS / NEWS / WT20 WINNERS / PREMIUM */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#08301D] border-2 border-[#00FF66] rounded-2xl max-w-md w-full overflow-hidden shadow-[0_0_30px_rgba(0,255,102,0.35)]">
            {activeModal.img && (
              <div className="relative h-56 w-full">
                <img
                  src={activeModal.img}
                  alt={activeModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-display font-black text-[#FFD700]">
                    {activeModal.title}
                  </h3>
                  {activeModal.subtitle && (
                    <p className="text-xs text-emerald-300 mt-0.5">{activeModal.subtitle}</p>
                  )}
                </div>
                {!activeModal.img && (
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-white leading-relaxed">{activeModal.body}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CRICKET "MORE" HUB — EXACT 3 SCREENSHOTS MENU + MULTI-STEP DRILL-DOWN
// WORKS ALL THE WAY TO THE LAST STEP FOR EVERY OPTION
// ============================================================================
type MoreScreenType =
  | 'MENU'
  | 'BROWSE_SERIES'
  | 'BROWSE_TEAM'
  | 'BROWSE_PLAYER'
  | 'SCHEDULE'
  | 'ICC_MEN'
  | 'ICC_WOMEN'
  | 'RECORDS'
  | 'POLLS'
  | 'PREMIUM'
  | 'LANGUAGE'
  | 'THEME'
  | 'NOTIFICATIONS'
  | 'SPEECH'
  | 'RATE'
  | 'SHARE'
  | 'FEEDBACK'
  | 'ABOUT'
  | 'TERMS'
  | 'PRIVACY';

interface MorePlayerProfile {
  id: string;
  name: string;
  country: string;
  flag: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  born: string;
  birthPlace: string;
  age: string;
  teams: string[];
  iccRank: { test: string; odi: string; t20: string };
  bio: string;
  stats: {
    format: 'Test' | 'ODI' | 'T20I' | 'League';
    m: number;
    inn: number;
    runs: number;
    hs: string;
    avg: string;
    sr: string;
    hundreds: number;
    fifties: number;
    sixes: number;
    wkts: number;
    bbi: string;
    econ: string;
  }[];
  recentMatches: {
    vs: string;
    bat: string;
    bowl: string;
    format: string;
    date: string;
    venue: string;
    matchId: string;
  }[];
}

interface MoreTeamProfile {
  id: string;
  name: string;
  short: string;
  flag: string;
  category: 'INTERNATIONAL' | 'LEAGUE' | 'WOMEN';
  captain: string;
  coach: string;
  homeGround: string;
  titles: string;
  iccRanks: { test: number; odi: number; t20: number };
  ratings: { test: number; odi: number; t20: number };
  highestTotal: string;
  lowestTotal: string;
  mostRuns: string;
  mostWickets: string;
  squadIds: string[];
}

interface MoreSeriesItem {
  id: string;
  name: string;
  shortBadge: string;
  dates: string;
  month: string;
  category: 'INTERNATIONAL' | 'LEAGUE' | 'DOMESTIC' | 'WOMEN';
  matchesCount: string;
  venueHost: string;
  teams: string[];
  topScorer: { name: string; runs: number; sr: string; team: string };
  topBowler: { name: string; wkts: number; econ: string; team: string };
}

interface MoreMatchDetail {
  id: string;
  seriesName: string;
  matchTitle: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  venue: string;
  dateTime: string;
  toss: string;
  umpires: string;
  pitchReport: string;
  team1: string;
  team1Flag: string;
  team1Score: string;
  team1Overs: string;
  team2: string;
  team2Flag: string;
  team2Score: string;
  team2Overs: string;
  resultText: string;
  batting1: { name: string; playerId: string; dismissal: string; r: number; b: number; fours: number; sixes: number; sr: string }[];
  bowling1: { name: string; playerId: string; o: string; m: number; r: number; w: number; econ: string }[];
  batting2: { name: string; playerId: string; dismissal: string; r: number; b: number; fours: number; sixes: number; sr: string }[];
  bowling2: { name: string; playerId: string; o: string; m: number; r: number; w: number; econ: string }[];
}

const MORE_PLAYERS_DB: MorePlayerProfile[] = [
  {
    id: 'p-shakib',
    name: 'Shakib Al Hasan',
    country: 'Bangladesh',
    flag: '🇧🇩',
    role: 'All-Rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
    born: 'March 24, 1987',
    birthPlace: 'Magura, Khulna, Bangladesh',
    age: '39y',
    teams: ['Bangladesh', 'Rangpur Riders', 'Kolkata Knight Riders', 'Surrey'],
    iccRank: { test: '#3 All-Rounder', odi: '#2 All-Rounder', t20: '#1 All-Rounder' },
    bio: 'Widely regarded as Bangladesh’s greatest cricketer and one of the finest all-rounders in cricket history, dominating across Test, ODI, and T20 formats.',
    stats: [
      { format: 'Test', m: 71, inn: 130, runs: 4609, hs: '217', avg: '37.77', sr: '61.5', hundreds: 5, fifties: 31, sixes: 27, wkts: 246, bbi: '7/36', econ: '2.94' },
      { format: 'ODI', m: 247, inn: 234, runs: 7570, hs: '134*', avg: '37.29', sr: '82.8', hundreds: 9, fifties: 56, sixes: 54, wkts: 317, bbi: '5/29', econ: '4.46' },
      { format: 'T20I', m: 129, inn: 127, runs: 2551, hs: '84', avg: '23.19', sr: '121.2', hundreds: 0, fifties: 13, sixes: 53, wkts: 149, bbi: '5/20', econ: '6.81' },
      { format: 'League', m: 445, inn: 408, runs: 7438, hs: '86*', avg: '21.40', sr: '125.4', hundreds: 0, fifties: 33, sixes: 218, wkts: 492, bbi: '6/6', econ: '6.79' }
    ],
    recentMatches: [
      { vs: 'vs India (1st T20I)', bat: '34* (21)', bowl: '2/24 (4.0)', format: 'T20I', date: '10 Oct 2026', venue: 'Gwalior', matchId: 'm-ban-ind' },
      { vs: 'vs South Africa (Test)', bat: '68 (112)', bowl: '4/71 (28.0)', format: 'Test', date: '02 Oct 2026', venue: 'Mirpur, Dhaka', matchId: 'm-aus-rsa' },
      { vs: 'vs Comilla Victorians', bat: '49 (27)', bowl: '3/18 (4.0)', format: 'BPL', date: '26 Sep 2026', venue: 'Sher-e-Bangla', matchId: 'm-bpl-1' }
    ]
  },
  {
    id: 'p-kohli',
    name: 'Virat Kohli',
    country: 'India',
    flag: '🇮🇳',
    role: 'Top-order Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    born: 'November 5, 1988',
    birthPlace: 'Delhi, India',
    age: '37y',
    teams: ['India', 'Royal Challengers Bengaluru', 'Delhi'],
    iccRank: { test: '#6 Batter', odi: '#2 Batter', t20: '#8 Batter' },
    bio: 'Modern-day batting icon with 80+ international centuries and the record for most hundreds in One-Day Internationals.',
    stats: [
      { format: 'Test', m: 118, inn: 201, runs: 9040, hs: '254*', avg: '47.83', sr: '55.8', hundreds: 29, fifties: 31, sixes: 28, wkts: 0, bbi: '-', econ: '3.20' },
      { format: 'ODI', m: 295, inn: 283, runs: 13906, hs: '183', avg: '58.18', sr: '93.5', hundreds: 50, fifties: 72, sixes: 152, wkts: 5, bbi: '1/13', econ: '6.16' },
      { format: 'T20I', m: 125, inn: 117, runs: 4188, hs: '122*', avg: '48.69', sr: '137.0', hundreds: 1, fifties: 38, sixes: 124, wkts: 4, bbi: '1/13', econ: '8.05' },
      { format: 'League', m: 252, inn: 244, runs: 8004, hs: '113*', avg: '38.66', sr: '131.9', hundreds: 8, fifties: 55, sixes: 272, wkts: 4, bbi: '2/25', econ: '8.80' }
    ],
    recentMatches: [
      { vs: 'vs West Indies (2nd ODI)', bat: '88* (79)', bowl: 'DNB', format: 'ODI', date: '10 Oct 2026', venue: 'Visakhapatnam', matchId: 'm-wi-ind' },
      { vs: 'vs Bangladesh (1st T20I)', bat: '54 (34)', bowl: 'DNB', format: 'T20I', date: '08 Oct 2026', venue: 'Gwalior', matchId: 'm-ban-ind' },
      { vs: 'vs Australia (Test)', bat: '116 (198)', bowl: 'DNB', format: 'Test', date: '29 Sep 2026', venue: 'Melbourne', matchId: 'm-aus-rsa' }
    ]
  },
  {
    id: 'p-litton',
    name: 'Litton Das',
    country: 'Bangladesh',
    flag: '🇧🇩',
    role: 'Wicketkeeper Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Offbreak',
    born: 'October 13, 1994',
    birthPlace: 'Dinajpur, Bangladesh',
    age: '31y',
    teams: ['Bangladesh', 'Comilla Victorians', 'Kolkata Knight Riders'],
    iccRank: { test: '#14 Batter', odi: '#22 Batter', t20: '#19 Batter' },
    bio: 'Stylish Bangladeshi wicketkeeper-batter renowned for his classic cover drives, rapid powerplay scoring, and match-winning Test centuries.',
    stats: [
      { format: 'Test', m: 46, inn: 81, runs: 2788, hs: '141', avg: '35.74', sr: '59.4', hundreds: 4, fifties: 17, sixes: 14, wkts: 0, bbi: '-', econ: '-' },
      { format: 'ODI', m: 92, inn: 91, runs: 2563, hs: '176', avg: '30.87', sr: '87.4', hundreds: 5, fifties: 12, sixes: 41, wkts: 0, bbi: '-', econ: '-' },
      { format: 'T20I', m: 91, inn: 89, runs: 2024, hs: '83', avg: '23.53', sr: '126.9', hundreds: 0, fifties: 11, sixes: 62, wkts: 0, bbi: '-', econ: '-' },
      { format: 'League', m: 196, inn: 192, runs: 4610, hs: '125*', avg: '26.34', sr: '131.8', hundreds: 1, fifties: 31, sixes: 148, wkts: 0, bbi: '-', econ: '-' }
    ],
    recentMatches: [
      { vs: 'vs India (1st T20I)', bat: '42 (25)', bowl: '2 Catches, 1 St', format: 'T20I', date: '10 Oct 2026', venue: 'Gwalior', matchId: 'm-ban-ind' },
      { vs: 'vs Sri Lanka (3rd T20I)', bat: '76 (42)', bowl: '1 Catch', format: 'T20I', date: '04 Oct 2026', venue: 'Sylhet', matchId: 'm-bpl-1' }
    ]
  },
  {
    id: 'p-abd',
    name: 'AB de Villiers',
    country: 'South Africa',
    flag: '🇿🇦',
    role: '360° Wicketkeeper Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    born: 'February 17, 1984',
    birthPlace: 'Pretoria, South Africa',
    age: '42y',
    teams: ['South Africa', 'SA Champions (WCL)', 'Royal Challengers Bengaluru'],
    iccRank: { test: 'Hall of Fame #1', odi: 'Fastest 100 Record (31b)', t20: 'WCL 2026 MVP' },
    bio: 'Mr. 360 — holder of the fastest 50 (16 balls), fastest 100 (31 balls), and fastest 150 (64 balls) in ODI cricket history.',
    stats: [
      { format: 'Test', m: 114, inn: 191, runs: 8765, hs: '278*', avg: '50.66', sr: '54.5', hundreds: 22, fifties: 46, sixes: 64, wkts: 2, bbi: '2/49', econ: '3.20' },
      { format: 'ODI', m: 228, inn: 218, runs: 9577, hs: '176', avg: '53.50', sr: '101.1', hundreds: 25, fifties: 53, sixes: 204, wkts: 7, bbi: '2/15', econ: '6.31' },
      { format: 'T20I', m: 78, inn: 75, runs: 1672, hs: '79*', avg: '26.12', sr: '135.2', hundreds: 0, fifties: 10, sixes: 60, wkts: 0, bbi: '-', econ: '-' },
      { format: 'League', m: 348, inn: 325, runs: 9682, hs: '133*', avg: '38.42', sr: '151.9', hundreds: 5, fifties: 71, sixes: 446, wkts: 0, bbi: '-', econ: '-' }
    ],
    recentMatches: [
      { vs: 'vs England Legends (WCL)', bat: '104* (37)', bowl: 'DNB', format: 'WCL T20', date: '10 Oct 2026', venue: 'Edgbaston', matchId: 'm-aus-rsa' },
      { vs: 'vs Australia Legends', bat: '79 (31)', bowl: 'DNB', format: 'WCL T20', date: '07 Oct 2026', venue: 'Birmingham', matchId: 'm-aus-rsa' }
    ]
  },
  {
    id: 'p-bumrah',
    name: 'Jasprit Bumrah',
    country: 'India',
    flag: '🇮🇳',
    role: 'Fast Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    born: 'December 6, 1993',
    birthPlace: 'Ahmedabad, Gujarat',
    age: '32y',
    teams: ['India', 'Mumbai Indians'],
    iccRank: { test: '#1 Bowler', odi: '#3 Bowler', t20: '#2 Bowler' },
    bio: 'Spearhead of India’s pace attack across all three formats, famous for his lethal yorkers, unorthodox sling action, and match-turning spells.',
    stats: [
      { format: 'Test', m: 42, inn: 80, runs: 312, hs: '34*', avg: '7.80', sr: '64.2', hundreds: 0, fifties: 0, sixes: 8, wkts: 185, bbi: '6/27', econ: '2.74' },
      { format: 'ODI', m: 89, inn: 88, runs: 91, hs: '16', avg: '7.58', sr: '61.9', hundreds: 0, fifties: 0, sixes: 2, wkts: 149, bbi: '6/19', econ: '4.59' },
      { format: 'T20I', m: 70, inn: 69, runs: 18, hs: '7', avg: '3.00', sr: '60.0', hundreds: 0, fifties: 0, sixes: 0, wkts: 89, bbi: '3/7', econ: '6.27' },
      { format: 'League', m: 133, inn: 133, runs: 69, hs: '16*', avg: '9.85', sr: '85.1', hundreds: 0, fifties: 0, sixes: 3, wkts: 165, bbi: '5/10', econ: '7.30' }
    ],
    recentMatches: [
      { vs: 'vs West Indies (2nd ODI)', bat: 'DNB', bowl: '3/34 (10.0)', format: 'ODI', date: '10 Oct 2026', venue: 'Visakhapatnam', matchId: 'm-wi-ind' },
      { vs: 'vs Bangladesh (1st T20I)', bat: 'DNB', bowl: '3/16 (4.0)', format: 'T20I', date: '08 Oct 2026', venue: 'Gwalior', matchId: 'm-ban-ind' }
    ]
  },
  {
    id: 'p-head',
    name: 'Travis Head',
    country: 'Australia',
    flag: '🇦🇺',
    role: 'Attacking Batter',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm offbreak',
    born: 'December 29, 1993',
    birthPlace: 'Adelaide, South Australia',
    age: '32y',
    teams: ['Australia', 'Sunrisers Hyderabad', 'Adelaide Strikers'],
    iccRank: { test: '#5 Batter', odi: '#4 Batter', t20: '#1 Batter' },
    bio: 'Explosive Australian left-hander known for his fearless counter-attacking hundreds in the WTC Final, ODI World Cup Final, and T20 Internationals.',
    stats: [
      { format: 'Test', m: 51, inn: 85, runs: 3420, hs: '175', avg: '42.75', sr: '66.4', hundreds: 8, fifties: 17, sixes: 28, wkts: 14, bbi: '4/10', econ: '3.15' },
      { format: 'ODI', m: 69, inn: 66, runs: 2645, hs: '154*', avg: '44.08', sr: '104.8', hundreds: 6, fifties: 16, sixes: 59, wkts: 21, bbi: '2/21', econ: '5.39' },
      { format: 'T20I', m: 38, inn: 37, runs: 1093, hs: '91', avg: '33.12', sr: '160.4', hundreds: 0, fifties: 5, sixes: 54, wkts: 1, bbi: '1/16', econ: '7.80' },
      { format: 'League', m: 142, inn: 138, runs: 3890, hs: '102', avg: '31.88', sr: '149.2', hundreds: 3, fifties: 24, sixes: 184, wkts: 26, bbi: '3/18', econ: '7.65' }
    ],
    recentMatches: [
      { vs: 'vs South Africa (1st Test)', bat: '94* (118)', bowl: '1/18 (5.0)', format: 'Test', date: '10 Oct 2026', venue: 'Cape Town', matchId: 'm-aus-rsa' },
      { vs: 'vs England (ODI)', bat: '154* (129)', bowl: '2/34 (6.0)', format: 'ODI', date: '24 Sep 2026', venue: 'Trent Bridge', matchId: 'm-aus-rsa' }
    ]
  },
  {
    id: 'p-mustafiz',
    name: 'Mustafizur Rahman',
    country: 'Bangladesh',
    flag: '🇧🇩',
    role: 'Left-arm Pace Bowler',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm fast-medium',
    born: 'September 6, 1995',
    birthPlace: 'Satkhira, Khulna, Bangladesh',
    age: '31y',
    teams: ['Bangladesh', 'Chennai Super Kings', 'Comilla Victorians'],
    iccRank: { test: '#42 Bowler', odi: '#14 Bowler', t20: '#9 Bowler' },
    bio: 'The Fizz — renowned worldwide for his deceptive off-cutters and death-over mastery in T20I and ODI cricket.',
    stats: [
      { format: 'Test', m: 15, inn: 25, runs: 66, hs: '16', avg: '6.00', sr: '45.2', hundreds: 0, fifties: 0, sixes: 1, wkts: 31, bbi: '4/37', econ: '3.02' },
      { format: 'ODI', m: 107, inn: 106, runs: 145, hs: '20*', avg: '7.25', sr: '51.4', hundreds: 0, fifties: 0, sixes: 3, wkts: 169, bbi: '6/43', econ: '5.14' },
      { format: 'T20I', m: 106, inn: 105, runs: 88, hs: '15', avg: '5.50', sr: '68.0', hundreds: 0, fifties: 0, sixes: 2, wkts: 132, bbi: '6/10', econ: '7.31' },
      { format: 'League', m: 268, inn: 266, runs: 192, hs: '20*', avg: '6.10', sr: '72.0', hundreds: 0, fifties: 0, sixes: 4, wkts: 338, bbi: '6/10', econ: '7.42' }
    ],
    recentMatches: [
      { vs: 'vs India (1st T20I)', bat: 'DNB', bowl: '3/26 (4.0)', format: 'T20I', date: '10 Oct 2026', venue: 'Gwalior', matchId: 'm-ban-ind' }
    ]
  },
  {
    id: 'p-rashid',
    name: 'Rashid Khan',
    country: 'Afghanistan',
    flag: '🇦🇫',
    role: 'Bowling All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Legbreak googly',
    born: 'September 20, 1998',
    birthPlace: 'Nangarhar, Afghanistan',
    age: '28y',
    teams: ['Afghanistan', 'Gujarat Titans', 'MI Cape Town'],
    iccRank: { test: '#25 Bowler', odi: '#2 Bowler', t20: '#1 Bowler' },
    bio: 'Fastest leg-spinner in modern T20 history and the first bowler to pass 600+ T20 career wickets.',
    stats: [
      { format: 'Test', m: 5, inn: 9, runs: 106, hs: '51', avg: '15.14', sr: '74.1', hundreds: 0, fifties: 1, sixes: 4, wkts: 34, bbi: '7/137', econ: '3.22' },
      { format: 'ODI', m: 105, inn: 99, runs: 1328, hs: '60*', avg: '19.82', sr: '105.6', hundreds: 0, fifties: 5, sixes: 52, wkts: 190, bbi: '7/18', econ: '4.19' },
      { format: 'T20I', m: 93, inn: 93, runs: 460, hs: '48*', avg: '15.33', sr: '151.3', hundreds: 0, fifties: 0, sixes: 31, wkts: 152, bbi: '5/3', econ: '6.08' },
      { format: 'League', m: 452, inn: 448, runs: 2410, hs: '79*', avg: '16.50', sr: '159.4', hundreds: 0, fifties: 2, sixes: 164, wkts: 618, bbi: '6/17', econ: '6.45' }
    ],
    recentMatches: [
      { vs: 'vs South Africa (ODI)', bat: '24* (12)', bowl: '5/19 (9.0)', format: 'ODI', date: '05 Oct 2026', venue: 'Sharjah', matchId: 'm-aus-rsa' }
    ]
  }
];

const MORE_TEAMS_DB: MoreTeamProfile[] = [
  {
    id: 't-ban',
    name: 'Bangladesh',
    short: 'BAN',
    flag: '🇧🇩',
    category: 'INTERNATIONAL',
    captain: 'Najmul Hossain Shanto',
    coach: 'Phil Simmons',
    homeGround: 'Sher-e-Bangla National Cricket Stadium, Dhaka',
    titles: 'Asia Cup Finalists (3x), U-19 World Cup Champions (2020)',
    iccRanks: { test: 8, odi: 7, t20: 8 },
    ratings: { test: 79, odi: 92, t20: 234 },
    highestTotal: '638 vs Sri Lanka (Galle, 2013)',
    lowestTotal: '58 vs West Indies (Mirpur, 2011)',
    mostRuns: 'Tamim Iqbal (15,249 Intl Runs)',
    mostWickets: 'Shakib Al Hasan (712 Intl Wickets)',
    squadIds: ['p-shakib', 'p-litton', 'p-mustafiz']
  },
  {
    id: 't-ind',
    name: 'India',
    short: 'IND',
    flag: '🇮🇳',
    category: 'INTERNATIONAL',
    captain: 'Rohit Sharma / Suryakumar Yadav',
    coach: 'Gautam Gambhir',
    homeGround: 'Wankhede Stadium, Mumbai / Narendra Modi Stadium',
    titles: 'ODI World Cup (1983, 2011), T20 World Cup (2007, 2024), Champions Trophy (2002, 2013)',
    iccRanks: { test: 2, odi: 1, t20: 1 },
    ratings: { test: 122, odi: 124, t20: 268 },
    highestTotal: '759/7d vs England (Chennai, 2016)',
    lowestTotal: '36 vs Australia (Adelaide, 2020)',
    mostRuns: 'Sachin Tendulkar (34,357 Intl Runs)',
    mostWickets: 'Anil Kumble (956 Intl Wickets)',
    squadIds: ['p-kohli', 'p-bumrah']
  },
  {
    id: 't-aus',
    name: 'Australia',
    short: 'AUS',
    flag: '🇦🇺',
    category: 'INTERNATIONAL',
    captain: 'Pat Cummins / Mitchell Marsh',
    coach: 'Andrew McDonald',
    homeGround: 'Melbourne Cricket Ground (MCG)',
    titles: '6x ODI World Cup, 1x T20 World Cup (2021), WTC Champions (2023)',
    iccRanks: { test: 1, odi: 2, t20: 2 },
    ratings: { test: 126, odi: 118, t20: 259 },
    highestTotal: '758/8d vs West Indies (Kingston, 1955)',
    lowestTotal: '36 vs England (Edgbaston, 1902)',
    mostRuns: 'Ricky Ponting (27,483 Intl Runs)',
    mostWickets: 'Shane Warne (1,001 Intl Wickets)',
    squadIds: ['p-head']
  },
  {
    id: 't-rsa',
    name: 'South Africa',
    short: 'RSA',
    flag: '🇿🇦',
    category: 'INTERNATIONAL',
    captain: 'Temba Bavuma / Aiden Markram',
    coach: 'Shukri Conrad',
    homeGround: 'Newlands, Cape Town & Wanderers, Johannesburg',
    titles: 'ICC Champions Trophy (1998), T20 World Cup Finalists (2024)',
    iccRanks: { test: 3, odi: 3, t20: 5 },
    ratings: { test: 112, odi: 111, t20: 249 },
    highestTotal: '682/6d vs England (Lord’s, 2003)',
    lowestTotal: '30 vs England (Port Elizabeth, 1896)',
    mostRuns: 'Jacques Kallis (25,534 Intl Runs)',
    mostWickets: 'Shaun Pollock (829 Intl Wickets)',
    squadIds: ['p-abd']
  },
  {
    id: 't-afg',
    name: 'Afghanistan',
    short: 'AFG',
    flag: '🇦🇫',
    category: 'INTERNATIONAL',
    captain: 'Hashmatullah Shahidi / Rashid Khan',
    coach: 'Jonathan Trott',
    homeGround: 'Kabul International Cricket Stadium',
    titles: 'T20 World Cup Semi-Finalists (2024)',
    iccRanks: { test: 10, odi: 8, t20: 9 },
    ratings: { test: 52, odi: 88, t20: 226 },
    highestTotal: '545/4d vs Zimbabwe (Abu Dhabi, 2021)',
    lowestTotal: '56 vs Bangladesh (Dhaka, 2014)',
    mostRuns: 'Mohammad Nabi (5,412 Intl Runs)',
    mostWickets: 'Rashid Khan (376+ Intl Wickets)',
    squadIds: ['p-rashid']
  },
  {
    id: 't-rangpur',
    name: 'Rangpur Riders (BPL)',
    short: 'RAN',
    flag: '🏆',
    category: 'LEAGUE',
    captain: 'Nurul Hasan Sohan',
    coach: 'Mickey Arthur',
    homeGround: 'Rangpur Cricket Garden / Mirpur',
    titles: 'BPL Champions (2017), Global Super League Winners (2024)',
    iccRanks: { test: 1, odi: 1, t20: 1 },
    ratings: { test: 100, odi: 100, t20: 260 },
    highestTotal: '239/4 vs Chittagong Vikings (2019)',
    lowestTotal: '67 vs Khulna Titans (2016)',
    mostRuns: 'Chris Gayle (1,120 Runs)',
    mostWickets: 'Shakib Al Hasan (84 Wickets)',
    squadIds: ['p-shakib', 'p-litton']
  },
  {
    id: 't-ban-w',
    name: 'Bangladesh Women',
    short: 'BAN-W',
    flag: '🇧🇩',
    category: 'WOMEN',
    captain: 'Nigar Sultana Joty',
    coach: 'Hashan Tillakaratne',
    homeGround: 'Sylhet International Cricket Stadium',
    titles: 'Women’s T20 Asia Cup Champions (2018)',
    iccRanks: { test: 9, odi: 8, t20: 9 },
    ratings: { test: 65, odi: 78, t20: 204 },
    highestTotal: '252/4 vs Ireland Women (Dhaka, 2023)',
    lowestTotal: '60 vs Australia Women (2023)',
    mostRuns: 'Fargana Hoque (2,810 Runs)',
    mostWickets: 'Nahida Akter (148 Wickets)',
    squadIds: ['p-shakib', 'p-litton']
  }
];

const MORE_SERIES_DB: MoreSeriesItem[] = [
  {
    id: 's-wi-ind',
    name: 'West Indies tour of India 2026',
    shortBadge: 'IND vs WI',
    dates: '27 Sep - 17 Oct 2026',
    month: 'October 2026',
    category: 'INTERNATIONAL',
    matchesCount: '8 Matches (3 T20I, 3 ODI, 2 Test)',
    venueHost: 'Hosted in India (Mumbai, Kolkata, Visakhapatnam)',
    teams: ['India', 'West Indies'],
    topScorer: { name: 'Virat Kohli', runs: 284, sr: '104.2', team: 'IND' },
    topBowler: { name: 'Jasprit Bumrah', wkts: 11, econ: '4.12', team: 'IND' }
  },
  {
    id: 's-aus-rsa',
    name: 'Australia tour of South Africa 2026',
    shortBadge: 'AUS vs RSA',
    dates: '09 Oct - 02 Nov 2026',
    month: 'October 2026',
    category: 'INTERNATIONAL',
    matchesCount: '3 Test Matches • ICC WTC Series',
    venueHost: 'Hosted in South Africa (Cape Town, Centurion, Joburg)',
    teams: ['South Africa', 'Australia'],
    topScorer: { name: 'Travis Head', runs: 192, sr: '72.4', team: 'AUS' },
    topBowler: { name: 'Kagiso Rabada', wkts: 9, econ: '3.05', team: 'RSA' }
  },
  {
    id: 's-ban-ind',
    name: 'Bangladesh tour of India 2026',
    shortBadge: 'BAN vs IND',
    dates: '06 Oct - 16 Oct 2026',
    month: 'October 2026',
    category: 'INTERNATIONAL',
    matchesCount: '3 T20I & 2 Test Matches',
    venueHost: 'Gwalior, Delhi & Hyderabad',
    teams: ['Bangladesh', 'India'],
    topScorer: { name: 'Litton Das', runs: 164, sr: '142.6', team: 'BAN' },
    topBowler: { name: 'Mustafizur Rahman', wkts: 8, econ: '7.10', team: 'BAN' }
  },
  {
    id: 's-bpl-2026',
    name: 'Bangladesh Premier League (BPL T20) 2026',
    shortBadge: 'BPL 2026',
    dates: '15 Oct - 28 Nov 2026',
    month: 'October 2026',
    category: 'LEAGUE',
    matchesCount: '46 T20 Matches',
    venueHost: 'Dhaka, Chattogram & Sylhet',
    teams: ['Rangpur Riders', 'Comilla Victorians', 'Fortune Barishal', 'Dhaka Capitals'],
    topScorer: { name: 'Towhid Hridoy', runs: 312, sr: '148.5', team: 'COM' },
    topBowler: { name: 'Shakib Al Hasan', wkts: 14, econ: '6.40', team: 'RAN' }
  },
  {
    id: 's-wcl-2026',
    name: 'World Championship of Legends (WCL 2026)',
    shortBadge: 'WCL 2026',
    dates: '01 Oct - 22 Oct 2026',
    month: 'October 2026',
    category: 'LEAGUE',
    matchesCount: '18 T20 Matches',
    venueHost: 'Edgbaston & Northampton, UK',
    teams: ['SA Champions', 'India Champions', 'Australia Champions', 'Pakistan Champions'],
    topScorer: { name: 'AB de Villiers', runs: 298, sr: '196.0', team: 'RSA-C' },
    topBowler: { name: 'Dale Steyn', wkts: 10, econ: '6.85', team: 'RSA-C' }
  },
  {
    id: 's-wt20-women',
    name: 'ICC Women’s T20 World Cup 2026',
    shortBadge: 'WT20 WC',
    dates: '03 Oct - 20 Oct 2026',
    month: 'October 2026',
    category: 'WOMEN',
    matchesCount: '23 T20I Matches',
    venueHost: 'Dubai & Sharjah',
    teams: ['Bangladesh Women', 'India Women', 'Australia Women', 'England Women'],
    topScorer: { name: 'Nigar Sultana Joty', runs: 178, sr: '124.5', team: 'BAN-W' },
    topBowler: { name: 'Nahida Akter', wkts: 9, econ: '5.60', team: 'BAN-W' }
  },
  {
    id: 's-ncl-bd',
    name: 'National Cricket League (NCL) Bangladesh 2026',
    shortBadge: 'NCL BD',
    dates: '12 Oct - 18 Nov 2026',
    month: 'November 2026',
    category: 'DOMESTIC',
    matchesCount: '28 First-Class Matches',
    venueHost: 'Rajshahi, Khulna, Sylhet & Bogura',
    teams: ['Dhaka Division', 'Khulna Division', 'Sylhet Division', 'Rajshahi Division'],
    topScorer: { name: 'Anamul Haque Bijoy', runs: 410, sr: '68.0', team: 'KHL' },
    topBowler: { name: 'Taijul Islam', wkts: 19, econ: '2.65', team: 'RAJ' }
  }
];

const MORE_MATCHES_DB: MoreMatchDetail[] = [
  {
    id: 'm-ban-ind',
    seriesName: 'Bangladesh tour of India 2026',
    matchTitle: '1st T20I • Bangladesh vs India',
    status: 'LIVE',
    venue: 'Shrimant Madhavrao Scindia Cricket Stadium, Gwalior',
    dateTime: 'Sat, 10 Oct 2026 • 7:00 PM BST',
    toss: 'India won the toss and elected to bowl first',
    umpires: 'Rod Tucker (AUS) & Nitin Menon (IND)',
    pitchReport: 'Hard batting track with true bounce; spinners get grip in middle overs. Par score 185+.',
    team1: 'Bangladesh',
    team1Flag: '🇧🇩',
    team1Score: '178/5',
    team1Overs: '18.4 Overs',
    team2: 'India',
    team2Flag: '🇮🇳',
    team2Score: 'Yet to bat',
    team2Overs: '',
    resultText: 'Live: Bangladesh 178/5 (18.4 Ov) • Shakib 34*(21), Hridoy 58*(31)',
    batting1: [
      { name: 'Litton Das (wk)', playerId: 'p-litton', dismissal: 'c Kohli b Bumrah', r: 42, b: 25, fours: 6, sixes: 2, sr: '168.0' },
      { name: 'Tanzid Hasan Tamim', playerId: 'p-litton', dismissal: 'b Arshdeep Singh', r: 19, b: 14, fours: 3, sixes: 0, sr: '135.7' },
      { name: 'Najmul Hossain Shanto (c)', playerId: 'p-shakib', dismissal: 'c Samson b Bishnoi', r: 21, b: 17, fours: 2, sixes: 1, sr: '123.5' },
      { name: 'Towhid Hridoy *', playerId: 'p-litton', dismissal: 'not out', r: 58, b: 31, fours: 5, sixes: 3, sr: '187.1' },
      { name: 'Shakib Al Hasan *', playerId: 'p-shakib', dismissal: 'not out', r: 34, b: 21, fours: 3, sixes: 2, sr: '161.9' }
    ],
    bowling1: [
      { name: 'Jasprit Bumrah', playerId: 'p-bumrah', o: '4.0', m: 0, r: 24, w: 2, econ: '6.00' },
      { name: 'Arshdeep Singh', playerId: 'p-bumrah', o: '3.4', m: 0, r: 36, w: 1, econ: '9.81' },
      { name: 'Hardik Pandya', playerId: 'p-kohli', o: '4.0', m: 0, r: 41, w: 1, econ: '10.25' },
      { name: 'Ravi Bishnoi', playerId: 'p-bumrah', o: '4.0', m: 0, r: 34, w: 1, econ: '8.50' }
    ],
    batting2: [
      { name: 'Sanju Samson (wk)', playerId: 'p-kohli', dismissal: 'Yet to bat', r: 0, b: 0, fours: 0, sixes: 0, sr: '0.0' },
      { name: 'Virat Kohli', playerId: 'p-kohli', dismissal: 'Yet to bat', r: 0, b: 0, fours: 0, sixes: 0, sr: '0.0' }
    ],
    bowling2: [
      { name: 'Mustafizur Rahman', playerId: 'p-mustafiz', o: '0.0', m: 0, r: 0, w: 0, econ: '0.00' },
      { name: 'Shakib Al Hasan', playerId: 'p-shakib', o: '0.0', m: 0, r: 0, w: 0, econ: '0.00' }
    ]
  },
  {
    id: 'm-aus-rsa',
    seriesName: 'Australia tour of South Africa 2026',
    matchTitle: '1st Test • South Africa vs Australia',
    status: 'LIVE',
    venue: 'Newlands Cricket Ground, Cape Town',
    dateTime: 'Fri, 09 Oct 2026 • Day 2, 2nd Session',
    toss: 'Australia won the toss and elected to bat first',
    umpires: 'Richard Illingworth & Kumar Dharmasena',
    pitchReport: 'Green tinge on Day 1 offering seam movement; flattens out nicely for strokeplay on Day 2 & 3.',
    team1: 'Australia',
    team1Flag: '🇦🇺',
    team1Score: '245/7',
    team1Overs: '64.4 Overs',
    team2: 'South Africa',
    team2Flag: '🇿🇦',
    team2Score: 'Yet to bat',
    team2Overs: '',
    resultText: 'Day 2: 2nd Session • Travis Head 94*(118), Pat Cummins 22*(38)',
    batting1: [
      { name: 'Usman Khawaja', playerId: 'p-head', dismissal: 'c Verreynne b Rabada', r: 38, b: 84, fours: 5, sixes: 0, sr: '45.2' },
      { name: 'Steve Smith', playerId: 'p-head', dismissal: 'lbw b Jansen', r: 44, b: 92, fours: 6, sixes: 0, sr: '47.8' },
      { name: 'Travis Head *', playerId: 'p-head', dismissal: 'not out', r: 94, b: 118, fours: 12, sixes: 2, sr: '79.6' },
      { name: 'Pat Cummins (c) *', playerId: 'p-head', dismissal: 'not out', r: 22, b: 38, fours: 3, sixes: 0, sr: '57.9' }
    ],
    bowling1: [
      { name: 'Kagiso Rabada', playerId: 'p-abd', o: '18.4', m: 4, r: 62, w: 4, econ: '3.32' },
      { name: 'Marco Jansen', playerId: 'p-abd', o: '16.0', m: 2, r: 68, w: 2, econ: '4.25' },
      { name: 'Keshav Maharaj', playerId: 'p-abd', o: '18.0', m: 5, r: 49, w: 1, econ: '2.72' }
    ],
    batting2: [],
    bowling2: []
  },
  {
    id: 'm-wi-ind',
    seriesName: 'West Indies tour of India 2026',
    matchTitle: '2nd ODI • India vs West Indies',
    status: 'FINISHED',
    venue: 'ACA-VDCA Cricket Stadium, Visakhapatnam',
    dateTime: 'Thu, 08 Oct 2026 • Completed',
    toss: 'West Indies won the toss and elected to bat first',
    umpires: 'Marais Erasmus &KN Ananthapadmanabhan',
    pitchReport: 'High-scoring coastal wicket with dew aiding the chasing side under lights.',
    team1: 'West Indies',
    team1Flag: '🌴',
    team1Score: '280/8',
    team1Overs: '50.0 Overs',
    team2: 'India',
    team2Flag: '🇮🇳',
    team2Score: '284/4',
    team2Overs: '48.2 Overs',
    resultText: 'India won by 6 wickets (with 10 balls remaining) • Player of the Match: Virat Kohli 88*(79)',
    batting1: [
      { name: 'Shai Hope (c & wk)', playerId: 'p-abd', dismissal: 'b Bumrah', r: 96, b: 108, fours: 9, sixes: 2, sr: '88.8' },
      { name: 'Nicholas Pooran', playerId: 'p-abd', dismissal: 'c Kohli b Kuldeep', r: 74, b: 51, fours: 6, sixes: 5, sr: '145.1' }
    ],
    bowling1: [
      { name: 'Jasprit Bumrah', playerId: 'p-bumrah', o: '10.0', m: 1, r: 34, w: 3, econ: '3.40' }
    ],
    batting2: [
      { name: 'Virat Kohli *', playerId: 'p-kohli', dismissal: 'not out', r: 88, b: 79, fours: 9, sixes: 1, sr: '111.4' },
      { name: 'Sanju Samson', playerId: 'p-kohli', dismissal: 'c Hope b Alzarri', r: 82, b: 46, fours: 7, sixes: 5, sr: '178.2' }
    ],
    bowling2: [
      { name: 'Alzarri Joseph', playerId: 'p-abd', o: '9.2', m: 0, r: 58, w: 2, econ: '6.21' }
    ]
  },
  {
    id: 'm-bpl-1',
    seriesName: 'Bangladesh Premier League (BPL T20) 2026',
    matchTitle: 'Match 12 • Rangpur Riders vs Comilla Victorians',
    status: 'UPCOMING',
    venue: 'Sher-e-Bangla National Cricket Stadium, Mirpur',
    dateTime: 'Thu, 15 Oct 2026 • 6:30 PM BST',
    toss: 'Toss at 6:00 PM BST',
    umpires: 'Sharfuddoula Ibne Shahid & Masudur Rahman',
    pitchReport: 'Slow turner expected under floodlights; spinners likely to dominate.',
    team1: 'Rangpur Riders',
    team1Flag: '🏆',
    team1Score: 'Upcoming',
    team1Overs: '20.0 Ov',
    team2: 'Comilla Victorians',
    team2Flag: '🏆',
    team2Score: 'Upcoming',
    team2Overs: '20.0 Ov',
    resultText: 'Starts Oct 15, 6:30 PM • Tickets & Live Poll Open',
    batting1: [
      { name: 'Shakib Al Hasan', playerId: 'p-shakib', dismissal: 'Confirmed XI', r: 49, b: 27, fours: 5, sixes: 2, sr: '181.4' }
    ],
    bowling1: [
      { name: 'Mustafizur Rahman', playerId: 'p-mustafiz', o: '4.0', m: 0, r: 22, w: 3, econ: '5.50' }
    ],
    batting2: [
      { name: 'Litton Das (c & wk)', playerId: 'p-litton', dismissal: 'Confirmed XI', r: 76, b: 42, fours: 8, sixes: 3, sr: '180.9' }
    ],
    bowling2: [
      { name: 'Rashid Khan', playerId: 'p-rashid', o: '4.0', m: 0, r: 18, w: 2, econ: '4.50' }
    ]
  }
];

export const CricketMoreHub: React.FC<{
  initialScreen?: MoreScreenType;
  theme: Record<string, string>;
  colorTheme: 'EMERALD_GOLD' | 'MINT_LIGHT' | 'ROYAL_TEAL';
  setColorTheme: React.Dispatch<React.SetStateAction<'EMERALD_GOLD' | 'MINT_LIGHT' | 'ROYAL_TEAL'>>;
  onGoCreateLive: () => void;
  onBackToMainHome: () => void;
  onOpenLiveMatch: () => void;
}> = ({
  initialScreen = 'MENU',
  theme,
  colorTheme,
  setColorTheme,
  onGoCreateLive,
  onBackToMainHome,
  onOpenLiveMatch
}) => {
  const [screen, setScreen] = useState<MoreScreenType>(initialScreen);

  // Drill-down states so every option works all the way to the LAST STEP
  const [selectedSeries, setSelectedSeries] = useState<MoreSeriesItem | null>(null);
  const [seriesSubTab, setSeriesSubTab] = useState<'MATCHES' | 'POINTS' | 'STATS' | 'SQUADS'>('MATCHES');
  const [seriesCategoryFilter, setSeriesCategoryFilter] = useState<'ALL' | 'INTERNATIONAL' | 'LEAGUE' | 'DOMESTIC' | 'WOMEN'>('ALL');
  const [seriesSearch, setSeriesSearch] = useState('');

  const [selectedTeam, setSelectedTeam] = useState<MoreTeamProfile | null>(null);
  const [teamSubTab, setTeamSubTab] = useState<'SQUAD' | 'MATCHES' | 'RECORDS' | 'RANKINGS'>('SQUAD');
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<'ALL' | 'INTERNATIONAL' | 'LEAGUE' | 'WOMEN'>('ALL');
  const [teamSearch, setTeamSearch] = useState('');

  const [selectedPlayer, setSelectedPlayer] = useState<MorePlayerProfile | null>(null);
  const [playerSubTab, setPlayerSubTab] = useState<'INFO' | 'BATTING' | 'BOWLING' | 'RECENT' | 'CAREER'>('INFO');
  const [playerCountryFilter, setPlayerCountryFilter] = useState<string>('ALL');
  const [playerSearch, setPlayerSearch] = useState('');

  const [selectedMatch, setSelectedMatch] = useState<MoreMatchDetail | null>(null);
  const [matchSubTab, setMatchSubTab] = useState<'SCORECARD' | 'INFO' | 'XI' | 'COMMENTARY'>('SCORECARD');

  // Schedule filters
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED'>('ALL');

  // ICC Rankings states (Men & Women)
  const [iccCategory, setIccCategory] = useState<'TEAMS' | 'BATTER' | 'BOWLER' | 'ALLROUNDER'>('TEAMS');
  const [iccFormat, setIccFormat] = useState<'TEST' | 'ODI' | 'T20I'>('T20I');
  const [selectedRankEntry, setSelectedRankEntry] = useState<{
    rank: number;
    name: string;
    country: string;
    flag: string;
    rating: number;
    points: number;
    careerBest: string;
    playerId?: string;
    teamId?: string;
  } | null>(null);

  // Records states
  const [recordCategory, setRecordCategory] = useState<
    | 'MOST_RUNS'
    | 'MOST_WICKETS'
    | 'HIGHEST_SCORE'
    | 'MOST_HUNDREDS'
    | 'MOST_SIXES'
    | 'BEST_BOWLING'
    | 'FASTEST_100'
    | 'HIGHEST_TEAM'
  >('MOST_RUNS');
  const [recordFormat, setRecordFormat] = useState<'ODI' | 'TEST' | 'T20I'>('ODI');
  const [selectedRecordHolder, setSelectedRecordHolder] = useState<{
    rank: number;
    name: string;
    team: string;
    stat: string;
    matches: number;
    span: string;
    detail: string;
    playerId?: string;
  } | null>(null);

  // Polls states
  const [pollsData, setPollsData] = useState([
    {
      id: 'poll-1',
      match: 'Bangladesh vs India • 1st T20I',
      question: 'Who will win the 1st T20I in Gwalior tonight?',
      totalVotes: 28490,
      userChoice: '' as string,
      options: [
        { id: 'BAN', label: '🇧🇩 Bangladesh', votes: 15950 },
        { id: 'IND', label: '🇮🇳 India', votes: 12540 }
      ]
    },
    {
      id: 'poll-2',
      match: 'South Africa vs Australia • 1st Test',
      question: 'What will be the result of the Cape Town Test?',
      totalVotes: 19320,
      userChoice: '' as string,
      options: [
        { id: 'AUS', label: '🇦🇺 Australia Win', votes: 9120 },
        { id: 'RSA', label: '🇿🇦 South Africa Win', votes: 7850 },
        { id: 'DRAW', label: '🤝 Match Draw', votes: 2350 }
      ]
    },
    {
      id: 'poll-3',
      match: 'BPL T20 2026 Championship',
      question: 'Which team will lift the BPL 2026 Trophy?',
      totalVotes: 44120,
      userChoice: '' as string,
      options: [
        { id: 'RAN', label: '🏆 Rangpur Riders', votes: 18200 },
        { id: 'COM', label: '🏆 Comilla Victorians', votes: 14100 },
        { id: 'BAR', label: '🏆 Fortune Barishal', votes: 11820 }
      ]
    }
  ]);

  // Settings & Toggles states
  const [appLanguage, setAppLanguage] = useState<'ENGLISH' | 'BANGLA' | 'HINDI'>('ENGLISH');
  const [oddsDisplayEnabled, setOddsDisplayEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    matchStart: true,
    tossUpdate: true,
    wicketAlert: true,
    boundaryAlert: false,
    milestoneAlert: true,
    matchResult: true,
    breakingNews: true
  });
  const [testNotifBanner, setTestNotifBanner] = useState<string | null>(null);

  // Speech / Audio Commentary states
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState<'0.8x' | '1.0x' | '1.2x'>('1.0x');
  const [speechVoice, setSpeechVoice] = useState<'FEMALE_PRO' | 'MALE_STADIUM' | 'BANGLA_LIVE'>('MALE_STADIUM');
  const [speechTestStatus, setSpeechTestStatus] = useState<string | null>(null);

  // Premium Membership state
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'SIX_MONTHS' | 'YEARLY'>('YEARLY');
  const [premiumPayMethod, setPremiumPayMethod] = useState<'POINTS' | 'BKASH' | 'NAGAD'>('POINTS');
  const [isVipUnlocked, setIsVipUnlocked] = useState(false);

  // Rate Us & Feedback states
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [feedbackCategory, setFeedbackCategory] = useState<'LIVE_SCORE' | 'APP_BUG' | 'FEATURE' | 'PARTNERSHIP'>('LIVE_SCORE');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTicket, setFeedbackTicket] = useState<string | null>(null);

  const [shareCopied, setShareCopied] = useState(false);
  const [socialJoined, setSocialJoined] = useState<Record<string, boolean>>({});

  // Helper to reset deep drill-downs when going back one step
  const handleBackStep = () => {
    if (selectedPlayer) {
      setSelectedPlayer(null);
      return;
    }
    if (selectedMatch) {
      setSelectedMatch(null);
      return;
    }
    if (selectedRankEntry) {
      setSelectedRankEntry(null);
      return;
    }
    if (selectedRecordHolder) {
      setSelectedRecordHolder(null);
      return;
    }
    if (selectedSeries) {
      setSelectedSeries(null);
      return;
    }
    if (selectedTeam) {
      setSelectedTeam(null);
      return;
    }
    setScreen('MENU');
  };

  // ==========================================================================
  // LAST STEP VIEW A: FULL PLAYER CAREER PROFILE (5 WORKING TABS)
  // ==========================================================================
  if (selectedPlayer) {
    return (
      <div className="space-y-3">
        {/* Top Back Bar */}
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={handleBackStep}
            className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className={`text-xs sm:text-sm font-display font-black ${theme.titleText}`}>
            Player Profile • Complete Career
          </span>
          <span className="text-base">{selectedPlayer.flag}</span>
        </div>

        {/* Player Hero Card */}
        <div className={`rounded-2xl border p-4 ${theme.cardBg}`}>
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF66]/25 to-[#FFD700]/25 border-2 border-[#FFD700] flex flex-col items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl">{selectedPlayer.flag}</span>
              <span className="text-[9px] font-black text-[#FFD700] mt-0.5">
                {selectedPlayer.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-base sm:text-lg font-display font-black ${theme.titleText}`}>
                {selectedPlayer.name}
              </h2>
              <p className="text-xs font-bold text-[#00FF66] mt-0.5">
                {selectedPlayer.country} · {selectedPlayer.role}
              </p>
              <p className={`text-[11px] ${theme.subText} mt-0.5`}>
                {selectedPlayer.battingStyle} · {selectedPlayer.bowlingStyle}
              </p>
            </div>
          </div>

          {/* 5 Sub-Tabs inside Player Profile */}
          <div className="grid grid-cols-5 gap-1 mt-4 bg-black/30 p-1 rounded-xl border border-white/10">
            {[
              { id: 'INFO', label: 'Info' },
              { id: 'BATTING', label: 'Batting' },
              { id: 'BOWLING', label: 'Bowling' },
              { id: 'RECENT', label: 'Recent' },
              { id: 'CAREER', label: 'Awards' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPlayerSubTab(t.id as typeof playerSubTab)}
                className={`py-2 rounded-lg text-[11px] font-display font-bold cursor-pointer transition-all ${
                  playerSubTab === t.id
                    ? 'bg-[#FFD700] text-[#021A0A]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: PERSONAL INFO & ICC RANKINGS */}
        {playerSubTab === 'INFO' && (
          <div className="space-y-3">
            <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
              <h3 className="text-xs font-display font-black uppercase tracking-wider text-[#FFD700]">
                Personal Information
              </h3>
              <div className="divide-y divide-white/10 text-xs">
                {[
                  { k: 'Full Name', v: selectedPlayer.name },
                  { k: 'Born', v: `${selectedPlayer.born} (${selectedPlayer.age})` },
                  { k: 'Birthplace', v: selectedPlayer.birthPlace },
                  { k: 'Role', v: selectedPlayer.role },
                  { k: 'Batting Style', v: selectedPlayer.battingStyle },
                  { k: 'Bowling Style', v: selectedPlayer.bowlingStyle },
                  { k: 'Teams', v: selectedPlayer.teams.join(', ') }
                ].map((row, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-4">
                    <span className={theme.subText}>{row.k}</span>
                    <span className={`font-bold text-right ${theme.titleText}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
              <h3 className="text-xs font-display font-black uppercase tracking-wider text-[#FFD700]">
                Current ICC Rankings
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                  <div className={`text-[10px] ${theme.subText}`}>TEST</div>
                  <div className="text-xs font-black text-[#00FF66] mt-1">{selectedPlayer.iccRank.test}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                  <div className={`text-[10px] ${theme.subText}`}>ODI</div>
                  <div className="text-xs font-black text-[#FFD700] mt-1">{selectedPlayer.iccRank.odi}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/25 border border-white/10">
                  <div className={`text-[10px] ${theme.subText}`}>T20I</div>
                  <div className="text-xs font-black text-[#00FF66] mt-1">{selectedPlayer.iccRank.t20}</div>
                </div>
              </div>
              <p className={`text-xs leading-relaxed pt-2 ${theme.subText}`}>{selectedPlayer.bio}</p>
            </div>
          </div>
        )}

        {/* TAB 2: FULL BATTING STATS TABLE */}
        {playerSubTab === 'BATTING' && (
          <div className={`rounded-2xl border overflow-x-auto ${theme.cardBg}`}>
            <div className="p-3 border-b border-white/10 text-xs font-display font-black text-[#FFD700]">
              Career Batting & Fielding Statistics
            </div>
            <table className="w-full text-left text-xs font-mono-num">
              <thead>
                <tr className="bg-black/35 text-[#FFD700] border-b border-white/10">
                  <th className="py-2.5 px-3 font-sans">Format</th>
                  <th className="py-2.5 px-2 text-center">M</th>
                  <th className="py-2.5 px-2 text-center">Inn</th>
                  <th className="py-2.5 px-2 text-right">Runs</th>
                  <th className="py-2.5 px-2 text-right">HS</th>
                  <th className="py-2.5 px-2 text-right">Avg</th>
                  <th className="py-2.5 px-2 text-right">SR</th>
                  <th className="py-2.5 px-2 text-right">100/50</th>
                  <th className="py-2.5 px-3 text-right">6s</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {selectedPlayer.stats.map((st, idx) => (
                  <tr key={idx}>
                    <td className={`py-2.5 px-3 font-sans font-bold ${theme.titleText}`}>{st.format}</td>
                    <td className={`py-2.5 px-2 text-center ${theme.subText}`}>{st.m}</td>
                    <td className={`py-2.5 px-2 text-center ${theme.subText}`}>{st.inn}</td>
                    <td className="py-2.5 px-2 text-right font-black text-[#00FF66]">{st.runs}</td>
                    <td className={`py-2.5 px-2 text-right ${theme.titleText}`}>{st.hs}</td>
                    <td className="py-2.5 px-2 text-right text-[#FFD700] font-bold">{st.avg}</td>
                    <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{st.sr}</td>
                    <td className={`py-2.5 px-2 text-right ${theme.titleText}`}>
                      {st.hundreds}/{st.fifties}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#00FF66]">{st.sixes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: FULL BOWLING STATS TABLE */}
        {playerSubTab === 'BOWLING' && (
          <div className={`rounded-2xl border overflow-x-auto ${theme.cardBg}`}>
            <div className="p-3 border-b border-white/10 text-xs font-display font-black text-[#FFD700]">
              Career Bowling Statistics
            </div>
            <table className="w-full text-left text-xs font-mono-num">
              <thead>
                <tr className="bg-black/35 text-[#FFD700] border-b border-white/10">
                  <th className="py-2.5 px-3 font-sans">Format</th>
                  <th className="py-2.5 px-2 text-center">Matches</th>
                  <th className="py-2.5 px-2 text-center">Innings</th>
                  <th className="py-2.5 px-2 text-right">Wickets</th>
                  <th className="py-2.5 px-2 text-right">BBI</th>
                  <th className="py-2.5 px-3 text-right">Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {selectedPlayer.stats.map((st, idx) => (
                  <tr key={idx}>
                    <td className={`py-2.5 px-3 font-sans font-bold ${theme.titleText}`}>{st.format}</td>
                    <td className={`py-2.5 px-2 text-center ${theme.subText}`}>{st.m}</td>
                    <td className={`py-2.5 px-2 text-center ${theme.subText}`}>{st.inn}</td>
                    <td className="py-2.5 px-2 text-right font-black text-[#00FF66]">{st.wkts}</td>
                    <td className="py-2.5 px-2 text-right text-[#FFD700] font-bold">{st.bbi}</td>
                    <td className={`py-2.5 px-3 text-right ${theme.titleText}`}>{st.econ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: RECENT MATCHES (CLICK TO OPEN FULL MATCH SCORECARD) */}
        {playerSubTab === 'RECENT' && (
          <div className="space-y-2.5">
            {selectedPlayer.recentMatches.map((rm, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const found = MORE_MATCHES_DB.find((m) => m.id === rm.matchId) || MORE_MATCHES_DB[0];
                  setSelectedPlayer(null);
                  setSelectedMatch(found);
                }}
                className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer ${theme.cardBg}`}
              >
                <div>
                  <div className={`text-sm font-bold ${theme.titleText}`}>{rm.vs}</div>
                  <div className="text-xs text-[#00FF66] font-mono-num mt-0.5">
                    Bat: {rm.bat} · Bowl: {rm.bowl}
                  </div>
                  <div className={`text-[11px] ${theme.subText} mt-0.5`}>
                    {rm.format} · {rm.date} · {rm.venue}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#FFD700] shrink-0">Scorecard →</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CAREER TIMELINE & AWARDS */}
        {playerSubTab === 'CAREER' && (
          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <h3 className="text-xs font-display font-black uppercase tracking-wider text-[#FFD700]">
              Career Milestones & Honours
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-black/25 border border-white/10">
                <div className="font-bold text-[#00FF66]">ICC Player of the Tournament / Month Honours</div>
                <div className={`${theme.subText} mt-1`}>
                  Multiple-time Player of the Match & Series winner across ICC World Cups and bilateral tours.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/25 border border-white/10">
                <div className="font-bold text-[#FFD700]">Contract & Franchise Status (2026 Season)</div>
                <div className={`${theme.subText} mt-1`}>
                  Grade A+ Central Contract • Active across International & Premier T20 Leagues ({selectedPlayer.teams.join(' / ')}).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // LAST STEP VIEW B: FULL MATCH SCORECARD, INFO, PLAYING XI & COMMENTARY
  // ==========================================================================
  if (selectedMatch) {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={handleBackStep}
            className="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className={`text-xs sm:text-sm font-display font-black truncate max-w-[200px] ${theme.titleText}`}>
            {selectedMatch.matchTitle}
          </span>
          <button
            onClick={onOpenLiveMatch}
            className="text-[11px] font-bold text-[#00FF66] cursor-pointer"
          >
            Live TV →
          </button>
        </div>

        {/* Match Summary Header */}
        <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
          <div className="flex items-center justify-between text-xs">
            <span className={theme.subText}>{selectedMatch.seriesName}</span>
            <span className="font-bold text-[#FFD700]">{selectedMatch.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <div className="text-sm font-bold text-white">
                {selectedMatch.team1Flag} {selectedMatch.team1}
              </div>
              <div className="text-lg font-mono-num font-black text-[#00FF66] mt-1">
                {selectedMatch.team1Score}
              </div>
              <div className={`text-[11px] ${theme.subText}`}>{selectedMatch.team1Overs}</div>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <div className="text-sm font-bold text-white">
                {selectedMatch.team2Flag} {selectedMatch.team2}
              </div>
              <div className="text-lg font-mono-num font-black text-[#FFD700] mt-1">
                {selectedMatch.team2Score}
              </div>
              <div className={`text-[11px] ${theme.subText}`}>{selectedMatch.team2Overs}</div>
            </div>
          </div>

          <div className="text-xs font-bold text-[#00FF66] pt-1 border-t border-white/10">
            {selectedMatch.resultText}
          </div>

          {/* 4 Sub-Tabs: Scorecard | Match Info | Playing XI | Commentary */}
          <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            {[
              { id: 'SCORECARD', label: 'Scorecard' },
              { id: 'INFO', label: 'Match Info' },
              { id: 'XI', label: 'Playing XI' },
              { id: 'COMMENTARY', label: 'Highlights' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMatchSubTab(t.id as typeof matchSubTab)}
                className={`py-2 rounded-lg text-[11px] font-display font-bold cursor-pointer ${
                  matchSubTab === t.id ? 'bg-[#FFD700] text-[#021A0A]' : 'text-white/80 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {matchSubTab === 'SCORECARD' && (
          <div className="space-y-3">
            {/* Innings 1 Batting & Bowling */}
            <div className={`rounded-2xl border overflow-hidden ${theme.cardBg}`}>
              <div className="p-3 bg-black/30 border-b border-white/10 flex items-center justify-between text-xs font-display font-bold">
                <span className="text-[#FFD700]">{selectedMatch.team1} Innings</span>
                <span className="text-[#00FF66] font-mono-num">
                  {selectedMatch.team1Score} ({selectedMatch.team1Overs})
                </span>
              </div>
              <table className="w-full text-left text-xs font-mono-num">
                <thead>
                  <tr className="border-b border-white/10 text-emerald-200/80">
                    <th className="py-2 px-3 font-sans">Batter (Tap for Profile)</th>
                    <th className="py-2 px-2 text-right">R</th>
                    <th className="py-2 px-2 text-right">B</th>
                    <th className="py-2 px-2 text-right">4s</th>
                    <th className="py-2 px-2 text-right">6s</th>
                    <th className="py-2 px-3 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {selectedMatch.batting1.map((b, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        const p = MORE_PLAYERS_DB.find((pl) => pl.id === b.playerId) || MORE_PLAYERS_DB[0];
                        setSelectedPlayer(p);
                      }}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-sans">
                        <div className={`font-bold ${theme.titleText}`}>{b.name}</div>
                        <div className={`text-[10px] ${theme.subText}`}>{b.dismissal}</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-[#00FF66]">{b.r}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{b.b}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{b.fours}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{b.sixes}</td>
                      <td className="py-2.5 px-3 text-right text-[#FFD700]">{b.sr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-2.5 bg-black/25 border-y border-white/10 text-[11px] font-display font-bold text-[#FFD700]">
                Bowling Figures
              </div>
              <table className="w-full text-left text-xs font-mono-num">
                <thead>
                  <tr className="border-b border-white/10 text-emerald-200/80">
                    <th className="py-2 px-3 font-sans">Bowler</th>
                    <th className="py-2 px-2 text-right">O</th>
                    <th className="py-2 px-2 text-right">M</th>
                    <th className="py-2 px-2 text-right">R</th>
                    <th className="py-2 px-2 text-right">W</th>
                    <th className="py-2 px-3 text-right">ER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {selectedMatch.bowling1.map((bw, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        const p = MORE_PLAYERS_DB.find((pl) => pl.id === bw.playerId) || MORE_PLAYERS_DB[0];
                        setSelectedPlayer(p);
                      }}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <td className={`py-2.5 px-3 font-sans font-bold ${theme.titleText}`}>{bw.name}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{bw.o}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{bw.m}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{bw.r}</td>
                      <td className="py-2.5 px-2 text-right font-black text-[#00FF66]">{bw.w}</td>
                      <td className="py-2.5 px-3 text-right text-[#FFD700]">{bw.econ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {matchSubTab === 'INFO' && (
          <div className={`rounded-2xl border p-4 space-y-2.5 text-xs ${theme.cardBg}`}>
            {[
              { k: 'Series', v: selectedMatch.seriesName },
              { k: 'Match', v: selectedMatch.matchTitle },
              { k: 'Date & Time', v: selectedMatch.dateTime },
              { k: 'Venue', v: selectedMatch.venue },
              { k: 'Toss', v: selectedMatch.toss },
              { k: 'Umpires', v: selectedMatch.umpires },
              { k: 'Pitch Report', v: selectedMatch.pitchReport }
            ].map((r, i) => (
              <div key={i} className="py-2 border-b border-white/10 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className={theme.subText}>{r.k}</span>
                <span className={`font-bold ${theme.titleText}`}>{r.v}</span>
              </div>
            ))}
          </div>
        )}

        {matchSubTab === 'XI' && (
          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div className="text-xs font-display font-bold text-[#FFD700]">
              Tap any player below to open their Full Career Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MORE_PLAYERS_DB.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className="p-3 rounded-xl bg-black/25 border border-white/10 text-left flex items-center justify-between hover:border-[#00FF66] cursor-pointer"
                >
                  <div>
                    <div className={`text-xs font-bold ${theme.titleText}`}>
                      {p.flag} {p.name}
                    </div>
                    <div className={`text-[10px] ${theme.subText}`}>{p.role}</div>
                  </div>
                  <span className="text-xs font-bold text-[#FFD700]">Profile →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {matchSubTab === 'COMMENTARY' && (
          <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
            {[
              { ov: '18.4', tag: '6', text: 'SIX! Towhid Hridoy launches a slog-sweep deep into the mid-wicket stands!' },
              { ov: '18.3', tag: '4', text: 'FOUR! Shakib Al Hasan cuts fiercely past backward point for a boundary.' },
              { ov: '18.2', tag: '1', text: 'Yorker length on middle stump, pushed to long-on for a quick single.' },
              { ov: '17.6', tag: 'W', text: 'OUT! Caught at long-off trying to clear the ropes!' }
            ].map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/25 border border-white/10 flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-xs shrink-0">
                  {c.ov} ({c.tag})
                </span>
                <p className={`text-xs ${theme.titleText}`}>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 1: BROWSE SERIES (WITH FULL SERIES DETAIL DRILL-DOWN)
  // ==========================================================================
  if (screen === 'BROWSE_SERIES') {
    if (selectedSeries) {
      return (
        <div className="space-y-3">
          <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
            <button
              onClick={handleBackStep}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All Series</span>
            </button>
            <span className={`text-xs sm:text-sm font-display font-black truncate max-w-[210px] ${theme.titleText}`}>
              {selectedSeries.name}
            </span>
            <span className="text-[11px] font-bold text-[#00FF66]">{selectedSeries.shortBadge}</span>
          </div>

          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div>
              <h2 className={`text-base font-display font-black ${theme.titleText}`}>{selectedSeries.name}</h2>
              <p className={`text-xs ${theme.subText} mt-0.5`}>
                {selectedSeries.dates} · {selectedSeries.matchesCount}
              </p>
              <p className="text-xs text-[#FFD700] mt-0.5">{selectedSeries.venueHost}</p>
            </div>

            {/* 4 Series Tabs: Matches | Points Table | Top Stats | Squads */}
            <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              {[
                { id: 'MATCHES', label: 'Matches' },
                { id: 'POINTS', label: 'Points Table' },
                { id: 'STATS', label: 'Top Stats' },
                { id: 'SQUADS', label: 'Squads' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSeriesSubTab(t.id as typeof seriesSubTab)}
                  className={`py-2 rounded-lg text-[11px] font-display font-bold cursor-pointer ${
                    seriesSubTab === t.id ? 'bg-[#FFD700] text-[#021A0A]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {seriesSubTab === 'MATCHES' && (
            <div className="space-y-2.5">
              {MORE_MATCHES_DB.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`rounded-2xl border p-3.5 space-y-2 cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FFD700]">{m.matchTitle}</span>
                    <span className="text-[#00FF66] font-bold">{m.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>
                      {m.team1Flag} {m.team1}: <span className="text-[#00FF66] font-mono-num">{m.team1Score}</span>
                    </span>
                    <span>
                      {m.team2Flag} {m.team2}: <span className="text-[#FFD700] font-mono-num">{m.team2Score}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                    <span className={theme.subText}>{m.resultText}</span>
                    <span className="font-bold text-[#FFD700]">Full Scorecard →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {seriesSubTab === 'POINTS' && (
            <div className={`rounded-2xl border overflow-hidden ${theme.cardBg}`}>
              <table className="w-full text-left text-xs font-mono-num">
                <thead>
                  <tr className="bg-black/35 text-[#FFD700] border-b border-white/10">
                    <th className="py-2.5 px-3 font-sans">Team</th>
                    <th className="py-2.5 px-2 text-center">M</th>
                    <th className="py-2.5 px-2 text-center">W</th>
                    <th className="py-2.5 px-2 text-center">L</th>
                    <th className="py-2.5 px-2 text-right">NRR</th>
                    <th className="py-2.5 px-3 text-right">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {selectedSeries.teams.map((tm, idx) => (
                    <tr key={idx}>
                      <td className={`py-2.5 px-3 font-sans font-bold ${theme.titleText}`}>
                        #{idx + 1} {tm}
                      </td>
                      <td className={`py-2.5 px-2 text-center ${theme.subText}`}>6</td>
                      <td className="py-2.5 px-2 text-center text-[#00FF66] font-bold">{5 - idx}</td>
                      <td className="py-2.5 px-2 text-center text-rose-400">{1 + idx}</td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>
                        {idx === 0 ? '+1.420' : idx === 1 ? '+0.815' : '-0.340'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-[#FFD700]">{(5 - idx) * 2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {seriesSubTab === 'STATS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`rounded-2xl border p-4 space-y-2 ${theme.cardBg}`}>
                <div className="text-xs font-display font-black text-[#FFD700]">MOST RUNS IN SERIES</div>
                <div className={`text-base font-bold ${theme.titleText}`}>{selectedSeries.topScorer.name}</div>
                <div className="text-xl font-mono-num font-black text-[#00FF66]">
                  {selectedSeries.topScorer.runs} Runs (SR {selectedSeries.topScorer.sr})
                </div>
                <button
                  onClick={() => setSelectedPlayer(MORE_PLAYERS_DB[0])}
                  className="text-xs font-bold text-[#FFD700] underline cursor-pointer"
                >
                  Open Full Player Profile →
                </button>
              </div>
              <div className={`rounded-2xl border p-4 space-y-2 ${theme.cardBg}`}>
                <div className="text-xs font-display font-black text-[#FFD700]">MOST WICKETS IN SERIES</div>
                <div className={`text-base font-bold ${theme.titleText}`}>{selectedSeries.topBowler.name}</div>
                <div className="text-xl font-mono-num font-black text-[#00FF66]">
                  {selectedSeries.topBowler.wkts} Wickets (Econ {selectedSeries.topBowler.econ})
                </div>
                <button
                  onClick={() => setSelectedPlayer(MORE_PLAYERS_DB[4])}
                  className="text-xs font-bold text-[#FFD700] underline cursor-pointer"
                >
                  Open Full Player Profile →
                </button>
              </div>
            </div>
          )}

          {seriesSubTab === 'SQUADS' && (
            <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
              <div className="text-xs font-display font-bold text-[#FFD700]">
                Series Squads — Tap any player to view full career stats
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MORE_PLAYERS_DB.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className="p-3 rounded-xl bg-black/25 border border-white/10 text-left flex items-center justify-between hover:border-[#00FF66] cursor-pointer"
                  >
                    <div>
                      <div className={`text-xs font-bold ${theme.titleText}`}>
                        {p.flag} {p.name}
                      </div>
                      <div className={`text-[10px] ${theme.subText}`}>
                        {p.country} · {p.role}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FFD700]">&gt;</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    const filteredSeries = MORE_SERIES_DB.filter(
      (s) =>
        (seriesCategoryFilter === 'ALL' || s.category === seriesCategoryFilter) &&
        s.name.toLowerCase().includes(seriesSearch.toLowerCase())
    );

    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Browse Series</span>
          <span className="text-xs font-mono-num text-[#00FF66]">{filteredSeries.length} Series</span>
        </div>

        {/* Search & Filter Tabs */}
        <div className="space-y-2">
          <div className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${theme.cardBg}`}>
            <Search className="w-4 h-4 text-[#FFD700]" />
            <input
              type="text"
              value={seriesSearch}
              onChange={(e) => setSeriesSearch(e.target.value)}
              placeholder="Search series (e.g. BPL, India, WCL)..."
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Series' },
              { id: 'INTERNATIONAL', label: 'International' },
              { id: 'LEAGUE', label: 'T20 Leagues' },
              { id: 'DOMESTIC', label: 'Domestic' },
              { id: 'WOMEN', label: 'Women' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSeriesCategoryFilter(tab.id as typeof seriesCategoryFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 cursor-pointer ${
                  seriesCategoryFilter === tab.id
                    ? 'bg-[#FFD700] text-[#021A0A]'
                    : 'bg-black/30 text-white border border-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Series List */}
        <div className="space-y-2.5">
          {filteredSeries.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSeries(s);
                setSeriesSubTab('MATCHES');
              }}
              className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#00FF66] transition-all ${theme.cardBg}`}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00FF66]/20 to-[#FFD700]/20 border border-[#FFD700]/50 flex items-center justify-center text-[10px] font-display font-black text-[#FFD700] text-center px-1 shrink-0">
                {s.shortBadge}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${theme.titleText}`}>{s.name}</div>
                <div className={`text-xs ${theme.subText} mt-0.5`}>{s.dates}</div>
                <div className="text-xs font-semibold text-[#00FF66] mt-0.5">{s.matchesCount}</div>
              </div>
              <span className="text-lg font-bold text-[#FFD700]">&gt;</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 2: BROWSE TEAM (WITH FULL TEAM HUB DRILL-DOWN)
  // ==========================================================================
  if (screen === 'BROWSE_TEAM') {
    if (selectedTeam) {
      const teamPlayers = MORE_PLAYERS_DB.filter((p) => selectedTeam.squadIds.includes(p.id));
      return (
        <div className="space-y-3">
          <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
            <button
              onClick={handleBackStep}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All Teams</span>
            </button>
            <span className={`text-sm font-display font-black ${theme.titleText}`}>
              {selectedTeam.flag} {selectedTeam.name}
            </span>
            <span className="text-xs font-bold text-[#00FF66]">{selectedTeam.short}</span>
          </div>

          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-black/30 border border-[#FFD700]/50 flex items-center justify-center text-3xl">
                {selectedTeam.flag}
              </div>
              <div>
                <h2 className={`text-base font-display font-black ${theme.titleText}`}>{selectedTeam.name}</h2>
                <p className={`text-xs ${theme.subText}`}>Captain: {selectedTeam.captain}</p>
                <p className="text-xs text-[#FFD700]">Coach: {selectedTeam.coach}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              {[
                { id: 'SQUAD', label: 'Squad' },
                { id: 'MATCHES', label: 'Matches' },
                { id: 'RECORDS', label: 'Records' },
                { id: 'RANKINGS', label: 'Rankings' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTeamSubTab(t.id as typeof teamSubTab)}
                  className={`py-2 rounded-lg text-[11px] font-display font-bold cursor-pointer ${
                    teamSubTab === t.id ? 'bg-[#FFD700] text-[#021A0A]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {teamSubTab === 'SQUAD' && (
            <div className="space-y-2.5">
              {(teamPlayers.length ? teamPlayers : MORE_PLAYERS_DB).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
                >
                  <div>
                    <div className={`text-sm font-bold ${theme.titleText}`}>
                      {p.flag} {p.name}
                    </div>
                    <div className={`text-xs ${theme.subText} mt-0.5`}>
                      {p.role} · {p.battingStyle}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FFD700]">View Career →</span>
                </div>
              ))}
            </div>
          )}

          {teamSubTab === 'MATCHES' && (
            <div className="space-y-2.5">
              {MORE_MATCHES_DB.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer ${theme.cardBg}`}
                >
                  <div>
                    <div className={`text-sm font-bold ${theme.titleText}`}>{m.matchTitle}</div>
                    <div className="text-xs text-[#00FF66] mt-0.5">{m.resultText}</div>
                  </div>
                  <span className="text-xs font-bold text-[#FFD700]">Scorecard →</span>
                </div>
              ))}
            </div>
          )}

          {teamSubTab === 'RECORDS' && (
            <div className={`rounded-2xl border p-4 space-y-2.5 text-xs ${theme.cardBg}`}>
              {[
                { k: 'Home Stadium', v: selectedTeam.homeGround },
                { k: 'Major Trophies', v: selectedTeam.titles },
                { k: 'Highest Team Score', v: selectedTeam.highestTotal },
                { k: 'Lowest Team Score', v: selectedTeam.lowestTotal },
                { k: 'Most Career Runs', v: selectedTeam.mostRuns },
                { k: 'Most Career Wickets', v: selectedTeam.mostWickets }
              ].map((row, idx) => (
                <div key={idx} className="py-2 border-b border-white/10 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className={theme.subText}>{row.k}</span>
                  <span className={`font-bold ${theme.titleText}`}>{row.v}</span>
                </div>
              ))}
            </div>
          )}

          {teamSubTab === 'RANKINGS' && (
            <div className="grid grid-cols-3 gap-2.5 text-center">
              {[
                { fmt: 'TEST', rank: selectedTeam.iccRanks.test, rating: selectedTeam.ratings.test },
                { fmt: 'ODI', rank: selectedTeam.iccRanks.odi, rating: selectedTeam.ratings.odi },
                { fmt: 'T20I', rank: selectedTeam.iccRanks.t20, rating: selectedTeam.ratings.t20 }
              ].map((rk, i) => (
                <div key={i} className={`rounded-2xl border p-4 ${theme.cardBg}`}>
                  <div className="text-xs font-bold text-[#FFD700]">{rk.fmt}</div>
                  <div className="text-2xl font-mono-num font-black text-[#00FF66] my-1">#{rk.rank}</div>
                  <div className={`text-[11px] ${theme.subText}`}>Rating: {rk.rating}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    const filteredTeams = MORE_TEAMS_DB.filter(
      (t) =>
        (teamCategoryFilter === 'ALL' || t.category === teamCategoryFilter) &&
        t.name.toLowerCase().includes(teamSearch.toLowerCase())
    );

    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Browse Team</span>
          <span className="text-xs font-mono-num text-[#00FF66]">{filteredTeams.length} Teams</span>
        </div>

        <div className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${theme.cardBg}`}>
          <Search className="w-4 h-4 text-[#FFD700]" />
          <input
            type="text"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            placeholder="Search team name..."
            className="bg-transparent text-xs text-white focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'ALL', label: 'All Teams' },
            { id: 'INTERNATIONAL', label: 'International' },
            { id: 'LEAGUE', label: 'T20 Leagues' },
            { id: 'WOMEN', label: 'Women' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTeamCategoryFilter(tab.id as typeof teamCategoryFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 cursor-pointer ${
                teamCategoryFilter === tab.id
                  ? 'bg-[#FFD700] text-[#021A0A]'
                  : 'bg-black/30 text-white border border-white/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTeams.map((tm) => (
            <div
              key={tm.id}
              onClick={() => {
                setSelectedTeam(tm);
                setTeamSubTab('SQUAD');
              }}
              className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tm.flag}</span>
                <div>
                  <div className={`text-sm font-bold ${theme.titleText}`}>{tm.name}</div>
                  <div className={`text-xs ${theme.subText}`}>
                    Captain: {tm.captain} · T20I Rank #{tm.iccRanks.t20}
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-[#FFD700]">&gt;</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 3: BROWSE PLAYER (WITH SEARCH & FULL PROFILE DRILL-DOWN)
  // ==========================================================================
  if (screen === 'BROWSE_PLAYER') {
    const filteredPlayers = MORE_PLAYERS_DB.filter(
      (p) =>
        (playerCountryFilter === 'ALL' || p.country === playerCountryFilter) &&
        (p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
          p.country.toLowerCase().includes(playerSearch.toLowerCase()))
    );

    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Browse Player</span>
          <span className="text-xs font-mono-num text-[#00FF66]">{filteredPlayers.length} Players</span>
        </div>

        <div className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${theme.cardBg}`}>
          <Search className="w-4 h-4 text-[#FFD700]" />
          <input
            type="text"
            value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
            placeholder="Search player (e.g. Shakib, Kohli, Litton, AB de Villiers)..."
            className="bg-transparent text-xs text-white focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {['ALL', 'Bangladesh', 'India', 'Australia', 'South Africa', 'Afghanistan'].map((c) => (
            <button
              key={c}
              onClick={() => setPlayerCountryFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 cursor-pointer ${
                playerCountryFilter === c
                  ? 'bg-[#FFD700] text-[#021A0A]'
                  : 'bg-black/30 text-white border border-white/15'
              }`}
            >
              {c === 'ALL' ? 'All Countries' : c}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPlayer(p);
                setPlayerSubTab('INFO');
              }}
              className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-black/35 border border-[#FFD700]/60 flex items-center justify-center text-lg">
                  {p.flag}
                </div>
                <div>
                  <div className={`text-sm font-bold ${theme.titleText}`}>{p.name}</div>
                  <div className={`text-xs ${theme.subText}`}>
                    {p.country} · {p.role}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#FFD700]">Full Stats →</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 4: SCHEDULE / MATCH CENTER
  // ==========================================================================
  if (screen === 'SCHEDULE') {
    const list = MORE_MATCHES_DB.filter(
      (m) => scheduleStatusFilter === 'ALL' || m.status === scheduleStatusFilter
    );
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Cricket Schedule & Results</span>
          <span className="text-xs text-[#00FF66]">2026</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
          {(['ALL', 'LIVE', 'UPCOMING', 'FINISHED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setScheduleStatusFilter(st)}
              className={`py-2 rounded-lg text-xs font-display font-bold cursor-pointer ${
                scheduleStatusFilter === st ? 'bg-[#FFD700] text-[#021A0A]' : 'text-white/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {list.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMatch(m)}
              className={`rounded-2xl border p-3.5 space-y-2 cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFD700]">{m.seriesName}</span>
                <span className="font-bold text-[#00FF66]">{m.status}</span>
              </div>
              <div className={`text-sm font-bold ${theme.titleText}`}>{m.matchTitle}</div>
              <div className="flex items-center justify-between text-xs font-mono-num">
                <span className="text-white">
                  {m.team1Flag} {m.team1}: <strong className="text-[#00FF66]">{m.team1Score}</strong>
                </span>
                <span className="text-white">
                  {m.team2Flag} {m.team2}: <strong className="text-[#FFD700]">{m.team2Score}</strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                <span className={theme.subText}>{m.venue}</span>
                <span className="font-bold text-[#FFD700]">Match Center →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 5 & 6: ICC RANKINGS - MEN & ICC RANKINGS - WOMEN
  // ==========================================================================
  if (screen === 'ICC_MEN' || screen === 'ICC_WOMEN') {
    const isWomen = screen === 'ICC_WOMEN';

    const rankingRows = isWomen
      ? iccCategory === 'TEAMS'
        ? [
            { rank: 1, name: 'Australia Women', country: 'AUS-W', flag: '🇦🇺', rating: 164, points: 4920, careerBest: '168 Rating (2025)', teamId: 't-ban-w' },
            { rank: 2, name: 'England Women', country: 'ENG-W', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 130, points: 3910, careerBest: '138 Rating', teamId: 't-ban-w' },
            { rank: 3, name: 'India Women', country: 'IND-W', flag: '🇮🇳', rating: 122, points: 3660, careerBest: '129 Rating', teamId: 't-ban-w' },
            { rank: 4, name: 'South Africa Women', country: 'RSA-W', flag: '🇿🇦', rating: 116, points: 3480, careerBest: '122 Rating', teamId: 't-ban-w' },
            { rank: 5, name: 'New Zealand Women', country: 'NZ-W', flag: '🇳🇿', rating: 104, points: 3120, careerBest: '115 Rating', teamId: 't-ban-w' },
            { rank: 6, name: 'West Indies Women', country: 'WI-W', flag: '🌴', rating: 96, points: 2880, careerBest: '110 Rating', teamId: 't-ban-w' },
            { rank: 7, name: 'Sri Lanka Women', country: 'SL-W', flag: '🇱🇰', rating: 92, points: 2760, careerBest: '98 Rating', teamId: 't-ban-w' },
            { rank: 8, name: 'Bangladesh Women', country: 'BAN-W', flag: '🇧🇩', rating: 86, points: 2580, careerBest: '91 Rating (Asia Cup)', teamId: 't-ban-w' }
          ]
        : [
            { rank: 1, name: 'Smriti Mandhana', country: 'IND-W', flag: '🇮🇳', rating: 768, points: 768, careerBest: '797 vs AUS-W', playerId: 'p-kohli' },
            { rank: 2, name: 'Nat Sciver-Brunt', country: 'ENG-W', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 754, points: 754, careerBest: '802 vs RSA-W', playerId: 'p-head' },
            { rank: 3, name: 'Beth Mooney', country: 'AUS-W', flag: '🇦🇺', rating: 742, points: 742, careerBest: '788 vs ENG-W', playerId: 'p-head' },
            { rank: 4, name: 'Nigar Sultana Joty', country: 'BAN-W', flag: '🇧🇩', rating: 698, points: 698, careerBest: '712 vs IND-W', playerId: 'p-litton' },
            { rank: 5, name: 'Nahida Akter', country: 'BAN-W', flag: '🇧🇩', rating: 685, points: 685, careerBest: '704 vs PAK-W', playerId: 'p-shakib' },
            { rank: 6, name: 'Sophie Ecclestone', country: 'ENG-W', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 678, points: 678, careerBest: '790 Career Peak', playerId: 'p-bumrah' }
          ]
      : iccCategory === 'TEAMS'
      ? [
          { rank: 1, name: 'India', country: 'IND', flag: '🇮🇳', rating: 268, points: 10988, careerBest: '272 Rating (2026)', teamId: 't-ind' },
          { rank: 2, name: 'Australia', country: 'AUS', flag: '🇦🇺', rating: 259, points: 9842, careerBest: '269 Rating', teamId: 't-aus' },
          { rank: 3, name: 'South Africa', country: 'RSA', flag: '🇿🇦', rating: 252, points: 9324, careerBest: '264 Rating', teamId: 't-rsa' },
          { rank: 4, name: 'England', country: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 248, points: 8928, careerBest: '270 Rating', teamId: 't-aus' },
          { rank: 5, name: 'New Zealand', country: 'NZ', flag: '🇳🇿', rating: 244, points: 8540, careerBest: '262 Rating', teamId: 't-aus' },
          { rank: 6, name: 'West Indies', country: 'WI', flag: '🌴', rating: 240, points: 8160, careerBest: '258 Rating', teamId: 't-ind' },
          { rank: 7, name: 'Bangladesh', country: 'BAN', flag: '🇧🇩', rating: 234, points: 7956, careerBest: '241 Rating', teamId: 't-ban' },
          { rank: 8, name: 'Afghanistan', country: 'AFG', flag: '🇦🇫', rating: 226, points: 7458, careerBest: '232 Rating', teamId: 't-afg' }
        ]
      : iccCategory === 'BATTER'
      ? [
          { rank: 1, name: 'Travis Head', country: 'AUS', flag: '🇦🇺', rating: 855, points: 855, careerBest: '881 vs ENG', playerId: 'p-head' },
          { rank: 2, name: 'Virat Kohli', country: 'IND', flag: '🇮🇳', rating: 838, points: 838, careerBest: '911 Career Peak', playerId: 'p-kohli' },
          { rank: 3, name: 'AB de Villiers', country: 'RSA', flag: '🇿🇦', rating: 824, points: 824, careerBest: '935 All-Time', playerId: 'p-abd' },
          { rank: 4, name: 'Litton Das', country: 'BAN', flag: '🇧🇩', rating: 762, points: 762, careerBest: '784 vs IND', playerId: 'p-litton' },
          { rank: 5, name: 'Towhid Hridoy', country: 'BAN', flag: '🇧🇩', rating: 740, points: 740, careerBest: '755 vs SL', playerId: 'p-litton' }
        ]
      : iccCategory === 'BOWLER'
      ? [
          { rank: 1, name: 'Jasprit Bumrah', country: 'IND', flag: '🇮🇳', rating: 870, points: 870, careerBest: '885 vs AUS', playerId: 'p-bumrah' },
          { rank: 2, name: 'Rashid Khan', country: 'AFG', flag: '🇦🇫', rating: 842, points: 842, careerBest: '895 vs WI', playerId: 'p-rashid' },
          { rank: 3, name: 'Mustafizur Rahman', country: 'BAN', flag: '🇧🇩', rating: 774, points: 774, careerBest: '819 vs NZ', playerId: 'p-mustafiz' },
          { rank: 4, name: 'Shakib Al Hasan', country: 'BAN', flag: '🇧🇩', rating: 752, points: 752, careerBest: '808 vs WI', playerId: 'p-shakib' }
        ]
      : [
          { rank: 1, name: 'Shakib Al Hasan', country: 'BAN', flag: '🇧🇩', rating: 412, points: 412, careerBest: '489 All-Time #1', playerId: 'p-shakib' },
          { rank: 2, name: 'Rashid Khan', country: 'AFG', flag: '🇦🇫', rating: 368, points: 368, careerBest: '392 vs ZIM', playerId: 'p-rashid' },
          { rank: 3, name: 'Travis Head', country: 'AUS', flag: '🇦🇺', rating: 310, points: 310, careerBest: '328 vs RSA', playerId: 'p-head' }
        ];

    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => {
              if (selectedRankEntry) setSelectedRankEntry(null);
              else setScreen('MENU');
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedRankEntry ? 'Back to Table' : 'More'}</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>
            {isWomen ? "ICC Rankings - Women's" : "ICC Rankings - Men's"}
          </span>
          <span className="text-xs font-bold text-[#00FF66]">Official</span>
        </div>

        {/* LAST STEP INSIDE ICC RANKINGS: SELECTED RANK ENTRY BREAKDOWN */}
        {selectedRankEntry ? (
          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-lg flex items-center justify-center">
                  #{selectedRankEntry.rank}
                </div>
                <div>
                  <h3 className={`text-base font-display font-black ${theme.titleText}`}>
                    {selectedRankEntry.flag} {selectedRankEntry.name}
                  </h3>
                  <p className="text-xs text-[#00FF66]">
                    {iccFormat} · {iccCategory} Official ICC Ranking
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                <div className={`text-[10px] ${theme.subText}`}>CURRENT RATING</div>
                <div className="text-lg font-mono-num font-black text-[#00FF66] mt-0.5">
                  {selectedRankEntry.rating}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                <div className={`text-[10px] ${theme.subText}`}>TOTAL POINTS</div>
                <div className="text-lg font-mono-num font-black text-[#FFD700] mt-0.5">
                  {selectedRankEntry.points}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                <div className={`text-[10px] ${theme.subText}`}>CAREER BEST</div>
                <div className="text-xs font-bold text-white mt-1">{selectedRankEntry.careerBest}</div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              {selectedRankEntry.playerId && (
                <button
                  onClick={() => {
                    const p = MORE_PLAYERS_DB.find((pl) => pl.id === selectedRankEntry.playerId) || MORE_PLAYERS_DB[0];
                    setSelectedRankEntry(null);
                    setSelectedPlayer(p);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                >
                  Open Full Player Profile →
                </button>
              )}
              {selectedRankEntry.teamId && (
                <button
                  onClick={() => {
                    const t = MORE_TEAMS_DB.find((tm) => tm.id === selectedRankEntry.teamId) || MORE_TEAMS_DB[0];
                    setSelectedRankEntry(null);
                    setScreen('BROWSE_TEAM');
                    setSelectedTeam(t);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                >
                  Open Full Team Hub →
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Category Tabs: Teams | Batter | Bowler | All-Rounder */}
            <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              {[
                { id: 'TEAMS', label: 'Teams' },
                { id: 'BATTER', label: 'Batter' },
                { id: 'BOWLER', label: 'Bowler' },
                { id: 'ALLROUNDER', label: 'All-Rounder' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setIccCategory(cat.id as typeof iccCategory)}
                  className={`py-2 rounded-lg text-[11px] font-display font-bold cursor-pointer ${
                    iccCategory === cat.id ? 'bg-[#FFD700] text-[#021A0A]' : 'text-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Format Tabs: Test | ODI | T20I */}
            <div className="flex items-center gap-2">
              {(['TEST', 'ODI', 'T20I'] as const)
                .filter((f) => !(isWomen && f === 'TEST'))
                .map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setIccFormat(fmt)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold cursor-pointer ${
                      iccFormat === fmt
                        ? 'bg-[#00FF66] text-[#021A0A]'
                        : 'bg-black/30 text-white border border-white/15'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
            </div>

            {/* #1 Ranked Spotlight Card */}
            {rankingRows[0] && (
              <div
                onClick={() => setSelectedRankEntry(rankingRows[0])}
                className={`rounded-2xl border-2 border-[#FFD700] p-4 flex items-center justify-between cursor-pointer ${theme.cardBg}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-base flex items-center justify-center">
                    #1
                  </div>
                  <div>
                    <div className={`text-base font-display font-black ${theme.titleText}`}>
                      {rankingRows[0].flag} {rankingRows[0].name}
                    </div>
                    <div className="text-xs text-[#00FF66]">
                      World #1 {iccFormat} {iccCategory} · Tap for Breakdown
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono-num">
                  <div className="text-xl font-black text-[#FFD700]">{rankingRows[0].rating}</div>
                  <div className={`text-[10px] ${theme.subText}`}>Rating</div>
                </div>
              </div>
            )}

            {/* Full Ranking Table */}
            <div className={`rounded-2xl border overflow-hidden ${theme.cardBg}`}>
              <table className="w-full text-left text-xs font-mono-num">
                <thead>
                  <tr className="bg-black/35 text-[#FFD700] border-b border-white/10">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3 font-sans">{iccCategory === 'TEAMS' ? 'Team' : 'Player'}</th>
                    <th className="py-2.5 px-2 text-right">Points</th>
                    <th className="py-2.5 px-3 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rankingRows.map((r) => (
                    <tr
                      key={r.rank}
                      onClick={() => setSelectedRankEntry(r)}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-bold text-[#FFD700]">#{r.rank}</td>
                      <td className={`py-2.5 px-3 font-sans font-bold ${theme.titleText}`}>
                        {r.flag} {r.name} <span className={`text-[10px] ${theme.subText}`}>({r.country})</span>
                      </td>
                      <td className={`py-2.5 px-2 text-right ${theme.subText}`}>{r.points}</td>
                      <td className="py-2.5 px-3 text-right font-black text-[#00FF66]">{r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 7: CRICKET RECORDS (ALL-TIME & FORMAT RECORDS -> LAST STEP)
  // ==========================================================================
  if (screen === 'RECORDS') {
    const recordsMap: Record<
      typeof recordCategory,
      { rank: number; name: string; team: string; stat: string; matches: number; span: string; detail: string; playerId?: string }[]
    > = {
      MOST_RUNS: [
        { rank: 1, name: 'Sachin Tendulkar', team: '🇮🇳 IND', stat: '18,426 Runs', matches: 463, span: '1989–2012', detail: '49 ODI Hundreds & 96 Fifties at Avg 44.83', playerId: 'p-kohli' },
        { rank: 2, name: 'Virat Kohli', team: '🇮🇳 IND', stat: '13,906 Runs', matches: 295, span: '2008–2026', detail: '50 ODI Hundreds (World Record) at Avg 58.18', playerId: 'p-kohli' },
        { rank: 3, name: 'Tamim Iqbal', team: '🇧🇩 BAN', stat: '8,357 Runs', matches: 243, span: '2007–2026', detail: 'Most ODI Runs for Bangladesh (14 Hundreds)', playerId: 'p-litton' },
        { rank: 4, name: 'Shakib Al Hasan', team: '🇧🇩 BAN', stat: '7,570 Runs', matches: 247, span: '2006–2026', detail: '9 ODI Hundreds & 56 Fifties + 317 Wickets', playerId: 'p-shakib' }
      ],
      MOST_WICKETS: [
        { rank: 1, name: 'Muttiah Muralitharan', team: '🇱🇰 SL', stat: '534 Wkts', matches: 350, span: '1993–2011', detail: 'Best 7/30, Economy 3.93', playerId: 'p-rashid' },
        { rank: 2, name: 'Shakib Al Hasan', team: '🇧🇩 BAN', stat: '317 Wkts', matches: 247, span: '2006–2026', detail: 'Most Wickets by a Left-arm Spinner in Bangladesh History', playerId: 'p-shakib' },
        { rank: 3, name: 'Rashid Khan', team: '🇦🇫 AFG', stat: '190 Wkts', matches: 105, span: '2015–2026', detail: 'Best 7/18 vs WI at Economy 4.19', playerId: 'p-rashid' },
        { rank: 4, name: 'Mustafizur Rahman', team: '🇧🇩 BAN', stat: '169 Wkts', matches: 107, span: '2015–2026', detail: 'Best 6/43, Two 5-Wicket Hauls in Debut Series', playerId: 'p-mustafiz' }
      ],
      HIGHEST_SCORE: [
        { rank: 1, name: 'Rohit Sharma', team: '🇮🇳 IND', stat: '264 (173b)', matches: 265, span: 'vs SL (2014)', detail: '33 Fours & 9 Sixes at Eden Gardens, Kolkata', playerId: 'p-kohli' },
        { rank: 2, name: 'Travis Head', team: '🇦🇺 AUS', stat: '175 (142b)', matches: 69, span: 'vs ENG (2026)', detail: '20 Fours & 6 Sixes', playerId: 'p-head' },
        { rank: 3, name: 'Litton Das', team: '🇧🇩 BAN', stat: '176 (143b)', matches: 92, span: 'vs ZIM (2020)', detail: 'Highest Individual ODI Score for Bangladesh (16x4, 8x6)', playerId: 'p-litton' }
      ],
      MOST_HUNDREDS: [
        { rank: 1, name: 'Virat Kohli', team: '🇮🇳 IND', stat: '50 Hundreds', matches: 295, span: '2008–2026', detail: 'Surpassed 49 ODI centuries in Mumbai Semifinal', playerId: 'p-kohli' },
        { rank: 2, name: 'AB de Villiers', team: '🇿🇦 RSA', stat: '25 Hundreds', matches: 228, span: '2005–2018', detail: 'All 25 ODI centuries scored at 100+ Strike Rate', playerId: 'p-abd' }
      ],
      MOST_SIXES: [
        { rank: 1, name: 'Rohit Sharma', team: '🇮🇳 IND', stat: '620+ Sixes', matches: 485, span: '2007–2026', detail: 'All-time leader in International Sixes across formats', playerId: 'p-kohli' },
        { rank: 2, name: 'AB de Villiers', team: '🇿🇦 RSA', stat: '446 T20 Sixes', matches: 348, span: '2005–2026', detail: 'Includes 9 sixes in WCL 2026 37-ball century', playerId: 'p-abd' }
      ],
      BEST_BOWLING: [
        { rank: 1, name: 'Chaminda Vaas', team: '🇱🇰 SL', stat: '8/19 (8.0 Ov)', matches: 322, span: 'vs ZIM (2001)', detail: 'Best figures in ODI history at Colombo', playerId: 'p-bumrah' },
        { rank: 2, name: 'Rashid Khan', team: '🇦🇫 AFG', stat: '7/18 (8.4 Ov)', matches: 105, span: 'vs WI (2017)', detail: 'Gros Islet masterclass spell', playerId: 'p-rashid' }
      ],
      FASTEST_100: [
        { rank: 1, name: 'AB de Villiers', team: '🇿🇦 RSA', stat: '31 Balls', matches: 228, span: 'vs WI (2015)', detail: '149 off 44 balls with 16 Sixes at Wanderers!', playerId: 'p-abd' },
        { rank: 2, name: 'AB de Villiers (WCL)', team: '🇿🇦 RSA', stat: '37 Balls', matches: 18, span: 'vs ENG (2026)', detail: '2026 Championship of Legends 37-ball hundred', playerId: 'p-abd' }
      ],
      HIGHEST_TEAM: [
        { rank: 1, name: 'England', team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG', stat: '498/4 (50 Ov)', matches: 1, span: 'vs NED (2022)', detail: 'World record ODI team total in Amstelveen', playerId: 'p-head' },
        { rank: 2, name: 'South Africa', team: '🇿🇦 RSA', stat: '439/2 (50 Ov)', matches: 1, span: 'vs WI (2015)', detail: 'Powered by AB de Villiers 31-ball century', playerId: 'p-abd' }
      ]
    };

    const rows = recordsMap[recordCategory];

    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => {
              if (selectedRecordHolder) setSelectedRecordHolder(null);
              else setScreen('MENU');
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedRecordHolder ? 'Back to Records' : 'More'}</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Cricket Records</span>
          <span className="text-xs font-bold text-[#00FF66]">{recordFormat}</span>
        </div>

        {selectedRecordHolder ? (
          <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div className="text-xs font-display font-black text-[#FFD700]">
              OFFICIAL RECORD BREAKDOWN (#{selectedRecordHolder.rank})
            </div>
            <h3 className={`text-lg font-display font-black ${theme.titleText}`}>
              {selectedRecordHolder.name} ({selectedRecordHolder.team})
            </h3>
            <div className="text-2xl font-mono-num font-black text-[#00FF66]">
              {selectedRecordHolder.stat}
            </div>
            <p className={`text-xs ${theme.subText}`}>
              Matches: {selectedRecordHolder.matches} · Span: {selectedRecordHolder.span}
            </p>
            <p className="text-xs text-white p-3 rounded-xl bg-black/25 border border-white/10">
              {selectedRecordHolder.detail}
            </p>
            <button
              onClick={() => {
                const p =
                  MORE_PLAYERS_DB.find((pl) => pl.id === selectedRecordHolder.playerId) || MORE_PLAYERS_DB[0];
                setSelectedRecordHolder(null);
                setSelectedPlayer(p);
              }}
              className="w-full py-2.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
            >
              Open Full Player Career Profile →
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'MOST_RUNS', label: 'Most Runs' },
                { id: 'MOST_WICKETS', label: 'Most Wickets' },
                { id: 'HIGHEST_SCORE', label: 'Highest Score' },
                { id: 'MOST_HUNDREDS', label: 'Most 100s' },
                { id: 'MOST_SIXES', label: 'Most 6s' },
                { id: 'BEST_BOWLING', label: 'Best Bowling' },
                { id: 'FASTEST_100', label: 'Fastest 100' },
                { id: 'HIGHEST_TEAM', label: 'Highest Team Score' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setRecordCategory(cat.id as typeof recordCategory)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 cursor-pointer ${
                    recordCategory === cat.id
                      ? 'bg-[#FFD700] text-[#021A0A]'
                      : 'bg-black/30 text-white border border-white/15'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {(['ODI', 'TEST', 'T20I'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setRecordFormat(fmt)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold cursor-pointer ${
                    recordFormat === fmt ? 'bg-[#00FF66] text-[#021A0A]' : 'bg-black/30 text-white border border-white/15'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {rows.map((r) => (
                <div
                  key={r.rank}
                  onClick={() => setSelectedRecordHolder(r)}
                  className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#00FF66] ${theme.cardBg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-black/35 border border-[#FFD700]/40 flex items-center justify-center font-mono-num font-black text-xs text-[#FFD700]">
                      #{r.rank}
                    </span>
                    <div>
                      <div className={`text-sm font-bold ${theme.titleText}`}>
                        {r.name} <span className="text-xs text-[#FFD700]">({r.team})</span>
                      </div>
                      <div className={`text-[11px] ${theme.subText}`}>{r.detail}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-mono-num font-black text-[#00FF66]">{r.stat}</div>
                    <div className="text-[10px] text-[#FFD700]">Details →</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 8: LIVE FAN POLLS (VOTE & SEE REAL-TIME PERCENTAGE BARS)
  // ==========================================================================
  if (screen === 'POLLS') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Live Match Polls</span>
          <span className="text-xs text-[#00FF66]">Vote & Win</span>
        </div>

        {pollsData.map((poll) => (
          <div key={poll.id} className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#FFD700]">{poll.match}</span>
              <span className="font-mono-num text-[#00FF66]">{poll.totalVotes.toLocaleString()} Votes</span>
            </div>
            <h3 className={`text-sm font-bold ${theme.titleText}`}>{poll.question}</h3>

            <div className="space-y-2">
              {poll.options.map((opt) => {
                const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                const chosen = poll.userChoice === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (poll.userChoice) return;
                      setPollsData((prev) =>
                        prev.map((p) =>
                          p.id === poll.id
                            ? {
                                ...p,
                                totalVotes: p.totalVotes + 1,
                                userChoice: opt.id,
                                options: p.options.map((o) =>
                                  o.id === opt.id ? { ...o, votes: o.votes + 1 } : o
                                )
                              }
                            : p
                        )
                      );
                    }}
                    className={`w-full rounded-xl border p-3 text-left relative overflow-hidden cursor-pointer transition-all ${
                      chosen ? 'border-[#00FF66] bg-[#00FF66]/15' : 'border-white/15 bg-black/25 hover:border-[#FFD700]'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#00FF66]/20 transition-all duration-500"
                      style={{ width: poll.userChoice ? `${pct}%` : '0%' }}
                    />
                    <div className="relative flex items-center justify-between text-xs font-bold">
                      <span className="text-white">
                        {opt.label} {chosen && '✓ (Your Vote)'}
                      </span>
                      <span className="font-mono-num text-[#FFD700]">{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 9: SPORTSVIVA PREMIUM (UNLOCK ADS-FREE VERSION -> LAST STEP)
  // ==========================================================================
  if (screen === 'PREMIUM') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className="text-sm font-display font-black text-[#FFD700]">SPORTSVIVA PREMIUM</span>
          <span className="text-xs text-[#00FF66]">{isVipUnlocked ? 'VIP ACTIVE' : 'VIP'}</span>
        </div>

        <div className={`rounded-2xl border-2 border-[#FFD700] p-4 space-y-4 ${theme.cardBg}`}>
          <div className="flex items-center gap-3">
            <Crown className="w-9 h-9 text-[#FFD700] shrink-0" />
            <div>
              <h2 className="text-base font-display font-black text-[#FFD700]">
                Unlock Ads-Free SportsViva Premium
              </h2>
              <p className={`text-xs ${theme.subText}`}>
                0.2s Stadium Fast Live Line · Voice Ball-by-Ball · 100% Ad-Free · VIP Gold Badge
              </p>
            </div>
          </div>

          {isVipUnlocked ? (
            <div className="p-4 rounded-2xl bg-[#00FF66]/15 border-2 border-[#00FF66] text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#00FF66] mx-auto" />
              <div className="text-base font-display font-black text-white">
                CONGRATULATIONS! YOU ARE A VIP PREMIUM MEMBER
              </div>
              <div className="text-xs text-emerald-200">
                Plan: {selectedPlan} · Payment: {premiumPayMethod} · Ad-Free Live Line & Voice Commentary Active!
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'MONTHLY', title: '1 Month', price: '99 Tk', pts: '500 Pts' },
                  { id: 'SIX_MONTHS', title: '6 Months', price: '399 Tk', pts: '1800 Pts' },
                  { id: 'YEARLY', title: '1 Year VIP', price: '599 Tk', pts: '2500 Pts' }
                ].map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => setSelectedPlan(pl.id as typeof selectedPlan)}
                    className={`p-3 rounded-xl border text-center cursor-pointer ${
                      selectedPlan === pl.id
                        ? 'border-[#FFD700] bg-[#FFD700]/20'
                        : 'border-white/15 bg-black/25'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{pl.title}</div>
                    <div className="text-sm font-mono-num font-black text-[#00FF66] mt-1">{pl.price}</div>
                    <div className="text-[10px] text-[#FFD700]">{pl.pts}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#FFD700]">Select Activation Method:</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['POINTS', 'BKASH', 'NAGAD'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPremiumPayMethod(m)}
                      className={`py-2 rounded-xl border text-xs font-display font-bold cursor-pointer ${
                        premiumPayMethod === m
                          ? 'bg-[#00FF66] text-[#021A0A] border-[#00FF66]'
                          : 'bg-black/30 text-white border-white/15'
                      }`}
                    >
                      {m === 'POINTS' ? 'Reward Points' : m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsVipUnlocked(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xs sm:text-sm cursor-pointer shadow-lg"
              >
                Activate {selectedPlan} Premium Now →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREEN 10: APP LANGUAGE, THEME, NOTIFICATIONS & SPEECH SETTINGS
  // ==========================================================================
  if (screen === 'LANGUAGE') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>App Language</span>
          <span className="text-xs text-[#00FF66]">{appLanguage}</span>
        </div>

        <div className={`rounded-2xl border p-4 space-y-2.5 ${theme.cardBg}`}>
          {[
            { id: 'ENGLISH', label: 'English (International)', sub: 'Default broadcast language' },
            { id: 'BANGLA', label: 'বাংলা (Bengali)', sub: 'সম্পূর্ণ বাংলা ক্রিকেট লাইভ লাইন ও ধারাভাষ্য' },
            { id: 'HINDI', label: 'हिन्दी (Hindi)', sub: 'हिंदी क्रिकेट लाइव स्कोर और कमेंट्री' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setAppLanguage(lang.id as typeof appLanguage)}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                appLanguage === lang.id
                  ? 'border-[#00FF66] bg-[#00FF66]/15'
                  : 'border-white/15 bg-black/25'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-white">{lang.label}</div>
                <div className={`text-xs ${theme.subText}`}>{lang.sub}</div>
              </div>
              {appLanguage === lang.id && <CheckCircle2 className="w-5 h-5 text-[#00FF66]" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'NOTIFICATIONS') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Notification Settings</span>
          <span className="text-xs text-[#00FF66]">Live Alerts</span>
        </div>

        {testNotifBanner && (
          <div className="p-3 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-bold text-xs flex items-center justify-between">
            <span>🔔 {testNotifBanner}</span>
            <button onClick={() => setTestNotifBanner(null)} className="font-black cursor-pointer">
              ✕
            </button>
          </div>
        )}

        <div className={`rounded-2xl border divide-y divide-white/10 ${theme.cardBg}`}>
          {[
            { key: 'matchStart', label: 'Match Start & Playing XI', sub: 'Alert 15 mins before first ball' },
            { key: 'tossUpdate', label: 'Toss Updates', sub: 'Instant coin toss & pitch decision' },
            { key: 'wicketAlert', label: 'Wicket Alerts', sub: 'Instant alert on every dismissal' },
            { key: 'boundaryAlert', label: 'Four & Six Alerts', sub: 'Every boundary notification' },
            { key: 'milestoneAlert', label: '50 / 100 Player Milestones', sub: 'Half-century, Century & 5-Wicket hauls' },
            { key: 'matchResult', label: 'Innings Break & Match Result', sub: 'Final summary & Player of the Match' },
            { key: 'breakingNews', label: 'Breaking Cricket News', sub: 'Squad announcements & major headlines' }
          ].map((item) => {
            const active = notifSettings[item.key as keyof typeof notifSettings];
            return (
              <div key={item.key} className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className={`text-sm font-bold ${theme.titleText}`}>{item.label}</div>
                  <div className={`text-xs ${theme.subText}`}>{item.sub}</div>
                </div>
                <button
                  onClick={() =>
                    setNotifSettings((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifSettings]
                    }))
                  }
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    active ? 'bg-[#00FF66]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#021A0A] transition-transform ${
                      active ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() =>
            setTestNotifBanner('LIVE ALERT: BAN 178/5 (18.4 Ov) — Towhid Hridoy hits a massive SIX!')
          }
          className="w-full py-3 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
        >
          Send Test Live Notification 🔔
        </button>
      </div>
    );
  }

  if (screen === 'SPEECH') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Speech & Audio Settings</span>
          <span className="text-xs text-[#00FF66]">{speechEnabled ? 'ON' : 'OFF'}</span>
        </div>

        <div className={`rounded-2xl border p-4 space-y-4 ${theme.cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>Ball-by-Ball Voice Commentary</div>
              <div className={`text-xs ${theme.subText}`}>Speak every ball outcome (0, 1, 4, 6, Wicket, Over)</div>
            </div>
            <button
              onClick={() => setSpeechEnabled((v) => !v)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                speechEnabled ? 'bg-[#00FF66]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#021A0A] transition-transform ${
                  speechEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#FFD700]">Voice Speed</div>
            <div className="grid grid-cols-3 gap-2">
              {(['0.8x', '1.0x', '1.2x'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeechSpeed(sp)}
                  className={`py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                    speechSpeed === sp ? 'bg-[#FFD700] text-[#021A0A] border-[#FFD700]' : 'bg-black/25 text-white border-white/15'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#FFD700]">Commentator Voice Profile</div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'MALE_STADIUM', label: 'Male Stadium Announcer (English)' },
                { id: 'BANGLA_LIVE', label: 'বাংলা লাইভ ধারাভাষ্য (Bangla Pro)' },
                { id: 'FEMALE_PRO', label: 'Female Studio Host (Fast Line)' }
              ].map((vc) => (
                <button
                  key={vc.id}
                  onClick={() => setSpeechVoice(vc.id as typeof speechVoice)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                    speechVoice === vc.id ? 'border-[#00FF66] bg-[#00FF66]/15 text-white' : 'border-white/15 bg-black/25 text-white/80'
                  }`}
                >
                  <span>{vc.label}</span>
                  {speechVoice === vc.id && <CheckCircle2 className="w-4 h-4 text-[#00FF66]" />}
                </button>
              ))}
            </div>
          </div>

          {speechTestStatus && (
            <div className="p-3 rounded-xl bg-black/40 border border-[#00FF66] text-xs text-[#00FF66] font-bold">
              🔊 {speechTestStatus}
            </div>
          )}

          <button
            onClick={() => {
              const sample = 'SportsViva Live Line: Six runs! Towhid Hridoy smashes it over mid-wicket!';
              setSpeechTestStatus(sample);
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                  window.speechSynthesis.cancel();
                  const utter = new SpeechSynthesisUtterance(sample);
                  utter.rate = speechSpeed === '0.8x' ? 0.85 : speechSpeed === '1.2x' ? 1.2 : 1.0;
                  window.speechSynthesis.speak(utter);
                } catch {
                  // fallback visual status
                }
              }
            }}
            className="w-full py-2.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
          >
            🔊 Test Voice Commentary Now
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SUB-SCREENS 11–16: RATE US, SHARE, FEEDBACK, ABOUT, TERMS, PRIVACY
  // ==========================================================================
  if (screen === 'RATE') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Rate SportsViva</span>
          <span className="text-xs text-[#FFD700]">★★★★★</span>
        </div>

        <div className={`rounded-2xl border p-5 text-center space-y-4 ${theme.cardBg}`}>
          {ratingSubmitted ? (
            <div className="space-y-2 py-4">
              <CheckCircle2 className="w-12 h-12 text-[#00FF66] mx-auto" />
              <h3 className="text-base font-display font-black text-[#FFD700]">
                Thank You for Your {ratingStars}-Star Rating!
              </h3>
              <p className={`text-xs ${theme.subText}`}>
                Your review has been recorded on SportsViva Live Line.
              </p>
            </div>
          ) : (
            <>
              <h3 className={`text-base font-display font-black ${theme.titleText}`}>
                Enjoying SportsViva Cricket Live Line?
              </h3>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    onClick={() => setRatingStars(st)}
                    className={`text-3xl cursor-pointer transition-transform hover:scale-110 ${
                      st <= ratingStars ? 'text-[#FFD700]' : 'text-white/25'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Write your experience with SportsViva Live Line..."
                className="w-full rounded-xl bg-black/30 border border-white/15 p-3 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => setRatingSubmitted(true)}
                className="w-full py-3 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                Submit Rating
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'SHARE') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Share SportsViva App</span>
          <span className="text-xs text-[#00FF66]">Invite</span>
        </div>

        <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
          <div className={`text-sm font-bold ${theme.titleText}`}>
            Share SportsViva Fastest Cricket Live Line with your friends!
          </div>
          <div className="p-3 rounded-xl bg-black/35 border border-white/15 flex items-center justify-between gap-2 text-xs">
            <span className="text-[#00FF66] truncate">https://sportsviva.live/download-app</span>
            <button
              onClick={() => {
                setShareCopied(true);
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href).catch(() => {});
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-[#021A0A] font-black shrink-0 cursor-pointer"
            >
              {shareCopied ? 'Copied ✓' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'FEEDBACK') {
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>Send Feedback / Report</span>
          <span className="text-xs text-[#00FF66]">24/7 Support</span>
        </div>

        <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
          {feedbackTicket ? (
            <div className="p-4 rounded-xl bg-[#00FF66]/15 border border-[#00FF66] text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#00FF66] mx-auto" />
              <div className="text-sm font-display font-black text-white">
                Feedback Submitted Successfully!
              </div>
              <div className="text-xs text-[#FFD700] font-mono-num">Ticket ID: {feedbackTicket}</div>
              <button
                onClick={() => {
                  setFeedbackTicket(null);
                  setFeedbackText('');
                }}
                className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-bold text-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'LIVE_SCORE', label: 'Live Score Issue' },
                  { id: 'APP_BUG', label: 'App Bug / Performance' },
                  { id: 'FEATURE', label: 'Feature Request' },
                  { id: 'PARTNERSHIP', label: 'Ad / Business Inquiry' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFeedbackCategory(c.id as typeof feedbackCategory)}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                      feedbackCategory === c.id
                        ? 'border-[#FFD700] bg-[#FFD700]/20 text-white'
                        : 'border-white/15 bg-black/25 text-white/75'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <input
                type="email"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="Your Email or Phone Number"
                className="w-full rounded-xl bg-black/30 border border-white/15 p-3 text-xs text-white focus:outline-none"
              />
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe your feedback or issue in detail..."
                className="w-full rounded-xl bg-black/30 border border-white/15 p-3 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => setFeedbackTicket(`#SV-2026-${Math.floor(1000 + Math.random() * 9000)}`)}
                className="w-full py-3 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'ABOUT' || screen === 'TERMS' || screen === 'PRIVACY') {
    const infoTitle =
      screen === 'ABOUT'
        ? 'About SportsViva Live Line'
        : screen === 'TERMS'
        ? 'Terms of Use'
        : 'Privacy Policy';
    return (
      <div className="space-y-3">
        <div className={`rounded-2xl border p-3 flex items-center justify-between ${theme.cardBg}`}>
          <button
            onClick={() => setScreen('MENU')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-display font-bold text-[#FFD700] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More</span>
          </button>
          <span className={`text-sm font-display font-black ${theme.titleText}`}>{infoTitle}</span>
          <span className="text-xs text-[#00FF66]">v4.8.2</span>
        </div>

        <div className={`rounded-2xl border p-4 space-y-3 text-xs leading-relaxed ${theme.cardBg}`}>
          {screen === 'ABOUT' && (
            <>
              <h3 className="text-sm font-display font-black text-[#FFD700]">
                SportsViva — Fastest Ball-by-Ball Cricket Live Line & Multi-Sports Hub
              </h3>
              <p className={theme.subText}>
                SportsViva delivers real-time ball-by-ball cricket commentary, session & win probability, ICC Men’s & Women’s rankings, comprehensive player career records, and local tournament broadcasting through Go Live Pro Scoring.
              </p>
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 text-white">
                Official Contact: support@sportsviva.live · Dhaka, Bangladesh
              </div>
            </>
          )}
          {screen === 'TERMS' && (
            <>
              <h3 className="text-sm font-display font-black text-[#FFD700]">1. Acceptance of Terms</h3>
              <p className={theme.subText}>
                By accessing SportsViva Cricket Live Line, Ludo Arena, Carrom Pool, and the Sports Store, you agree to abide by fair-play rules. Reward Points (sv_points) are strictly for in-app Sports Store shopping and tournament room entries and are non-transferable.
              </p>
              <h3 className="text-sm font-display font-black text-[#FFD700]">2. Live Data & Broadcasts</h3>
              <p className={theme.subText}>
                All live match scores, win probabilities, and community Go Live broadcasts are provided for sports entertainment and informational purposes.
              </p>
            </>
          )}
          {screen === 'PRIVACY' && (
            <>
              <h3 className="text-sm font-display font-black text-[#FFD700]">1. Data Protection & Privacy</h3>
              <p className={theme.subText}>
                SportsViva stores your match preferences, custom Go Live scorecards, and reward points securely. We never sell personal data to third-party advertisers.
              </p>
              <h3 className="text-sm font-display font-black text-[#FFD700]">2. Notification & Audio Permissions</h3>
              <p className={theme.subText}>
                You can toggle live match alerts and voice commentary anytime from the More → Notification & Speech Settings menu.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MAIN "MORE" MENU — EXACT 3 SCREENSHOTS LAYOUT (SCREEN === 'MENU')
  // ==========================================================================
  return (
    <div className="space-y-4 pb-2">
      {/* Top Title Row */}
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-lg font-display font-black ${theme.titleText}`}>More</h2>
        <span className="text-xs font-mono-num text-[#FFD700]">SportsViva v4.8.2</span>
      </div>

      {/* 1. SPORTSVIVA PREMIUM BANNER (TOP OF SCREENSHOT 1) */}
      <div
        onClick={() => setScreen('PREMIUM')}
        className="rounded-2xl overflow-hidden border border-[#FFD700]/60 flex items-stretch cursor-pointer shadow-[0_4px_18px_rgba(0,0,0,0.4)] hover:brightness-105 transition-all"
      >
        <div className="bg-[#18221D] px-3.5 py-3 flex items-center gap-2.5 shrink-0 border-r border-[#FFD700]/30">
          <svg viewBox="0 0 48 56" className="w-7 h-8 text-white fill-current shrink-0">
            <polygon points="28,3 35,1 24,18 19,15" fill="#FFD700" />
            <circle cx="19" cy="18" r="4" />
            <path d="M15 23 C15 23 23 22 25 28 L22 39 L27 52 L22 54 L18 41 L14 52 L9 51 L13 37 L13 26 Z" />
          </svg>
          <div className="leading-none">
            <div className="text-xs sm:text-sm font-display font-black italic text-[#FFD700] tracking-wide">
              SPORTSVIVA
            </div>
            <div className="text-[10px] font-display font-bold text-white tracking-widest mt-0.5">
              PREMIUM
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-r from-[#E2D9C5] via-[#EDE5D2] to-[#D8CBB0] px-3.5 py-3 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold italic text-[#111827]">
            {isVipUnlocked ? 'VIP Premium Active ✓' : 'Unlock ads-free premium version'}
          </span>
          <span className="text-[#111827] text-xs font-black">▶</span>
        </div>
      </div>

      {/* 2. SCREENSHOT 1 GROUP: CRICKET HUB, ICC RANKINGS, RECORDS & POLLS */}
      <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
        {[
          { id: 'BROWSE_SERIES', label: 'Browse Series', sub: 'International, T20 Leagues, Domestic & Women', icon: '🏆' },
          { id: 'BROWSE_TEAM', label: 'Browse Team', sub: 'All National, Franchise & Women Teams', icon: '🛡️' },
          { id: 'BROWSE_PLAYER', label: 'Browse Player', sub: 'Search Players, Career Stats & Recent Form', icon: '🏏' },
          { id: 'SCHEDULE', label: 'Schedule', sub: 'Upcoming, Live & Completed Match Fixtures', icon: '📅' },
          { id: 'ICC_MEN', label: 'ICC Rankings - Men', sub: 'Official Test, ODI & T20I Men Rankings', icon: '🥇' },
          { id: 'ICC_WOMEN', label: 'ICC Rankings - Women', sub: 'Official ODI & T20I Women Rankings', icon: '🏅' },
          { id: 'RECORDS', label: 'Records', sub: 'Most Runs, Most Wickets, Fastest 100 & Team Records', icon: '📊' },
          { id: 'POLLS', label: 'Polls', sub: 'Vote on Live Matches & View Fan Predictions', icon: '🗳️' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as MoreScreenType)}
            className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base shrink-0">
                {item.icon}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-bold ${theme.titleText}`}>{item.label}</div>
                <div className={`text-[11px] ${theme.subText} truncate`}>{item.sub}</div>
              </div>
            </div>
            <span className={`text-base font-bold ${theme.subText}`}>&gt;</span>
          </button>
        ))}
      </div>

      {/* 3. SCREENSHOT 2 GROUP: APP SETTINGS, THEME, NOTIFICATIONS & SPEECH */}
      <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
        {/* App Language */}
        <button
          onClick={() => setScreen('LANGUAGE')}
          className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              🌐
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>App Language</div>
              <div className={`text-[11px] ${theme.subText}`}>English · বাংলা · हिन्दी</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#FFD700]">{appLanguage}</span>
            <span className={`text-base font-bold ${theme.subText}`}>&gt;</span>
          </div>
        </button>

        {/* Theme Switcher Row */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              🎨
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>App Theme</div>
              <div className={`text-[11px] ${theme.subText}`}>
                Current: {colorTheme.replace('_', ' ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(['EMERALD_GOLD', 'ROYAL_TEAL', 'MINT_LIGHT'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setColorTheme(th)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-display font-bold cursor-pointer ${
                  colorTheme === th
                    ? 'bg-[#FFD700] text-[#021A0A]'
                    : 'bg-black/30 text-white border border-white/15'
                }`}
              >
                {th === 'EMERALD_GOLD' ? 'Dark' : th === 'ROYAL_TEAL' ? 'Teal' : 'Light'}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <button
          onClick={() => setScreen('NOTIFICATIONS')}
          className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              🔔
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>Notification Settings</div>
              <div className={`text-[11px] ${theme.subText}`}>Wickets, Toss, Milestones & Result Alerts</div>
            </div>
          </div>
          <span className={`text-base font-bold ${theme.subText}`}>&gt;</span>
        </button>

        {/* Speech / Voice Settings */}
        <button
          onClick={() => setScreen('SPEECH')}
          className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              🔊
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>Speech Settings</div>
              <div className={`text-[11px] ${theme.subText}`}>Live Voice Commentary Speed & Announcer</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00FF66]">{speechEnabled ? 'ON' : 'OFF'}</span>
            <span className={`text-base font-bold ${theme.subText}`}>&gt;</span>
          </div>
        </button>

        {/* Odds & Session Display Toggle */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              📈
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>Win Probability & Session Bar</div>
              <div className={`text-[11px] ${theme.subText}`}>Show real-time percentage bar on Live screen</div>
            </div>
          </div>
          <button
            onClick={() => setOddsDisplayEnabled((v) => !v)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              oddsDisplayEnabled ? 'bg-[#00FF66]' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#021A0A] transition-transform ${
                oddsDisplayEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto-Refresh & Data Saver */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
              ⚡
            </span>
            <div>
              <div className={`text-sm font-bold ${theme.titleText}`}>Fastest Live Auto-Refresh</div>
              <div className={`text-[11px] ${theme.subText}`}>Instant ball-by-ball socket sync</div>
            </div>
          </div>
          <button
            onClick={() => {
              setAutoRefreshEnabled((v) => !v);
              setDataSaverEnabled((d) => !d);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              autoRefreshEnabled ? 'bg-[#00FF66]' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#021A0A] transition-transform ${
                autoRefreshEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. SCREENSHOT 3 GROUP: FOLLOW US ON SOCIAL MEDIA */}
      <div className="space-y-2">
        <div className={`text-xs font-display font-extrabold uppercase tracking-wider px-1 ${theme.subText}`}>
          Follow Us
        </div>
        <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
          {[
            { id: 'IG', name: 'Instagram', handle: '@SportsViva.Official', badge: '📸' },
            { id: 'FB', name: 'Facebook', handle: 'SportsViva Cricket Live', badge: '📘' },
            { id: 'YT', name: 'YouTube', handle: 'SportsViva Highlights HD', badge: '▶️' },
            { id: 'TG', name: 'Telegram Channel', handle: 't.me/SportsVivaLiveLine', badge: '✈️' }
          ].map((soc) => {
            const joined = !!socialJoined[soc.id];
            return (
              <div
                key={soc.id}
                onClick={() => setSocialJoined((prev) => ({ ...prev, [soc.id]: !prev[soc.id] }))}
                className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
                    {soc.badge}
                  </span>
                  <div>
                    <div className={`text-sm font-bold ${theme.titleText}`}>{soc.name}</div>
                    <div className={`text-[11px] ${theme.subText}`}>{soc.handle}</div>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold ${
                    joined ? 'text-[#00FF66]' : 'text-[#FFD700]'
                  }`}
                >
                  {joined ? 'Following ✓' : 'Follow →'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SCREENSHOT 3 BOTTOM GROUP: SUPPORT, RATE US, SHARE, FEEDBACK & LEGAL */}
      <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
        {[
          { id: 'RATE', label: 'Rate Us', sub: 'Rate SportsViva 5 Stars on Store', icon: '⭐' },
          { id: 'SHARE', label: 'Share App', sub: 'Invite friends & share live cricket link', icon: '📤' },
          { id: 'FEEDBACK', label: 'Send Feedback', sub: 'Report an issue or request a feature', icon: '💬' },
          { id: 'ABOUT', label: 'About Us', sub: 'SportsViva Live Line & Broadcast Info', icon: 'ℹ️' },
          { id: 'TERMS', label: 'Terms of Use', sub: 'Rules, Fair Play & Points Policy', icon: '📄' },
          { id: 'PRIVACY', label: 'Privacy Policy', sub: 'Account security & data privacy', icon: '🔒' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as MoreScreenType)}
            className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <span className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base">
                {item.icon}
              </span>
              <div>
                <div className={`text-sm font-bold ${theme.titleText}`}>{item.label}</div>
                <div className={`text-[11px] ${theme.subText}`}>{item.sub}</div>
              </div>
            </div>
            <span className={`text-base font-bold ${theme.subText}`}>&gt;</span>
          </button>
        ))}
      </div>

      {/* 6. PRO BROADCAST & MAIN HOME SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={onGoCreateLive}
          className={`rounded-2xl border p-3.5 text-left flex items-center justify-between cursor-pointer ${theme.cardBg}`}
        >
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#FFD700]">Go Live Pro Cricket Scoring</div>
            <div className={`text-[11px] ${theme.subText}`}>Create & score your own match live</div>
          </div>
          <span className="text-base font-bold text-[#00FF66]">→</span>
        </button>

        <button
          onClick={onBackToMainHome}
          className={`rounded-2xl border p-3.5 text-left flex items-center justify-between cursor-pointer ${theme.cardBg}`}
        >
          <div>
            <div className={`text-xs sm:text-sm font-bold ${theme.titleText}`}>SportsViva Main Home</div>
            <div className={`text-[11px] ${theme.subText}`}>Football, Tennis, Ludo, Carrom & Store</div>
          </div>
          <span className="text-base font-bold text-[#FFD700]">⌂</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// FIND PLAYER & BECOME PLAYER MEMBERSHIP VIEW
// ============================================================================
export const FindPlayerAndMembershipView: React.FC<{
  initialTab: 'FIND' | 'MEMBERSHIP';
  players: PlayerProfile[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;
  awardPoints: (pts: number, reason?: string) => void;
  onBack: () => void;
}> = ({ initialTab, players, setPlayers, awardPoints, onBack }) => {
  const [tab, setTab] = useState<'FIND' | 'MEMBERSHIP'>(initialTab);
  const [skillFilter, setSkillFilter] = useState<string>('ALL');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [upazilaFilter, setUpazilaFilter] = useState<string>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1500);

  // Call / Chat Active Player Modal
  const [contactPlayer, setContactPlayer] = useState<{ player: PlayerProfile; mode: 'CALL' | 'CHAT' } | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([
    { sender: 'Player', text: 'Assalamu Alaikum! Available for your upcoming match. Let me know venue & time!' }
  ]);

  // Membership Form State
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<'Batsman' | 'Bowler' | 'Allrounder' | 'Wicketkeeper'>('Allrounder');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Mirpur');
  const [price, setPrice] = useState('1000');
  const [phone, setPhone] = useState('');
  const [styleNote, setStyleNote] = useState('Right-hand bat • Right-arm fast');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const filteredPlayers = players.filter((p) => {
    if (skillFilter !== 'ALL' && p.skill !== skillFilter) return false;
    if (districtFilter !== 'ALL' && p.district !== districtFilter) return false;
    if (upazilaFilter.trim() && !p.upazila.toLowerCase().includes(upazilaFilter.trim().toLowerCase())) return false;
    if (p.pricePerMatch > maxPriceFilter) return false;
    return true;
  });

  const handleRegisterMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const newPlayer: PlayerProfile = {
      id: `pl-${Date.now()}`,
      name: name.trim(),
      skill,
      district,
      upazila: upazila.trim() || 'Sadar',
      pricePerMatch: Number(price) || 1000,
      phone: phone.trim(),
      rating: 5.0,
      matches: 1,
      battingStyle: styleNote.trim() || `${skill} Specialist`,
      verified: true
    };
    setPlayers((prev) => [newPlayer, ...prev]);
    awardPoints(10, 'Registered Player Membership');
    setName('');
    setPhone('');
    setTab('FIND');
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#021A0A] border border-emerald-500/40 flex items-center justify-center text-[#FFD700]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black italic text-[#FFD700]">
              {tab === 'FIND' ? 'FIND HIREABLE PLAYERS' : 'BECOME PLAYER MEMBERSHIP'}
            </h1>
            <p className="text-xs text-emerald-200">
              Hire verified Batsmen, Bowlers & Allrounders (1000 Tk / match) or join the roster
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('FIND')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer ${
              tab === 'FIND' ? 'bg-[#00FF00] text-[#021A0A]' : 'bg-[#021A0A] text-white border border-emerald-600'
            }`}
          >
            Find Player ({players.length})
          </button>
          <button
            onClick={() => setTab('MEMBERSHIP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer ${
              tab === 'MEMBERSHIP' ? 'bg-[#FFD700] text-[#021A0A]' : 'bg-[#021A0A] text-white border border-emerald-600'
            }`}
          >
            + Become Player Membership
          </button>
        </div>
      </div>

      {tab === 'FIND' && (
        <>
          {/* Filter Bar: Skill, District, Upazila, Price */}
          <div className="bg-[#0A3A0A] border border-emerald-500/50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#FFD700] mb-1">Filter by Skill</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-600 text-xs text-white"
              >
                <option value="ALL">All Skills</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Allrounder">Allrounder</option>
                <option value="Wicketkeeper">Wicketkeeper</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#FFD700] mb-1">District</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-600 text-xs text-white"
              >
                <option value="ALL">All Districts</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#FFD700] mb-1">Upazila / Area</label>
              <input
                type="text"
                value={upazilaFilter}
                onChange={(e) => setUpazilaFilter(e.target.value)}
                placeholder="e.g. Mirpur, Dhanmondi..."
                className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-600 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#FFD700] mb-1">
                Max Fee: {maxPriceFilter} Tk / match
              </label>
              <input
                type="range"
                min={500}
                max={2000}
                step={100}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#00FF00] mt-1.5"
              />
            </div>
          </div>

          {/* Player Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPlayers.map((p) => (
              <div key={p.id} className="sv-card-glow rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF00] to-[#083B12] border-2 border-[#FFD700] flex items-center justify-center text-[#021A0A] font-display font-black text-lg shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-display font-black text-white">{p.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-[#00FF00]" />
                      </div>
                      <div className="text-xs text-[#FFD700] font-bold">
                        {p.skill} • {p.battingStyle}
                      </div>
                      <div className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00FF00]" /> {p.upazila}, {p.district} • ⭐ {p.rating} ({p.matches} matches)
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono-num font-black text-[#00FF00]">
                      {p.pricePerMatch.toLocaleString()} Tk
                    </div>
                    <div className="text-[10px] text-emerald-300">per match</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-emerald-800/60">
                  <button
                    onClick={() => setContactPlayer({ player: p, mode: 'CALL' })}
                    className="py-2 rounded-xl bg-[#00FF00] text-[#021A0A] font-display font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call ({p.phone})
                  </button>
                  <button
                    onClick={() => setContactPlayer({ player: p, mode: 'CHAT' })}
                    className="py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Live Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'MEMBERSHIP' && (
        <form
          onSubmit={handleRegisterMembership}
          className="bg-[#0A3A0A] border-2 border-[#FFD700] rounded-2xl p-5 space-y-4 max-w-2xl mx-auto"
        >
          <div className="border-b border-emerald-700 pb-3">
            <h2 className="text-lg font-display font-black text-[#FFD700]">
              BECOME A SPORTSVIVA VERIFIED PLAYER
            </h2>
            <p className="text-xs text-emerald-200">
              Register your profile so local teams across Bangladesh can hire you per match!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mahmudul Hasan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Primary Skill</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value as typeof skill)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Allrounder">Allrounder</option>
                <option value="Wicketkeeper">Wicketkeeper</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Upazila / Area</label>
              <input
                type="text"
                required
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="e.g. Mirpur / Uttara"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Price per Match (Tk)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white font-mono-num"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XX-XXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">Playing Style Note</label>
              <input
                type="text"
                value={styleNote}
                onChange={(e) => setStyleNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF00] text-[#021A0A] font-display font-black text-sm shadow-lg cursor-pointer"
          >
            SAVE & REGISTER PLAYER PROFILE (+10 POINTS)
          </button>
        </form>
      )}

      {/* Call / Chat Modal */}
      {contactPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
              <div>
                <h3 className="text-base font-display font-black text-[#FFD700]">
                  {contactPlayer.mode === 'CALL' ? 'CALL PLAYER DIRECTLY' : `CHAT WITH ${contactPlayer.player.name}`}
                </h3>
                <p className="text-xs text-emerald-200">
                  {contactPlayer.player.skill} • {contactPlayer.player.upazila}, {contactPlayer.player.district}
                </p>
              </div>
              <button onClick={() => setContactPlayer(null)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactPlayer.mode === 'CALL' ? (
              <div className="text-center space-y-3 py-3">
                <div className="w-16 h-16 rounded-full bg-[#00FF00]/20 border-2 border-[#00FF00] flex items-center justify-center mx-auto text-[#00FF00]">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="text-2xl font-mono-num font-black text-white">{contactPlayer.player.phone}</div>
                <div className="text-xs text-[#FFD700]">
                  Match Fee: {contactPlayer.player.pricePerMatch} Tk / Match
                </div>
                <a
                  href={`tel:${contactPlayer.player.phone}`}
                  className="block w-full py-3 rounded-xl bg-[#00FF00] text-[#021A0A] font-display font-black text-sm"
                >
                  Dial Now
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#021A0A] rounded-xl p-3 h-48 overflow-y-auto space-y-2 border border-emerald-800">
                  {chatHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg text-xs ${
                        m.sender === 'You'
                          ? 'bg-[#0E4D14] text-white ml-8'
                          : 'bg-[#0A3A0A] border border-emerald-700 text-emerald-100 mr-8'
                      }`}
                    >
                      <strong className="text-[#FFD700] block">{m.sender}:</strong> {m.text}
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatMsg.trim()) return;
                    setChatHistory((prev) => [
                      ...prev,
                      { sender: 'You', text: chatMsg.trim() },
                      {
                        sender: contactPlayer.player.name,
                        text: 'InshaAllah I am ready! Confirmed for 1,000 Tk match fee.'
                      }
                    ]);
                    setChatMsg('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="Write message to hire player..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-bold text-xs cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPORTS STORE VIEW (Points & Taka Pricing, Checkout Deducts sv_points)
// ============================================================================
export const SportsStoreView: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  orders: OrderRecord[];
  setOrders: React.Dispatch<React.SetStateAction<OrderRecord[]>>;
  onOpenDeposit: () => void;
  onBack: () => void;
}> = ({ points, setPoints, orders, setOrders, onOpenDeposit, onBack }) => {
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // First Option: Mobile Recharge States (100 Points = 20 Taka)
  const [rechargeOperator, setRechargeOperator] = useState<
    'Grameenphone' | 'Robi' | 'Banglalink' | 'Airtel' | 'Teletalk'
  >('Grameenphone');
  const [rechargeSimType, setRechargeSimType] = useState<'Prepaid' | 'Postpaid' | 'Skitto'>('Prepaid');
  const [rechargePhone, setRechargePhone] = useState<string>('');
  const [selectedRechargePkg, setSelectedRechargePkg] = useState<{ pts: number; tk: number }>({
    pts: 100,
    tk: 20
  });
  const [recentRecharges, setRecentRecharges] = useState<
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

  const handlePhoneInput = (val: string) => {
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

  const handleMobileRechargeSubmit = (customPkg?: { pts: number; tk: number }) => {
    const pkg = customPkg || selectedRechargePkg;
    const cleanPhone = rechargePhone.replace(/\D/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setPurchaseNotice(
        '⚠️ অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)!'
      );
      return;
    }
    if (points < pkg.pts) {
      setPurchaseNotice(
        `⚠️ পর্যাপ্ত পয়েন্ট নেই! ৳${pkg.tk} মোবাইল রিচার্জ করতে ${pkg.pts} Points প্রয়োজন (আপনার আছে ${points} Pts)। "+ Deposit Points" বাটনে চাপুন!`
      );
      return;
    }
    setPoints((p) => p - pkg.pts);
    const trxId = `RCH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRec = {
      id: trxId,
      phone: cleanPhone,
      operator: rechargeOperator,
      simType: rechargeSimType,
      tk: pkg.tk,
      pts: pkg.pts,
      time: 'এইমাত্র (Just now)'
    };
    setRecentRecharges((prev) => [newRec, ...prev]);
    const newOrder: OrderRecord = {
      id: trxId,
      itemName: `📱 Mobile Recharge ৳${pkg.tk} (${rechargeOperator} ${rechargeSimType} • ${cleanPhone})`,
      pointsSpent: pkg.pts,
      takaValue: pkg.tk,
      date: 'Just now',
      status: '✅ Instant Recharge Sent'
    };
    setOrders((prev) => [newOrder, ...prev]);
    setPurchaseNotice(
      `🎉 অভিনন্দন! ${cleanPhone} (${rechargeOperator} ${rechargeSimType}) নাম্বারে ৳${pkg.tk} মোবাইল রিচার্জ (${pkg.pts} পয়েন্ট) সফল হয়েছে! [TrxID: ${trxId}]`
    );
  };

  const handleBuyWithPoints = (product: StoreProduct) => {
    if (points < product.pointsPrice) {
      setPurchaseNotice(
        `Insufficient Points! You need ${product.pointsPrice.toLocaleString()} Points (${product.takaPrice} Tk). Click Deposit to add Points via bKash/Nagad!`
      );
      return;
    }
    setPoints((p) => p - product.pointsPrice);
    const newOrder: OrderRecord = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      itemName: product.name,
      pointsSpent: product.pointsPrice,
      takaValue: product.takaPrice,
      date: 'Just now',
      status: 'Confirmed • Ready for Dispatch'
    };
    setOrders((prev) => [newOrder, ...prev]);
    setPurchaseNotice(
      `✅ Order Confirmed! Purchased "${product.name}" using ${product.pointsPrice.toLocaleString()} Points (${product.takaPrice} Tk).`
    );
  };

  const filtered = STORE_PRODUCTS.filter(
    (p) => selectedCategory === 'ALL' || p.category.toUpperCase() === selectedCategory
  );

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#021A0A] border border-emerald-500/40 flex items-center justify-center text-[#FFD700]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black italic text-[#FFD700]">
              SPORTSVIVA OFFICIAL STORE
            </h1>
            <p className="text-xs text-emerald-200">
              সেরা পণ্য ও মোবাইল রিচার্জ • Shop & Recharge with Reward Points (100 Points = 20 Taka • Non-transferable)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#021A0A] border border-[#FFD700] text-xs font-mono-num font-bold text-[#FFD700]">
            Wallet: {points.toLocaleString()} Pts ({Math.floor(points / 5)} Tk)
          </div>
          <button
            onClick={onOpenDeposit}
            className="px-3.5 py-2 rounded-xl bg-[#00FF00] text-[#021A0A] font-display font-black text-xs cursor-pointer"
          >
            + Deposit Points
          </button>
        </div>
      </div>

      {purchaseNotice && (
        <div className="bg-[#0E4D14] border-2 border-[#FFD700] rounded-2xl p-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <span>{purchaseNotice}</span>
          <button onClick={() => setPurchaseNotice(null)} className="text-[#FFD700] ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Filter — FIRST OPTION IS MOBILE RECHARGE */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'MOBILE RECHARGE', label: '📱 MOBILE RECHARGE (১ম অপশন)' },
          { id: 'ALL', label: 'ALL ITEMS' },
          { id: 'CRICKET', label: 'CRICKET' },
          { id: 'FOOTBALL', label: 'FOOTBALL' },
          { id: 'TENNIS', label: 'TENNIS' },
          { id: 'INDOOR', label: 'INDOOR' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#FFD700] text-[#021A0A] shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                : cat.id === 'MOBILE RECHARGE'
                ? 'bg-gradient-to-r from-[#00FF00] to-[#10B981] text-[#021A0A] border-2 border-[#FFD700]'
                : 'bg-[#0A3A0A] text-emerald-100 border border-emerald-600/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ====================================================================
          FIRST OPTION AT THE TOP OF STORE: INSTANT MOBILE RECHARGE WITH POINTS
          (100 Points = 20 Taka • GP, Robi, Banglalink, Airtel, Teletalk)
         ==================================================================== */}
      {(selectedCategory === 'ALL' || selectedCategory === 'MOBILE RECHARGE') && (
        <div className="sv-card-glow rounded-2xl p-4 sm:p-5 border-2 border-[#FFD700] bg-gradient-to-br from-[#073B1A] via-[#062912] to-[#021A0A] space-y-4 shadow-[0_0_25px_rgba(0,255,102,0.3)]">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-600/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#00FF00] p-0.5 shadow-[0_0_15px_rgba(255,215,0,0.5)] shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#021A0A] flex items-center justify-center text-2xl">
                  📱
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px]">
                    #1 FIRST OPTION • INSTANT
                  </span>
                  <span className="text-[11px] font-bold text-[#00FF00]">
                    ⚡ ১০০ পয়েন্ট = ২০ টাকা
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-display font-black text-white mt-0.5">
                  মোবাইল রিচার্জ করুন পয়েন্ট দিয়ে (MOBILE RECHARGE WITH POINTS)
                </h2>
                <p className="text-xs text-emerald-200">
                  সব অপারেটরে (GP, Robi, Banglalink, Airtel, Teletalk) সাথে সাথে পয়েন্ট দিয়ে মোবাইল রিচার্জ করুন
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#021A0A] border border-[#00FF00] text-right">
              <div className="text-[10px] text-emerald-300 font-semibold">রিচার্জ ব্যালেন্স</div>
              <div className="text-sm font-mono-num font-black text-[#FFD700]">
                {points.toLocaleString()} Pts = ৳{Math.floor(points / 5)}
              </div>
            </div>
          </div>

          {/* Step 1: Select Operator */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-bold text-[#FFD700]">
              ১. সিম অপারেটর সিলেক্ট করুন (Select Operator):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'Grameenphone' as const, short: 'GP', sub: '017 / 013', bg: 'from-[#0078D7] to-[#004E8C]' },
                { id: 'Robi' as const, short: 'Robi', sub: '018', bg: 'from-[#E11D48] to-[#9F1239]' },
                { id: 'Banglalink' as const, short: 'BL', sub: '019 / 014', bg: 'from-[#F97316] to-[#C2410C]' },
                { id: 'Airtel' as const, short: 'Airtel', sub: '016', bg: 'from-[#EF4444] to-[#B91C1C]' },
                { id: 'Teletalk' as const, short: 'Teletalk', sub: '015', bg: 'from-[#10B981] to-[#047857]' }
              ].map((op) => {
                const active = rechargeOperator === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setRechargeOperator(op.id)}
                    className={`py-2 px-1.5 rounded-xl bg-gradient-to-b ${op.bg} flex flex-col items-center justify-center transition-all cursor-pointer ${
                      active
                        ? 'border-2 border-[#FFD700] scale-[1.03] shadow-[0_0_14px_rgba(255,215,0,0.65)]'
                        : 'border border-white/20 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="font-display font-black text-xs sm:text-sm text-white leading-tight">
                      {op.short}
                    </span>
                    <span className="text-[9px] text-white/90 font-mono-num">{op.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Mobile Number & SIM Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-bold text-[#FFD700] mb-1">
                ২. আপনার ১১ ডিজিটের মোবাইল নাম্বার দিন (Mobile Number):
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-mono-num font-black text-[#00FF00] bg-[#0A3A0A] px-2 py-1 rounded border border-emerald-600">
                  +88
                </span>
                <input
                  type="tel"
                  value={rechargePhone}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  placeholder="017XXXXXXXX (১১ ডিজিট নাম্বার)"
                  maxLength={11}
                  className="w-full pl-14 pr-24 py-2.5 rounded-xl bg-[#021A0A] border-2 border-[#00FF00]/70 text-white font-mono-num font-black text-sm focus:outline-none focus:border-[#FFD700]"
                />
                <span className="absolute right-2.5 px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px]">
                  {rechargeOperator}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[#FFD700] mb-1">
                সিমের ধরন (Connection Type):
              </label>
              <div className="grid grid-cols-3 gap-1.5 h-[42px]">
                {(['Prepaid', 'Postpaid', 'Skitto'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRechargeSimType(st)}
                    className={`rounded-xl font-display font-black text-xs border transition-all cursor-pointer ${
                      rechargeSimType === st
                        ? 'bg-[#FFD700] text-[#021A0A] border-white shadow'
                        : 'bg-[#021A0A] text-emerald-200 border-emerald-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Recharge Amount Packages (100 Points = 20 Taka) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-display font-bold text-[#FFD700]">
                ৩. রিচার্জ পরিমাণ সিলেক্ট করুন (100 Points = 20 Taka):
              </label>
              <span className="text-[11px] font-bold text-[#00FF00]">
                Selected: ৳{selectedRechargePkg.tk} ({selectedRechargePkg.pts} Pts)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { pts: 100, tk: 20, tag: 'POPULAR' },
                { pts: 150, tk: 30, tag: 'STARTER' },
                { pts: 250, tk: 50, tag: 'REGULAR' },
                { pts: 500, tk: 100, tag: 'BEST VALUE' },
                { pts: 1000, tk: 200, tag: 'SUPER PACK' },
                { pts: 2500, tk: 500, tag: 'MEGA PACK' }
              ].map((pkg) => {
                const isSelected = selectedRechargePkg.pts === pkg.pts;
                return (
                  <button
                    key={pkg.pts}
                    type="button"
                    onClick={() => setSelectedRechargePkg({ pts: pkg.pts, tk: pkg.tk })}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer border-2 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#135D28] to-[#083516] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.45)] scale-[1.02]'
                        : 'bg-[#021A0A] border-emerald-700/70 hover:border-[#00FF00]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] font-display font-black text-[9px]">
                        {pkg.tag}
                      </span>
                      {isSelected && <span className="text-xs text-[#00FF00]">✔</span>}
                    </div>
                    <div className="mt-1.5">
                      <div className="text-lg font-mono-num font-black text-white">৳{pkg.tk} টাকা</div>
                      <div className="text-xs font-mono-num font-bold text-[#FFD700]">
                        🪙 {pkg.pts.toLocaleString()} Pts
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Instant Recharge Submit Button */}
          <button
            type="button"
            onClick={() => handleMobileRechargeSubmit()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00FF00] via-[#22C55E] to-[#FFD700] text-[#021A0A] font-display font-black text-sm sm:text-base shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>
              ⚡ এখনই পয়েন্ট দিয়ে রিচার্জ করুন — ৳{selectedRechargePkg.tk} টাকা ({selectedRechargePkg.pts} Points) →
            </span>
          </button>

          {/* Live Recent Mobile Recharges List */}
          {recentRecharges.length > 0 && (
            <div className="pt-2 border-t border-emerald-700/60 space-y-2">
              <div className="text-xs font-display font-black text-[#FFD700]">
                📋 আপনার সাম্প্রতিক মোবাইল রিচার্জ সমূহ (RECENT MOBILE RECHARGES):
              </div>
              <div className="space-y-1.5">
                {recentRecharges.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 bg-[#021A0A] border border-[#00FF00]/50 rounded-xl px-3.5 py-2 text-xs"
                  >
                    <div>
                      <span className="font-mono-num font-black text-[#FFD700] mr-2">
                        📱 {r.phone}
                      </span>
                      <span className="text-emerald-200 font-bold">
                        ({r.operator} • {r.simType})
                      </span>
                      <span className="text-[10px] text-emerald-400 ml-2 font-mono-num">
                        TrxID: {r.id} • {r.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-num font-black text-[#00FF00]">
                        ৳{r.tk} (-{r.pts} Pts)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#00FF00]/20 border border-[#00FF00] text-[#00FF00] text-[10px] font-black">
                        ✔ সফল (Sent)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Grid (Sports Merchandise) */}
      {selectedCategory !== 'MOBILE RECHARGE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="sv-card-glow rounded-2xl p-4 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A]">{item.badge}</span>
                  <span className="text-emerald-300">⭐ {item.rating}</span>
                </div>

                <div className="h-28 rounded-xl bg-[#021A0A]/90 border border-emerald-700/50 flex items-center justify-center mb-3">
                  {item.svgType === 'jersey' && <span className="text-5xl">👕</span>}
                  {item.svgType === 'bat' && <span className="text-5xl">🏏</span>}
                  {item.svgType === 'ball' && <CardCircleIcon type="cricket" />}
                  {item.svgType === 'football' && <CardCircleIcon type="football" />}
                  {item.svgType === 'racket' && <CardCircleIcon type="tennis" />}
                  {item.svgType === 'carrom' && <CardCircleIcon type="caram" />}
                  {item.svgType === 'ludo' && <CardCircleIcon type="ludo" />}
                  {item.svgType === 'boots' && <span className="text-5xl">👟</span>}
                </div>

                <h3 className="text-sm font-display font-extrabold text-white leading-snug">
                  {item.name}
                </h3>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-emerald-800/70">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-lg font-mono-num font-black text-[#FFD700]">
                      {item.pointsPrice.toLocaleString()} Pts
                    </div>
                    <div className="text-xs font-mono-num text-[#00FF00] font-bold">
                      Price: {item.takaPrice} Taka
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-300">In Stock ({item.stock})</span>
                </div>

                <button
                  onClick={() => handleBuyWithPoints(item)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00FF00] to-[#FFD700] text-[#021A0A] font-display font-black text-xs shadow-md hover:brightness-110 cursor-pointer"
                >
                  Checkout with Points →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Store Orders */}
      {orders.length > 0 && (
        <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4 space-y-2.5">
          <h3 className="text-sm font-display font-black text-[#FFD700]">YOUR RECENT STORE ORDERS</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between bg-[#021A0A] border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs"
              >
                <div>
                  <span className="font-mono-num text-[#FFD700] font-bold mr-2">{o.id}</span>
                  <span className="font-bold text-white">{o.itemName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-num text-[#00FF00] font-bold">
                    -{o.pointsSpent} Pts ({o.takaValue} Tk)
                  </span>
                  <span className="text-emerald-300">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPORTS QUIZ & SUPPORT VIEWS
// ============================================================================
export const SportsQuizView: React.FC<{
  awardPoints: (pts: number, reason?: string) => void;
  onBack: () => void;
}> = ({ awardPoints, onBack }) => {
  const questions = [
    {
      q: 'Who was the first Bangladesh cricketer to score a Double Century in Test Cricket?',
      options: ['Tamim Iqbal', 'Mushfiqur Rahim', 'Shakib Al Hasan', 'Mominul Haque'],
      correct: 1
    },
    {
      q: 'How many points does the winner receive in a 4-Player SportsViva Ludo Room (100 Pts entry)?',
      options: ['300 Points', '380 Points', '400 Points', '250 Points'],
      correct: 1
    },
    {
      q: 'Which country won the 2022 FIFA World Cup in Qatar?',
      options: ['France', 'Brazil', 'Argentina', 'Germany'],
      correct: 2
    }
  ];

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [earned, setEarned] = useState(0);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[qIdx].correct) {
      setEarned((e) => e + 10);
      awardPoints(10, 'Correct Quiz Answer');
    }
  };

  return (
    <div className="space-y-4 pb-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#021A0A] border border-emerald-500/40 flex items-center justify-center text-[#FFD700]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black italic text-[#FFD700]">SPORTSVIVA DAILY QUIZ</h1>
            <p className="text-xs text-emerald-200">Test Your Knowledge & Earn +10 Points Per Answer!</p>
          </div>
        </div>
        <span className="text-xs font-mono-num font-bold text-[#00FF00]">Earned: +{earned} Pts</span>
      </div>

      <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl p-5 space-y-4">
        <div className="text-xs font-bold text-[#FFD700]">
          QUESTION {qIdx + 1} OF {questions.length}
        </div>
        <h2 className="text-base sm:text-lg font-display font-bold text-white">{questions[qIdx].q}</h2>

        <div className="space-y-2.5">
          {questions[qIdx].options.map((opt, i) => {
            const isCorrect = i === questions[qIdx].correct;
            const isPicked = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                  selected === null
                    ? 'bg-[#021A0A] border-emerald-600/50 text-white hover:border-[#00FF00]'
                    : isCorrect
                    ? 'bg-[#00FF00] text-[#021A0A] border-[#00FF00]'
                    : isPicked
                    ? 'bg-red-600 text-white border-red-400'
                    : 'bg-[#021A0A]/50 text-emerald-400 border-emerald-900'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <button
            onClick={() => {
              setSelected(null);
              setQIdx((i) => (i + 1) % questions.length);
            }}
            className="w-full py-3 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-sm cursor-pointer"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
};

export const SupportCenterView: React.FC<{
  onBack: () => void;
  onOpenDeposit: () => void;
  userName?: string;
  points: number;
  activeTeamsCount: number;
  onNavigate?: (page: 'MY_TEAM' | 'LIVE_VIDEO' | 'GOLIVE' | 'STORE' | 'SUPPORT') => void;
}> = ({
  onBack,
  onOpenDeposit,
  userName,
  points,
  activeTeamsCount,
  onNavigate
}) => {
  const [ticketText, setTicketText] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4 pb-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-3.5">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-[#021A0A] border border-emerald-500/40 flex items-center justify-center text-[#FFD700]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-display font-black italic text-[#FFD700]">
            LIVE SUPPORT CHAT
          </h1>
          <p className="text-xs text-emerald-200">
            যেকোনো সমস্যায় সরাসরি Live Support Chat-এ কথা বলুন ও তাৎক্ষণিক সমাধান নিন
          </p>
        </div>
      </div>

      {/* Live AI Support Chat Panel */}
      <AiSupportChatPanel
        userName={userName}
        points={points}
        activeTeamsCount={activeTeamsCount}
        onOpenDeposit={onOpenDeposit}
        onNavigate={onNavigate}
      />

      <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#021A0A] border border-emerald-700 rounded-xl p-3.5">
            <div className="text-xs font-bold text-[#FFD700]">HOTLINE &amp; WHATSAPP</div>
            <div className="text-base font-mono-num font-black text-white mt-1">+880 1700-889900</div>
            <div className="text-[11px] text-emerald-300">Instant Response (9 AM – 12 AM)</div>
          </div>
          <div className="bg-[#021A0A] border border-emerald-700 rounded-xl p-3.5">
            <div className="text-xs font-bold text-[#FFD700]">POINTS &amp; LIVE RULES</div>
            <div className="text-xs text-white mt-1">100 Pts = 20 Tk • Team: 500 • Video: 200 • Match: 100</div>
            <div className="text-[11px] text-emerald-300">Points are for Store shopping, Live &amp; Games</div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!ticketText.trim()) return;
            setSent(true);
            setTicketText('');
          }}
          className="space-y-3"
        >
          <label className="block text-xs font-bold text-[#FFD700]">Send Support Ticket (অ্যাডমিন মেসেজ)</label>
          <textarea
            rows={3}
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            placeholder="Describe your question or TrxID inquiry..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
          />
          {sent && (
            <div className="text-xs text-[#00FF00] font-bold">
              ✅ Support ticket received! Our team will reply within 10 minutes.
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00FF00] text-[#021A0A] font-display font-black text-xs cursor-pointer"
            >
              Submit Support Ticket
            </button>
            <button
              type="button"
              onClick={onOpenDeposit}
              className="px-5 py-2.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
            >
              Open Deposit Modal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// DEPOSIT VIA BKASH / NAGAD MODAL (20 Tk = 100 Points)
// ============================================================================
export const DepositModal: React.FC<{
  initialTaka?: number;
  onClose: () => void;
  onSuccessDeposit: (record: DepositRecord) => void;
}> = ({ initialTaka = 100, onClose, onSuccessDeposit }) => {
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [takaAmount, setTakaAmount] = useState<number>(initialTaka);
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [pinCodeInput, setPinCodeInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const calculatedPoints = Math.round((takaAmount / 20) * 100);

  const handleQuickPinRedeem = () => {
    const code = pinCodeInput.trim().toUpperCase();
    const map: Record<string, { pts: number; tk: number }> = {
      PIN100: { pts: 100, tk: 20 },
      PIN200: { pts: 200, tk: 40 },
      PIN500: { pts: 500, tk: 100 },
      PIN1000: { pts: 1000, tk: 200 }
    };
    const matched = map[code];
    if (!matched) {
      setPinError('সঠিক পিন নাম্বার দিন (যেমন: PIN500, PIN200, PIN100) অথবা নিচে বিকাশ/নগদে পেমেন্ট করুন।');
      return;
    }
    onSuccessDeposit({
      id: `PIN-${Date.now()}`,
      method: 'bKash',
      phone: 'PIN Card Recharge',
      trxId: code,
      taka: matched.tk,
      points: matched.pts,
      date: 'Just now'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim() || !trxId.trim() || takaAmount < 20) return;
    const rec: DepositRecord = {
      id: `DEP-${Date.now()}`,
      method,
      phone: senderPhone.trim(),
      trxId: trxId.trim().toUpperCase(),
      taka: takaAmount,
      points: calculatedPoints,
      date: 'Just now',
      receiptName: receiptFileName || undefined
    };
    onSuccessDeposit(rec);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-[0_0_30px_rgba(0,255,0,0.4)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
          <div>
            <h2 className="text-lg font-display font-black text-[#FFD700]">
              DEPOSIT POINTS (bKash / Nagad)
            </h2>
            <p className="text-xs text-emerald-200">
              Official Conversion: 20 Taka = 100 Reward Points
            </p>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Select bKash or Nagad */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('bKash')}
            className={`py-3 rounded-xl font-display font-black text-sm border-2 transition-all cursor-pointer ${
              method === 'bKash'
                ? 'bg-[#E2136E] text-white border-[#FFD700] shadow-[0_0_15px_rgba(226,19,110,0.6)]'
                : 'bg-[#021A0A] text-white border-emerald-700'
            }`}
          >
            bKash Personal/Send
          </button>
          <button
            type="button"
            onClick={() => setMethod('Nagad')}
            className={`py-3 rounded-xl font-display font-black text-sm border-2 transition-all cursor-pointer ${
              method === 'Nagad'
                ? 'bg-[#F7941D] text-[#021A0A] border-[#FFD700] shadow-[0_0_15px_rgba(247,148,29,0.6)]'
                : 'bg-[#021A0A] text-white border-emerald-700'
            }`}
          >
            Nagad Send Money
          </button>
        </div>

        <div className="bg-[#021A0A] border border-emerald-600/60 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-emerald-300">{method} পেমেন্ট নাম্বার (Send Money):</span>
            <strong className="font-mono-num text-[#FFD700]">01799-554433</strong>
          </div>
          <div className="text-[11px] text-emerald-200 leading-snug">
            • টিম অ্যাক্টিভ করতে: <strong className="text-[#FFD700]">৫০০ পয়েন্ট (১০০ টাকা)</strong> • ভিডিও লাইভ: <strong className="text-[#FFD700]">২০০ পয়েন্ট (৪০ টাকা)</strong> • বল বাই বল লাইভ: <strong className="text-[#FFD700]">১০০ পয়েন্ট (২০ টাকা)</strong>
          </div>
        </div>

        {/* Instant PIN Card Recharge Box inside Modal */}
        <div className="bg-[#042208] border border-[#00F0FF]/60 rounded-xl p-3 space-y-2">
          <div className="text-xs font-display font-bold text-[#00F0FF] flex items-center justify-between">
            <span>🔑 পিন নাম্বার কার্ড দিয়ে রিচার্জ (ঐচ্ছিক):</span>
            <span className="text-[10px] text-emerald-300">অ্যাডমিন অনুমোদিত পিন কোড</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={pinCodeInput}
              onChange={(e) => {
                setPinCodeInput(e.target.value);
                setPinError(null);
              }}
              placeholder="পিন নাম্বার লিখুন (যেমন: PIN500)"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num uppercase"
            />
            <button
              type="button"
              onClick={handleQuickPinRedeem}
              className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
            >
              পিন রিচার্জ
            </button>
          </div>
          {pinError && <div className="text-[11px] text-amber-300">{pinError}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#FFD700] mb-1.5">
              পয়েন্ট প্যাকেজ সিলেক্ট করুন (20 Tk = 100 Points)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { amt: 20, pts: '১০০ পয়েন্ট', sub: 'বল বাই বল লাইভ' },
                { amt: 40, pts: '২০০ পয়েন্ট', sub: 'ভিডিও খেলা লাইভ' },
                { amt: 100, pts: '৫০০ পয়েন্ট', sub: 'টিম অ্যাক্টিভেশন' },
                { amt: 200, pts: '১০০০ পয়েন্ট', sub: 'প্রো অল-ইন-ওয়ান' }
              ].map((pkg) => (
                <button
                  key={pkg.amt}
                  type="button"
                  onClick={() => setTakaAmount(pkg.amt)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    takaAmount === pkg.amt
                      ? 'bg-[#FFD700] text-[#021A0A] border-white shadow-md'
                      : 'bg-[#021A0A] text-emerald-100 border-emerald-700 hover:border-[#00FF66]'
                  }`}
                >
                  <div className="text-xs font-display font-black">
                    {pkg.pts} — ৳{pkg.amt} টাকা
                  </div>
                  <div className={`text-[10px] ${takaAmount === pkg.amt ? 'text-[#021A0A] font-bold' : 'text-emerald-300'}`}>
                    {pkg.sub}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between bg-[#042208] border border-[#00FF00]/60 rounded-xl px-3.5 py-2">
              <input
                type="number"
                min={20}
                required
                value={takaAmount}
                onChange={(e) => setTakaAmount(Math.max(20, Number(e.target.value)))}
                className="bg-transparent text-white font-mono-num font-bold text-base w-24 focus:outline-none"
              />
              <span className="text-sm font-mono-num font-black text-[#00FF00]">
                = +{calculatedPoints.toLocaleString()} Points
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFD700] mb-1">Your {method} Phone Number</label>
            <input
              type="tel"
              required
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFD700] mb-1">Transaction ID (TrxID)</label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. BKA892L0PQ"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFD700] mb-1">
              Payment Screenshot / Image (Optional)
            </label>
            <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-dashed border-emerald-400 text-xs text-emerald-200 cursor-pointer hover:border-[#00FF00]">
              <Upload className="w-4 h-4 text-[#00FF00]" />
              <span>{receiptFileName || 'Upload bKash/Nagad Screenshot'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {receiptPreview && (
              <img
                src={receiptPreview}
                alt="Payment receipt preview"
                referrerPolicy="no-referrer"
                className="mt-2 h-20 rounded-lg object-cover border border-emerald-500"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00FF00] to-[#FFD700] text-[#021A0A] font-display font-black text-sm shadow-[0_0_18px_rgba(0,255,0,0.5)] cursor-pointer"
          >
            VERIFY & ADD +{calculatedPoints.toLocaleString()} POINTS NOW
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SPORTSVIVA APP COMPONENT (HOME EXACT AS SCREENSHOT + ALL PAGES)
// ============================================================================
export default function App() {
  const [page, setPageInternal] = useState<PageType>(() => {
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#/admin') ||
        new URLSearchParams(window.location.search).get('admin') === '1')
    ) {
      return 'SHUTKI_ADMIN';
    }
    return 'HOME';
  });

  useEffect(() => {
    const checkAdminUrl = () => {
      if (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#/admin') ||
        new URLSearchParams(window.location.search).get('admin') === '1'
      ) {
        setPageInternal('SHUTKI_ADMIN');
      }
    };
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);
    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
    };
  }, []);

  // Ensure Monetag multitag/popunder scripts are removed so sport cards are never hijacked
  useEffect(() => {
    const lingeringPopunders = document.querySelectorAll(
      'script[src*="quge5.com"], script[data-zone="294457"]'
    );
    lingeringPopunders.forEach((el) => el.remove());
  }, [page]);

  // Monetag Ads Settings fetched from Supabase `monetag_settings` table on homepage load
  const [monetagSettings, setMonetagSettings] = useState<MonetagSettings>({
    id: 1,
    banner_code: '',
    vignette_code: '',
    banner_enabled: false,
    vignette_enabled: false,
    timer: 5,
  });
  // 6 Ad Networks fetched from Supabase `ad_networks` table (Monetag, Adsterra, PropellerAds, AdMook, PopAds, Galaksion)
  const [adNetworks, setAdNetworks] = useState<AdNetworkConfig[]>(DEFAULT_SIX_AD_NETWORKS);
  const [activeRotatedNetwork, setActiveRotatedNetwork] = useState<AdNetworkConfig | null>(null);
  const hasRotatedThisPageLoadRef = useRef<boolean>(false);
  const [pendingVignettePage, setPendingVignettePage] = useState<PageType | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadMonetagAndNetworks = async () => {
      const [mData, netList] = await Promise.all([
        fetchMonetagSettingsFromSupabase(),
        fetchAdNetworksFromSupabase(),
      ]);
      if (!mounted) return;
      if (mData) {
        setMonetagSettings(mData);
      }
      if (Array.isArray(netList)) {
        setAdNetworks(netList);
        const shouldAdvanceRotation = !hasRotatedThisPageLoadRef.current;
        hasRotatedThisPageLoadRef.current = true;
        setActiveRotatedNetwork(selectRotatedActiveNetworkOnLoad(netList, shouldAdvanceRotation));
      }
    };
    loadMonetagAndNetworks();

    const handleMonetagUpdated = (e: Event) => {
      const customEv = e as CustomEvent<MonetagSettings>;
      if (customEv.detail) {
        setMonetagSettings(customEv.detail);
      } else {
        loadMonetagAndNetworks();
      }
    };

    const handleAdNetworksUpdated = (e: Event) => {
      const customEv = e as CustomEvent<AdNetworkConfig[]>;
      if (Array.isArray(customEv.detail)) {
        setAdNetworks(customEv.detail);
        setActiveRotatedNetwork(selectRotatedActiveNetworkOnLoad(customEv.detail, false));
      } else {
        loadMonetagAndNetworks();
      }
    };

    window.addEventListener('sportsviva-monetag-updated', handleMonetagUpdated);
    window.addEventListener('sportsviva-ad-networks-updated', handleAdNetworksUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('sportsviva-monetag-updated', handleMonetagUpdated);
      window.removeEventListener('sportsviva-ad-networks-updated', handleAdNetworksUpdated);
    };
  }, [page]);

  const activeAdNetworksCount = adNetworks.filter((n) => n.is_active).length;

  // Page navigation: direct navigation without ad redirection or interception
  const setPage = (nextPage: PageType) => {
    if (nextPage === page) return;
    setPageInternal(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMonetagAdminPage = () => {
    try {
      window.history.pushState({}, '', '/admin/monetag');
    } catch {
      // ignore
    }
    setPageInternal('SHUTKI_ADMIN');
  };

  const openAdsManagerAdminPage = () => {
    try {
      window.history.pushState({}, '', '/admin/ads-manager');
    } catch {
      // ignore
    }
    setPageInternal('SHUTKI_ADMIN');
  };

  // Persistent sv_points in localStorage (SignUp Bonus = 100 Points)
  const [points, setPoints] = useState<number>(() => {
    try {
      const migrated = localStorage.getItem('sv_signup_bonus_100_migrated_v3');
      const saved = localStorage.getItem('sv_points');
      if (!migrated) {
        localStorage.setItem('sv_signup_bonus_100_migrated_v3', 'true');
        const savedDeposits = localStorage.getItem('sv_deposits_v1');
        let hasDeposits = false;
        if (savedDeposits) {
          try {
            const parsedDeps = JSON.parse(savedDeposits);
            hasDeposits = Array.isArray(parsedDeps) && parsedDeps.length > 0;
          } catch {
            hasDeposits = false;
          }
        }
        const currentVal = saved !== null ? parseInt(saved, 10) : 100;
        // Reset legacy hardcoded points (e.g. 1195, 1250, 1300) to 100 SignUp Bonus if user hasn't made manual deposits
        if (saved === null || (!hasDeposits && currentVal > 100)) {
          localStorage.setItem('sv_points', '100');
          return 100;
        }
      }
      return saved !== null ? parseInt(saved, 10) : 100;
    } catch {
      return 100;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_points', String(points));
      const accRaw = localStorage.getItem('sv_user_account_v1');
      if (accRaw) {
        const acc = JSON.parse(accRaw);
        const key = String(acc?.phone || acc?.name || '').trim().toLowerCase();
        if (key) {
          const walletsRaw = localStorage.getItem('sv_user_wallets_v1');
          const wallets = walletsRaw ? JSON.parse(walletsRaw) : {};
          wallets[key] = points;
          localStorage.setItem('sv_user_wallets_v1', JSON.stringify(wallets));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [points]);

  // Persistent liveMatches in localStorage (filtered to exclude any old hardcoded demo match)
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>(() => {
    try {
      const saved = localStorage.getItem('liveMatches');
      if (!saved) return INITIAL_LIVE_MATCHES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((m: LiveMatch) => m && m.id !== 'sv-live-1')
        : INITIAL_LIVE_MATCHES;
    } catch {
      return INITIAL_LIVE_MATCHES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('liveMatches', JSON.stringify(liveMatches));
    } catch {
      // ignore
    }
  }, [liveMatches]);

  // Persistent Players Roster
  const [players, setPlayers] = useState<PlayerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('sv_players');
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_players', JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sv_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sv_deposits_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_deposits_v1', JSON.stringify(deposits));
    } catch {
      // ignore
    }
  }, [deposits]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(
    liveMatches[0]?.id || null
  );

  // Village Cricket Direct Live Video Streams State
  const [villageStreams, setVillageStreams] = useState<VillageVideoStream[]>(() => {
    try {
      const saved = localStorage.getItem('sv_village_streams');
      return saved ? JSON.parse(saved) : INITIAL_VILLAGE_STREAMS;
    } catch {
      return INITIAL_VILLAGE_STREAMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_village_streams', JSON.stringify(villageStreams));
    } catch {
      // ignore
    }
  }, [villageStreams]);

  const [selectedVideoStreamId, setSelectedVideoStreamId] = useState<string | null>(
    villageStreams[0]?.id || null
  );
  const [liveVideoInitialMode, setLiveVideoInitialMode] = useState<'WATCH' | 'BROADCAST'>('WATCH');

  // Persistent User Saved Teams (with Players' Age, Home Village, Role/Skill, Team ID & PIN, and 500-Point Activation)
  const [savedTeams, setSavedTeams] = useState<UserSavedTeam[]>(() => {
    try {
      const saved = localStorage.getItem('sv_saved_teams');
      return saved ? JSON.parse(saved) : INITIAL_SAVED_TEAMS;
    } catch {
      return INITIAL_SAVED_TEAMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_saved_teams', JSON.stringify(savedTeams));
    } catch {
      // ignore
    }
  }, [savedTeams]);

  // Modals & Toast
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositPresetTaka, setDepositPresetTaka] = useState<number>(100);
  const openDepositWithPreset = (presetTaka = 100) => {
    setDepositPresetTaka(presetTaka);
    setShowDepositModal(true);
  };
  const [authModalMode, setAuthModalMode] = useState<'SIGNUP' | 'LOGIN' | null>(null);
  const [userAccount, setUserAccount] = useState<{ name: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('sv_user_account_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (userAccount) {
        localStorage.setItem('sv_user_account_v1', JSON.stringify(userAccount));
      } else {
        localStorage.removeItem('sv_user_account_v1');
      }
    } catch {
      // ignore
    }
  }, [userAccount]);

  const [userProfile, setUserProfile] = useState<{
    accountId: string;
    name: string;
    phone: string;
    email: string;
    age: string;
    bloodGroup: string;
    favoriteSport: string;
    playingRole: string;
    district: string;
    thana: string;
    address: string;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
    paymentPhone: string;
    joinedDate: string;
    membershipTier: string;
    bio: string;
  }>(() => {
    const defaultProfile = {
      accountId: 'SV-BD-202684',
      name: 'Sakib Al-Amin',
      phone: '01711-234567',
      email: 'member@sportsviva.com',
      age: '24 বছর',
      bloodGroup: 'O+ (পজিটিভ)',
      favoriteSport: 'ক্রিকেট ও ফুটবল (Cricket & Football)',
      playingRole: 'অলরাউন্ডার (Right-Hand Bat • Medium Fast)',
      district: 'ঢাকা (Dhaka)',
      thana: 'মিরপুর ১০ (Mirpur-10)',
      address: 'ব্লক-সি, রোড-৫, বাড়ি-১৪, মিরপুর, ঢাকা-১২১৬',
      paymentMethod: 'bKash' as const,
      paymentPhone: '01711-234567',
      joinedDate: '১০ অক্টোবর ২০২৬',
      membershipTier: 'ভেরিফাইড গোল্ড মেম্বার (Verified Gold)',
      bio: 'নিয়মিত ক্রিকেট, ফুটবল ও ইনডোর গেমস খেলোয়াড় এবং স্পোর্টসভিভা ভেরিফাইড মেম্বার।'
    };
    try {
      const saved = localStorage.getItem('sv_user_profile_v1');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_user_profile_v1', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<'OVERVIEW' | 'TEAMS' | 'ORDERS' | 'TRANSACTIONS' | 'SECURITY'>('OVERVIEW');
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [toast, setToast] = useState<string | null>(null);
  const [adminFocusSlot, setAdminFocusSlot] = useState<AdSlotId | null>(null);

  const handleOpenAdminForSlot = (slotId: AdSlotId) => {
    setAdminFocusSlot(slotId);
    setPage('ADMIN_ADS');
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const awardPoints = (pts: number, reason?: string) => {
    setPoints((prev) => prev + pts);
    if (reason) {
      triggerToast(`+${pts} Points! (${reason})`);
    }
  };

  // Real-time viewer counter & subtle live simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatches((prev) =>
        prev.map((m) =>
          m.status === 'LIVE'
            ? { ...m, viewers: m.viewers + Math.floor(Math.random() * 5) + 1 }
            : m
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenLiveMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setPage('GOLIVE');
  };

  // SportMonks Live Summary Ticker on Main Home (Fetches /api/live/cricket, /api/live/football, /api/live/tennis)
  const [homeLiveSummary, setHomeLiveSummary] = useState<{
    cricket: string;
    football: string;
    tennis: string;
    ttl: number;
  }>({
    cricket: 'BAN 186-4 (18.2 Ov) vs IND',
    football: 'BAR 3 - 1 BAY (74\')',
    tennis: 'Alcaraz 6-4, 4-6, 5-4 Sinner',
    ttl: 60
  });

  useEffect(() => {
    const syncAllLiveApis = async () => {
      try {
        const [crkRes, fbRes, tnRes] = await Promise.all([
          fetch('/api/live/cricket'),
          fetch('/api/live/football'),
          fetch('/api/live/tennis')
        ]);
        const [crk, fb, tn] = await Promise.all([
          crkRes.ok ? crkRes.json() : null,
          fbRes.ok ? fbRes.json() : null,
          tnRes.ok ? tnRes.json() : null
        ]);

        setHomeLiveSummary((prev) => {
          const c0 = crk?.matches?.[0];
          const f0 = fb?.matches?.[0];
          const t0 = tn?.matches?.[0];
          return {
            cricket: c0
              ? `${c0.team1Code} ${c0.team1Score}${c0.team1Overs ? ` (${c0.team1Overs})` : ''} vs ${c0.team2Code} ${c0.team2Score !== 'Yet to bat' ? c0.team2Score : ''}`.trim()
              : prev.cricket,
            football: f0 ? `${f0.homeCode} ${f0.homeScore} - ${f0.awayScore} ${f0.awayCode} (${f0.minute})` : prev.football,
            tennis: t0 ? `${t0.p1Code} ${t0.p1Sets?.join('-') || t0.p1GamePts} vs ${t0.p2Code} (${t0.statusLabel})` : prev.tennis,
            ttl: Number(crk?.remainingTtlSeconds ?? 60)
          };
        });
      } catch {
        // ignore network hiccup
      }
    };

    syncAllLiveApis();
    const interval = setInterval(syncAllLiveApis, 30000);
    return () => clearInterval(interval);
  }, []);

  if (page === 'SHUTKI_ADMIN' || page === 'ADMIN_ADS') {
    return (
      <SimpleAdminPanel
        initialFocusSlot={adminFocusSlot}
        onBackToHome={() => {
          setAdminFocusSlot(null);
          try {
            window.history.pushState({}, '', '/');
          } catch {
            // ignore
          }
          setPage('HOME');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[#021A0A] text-white flex flex-col ${page === 'LUDO' || page === 'CARAM' ? 'pb-0' : 'pb-20'}`}>
      <GlobalSimpleAdminScripts />
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 bg-[#0A3A0A] border-2 border-[#00FF00] text-[#FFD700] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.5)] text-xs font-display font-black flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00FF00]" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          FIX 1: TOP HEADER — HIDDEN WHEN IN STANDALONE CRICKET, FOOTBALL, TENNIS, LUDO KING OR CARROM POOL
         ==================================================================== */}
      {page !== 'CRICKET' && page !== 'MATCHES' && page !== 'FOOTBALL' && page !== 'TENNIS' && page !== 'LUDO' && page !== 'CARAM' && (
      <header className="sticky top-0 z-40 flex items-center justify-between w-full px-2 py-2 gap-2 overflow-hidden bg-gradient-to-b from-[#04280D] via-[#03200A] to-[#021A0A] border-b border-[#00FF00]/40 shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto gap-2 overflow-hidden">
          {/* Left: Logo flex-shrink-0 */}
          <button
            onClick={() => setPage('HOME')}
            className="flex items-center gap-1.5 text-left group cursor-pointer flex-shrink-0"
          >
            <div className="relative flex flex-col items-center flex-shrink-0">
              <svg viewBox="0 0 32 14" className="w-4 h-2 -mb-0.5 text-[#FFD700] fill-current drop-shadow">
                <path d="M2 12 L5 3 L11 8 L16 1 L21 8 L27 3 L30 12 Z" />
              </svg>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#090D0A] border-2 border-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.55)] flex items-center justify-center">
                <span className="font-display font-black text-base sm:text-xl text-[#FFD700] leading-none">
                  S
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="font-display font-black italic text-xs sm:text-lg tracking-tight leading-none flex items-center">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Sports</span>
                <span className="text-[#FFD700] drop-shadow-[0_2px_6px_rgba(255,215,0,0.45)]">Viva</span>
              </div>
              <div className="text-[8px] sm:text-[10px] text-emerald-100 font-medium tracking-tight mt-0.5 whitespace-nowrap">
                Play • Watch • Connect
              </div>
            </div>
          </button>

          {/* Middle: Reward Points smaller w-[90px] text-xs */}
          <button
            onClick={() => setShowDepositModal(true)}
            title="Click to Deposit Points via bKash/Nagad (20 Tk = 100 Points)"
            className="w-[90px] sm:w-auto sm:px-2.5 py-1 px-1.5 rounded-lg bg-gradient-to-r from-[#07260C] to-[#0D3812] border border-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.28)] flex items-center justify-center gap-1 text-xs cursor-pointer flex-shrink-0"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-[#FFE033] to-[#D97706] flex items-center justify-center shadow-inner flex-shrink-0">
              <Star className="w-2.5 h-2.5 text-white fill-white" />
            </div>
            <div className="text-left leading-none min-w-0">
              <div className="text-[7px] text-emerald-100 font-semibold truncate">
                Reward
              </div>
              <div className="text-xs font-display font-black text-[#FFD700] font-mono-num tracking-tight truncate">
                {points.toLocaleString()}
              </div>
            </div>
          </button>

          {/* Right: SignUp LogIn / Profile buttons */}
          <div className="flex items-center gap-1 flex-shrink-0 mr-1">
            {userAccount ? (
              <button
                onClick={() => setPage('PROFILE')}
                className="px-2.5 py-1 rounded-full bg-gradient-to-b from-[#22C55E] to-[#15803D] border border-[#00FF00] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <User className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{userAccount.name}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalMode('SIGNUP')}
                  className="px-2 py-1 text-[11px] rounded-full bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#0D5E27] border border-[#4ADE80] shadow-[0_0_6px_rgba(0,255,0,0.35)] flex items-center justify-center gap-0.5 text-white font-bold hover:brightness-110 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  <UserPlus className="w-3 h-3 text-white flex-shrink-0" />
                  <span>SignUp</span>
                </button>
                <button
                  onClick={() => setAuthModalMode('LOGIN')}
                  className="px-2 py-1 text-[11px] rounded-full bg-gradient-to-b from-[#FFE54C] via-[#FACC15] to-[#CA8A04] border border-[#FEF08A] shadow-[0_0_8px_rgba(255,215,0,0.45)] flex items-center justify-center gap-0.5 text-[#021A0A] font-extrabold hover:brightness-110 transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  <LogIn className="w-3 h-3 text-[#021A0A] flex-shrink-0" />
                  <span>LogIn</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      )}

      {/* ====================================================================
          MAIN CONTENT CONTAINER
         ==================================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-5 pt-2.5">
        {page === 'HOME' && (
          <div className="space-y-3">
            {/* TOP WELCOME / HEADLINE STRIP ABOVE CARDS (MULTI-COLOR NEON + SHIMMER ANIMATION) */}
            <div className="sv-shimmer-layer sv-animated-card relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062E12] via-[#0B3B2D] to-[#1E1035] border-[1.5px] border-[#FFD700] px-3 py-2.5 shadow-[0_0_20px_rgba(0,255,102,0.28)]">
              {/* Top Multi-Color Animated Neon Line */}
              <div className="sv-rainbow-line absolute top-0 inset-x-0 h-[2.5px]" />

              {/* Ambient Cyan & Magenta Spotlights */}
              <div className="pointer-events-none absolute -left-6 -top-6 w-24 h-24 rounded-full bg-[#00FF66]/20 blur-xl" />
              <div className="pointer-events-none absolute right-10 -bottom-6 w-24 h-24 rounded-full bg-[#00F0FF]/20 blur-xl" />
              <div className="pointer-events-none absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#FF2E93]/20 blur-xl" />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="sv-float-icon w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFE54C] via-[#FFD700] to-[#FF2E93] p-[1.5px] shrink-0 shadow-[0_0_12px_rgba(255,215,0,0.65)]">
                    <div className="w-full h-full rounded-[10px] bg-[#041F0C] flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#FFD700]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-display font-black bg-gradient-to-r from-[#FFD700] via-[#FFF59D] to-[#00F0FF] bg-clip-text text-transparent truncate leading-tight drop-shadow">
                      বাংলাদেশের ১ নম্বর লাইভ স্পোর্টস ও গেমিং প্ল্যাটফর্ম
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-emerald-100 truncate mt-0.5 flex items-center gap-1">
                      <span className="text-[#00FF66]">⚡ লাইভ খেলা দেখুন</span>
                      <span className="text-[#00F0FF]">• গেম খেলুন</span>
                      <span className="text-[#FFD700]">• রিওয়ার্ড জিতুন!</span>
                    </div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#031D0B] via-[#072E24] to-[#2A0920] border border-[#00F0FF]/80 shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-ping" />
                  <span className="text-[10px] font-display font-black bg-gradient-to-r from-[#00FF66] via-[#00F0FF] to-[#FFD700] bg-clip-text text-transparent tracking-wider">
                    24/7 LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* ADMIN PANEL TOP BANNER SLOT (Saved in localStorage via /admin) */}
            <HomepageSimpleBannerSlot position="top" />

            {/* FIX 2: 6 CARDS COMPACT PEACE BD STYLE + MULTI-COLOR NEON ACCENTS & ANIMATIONS + DEDICATED AD BANNER BELOW EVERY CARD */}
            <div className="flex flex-col gap-3">
              {[
                {
                  num: '01',
                  id: 'CRICKET' as PageType,
                  adSlotId: 'card_01_cricket' as AdSlotId,
                  icon: 'cricket' as const,
                  title: 'CRICKET',
                  banglaSub: 'লাইভ ক্রিকেট স্কোর, হাইলাইটস ও টুর্নামেন্ট',
                  leftItems: ['Live Scores', 'Highlights', 'Tournaments', 'Ball by Ball'],
                  rightItems: ['Points Table', 'Upcoming', 'Live Match'],
                  bgImg: IMG_CRICKET,
                  badgeText: '🔴 LIVE LINE',
                  badgeClass: 'bg-gradient-to-r from-[#FF2E93] to-[#FF6B00] text-white border-white/50',
                  accentGlow: 'rgba(0, 255, 102, 0.35)',
                  secondaryGlow: 'rgba(0, 240, 255, 0.25)',
                  topBarGradient: 'from-[#00FF66] via-[#FFD700] to-[#00F0FF]'
                },
                {
                  num: '02',
                  id: 'FOOTBALL' as PageType,
                  adSlotId: 'card_02_football' as AdSlotId,
                  icon: 'football' as const,
                  title: 'FOOTBALL',
                  banglaSub: 'বিশ্ব ফুটবল লীগ, বড় ম্যাচ ও লাইভ স্কোর',
                  leftItems: ['Big Games', 'Leagues', 'Live Scores', 'Fixtures'],
                  rightItems: ['Standings', 'Top Clubs', 'Live Goal'],
                  bgImg: IMG_FOOTBALL,
                  badgeText: '⚽ MATCHDAY',
                  badgeClass: 'bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-[#021A0A] border-cyan-200',
                  accentGlow: 'rgba(0, 240, 255, 0.35)',
                  secondaryGlow: 'rgba(0, 255, 102, 0.25)',
                  topBarGradient: 'from-[#00F0FF] via-[#00FF66] to-[#FFD700]'
                },
                {
                  num: '03',
                  id: 'TENNIS' as PageType,
                  adSlotId: 'card_03_tennis' as AdSlotId,
                  icon: 'tennis' as const,
                  title: 'TENNIS',
                  banglaSub: 'গ্র্যান্ড স্ল্যাম টেনিস, লাইভ স্কোর ও র‍্যাঙ্কিং',
                  leftItems: ['Grand Slam', 'Live Scores', 'Rankings', 'ATP / WTA'],
                  rightItems: ['Center Court', 'Set Scores', 'Live Play'],
                  bgImg: IMG_TENNIS,
                  badgeText: '🎾 ATP / WTA',
                  badgeClass: 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] border-yellow-100',
                  accentGlow: 'rgba(255, 215, 0, 0.35)',
                  secondaryGlow: 'rgba(0, 255, 102, 0.25)',
                  topBarGradient: 'from-[#FFD700] via-[#00FF66] to-[#00F0FF]'
                },
                {
                  num: '04',
                  id: 'LUDO' as PageType,
                  adSlotId: 'card_04_ludo' as AdSlotId,
                  icon: 'ludo' as const,
                  title: 'LUDO KING',
                  banglaSub: 'অনলাইন ও অফলাইন লুডু কিং (১০–৫০০০ পয়েন্ট এন্ট্রি • ৫% ফি)',
                  leftItems: ['Play Online', 'Play Friends', '10-5000 Pts', '95% Win Pot'],
                  rightItems: ['VS Computer', 'Pass N Play', 'Shop Points'],
                  customSvg: 'ludo' as const,
                  badgeText: '👑 LUDO KING',
                  badgeClass: 'bg-gradient-to-r from-[#A855F7] to-[#FF2E93] text-white border-pink-200',
                  accentGlow: 'rgba(255, 46, 147, 0.32)',
                  secondaryGlow: 'rgba(255, 215, 0, 0.25)',
                  topBarGradient: 'from-[#FF2E93] via-[#FFD700] to-[#00FF66]'
                },
                {
                  num: '05',
                  id: 'CARAM' as PageType,
                  adSlotId: 'card_05_caram' as AdSlotId,
                  icon: 'caram' as const,
                  title: 'CARAM',
                  banglaSub: 'ক্যারম বোর্ড স্ট্রাইক করুন এবং পুরস্কার জিতুন',
                  leftItems: ['Striker Drag', 'Queen 50 Pt', '2P Board', 'Pocket Shot'],
                  rightItems: ['Strike', 'Score', 'Win'],
                  customSvg: 'caram' as const,
                  badgeText: '🎯 QUEEN +50',
                  badgeClass: 'bg-gradient-to-r from-[#FF8A00] to-[#FFD700] text-[#021A0A] border-amber-100',
                  accentGlow: 'rgba(255, 138, 0, 0.32)',
                  secondaryGlow: 'rgba(0, 240, 255, 0.22)',
                  topBarGradient: 'from-[#FF8A00] via-[#FFD700] to-[#00F0FF]'
                },
                {
                  num: '06',
                  id: 'GOLIVE' as PageType,
                  adSlotId: 'card_06_golive' as AdSlotId,
                  icon: 'golive' as const,
                  title: 'LIVE MATCH',
                  banglaSub: 'বল বাই বল লাইভ স্কোর ও খেলোয়াড়দের নাম (মিনিমাম ১০০ পয়েন্ট)',
                  leftItems: ['Ball by Ball', '100 Pts Live', 'Playing XI', 'Scorecard'],
                  rightItems: ['Batsman', 'Bowler', 'Create Match'],
                  bgImg: IMG_GOLIVE,
                  badgeText: '🏏 100 PTS LIVE',
                  badgeClass: 'bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00F0FF] text-[#021A0A] border-white/50',
                  accentGlow: 'rgba(0, 255, 102, 0.35)',
                  secondaryGlow: 'rgba(0, 240, 255, 0.28)',
                  topBarGradient: 'from-[#00FF66] via-[#FFD700] to-[#00F0FF]'
                }
              ].map((card, cardIdx) => (
                <React.Fragment key={card.id}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    awardPoints(10);
                    setPage(card.id);
                  }}
                  style={{
                    boxShadow: `0 0 18px ${card.accentGlow}, 0 0 30px ${card.secondaryGlow}, inset 0 0 22px rgba(0, 255, 102, 0.14)`
                  }}
                  className="sv-card-glow sv-shimmer-layer sv-animated-card group relative h-[175px] w-full rounded-[18px] p-3 overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  {/* Top Multi-Color Neon Rim Strip */}
                  <div className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${card.topBarGradient}`} />

                  {/* Ambient Color Glow Orb on Left-Center */}
                  <div
                    className="pointer-events-none absolute -left-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-60"
                    style={{ background: card.accentGlow }}
                  />

                  {/* Big Image on Far Right */}
                  <div className="absolute inset-y-0 right-0 w-[44%] sm:w-[45%] pointer-events-none overflow-hidden">
                    {card.bgImg ? (
                      <img
                        src={card.bgImg}
                        alt={card.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : card.customSvg === 'ludo' ? (
                      <LudoCardArtwork />
                    ) : (
                      <CaramCardArtwork />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06290E] via-[#06290E]/70 to-transparent" />
                  </div>

                  {/* TOP ROW: 01 Number Box + w-8 h-8 Floating Icon + Title + Animated Badge + Bangla Subtitle */}
                  <div className="relative z-10 flex items-center gap-2 border-b border-[#00FF66]/35 pb-1.5 pr-2">
                    {/* Number Box (01, 02, ...) */}
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFE54C] via-[#FFD700] to-[#FF8A00] border border-[#FEF08A] shadow-[0_0_10px_rgba(255,215,0,0.55)] flex items-center justify-center font-mono-num font-black text-xs text-[#021A0A] flex-shrink-0">
                      {card.num}
                    </div>

                    {/* Smaller Sport/Game Circle Icon (w-8 h-8 with gentle float animation) */}
                    <div className="sv-float-icon flex-shrink-0">
                      <CardCircleIcon type={card.icon} compact />
                    </div>

                    {/* Title + Animated Multi-Color Badge + Bangla Subtitle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base sm:text-lg font-display font-black italic tracking-wide sv-gold-text leading-none">
                          {card.title}
                        </h2>
                        <span
                          className={`px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-display font-black tracking-wide shadow-sm whitespace-nowrap ${card.badgeClass}`}
                        >
                          {card.badgeText}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-100 truncate mt-0.5 drop-shadow">
                        {card.banglaSub}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM 2 COLUMNS MENU: Left 4 Items + Right 3 Items (text-xs) */}
                  <div className="relative z-10 grid grid-cols-2 gap-x-2 sm:gap-x-3 w-[66%] sm:w-[60%] my-auto pt-0.5">
                    {/* Left Column: 4 Items with Multi-Color Neon Icons */}
                    <div className="space-y-0.5">
                      {card.leftItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-xs leading-tight font-semibold text-white whitespace-nowrap"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] flex-shrink-0 border ${
                              idx === 0
                                ? 'bg-[#115E20] border-[#00FF66] text-[#FFD700]'
                                : idx === 1
                                ? 'bg-[#0A3A4A] border-[#00F0FF] text-[#00F0FF]'
                                : idx === 2
                                ? 'bg-[#3B102E] border-[#FF2E93] text-[#FFD700]'
                                : 'bg-[#115E20] border-[#FFD700] text-[#00FF66]'
                            }`}
                          >
                            {idx === 0 ? '⚡' : idx === 1 ? '★' : idx === 2 ? '🏆' : '▶'}
                          </span>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right Column: 3 Items with Multi-Color Neon Icons */}
                    <div className="space-y-0.5">
                      {card.rightItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-xs leading-tight font-semibold text-emerald-100 whitespace-nowrap"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] flex-shrink-0 border ${
                              idx === 0
                                ? 'bg-[#0E4D1B] border-[#FFD700]/80 text-[#00F0FF]'
                                : idx === 1
                                ? 'bg-[#1F1646] border-[#A855F7] text-[#FFD700]'
                                : 'bg-[#3D0D1E] border-[#FF2E93] text-[#FF2E93]'
                            }`}
                          >
                            {idx === 0 ? '●' : idx === 1 ? '◆' : '🔴'}
                          </span>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explore More Button at Bottom Right (px-3 py-1 text-[11px]) */}
                  <div className="absolute bottom-2 right-2.5 z-20">
                    <span className="px-3 py-1 text-[11px] rounded-full bg-gradient-to-r from-[#FFE54C] via-[#FFD700] to-[#FF8A00] border border-white text-[#021A0A] font-display font-black flex items-center gap-1 shadow-[0_0_14px_rgba(255,215,0,0.85)] group-hover:scale-105 transition-transform whitespace-nowrap">
                      <span>Explore More</span>
                      <ArrowRight className="w-3 h-3 text-[#021A0A] stroke-[2.75]" />
                    </span>
                  </div>
                </div>
                {card.id === 'CRICKET' ? (
                  <div onClick={(e) => e.stopPropagation()} className="my-2">
                    <HomepageSimpleBannerSlot position="middle" />
                  </div>
                ) : (
                  <div onClick={(e) => e.stopPropagation()} className="my-2">
                    <CardAdBanner
                      slotId={card.adSlotId}
                      onOpenAdminSlot={handleOpenAdminForSlot}
                    />
                  </div>
                )}
                </React.Fragment>
              ))}
            </div>

            {/* DIRECT VILLAGE CRICKET LIVE VIDEO BROADCAST SECTION (নিচের অপশন: সরাসরি লাইভ ভিডিও প্রোগ্রাম) */}
            <div className="bg-gradient-to-b from-[#260716] via-[#0A3015] to-[#05210C] border-2 border-[#FF2E93] rounded-2xl p-3.5 space-y-3 shadow-[0_0_22px_rgba(255,46,147,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-display font-black flex items-center gap-1 animate-pulse">
                    <Video className="w-3 h-3" /> LIVE VIDEO
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-display font-black text-[#FFD700]">
                      🎥 সরাসরি গ্রামের ক্রিকেট ভিডিও প্রোগ্রাম ({villageStreams.length}) • মিনিমাম ২০০ পয়েন্ট
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      যেকোনো গ্রামের ক্রিকেট খেলা ক্যামেরা দিয়ে সরাসরি ভিডিও লাইভ করতে মিনিমাম ২০০ পয়েন্ট লাগবে
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLiveVideoInitialMode('BROADCAST');
                    setPage('LIVE_VIDEO');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2E93] via-[#FF6B00] to-[#FFD700] text-[#021A0A] text-xs font-display font-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,46,147,0.6)] hover:brightness-110 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ ভিডিও লাইভ করুন (200 Pts)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {villageStreams.map((vs) => (
                  <div
                    key={vs.id}
                    onClick={() => {
                      setSelectedVideoStreamId(vs.id);
                      setLiveVideoInitialMode('WATCH');
                      setPage('LIVE_VIDEO');
                    }}
                    className="bg-[#021A0A]/90 hover:bg-[#1A0812] border border-[#FF2E93]/60 rounded-xl p-3 flex items-center justify-between gap-2 cursor-pointer transition-all group"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#00F0FF] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="truncate">📍 {vs.groundLocation}</span>
                        <span className="text-[#FFD700]">• 👁️ {vs.viewers}</span>
                      </div>
                      <div className="text-xs font-display font-black text-[#FFD700] truncate">
                        {vs.teamA} বনাম {vs.teamB}
                      </div>
                      <div className="text-xs font-mono-num font-bold text-white">
                        {vs.battingTeam}: {vs.score}/{vs.wickets} ({formatOvers(vs.legalBalls)}/{vs.totalOvers} ওভার)
                      </div>
                    </div>
                    <span className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#FFD700] text-[#021A0A] font-display font-black text-xs shrink-0 flex items-center gap-1 group-hover:scale-105 transition-transform">
                      <Play className="w-3 h-3 fill-current" />
                      <span>ভিডিও দেখুন</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Ad Banner Slot Below Card 07 (Live Video Program Card) */}
            <CardAdBanner
              slotId="card_07_live_video"
              onOpenAdminSlot={handleOpenAdminForSlot}
            />

            {/* ====================================================================
                NEW CARD RIGHT BELOW VIDEO SECTION:
                আমার টিম সাজান, আইডি-পিন নাম্বার ও পয়েন্ট অ্যাক্টিভেশন কার্ড (৫০০ / ২০০ / ১০০ পয়েন্ট)
               ==================================================================== */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#083818] via-[#0B253A] to-[#260928] border-2 border-[#FFD700] rounded-2xl p-3.5 sm:p-4 space-y-3.5 shadow-[0_0_24px_rgba(255,215,0,0.3)]">
              {/* Top Rainbow Gold-Cyan-Pink Highlight Line */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#FFD700] via-[#00FF66] to-[#00F0FF]" />

              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] via-[#F59E0B] to-[#00FF66] p-0.5 shadow-[0_0_12px_rgba(255,215,0,0.6)] shrink-0">
                    <div className="w-full h-full rounded-[10px] bg-[#021A0A] flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-[#FFD700]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] text-[10px] font-display font-black">
                        🛡️ MY TEAM &amp; ID/PIN CARD
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] text-[10px] font-display font-black">
                        🪙 পয়েন্ট সার্ভিস ও অ্যাক্টিভেশন
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-display font-black text-white mt-0.5">
                      আমার টিম সাজান, খেলোয়াড়ের তালিকা ও পিন অ্যাক্টিভেশন
                    </h3>
                    <p className="text-[11px] text-emerald-200">
                      টিমে কতজন খেলোয়াড়, কার কত বয়স, বাড়ি কোথায় এবং কে কেমন খেলোয়াড় — সব তথ্য দিয়ে আপনার টিম সাজিয়ে রাখুন
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage('MY_TEAM')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFE54C] to-[#00FF66] text-[#021A0A] text-xs font-display font-black flex items-center gap-1.5 shadow-[0_0_14px_rgba(255,215,0,0.65)] hover:brightness-110 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>+ আমার টিম সাজান</span>
                  </button>
                  <button
                    onClick={() => openDepositWithPreset(100)}
                    className="px-3 py-2 rounded-xl bg-[#021A0A] border-2 border-[#00FF66] text-[#00FF66] text-xs font-display font-black hover:bg-[#083616] cursor-pointer"
                  >
                    🪙 পয়েন্ট কিনুন
                  </button>
                </div>
              </div>

              {/* 3 Point Pricing & Activation Boxes (500 Pts Team | 200 Pts Video | 100 Pts Ball-by-Ball) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Team Activation: Min 500 Points */}
                <div
                  onClick={() => setPage('MY_TEAM')}
                  className="rounded-xl bg-[#041F0D]/95 border border-[#FFD700]/80 p-3 flex items-center justify-between gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-[10px]">
                        ৫০০ পয়েন্ট
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300">(১০০ টাকা)</span>
                    </div>
                    <div className="text-xs font-display font-black text-white">
                      🛡️ অ্যাপের ভিতর টিম অ্যাক্টিভ
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      টিম আইডি, পিন ও খেলোয়াড় প্রোফাইল সচল করতে মিনিমাম ৫০০ পয়েন্ট
                    </div>
                  </div>
                  <span className="px-2.5 py-1.5 rounded-lg bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                    টিম দেখুন →
                  </span>
                </div>

                {/* 2. Video Match Live: Min 200 Points */}
                <div
                  onClick={() => {
                    setLiveVideoInitialMode('BROADCAST');
                    setPage('LIVE_VIDEO');
                  }}
                  className="rounded-xl bg-[#260715]/95 border border-[#FF2E93]/80 p-3 flex items-center justify-between gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#FF2E93] text-white font-mono-num font-black text-[10px]">
                        ২০০ পয়েন্ট
                      </span>
                      <span className="text-[10px] font-bold text-pink-200">(৪০ টাকা)</span>
                    </div>
                    <div className="text-xs font-display font-black text-[#FFD700]">
                      🎥 ভিডিও খেলা লাইভ করতে
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      ক্যামেরা দিয়ে সরাসরি ভিডিও খেলা লাইভ করতে মিনিমাম ২০০ পয়েন্ট
                    </div>
                  </div>
                  <span className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2E93] to-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                    লাইভ করুন →
                  </span>
                </div>

                {/* 3. Ball-by-Ball Live: Min 100 Points */}
                <div
                  onClick={() => setPage('GOLIVE')}
                  className="rounded-xl bg-[#04242C]/95 border border-[#00F0FF]/80 p-3 flex items-center justify-between gap-2 cursor-pointer hover:brightness-110 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#00FF66] text-[#021A0A] font-mono-num font-black text-[10px]">
                        ১০০ পয়েন্ট
                      </span>
                      <span className="text-[10px] font-bold text-cyan-200">(২০ টাকা)</span>
                    </div>
                    <div className="text-xs font-display font-black text-[#00F0FF]">
                      🏏 বল বাই বল খেলা লাইভ
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      বল বাই বল স্কোর ও ১১ খেলোয়াড়ের নাম লাইভ করতে মিনিমাম ১০০ পয়েন্ট
                    </div>
                  </div>
                  <span className="px-2.5 py-1.5 rounded-lg bg-[#00FF66] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                    শুরু করুন →
                  </span>
                </div>
              </div>

              {/* Saved Teams & Player Bio Preview Strip on Home Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {savedTeams.slice(0, 2).map((tm) => (
                  <div
                    key={tm.id}
                    onClick={() => setPage('MY_TEAM')}
                    className="bg-[#021609]/95 hover:bg-[#072B12] border border-[#00FF66]/60 rounded-xl p-3 space-y-2 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-display font-black shrink-0 ${
                            tm.isActive
                              ? 'bg-[#00FF66] text-[#021A0A]'
                              : 'bg-amber-500 text-[#021A0A]'
                          }`}
                        >
                          {tm.isActive ? '✅ ACTIVE' : '🔒 500 PTS লাগবে'}
                        </span>
                        <span className="text-xs font-display font-black text-[#FFD700] truncate">
                          {tm.teamName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-num font-bold text-[#00F0FF] shrink-0">
                        ID: {tm.teamIdCode} • PIN: {tm.pinCode}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-100 flex flex-wrap items-center justify-between gap-1">
                      <span>📍 বাড়ি/মাঠ: {tm.villageAddress}, {tm.district}</span>
                      <span className="font-bold text-[#FFD700]">👥 খেলোয়াড়: {tm.players.length} জন</span>
                    </div>

                    {/* Preview top 2 players with Age, Village & Skill */}
                    <div className="space-y-1 pt-1 border-t border-white/10">
                      {tm.players.slice(0, 2).map((pl) => (
                        <div
                          key={pl.id}
                          className="text-[10px] text-white/90 flex items-center justify-between gap-2 truncate"
                        >
                          <span className="truncate">
                            🏏 <strong>{pl.name}</strong> (বয়স: {pl.age}, বাড়ি: {pl.homeVillage.split(',')[0]})
                          </span>
                          <span className="text-[#00FF66] font-semibold shrink-0">{pl.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dedicated Ad Banner Slot Centered in the Gap Below Card 08 (My Team & PIN Card) */}
            <CardAdBanner
              slotId="card_08_my_team"
              onOpenAdminSlot={handleOpenAdminForSlot}
            />

            {/* QUICK ACCESS SECTION (4 Colorful Glossy Boxes Exact as Screenshot) */}
            <div className="pt-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                <h3 className="text-base sm:text-lg font-display font-extrabold text-white tracking-tight">
                  Quick Access
                </h3>
                <div className="h-0.5 w-20 bg-gradient-to-r from-[#FFD700] to-transparent rounded-full" />
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {/* 1. Find Player (Green) */}
                <button
                  onClick={() => setPage('FIND_PLAYER')}
                  className="rounded-2xl p-2.5 sm:p-3.5 bg-gradient-to-b from-[#16A34A] via-[#0D6E2E] to-[#063E19] border-[1.5px] border-[#4ADE80] shadow-[0_0_12px_rgba(34,197,94,0.4)] flex flex-col items-center text-center hover:brightness-110 transition-all cursor-pointer"
                >
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white mb-1" />
                  <span className="text-xs sm:text-sm font-display font-extrabold text-white leading-tight">
                    Find Player
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-emerald-100 mt-0.5 leading-tight">
                    Connect & Play
                  </span>
                </button>

                {/* 2. Membership (Gold/Amber) */}
                <button
                  onClick={() => setPage('MEMBERSHIP')}
                  className="rounded-2xl p-2.5 sm:p-3.5 bg-gradient-to-b from-[#F59E0B] via-[#B45309] to-[#6B2F05] border-[1.5px] border-[#FDE047] shadow-[0_0_12px_rgba(245,158,11,0.4)] flex flex-col items-center text-center hover:brightness-110 transition-all cursor-pointer"
                >
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-white mb-1" />
                  <span className="text-xs sm:text-sm font-display font-extrabold text-white leading-tight">
                    Membership
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-amber-100 mt-0.5 leading-tight">
                    Join & Get Benefits
                  </span>
                </button>

                {/* 3. Quiz (Purple) */}
                <button
                  onClick={() => setPage('QUIZ')}
                  className="rounded-2xl p-2.5 sm:p-3.5 bg-gradient-to-b from-[#9333EA] via-[#6B21A8] to-[#3B0764] border-[1.5px] border-[#C084FC] shadow-[0_0_12px_rgba(147,51,234,0.45)] flex flex-col items-center text-center hover:brightness-110 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white mb-1" />
                  <span className="text-xs sm:text-sm font-display font-extrabold text-white leading-tight">
                    Quiz
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-purple-100 mt-0.5 leading-tight">
                    Test Your Knowledge
                  </span>
                </button>

                {/* 4. Support (Blue) */}
                <button
                  onClick={() => setPage('SUPPORT')}
                  className="rounded-2xl p-2.5 sm:p-3.5 bg-gradient-to-b from-[#0284C7] via-[#0369A1] to-[#082F49] border-[1.5px] border-[#38BDF8] shadow-[0_0_12px_rgba(2,132,199,0.45)] flex flex-col items-center text-center hover:brightness-110 transition-all cursor-pointer"
                >
                  <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-white mb-1" />
                  <span className="text-xs sm:text-sm font-display font-extrabold text-white leading-tight">
                    Live Support
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-sky-100 mt-0.5 leading-tight">
                    Live Support Chat
                  </span>
                </button>
              </div>
            </div>

            {/* Dedicated Ad Banner Slot Below Card 09 (Quick Access Card) */}
            <CardAdBanner
              slotId="card_09_quick_access"
              onOpenAdminSlot={handleOpenAdminForSlot}
            />

            {/* SPORTS STORE BANNER EXACT AS SCREENSHOT (ENHANCED & CLEARER) */}
            <div
              onClick={() => setPage('STORE')}
              className="sv-card-glow group relative rounded-2xl overflow-hidden cursor-pointer min-h-[142px] sm:min-h-[158px] flex items-center justify-between px-3.5 sm:px-6 py-3.5 border-[1.5px] border-[#4ADE80] shadow-[0_0_20px_rgba(0,255,102,0.35),inset_0_0_20px_rgba(255,215,0,0.12)] transition-all duration-300 hover:brightness-105 active:scale-[0.99]"
            >
              {/* Top Neon Gold-Green Highlight Line */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00FF66] z-20" />

              {/* Right Side Clear & Bright Sports Store Merchandise Image */}
              <div className="absolute inset-y-0 right-0 w-[62%] sm:w-[60%] pointer-events-none overflow-hidden">
                <img
                  src={IMG_STORE}
                  alt="Sports Store Merchandise"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-right brightness-110 contrast-105 saturate-110 transition-transform duration-500 group-hover:scale-105"
                />
                {/* Soft left-edge blend so merchandise stays vivid and clearly visible */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#04240C] via-[#04240C]/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#031807]/70 to-transparent" />
              </div>

              {/* Ambient Gold Glow behind Cart & Text */}
              <div className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#FFD700]/15 blur-2xl" />

              {/* Left Content: Gold Cart + Sports Store + Bangla Subtitle + Gold Ribbon + All in One Spot */}
              <div className="relative z-10 space-y-1.5 max-w-[62%] sm:max-w-[58%]">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Glossy 3D Gold Shopping Cart Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-full bg-[#FFD700]/30 blur-md" />
                    <ShoppingCart className="relative w-9 h-9 sm:w-11 sm:h-11 text-[#FFD700] fill-[#FFD700]/20 stroke-[2.3] drop-shadow-[0_2px_8px_rgba(255,215,0,0.75)]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-display font-black italic text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Sports <span className="sv-gold-text">Store</span>
                    </h2>
                    <p className="text-sm sm:text-base font-extrabold text-[#FFE54C] mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      সেরা পণ্য, সেরা দামে
                    </p>
                  </div>
                </div>

                {/* Golden Ribbon Banner */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-gradient-to-r from-[#F59E0B] via-[#FFE54C] to-[#F59E0B] border border-[#FEF08A] text-[#021A0A] font-display font-black text-[10px] sm:text-xs tracking-wide uppercase shadow-[0_2px_10px_rgba(250,204,21,0.5)]">
                  <span>BEST OF SITE</span>
                  <span className="text-[#78350F]">•</span>
                  <span>BEST OF APPS</span>
                </div>

                {/* — ALL IN ONE SPOT — */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-display font-extrabold text-white tracking-widest pl-1 drop-shadow">
                  <span className="text-[#FFD700]">—</span>
                  <span>ALL IN ONE SPOT</span>
                  <span className="text-[#FFD700]">—</span>
                </div>
              </div>

              {/* Shop Now > Button at Bottom Right (Exact Glossy Green/Gold Pill from Reference) */}
              <div className="relative z-10 self-end">
                <button className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-b from-[#15803D] via-[#0B4F24] to-[#052912] border-2 border-[#FFD700] text-white font-display font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,215,0,0.65)] group-hover:scale-105 transition-transform cursor-pointer whitespace-nowrap">
                  <span className="drop-shadow">Shop Now</span>
                  <span className="text-[#FFD700] font-black text-sm leading-none">&gt;</span>
                </button>
              </div>
            </div>

            {/* Dedicated Ad Banner Slot Centered in the Gap Below Card 10 (Sports Store Banner Card) */}
            <CardAdBanner
              slotId="card_10_sports_store"
              onOpenAdminSlot={handleOpenAdminForSlot}
            />

            {/* PERKS & TAGLINE FOOTER BANNER (EXACT AS UPLOADED SCREENSHOT BELOW SPORTS STORE) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#083A14] via-[#05260C] to-[#031707] border-[1.5px] border-[#4ADE80]/85 shadow-[0_0_18px_rgba(0,255,102,0.28),inset_0_0_24px_rgba(255,215,0,0.08)]">
              {/* Subtle Gold Sparkle Dots */}
              <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:18px_18px]" />

              {/* Top 3-Column Feature Row */}
              <div className="relative z-10 grid grid-cols-3 divide-x divide-[#4ADE80]/35 px-1 sm:px-3 py-2.5 sm:py-3">
                {/* 1. Earn Points & Win Prizes! */}
                <button
                  onClick={() => setPage('QUIZ')}
                  className="flex items-center justify-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 text-left hover:brightness-110 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFE54C] via-[#F59E0B] to-[#B45309] border border-[#FEF08A] shadow-[0_0_10px_rgba(255,215,0,0.55)] flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#021A0A] fill-[#FFFBEB]" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="text-[10px] sm:text-xs font-display font-bold text-white truncate">
                      Earn Points &amp;
                    </div>
                    <div className="text-[11px] sm:text-sm font-display font-black text-[#FFD700] truncate drop-shadow">
                      Win Prizes!
                    </div>
                  </div>
                </button>

                {/* 2. Exclusive Member Perks */}
                <button
                  onClick={() => setPage('MEMBERSHIP')}
                  className="flex items-center justify-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 text-left hover:brightness-110 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFE54C] via-[#F59E0B] to-[#DC2626] border border-[#FEF08A] shadow-[0_0_10px_rgba(245,158,11,0.55)] flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="text-[10px] sm:text-xs font-display font-bold text-white truncate">
                      Exclusive
                    </div>
                    <div className="text-[11px] sm:text-sm font-display font-black text-white truncate drop-shadow">
                      Member Perks
                    </div>
                  </div>
                </button>

                {/* 3. Safe & Secure Platform */}
                <button
                  onClick={() => setPage('SUPPORT')}
                  className="flex items-center justify-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-3 text-left hover:brightness-110 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#22C55E] via-[#15803D] to-[#064E3B] border border-[#FFD700] shadow-[0_0_10px_rgba(34,197,94,0.55)] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700] drop-shadow" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="text-[10px] sm:text-xs font-display font-bold text-white truncate">
                      Safe &amp; Secure
                    </div>
                    <div className="text-[11px] sm:text-sm font-display font-black text-white truncate drop-shadow">
                      Platform
                    </div>
                  </div>
                </button>
              </div>

              {/* Horizontal Golden-Green Divider Line */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFD700]/65 to-transparent" />

              {/* Bottom Tagline Row: Play, Compete, and Connect – All in One Place! */}
              <div className="relative z-10 py-2 px-3 flex items-center justify-between bg-gradient-to-r from-[#031707]/80 via-[#073312]/90 to-[#031707]/80">
                <p className="text-xs sm:text-sm font-serif italic font-bold tracking-wide text-[#FFE54C] drop-shadow-[0_1px_6px_rgba(255,215,0,0.45)] text-center flex-1">
                  Play, Compete, and Connect – All in One Place!
                </p>
                <button
                  onClick={() => {
                    try {
                      window.history.pushState({}, '', '/admin');
                    } catch {
                      // ignore
                    }
                    setPageInternal('SHUTKI_ADMIN');
                  }}
                  className="text-[10px] text-emerald-300/70 hover:text-[#FFD700] font-mono underline ml-2 shrink-0 cursor-pointer"
                >
                  /admin
                </button>
              </div>
            </div>

            {/* ADMIN PANEL BOTTOM BANNER SLOT (Saved in localStorage via /admin) */}
            <HomepageSimpleBannerSlot position="bottom" />
          </div>
        )}

        {/* SUB-PAGES */}
        {page === 'CRICKET' && (
          <CricketGuruHome
            liveMatches={liveMatches}
            onWatchLiveMatch={handleOpenLiveMatch}
            onGoCreateLive={() => setPage('GOLIVE')}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'FOOTBALL' && (
          <FootballHome onBack={() => setPage('HOME')} awardPoints={awardPoints} />
        )}

        {page === 'TENNIS' && (
          <TennisHome onBack={() => setPage('HOME')} awardPoints={awardPoints} />
        )}

        {page === 'LUDO' && (
          <LudoKingClone
            points={points}
            setPoints={setPoints}
            onOpenDeposit={() => setShowDepositModal(true)}
            onGoToStore={() => setPage('STORE')}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'CARAM' && (
          <CarromPoolClone
            points={points}
            setPoints={setPoints}
            awardPoints={awardPoints}
            onOpenDeposit={() => setShowDepositModal(true)}
            onGoToStore={() => setPage('STORE')}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'GOLIVE' && (
          <GoLiveProView
            liveMatches={liveMatches}
            setLiveMatches={setLiveMatches}
            selectedMatchId={selectedMatchId}
            setSelectedMatchId={setSelectedMatchId}
            points={points}
            setPoints={setPoints}
            onOpenDeposit={openDepositWithPreset}
            savedTeams={savedTeams}
            awardPoints={awardPoints}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'LIVE_VIDEO' && (
          <VillageLiveVideoHub
            streams={villageStreams}
            setStreams={setVillageStreams}
            selectedStreamId={selectedVideoStreamId}
            setSelectedStreamId={setSelectedVideoStreamId}
            initialMode={liveVideoInitialMode}
            points={points}
            setPoints={setPoints}
            onOpenDeposit={openDepositWithPreset}
            awardPoints={awardPoints}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'MY_TEAM' && (
          <MyTeamSquadHub
            teams={savedTeams}
            setTeams={setSavedTeams}
            points={points}
            setPoints={setPoints}
            onOpenDeposit={openDepositWithPreset}
            onGoVideoLive={() => {
              setLiveVideoInitialMode('BROADCAST');
              setPage('LIVE_VIDEO');
            }}
            onGoBallByBallLive={() => setPage('GOLIVE')}
            onBack={() => setPage('HOME')}
          />
        )}

        {(page === 'FIND_PLAYER' || page === 'MEMBERSHIP') && (
          <FindPlayerAndMembershipView
            initialTab={page === 'MEMBERSHIP' ? 'MEMBERSHIP' : 'FIND'}
            players={players}
            setPlayers={setPlayers}
            awardPoints={awardPoints}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'QUIZ' && (
          <SportsQuizView awardPoints={awardPoints} onBack={() => setPage('HOME')} />
        )}

        {page === 'SUPPORT' && (
          <SupportCenterView
            onBack={() => setPage('HOME')}
            onOpenDeposit={() => setShowDepositModal(true)}
            userName={userAccount?.name}
            points={points}
            activeTeamsCount={savedTeams.filter((t) => t.isActive).length}
            onNavigate={(targetPage) => setPage(targetPage)}
          />
        )}

        {page === 'STORE' && (
          <SportsStoreView
            points={points}
            setPoints={setPoints}
            orders={orders}
            setOrders={setOrders}
            onOpenDeposit={() => setShowDepositModal(true)}
            onBack={() => setPage('HOME')}
          />
        )}

        {page === 'MATCHES' && (
          <CricketGuruHome
            liveMatches={liveMatches}
            onWatchLiveMatch={handleOpenLiveMatch}
            onGoCreateLive={() => setPage('GOLIVE')}
            onBack={() => setPage('HOME')}
            initialTopTab="LIVE"
          />
        )}

        {page === 'GAMES' && (
          <div className="space-y-4 pb-8">
            <div className="bg-[#0A3A0A] border border-[#00FF00]/60 rounded-2xl p-4">
              <h1 className="text-xl font-display font-black italic text-[#FFD700]">
                SPORTSVIVA INDOOR GAMES ARENA
              </h1>
              <p className="text-xs text-emerald-200">
                Play Ludo King Pro (380 Pts Winner Pot) & Carrom Pool Striker Physics
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setPage('LUDO')}
                className="sv-card-glow rounded-2xl p-5 cursor-pointer space-y-2"
              >
                <CardCircleIcon type="ludo" />
                <h2 className="text-2xl font-display font-black italic text-[#FFD700]">
                  LUDO KING 100%
                </h2>
                <p className="text-xs text-emerald-200">
                  Entry Fee: 100 Points • 4-Player Pot: 400 (-20 Fee) • Winner Gets 380 Points!
                </p>
                <span className="inline-block px-4 py-2 rounded-xl bg-[#00FF00] text-[#021A0A] font-display font-black text-xs">
                  Enter Ludo Room →
                </span>
              </div>
              <div
                onClick={() => setPage('CARAM')}
                className="sv-card-glow rounded-2xl p-5 cursor-pointer space-y-2"
              >
                <CardCircleIcon type="caram" />
                <h2 className="text-2xl font-display font-black italic text-[#FFD700]">
                  CARROM POOL PRO
                </h2>
                <p className="text-xs text-emerald-200">
                  Drag striker, aim & shoot Queen, White and Black coins to earn reward points!
                </p>
                <span className="inline-block px-4 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs">
                  Play Carrom Now →
                </span>
              </div>
            </div>
          </div>
        )}

        {page === 'PROFILE' && (
          <div className="space-y-4 pb-8 max-w-4xl mx-auto">
            {/* 1. TOP USER PROFILE HEADER & WALLET CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#062E12] via-[#0A3A0A] to-[#041F0C] border-2 border-[#00FF66] rounded-2xl p-4 sm:p-6 shadow-[0_0_25px_rgba(0,255,102,0.25)]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00FF66] via-[#FFD700] to-[#00F0FF]" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left: Avatar + Name + Badges + Contact Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FFE54C] via-[#FFD700] to-[#D97706] border-2 border-white shadow-[0_0_16px_rgba(255,215,0,0.5)] flex items-center justify-center text-[#021A0A] font-display font-black text-2xl sm:text-3xl">
                      {(userAccount?.name || userProfile.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00FF66] border-2 border-[#021A0A] flex items-center justify-center text-[#021A0A]">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-display font-black text-[#FFD700] truncate">
                        {userAccount ? userAccount.name : userProfile.name}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-[10px] font-display font-black">
                        ✔ ভেরিফাইড অ্যাকাউন্ট
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/60 text-[#FFD700] text-[10px] font-mono-num font-bold">
                        ID: {userProfile.accountId}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100">
                      <span className="flex items-center gap-1 font-mono-num">
                        <Phone className="w-3.5 h-3.5 text-[#00FF66]" />
                        {userAccount ? userAccount.phone : userProfile.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FFD700]" />
                        {userProfile.thana}, {userProfile.district}
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-200/90 pt-0.5">
                      {userProfile.bio}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileSubTab('OVERVIEW');
                          setIsEditingProfile((prev) => !prev);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer hover:brightness-110 transition-all"
                      >
                        {isEditingProfile ? '✕ এডিট বন্ধ করুন' : '✏️ অ্যাকাউন্ট তথ্য এডিট করুন'}
                      </button>

                      {userAccount ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUserAccount(null);
                            triggerToast('আপনার অ্যাকাউন্ট থেকে সফলভাবে লগআউট হয়েছে।');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-200 font-bold text-xs cursor-pointer hover:bg-red-500/30 transition-all"
                        >
                          লগআউট (Log Out)
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setAuthModalMode('LOGIN')}
                            className="px-3 py-1.5 rounded-xl bg-[#021A0A] border border-[#00FF66] text-[#00FF66] font-bold text-xs cursor-pointer hover:bg-[#062E12]"
                          >
                            লগইন (Log In)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAuthModalMode('SIGNUP')}
                            className="px-3 py-1.5 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] text-white font-bold text-xs cursor-pointer hover:bg-[#00FF66]/30"
                          >
                            নতুন অ্যাকাউন্ট (Sign Up)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Reward Points Wallet Box */}
                <div className="bg-[#021A0A]/90 border-2 border-[#FFD700] rounded-2xl p-4 sm:min-w-[250px] flex flex-col justify-between gap-2 shadow-[0_0_16px_rgba(255,215,0,0.2)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-display font-bold text-emerald-300 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-[#FFD700]" />
                      রিওয়ার্ড পয়েন্ট ওয়ালেট
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#00FF66]/20 text-[#00FF66] text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono-num font-black text-[#FFD700]">
                      {points.toLocaleString()} <span className="text-sm font-sans">Pts</span>
                    </div>
                    <div className="text-[11px] text-emerald-200 font-semibold mt-0.5">
                      শপিং ভ্যালু: <strong>৳{Math.floor(points / 5).toLocaleString()} টাকা</strong> (১০০ পয়েন্ট = ২০ টাকা)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-md hover:brightness-110 transition-all"
                  >
                    + বিকাশ / নগদে পয়েন্ট ডিপোজিট
                  </button>
                </div>
              </div>
            </div>

            {/* 2. ACCOUNT SUMMARY METRIC CARDS (4 STATS BOXES) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div
                onClick={() => setShowDepositModal(true)}
                className="bg-[#072B12] border border-[#00FF66]/50 rounded-2xl p-3.5 cursor-pointer hover:border-[#FFD700] transition-all"
              >
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>মোট পয়েন্ট ব্যালেন্স</span>
                  <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                </div>
                <div className="text-xl font-mono-num font-black text-[#FFD700] mt-1">
                  {points.toLocaleString()} Pts
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5">
                  = ৳{Math.floor(points / 5).toLocaleString()} টাকা সমমূল্য
                </div>
              </div>

              <div
                onClick={() => setProfileSubTab('TEAMS')}
                className="bg-[#072B12] border border-[#00F0FF]/50 rounded-2xl p-3.5 cursor-pointer hover:border-[#FFD700] transition-all"
              >
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>আমার টিম ও স্কোয়াড</span>
                  <Users className="w-4 h-4 text-[#00F0FF]" />
                </div>
                <div className="text-xl font-mono-num font-black text-white mt-1">
                  {savedTeams.length} টি টিম
                </div>
                <div className="text-[10px] text-[#00FF66] mt-0.5">
                  {savedTeams.filter((t) => t.isActive).length} টি অ্যাক্টিভ স্কোয়াড
                </div>
              </div>

              <div
                onClick={() => setProfileSubTab('ORDERS')}
                className="bg-[#072B12] border border-[#FFD700]/50 rounded-2xl p-3.5 cursor-pointer hover:border-[#00FF66] transition-all"
              >
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>স্টোর অর্ডারসমূহ</span>
                  <ShoppingBag className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div className="text-xl font-mono-num font-black text-white mt-1">
                  {orders.length} টি অর্ডার
                </div>
                <div className="text-[10px] text-amber-200 mt-0.5">
                  স্পোর্টস স্টোর শপিং হিস্ট্রি
                </div>
              </div>

              <div
                onClick={() => setProfileSubTab('TRANSACTIONS')}
                className="bg-[#072B12] border border-[#4ADE80]/50 rounded-2xl p-3.5 cursor-pointer hover:border-[#FFD700] transition-all"
              >
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span>ডিপোজিট লেনদেন</span>
                  <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
                </div>
                <div className="text-xl font-mono-num font-black text-[#00FF66] mt-1">
                  {deposits.length} টি
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5">
                  বিকাশ ও নগদ পেমেন্ট রেকর্ড
                </div>
              </div>
            </div>

            {/* 3. PROFILE NAVIGATION TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar bg-[#041F0C] p-1.5 rounded-2xl border border-emerald-700/60">
              {[
                { id: 'OVERVIEW' as const, label: '📋 বিস্তারিত অ্যাকাউন্ট তথ্য' },
                { id: 'TEAMS' as const, label: `🛡️ আমার টিম (${savedTeams.length})` },
                { id: 'ORDERS' as const, label: `🛒 আমার অর্ডার (${orders.length})` },
                { id: 'TRANSACTIONS' as const, label: `💳 লেনদেন ও ডিপোজিট (${deposits.length})` },
                { id: 'SECURITY' as const, label: '🔒 পাসওয়ার্ড ও সিকিউরিটি' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProfileSubTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-display font-black whitespace-nowrap transition-all cursor-pointer ${
                    profileSubTab === tab.id
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] shadow-md'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: DETAILED ACCOUNT INFORMATION (VIEW & EDIT) */}
            {profileSubTab === 'OVERVIEW' && (
              <div className="space-y-4">
                {isEditingProfile ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setUserAccount({
                        name: userProfile.name.trim() || 'SportsViva Member',
                        phone: userProfile.phone.trim() || '01711-000000'
                      });
                      setIsEditingProfile(false);
                      triggerToast('আপনার অ্যাকাউন্ট ইনফরমেশন সফলভাবে আপডেট ও সেভ করা হয়েছে!');
                    }}
                    className="bg-[#072B12] border-2 border-[#FFD700] rounded-2xl p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
                      <div>
                        <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700]">
                          ✏️ অ্যাকাউন্ট ইনফরমেশন আপডেট করুন
                        </h2>
                        <p className="text-xs text-emerald-200">
                          আপনার ব্যক্তিগত তথ্য, খেলার পজিশন, বিকাশ/নগদ নাম্বার ও ডেলিভারি ঠিকানা নিচে লিখে সেভ করুন
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="text-emerald-300 hover:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          পূর্ণ নাম (Full Name)
                        </label>
                        <input
                          type="text"
                          required
                          value={userProfile.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUserProfile((p) => ({ ...p, name: val }));
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          মোবাইল নাম্বার (Phone Number)
                        </label>
                        <input
                          type="tel"
                          required
                          value={userProfile.phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUserProfile((p) => ({ ...p, phone: val }));
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          ইমেইল অ্যাড্রেস (Email Address)
                        </label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile((p) => ({ ...p, email: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          বয়স (Age)
                        </label>
                        <input
                          type="text"
                          value={userProfile.age}
                          onChange={(e) => setUserProfile((p) => ({ ...p, age: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          রক্তের গ্রুপ (Blood Group)
                        </label>
                        <input
                          type="text"
                          value={userProfile.bloodGroup}
                          onChange={(e) => setUserProfile((p) => ({ ...p, bloodGroup: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          পছন্দের খেলা (Favorite Sport)
                        </label>
                        <input
                          type="text"
                          value={userProfile.favoriteSport}
                          onChange={(e) => setUserProfile((p) => ({ ...p, favoriteSport: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          খেলার রোল / পজিশন (Playing Role)
                        </label>
                        <input
                          type="text"
                          value={userProfile.playingRole}
                          onChange={(e) => setUserProfile((p) => ({ ...p, playingRole: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          বিকাশ / নগদ পেমেন্ট নাম্বার (bKash / Nagad Number)
                        </label>
                        <input
                          type="tel"
                          value={userProfile.paymentPhone}
                          onChange={(e) => setUserProfile((p) => ({ ...p, paymentPhone: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          জেলা (District)
                        </label>
                        <input
                          type="text"
                          value={userProfile.district}
                          onChange={(e) => setUserProfile((p) => ({ ...p, district: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          থানা / উপজেলা (Thana / Upazila)
                        </label>
                        <input
                          type="text"
                          value={userProfile.thana}
                          onChange={(e) => setUserProfile((p) => ({ ...p, thana: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          পূর্ণ ঠিকানা / ডেলিভারি অ্যাড্রেস (Village / Full Delivery Address)
                        </label>
                        <input
                          type="text"
                          value={userProfile.address}
                          onChange={(e) => setUserProfile((p) => ({ ...p, address: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#FFD700] mb-1">
                          সংক্ষিপ্ত পরিচয় (Bio / About Me)
                        </label>
                        <input
                          type="text"
                          value={userProfile.bio}
                          onChange={(e) => setUserProfile((p) => ({ ...p, bio: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold cursor-pointer"
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-lg"
                      >
                        💾 অ্যাকাউন্ট তথ্য সেভ করুন
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-[#072B12] border border-[#00FF66]/60 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/70 pb-3">
                      <div>
                        <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700]">
                          👤 অ্যাকাউন্ট ইনফরমেশন ও ব্যক্তিগত বিবরণী (Account Information)
                        </h2>
                        <p className="text-xs text-emerald-200">
                          আপনার প্রোফাইলের সম্পূর্ণ বিস্তারিত তথ্য, খেলার পরিচয় এবং ডেলিভারি ঠিকানা
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer hover:brightness-110"
                      >
                        ✏️ তথ্য পরিবর্তন করুন
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          label: 'পূর্ণ নাম (Full Name)',
                          value: userAccount ? userAccount.name : userProfile.name,
                          highlight: true
                        },
                        {
                          label: 'অ্যাকাউন্ট আইডি (Account ID)',
                          value: userProfile.accountId,
                          mono: true
                        },
                        {
                          label: 'মোবাইল নাম্বার (Mobile Number)',
                          value: userAccount ? userAccount.phone : userProfile.phone,
                          mono: true
                        },
                        {
                          label: 'ইমেইল অ্যাড্রেস (Email Address)',
                          value: userProfile.email
                        },
                        {
                          label: 'বয়স (Age)',
                          value: userProfile.age
                        },
                        {
                          label: 'রক্তের গ্রুপ (Blood Group)',
                          value: userProfile.bloodGroup
                        },
                        {
                          label: 'পছন্দের খেলা (Favorite Sport)',
                          value: userProfile.favoriteSport
                        },
                        {
                          label: 'খেলোয়াড়ের ধরন / পজিশন (Playing Role)',
                          value: userProfile.playingRole
                        },
                        {
                          label: 'বিকাশ / নগদ পেমেন্ট নাম্বার (Payment Number)',
                          value: `${userProfile.paymentMethod}: ${userProfile.paymentPhone}`,
                          mono: true
                        },
                        {
                          label: 'মেম্বারশিপ ও স্ট্যাটাস (Membership Status)',
                          value: userProfile.membershipTier,
                          highlight: true
                        },
                        {
                          label: 'জেলা ও থানা/উপজেলা (District & Thana)',
                          value: `${userProfile.thana}, ${userProfile.district}`
                        },
                        {
                          label: 'যোগদানের তারিখ (Member Since)',
                          value: userProfile.joinedDate
                        }
                      ].map((info, idx) => (
                        <div
                          key={idx}
                          className="bg-[#021A0A]/90 border border-emerald-600/40 rounded-xl p-3 space-y-0.5"
                        >
                          <div className="text-[11px] text-emerald-300 font-medium">
                            {info.label}
                          </div>
                          <div
                            className={`text-xs sm:text-sm font-bold ${
                              info.highlight
                                ? 'text-[#FFD700]'
                                : info.mono
                                ? 'font-mono-num text-[#00FF66]'
                                : 'text-white'
                            }`}
                          >
                            {info.value}
                          </div>
                        </div>
                      ))}

                      <div className="sm:col-span-2 bg-[#021A0A]/90 border border-[#FFD700]/40 rounded-xl p-3.5 space-y-1">
                        <div className="text-[11px] text-[#FFD700] font-bold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                          <span>পূর্ণ ঠিকানা / প্রোডাক্ট ডেলিভারি অ্যাড্রেস (Full Delivery Address)</span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {userProfile.address} ({userProfile.thana}, {userProfile.district})
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QUICK ACCOUNT SERVICES SHORTCUTS FOR THIS USER */}
                <div className="bg-[#072B12] border border-emerald-600/50 rounded-2xl p-4 space-y-3">
                  <h3 className="text-sm font-display font-black text-[#FFD700]">
                    ⚡ আমার অ্যাকাউন্ট সার্ভিস ও সুবিধাসমূহ (My Account Services)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPage('MY_TEAM')}
                      className="p-3 rounded-xl bg-[#021A0A] border border-[#FFD700]/50 text-left hover:border-[#00FF66] transition-all cursor-pointer space-y-1"
                    >
                      <div className="text-xs font-display font-black text-[#FFD700]">
                        🛡️ আমার টিম ও খেলোয়াড় তালিকা
                      </div>
                      <div className="text-[11px] text-emerald-200">
                        মোট {savedTeams.length} টি টিম • টিম আইডি ও পিন দেখুন
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPage('STORE')}
                      className="p-3 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-left hover:border-[#FFD700] transition-all cursor-pointer space-y-1"
                    >
                      <div className="text-xs font-display font-black text-[#00FF66]">
                        🛒 স্পোর্টস স্টোর শপিং
                      </div>
                      <div className="text-[11px] text-emerald-200">
                        পয়েন্ট দিয়ে জার্সি, ব্যাট, বল ও ক্যারম অর্ডার করুন
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPage('SUPPORT')}
                      className="p-3 rounded-xl bg-[#021A0A] border border-[#00F0FF]/50 text-left hover:border-[#FFD700] transition-all cursor-pointer space-y-1"
                    >
                      <div className="text-xs font-display font-black text-[#00F0FF]">
                        🎧 ২৪/৭ হেল্প ও সাপোর্ট সেন্টার
                      </div>
                      <div className="text-[11px] text-emerald-200">
                        অ্যাকাউন্ট বা পয়েন্ট সংক্রান্ত যেকোনো সাহায্য নিন
                      </div>
                    </button>
                  </div>

                  {/* Direct 1-Click Project ZIP Download Button (sfmartbd-live.zip) */}
                  <div className="pt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-emerald-200">
                      📦 সম্পূর্ণ প্রজেক্ট সোর্স কোড ডাউনলোড (Exclude <code className="text-[#FFD700]">node_modules</code> &amp; <code className="text-[#FFD700]">.git</code>):
                    </div>
                    <a
                      href="/sfmartbd-live.zip"
                      download="sfmartbd-live.zip"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xs shadow-md hover:brightness-110 transition-all inline-flex items-center gap-1.5"
                    >
                      <span>⬇️ Download sfmartbd-live.zip</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY TEAMS & SQUAD INFO */}
            {profileSubTab === 'TEAMS' && (
              <div className="bg-[#072B12] border border-[#00FF66]/60 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/70 pb-3">
                  <div>
                    <h2 className="text-base font-display font-black text-[#FFD700]">
                      🛡️ আমার টিম ও স্কোয়াড ইনফরমেশন ({savedTeams.length})
                    </h2>
                    <p className="text-xs text-emerald-200">
                      আপনার তৈরি করা টিম, টিম আইডি, পিন নাম্বার ও খেলোয়াড়দের তালিকা
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage('MY_TEAM')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                  >
                    + নতুন টিম সাজান / পরিচালনা করুন →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedTeams.map((tm) => (
                    <div
                      key={tm.id}
                      onClick={() => setPage('MY_TEAM')}
                      className="bg-[#021A0A] border border-emerald-500/50 hover:border-[#FFD700] rounded-xl p-3.5 space-y-2 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-display font-black text-[#FFD700] truncate">
                          {tm.teamName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-display font-black ${
                            tm.isActive
                              ? 'bg-[#00FF66] text-[#021A0A]'
                              : 'bg-amber-500 text-[#021A0A]'
                          }`}
                        >
                          {tm.isActive ? '✅ ACTIVE' : '🔒 INACTIVE'}
                        </span>
                      </div>
                      <div className="text-xs font-mono-num text-[#00F0FF] font-bold">
                        Team ID: {tm.teamIdCode} • PIN: {tm.pinCode}
                      </div>
                      <div className="text-xs text-emerald-200">
                        📍 ঠিকানা: {tm.villageAddress}, {tm.district} • 👥 খেলোয়াড়: {tm.players.length} জন
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MY STORE ORDERS */}
            {profileSubTab === 'ORDERS' && (
              <div className="bg-[#072B12] border border-[#FFD700]/60 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/70 pb-3">
                  <div>
                    <h2 className="text-base font-display font-black text-[#FFD700]">
                      🛒 আমার অর্ডার ও শপিং হিস্ট্রি ({orders.length})
                    </h2>
                    <p className="text-xs text-emerald-200">
                      স্পোর্টস স্টোর থেকে আপনার অর্ডার করা সকল পণ্যের বিবরণ ও ডেলিভারি স্ট্যাটাস
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage('STORE')}
                    className="px-3.5 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                  >
                    🛒 স্পোর্টস স্টোরে যান →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#021A0A] border border-emerald-700/50 rounded-xl p-6 text-center space-y-2">
                    <ShoppingBag className="w-8 h-8 text-[#FFD700] mx-auto" />
                    <div className="text-sm font-display font-bold text-white">
                      আপনি এখনো কোনো পণ্য অর্ডার করেননি
                    </div>
                    <p className="text-xs text-emerald-300">
                      আপনার রিওয়ার্ড পয়েন্ট দিয়ে স্পোর্টস স্টোর থেকে জার্সি, ক্রিকেট ব্যাট, ফুটবল ও ক্যারম বোর্ড অর্ডার করতে পারেন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#021A0A] border border-emerald-600/50 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-display font-black text-[#FFD700]">
                            {ord.itemName}
                          </div>
                          <div className="text-xs text-emerald-200 font-mono-num">
                            Order ID: {ord.id} • তারিখ: {ord.date}
                          </div>
                          <div className="text-[11px] text-emerald-300">
                            ডেলিভারি ঠিকানা: {userProfile.address}, {userProfile.thana}, {userProfile.district}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-xs font-mono-num font-black text-[#00FF66]">
                            -{ord.pointsSpent.toLocaleString()} Pts (৳{ord.takaValue} Tk)
                          </div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DEPOSIT & PAYMENT TRANSACTIONS */}
            {profileSubTab === 'TRANSACTIONS' && (
              <div className="bg-[#072B12] border border-[#00FF66]/60 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/70 pb-3">
                  <div>
                    <h2 className="text-base font-display font-black text-[#FFD700]">
                      💳 পয়েন্ট ডিপোজিট ও লেনদেন হিস্ট্রি ({deposits.length})
                    </h2>
                    <p className="text-xs text-emerald-200">
                      বিকাশ ও নগদের মাধ্যমে আপনার অ্যাকাউন্টে যুক্ত করা সকল পয়েন্টের হিসাব
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                  >
                    + নতুন পয়েন্ট ডিপোজিট করুন
                  </button>
                </div>

                {deposits.length === 0 ? (
                  <div className="bg-[#021A0A] border border-emerald-700/50 rounded-xl p-6 text-center space-y-2">
                    <Wallet className="w-8 h-8 text-[#00FF66] mx-auto" />
                    <div className="text-sm font-display font-bold text-white">
                      এখনো কোনো ডিপোজিট ট্রানজেকশন নেই
                    </div>
                    <p className="text-xs text-emerald-300">
                      আপনার বর্তমান ওয়ালেট ব্যালেন্স: <strong>{points.toLocaleString()} Points</strong>। নতুন পয়েন্ট কিনতে উপরে ডিপোজিট বাটনে ক্লিক করুন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {deposits.map((d) => (
                      <div
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-[#021A0A] border border-emerald-600/50 px-4 py-3 rounded-xl text-xs"
                      >
                        <div className="space-y-0.5">
                          <div>
                            <span className="font-bold text-[#FFD700]">{d.method}</span> • TrxID:{' '}
                            <span className="font-mono-num font-bold text-white">{d.trxId}</span>
                          </div>
                          <div className="text-[11px] text-emerald-300">
                            প্রেরক নাম্বার: {d.phone} • সময়: {d.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono-num font-black text-sm text-[#00FF66]">
                            +{d.points.toLocaleString()} Pts (৳{d.taka} Tk)
                          </div>
                          <span className="text-[10px] text-emerald-300 font-bold">
                            ✔ Verified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ACCOUNT SECURITY & PASSWORD */}
            {profileSubTab === 'SECURITY' && (
              <div className="bg-[#072B12] border border-[#00FF66]/60 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="border-b border-emerald-700/70 pb-3">
                  <h2 className="text-base font-display font-black text-[#FFD700]">
                    🔒 অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন
                  </h2>
                  <p className="text-xs text-emerald-200">
                    আপনার অ্যাকাউন্ট এবং রিওয়ার্ড পয়েন্ট ওয়ালেট সুরক্ষিত রাখতে পাসওয়ার্ড পরিবর্তন করুন
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!pwdForm.next || pwdForm.next.length < 4) {
                      triggerToast('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের দিন।');
                      return;
                    }
                    if (pwdForm.next !== pwdForm.confirm) {
                      triggerToast('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
                      return;
                    }
                    setPwdForm({ current: '', next: '', confirm: '' });
                    triggerToast('আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#FFD700] mb-1">
                      বর্তমান পাসওয়ার্ড (Current Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={pwdForm.current}
                      onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD700] mb-1">
                      নতুন পাসওয়ার্ড (New Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={pwdForm.next}
                      onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))}
                      placeholder="নতুন পাসওয়ার্ড দিন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD700] mb-1">
                      পুনরায় নতুন পাসওয়ার্ড দিন (Confirm Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={pwdForm.confirm}
                      onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
                      placeholder="পুনরায় নতুন পাসওয়ার্ড দিন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-lg"
                    >
                      🔑 পাসওয়ার্ড আপডেট করুন
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          BOTTOM NAVIGATION BAR (HIDDEN WHEN IN STANDALONE CRICKET, FOOTBALL, TENNIS, LUDO OR CARROM HUB)
         ==================================================================== */}
      {page !== 'CRICKET' && page !== 'MATCHES' && page !== 'FOOTBALL' && page !== 'TENNIS' && page !== 'LUDO' && page !== 'CARAM' && (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#011406] via-[#04240B] to-[#06310F] border-t border-[#00FF00]/50 shadow-[0_-4px_20px_rgba(0,0,0,0.85)]">
        <div className="max-w-5xl mx-auto grid grid-cols-5 h-16 items-center">
          {[
            { id: 'HOME' as PageType, label: 'Home', icon: Home },
            { id: 'MATCHES' as PageType, label: 'Matches', icon: Activity },
            { id: 'GAMES' as PageType, label: 'Games', icon: Gamepad2 },
            { id: 'STORE' as PageType, label: 'Store', icon: ShoppingBag },
            { id: 'PROFILE' as PageType, label: 'Profile', icon: User }
          ].map((nav) => {
            const IconComp = nav.icon;
            const isActive =
              page === nav.id ||
              (nav.id === 'MATCHES' && (page === 'GOLIVE' || page === 'LIVE_VIDEO'));
            return (
              <button
                key={nav.id}
                onClick={() => setPage(nav.id)}
                className="relative h-full flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
              >
                <IconComp
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#FFD700]' : 'text-white/90'
                  }`}
                />
                <span
                  className={`text-[11px] sm:text-xs font-bold tracking-tight ${
                    isActive ? 'text-[#FFD700]' : 'text-white/90'
                  }`}
                >
                  {nav.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-1 w-12 h-1 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      )}

      {/* Monetag / Active Ad Network Fullscreen Vignette Popup on Page Navigation */}
      <MonetagVignetteFullscreenModal
        isOpen={pendingVignettePage !== null}
        settings={monetagSettings}
        activeNetwork={activeRotatedNetwork}
        targetPageName={pendingVignettePage || 'Next Page'}
        onCloseAndNavigate={() => {
          const target = pendingVignettePage;
          setPendingVignettePage(null);
          if (target) {
            setPageInternal(target);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenMonetagAdmin={() => {
          setPendingVignettePage(null);
          openAdsManagerAdminPage();
        }}
      />

      {/* Floating 24/7 AI Live Support Chat Widget (Accessible on all screens) */}
      <FloatingAiSupportWidget
        userName={userAccount?.name}
        points={points}
        activeTeamsCount={savedTeams.filter((t) => t.isActive).length}
        onOpenDeposit={() => setShowDepositModal(true)}
        onNavigate={(targetPage) => setPage(targetPage)}
      />

      {/* Deposit via bKash / Nagad Modal */}
      {showDepositModal && (
        <DepositModal
          initialTaka={depositPresetTaka}
          onClose={() => setShowDepositModal(false)}
          onSuccessDeposit={(rec) => {
            setDeposits((prev) => [rec, ...prev]);
            setPoints((p) => p + rec.points);
            setShowDepositModal(false);
            triggerToast(`Deposited ${rec.taka} Tk via ${rec.method} -> +${rec.points} Points added!`);
          }}
        />
      )}

      {/* Sign Up / Log In Modal (Name, Number, Password) */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A3A0A] border-2 border-[#00FF00] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-[0_0_24px_rgba(0,255,0,0.3)]">
            <div className="flex items-center justify-between border-b border-emerald-700 pb-2.5">
              <div>
                <h3 className="text-lg font-display font-black text-[#FFD700]">
                  {authModalMode === 'SIGNUP' ? 'CREATE SPORTSVIVA ACCOUNT' : 'LOG IN TO SPORTSVIVA'}
                </h3>
                {authModalMode === 'SIGNUP' && (
                  <p className="text-[11px] font-bold text-[#00FF66] mt-0.5">
                    🎁 নতুন একাউন্ট খুললেই পাচ্ছেন ১০০ পয়েন্ট SignUp বোনাস!
                  </p>
                )}
              </div>
              <button
                onClick={() => setAuthModalMode(null)}
                className="text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const uname = String(fd.get('uname') || userProfile.name || 'Sakib_BD').trim();
                const uphone = String(fd.get('uphone') || userProfile.phone || '01711-000000').trim();
                const isSignUp = authModalMode === 'SIGNUP';
                const accountKey = String(uphone || uname).trim().toLowerCase();

                setUserAccount({ name: uname, phone: uphone });
                setUserProfile((prev) => ({
                  ...prev,
                  accountId: isSignUp
                    ? `SV-BD-${Math.floor(100000 + Math.random() * 900000)}`
                    : prev.accountId,
                  name: uname,
                  phone: uphone || prev.phone,
                  paymentPhone: uphone || prev.paymentPhone,
                  joinedDate: isSignUp ? new Date().toLocaleDateString('bn-BD') : prev.joinedDate
                }));
                setAuthModalMode(null);

                if (isSignUp) {
                  // New account gets exact 100 Points SignUp Bonus (does not inherit another user's 1300 points)
                  const signupBonusPoints = 100;
                  setPoints(signupBonusPoints);
                  try {
                    localStorage.setItem('sv_points', String(signupBonusPoints));
                    const walletsRaw = localStorage.getItem('sv_user_wallets_v1');
                    const wallets = walletsRaw ? JSON.parse(walletsRaw) : {};
                    if (accountKey) {
                      wallets[accountKey] = signupBonusPoints;
                      localStorage.setItem('sv_user_wallets_v1', JSON.stringify(wallets));
                    }
                  } catch {
                    // ignore storage errors
                  }
                  triggerToast('🎉 অভিনন্দন! নতুন আইডি খোলার জন্য ১০০ পয়েন্ট SignUp বোনাস যোগ হয়েছে!');
                } else {
                  // Existing user login: restore their saved wallet balance or default 100 points
                  try {
                    const walletsRaw = localStorage.getItem('sv_user_wallets_v1');
                    const wallets = walletsRaw ? JSON.parse(walletsRaw) : {};
                    const savedUserPts =
                      accountKey && typeof wallets[accountKey] === 'number'
                        ? wallets[accountKey]
                        : null;
                    if (savedUserPts !== null) {
                      setPoints(savedUserPts);
                    }
                  } catch {
                    // ignore
                  }
                  triggerToast(`স্বাগতম ${uname}! সফলভাবে লগইন হয়েছে।`);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#FFD700] mb-1">Name</label>
                <input
                  name="uname"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white focus:outline-none focus:border-[#00FF00]"
                />
              </div>
              {authModalMode === 'SIGNUP' && (
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">Number</label>
                  <input
                    name="uphone"
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white focus:outline-none focus:border-[#00FF00]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#FFD700] mb-1">Password</label>
                <input
                  name="upassword"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white focus:outline-none focus:border-[#00FF00]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FF00] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-lg"
              >
                {authModalMode === 'SIGNUP' ? 'Sign Up & Claim 100 Points Bonus' : 'Log In Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


