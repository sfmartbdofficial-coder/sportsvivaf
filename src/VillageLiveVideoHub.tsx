import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Video,
  Camera,
  Mic,
  MicOff,
  RefreshCw,
  Eye,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Upload,
  MapPin,
  Radio,
  Play,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface VillageVideoStream {
  id: string;
  title: string;
  groundLocation: string;
  broadcasterName: string;
  teamA: string;
  teamB: string;
  battingTeam: string;
  bowlingTeam: string;
  score: number;
  wickets: number;
  legalBalls: number;
  totalOvers: number;
  strikerName: string;
  strikerRuns: number;
  strikerBalls: number;
  nonStrikerName: string;
  nonStrikerRuns: number;
  nonStrikerBalls: number;
  bowlerName: string;
  bowlerRuns: number;
  bowlerWickets: number;
  bowlerBalls: number;
  recentBalls: string[];
  viewers: number;
  isUserCamera?: boolean;
  customVideoUrl?: string;
  chat: { id: string; user: string; text: string; time: string }[];
}

export const INITIAL_VILLAGE_STREAMS: VillageVideoStream[] = [
  {
    id: 'vstream-1',
    title: 'গ্রাম বাংলা ঈদ কাপ টি-১০ ফাইনাল',
    groundLocation: 'রূপগঞ্জ ঈদগাহ মাঠ, নারায়ণগঞ্জ',
    broadcasterName: 'রাকিব হাসান (মোবাইল ক্যামেরা লাইভ)',
    teamA: 'উত্তরপাড়া কিংস',
    teamB: 'দক্ষিণপাড়া টাইগার্স',
    battingTeam: 'উত্তরপাড়া কিংস',
    bowlingTeam: 'দক্ষিণপাড়া টাইগার্স',
    score: 86,
    wickets: 3,
    legalBalls: 44,
    totalOvers: 10,
    strikerName: 'সোহেল রানা',
    strikerRuns: 38,
    strikerBalls: 19,
    nonStrikerName: 'আরিফুল ইসলাম',
    nonStrikerRuns: 21,
    nonStrikerBalls: 12,
    bowlerName: 'শরীফুল রাজ',
    bowlerRuns: 24,
    bowlerWickets: 2,
    bowlerBalls: 14,
    recentBalls: ['1', '4', '0', '6', '1', '2'],
    viewers: 1485,
    chat: [
      { id: 'vc-1', user: 'সুমন আহমেদ', text: 'সোহেল ভাই আজকে দারুণ ব্যাটিং করছে! 🔥', time: 'এখন' },
      { id: 'vc-2', user: 'মাহমুদুল হাসান', text: 'ভিডিও কোয়ালিটি একদম পরিষ্কার ভাই, চালিয়ে যান!', time: '১ মি.' },
      { id: 'vc-3', user: 'তানভীর', text: 'দক্ষিণপাড়া টাইগার্স কামব্যাক করবে ইনশাআল্লাহ 🏏', time: '২ মি.' }
    ]
  },
  {
    id: 'vstream-2',
    title: 'পল্লী বন্ধু স্মৃতি শর্ট পিচ টুর্নামেন্ট',
    groundLocation: 'সদর হাই স্কুল মাঠ, কুমিল্লা',
    broadcasterName: 'নাহিদুল ইসলাম (মাঠ থেকে সরাসরি)',
    teamA: 'কুমিল্লা ইয়াং স্টার',
    teamB: 'চৌদ্দগ্রাম ওয়ারিয়র্স',
    battingTeam: 'কুমিল্লা ইয়াং স্টার',
    bowlingTeam: 'চৌদ্দগ্রাম ওয়ারিয়র্স',
    score: 64,
    wickets: 2,
    legalBalls: 32,
    totalOvers: 8,
    strikerName: 'নাজমুল শান্ত',
    strikerRuns: 29,
    strikerBalls: 14,
    nonStrikerName: 'ইমন হোসেন',
    nonStrikerRuns: 18,
    nonStrikerBalls: 10,
    bowlerName: 'তাসকিন রনি',
    bowlerRuns: 16,
    bowlerWickets: 1,
    bowlerBalls: 8,
    recentBalls: ['4', '4', '0', '1', '6', '0'],
    viewers: 920,
    chat: [
      { id: 'vc-4', user: 'রাশেদ খান', text: 'মাঠের চারপাশে দর্শকদের ভিড় দেখার মতো!', time: 'এখন' },
      { id: 'vc-5', user: 'জাহিদ', text: 'পরের ওভারে রনি বোলিংয়ে আসলে খেলা জমে যাবে', time: '১ মি.' }
    ]
  }
];

