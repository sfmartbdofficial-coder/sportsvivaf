import React, { useState, useEffect, useRef } from 'react';
import { CardAdBanner } from './AdBannerSystem';
import {
  ChevronLeft,
  Search,
  X,
  Play,
  Trophy,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  Plus,
  Share2,
  Zap,
  Award,
  Activity,
  RefreshCw
} from 'lucide-react';

// ============================================================================
// TYPES FOR STANDALONE WORLD-CLASS TENNIS HUB
// ============================================================================
export interface CustomTennisMatch {
  id: string;
  tournament: string;
  surface: 'GRASS' | 'HARD' | 'CLAY';
  format: 'BEST_OF_3' | 'BEST_OF_5';
  player1: string;
  player2: string;
  p1Code: string;
  p2Code: string;
  p1Country: string;
  p2Country: string;
  setsP1: number[];
  setsP2: number[];
  ptsP1: string;
  ptsP2: string;
  server: 1 | 2;
  status: 'LIVE' | 'COMPLETED';
  venue: string;
  acesP1: number;
  acesP2: number;
  winnersP1: number;
  winnersP2: number;
  doubleFaultsP1: number;
  doubleFaultsP2: number;
  events: {
    id: string;
    scoreTag: string;
    player: 1 | 2;
    type: 'ACE' | 'WINNER' | 'BREAK' | 'GAME' | 'POINT';
    text: string;
  }[];
}

interface TennisPlayerProfile {
  id: string;
  rank: number;
  name: string;
  code: string;
  country: string;
  flagCode: string;
  tour: 'ATP' | 'WTA';
  age: number;
  plays: string;
  grandSlams: number;
  careerTitles: number;
  winLoss2026: string;
  prizeMoney: string;
  fastestServe: string;
  firstServePct: string;
  acesSeason: number;
  favoriteSurface: string;
}

interface FeaturedTennisSlide {
  id: string;
  tournament: string;
  courtInfo: string;
  surface: 'GRASS' | 'HARD' | 'CLAY';
  p1Name: string;
  p1Code: string;
  p1Flag: string;
  p1Seed: string;
  p1Sets: number[];
  p1GamePts: string;
  p2Name: string;
  p2Code: string;
  p2Flag: string;
  p2Seed: string;
  p2Sets: number[];
  p2GamePts: string;
  server: 1 | 2;
  statusLabel: string;
  isLive: boolean;
  serveSpeedKmh: number;
  rallySummary: string;
  h2hP1: number;
  h2hP2: number;
  umpire: string;
  venue: string;
  weatherTemp: string;
  weatherCondition: string;
  humidity: string;
  isCustom?: boolean;
  isSportMonks?: boolean;
}

const IMG_TENNIS_COURT =
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80';
const IMG_TENNIS_ACTION =
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80';
const IMG_TENNIS_BALL =
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=900&q=80';

const STAR_TENNIS_PLAYERS: TennisPlayerProfile[] = [
  {
    id: 'tp-alcaraz',
    rank: 1,
    name: 'Carlos Alcaraz',
    code: 'ALC',
    country: '🇪🇸 Spain',
    flagCode: 'ESP',
    tour: 'ATP',
    age: 23,
    plays: 'Right-Handed (Two-Handed Backhand)',
    grandSlams: 5,
    careerTitles: 19,
    winLoss2026: '48 - 6',
    prizeMoney: '$39.4M',
    fastestServe: '222 km/h',
    firstServePct: '68%',
    acesSeason: 342,
    favoriteSurface: 'Grass & Clay'
  },
  {
    id: 'tp-sinner',
    rank: 2,
    name: 'Jannik Sinner',
    code: 'SIN',
    country: '🇮🇹 Italy',
    flagCode: 'ITA',
    tour: 'ATP',
    age: 24,
    plays: 'Right-Handed (Two-Handed Backhand)',
    grandSlams: 3,
    careerTitles: 21,
    winLoss2026: '52 - 5',
    prizeMoney: '$34.8M',
    fastestServe: '220 km/h',
    firstServePct: '66%',
    acesSeason: 418,
    favoriteSurface: 'Hard Court'
  },
  {
    id: 'tp-djokovic',
    rank: 3,
    name: 'Novak Djokovic',
    code: 'DJO',
    country: '🇷🇸 Serbia',
    flagCode: 'SRB',
    tour: 'ATP',
    age: 38,
    plays: 'Right-Handed (Two-Handed Backhand)',
    grandSlams: 24,
    careerTitles: 99,
    winLoss2026: '31 - 7',
    prizeMoney: '$185.5M',
    fastestServe: '212 km/h',
    firstServePct: '69%',
    acesSeason: 265,
    favoriteSurface: 'All Surfaces (GOAT)'
  },
  {
    id: 'tp-sabalenka',
    rank: 1,
    name: 'Aryna Sabalenka',
    code: 'SAB',
    country: '🏳️ WTA #1',
    flagCode: 'WTA',
    tour: 'WTA',
    age: 27,
    plays: 'Right-Handed (Power Baseline)',
    grandSlams: 4,
    careerTitles: 18,
    winLoss2026: '46 - 7',
    prizeMoney: '$30.2M',
    fastestServe: '204 km/h',
    firstServePct: '65%',
    acesSeason: 310,
    favoriteSurface: 'Hard Court'
  },
  {
    id: 'tp-swiatek',
    rank: 2,
    name: 'Iga Świątek',
    code: 'SWI',
    country: '🇵🇱 Poland',
    flagCode: 'POL',
    tour: 'WTA',
    age: 24,
    plays: 'Right-Handed (Heavy Topspin)',
    grandSlams: 6,
    careerTitles: 24,
    winLoss2026: '49 - 6',
    prizeMoney: '$33.6M',
    fastestServe: '191 km/h',
    firstServePct: '71%',
    acesSeason: 175,
    favoriteSurface: 'Clay & Hard'
  },
  {
    id: 'tp-zarif',
    rank: 1,
    name: 'Zarif Abrar',
    code: 'ZAR',
    country: '🇧🇩 Bangladesh',
    flagCode: 'BAN',
    tour: 'ATP',
    age: 20,
    plays: 'Right-Handed (All-Court Attack)',
    grandSlams: 0,
    careerTitles: 6,
    winLoss2026: '29 - 4',
    prizeMoney: '$420K',
    fastestServe: '206 km/h',
    firstServePct: '67%',
    acesSeason: 198,
    favoriteSurface: 'Hard Court (Ramna Dhaka)'
  }
];

const TENNIS_POINTS_ORDER = ['0', '15', '30', '40', 'AD'];