const formatOversStr = (balls: number) => {
  const o = Math.floor(balls / 6);
  const b = balls % 6;
  return `${o}.${b}`;
};

export const VillageLiveVideoHub: React.FC<{
  streams: VillageVideoStream[];
  setStreams: React.Dispatch<React.SetStateAction<VillageVideoStream[]>>;
  selectedStreamId: string | null;
  setSelectedStreamId: (id: string | null) => void;
  initialMode?: 'WATCH' | 'BROADCAST';
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onOpenDeposit: (presetTaka?: number) => void;
  awardPoints: (pts: number, reason?: string) => void;
  onBack: () => void;
}> = ({
  streams,
  setStreams,
  selectedStreamId,
  setSelectedStreamId,
  initialMode = 'WATCH',
  points,
  setPoints,
  onOpenDeposit,
  awardPoints,
  onBack
}) => {
  const [mode, setMode] = useState<'WATCH' | 'BROADCAST'>(initialMode);
  const activeStream = streams.find((s) => s.id === selectedStreamId) || streams[0];

  // Camera & Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Camera Broadcast States
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  // New Broadcast Setup Form
  const [newTitle, setNewTitle] = useState('গ্রাম বাংলা ক্রিকেট লাইভ ম্যাচ');
  const [newGround, setNewGround] = useState('হাই স্কুল মাঠ');
  const [newBroadcaster, setNewBroadcaster] = useState('লাইভ ক্যামেরাম্যান');
  const [newTeamA, setNewTeamA] = useState('গ্রাম একাদশ এ');
  const [newTeamB, setNewTeamB] = useState('গ্রাম একাদশ বি');
  const [newStriker, setNewStriker] = useState('রাকিবুল');
  const [newNonStriker, setNewNonStriker] = useState('মাহমুদ');
  const [newBowler, setNewBowler] = useState('হাসান');
  const [newOvers, setNewOvers] = useState<number>(10);

  // Floating Reaction Emojis & Event Banner
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [eventBanner, setEventBanner] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Stop camera helper
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start Real Device Camera (Front/Back)
  const startDeviceCamera = async (preferredFacing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: preferredFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      setCameraActive(true);
      setUploadedVideoUrl(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      try {
        // Fallback to any available video camera
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = fallbackStream;
        setCameraActive(true);
        setUploadedVideoUrl(null);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
      } catch {
        setCameraError(
          'আপনার ডিভাইসে ক্যামেরা পারমিশন পাওয়া যায়নি। নিচে "গ্যালারি থেকে ভিডিও সিলেক্ট করুন" বাটনে ক্লিক করে যেকোনো খেলার ভিডিও লাইভ চালাতে পারেন, অথবা লাইভ সিমুলেশন মোডে প্রচার শুরু করুন!'
        );
      }
    }
  };

  // Re-attach camera stream when videoRef mounts or changes
  useEffect(() => {
    if (cameraActive && mediaStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, mode, selectedStreamId]);

  const handleToggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (cameraActive) {
      startDeviceCamera(nextFacing);
    }
  };

  const handleToggleMic = () => {
    const nextMic = !micEnabled;
    setMicEnabled(nextMic);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = nextMic;
      });
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setCameraError(null);
    if (activeStream) {
      setStreams((prev) =>
        prev.map((s) => (s.id === activeStream.id ? { ...s, customVideoUrl: url, isUserCamera: false } : s))
      );
    }
  };

  // Create & Launch User's Own Village Cricket Video Broadcast (Requires Minimum 200 Points)
  const handleStartNewVideoBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (points < 200) {
      setCameraError(
        `⚠️ ভিডিও খেলা লাইভ করতে মিনিমাম ২০০ পয়েন্ট লাগবে! আপনার বর্তমান ব্যালেন্স ${points} পয়েন্ট। নিচের "+ ২০০ পয়েন্ট কিনুন" বাটনে ক্লিক করে পয়েন্ট কিনুন!`
      );
      return;
    }

    setPoints((prev) => prev - 200);

    const newStream: VillageVideoStream = {
      id: `vstream-${Date.now()}`,
      title: newTitle.trim() || 'গ্রাম বাংলা ক্রিকেট লাইভ',
      groundLocation: newGround.trim() || 'স্থানীয় খেলার মাঠ',
      broadcasterName: `${newBroadcaster.trim() || 'ইউজার'} (LIVE ক্যামেরা)`,
      teamA: newTeamA.trim() || 'টিম এ',
      teamB: newTeamB.trim() || 'টিম বি',
      battingTeam: newTeamA.trim() || 'টিম এ',
      bowlingTeam: newTeamB.trim() || 'টিম বি',
      score: 0,
      wickets: 0,
      legalBalls: 0,
      totalOvers: newOvers,
      strikerName: newStriker.trim() || 'ব্যাটসম্যান ১',
      strikerRuns: 0,
      strikerBalls: 0,
      nonStrikerName: newNonStriker.trim() || 'ব্যাটসম্যান ২',
      nonStrikerRuns: 0,
      nonStrikerBalls: 0,
      bowlerName: newBowler.trim() || 'বোলার ১',
      bowlerRuns: 0,
      bowlerWickets: 0,
      bowlerBalls: 0,
      recentBalls: [],
      viewers: 45,
      isUserCamera: true,
      customVideoUrl: uploadedVideoUrl || undefined,
      chat: [
        {
          id: `chat-${Date.now()}`,
          user: 'SportsViva Live',
          text: `✅ ২০০ পয়েন্ট দিয়ে ${newTeamA} বনাম ${newTeamB} এর সরাসরি ভিডিও সম্প্রচার শুরু হয়েছে!`,
          time: 'এখন'
        }
      ]
    };

    setStreams((prev) => [newStream, ...prev]);
    setSelectedStreamId(newStream.id);
    if (!uploadedVideoUrl) {
      await startDeviceCamera(facingMode);
    }
    setEventBanner('🎉 ২০০ পয়েন্ট কেটে সরাসরি ভিডিও খেলা লাইভ শুরু হয়েছে!');
    setTimeout(() => setEventBanner(null), 3200);
  };

  // Animated Village Cricket Live Action Canvas (when watching community streams or when no physical camera is attached)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const render = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;

      // Sky & Village Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.32);
      skyGrad.addColorStop(0, '#0EA5E9');
      skyGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.32);

      // Village Palm & Mango Trees along the horizon
      for (let i = 0; i < 16; i++) {
        const tx = (i * (w / 15)) + Math.sin(tick * 0.02 + i) * 1.5;
        const ty = h * 0.31;
        ctx.fillStyle = i % 2 === 0 ? '#14532D' : '#166534';
        ctx.beginPath();
        ctx.arc(tx, ty - 12, 18 + (i % 3) * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Colorful Village Tournament Shamiana (Tents) & Crowd
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(w * 0.08, h * 0.26, 70, 14);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(w * 0.2, h * 0.26, 70, 14);
      ctx.fillStyle = '#2563EB';
      ctx.fillRect(w * 0.72, h * 0.26, 80, 14);

      // Village Spectators around boundary
      for (let i = 0; i < 42; i++) {
        const cx = 18 + i * ((w - 36) / 42);
        const cy = h * 0.32 + Math.abs(Math.sin(tick * 0.08 + i)) * 3;
        ctx.fillStyle = ['#FBBF24', '#EF4444', '#38BDF8', '#FFFFFF', '#A855F7'][i % 5];
        ctx.beginPath();
        ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lush Green Village Cricket Outfield
      const grassGrad = ctx.createLinearGradient(0, h * 0.32, 0, h);
      grassGrad.addColorStop(0, '#15803D');
      grassGrad.addColorStop(0.5, '#16A34A');
      grassGrad.addColorStop(1, '#14532D');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, h * 0.32, w, h * 0.68);

      // White Boundary Rope
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.65, w * 0.44, h * 0.27, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Earthen Clay Cricket Pitch (Perspective trapezoid in center)
      ctx.fillStyle = '#D6B37C';
      ctx.beginPath();
      ctx.moveTo(w * 0.46, h * 0.43);
      ctx.lineTo(w * 0.54, h * 0.43);
      ctx.lineTo(w * 0.59, h * 0.82);
      ctx.lineTo(w * 0.41, h * 0.82);
      ctx.closePath();
      ctx.fill();

      // Crease lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.47);
      ctx.lineTo(w * 0.55, h * 0.47);
      ctx.moveTo(w * 0.41, h * 0.77);
      ctx.lineTo(w * 0.59, h * 0.77);
      ctx.stroke();

      // Stumps (Far & Near)
      ctx.fillStyle = '#FEF08A';
      for (let s = -1; s <= 1; s++) {
        ctx.fillRect(w * 0.5 + s * 4 - 1, h * 0.43 - 10, 2, 10);
        ctx.fillRect(w * 0.5 + s * 6 - 1.5, h * 0.77 - 14, 3, 14);
      }

      // Animated Bowler & Ball Delivery Cycle
      const cycle = (tick % 140) / 140; // 0 to 1
      const bowlerY = cycle < 0.45 ? h * 0.88 - cycle * (h * 0.24) : h * 0.77;
      const bowlerX = w * 0.47;

      // Striker Batsman at far crease
      const batX = w * 0.51;
      const batY = h * 0.46;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(batX, batY - 12, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(batX - 4, batY - 7, 8, 12);

      // Cricket Bat Swing
      ctx.save();
      ctx.translate(batX + 5, batY - 3);
      const swingAngle = cycle > 0.48 && cycle < 0.68 ? -Math.sin((cycle - 0.48) * 15) * 1.4 : 0.3;
      ctx.rotate(swingAngle);
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(0, 0, 3.5, 13);
      ctx.restore();

      // Bowler figure
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bowlerX, bowlerY - 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(bowlerX - 4.5, bowlerY - 9, 9, 13);

      // Cricket Ball trajectory
      if (cycle >= 0.42 && cycle < 0.55) {
        const p = (cycle - 0.42) / 0.13;
        const bx = bowlerX + (batX - bowlerX) * p;
        const by = h * 0.75 - (h * 0.75 - batY) * p;
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (cycle >= 0.55) {
        // Ball hit into the outfield!
        const p = (cycle - 0.55) / 0.45;
        const bx = batX + Math.cos(tick * 0.01) * (w * 0.32) * p;
        const by = batY + Math.sin(0.6) * (h * 0.22) * p;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fielders in the green outfield
      const fielders = [
        [w * 0.22, h * 0.52],
        [w * 0.78, h * 0.54],
        [w * 0.28, h * 0.7],
        [w * 0.74, h * 0.68],
        [w * 0.5, h * 0.38]
      ];
      fielders.forEach(([fx, fy], idx) => {
        const moveX = fx + Math.sin(tick * 0.04 + idx) * 4;
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(moveX - 3, fy - 6, 6, 9);
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(moveX, fy - 9, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeStream?.id, cameraActive, uploadedVideoUrl]);

  // Trigger Live Score Update on the Active Video Stream
  const handleVideoScoreUpdate = (action: '0' | '1' | '2' | '3' | '4' | '6' | 'W' | 'WD' | 'NB') => {
    if (!activeStream) return;

    let bannerMsg: string | null = null;
    if (action === '4') bannerMsg = '⚡ চমৎকার চার! FOUR RUNS! ⚡';
    if (action === '6') bannerMsg = '🔥 বিশাল ছক্কা! MASSIVE SIX! 🔥';
    if (action === 'W') bannerMsg = '🎯 আউট! WICKET DOWN! 🎯';

    if (bannerMsg) {
      setEventBanner(bannerMsg);
      setTimeout(() => setEventBanner(null), 2600);
    }

    setStreams((prev) =>
      prev.map((s) => {
        if (s.id !== activeStream.id) return s;
        const updated = { ...s };
        if (action === 'WD' || action === 'NB') {
          updated.score += 1;
          updated.bowlerRuns += 1;
          updated.recentBalls = [...updated.recentBalls.slice(-5), action];
        } else if (action === 'W') {
          updated.wickets = Math.min(10, updated.wickets + 1);
          updated.legalBalls += 1;
          updated.bowlerBalls += 1;
          updated.bowlerWickets += 1;
          updated.strikerBalls += 1;
          updated.recentBalls = [...updated.recentBalls.slice(-5), 'W'];
        } else {
          const r = parseInt(action, 10);
          updated.score += r;
          updated.legalBalls += 1;
          updated.strikerRuns += r;
          updated.strikerBalls += 1;
          updated.bowlerRuns += r;
          updated.bowlerBalls += 1;
          updated.recentBalls = [...updated.recentBalls.slice(-5), action];
          if (r === 1 || r === 3) {
            // Swap striker & non-striker
            const tn = updated.strikerName;
            const tr = updated.strikerRuns;
            const tb = updated.strikerBalls;
            updated.strikerName = updated.nonStrikerName;
            updated.strikerRuns = updated.nonStrikerRuns;
            updated.strikerBalls = updated.nonStrikerBalls;
            updated.nonStrikerName = tn;
            updated.nonStrikerRuns = tr;
            updated.nonStrikerBalls = tb;
          }
        }
        return updated;
      })
    );
    awardPoints(5);
  };

  const triggerFloatingEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 65 + Math.floor(Math.random() * 25);
    setFloatingReactions((prev) => [...prev.slice(-12), { id, emoji, left }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);
  };

  const handleSendStreamChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeStream) return;
    const msg = {
      id: `vc-${Date.now()}`,
      user: 'আপনি (দর্শক)',
      text: chatInput.trim(),
      time: 'এখন'
    };
    setStreams((prev) =>
      prev.map((s) => (s.id === activeStream.id ? { ...s, chat: [msg, ...s.chat] } : s))
    );
    setChatInput('');
  };

  const showRealVideoElement =
    cameraActive || Boolean(uploadedVideoUrl) || Boolean(activeStream?.customVideoUrl);

  return (
    <div className="space-y-4 pb-10">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#2A0815] via-[#0A3A0A] to-[#062915] border-2 border-[#FF2E93] rounded-2xl p-3.5 shadow-[0_0_20px_rgba(255,46,147,0.3)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="w-10 h-10 rounded-xl bg-[#021A0A] border border-[#FF2E93]/60 flex items-center justify-center text-[#FFD700] hover:border-[#00FF00] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center gap-1 animate-pulse">
                <Video className="w-3 h-3" /> DIRECT VIDEO LIVE
              </span>
              <h1 className="text-base sm:text-xl font-display font-black italic text-[#FFD700]">
                সরাসরি গ্রামের ক্রিকেট ভিডিও লাইভ
              </h1>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              যেকোনো গ্রামের ক্রিকেট খেলা আপনার মোবাইলের ক্যামেরা দিয়ে সরাসরি ভিডিও প্রচার করুন ও দেখুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('WATCH')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              mode === 'WATCH'
                ? 'bg-[#00FF66] text-[#021A0A] shadow-[0_0_12px_rgba(0,255,102,0.6)]'
                : 'bg-[#021A0A] text-white border border-emerald-500/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>📺 লাইভ ভিডিও দেখুন ({streams.length})</span>
          </button>

          <button
            onClick={() => {
              setMode('BROADCAST');
              if (!cameraActive && !uploadedVideoUrl) {
                startDeviceCamera(facingMode);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              mode === 'BROADCAST'
                ? 'bg-gradient-to-r from-[#FF2E93] to-[#FFD700] text-[#021A0A] shadow-[0_0_15px_rgba(255,46,147,0.7)]'
                : 'bg-[#3D0B20] text-[#FFD700] border border-[#FF2E93]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>🎥 ক্যামেরা দিয়ে লাইভ করুন</span>
          </button>
        </div>
      </div>

      {/* Stream Selector Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {streams.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStreamId(st.id)}
            className={`px-3.5 py-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
              activeStream?.id === st.id
                ? 'bg-[#290919] border-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.35)]'
                : 'bg-[#062609] border-emerald-800/80 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD700]">
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-black flex items-center gap-1">
                ● VIDEO
              </span>
              <span className="truncate max-w-[180px]">{st.title}</span>
            </div>
            <div className="text-[11px] text-white font-mono-num mt-0.5">
              {st.teamA} বনাম {st.teamB} • {st.score}/{st.wickets} ({formatOversStr(st.legalBalls)} ওভার)
            </div>
          </button>
        ))}
      </div>

      {/* MAIN GRID: LEFT VIDEO PLAYER & CAMERA STUDIO | RIGHT LIVE CHAT & STREAM SETUP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* ================================================================
              THE LIVE VIDEO BROADCAST FRAME (CAMERA / UPLOADED VIDEO / LIVE CANVAS)
             ================================================================ */}
          {activeStream && (
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#FF2E93] shadow-[0_0_25px_rgba(255,46,147,0.28)]">
              {/* Video / Canvas Container */}
              <div className="relative w-full h-[300px] sm:h-[400px] bg-[#041208] flex items-center justify-center overflow-hidden">
                {showRealVideoElement ? (
                  <video
                    ref={videoRef}
                    src={!cameraActive ? uploadedVideoUrl || activeStream.customVideoUrl : undefined}
                    autoPlay
                    playsInline
                    loop={!cameraActive}
                    muted={cameraActive || !soundOn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <canvas
                    ref={canvasRef}
                    width={720}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* TOP-LEFT OVERLAY: LIVE BADGE + VILLAGE GROUND LOCATION */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-display font-black flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      সরাসরি ভিডিও (LIVE)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[#FFD700] text-xs font-bold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#00FF66]" />
                      {activeStream.viewers.toLocaleString()} দর্শক
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold flex items-center gap-1.5 w-fit">
                    <MapPin className="w-3.5 h-3.5 text-[#FF2E93] shrink-0" />
                    <span>{activeStream.groundLocation}</span>
                    <span className="text-emerald-300">• 📹 {activeStream.broadcasterName}</span>
                  </div>
                </div>

                {/* TOP-RIGHT OVERLAY: SOUND & CAMERA SWITCH */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  {cameraActive && (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleFacingMode}
                        className="px-2.5 py-1.5 rounded-lg bg-black/75 border border-[#00FF66] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#0A3A0A] cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>{facingMode === 'environment' ? 'পিছনের ক্যামেরা' : 'সামনের ক্যামেরা'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleMic}
                        className={`p-2 rounded-lg border cursor-pointer ${
                          micEnabled
                            ? 'bg-emerald-700/80 border-[#00FF66] text-white'
                            : 'bg-red-700/80 border-red-400 text-white'
                        }`}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setSoundOn((s) => !s)}
                    className="p-2 rounded-lg bg-black/70 border border-white/25 text-white hover:text-[#FFD700] cursor-pointer"
                  >
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* CENTER CELEBRATION BANNER (4 / 6 / WICKET) */}
                {eventBanner && (
                  <div className="absolute inset-x-6 top-1/3 z-30 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF2E93] via-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-lg sm:text-2xl text-center shadow-[0_0_30px_rgba(255,215,0,0.9)] animate-bounce">
                    {eventBanner}
                  </div>
                )}

                {/* FLOATING FAN REACTIONS */}
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.left}%` }}
                    className="pointer-events-none absolute bottom-20 z-30 text-2xl animate-bounce"
                  >
                    {r.emoji}
                  </div>
                ))}

                {/* BOTTOM TV BROADCAST SCOREBOARD GRAPHIC OVERLAY ON VIDEO */}
                <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-6 pb-2.5 px-3 sm:px-4">
                  <div className="rounded-xl bg-gradient-to-r from-[#04240E]/95 via-[#093518]/95 to-[#1F0918]/95 border border-[#00FF66]/60 px-3 py-2 shadow-xl flex flex-wrap items-center justify-between gap-2">
                    {/* Left: Teams & Score */}
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#FFD700] to-[#F59E0B] text-[#021A0A] font-display font-black text-sm sm:text-base font-mono-num">
                        {activeStream.score}/{activeStream.wickets}
                        <span className="text-[11px] font-bold ml-1">
                          ({formatOversStr(activeStream.legalBalls)}/{activeStream.totalOvers})
                        </span>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-display font-black text-white">
                          {activeStream.battingTeam}{' '}
                          <span className="text-[#FFD700] font-normal text-xs">বনাম {activeStream.bowlingTeam}</span>
                        </div>
                        <div className="text-[11px] text-emerald-200 flex items-center gap-2">
                          <span>
                            🏏 {activeStream.strikerName}*{' '}
                            <strong className="text-[#FFD700] font-mono-num">
                              {activeStream.strikerRuns}({activeStream.strikerBalls})
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            {activeStream.nonStrikerName}{' '}
                            <strong className="text-white font-mono-num">
                              {activeStream.nonStrikerRuns}({activeStream.nonStrikerBalls})
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Bowler & Recent Balls */}
                    <div className="flex items-center gap-2.5 ml-auto">
                      <div className="text-right hidden sm:block">
                        <div className="text-[11px] font-bold text-[#00F0FF]">
                          ⚾ {activeStream.bowlerName}: {activeStream.bowlerWickets}-{activeStream.bowlerRuns} (
                          {formatOversStr(activeStream.bowlerBalls)})
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeStream.recentBalls.slice(-6).map((b, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-5 rounded-full text-[10px] font-mono-num font-black flex items-center justify-center ${
                              b === '6'
                                ? 'bg-[#FFD700] text-[#021A0A]'
                                : b === '4'
                                ? 'bg-[#00FF66] text-[#021A0A]'
                                : b === 'W'
                                ? 'bg-red-600 text-white'
                                : 'bg-white/20 text-white'
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reaction Bar & Quick Camera Switch Strip below Video */}
              <div className="bg-[#072912] px-3.5 py-2.5 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-200 mr-1">লাইভ রিয়্যাকশন:</span>
                  {['🔥', '6️⃣', '4️⃣', '👏', '❤️', '🏆'].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => triggerFloatingEmoji(emo)}
                      className="w-8 h-8 rounded-full bg-[#021A0A] hover:bg-[#0E4D14] border border-emerald-500/40 flex items-center justify-center text-sm active:scale-125 transition-transform cursor-pointer"
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={() => startDeviceCamera(facingMode)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#FF6B00] text-white text-xs font-display font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>মোবাইল ক্যামেরা অন করুন</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-display font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>⏹️ ক্যামেরা বন্ধ করুন</span>
                    </button>
                  )}

                  <label className="px-3 py-1.5 rounded-xl bg-[#021A0A] border border-[#FFD700]/70 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#0B3818]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>গ্যালারি থেকে ভিডিও</span>
                    <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="bg-amber-950/90 border-2 border-[#FFD700] rounded-xl p-3.5 text-xs text-amber-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span>{cameraError}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDeposit(40)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shrink-0"
              >
                + ২০০ পয়েন্ট কিনুন (৪০ টাকা)
              </button>
            </div>
          )}

          {/* ================================================================
              CAMERAMAN LIVE VIDEO SCORE CONTROLLER (UPDATE SCORE OVERLAY WHILE RECORDING)
             ================================================================ */}
          <div className="bg-[#0A3A0A] border-2 border-[#00FF66] rounded-2xl p-4 space-y-3 shadow-[0_0_16px_rgba(0,255,102,0.2)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-display font-black text-[#FFD700] flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  ভিডিওর ওপর লাইভ স্কোর আপডেট প্যাড (Cameraman Live Score Overlay Pad)
                </h3>
                <p className="text-[11px] text-emerald-200">
                  মাঠে ভিডিও করার সময় নিচের বাটনে চাপ দিলে ভিডিওর নিচের টিভি স্কোরবোর্ডে সাথে সাথে রান আপডেট হবে!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
              {(['0', '1', '2', '3', '4', '6', 'W', 'WD', 'NB'] as const).map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleVideoScoreUpdate(btn)}
                  className={`py-2.5 rounded-xl font-display font-black text-sm cursor-pointer active:scale-95 transition-transform ${
                    btn === '6'
                      ? 'bg-[#FFD700] text-[#021A0A] shadow-[0_0_10px_rgba(255,215,0,0.6)]'
                      : btn === '4'
                      ? 'bg-[#00FF66] text-[#021A0A] shadow-[0_0_10px_rgba(0,255,102,0.6)]'
                      : btn === 'W'
                      ? 'bg-red-600 text-white'
                      : btn === 'WD' || btn === 'NB'
                      ? 'bg-amber-500 text-[#021A0A]'
                      : 'bg-[#021A0A] text-white border border-emerald-500/50 hover:border-[#00FF66]'
                  }`}
                >
                  {btn === 'W' ? 'OUT' : btn}
                </button>
              ))}
            </div>
          </div>

          {/* ================================================================
              NEW VILLAGE MATCH VIDEO BROADCAST FORM (WHEN USER CLICKS "ক্যামেরা দিয়ে লাইভ করুন")
             ================================================================ */}
          {mode === 'BROADCAST' && (
            <form
              onSubmit={handleStartNewVideoBroadcast}
              className="bg-gradient-to-b from-[#240815] to-[#072610] border-2 border-[#FF2E93] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-[0_0_20px_rgba(255,46,147,0.25)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#FF2E93]" />
                    নতুন গ্রামের ক্রিকেট খেলা সরাসরি ভিডিও প্রচার করুন
                  </h2>
                  <p className="text-xs text-emerald-200">
                    ভিডিও খেলা সরাসরি লাইভ করতে <strong className="text-[#FFD700]">মিনিমাম ২০০ পয়েন্ট</strong> লাগবে (আপনার আছে: {points} পয়েন্ট)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#FF2E93]/25 border border-[#FF2E93] text-[#FFD700] text-xs font-display font-black">
                    ফি: ২০০ পয়েন্ট (40 Tk)
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDeposit(40)}
                    className="px-3 py-1 rounded-full bg-[#00FF66] text-[#021A0A] text-xs font-display font-black cursor-pointer"
                  >
                    + পয়েন্ট কিনুন
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">টুর্নামেন্ট / খেলার নাম</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">গ্রামের নাম / খেলার মাঠের স্থান</label>
                  <input
                    type="text"
                    required
                    value={newGround}
                    onChange={(e) => setNewGround(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">১ম দলের নাম (Team A)</label>
                  <input
                    type="text"
                    required
                    value={newTeamA}
                    onChange={(e) => setNewTeamA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">২য় দলের নাম (Team B)</label>
                  <input
                    type="text"
                    required
                    value={newTeamB}
                    onChange={(e) => setNewTeamB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1">মোট ওভার</label>
                  <select
                    value={newOvers}
                    onChange={(e) => setNewOvers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  >
                    <option value={6}>6 Overs (শর্ট পিচ)</option>
                    <option value={8}>8 Overs (গ্রাম বাংলা কাপ)</option>
                    <option value={10}>10 Overs (T10)</option>
                    <option value={12}>12 Overs</option>
                    <option value={16}>16 Overs</option>
                    <option value={20}>20 Overs (T20)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">স্ট্রাইকার ব্যাটসম্যান</label>
                  <input
                    type="text"
                    value={newStriker}
                    onChange={(e) => setNewStriker(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">নন-স্ট্রাইকার</label>
                  <input
                    type="text"
                    value={newNonStriker}
                    onChange={(e) => setNewNonStriker(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">বোলারের নাম</label>
                  <input
                    type="text"
                    value={newBowler}
                    onChange={(e) => setNewBowler(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1">প্রচারকারীর নাম</label>
                  <input
                    type="text"
                    value={newBroadcaster}
                    onChange={(e) => setNewBroadcaster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2E93] via-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-sm sm:text-base shadow-[0_0_20px_rgba(255,46,147,0.5)] cursor-pointer hover:brightness-110 transition-all"
              >
                🔴 ২০০ পয়েন্ট দিয়ে এখনই সরাসরি লাইভ ভিডিও শুরু করুন →
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE VIDEO FAN CHAT & STREAM INFO */}
        {activeStream && (
          <div className="space-y-4">
            <div className="bg-[#0A3A0A] border border-[#00FF66]/60 rounded-2xl p-4 flex flex-col h-[480px]">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2.5 mb-3">
                <h3 className="text-sm font-display font-black text-[#FFD700] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#FF2E93]" /> সরাসরি ভিডিও কমেন্ট বক্স
                </h3>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" /> লাইভ চ্যাট
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {activeStream.chat.map((msg) => (
                  <div key={msg.id} className="bg-[#042208] border border-emerald-800/60 rounded-xl p-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-bold text-[#FFD700]">{msg.user}</span>
                      <span className="text-emerald-400 font-mono-num">{msg.time}</span>
                    </div>
                    <p className="text-xs text-white">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendStreamChat} className="mt-3 pt-2 border-t border-emerald-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="ভিডিওতে আপনার কমেন্ট লিখুন..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500/50 text-xs text-white focus:outline-none focus:border-[#00FF66]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#00FF66] text-[#021A0A] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