export const TennisHome: React.FC<{
  onBack: () => void;
  awardPoints?: (pts: number, reason?: string) => void;
}> = ({ onBack, awardPoints }) => {
  // Navigation & Theme States
  const [topTab, setTopTab] = useState<'FEATURED' | 'LIVE' | 'CREATE_LIVE'>('FEATURED');
  const [bottomNav, setBottomNav] = useState<'HOME' | 'REELS' | 'FIXTURES' | 'SLAMS' | 'MORE'>('HOME');
  const [liveSubTab, setLiveSubTab] = useState<'INFO' | 'LIVE' | 'COURT_H2H' | 'STATS' | 'POINT_BY_POINT'>('LIVE');
  const [fixtureFilter, setFixtureFilter] = useState<'LIVE' | 'UPCOMING' | 'RESULTS' | 'BRACKET'>('LIVE');
  const [courtTheme, setCourtTheme] = useState<'WIMBLEDON_GRASS' | 'US_OPEN_HARD' | 'ROLAND_GARROS_CLAY'>('WIMBLEDON_GRASS');

  // Carousel & Selection States
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNewsDot, setActiveNewsDot] = useState(0);
  const [showMatchDropdown, setShowMatchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [liveMuted, setLiveMuted] = useState(false);

  // Interactive Court & Modal States
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<TennisPlayerProfile | null>(null);
  const [pointFilter, setPointFilter] = useState<'ALL' | 'ACES' | 'BREAKS' | 'WINNERS'>('ALL');
  const [activeModal, setActiveModal] = useState<null | {
    title: string;
    subtitle: string;
    body: string;
    img?: string;
  }>(null);

  // Slams & More Sub-Screens (Working all the way to the Final Step!)
  const [selectedSlamId, setSelectedSlamId] = useState<string>('wimbledon');
  const [slamSubTab, setSlamSubTab] = useState<'DRAW' | 'MATCHES' | 'ACES' | 'CHAMPIONS'>('DRAW');
  const [moreSubScreen, setMoreSubScreen] = useState<
    'MENU' | 'ATP_WTA_RANKINGS' | 'PLAYERS' | 'RECORDS' | 'POLLS'
  >('MENU');
  const [rankingTourTab, setRankingTourTab] = useState<'ATP' | 'WTA'>('ATP');
  const [pollVoted, setPollVoted] = useState<Record<string, string>>({});

  // Live Court Rally & Hawk-Eye Simulation State
  const [liveSimPts, setLiveSimPts] = useState<{ p1: string; p2: string; aces1: number; aces2: number }>({
    p1: '40',
    p2: '30',
    aces1: 14,
    aces2: 11
  });
  const [hawkEyeState, setHawkEyeState] = useState<{
    x: number;
    y: number;
    call: 'IN' | 'ACE' | 'WINNER';
    speed: number;
    desc: string;
  }>({
    x: 78,
    y: 26,
    call: 'IN',
    speed: 216,
    desc: '🦅 HAWK-EYE LINE CALL: 100% IN on Baseline! (216 km/h Forehand Winner)'
  });
  const [aceBanner, setAceBanner] = useState<string | null>(null);

  // ==========================================================================
  // PLUS (+) TAB: CREATE & SCORE YOUR OWN LIVE TENNIS MATCH (4-STEP FLOW!)
  // ==========================================================================
  const [customMatches, setCustomMatches] = useState<CustomTennisMatch[]>(() => {
    try {
      const saved = localStorage.getItem('sv_custom_tennis_matches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sv_custom_tennis_matches', JSON.stringify(customMatches));
    } catch {
      // ignore
    }
  }, [customMatches]);

  const [createStep, setCreateStep] = useState<'SETUP' | 'TOSS' | 'SCORING' | 'FINAL_SUMMARY'>('SETUP');
  const [formTournament, setFormTournament] = useState('Dhaka Grand Slam Open 2026');
  const [formVenue, setFormVenue] = useState('Ramna National Tennis Complex, Dhaka');
  const [formSurface, setFormSurface] = useState<'GRASS' | 'HARD' | 'CLAY'>('HARD');
  const [formFormat, setFormFormat] = useState<'BEST_OF_3' | 'BEST_OF_5'>('BEST_OF_3');
  const [formP1, setFormP1] = useState('Zarif Abrar');
  const [formP2, setFormP2] = useState('Carlos Alcaraz');
  const [formP1Country, setFormP1Country] = useState('🇧🇩 BAN');
  const [formP2Country, setFormP2Country] = useState('🇪🇸 ESP');
  const [tossWinner, setTossWinner] = useState<1 | 2>(1);
  const [tossChoice, setTossChoice] = useState<'SERVE' | 'RECEIVE'>('SERVE');
  const [activeCustomId, setActiveCustomId] = useState<string | null>(null);

  const featuredCarouselRef = useRef<HTMLDivElement | null>(null);
  const newsCarouselRef = useRef<HTMLDivElement | null>(null);

  // Genuine ESPN Tennis API State (60-Second Cache for 50,000+ Concurrent Users)
  const [sportMonksMatches, setSportMonksMatches] = useState<FeaturedTennisSlide[]>([]);
  const [espnLiveTennis, setEspnLiveTennis] = useState<FeaturedTennisSlide[]>([]);
  const [espnUpcomingTennis, setEspnUpcomingTennis] = useState<FeaturedTennisSlide[]>([]);
  const [espnRecentTennis, setEspnRecentTennis] = useState<FeaturedTennisSlide[]>([]);
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

  const fetchSportMonksTennis = async () => {
    try {
      setSportMonksMeta((prev) => ({ ...prev, loading: true }));
      const res = await fetch('/api/live/tennis');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.matches)) {
        setSportMonksMatches(data.matches);
      }
      if (Array.isArray(data?.liveMatches)) {
        setEspnLiveTennis(data.liveMatches);
      }
      if (Array.isArray(data?.upcomingMatches)) {
        setEspnUpcomingTennis(data.upcomingMatches);
      }
      if (Array.isArray(data?.recentMatches)) {
        setEspnRecentTennis(data.recentMatches);
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
    fetchSportMonksTennis();
    const poll = setInterval(fetchSportMonksTennis, 30000);
    return () => clearInterval(poll);
  }, []);

  // Live Court Rally & Hawk-Eye Interval
  useEffect(() => {
    const timer = setInterval(() => {
      const rallies: typeof hawkEyeState[] = [
        {
          x: 82,
          y: 22,
          call: 'ACE',
          speed: 219,
          desc: '⚡ SERVICE ACE DOWN THE T! 219 km/h Rocket Serve!'
        },
        {
          x: 24,
          y: 74,
          call: 'WINNER',
          speed: 168,
          desc: '🎾 CROSS-COURT BACKHAND WINNER! 18-Shot Baseline Rally!'
        },
        {
          x: 76,
          y: 80,
          call: 'IN',
          speed: 184,
          desc: '🦅 HAWK-EYE VERIFIED: Ball clipped outer chalk line by 2.4mm — IN!'
        },
        {
          x: 48,
          y: 35,
          call: 'WINNER',
          speed: 142,
          desc: '🔥 DELICATE DROP VOLLEY AT THE NET! Crowd on their feet!'
        },
        {
          x: 18,
          y: 28,
          call: 'IN',
          speed: 208,
          desc: '⚡ WIDE SLICE SERVE & FOREHAND INSIDE-OUT WINNER!'
        }
      ];
      setHawkEyeState(rallies[Math.floor(Math.random() * rallies.length)]);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Theme Definitions (3 Grand Slam Court Themes)
  const theme = {
    WIMBLEDON_GRASS: {
      pageBg: 'bg-gradient-to-b from-[#042414] via-[#07331D] to-[#02150B]',
      headerBg: 'bg-[#062C18]/95 border-[#FFD700]/45',
      cardBg:
        'bg-gradient-to-br from-[#0A3D22] via-[#08301B] to-[#052012] border-[#00FF66]/45 shadow-[0_6px_24px_rgba(0,0,0,0.5)]',
      innerCardBg: 'bg-[#041E10] border-emerald-500/35',
      pillBg: 'bg-[#0A3D22] border-[#FFD700]/45 text-white hover:border-[#00FF66]',
      titleText: 'text-white',
      subText: 'text-emerald-200/90',
      accentText: 'text-[#FFD700]',
      dotActive: 'bg-[#FFD700]',
      dotInactive: 'bg-emerald-800/70',
      navBg: 'bg-[#03180D] border-[#FFD700]/45'
    },
    US_OPEN_HARD: {
      pageBg: 'bg-gradient-to-b from-[#041830] via-[#072647] to-[#020E1D]',
      headerBg: 'bg-[#06213E]/95 border-[#00F0FF]/45',
      cardBg:
        'bg-gradient-to-br from-[#0B2E56] via-[#082342] to-[#05172C] border-[#00F0FF]/45 shadow-[0_6px_24px_rgba(0,0,0,0.5)]',
      innerCardBg: 'bg-[#04162A] border-cyan-500/35',
      pillBg: 'bg-[#0B2E56] border-[#FFD700]/45 text-white hover:border-[#00F0FF]',
      titleText: 'text-white',
      subText: 'text-cyan-200/90',
      accentText: 'text-[#FFD700]',
      dotActive: 'bg-[#00F0FF]',
      dotInactive: 'bg-cyan-800/70',
      navBg: 'bg-[#031222] border-[#00F0FF]/45'
    },
    ROLAND_GARROS_CLAY: {
      pageBg: 'bg-gradient-to-b from-[#2B1008] via-[#3A160B] to-[#1A0804]',
      headerBg: 'bg-[#351309]/95 border-[#FF8A00]/45',
      cardBg:
        'bg-gradient-to-br from-[#4D1D0E] via-[#3B150A] to-[#260D06] border-[#FF8A00]/45 shadow-[0_6px_24px_rgba(0,0,0,0.55)]',
      innerCardBg: 'bg-[#240C05] border-amber-500/35',
      pillBg: 'bg-[#4D1D0E] border-[#FFD700]/45 text-white hover:border-[#FF8A00]',
      titleText: 'text-white',
      subText: 'text-amber-200/90',
      accentText: 'text-[#FFD700]',
      dotActive: 'bg-[#FFD700]',
      dotInactive: 'bg-amber-900/70',
      navBg: 'bg-[#1C0904] border-[#FF8A00]/45'
    }
  }[courtTheme];

  // Genuine ESPN Tennis Matches + User Created Matches (No Fake Hardcoded Matches)
  const customTennisSlides: FeaturedTennisSlide[] = customMatches.map((cm) => ({
    id: cm.id,
    tournament: `${cm.tournament} • LIVE COURT`,
    courtInfo: `${cm.venue} • ${cm.surface} COURT`,
    surface: cm.surface,
    p1Name: cm.player1,
    p1Code: cm.p1Code,
    p1Flag: 'BAN',
    p1Seed: '#1',
    p1Sets: cm.setsP1,
    p1GamePts: cm.ptsP1,
    p2Name: cm.player2,
    p2Code: cm.p2Code,
    p2Flag: 'ESP',
    p2Seed: '#2',
    p2Sets: cm.setsP2,
    p2GamePts: cm.ptsP2,
    server: cm.server,
    statusLabel: cm.status === 'LIVE' ? `LIVE • SET ${cm.setsP1.length}` : 'FINAL RESULT',
    isLive: cm.status === 'LIVE',
    serveSpeedKmh: 212,
    rallySummary: `⚡ Aces: ${cm.acesP1}-${cm.acesP2} • Winners: ${cm.winnersP1}-${cm.winnersP2}`,
    h2hP1: 3,
    h2hP2: 2,
    umpire: 'Kader Khan (ITF Gold Badge)',
    venue: cm.venue,
    weatherTemp: '26.5 °C',
    weatherCondition: 'Clear Floodlit Court',
    humidity: '62%',
    isCustom: true
  }));

  const featuredSlides: FeaturedTennisSlide[] = [
    ...customTennisSlides,
    ...sportMonksMatches
  ];

  const genuineLiveTennisSlides: FeaturedTennisSlide[] = [
    ...customTennisSlides.filter((m) => m.isLive),
    ...espnLiveTennis
  ];
  const totalLiveTennisCount = genuineLiveTennisSlides.length;

  const fallbackTennisMatch: FeaturedTennisSlide = {
    id: 'tn-placeholder',
    tournament: 'ATP / WTA Grand Slam & Tour Schedule',
    courtInfo: 'Center Court • Live & Upcoming Matches',
    surface: 'HARD',
    p1Name: 'Player 1',
    p1Code: 'PL1',
    p1Flag: 'ATP',
    p1Seed: '[1]',
    p1Sets: [0],
    p1GamePts: '0',
    p2Name: 'Player 2',
    p2Code: 'PL2',
    p2Flag: 'WTA',
    p2Seed: '[2]',
    p2Sets: [0],
    p2GamePts: '0',
    server: 1,
    statusLabel: 'UPCOMING',
    isLive: false,
    serveSpeedKmh: 205,
    rallySummary: 'Check Fixtures tab for upcoming and completed ATP/WTA matches.',
    h2hP1: 0,
    h2hP2: 0,
    umpire: 'ITF Chair Umpire',
    venue: 'Center Court',
    weatherTemp: '22.0 °C',
    weatherCondition: 'Clear',
    humidity: '55%'
  };

  const currentMatch =
    featuredSlides.length > 0
      ? featuredSlides[activeSlide % featuredSlides.length] || featuredSlides[0]
      : fallbackTennisMatch;
  const activeCustomMatch = customMatches.find((m) => m.id === activeCustomId) || customMatches[0] || null;

  const scrollToSlide = (idx: number) => {
    setActiveSlide(idx);
    if (featuredCarouselRef.current) {
      const w = featuredCarouselRef.current.clientWidth;
      featuredCarouselRef.current.scrollTo({
        left: idx * (w + 12),
        behavior: 'smooth'
      });
    }
  };

  const scrollToNews = (idx: number) => {
    setActiveNewsDot(idx);
    if (newsCarouselRef.current) {
      const w = newsCarouselRef.current.clientWidth;
      newsCarouselRef.current.scrollTo({
        left: idx * (w + 12),
        behavior: 'smooth'
      });
    }
  };

  // Render Circular Flag / Tour Crest
  const renderPlayerBadge = (flag: string, code: string) => {
    const flagMap: Record<string, string> = {
      ESP: '🇪🇸',
      ITA: '🇮🇹',
      SRB: '🇷🇸',
      POL: '🇵🇱',
      GER: '🇩🇪',
      BAN: '🇧🇩',
      IND: '🇮🇳',
      USA: '🇺🇸',
      KAZ: '🇰🇿',
      GRE: '🇬🇷',
      CHN: '🇨🇳',
      WTA: '👑',
      ATP: '🎾'
    };
    return (
      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFD700] shadow-md shrink-0 bg-gradient-to-br from-[#0B3B24] via-[#062315] to-[#02120A] flex flex-col items-center justify-center">
        <span className="text-sm leading-none">{flagMap[flag] || '🎾'}</span>
        <span className="text-[9px] font-display font-black text-[#FFD700] mt-0.5">{code}</span>
      </div>
    );
  };

  const speakTennis = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(u);
      } catch {
        // ignore
      }
    }
  };

  // Interactive Live Point Simulator on 2D Court
  const triggerLivePointSim = (winnerSide: 1 | 2, isAce = false) => {
    setLiveSimPts((prev) => {
      const nextMap: Record<string, string> = { '0': '15', '15': '30', '30': '40', '40': '15', AD: '15' };
      const newP1 = winnerSide === 1 ? nextMap[prev.p1] || '15' : prev.p1 === '40' && prev.p2 === '40' ? '40' : prev.p1;
      const newP2 = winnerSide === 2 ? nextMap[prev.p2] || '15' : prev.p2;
      return {
        p1: newP1,
        p2: newP2,
        aces1: isAce && winnerSide === 1 ? prev.aces1 + 1 : prev.aces1,
        aces2: isAce && winnerSide === 2 ? prev.aces2 + 1 : prev.aces2
      };
    });
    const playerName = winnerSide === 1 ? currentMatch.p1Name : currentMatch.p2Name;
    const msg = isAce
      ? `⚡ ACE!! ${playerName} fires a 221 km/h unreturnable serve down the T!`
      : `🎾 WINNER! ${playerName} wins the point with a blistering forehand down the line!`;
    setAceBanner(msg);
    if (!liveMuted) speakTennis(msg);
    if (awardPoints) awardPoints(10, 'Live Tennis Court Action');
    setTimeout(() => setAceBanner(null), 3800);
  };

  // Start Custom Tennis Match in Plus (+) Tab
  const handleStartCustomMatch = () => {
    const newMatch: CustomTennisMatch = {
      id: `ten-custom-${Date.now()}`,
      tournament: formTournament || 'Dhaka Grand Slam Open 2026',
      surface: formSurface,
      format: formFormat,
      player1: formP1 || 'Zarif Abrar',
      player2: formP2 || 'Carlos Alcaraz',
      p1Code: (formP1 || 'ZAR').slice(0, 3).toUpperCase(),
      p2Code: (formP2 || 'ALC').slice(0, 3).toUpperCase(),
      p1Country: formP1Country,
      p2Country: formP2Country,
      setsP1: [0],
      setsP2: [0],
      ptsP1: '0',
      ptsP2: '0',
      server: tossChoice === 'SERVE' ? tossWinner : tossWinner === 1 ? 2 : 1,
      status: 'LIVE',
      venue: formVenue || 'Ramna National Tennis Complex, Dhaka',
      acesP1: 0,
      acesP2: 0,
      winnersP1: 0,
      winnersP2: 0,
      doubleFaultsP1: 0,
      doubleFaultsP2: 0,
      events: [
        {
          id: `tev-${Date.now()}`,
          scoreTag: '0-0 (0-0)',
          player: tossWinner,
          type: 'POINT',
          text: `Chair Umpire: "Time! Play!" ${tossWinner === 1 ? formP1 : formP2} won the toss and elected to ${tossChoice}.`
        }
      ]
    };
    setCustomMatches((prev) => [newMatch, ...prev]);
    setActiveCustomId(newMatch.id);
    setCreateStep('SCORING');
    if (awardPoints) awardPoints(25, 'Created Live Tennis Broadcast');
  };

  // Score Point / Game in Custom Tennis Match
  const scoreCustomPoint = (winner: 1 | 2, type: 'POINT' | 'ACE' | 'WINNER' | 'DOUBLE_FAULT') => {
    if (!activeCustomMatch) return;
    setCustomMatches((prev) =>
      prev.map((m) => {
        if (m.id !== activeCustomMatch.id) return m;
        const setIdx = m.setsP1.length - 1;
        let p1 = m.ptsP1;
        let p2 = m.ptsP2;
        const sets1 = [...m.setsP1];
        const sets2 = [...m.setsP2];
        let server = m.server;

        const advancePt = (cur: string) => {
          const i = TENNIS_POINTS_ORDER.indexOf(cur);
          return i >= 0 && i < 3 ? TENNIS_POINTS_ORDER[i + 1] : 'GAME';
        };

        let gameWonBy: 1 | 2 | null = null;
        if (winner === 1) {
          if (p1 === '40' && p2 === '40') {
            p1 = 'AD';
          } else if (p1 === '40' && p2 === 'AD') {
            p2 = '40';
          } else if (p1 === '40' || p1 === 'AD') {
            gameWonBy = 1;
          } else {
            p1 = advancePt(p1);
          }
        } else {
          if (p2 === '40' && p1 === '40') {
            p2 = 'AD';
          } else if (p2 === '40' && p1 === 'AD') {
            p1 = '40';
          } else if (p2 === '40' || p2 === 'AD') {
            gameWonBy = 2;
          } else {
            p2 = advancePt(p2);
          }
        }

        if (gameWonBy === 1) {
          p1 = '0';
          p2 = '0';
          sets1[setIdx] += 1;
          server = server === 1 ? 2 : 1;
          if (sets1[setIdx] >= 6 && sets1[setIdx] - sets2[setIdx] >= 2 && sets1.length < (m.format === 'BEST_OF_3' ? 3 : 5)) {
            sets1.push(0);
            sets2.push(0);
          }
        } else if (gameWonBy === 2) {
          p1 = '0';
          p2 = '0';
          sets2[setIdx] += 1;
          server = server === 1 ? 2 : 1;
          if (sets2[setIdx] >= 6 && sets2[setIdx] - sets1[setIdx] >= 2 && sets2.length < (m.format === 'BEST_OF_3' ? 3 : 5)) {
            sets1.push(0);
            sets2.push(0);
          }
        }

        const pName = winner === 1 ? m.player1 : m.player2;
        const evText =
          type === 'ACE'
            ? `⚡ SERVICE ACE by ${pName}! (${p1}-${p2})`
            : type === 'WINNER'
            ? `🎾 Clean Forehand Winner by ${pName}! (${p1}-${p2})`
            : type === 'DOUBLE_FAULT'
            ? `⚠️ Double Fault! Point awarded to ${pName}.`
            : gameWonBy
            ? `🏆 GAME ${pName}! Score: ${sets1.join('-')}/${sets2.join('-')}`
            : `Point won by ${pName} (${p1}-${p2})`;

        return {
          ...m,
          setsP1: sets1,
          setsP2: sets2,
          ptsP1: p1,
          ptsP2: p2,
          server,
          acesP1: type === 'ACE' && winner === 1 ? m.acesP1 + 1 : m.acesP1,
          acesP2: type === 'ACE' && winner === 2 ? m.acesP2 + 1 : m.acesP2,
          winnersP1: (type === 'WINNER' || type === 'ACE') && winner === 1 ? m.winnersP1 + 1 : m.winnersP1,
          winnersP2: (type === 'WINNER' || type === 'ACE') && winner === 2 ? m.winnersP2 + 1 : m.winnersP2,
          doubleFaultsP1: type === 'DOUBLE_FAULT' && winner === 2 ? m.doubleFaultsP1 + 1 : m.doubleFaultsP1,
          doubleFaultsP2: type === 'DOUBLE_FAULT' && winner === 1 ? m.doubleFaultsP2 + 1 : m.doubleFaultsP2,
          events: [
            {
              id: `tev-${Date.now()}`,
              scoreTag: `${sets1[sets1.length - 1]}-${sets2[sets2.length - 1]} (${p1}-${p2})`,
              player: winner,
              type: type === 'ACE' ? 'ACE' : gameWonBy ? 'GAME' : 'POINT',
              text: evText
            },
            ...m.events
          ]
        };
      })
    );
  };

  return (
    <div className={`-mx-3 sm:mx-0 -mt-2.5 sm:mt-0 sm:rounded-3xl overflow-hidden min-h-screen ${theme.pageBg} pb-20 transition-colors`}>
      {/* ====================================================================
          TOP NAVIGATION BAR (WHEN NOT IN FULL LIVE MATCH SCREEN)
          <- | Featured | Live (8+) | Search | + Score Live
         ==================================================================== */}
      {!(bottomNav === 'HOME' && topTab === 'LIVE') && (
        <div className={`px-3 pt-2.5 pb-2 border-b sticky top-0 z-30 backdrop-blur-md ${theme.headerBg}`}>
          <div className="sv-rainbow-line absolute top-0 inset-x-0 h-[2px]" />
          <div className="flex items-center justify-between gap-2">
            {/* Left: Back to Main 6-Card Home + Featured | Live (8+) */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={onBack}
                title="Back to Main Home"
                className="w-7 h-7 rounded-full bg-black/35 border border-[#FFD700]/60 flex items-center justify-center text-[#FFD700] hover:bg-black/60 cursor-pointer shrink-0"
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
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Featured
                {topTab === 'FEATURED' && bottomNav === 'HOME' && (
                  <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-t-full bg-[#FFD700]" />
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
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <span>Live ({totalLiveTennisCount})</span>
                {totalLiveTennisCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                )}
              </button>
            </div>

            {/* Right: Search + PLUS (+) TAB TO CREATE & SCORE LIVE TENNIS */}
            <div className="flex items-center gap-1.5 shrink-0">
              {showSearch ? (
                <div className="flex items-center bg-black/45 border border-[#FFD700] rounded-full px-2.5 py-1 gap-1">
                  <Search className="w-3 h-3 text-[#FFD700]" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Player, Grand Slam..."
                    className="bg-transparent text-xs text-white focus:outline-none w-24 sm:w-36"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    className="text-emerald-200 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center gap-1 text-[11px] font-semibold text-white cursor-pointer"
                >
                  <Search className="w-3 h-3 text-[#FFD700]" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}

              <button
                onClick={() => {
                  setBottomNav('HOME');
                  setTopTab('CREATE_LIVE');
                }}
                className={`px-2.5 py-1 rounded-full font-display font-black text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap transition-transform active:scale-95 ${
                  topTab === 'CREATE_LIVE'
                    ? 'bg-[#FFD700] text-[#021A0A] shadow-[0_0_12px_rgba(255,215,0,0.7)]'
                    : 'bg-gradient-to-r from-[#FFD700] via-[#00FF66] to-[#00F0FF] text-[#021A0A] shadow-[0_0_10px_rgba(255,215,0,0.5)]'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Score Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN BODY CONTAINER
         ==================================================================== */}
      <div className={`${bottomNav === 'HOME' && topTab === 'LIVE' ? 'px-0' : 'px-2.5 sm:px-3.5 pt-2.5'} space-y-3`}>
        {/* ====================================================================
            PLUS (+) TAB: CREATE & SCORE YOUR OWN LIVE TENNIS MATCH
            WORKS ALL THE WAY TO THE FINAL STEP (SETUP -> TOSS -> SCORING -> FINAL TROPHY)
           ==================================================================== */}
        {bottomNav === 'HOME' && topTab === 'CREATE_LIVE' && (
          <div className="space-y-3 pb-6">
            {/* Step Progress Header */}
            <div className={`rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-2 ${theme.cardBg}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTopTab('FEATURED')}
                  className="w-8 h-8 rounded-xl bg-black/35 border border-white/15 flex items-center justify-center text-[#FFD700] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-sm sm:text-base font-display font-black text-[#FFD700] flex items-center gap-1.5">
                    <span>🎾 + GO LIVE TENNIS UMPIRE SCORER</span>
                  </h2>
                  <p className={`text-[11px] ${theme.subText}`}>
                    Create your own Tennis Match, Coin Toss, Score 15-30-40-Deuce & Generate Final Grand Slam Trophy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-display font-black">
                {[
                  { id: 'SETUP', label: '1. Setup' },
                  { id: 'TOSS', label: '2. Serve Toss' },
                  { id: 'SCORING', label: '3. Umpire Chair' },
                  { id: 'FINAL_SUMMARY', label: '4. Final Trophy' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setCreateStep(st.id as typeof createStep)}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      createStep === st.id
                        ? 'bg-[#FFD700] text-[#021A0A]'
                        : 'bg-black/35 text-white/70 border border-white/10'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: TOURNAMENT, SURFACE & PLAYER SETUP */}
            {createStep === 'SETUP' && (
              <div className={`rounded-2xl border p-4 space-y-4 ${theme.cardBg}`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-sm font-display font-black text-[#00FF66]">
                    STEP 1 OF 4: GRAND SLAM / TOURNAMENT SETUP
                  </span>
                  <span className="text-xs font-bold text-[#FFD700]">+25 Bonus Pts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1">Tournament Name</label>
                    <input
                      value={formTournament}
                      onChange={(e) => setFormTournament(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1">Center Court / Venue</label>
                    <input
                      value={formVenue}
                      onChange={(e) => setFormVenue(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/20 text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#00FF66] mb-1">Player 1 Name</label>
                    <input
                      value={formP1}
                      onChange={(e) => setFormP1(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/20 text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#00F0FF] mb-1">Player 2 Name</label>
                    <input
                      value={formP2}
                      onChange={(e) => setFormP2(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/20 text-white focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1.5">Court Surface</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['GRASS', 'HARD', 'CLAY'] as const).map((surf) => (
                        <button
                          key={surf}
                          type="button"
                          onClick={() => setFormSurface(surf)}
                          className={`py-2 rounded-xl border font-display font-bold cursor-pointer ${
                            formSurface === surf
                              ? 'bg-[#00FF66] text-[#021A0A] border-white'
                              : 'bg-black/35 text-white border-white/15'
                          }`}
                        >
                          {surf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1.5">Sets Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'BEST_OF_3', label: 'Best of 3 Sets' },
                        { id: 'BEST_OF_5', label: 'Best of 5 (Grand Slam)' }
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setFormFormat(fmt.id as typeof formFormat)}
                          className={`py-2 rounded-xl border font-display font-bold cursor-pointer ${
                            formFormat === fmt.id
                              ? 'bg-[#FFD700] text-[#021A0A] border-white'
                              : 'bg-black/35 text-white border-white/15'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCreateStep('TOSS')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#00FF66] to-[#00F0FF] text-[#021A0A] font-display font-black text-xs sm:text-sm cursor-pointer shadow-lg"
                >
                  Next Step: Pre-Match Coin Toss & Serve Choice →
                </button>
              </div>
            )}

            {/* STEP 2: COIN TOSS & SERVE / RECEIVE CHOICE */}
            {createStep === 'TOSS' && (
              <div className={`rounded-2xl border p-4 space-y-4 text-center ${theme.cardBg}`}>
                <div className="text-sm font-display font-black text-[#FFD700]">
                  STEP 2 OF 4: CENTER COURT COIN TOSS
                </div>
                <p className={`text-xs ${theme.subText}`}>
                  Select which player won the pre-match coin toss and their choice of Serve or Receive:
                </p>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => setTossWinner(1)}
                    className={`p-3.5 rounded-2xl border font-display font-black text-xs cursor-pointer ${
                      tossWinner === 1
                        ? 'bg-[#00FF66] text-[#021A0A] border-white shadow-lg'
                        : 'bg-black/35 text-white border-white/15'
                    }`}
                  >
                    🎾 {formP1} Won Toss
                  </button>
                  <button
                    onClick={() => setTossWinner(2)}
                    className={`p-3.5 rounded-2xl border font-display font-black text-xs cursor-pointer ${
                      tossWinner === 2
                        ? 'bg-[#00F0FF] text-[#021A0A] border-white shadow-lg'
                        : 'bg-black/35 text-white border-white/15'
                    }`}
                  >
                    🎾 {formP2} Won Toss
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {(['SERVE', 'RECEIVE'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setTossChoice(ch)}
                      className={`py-2.5 rounded-xl border text-xs font-display font-bold cursor-pointer ${
                        tossChoice === ch
                          ? 'bg-[#FFD700] text-[#021A0A] border-white'
                          : 'bg-black/35 text-white border-white/15'
                      }`}
                    >
                      Elected to {ch} First
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStartCustomMatch}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs sm:text-sm cursor-pointer shadow-lg"
                >
                  🎾 Start Live Tennis Broadcast & Open Umpire Chair →
                </button>
              </div>
            )}

            {/* STEP 3: LIVE UMPIRE CHAIR SCORING CONSOLE (15 -> 30 -> 40 -> DEUCE -> GAME -> SET) */}
            {createStep === 'SCORING' && (
              <div className="space-y-3">
                {!activeCustomMatch ? (
                  <div className={`rounded-2xl border p-5 text-center space-y-3 ${theme.cardBg}`}>
                    <p className="text-xs text-white">No active custom tennis match yet. Start one in Step 1!</p>
                    <button
                      onClick={() => setCreateStep('SETUP')}
                      className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                    >
                      Go to Step 1 Setup
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Live Scoreboard Header */}
                    <div className={`rounded-2xl border-2 border-[#FFD700] p-4 space-y-3 ${theme.cardBg}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-display font-black text-[#FFD700]">
                          🔴 LIVE UMPIRE CHAIR • {activeCustomMatch.tournament}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#00FF66] text-[#021A0A] font-mono-num font-black text-[10px]">
                          {activeCustomMatch.surface} COURT
                        </span>
                      </div>

                      {/* Set-by-Set & Current Game Table */}
                      <div className="rounded-xl bg-black/45 border border-white/15 overflow-hidden font-mono-num text-xs sm:text-sm">
                        <div className="grid grid-cols-7 bg-white/10 px-3 py-2 font-sans font-bold text-[11px] text-[#FFD700]">
                          <div className="col-span-3">Player</div>
                          <div className="text-center">S1</div>
                          <div className="text-center">S2</div>
                          <div className="text-center">S3</div>
                          <div className="text-right text-[#00FF66]">PTS</div>
                        </div>

                        <div className="grid grid-cols-7 items-center px-3 py-2.5 border-b border-white/10">
                          <div className="col-span-3 font-sans font-bold text-white flex items-center gap-1.5">
                            <span>{activeCustomMatch.player1}</span>
                            {activeCustomMatch.server === 1 && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] inline-block" title="Serving" />
                            )}
                          </div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP1[0] ?? '-'}</div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP1[1] ?? '-'}</div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP1[2] ?? '-'}</div>
                          <div className="text-right font-black text-base text-[#FFD700]">{activeCustomMatch.ptsP1}</div>
                        </div>

                        <div className="grid grid-cols-7 items-center px-3 py-2.5">
                          <div className="col-span-3 font-sans font-bold text-white flex items-center gap-1.5">
                            <span>{activeCustomMatch.player2}</span>
                            {activeCustomMatch.server === 2 && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] inline-block" title="Serving" />
                            )}
                          </div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP2[0] ?? '-'}</div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP2[1] ?? '-'}</div>
                          <div className="text-center font-bold text-white">{activeCustomMatch.setsP2[2] ?? '-'}</div>
                          <div className="text-right font-black text-base text-[#00F0FF]">{activeCustomMatch.ptsP2}</div>
                        </div>
                      </div>

                      {/* Umpire Point Buttons for Player 1 & Player 2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Player 1 Controls */}
                        <div className="p-3 rounded-xl bg-black/30 border border-[#00FF66]/40 space-y-2">
                          <div className="text-xs font-display font-black text-[#00FF66]">
                            🎾 {activeCustomMatch.player1} Controls
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-display font-black">
                            <button
                              onClick={() => scoreCustomPoint(1, 'POINT')}
                              className="py-2 rounded-lg bg-[#00FF66] text-[#021A0A] cursor-pointer"
                            >
                              +15 / Point
                            </button>
                            <button
                              onClick={() => scoreCustomPoint(1, 'ACE')}
                              className="py-2 rounded-lg bg-[#FFD700] text-[#021A0A] cursor-pointer"
                            >
                              ⚡ Ace!
                            </button>
                            <button
                              onClick={() => scoreCustomPoint(1, 'WINNER')}
                              className="py-2 rounded-lg bg-[#00F0FF] text-[#021A0A] cursor-pointer"
                            >
                              🔥 Winner
                            </button>
                          </div>
                        </div>

                        {/* Player 2 Controls */}
                        <div className="p-3 rounded-xl bg-black/30 border border-[#00F0FF]/40 space-y-2">
                          <div className="text-xs font-display font-black text-[#00F0FF]">
                            🎾 {activeCustomMatch.player2} Controls
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-display font-black">
                            <button
                              onClick={() => scoreCustomPoint(2, 'POINT')}
                              className="py-2 rounded-lg bg-[#00F0FF] text-[#021A0A] cursor-pointer"
                            >
                              +15 / Point
                            </button>
                            <button
                              onClick={() => scoreCustomPoint(2, 'ACE')}
                              className="py-2 rounded-lg bg-[#FFD700] text-[#021A0A] cursor-pointer"
                            >
                              ⚡ Ace!
                            </button>
                            <button
                              onClick={() => scoreCustomPoint(2, 'WINNER')}
                              className="py-2 rounded-lg bg-[#00FF66] text-[#021A0A] cursor-pointer"
                            >
                              🔥 Winner
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Complete Match -> Final Step Button */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setActiveSlide(0);
                            setTopTab('LIVE');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
                        >
                          View on Live 2D Court Radar →
                        </button>

                        <button
                          onClick={() => {
                            setCustomMatches((prev) =>
                              prev.map((m) => (m.id === activeCustomMatch.id ? { ...m, status: 'COMPLETED' } : m))
                            );
                            if (awardPoints) awardPoints(50, 'Completed Grand Slam Tennis Match');
                            setCreateStep('FINAL_SUMMARY');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FF8A00] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-lg"
                        >
                          🏆 Game, Set & Match — View Final Trophy (Step 4) →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 4: FINAL CHAMPIONSHIP TROPHY & MATCH CERTIFICATE */}
            {createStep === 'FINAL_SUMMARY' && (
              <div className={`rounded-2xl border-2 border-[#FFD700] p-5 text-center space-y-4 ${theme.cardBg}`}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFE54C] to-[#CA8A04] mx-auto flex items-center justify-center shadow-[0_0_24px_rgba(255,215,0,0.6)]">
                  <Trophy className="w-9 h-9 text-[#021A0A]" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] text-[10px] font-display font-black">
                    OFFICIAL GRAND SLAM MATCH CERTIFICATE
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-black text-[#FFD700]">
                    {activeCustomMatch ? activeCustomMatch.tournament : formTournament}
                  </h3>
                  <p className={`text-xs ${theme.subText}`}>
                    {activeCustomMatch ? activeCustomMatch.venue : formVenue}
                  </p>
                </div>

                {activeCustomMatch && (
                  <div className="max-w-md mx-auto rounded-2xl bg-black/40 border border-white/15 p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>🎾 {activeCustomMatch.player1}</span>
                      <span className="font-mono-num text-[#FFD700]">
                        {activeCustomMatch.setsP1.join('  ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>🎾 {activeCustomMatch.player2}</span>
                      <span className="font-mono-num text-[#00F0FF]">
                        {activeCustomMatch.setsP2.join('  ')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs text-[#00FF66] font-bold">
                      ⚡ Aces: {activeCustomMatch.acesP1} - {activeCustomMatch.acesP2} • Winners:{' '}
                      {activeCustomMatch.winnersP1} - {activeCustomMatch.winnersP2}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setCreateStep('SETUP');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                  >
                    + Create Another Tennis Match
                  </button>
                  <button
                    onClick={() => setTopTab('FEATURED')}
                    className="px-4 py-2.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                  >
                    Back to Tennis Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            LIVE MATCH CENTER (WHEN bottomNav === 'HOME' && topTab === 'LIVE')
            5 SUB-TABS: Info | Live | Court H2H | Stats | Point-by-Point
           ==================================================================== */}
        {bottomNav === 'HOME' && topTab === 'LIVE' && (
          <div className="space-y-2.5 pb-6">
            {/* 1. TOP LIVE HEADER WITH MATCH DROPDOWN SWITCHER */}
            <div className={`px-3 pt-3 pb-0 border-b sticky top-0 z-30 ${theme.headerBg}`}>
              <div className="flex items-center justify-between gap-2 pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => setTopTab('FEATURED')}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setShowMatchDropdown((v) => !v)}
                    className="flex items-center gap-1.5 text-sm sm:text-base font-display font-extrabold text-white truncate cursor-pointer"
                  >
                    <span className="truncate">
                      {currentMatch.p1Code} vs {currentMatch.p2Code}, {currentMatch.surface}
                    </span>
                    <span className="text-xs text-[#FFD700]">▼</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setLiveMuted((m) => !m)}
                    className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-1 text-[11px] font-bold text-[#FFD700] cursor-pointer"
                  >
                    {liveMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{liveMuted ? 'Muted' : 'Voice'}</span>
                  </button>
                </div>
              </div>

              {/* Dropdown to switch between all 8+ live matches */}
              {showMatchDropdown && (
                <div className="mb-2.5 rounded-xl bg-[#03160D] border border-[#FFD700]/50 p-2 space-y-1 max-h-60 overflow-y-auto">
                  {featuredSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSlide(idx);
                        setShowMatchDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between cursor-pointer ${
                        idx === activeSlide % featuredSlides.length
                          ? 'bg-[#00FF66]/20 text-[#FFD700] font-bold'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">
                        🎾 {s.p1Name} vs {s.p2Name} ({s.tournament})
                      </span>
                      <span className="font-mono-num text-[#00FF66] shrink-0 ml-2">
                        {s.p1GamePts}-{s.p2GamePts}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 5 Sub-Tabs: Info | Live | Court H2H | Stats | Point-by-Point */}
              <div className="flex items-center justify-between border-t border-white/10 pt-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'INFO', label: 'Info' },
                  { id: 'LIVE', label: 'Live' },
                  { id: 'COURT_H2H', label: 'Court H2H' },
                  { id: 'STATS', label: 'Stats' },
                  { id: 'POINT_BY_POINT', label: 'Point-by-Point' }
                ].map((t) => {
                  const active = liveSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setLiveSubTab(t.id as typeof liveSubTab)}
                      className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold text-center relative cursor-pointer transition-colors whitespace-nowrap ${
                        active ? 'text-white' : `${theme.subText} hover:text-white`
                      }`}
                    >
                      {t.label}
                      {active && (
                        <span className="absolute bottom-0 inset-x-3 h-[3px] rounded-t-full bg-[#FFD700]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ace Celebration Toast Banner */}
            {aceBanner && (
              <div className="mx-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#00FF66] to-[#00F0FF] text-[#021A0A] px-3.5 py-2.5 font-display font-black text-xs flex items-center justify-between shadow-lg">
                <span>{aceBanner}</span>
                <button onClick={() => setAceBanner(null)} className="font-black cursor-pointer">
                  ✕
                </button>
              </div>
            )}

            {/* ================================================================
                2D INTERACTIVE TENNIS COURT & HAWK-EYE RADAR (SHOWN ONLY ON 'LIVE' SUB-TAB)
               ================================================================ */}
            {liveSubTab === 'LIVE' && (
              <div className="px-2.5 sm:px-3.5 pt-0.5">
                <div className="rounded-xl overflow-hidden border border-white/20 shadow-lg">
                  {/* Top 2D Court Surface with Animated Ball & Hawk-Eye Tracker */}
                  <div
                    className={`relative px-3.5 py-4 min-h-[152px] flex flex-col justify-between overflow-hidden ${
                      currentMatch.surface === 'GRASS'
                        ? 'bg-gradient-to-r from-[#073B1E] via-[#0D5930] to-[#073B1E]'
                        : currentMatch.surface === 'CLAY'
                        ? 'bg-gradient-to-r from-[#6E2610] via-[#8F3418] to-[#6E2610]'
                        : 'bg-gradient-to-r from-[#082B52] via-[#0E437D] to-[#082B52]'
                    }`}
                  >
                    {/* SVG Tennis Court Lines */}
                    <svg
                      viewBox="0 0 320 140"
                      className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                    >
                      <rect x="16" y="12" width="288" height="116" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1="16" y1="28" x2="304" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
                      <line x1="16" y1="112" x2="304" y2="112" stroke="#FFFFFF" strokeWidth="1.5" />
                      <line x1="160" y1="12" x2="160" y2="128" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 2" />
                      <line x1="88" y1="28" x2="88" y2="112" stroke="#FFFFFF" strokeWidth="1.5" />
                      <line x1="232" y1="28" x2="232" y2="112" stroke="#FFFFFF" strokeWidth="1.5" />
                      <line x1="88" y1="70" x2="232" y2="70" stroke="#FFFFFF" strokeWidth="1.5" />
                    </svg>

                    {/* Animated Tennis Ball Position on Court */}
                    <div
                      style={{ left: `${hawkEyeState.x}%`, top: `${hawkEyeState.y}%` }}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#DFFF00] border-2 border-white shadow-[0_0_14px_#DFFF00] flex items-center justify-center text-[9px] font-black text-black">
                        🎾
                      </div>
                    </div>

                    {/* Top Row: Surface Badge & Serve Speed Radar */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/55 border border-[#FFD700]/60 text-[10px] font-display font-black text-[#FFD700]">
                        🦅 HAWK-EYE LIVE • {currentMatch.surface} COURT
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/55 border border-[#00FF66]/60 text-[10px] font-mono-num font-black text-[#00FF66]">
                        ⚡ SERVE SPEED: {hawkEyeState.speed} KM/H
                      </span>
                    </div>

                    {/* Center Live Hawk-Eye Call */}
                    <div className="relative z-10 my-2">
                      <div className="inline-block px-3 py-1 rounded-lg bg-black/65 border border-white/20 text-xs sm:text-sm font-bold text-white shadow">
                        {hawkEyeState.desc}
                      </div>
                    </div>

                    {/* Bottom Interactive Simulator Buttons */}
                    <div className="relative z-10 flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-bold text-emerald-200">
                        Serving: {currentMatch.server === 1 ? currentMatch.p1Name : currentMatch.p2Name} 🎾
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => triggerLivePointSim(1, true)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px] cursor-pointer hover:brightness-110"
                        >
                          ⚡ +Ace {currentMatch.p1Code}
                        </button>
                        <button
                          onClick={() => triggerLivePointSim(2, false)}
                          className="px-2.5 py-1 rounded-lg bg-[#00F0FF] text-[#021A0A] font-display font-black text-[10px] cursor-pointer hover:brightness-110"
                        >
                          🎾 +Winner {currentMatch.p2Code}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attached White Scoreboard Strip at Bottom of Court Frame */}
                  <div className="bg-white text-[#111827] px-3.5 py-2.5 flex items-center justify-between border-t border-slate-200">
                    <div className="text-xs sm:text-sm font-bold tracking-tight flex items-center gap-2">
                      <span>
                        {currentMatch.p1Code} ({currentMatch.p1Sets.join('-')})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#042414] text-[#FFD700] font-mono-num font-black text-sm sm:text-base">
                        {currentMatch.p1GamePts} - {currentMatch.p2GamePts}
                      </span>
                      <span>
                        ({currentMatch.p2Sets.join('-')}) {currentMatch.p2Code}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 truncate max-w-[170px]">
                      {currentMatch.statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SCROLLABLE CONTENT FOR EACH OF THE 5 SUB-TABS */}
            <div className="px-2.5 sm:px-3.5 space-y-2.5">
              {/* ==============================================================
                  SUB-TAB 1: LIVE (Point Pulse, Win Probability, Server/Receiver, Hawk-Eye, Settings)
                 ============================================================== */}
              {liveSubTab === 'LIVE' && (
                <>
                  {/* 1. CURRENT GAME POINT PULSE STRIP */}
                  <div className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar ${theme.cardBg}`}>
                    <span className="text-xs font-bold text-[#FFD700] shrink-0 pr-2 border-r border-white/15">
                      Game Pulse
                    </span>
                    {[
                      { pt: '15-0', tag: '⚡ Ace', col: 'bg-[#FFD700] text-[#021A0A]' },
                      { pt: '15-15', tag: '🎾 Rally', col: 'bg-[#00F0FF] text-[#021A0A]' },
                      { pt: '30-15', tag: '🔥 Winner', col: 'bg-[#00FF66] text-[#021A0A]' },
                      { pt: '40-15', tag: '⚡ 218km/h', col: 'bg-[#FFD700] text-[#021A0A]' },
                      { pt: `${currentMatch.p1GamePts}-${currentMatch.p2GamePts}`, tag: '🎾 Live', col: 'bg-[#FF2E93] text-white' }
                    ].map((ev, i) => (
                      <div key={i} className="flex items-center gap-1 shrink-0">
                        <span className={`text-[10px] font-mono-num ${theme.subText}`}>{ev.pt}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-num font-black ${ev.col}`}>
                          {ev.tag}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 2. LIVE WIN PROBABILITY & TOTAL GAMES MARKET CARD */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <div className="p-3.5 space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-200">
                        <AlertCircle className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>Live Grand Slam Win Probability</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                          <div className="text-xs font-bold text-white">{currentMatch.p1Name}</div>
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs">
                              62%
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#1E88E5] text-white font-mono-num font-bold text-xs">
                              1.58
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                          <div className="text-xs font-bold text-white">{currentMatch.p2Name}</div>
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-[#EF5350] text-white font-mono-num font-bold text-xs">
                              38%
                            </span>
                            <span className="px-2.5 py-1 rounded bg-[#0F8A5F] text-white font-mono-num font-bold text-xs">
                              2.45
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. SERVER VS RECEIVER LIVE STATS TABLE (Tap Player for Full Career Modal!) */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`text-xs font-medium border-b border-white/10 ${theme.subText}`}>
                          <th className="py-2.5 px-3.5">Players on Court (Tap for Career)</th>
                          <th className="py-2.5 px-2 text-right">Aces</th>
                          <th className="py-2.5 px-2 text-right">1st Srv</th>
                          <th className="py-2.5 px-3.5 text-right">Winners</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                        {[
                          {
                            profile: STAR_TENNIS_PLAYERS[0],
                            name: currentMatch.p1Name,
                            isServing: currentMatch.server === 1,
                            aces: liveSimPts.aces1,
                            srv: '71%',
                            win: 34
                          },
                          {
                            profile: STAR_TENNIS_PLAYERS[1],
                            name: currentMatch.p2Name,
                            isServing: currentMatch.server === 2,
                            aces: liveSimPts.aces2,
                            srv: '66%',
                            win: 29
                          }
                        ].map((row, idx) => (
                          <tr
                            key={idx}
                            onClick={() => setSelectedPlayerModal(row.profile)}
                            className="hover:bg-white/5 cursor-pointer"
                          >
                            <td className="py-2.5 px-3.5 font-semibold text-white flex items-center gap-1.5">
                              <span>{row.name}</span>
                              {row.isServing && <span className="text-[10px] text-[#00FF66]">🎾</span>}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono-num font-bold text-[#FFD700]">
                              {row.aces}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono-num text-emerald-200">{row.srv}</td>
                            <td className="py-2.5 px-3.5 text-right font-mono-num font-black text-[#00FF66]">
                              {row.win}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 4. HAWK-EYE ELECTRONIC LINE CHALLENGE TABLE */}
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white">
                          <th className="py-2.5 px-3.5 font-semibold flex items-center gap-1.5">
                            <span>🦅 Hawk-Eye Challenges</span>
                          </th>
                          <th className={`py-2.5 px-2 text-center font-normal ${theme.subText}`}>Left</th>
                          <th className="py-2.5 px-2 text-center text-[#00FF66] font-black">Won ✔</th>
                          <th className="py-2.5 px-3.5 text-center text-red-500 font-black">Lost ✘</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-mono-num">
                        <tr>
                          <td className="py-2.5 px-3.5 font-sans font-medium text-white">{currentMatch.p1Code}</td>
                          <td className="py-2.5 px-2 text-center text-[#FFD700]">3</td>
                          <td className="py-2.5 px-2 text-center text-white">2</td>
                          <td className="py-2.5 px-3.5 text-center text-white">0</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-sans font-medium text-white">{currentMatch.p2Code}</td>
                          <td className="py-2.5 px-2 text-center text-[#FFD700]">2</td>
                          <td className="py-2.5 px-2 text-center text-white">1</td>
                          <td className="py-2.5 px-3.5 text-center text-white">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ==============================================================
                  SUB-TAB 2: INFO (Tournament, Surface, Seed Profiles, H2H, Chair Umpire & Weather)
                 ============================================================== */}
              {liveSubTab === 'INFO' && (
                <div className="space-y-3 pt-1">
                  <div className={`rounded-xl border overflow-hidden ${theme.cardBg}`}>
                    <button
                      onClick={() => setBottomNav('SLAMS')}
                      className="w-full px-3.5 py-3 border-b border-white/15 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-medium text-white">{currentMatch.tournament}</span>
                      <span className="text-sm font-bold text-white">&gt;</span>
                    </button>
                    <div className="p-3.5 space-y-2.5 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <span>🎾</span>
                        <span className="font-medium text-white">{currentMatch.courtInfo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>🏆</span>
                        <span className="font-medium text-[#FFD700]">
                          Chair Umpire: {currentMatch.umpire}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Head to Head Career Record */}
                  <div className={`rounded-xl border p-3.5 space-y-3 ${theme.cardBg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Career Head to Head</span>
                      <span className={`text-xs ${theme.subText}`}>(ATP / WTA Official)</span>
                    </div>

                    <div className={`rounded-xl border border-white/15 px-3 py-3 flex items-center justify-between ${theme.innerCardBg}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-extrabold text-white">{currentMatch.p1Code}</span>
                        {renderPlayerBadge(currentMatch.p1Flag, currentMatch.p1Code)}
                      </div>
                      <div className="text-xl sm:text-2xl font-mono-num font-black text-[#FFD700] tracking-wider">
                        {currentMatch.h2hP1} - {currentMatch.h2hP2}
                      </div>
                      <div className="flex items-center gap-2.5">
                        {renderPlayerBadge(currentMatch.p2Flag, currentMatch.p2Code)}
                        <span className="text-sm font-extrabold text-white">{currentMatch.p2Code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stadium & Weather Card */}
                  <div className={`rounded-xl border overflow-hidden divide-y divide-white/15 ${theme.cardBg}`}>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <div className={`text-xs ${theme.subText}`}>Show Court Venue</div>
                        <div className="text-sm font-bold text-white">{currentMatch.venue}</div>
                      </div>
                      <span className="text-sm font-bold text-white">&gt;</span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className={`text-xs ${theme.subText}`}>Court Conditions</div>
                        <div className="text-lg font-mono-num font-black text-white">{currentMatch.weatherTemp}</div>
                        <div className="text-xs font-semibold text-[#FFD700]">{currentMatch.weatherCondition}</div>
                      </div>
                      <div className="pl-4 border-l border-white/15 space-y-1 text-xs">
                        <div>💧 <strong>{currentMatch.humidity}</strong> (Humidity)</div>
                        <div>🎾 <strong>{currentMatch.surface}</strong> (Surface)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  SUB-TAB 3: COURT H2H (Interactive 2D Shot Placement Map & Tale of the Tape)
                 ============================================================== */}
              {liveSubTab === 'COURT_H2H' && (
                <div className="space-y-3 pt-1">
                  <div className={`rounded-xl border p-4 space-y-3 ${theme.cardBg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-display font-black text-[#FFD700]">
                        2D HAWK-EYE SHOT PLACEMENT MAP
                      </span>
                      <span className="text-xs text-[#00FF66]">Tap Player Below for Bio</span>
                    </div>

                    {/* Visual Shot Placement Court */}
                    <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-[#FFD700]/60 bg-gradient-to-r from-[#073B1E] via-[#0C592F] to-[#073B1E]">
                      <svg viewBox="0 0 320 150" className="w-full h-full opacity-45">
                        <rect x="16" y="12" width="288" height="126" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="160" y1="12" x2="160" y2="138" stroke="#FFD700" strokeWidth="2" />
                        <line x1="88" y1="28" x2="88" y2="122" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1="232" y1="28" x2="232" y2="122" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1="88" y1="75" x2="232" y2="75" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                      {[
                        { x: '22%', y: '28%', col: 'bg-[#FFD700]', label: 'Ace' },
                        { x: '78%', y: '24%', col: 'bg-[#00FF66]', label: 'FH' },
                        { x: '84%', y: '76%', col: 'bg-[#00FF66]', label: 'BH' },
                        { x: '26%', y: '78%', col: 'bg-[#00F0FF]', label: 'Win' },
                        { x: '64%', y: '48%', col: 'bg-[#FFD700]', label: 'Ace' }
                      ].map((dot, i) => (
                        <div
                          key={i}
                          style={{ left: dot.x, top: dot.y }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full ${dot.col} text-[#021A0A] font-mono-num font-black text-[9px] shadow`}
                        >
                          {dot.label}
                        </div>
                      ))}
                    </div>

                    {/* Clickable Tale of the Tape Cards */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      {[STAR_TENNIS_PLAYERS[0], STAR_TENNIS_PLAYERS[1]].map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => setSelectedPlayerModal(pl)}
                          className="p-3 rounded-xl bg-black/35 border border-white/15 hover:border-[#FFD700] cursor-pointer space-y-1"
                        >
                          <div className="text-xs font-display font-black text-[#FFD700]">
                            #{pl.rank} {pl.name}
                          </div>
                          <div className="text-[11px] text-white">{pl.country}</div>
                          <div className="text-[11px] text-[#00FF66] font-mono-num">
                            🏆 {pl.grandSlams} Grand Slams • {pl.prizeMoney}
                          </div>
                          <div className="text-[10px] text-cyan-300 font-bold pt-1">
                            Tap for Full Career Profile →
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  SUB-TAB 4: STATS (Full Match Telemetry Bars)
                 ============================================================== */}
              {liveSubTab === 'STATS' && (
                <div className={`rounded-xl border p-4 space-y-3.5 ${theme.cardBg}`}>
                  <div className="flex items-center justify-between text-xs font-display font-black text-[#FFD700] border-b border-white/10 pb-2">
                    <span>{currentMatch.p1Name}</span>
                    <span>COURT TELEMETRY</span>
                    <span>{currentMatch.p2Name}</span>
                  </div>

                  {[
                    { label: 'Service Aces ⚡', h: String(liveSimPts.aces1), a: String(liveSimPts.aces2), hPct: 56 },
                    { label: '1st Serve Percentage', h: '71%', a: '66%', hPct: 52 },
                    { label: '1st Serve Points Won', h: '82%', a: '76%', hPct: 54 },
                    { label: 'Total Clean Winners 🎾', h: '34', a: '29', hPct: 55 },
                    { label: 'Break Points Converted', h: '4/7', a: '3/6', hPct: 57 },
                    { label: 'Net Points Won', h: '18/22', a: '12/17', hPct: 60 },
                    { label: 'Fastest Serve Speed', h: '222 km/h', a: '218 km/h', hPct: 51 }
                  ].map((st, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono-num font-bold">
                        <span className="text-[#00FF66]">{st.h}</span>
                        <span className="font-sans text-white/90">{st.label}</span>
                        <span className="text-[#FFD700]">{st.a}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/45 overflow-hidden flex">
                        <div className="h-full bg-[#00FF66]" style={{ width: `${st.hPct}%` }} />
                        <div className="h-full bg-[#FFD700]" style={{ width: `${100 - st.hPct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ==============================================================
                  SUB-TAB 5: POINT-BY-POINT LOG
                 ============================================================== */}
              {liveSubTab === 'POINT_BY_POINT' && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    {(['ALL', 'ACES', 'BREAKS', 'WINNERS'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setPointFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-display font-bold cursor-pointer ${
                          pointFilter === f
                            ? 'bg-[#FFD700] text-[#021A0A]'
                            : 'bg-black/35 text-white border border-white/15'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className={`rounded-xl border divide-y divide-white/10 ${theme.cardBg}`}>
                    {[
                      { score: '40-30', type: 'ACES', badge: '⚡ ACE', text: `${currentMatch.p1Name} fires a 221 km/h serve down the middle T!` },
                      { score: '30-30', type: 'WINNERS', badge: '🎾 WINNER', text: `${currentMatch.p2Name} rips a cross-court backhand passing shot on the run!` },
                      { score: '5-4', type: 'BREAKS', badge: '🔥 BREAK!', text: `${currentMatch.p1Name} converts Break Point with a stunning drop shot!` },
                      { score: '30-15', type: 'WINNERS', badge: '🎾 WINNER', text: 'Inside-out forehand winner painted right on the baseline!' }
                    ]
                      .filter((ev) => pointFilter === 'ALL' || ev.type === pointFilter)
                      .map((ev, i) => (
                        <div key={i} className="p-3.5 flex items-start gap-3">
                          <span className="font-mono-num text-xs font-black text-[#FFD700] w-12 shrink-0">
                            {ev.score}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#00FF66]/20 border border-[#00FF66] text-[10px] font-display font-black text-[#00FF66] shrink-0">
                            {ev.badge}
                          </span>
                          <p className="text-xs text-white leading-relaxed">{ev.text}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            TENNIS HOME FEED (WHEN bottomNav === 'HOME' && topTab === 'FEATURED')
            - Horizontal Swipeable 8+ Live Tennis Matches Carousel + Pagination Dots
            - Quick Action Pills
            - Featured Grand Slams
            - Viral Rally Reels
            - Top Tennis News Horizontal Swipeable Carousel
           ==================================================================== */}
        {bottomNav === 'HOME' && topTab === 'FEATURED' && (
          <>
            {/* 1. HORIZONTAL TOUCH-SWIPEABLE LIVE TENNIS CAROUSEL (8+ MATCHES) */}
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
                {featuredSlides
                  .filter(
                    (s) =>
                      !searchQuery.trim() ||
                      s.p1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.p2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.tournament.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((slide, idx) => (
                    <div
                      key={slide.id}
                      onClick={() => {
                        setActiveSlide(idx);
                        setTopTab('LIVE');
                      }}
                      className={`sv-shimmer-layer w-full shrink-0 snap-center rounded-2xl border p-4 cursor-pointer transition-all select-none ${theme.cardBg}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xs sm:text-sm font-bold text-white truncate">{slide.tournament}</h2>
                        <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0">
                          {slide.surface}
                        </span>
                      </div>
                      <p className={`text-[11px] ${theme.subText} mt-0.5`}>{slide.courtInfo}</p>

                      {/* Players & Set Scores Row */}
                      <div className="my-3.5 space-y-2 bg-black/30 rounded-xl p-3 border border-white/10">
                        {/* Player 1 Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {renderPlayerBadge(slide.p1Flag, slide.p1Code)}
                            <div className="min-w-0">
                              <div className="text-sm font-display font-extrabold text-white flex items-center gap-1.5 truncate">
                                <span className="truncate">{slide.p1Name}</span>
                                <span className="text-[10px] text-[#FFD700]">{slide.p1Seed}</span>
                                {slide.server === 1 && (
                                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 font-mono-num">
                            {slide.p1Sets.map((st, sIdx) => (
                              <span key={sIdx} className="text-sm font-bold text-white/90 w-4 text-center">
                                {st}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-black text-xs min-w-[32px] text-center">
                              {slide.p1GamePts}
                            </span>
                          </div>
                        </div>

                        {/* Player 2 Row */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {renderPlayerBadge(slide.p2Flag, slide.p2Code)}
                            <div className="min-w-0">
                              <div className="text-sm font-display font-extrabold text-white flex items-center gap-1.5 truncate">
                                <span className="truncate">{slide.p2Name}</span>
                                <span className="text-[10px] text-[#00F0FF]">{slide.p2Seed}</span>
                                {slide.server === 2 && (
                                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 font-mono-num">
                            {slide.p2Sets.map((st, sIdx) => (
                              <span key={sIdx} className="text-sm font-bold text-white/90 w-4 text-center">
                                {st}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 rounded bg-[#00FF66] text-[#021A0A] font-black text-xs min-w-[32px] text-center">
                              {slide.p2GamePts}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Status & Swipe Indicator */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#FFD700] truncate">{slide.rallySummary}</span>
                        <span className="text-[10px] font-bold text-[#00FF66] shrink-0">
                          Court {idx + 1}/{featuredSlides.length} • Swipe ↔
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Synced Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {featuredSlides.map((s, idx) => {
                  const isAct = idx === activeSlide % featuredSlides.length;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isAct ? `w-5 ${theme.dotActive}` : `w-2 ${theme.dotInactive}`
                      }`}
                    />
                  );
                })}
              </div>

              {/* Dedicated Admin Ad Banner Slot Below Tennis Featured Match Card */}
              <CardAdBanner slotId="tennis_hub_card" className="mt-2.5" />
            </div>

            {/* 2. QUICK ACTION PILLS ROW */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() =>
                  setActiveModal({
                    title: 'All-Time Grand Slam Roll of Honour',
                    subtitle: 'Wimbledon • US Open • Roland Garros • Australian Open',
                    body: 'Men’s All-Time Grand Slam Leaders: Novak Djokovic 🇷🇸 (24) • Rafael Nadal 🇪🇸 (22) • Roger Federer 🇨🇭 (20) • Carlos Alcaraz 🇪🇸 (5) | Women’s Open Era: Serena Williams 🇺🇸 (23) • Steffi Graf 🇩🇪 (22) • Iga Świątek 🇵🇱 (6)'
                  })
                }
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer ${theme.pillBg}`}
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Grand Slam Winners</span>
              </button>

              <button
                onClick={() => setBottomNav('REELS')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer ${theme.pillBg}`}
              >
                <Play className="w-3.5 h-3.5 text-[#00FF66] fill-[#00FF66]" />
                <span>Rally Reels</span>
              </button>

              <button
                onClick={() => setTopTab('CREATE_LIVE')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer ${theme.pillBg}`}
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>+ Score Tennis Live</span>
              </button>
            </div>

            {/* 3. FEATURED GRAND SLAMS & TOURS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-display font-extrabold text-white">
                  Grand Slams & ATP/WTA Tours
                </h3>
                <button
                  onClick={() => setBottomNav('SLAMS')}
                  className="text-xs font-bold text-[#FFD700] cursor-pointer"
                >
                  View All &gt;
                </button>
              </div>

              <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
                {[
                  { id: 'wimbledon', name: 'Wimbledon Championships 2026', sub: 'All England Club, London • Grass Court', badge: '🌱 GRASS' },
                  { id: 'usopen', name: 'US Open Grand Slam 2026', sub: 'Flushing Meadows, New York • Hard Court', badge: '⚡ HARD' },
                  { id: 'rolandgarros', name: 'Roland Garros French Open 2026', sub: 'Paris, France • Red Clay Court', badge: '🔥 CLAY' },
                  { id: 'bdopen', name: 'Bangladesh National Open 2026', sub: 'Ramna Tennis Complex, Dhaka', badge: '🇧🇩 DHAKA' }
                ].map((sl) => (
                  <button
                    key={sl.id}
                    onClick={() => {
                      setSelectedSlamId(sl.id);
                      setBottomNav('SLAMS');
                    }}
                    className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-left"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{sl.name}</div>
                      <div className={`text-[11px] ${theme.subText}`}>{sl.sub}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-black/35 border border-[#FFD700]/40 text-[10px] font-display font-black text-[#FFD700]">
                      {sl.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TOP TENNIS NEWS HORIZONTAL SWIPEABLE CAROUSEL */}
            <div className="space-y-2 pb-2">
              <h3 className="text-sm sm:text-base font-display font-extrabold text-white">Top Tennis News</h3>
              <div
                ref={newsCarouselRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  if (el.clientWidth > 0) {
                    const idx = Math.round(el.scrollLeft / (el.clientWidth + 12));
                    if (idx !== activeNewsDot) setActiveNewsDot(idx);
                  }
                }}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3"
              >
                {[
                  {
                    title: 'Alcaraz vs Sinner: The New Big Two Lighting Up Wimbledon Centre Court!',
                    time: '25 mins ago • Grand Slam Desk',
                    img: IMG_TENNIS_COURT,
                    body: 'Carlos Alcaraz and Jannik Sinner are trading 220 km/h serves and 25-shot baseline rallies in an instant Wimbledon classic.'
                  },
                  {
                    title: 'Bangladesh’s Zarif Abrar Reaches Dhaka International Open Final!',
                    time: '1 hour ago • Dhaka Sports',
                    img: IMG_TENNIS_ACTION,
                    body: 'Playing in front of a packed Ramna Center Court in Dhaka, Zarif Abrar fired 11 aces to storm into the Championship Final.'
                  },
                  {
                    title: 'Novak Djokovic Targets Historic 25th Grand Slam Crown in Paris',
                    time: '3 hours ago • ATP Tour',
                    img: IMG_TENNIS_BALL,
                    body: 'Novak Djokovic continues to defy time with another masterclass on Court Philippe-Chatrier.'
                  }
                ].map((nw, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setActiveModal({
                        title: nw.title,
                        subtitle: nw.time,
                        body: nw.body,
                        img: nw.img
                      })
                    }
                    className={`w-full shrink-0 snap-center rounded-2xl border overflow-hidden cursor-pointer ${theme.cardBg}`}
                  >
                    <div className="h-40 w-full relative overflow-hidden">
                      <img src={nw.img} alt={nw.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px]">
                        TENNIS EXCLUSIVE
                      </span>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">{nw.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-[#FFD700]">
                        <span>{nw.time}</span>
                        <span>Swipe ↔</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ====================================================================
            BOTTOM NAV TAB 2: REELS (VIRAL TENNIS RALLIES & TRICKSHOTS)
           ==================================================================== */}
        {bottomNav === 'REELS' && (
          <div className="space-y-3 pb-6">
            <h2 className="text-base font-display font-black text-[#FFD700]">
              🎬 VIRAL TENNIS RALLIES & MATCH POINT REELS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Alcaraz Tweener Lob Winner at Wimbledon!', views: '1.4M Views', img: IMG_TENNIS_COURT },
                { title: 'Sinner 220 km/h Ace Down the T!', views: '890K Views', img: IMG_TENNIS_ACTION },
                { title: 'Djokovic 36-Shot Baseline Defense!', views: '2.1M Views', img: IMG_TENNIS_BALL },
                { title: 'Zarif Abrar Championship Point in Dhaka!', views: '540K Views', img: IMG_TENNIS_COURT }
              ].map((rl, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setActiveModal({
                      title: rl.title,
                      subtitle: rl.views,
                      body: 'Watching Full HD 60fps Court-Level Tennis Highlight Reel (+10 Bonus Points awarded!).',
                      img: rl.img
                    })
                  }
                  className="group relative h-60 rounded-2xl overflow-hidden border border-[#FFD700]/50 cursor-pointer"
                >
                  <img
                    src={rl.img}
                    alt={rl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-[#FFD700]/90 flex items-center justify-center text-[#021A0A] shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 inset-x-2.5">
                    <div className="text-xs font-bold text-white line-clamp-2">{rl.title}</div>
                    <div className="text-[10px] text-[#00FF66] font-mono-num mt-0.5">{rl.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            BOTTOM NAV TAB 3: FIXTURES (LIVE | UPCOMING | RESULTS | BRACKET)
           ==================================================================== */}
        {bottomNav === 'FIXTURES' && (
          <div className="space-y-3 pb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'LIVE', label: `LIVE (${totalLiveTennisCount})` },
                { id: 'UPCOMING', label: `UPCOMING (${espnUpcomingTennis.length})` },
                { id: 'RESULTS', label: `RESULTS (${espnRecentTennis.length})` },
                { id: 'BRACKET', label: 'BRACKET' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFixtureFilter(f.id as typeof fixtureFilter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-black shrink-0 cursor-pointer ${
                    fixtureFilter === f.id
                      ? 'bg-[#FFD700] text-[#021A0A]'
                      : 'bg-black/35 text-white border border-white/15'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {fixtureFilter === 'BRACKET' ? (
              <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
                <div className="text-sm font-display font-black text-[#FFD700]">
                  🏆 WIMBLEDON 2026 KNOCKOUT BRACKET
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/35 border border-white/10 space-y-1.5">
                    <div className="text-[#00FF66] font-bold">SEMI-FINAL 1</div>
                    <div className="flex justify-between text-white font-bold">
                      <span>🇪🇸 Carlos Alcaraz [1]</span>
                      <span className="font-mono-num text-[#FFD700]">6  6  7</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>🇺🇸 Taylor Fritz [6]</span>
                      <span className="font-mono-num">4  3  5</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/35 border border-white/10 space-y-1.5">
                    <div className="text-[#00FF66] font-bold">SEMI-FINAL 2</div>
                    <div className="flex justify-between text-white font-bold">
                      <span>🇮🇹 Jannik Sinner [2]</span>
                      <span className="font-mono-num text-[#FFD700]">7  6  6</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>🇷🇸 Novak Djokovic [3]</span>
                      <span className="font-mono-num">5  4  4</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {(() => {
                  const list =
                    fixtureFilter === 'LIVE'
                      ? genuineLiveTennisSlides
                      : fixtureFilter === 'UPCOMING'
                      ? espnUpcomingTennis
                      : espnRecentTennis;
                  if (list.length === 0) {
                    return (
                      <div className={`rounded-2xl border p-5 text-center space-y-2 ${theme.cardBg}`}>
                        <div className="text-sm font-display font-black text-[#FFD700]">
                          {fixtureFilter === 'LIVE'
                            ? 'বর্তমানে কোনো টেনিস ম্যাচ সরাসরি (Live) চলছে না'
                            : 'কোনো ম্যাচ পাওয়া যায়নি'}
                        </div>
                        <p className={`text-xs ${theme.subText}`}>
                          অন্যান্য ট্যাবে আসন্ন (UPCOMING) এবং সমাপ্ত (RESULTS) জেনুইন ম্যাচগুলো দেখুন।
                        </p>
                      </div>
                    );
                  }
                  return list.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveSlide(i);
                        setBottomNav('HOME');
                        setTopTab('LIVE');
                      }}
                      className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FFD700] ${theme.cardBg}`}
                    >
                      <div>
                        <div className="text-[11px] text-[#FFD700] font-bold">{m.tournament}</div>
                        <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          {m.p1Name} vs {m.p2Name}
                        </div>
                        <div className={`text-[11px] ${theme.subText}`}>{m.courtInfo}</div>
                      </div>
                      <div className="text-right font-mono-num">
                        <div className="text-xs font-black text-[#00FF66]">
                          {m.p1Sets.join('-')} / {m.p2Sets.join('-')}
                        </div>
                        <div className="text-[11px] text-[#FFD700] mt-0.5">
                          {m.statusLabel}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            BOTTOM NAV TAB 4: SLAMS (GRAND SLAM STANDINGS, TOP ACES & PAST CHAMPIONS)
           ==================================================================== */}
        {bottomNav === 'SLAMS' && (
          <div className="space-y-3 pb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'wimbledon', label: '🌱 Wimbledon' },
                { id: 'usopen', label: '⚡ US Open' },
                { id: 'rolandgarros', label: '🔥 Roland Garros' },
                { id: 'bdopen', label: '🇧🇩 Dhaka Open' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlamId(s.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-black shrink-0 cursor-pointer ${
                    selectedSlamId === s.id
                      ? 'bg-[#FFD700] text-[#021A0A]'
                      : 'bg-black/35 text-white border border-white/15'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {(['DRAW', 'ACES', 'CHAMPIONS'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSlamSubTab(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    slamSubTab === st ? 'bg-[#00FF66] text-[#021A0A]' : 'bg-black/30 text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className={`rounded-2xl border divide-y divide-white/10 ${theme.cardBg}`}>
              {STAR_TENNIS_PLAYERS.map((pl, idx) => (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlayerModal(pl)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#FFD700] text-[#021A0A] font-mono-num font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{pl.name}</div>
                      <div className={`text-xs ${theme.subText}`}>
                        {pl.country} • {pl.favoriteSurface}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono-num">
                    <div className="text-xs font-black text-[#00FF66]">{pl.acesSeason} Aces</div>
                    <div className="text-[11px] text-[#FFD700]">{pl.grandSlams} Slams</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            BOTTOM NAV TAB 5: MORE (ATP/WTA RANKINGS, PLAYERS, RECORDS, POLLS, COURT THEME)
           ==================================================================== */}
        {bottomNav === 'MORE' && (
          <div className="space-y-3 pb-6">
            {moreSubScreen !== 'MENU' && (
              <button
                onClick={() => setMoreSubScreen('MENU')}
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-[#FFD700]/50 text-xs font-display font-bold text-[#FFD700] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Tennis More Menu
              </button>
            )}

            {moreSubScreen === 'MENU' && (
              <>
                <div className={`rounded-2xl border divide-y divide-white/10 overflow-hidden ${theme.cardBg}`}>
                  {[
                    { id: 'CREATE', label: '+ Create & Score Live Tennis Match', sub: 'Umpire Chair 15-30-40-Deuce Scorer & Final Trophy', icon: '➕' },
                    { id: 'ATP_WTA_RANKINGS', label: 'Official ATP & WTA World Rankings', sub: 'Men’s & Women’s Singles Top Ranked Players', icon: '🌍' },
                    { id: 'PLAYERS', label: 'Browse Star Tennis Players', sub: 'Alcaraz, Sinner, Djokovic, Sabalenka, Świątek, Zarif', icon: '🎾' },
                    { id: 'RECORDS', label: 'All-Time Grand Slam Records', sub: 'Most Titles, Fastest Serve & Longest Finals', icon: '🏆' },
                    { id: 'POLLS', label: 'Live Tennis Fan Polls', sub: 'Vote on Wimbledon & US Open 2026 Champions', icon: '🗳️' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'CREATE') {
                          setBottomNav('HOME');
                          setTopTab('CREATE_LIVE');
                        } else {
                          setMoreSubScreen(item.id as typeof moreSubScreen);
                        }
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-9 h-9 rounded-xl bg-black/35 border border-white/10 flex items-center justify-center text-base">
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className={`text-[11px] ${theme.subText}`}>{item.sub}</div>
                        </div>
                      </div>
                      <span className="text-base font-bold text-[#FFD700]">&gt;</span>
                    </button>
                  ))}
                </div>

                {/* Court Surface Theme Switcher */}
                <div className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-2 ${theme.cardBg}`}>
                  <div>
                    <div className="text-sm font-bold text-white">Grand Slam Court Surface Theme</div>
                    <div className={`text-[11px] ${theme.subText}`}>Switch between Grass, Hard Court & Parisian Clay</div>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'WIMBLEDON_GRASS', label: '🌱 Grass' },
                      { id: 'US_OPEN_HARD', label: '⚡ Hard' },
                      { id: 'ROLAND_GARROS_CLAY', label: '🔥 Clay' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => setCourtTheme(th.id as typeof courtTheme)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-display font-bold cursor-pointer ${
                          courtTheme === th.id
                            ? 'bg-[#FFD700] text-[#021A0A]'
                            : 'bg-black/35 text-white border border-white/15'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {moreSubScreen === 'ATP_WTA_RANKINGS' && (
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  {(['ATP', 'WTA'] as const).map((tr) => (
                    <button
                      key={tr}
                      onClick={() => setRankingTourTab(tr)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-display font-black cursor-pointer ${
                        rankingTourTab === tr ? 'bg-[#FFD700] text-[#021A0A]' : 'bg-black/35 text-white'
                      }`}
                    >
                      {tr} SINGLES RANKINGS
                    </button>
                  ))}
                </div>
                <div className={`rounded-2xl border divide-y divide-white/10 ${theme.cardBg}`}>
                  {STAR_TENNIS_PLAYERS.filter((p) => p.tour === rankingTourTab).map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlayerModal(p)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5"
                    >
                      <span className="font-bold text-white text-xs sm:text-sm">
                        #{idx + 1} {p.name} ({p.country})
                      </span>
                      <span className="font-mono-num font-black text-xs text-[#00FF66]">
                        {p.grandSlams} Slams • {p.winLoss2026}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {moreSubScreen === 'PLAYERS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STAR_TENNIS_PLAYERS.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlayerModal(pl)}
                    className={`rounded-2xl border p-3.5 flex items-center justify-between cursor-pointer hover:border-[#FFD700] ${theme.cardBg}`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{pl.name}</div>
                      <div className={`text-xs ${theme.subText}`}>
                        {pl.country} • {pl.plays}
                      </div>
                    </div>
                    <span className="text-xs font-mono-num font-black text-[#FFD700]">{pl.prizeMoney} →</span>
                  </div>
                ))}
              </div>
            )}

            {moreSubScreen === 'RECORDS' && (
              <div className={`rounded-2xl border divide-y divide-white/10 ${theme.cardBg}`}>
                {[
                  { title: 'Most All-Time Grand Slam Singles Titles', holder: '🇷🇸 Novak Djokovic', stat: '24 Grand Slams' },
                  { title: 'Most Roland Garros Titles (King of Clay)', holder: '🇪🇸 Rafael Nadal', stat: '14 Titles' },
                  { title: 'Most Wimbledon Men’s Singles Titles', holder: '🇨🇭 Roger Federer', stat: '8 Titles' },
                  { title: 'Fastest Recorded Serve in Tennis History', holder: '🇦🇺 Sam Groth', stat: '263.4 km/h' }
                ].map((rec, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#00FF66] font-bold">{rec.title}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{rec.holder}</div>
                    </div>
                    <span className="font-mono-num font-black text-sm text-[#FFD700]">{rec.stat}</span>
                  </div>
                ))}
              </div>
            )}

            {moreSubScreen === 'POLLS' && (
              <div className={`rounded-2xl border p-4 space-y-3 ${theme.cardBg}`}>
                <div className="text-sm font-display font-black text-[#FFD700]">
                  Who will finish 2026 as World No. 1?
                </div>
                {[
                  { id: 'alc', label: '🇪🇸 Carlos Alcaraz', pct: 46 },
                  { id: 'sin', label: '🇮🇹 Jannik Sinner', pct: 34 },
                  { id: 'djo', label: '🇷🇸 Novak Djokovic', pct: 20 }
                ].map((opt) => {
                  const chosen = pollVoted['atp1'] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPollVoted({ ...pollVoted, atp1: opt.id })}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold cursor-pointer ${
                        chosen ? 'border-[#00FF66] bg-[#00FF66]/20 text-white' : 'border-white/15 bg-black/30 text-white'
                      }`}
                    >
                      <span>{opt.label} {chosen && '✓'}</span>
                      <span className="font-mono-num text-[#FFD700]">{opt.pct}%</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          PLAYER FULL CAREER & TELEMETRY MODAL (FINAL STEP WHEN TAPPING ANY PLAYER)
         ==================================================================== */}
      {selectedPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl border-2 border-[#FFD700] max-w-md w-full p-5 space-y-4 ${theme.cardBg}`}>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] flex items-center justify-center font-mono-num font-black text-lg text-[#021A0A]">
                  #{selectedPlayerModal.rank}
                </div>
                <div>
                  <h3 className="text-base font-display font-black text-white">{selectedPlayerModal.name}</h3>
                  <p className="text-xs text-[#FFD700]">
                    {selectedPlayerModal.country} • {selectedPlayerModal.tour} Tour
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayerModal(null)}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-black/35 border border-white/10">
                <div className={theme.subText}>Grand Slams</div>
                <div className="text-base font-mono-num font-black text-[#FFD700] mt-0.5">
                  {selectedPlayerModal.grandSlams} 🏆
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/35 border border-white/10">
                <div className={theme.subText}>2026 Record</div>
                <div className="text-base font-mono-num font-black text-[#00FF66] mt-0.5">
                  {selectedPlayerModal.winLoss2026}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/35 border border-white/10">
                <div className={theme.subText}>Prize Money</div>
                <div className="text-base font-mono-num font-black text-[#00F0FF] mt-0.5">
                  {selectedPlayerModal.prizeMoney}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-black/35 border border-white/10 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className={theme.subText}>Playing Style</span>
                <span className="font-bold text-white">{selectedPlayerModal.plays}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.subText}>Fastest Recorded Serve</span>
                <span className="font-mono-num font-bold text-[#FFD700]">{selectedPlayerModal.fastestServe}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.subText}>Season Service Aces</span>
                <span className="font-mono-num font-bold text-[#00FF66]">{selectedPlayerModal.acesSeason} Aces</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayerModal(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
            >
              Close Player Career Profile
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          GENERAL ARTICLE / REEL MODAL
         ==================================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl border-2 border-[#FFD700] max-w-md w-full overflow-hidden ${theme.cardBg}`}>
            {activeModal.img && (
              <div className="h-48 w-full overflow-hidden">
                <img src={activeModal.img} alt={activeModal.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-3">
              <div className="text-xs font-bold text-[#00FF66]">{activeModal.subtitle}</div>
              <h3 className="text-base font-display font-black text-white">{activeModal.title}</h3>
              <p className="text-xs text-white/85 leading-relaxed">{activeModal.body}</p>
              <button
                onClick={() => {
                  if (awardPoints) awardPoints(10, 'Tennis Hub Engagement');
                  setActiveModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                Done ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DEDICATED 5-TAB TENNIS BOTTOM NAVIGATION BAR
          Home | Reels | Fixtures | Slams | More
         ==================================================================== */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-1.5 backdrop-blur-md ${theme.navBg}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-5 items-center">
          {[
            { id: 'HOME', label: 'Home', icon: '🎾' },
            { id: 'REELS', label: 'Reels', icon: '🎬' },
            { id: 'FIXTURES', label: 'Fixtures', icon: '📅' },
            { id: 'SLAMS', label: 'Slams', icon: '🏆' },
            { id: 'MORE', label: 'More', icon: '•••' }
          ].map((navItem) => {
            const isAct = bottomNav === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => {
                  setBottomNav(navItem.id as typeof bottomNav);
                  if (navItem.id === 'HOME') setTopTab('FEATURED');
                }}
                className="flex flex-col items-center justify-center py-1 gap-0.5 cursor-pointer"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                    isAct
                      ? 'bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] scale-105'
                      : 'text-white/75'
                  }`}
                >
                  {navItem.icon}
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-bold ${
                    isAct ? 'text-[#FFD700]' : 'text-white/75'
                  }`}
                >
                  {navItem.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
