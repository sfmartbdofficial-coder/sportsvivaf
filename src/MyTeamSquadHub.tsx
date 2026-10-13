import React, { useState } from 'react';
import {
  ChevronLeft,
  ShieldCheck,
  Users,
  UserPlus,
  KeyRound,
  Lock,
  Unlock,
  MapPin,
  Phone,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Video,
  Radio,
  Sparkles,
  Copy,
  Eye,
  EyeOff,
  Trophy,
  Star,
  Wallet
} from 'lucide-react';

export interface TeamPlayerMember {
  id: string;
  name: string;
  age: number;
  homeVillage: string;
  role:
    | 'ওপেনিং ব্যাটসম্যান'
    | 'মিডল অর্ডার ব্যাটসম্যান'
    | 'ফাস্ট বোলার'
    | 'স্পিন বোলার'
    | 'ব্যাটিং অলরাউন্ডার'
    | 'বোলিং অলরাউন্ডার'
    | 'উইকেটকিপার ব্যাটসম্যান';
  playerQuality: string; // কে কেমন খেলোয়াড়
  jerseyNo: number;
  phone: string;
  isCaptain?: boolean;
}

export interface UserSavedTeam {
  id: string;
  teamIdCode: string; // যেমন: SV-7824
  pinCode: string; // ৪ সংখ্যার পিন নাম্বার
  teamName: string;
  villageAddress: string;
  district: string;
  captainName: string;
  captainPhone: string;
  isActive: boolean; // ৫০০ পয়েন্ট দিয়ে অ্যাক্টিভ করা হয়েছে কি না
  activatedAt?: string;
  players: TeamPlayerMember[];
}

export const INITIAL_SAVED_TEAMS: UserSavedTeam[] = [
  {
    id: 'team-1',
    teamIdCode: 'SV-7824',
    pinCode: '4920',
    teamName: 'রূপগঞ্জ টাইগার্স একাদশ',
    villageAddress: 'রূপগঞ্জ উত্তরপাড়া',
    district: 'নারায়ণগঞ্জ',
    captainName: 'সোহেল রানা',
    captainPhone: '01711-889900',
    isActive: false, // ইউজার যেন ৫০০ পয়েন্ট দিয়ে অ্যাক্টিভ করতে পারে
    players: [
      {
        id: 'tp-1',
        name: 'সোহেল রানা (ক্যাপ্টেন)',
        age: 24,
        homeVillage: 'রূপগঞ্জ উত্তরপাড়া, নারায়ণগঞ্জ',
        role: 'ব্যাটিং অলরাউন্ডার',
        playerQuality: 'ডানহাতি হার্ড-হিটার ব্যাটসম্যান ও মিডিয়াম ফাস্ট বোলার (সেরা অলরাউন্ডার)',
        jerseyNo: 75,
        phone: '01711-889900',
        isCaptain: true
      },
      {
        id: 'tp-2',
        name: 'আরিফুল ইসলাম জয়',
        age: 21,
        homeVillage: 'কাঞ্চন বাজার, রূপগঞ্জ',
        role: 'ওপেনিং ব্যাটসম্যান',
        playerQuality: 'পাওয়ার-প্লেতে দ্রুত চার-ছক্কা মারতে পারদর্শী বামহাতি ওপেনার',
        jerseyNo: 18,
        phone: '01819-223344'
      },
      {
        id: 'tp-3',
        name: 'মাহমুদুল হাসান রনি',
        age: 23,
        homeVillage: 'ভুলতা গাউছিয়া, নারায়ণগঞ্জ',
        role: 'উইকেটকিপার ব্যাটসম্যান',
        playerQuality: 'দারুণ উইকেটকিপিং এবং ফিনিশিংয়ে ছক্কা মারার স্পেশালিস্ট',
        jerseyNo: 15,
        phone: '01914-556677'
      },
      {
        id: 'tp-4',
        name: 'শরীফুল রাজ',
        age: 22,
        homeVillage: 'মুড়াপাড়া, রূপগঞ্জ',
        role: 'ফাস্ট বোলার',
        playerQuality: 'ঘণ্টায় ১৩৫+ কিমি গতির ইয়র্কার ও সুইং বোলার (ডেথ ওভার স্পেশালিস্ট)',
        jerseyNo: 99,
        phone: '01612-334455'
      },
      {
        id: 'tp-5',
        name: 'তানভীর আহমেদ',
        age: 20,
        homeVillage: 'বরপা, নারায়ণগঞ্জ',
        role: 'স্পিন বোলার',
        playerQuality: 'চমৎকার লেগ-স্পিন ও গুগলি বোলার, মিডল ওভারে উইকেট টেকিং বোলার',
        jerseyNo: 33,
        phone: '01755-667788'
      },
      {
        id: 'tp-6',
        name: 'নাজমুল হোসেন শান্ত',
        age: 25,
        homeVillage: 'তারাবো পৌরসভা, নারায়ণগঞ্জ',
        role: 'মিডল অর্ডার ব্যাটসম্যান',
        playerQuality: 'ধৈর্যশীল ও ক্লাসিক ব্যাটসম্যান, যেকোনো পরিস্থিতিতে ইনিংস গড়তে পারে',
        jerseyNo: 10,
        phone: '01521-445566'
      },
      {
        id: 'tp-7',
        name: 'রাকিবুল হাসান',
        age: 19,
        homeVillage: 'গোলাকান্দাইল, রূপগঞ্জ',
        role: 'বোলিং অলরাউন্ডার',
        playerQuality: 'বামহাতি অর্থোডক্স স্পিনার ও লোয়ার অর্ডার পিঞ্চ হিটার',
        jerseyNo: 45,
        phone: '01799-112233'
      },
      {
        id: 'tp-8',
        name: 'ইমন চৌধুরী',
        age: 22,
        homeVillage: 'দাউদপুর, রূপগঞ্জ',
        role: 'ওপেনিং ব্যাটসম্যান',
        playerQuality: 'আগ্রাসী স্ট্রোক প্লেয়ার এবং পয়েন্ট অঞ্চলের সেরা ফিল্ডার',
        jerseyNo: 28,
        phone: '01844-556677'
      },
      {
        id: 'tp-9',
        name: 'তাসকিন সোহান',
        age: 24,
        homeVillage: 'চনপাড়া, রূপগঞ্জ',
        role: 'ফাস্ট বোলার',
        playerQuality: 'নতুন বলে বাউন্সার ও কাটার দিতে দক্ষ ডানহাতি পেসার',
        jerseyNo: 3,
        phone: '01988-776655'
      },
      {
        id: 'tp-10',
        name: 'মেহেদী মিরাজ জুনিয়র',
        age: 21,
        homeVillage: 'ভোলাবো, রূপগঞ্জ',
        role: 'ব্যাটিং অলরাউন্ডার',
        playerQuality: 'অফ-স্পিন বোলিং এবং মিডল অর্ডারে ভরসাযোগ্য ব্যাটসম্যান',
        jerseyNo: 53,
        phone: '01722-998877'
      },
      {
        id: 'tp-11',
        name: 'মোস্তাফিজ কাটার',
        age: 23,
        homeVillage: 'কায়েতপাড়া, নারায়ণগঞ্জ',
        role: 'ফাস্ট বোলার',
        playerQuality: 'স্লোয়ার ও কাটার স্পেশালিস্ট, শেষ ওভারে রান আটকাতে সেরা',
        jerseyNo: 90,
        phone: '01677-889900'
      }
    ]
  },
  {
    id: 'team-2',
    teamIdCode: 'SV-5510',
    pinCode: '1234',
    teamName: 'কুমিল্লা ভিক্টোরিয়ান্স গ্রাম একাদশ',
    villageAddress: 'সদর দক্ষিণ, চৌদ্দগ্রাম',
    district: 'কুমিল্লা',
    captainName: 'নাহিদুল ইসলাম',
    captainPhone: '01812-998811',
    isActive: true,
    activatedAt: 'Active Verified',
    players: [
      {
        id: 'tp-201',
        name: 'নাহিদুল ইসলাম (ক্যাপ্টেন)',
        age: 26,
        homeVillage: 'চৌদ্দগ্রাম সদর, কুমিল্লা',
        role: 'ব্যাটিং অলরাউন্ডার',
        playerQuality: 'অভিজ্ঞ ক্যাপ্টেন, লম্বা ছক্কা ও অফ-ব্রেক বোলিংয়ে পারদর্শী',
        jerseyNo: 7,
        phone: '01812-998811',
        isCaptain: true
      },
      {
        id: 'tp-202',
        name: 'সাইফউদ্দিন রানা',
        age: 22,
        homeVillage: 'লাকসাম, কুমিল্লা',
        role: 'বোলিং অলরাউন্ডার',
        playerQuality: 'ইয়র্কার বোলার ও ডেথ ওভারে ঝড়ো ব্যাটিং করে',
        jerseyNo: 74,
        phone: '01733-221100'
      },
      {
        id: 'tp-203',
        name: 'লিটন কুমার',
        age: 24,
        homeVillage: 'কান্দিরপাড়, কুমিল্লা',
        role: 'উইকেটকিপার ব্যাটসম্যান',
        playerQuality: 'কভার ড্রাইভ ও পুল শটে সেরা ক্লাসিক ওপেনার',
        jerseyNo: 16,
        phone: '01911-332211'
      }
    ]
  }
];

export const MyTeamSquadHub: React.FC<{
  teams: UserSavedTeam[];
  setTeams: React.Dispatch<React.SetStateAction<UserSavedTeam[]>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onOpenDeposit: (presetTaka?: number) => void;
  onGoVideoLive: () => void;
  onGoBallByBallLive: () => void;
  onBack: () => void;
}> = ({
  teams,
  setTeams,
  points,
  setPoints,
  onOpenDeposit,
  onGoVideoLive,
  onGoBallByBallLive,
  onBack
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'SQUAD' | 'ADD_PLAYER' | 'CREATE_TEAM' | 'ID_PIN_STORE'>('SQUAD');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  // Add Player Form States
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState('22');
  const [playerVillage, setPlayerVillage] = useState('');
  const [playerRole, setPlayerRole] = useState<TeamPlayerMember['role']>('ব্যাটিং অলরাউন্ডার');
  const [playerQuality, setPlayerQuality] = useState('');
  const [playerJersey, setPlayerJersey] = useState('10');
  const [playerPhone, setPlayerPhone] = useState('');

  // Create New Team Form States
  const [newTeamName, setNewTeamName] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newDistrict, setNewDistrict] = useState('ঢাকা');
  const [newCaptain, setNewCaptain] = useState('');
  const [newCaptainPhone, setNewCaptainPhone] = useState('');
  const [newPinCode, setNewPinCode] = useState('5566');

  // Search Team by ID & PIN States
  const [searchIdInput, setSearchIdInput] = useState('');
  const [searchPinInput, setSearchPinInput] = useState('');

  // Point PIN Redeem State
  const [pointPinInput, setPointPinInput] = useState('');
  const [usedPins, setUsedPins] = useState<string[]>([]);

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  // Activate Team for 500 Points
  const handleActivateTeam = (team: UserSavedTeam) => {
    if (team.isActive) {
      setNotice({
        type: 'SUCCESS',
        text: `✅ "${team.teamName}" টিমটি ইতিমধ্যে অ্যাক্টিভ (Active) আছে! টিম আইডি: ${team.teamIdCode}`
      });
      return;
    }

    if (points < 500) {
      setNotice({
        type: 'ERROR',
        text: `⚠️ টিম অ্যাক্টিভ করতে মিনিমাম ৫০০ পয়েন্ট লাগবে! আপনার বর্তমান ব্যালেন্স ${points} পয়েন্ট। নিচের "+ পয়েন্ট কিনুন" বাটনে চাপ দিয়ে ৫০০ পয়েন্ট (১০০ টাকা) কিনুন!`
      });
      return;
    }

    setPoints((prev) => prev - 500);
    setTeams((prev) =>
      prev.map((t) =>
        t.id === team.id
          ? { ...t, isActive: true, activatedAt: 'এইমাত্র অ্যাক্টিভ করা হয়েছে (500 Pts)' }
          : t
      )
    );
    setNotice({
      type: 'SUCCESS',
      text: `🎉 অভিনন্দন! ৫০০ পয়েন্ট কেটে আপনার "${team.teamName}" (ID: ${team.teamIdCode} • PIN: ${team.pinCode}) টিমটি সফলভাবে অ্যাক্টিভ (Active) করা হয়েছে!`
    });
  };

  // Add New Player with Age, Village, Role & Quality to Current Team
  const handleAddPlayerToTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam) return;
    if (!playerName.trim() || !playerVillage.trim()) {
      setNotice({
        type: 'ERROR',
        text: '⚠️ অনুগ্রহ করে খেলোয়াড়ের নাম এবং তার বাড়ি কোথায় (গ্রামের নাম) লিখুন!'
      });
      return;
    }

    const newMember: TeamPlayerMember = {
      id: `pm-${Date.now()}`,
      name: playerName.trim(),
      age: Math.max(10, Math.min(60, Number(playerAge) || 22)),
      homeVillage: playerVillage.trim(),
      role: playerRole,
      playerQuality:
        playerQuality.trim() ||
        `${playerRole} — চমৎকার পারফরম্যান্স ও ম্যাচ জেতানো খেলোয়াড়`,
      jerseyNo: Number(playerJersey) || currentTeam.players.length + 1,
      phone: playerPhone.trim() || '017XX-XXXXXX'
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === currentTeam.id ? { ...t, players: [...t.players, newMember] } : t
      )
    );

    setPlayerName('');
    setPlayerVillage('');
    setPlayerQuality('');
    setPlayerPhone('');
    setPlayerJersey(String(currentTeam.players.length + 2));
    setActiveTab('SQUAD');
    setNotice({
      type: 'SUCCESS',
      text: `✅ খেলোয়াড় "${newMember.name}" (বয়স: ${newMember.age}, বাড়ি: ${newMember.homeVillage}) আপনার "${currentTeam.teamName}" টিমে যুক্ত হয়েছে!`
    });
  };

  // Delete Player from Team
  const handleRemovePlayer = (playerId: string, name: string) => {
    if (!currentTeam) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === currentTeam.id
          ? { ...t, players: t.players.filter((p) => p.id !== playerId) }
          : t
      )
    );
    setNotice({
      type: 'SUCCESS',
      text: `খেলোয়াড় "${name}" টিম তালিকা থেকে সরানো হয়েছে।`
    });
  };

  // Create New Team (with optional 500 pts instant activation)
  const handleCreateNewTeam = (e: React.FormEvent, activateNow: boolean) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newVillage.trim() || !newCaptain.trim()) {
      setNotice({
        type: 'ERROR',
        text: '⚠️ টিমের নাম, গ্রামের নাম এবং ক্যাপ্টেনের নাম অবশ্যই পূরণ করুন!'
      });
      return;
    }

    if (activateNow && points < 500) {
      setNotice({
        type: 'ERROR',
        text: `⚠️ টিম অ্যাক্টিভ করে তৈরি করতে মিনিমাম ৫০০ পয়েন্ট লাগবে! আপনার আছে ${points} পয়েন্ট। আগে পয়েন্ট কিনুন অথবা ড্রাফট হিসেবে সাজিয়ে রাখুন।`
      });
      return;
    }

    const randomIdCode = `SV-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanPin = newPinCode.replace(/\D/g, '').slice(0, 4) || '1234';

    const createdTeam: UserSavedTeam = {
      id: `team-${Date.now()}`,
      teamIdCode: randomIdCode,
      pinCode: cleanPin,
      teamName: newTeamName.trim(),
      villageAddress: newVillage.trim(),
      district: newDistrict,
      captainName: newCaptain.trim(),
      captainPhone: newCaptainPhone.trim() || '01700-000000',
      isActive: activateNow,
      activatedAt: activateNow ? 'এইমাত্র ৫০০ পয়েন্ট দিয়ে অ্যাক্টিভ করা হয়েছে' : undefined,
      players: [
        {
          id: `pm-cap-${Date.now()}`,
          name: `${newCaptain.trim()} (ক্যাপ্টেন)`,
          age: 24,
          homeVillage: `${newVillage.trim()}, ${newDistrict}`,
          role: 'ব্যাটিং অলরাউন্ডার',
          playerQuality: 'টিম ক্যাপ্টেন ও মূল অলরাউন্ডার',
          jerseyNo: 1,
          phone: newCaptainPhone.trim() || '01700-000000',
          isCaptain: true
        }
      ]
    };

    if (activateNow) {
      setPoints((prev) => prev - 500);
    }

    setTeams((prev) => [createdTeam, ...prev]);
    setSelectedTeamId(createdTeam.id);
    setNewTeamName('');
    setNewVillage('');
    setNewCaptain('');
    setNewCaptainPhone('');
    setActiveTab('SQUAD');
    setNotice({
      type: 'SUCCESS',
      text: activateNow
        ? `🎉 ৫০০ পয়েন্ট দিয়ে আপনার নতুন টিম "${createdTeam.teamName}" (ID: ${createdTeam.teamIdCode} • PIN: ${createdTeam.pinCode}) তৈরি ও অ্যাক্টিভ হয়েছে! এখন খেলোয়াড় যোগ করুন।`
        : `✅ আপনার টিম "${createdTeam.teamName}" (ID: ${createdTeam.teamIdCode} • PIN: ${createdTeam.pinCode}) সাজানো হয়েছে! ৫০০ পয়েন্ট দিয়ে যেকোনো সময় অ্যাক্টিভ করুন।`
    });
  };

  // Find Team by ID & PIN
  const handleFindTeamByPin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = teams.find(
      (t) =>
        t.teamIdCode.toLowerCase() === searchIdInput.trim().toLowerCase() ||
        (t.pinCode === searchPinInput.trim() && searchPinInput.trim() !== '')
    );
    if (!found) {
      setNotice({
        type: 'ERROR',
        text: '⚠️ এই টিম আইডি বা পিন নাম্বারের কোনো টিম পাওয়া যায়নি! সঠিক ID (যেমন: SV-7824) ও PIN (4920) দিন।'
      });
      return;
    }
    setSelectedTeamId(found.id);
    setActiveTab('SQUAD');
    setNotice({
      type: 'SUCCESS',
      text: `🔓 টিম আনলক সফল! "${found.teamName}" (মোট খেলোয়াড়: ${found.players.length} জন) ওপেন করা হয়েছে।`
    });
  };

  // Redeem Point PIN Code
  const handleRedeemPointPin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = pointPinInput.trim().toUpperCase();
    if (!code) return;
    if (usedPins.includes(code)) {
      setNotice({
        type: 'ERROR',
        text: '⚠️ এই পিন নাম্বারটি ইতিমধ্যে ব্যবহার করা হয়েছে!'
      });
      return;
    }

    const pinMap: Record<string, { pts: number; desc: string }> = {
      PIN100: { pts: 100, desc: 'বল বাই বল লাইভ প্যাক (১০০ পয়েন্ট)' },
      PIN200: { pts: 200, desc: 'ভিডিও খেলা লাইভ প্যাক (২০০ পয়েন্ট)' },
      PIN500: { pts: 500, desc: 'টিম অ্যাক্টিভেশন প্যাক (৫০০ পয়েন্ট)' },
      PIN1000: { pts: 1000, desc: 'প্রো মেগা প্যাক (১০০০ পয়েন্ট)' }
    };

    const match = pinMap[code];
    if (!match) {
      setNotice({
        type: 'ERROR',
        text: '⚠️ পিন নাম্বার সঠিক নয়! ডেমো টেস্ট করতে লিখুন: PIN500, PIN200 অথবা PIN100, কিংবা বিকাশ/নগদে পয়েন্ট কিনুন।'
      });
      return;
    }

    setPoints((prev) => prev + match.pts);
    setUsedPins((prev) => [...prev, code]);
    setPointPinInput('');
    setNotice({
      type: 'SUCCESS',
      text: `🎉 পিন রিচার্জ সফল! +${match.pts} পয়েন্ট (${match.desc}) আপনার ওয়ালেটে যোগ হয়েছে!`
    });
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#073618] via-[#0B2942] to-[#260B2C] border-2 border-[#FFD700] rounded-2xl p-3.5 sm:p-4 shadow-[0_0_24px_rgba(255,215,0,0.28)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-[#021A0A] border border-[#FFD700]/60 flex items-center justify-center text-[#FFD700] hover:border-[#00FF66] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] text-[10px] font-display font-black">
                  🛡️ TEAM ID &amp; PIN HUB
                </span>
                <span className="text-xs font-bold text-[#00F0FF]">
                  ৫০০ / ২০০ / ১০০ পয়েন্ট সিস্টেম
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-display font-black italic text-white mt-0.5">
                আমার টিম সাজান, খেলোয়াড়ের তথ্য ও পয়েন্ট অ্যাক্টিভেশন
              </h1>
              <p className="text-xs text-emerald-200">
                টিমে কতজন খেলোয়াড়, কার কত বয়স, বাড়ি কোথায় এবং কে কেমন খেলোয়াড় — সব তথ্য দিয়ে আপনার টিম সাজিয়ে রাখুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#021A0A] border border-[#FFD700] text-right">
              <div className="text-[10px] text-emerald-300 font-semibold">আপনার পয়েন্ট ব্যালেন্স</div>
              <div className="text-sm sm:text-base font-mono-num font-black text-[#FFD700]">
                🪙 {points.toLocaleString()} Pts
              </div>
            </div>
            <button
              onClick={() => onOpenDeposit(100)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs shadow-[0_0_15px_rgba(0,255,102,0.5)] hover:brightness-110 cursor-pointer"
            >
              + পয়েন্ট কিনুন
            </button>
          </div>
        </div>

        {/* 3 Mandatory Point Packages Banner (500 Pts Team | 200 Pts Video Live | 100 Pts Ball-by-Ball) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-white/15">
          {/* 1. 500 Points Team Activation */}
          <div className="rounded-xl bg-[#031C0B]/90 border border-[#FFD700]/70 p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#F59E0B] text-[#021A0A] flex items-center justify-center font-display font-black text-xs shrink-0">
                500
              </div>
              <div className="min-w-0">
                <div className="text-xs font-display font-black text-[#FFD700] truncate">
                  🛡️ টিম অ্যাক্টিভ করতে
                </div>
                <div className="text-[11px] font-bold text-white">
                  মিনিমাম ৫০০ পয়েন্ট (১০০ টাকা)
                </div>
              </div>
            </div>
            <button
              onClick={() => currentTeam && handleActivateTeam(currentTeam)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0 cursor-pointer hover:brightness-110"
            >
              {currentTeam?.isActive ? 'Active ✓' : 'অ্যাক্টিভ করুন'}
            </button>
          </div>

          {/* 2. 200 Points Video Match Live */}
          <div className="rounded-xl bg-[#240715]/90 border border-[#FF2E93]/70 p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2E93] to-[#FF6B00] text-white flex items-center justify-center font-display font-black text-xs shrink-0">
                200
              </div>
              <div className="min-w-0">
                <div className="text-xs font-display font-black text-[#FF85B3] truncate">
                  🎥 ভিডিও খেলা লাইভ করতে
                </div>
                <div className="text-[11px] font-bold text-white">
                  মিনিমাম ২০০ পয়েন্ট (৪০ টাকা)
                </div>
              </div>
            </div>
            <button
              onClick={onGoVideoLive}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2E93] to-[#FFD700] text-[#021A0A] font-display font-black text-[10px] shrink-0 cursor-pointer hover:brightness-110"
            >
              ভিডিও লাইভ →
            </button>
          </div>

          {/* 3. 100 Points Ball-by-Ball Live */}
          <div className="rounded-xl bg-[#042329]/90 border border-[#00F0FF]/70 p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FF66] to-[#00F0FF] text-[#021A0A] flex items-center justify-center font-display font-black text-xs shrink-0">
                100
              </div>
              <div className="min-w-0">
                <div className="text-xs font-display font-black text-[#00F0FF] truncate">
                  🏏 বল বাই বল লাইভ করতে
                </div>
                <div className="text-[11px] font-bold text-white">
                  মিনিমাম ১০০ পয়েন্ট (২০ টাকা)
                </div>
              </div>
            </div>
            <button
              onClick={onGoBallByBallLive}
              className="px-2.5 py-1.5 rounded-lg bg-[#00FF66] text-[#021A0A] font-display font-black text-[10px] shrink-0 cursor-pointer hover:brightness-110"
            >
              বল বাই বল →
            </button>
          </div>
        </div>
      </div>

      {/* Notice / Confirmation Alert */}
      {notice && (
        <div
          className={`rounded-2xl p-3.5 border-2 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-lg ${
            notice.type === 'SUCCESS'
              ? 'bg-[#0B421A] border-[#00FF66] text-white'
              : 'bg-[#3B0A18] border-[#FF2E93] text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5 text-[#00FF66] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#FFD700] shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {notice.type === 'ERROR' && (
              <button
                onClick={() => onOpenDeposit(100)}
                className="px-3 py-1.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                + পয়েন্ট কিনুন
              </button>
            )}
            <button onClick={() => setNotice(null)} className="text-white/80 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Team Switcher Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {teams.map((tm) => {
          const isSelected = currentTeam?.id === tm.id;
          return (
            <button
              key={tm.id}
              onClick={() => {
                setSelectedTeamId(tm.id);
                setActiveTab('SQUAD');
              }}
              className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#0E4D1B] to-[#08301D] border-2 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.35)]'
                  : 'bg-[#06260E] border-emerald-700/70 hover:border-[#00FF66]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-display font-black ${
                    tm.isActive
                      ? 'bg-[#00FF66] text-[#021A0A]'
                      : 'bg-amber-500/25 border border-amber-400 text-[#FFD700]'
                  }`}
                >
                  {tm.isActive ? '✅ ACTIVE' : '🔒 INACTIVE (500 Pts)'}
                </span>
                <span className="text-xs font-mono-num font-bold text-[#00F0FF]">
                  ID: {tm.teamIdCode}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-display font-black text-white mt-1">
                {tm.teamName}
              </div>
              <div className="text-[11px] text-emerald-200">
                📍 {tm.villageAddress}, {tm.district} • 👥 {tm.players.length} জন খেলোয়াড়
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setActiveTab('CREATE_TEAM')}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#00FF66]/20 border-2 border-dashed border-[#FFD700] text-[#FFD700] font-display font-black text-xs shrink-0 hover:bg-[#FFD700]/30 cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন টিম সাজান</span>
        </button>
      </div>

      {/* 4 Main Action Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#05230E] p-1.5 rounded-2xl border border-[#00FF66]/40">
        {[
          { id: 'SQUAD', label: `👥 আমার টিমের খেলোয়াড় (${currentTeam?.players.length || 0} জন)` },
          { id: 'ADD_PLAYER', label: '➕ টিমে খেলোয়াড় যোগ করুন' },
          { id: 'CREATE_TEAM', label: '🛡️ নতুন টিম তৈরি করুন' },
          { id: 'ID_PIN_STORE', label: '🔑 আইডি-পিন ও পয়েন্ট কিনুন' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`py-2.5 px-3 rounded-xl font-display font-black text-xs transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ====================================================================
          OFFICIAL DIGITAL TEAM ID & PIN CARD + 500 POINTS ACTIVATION BOX
         ==================================================================== */}
      {currentTeam && activeTab === 'SQUAD' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B3B19] via-[#062417] to-[#1A0D2E] border-2 border-[#FFD700] p-4 sm:p-5 shadow-[0_0_25px_rgba(255,215,0,0.25)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Left: Team Identity & Location */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-display font-black flex items-center gap-1 ${
                      currentTeam.isActive
                        ? 'bg-[#00FF66] text-[#021A0A]'
                        : 'bg-red-600 text-white animate-pulse'
                    }`}
                  >
                    {currentTeam.isActive ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> ACTIVE VERIFIED TEAM
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> INACTIVE • ৫০০ পয়েন্ট দিয়ে অ্যাক্টিভ করুন
                      </>
                    )}
                  </span>
                  <span className="text-xs font-bold text-emerald-200">
                    📍 গ্রাম/এলাকা: {currentTeam.villageAddress}, {currentTeam.district}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-black italic text-[#FFD700]">
                  {currentTeam.teamName}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-white pt-0.5">
                  <span>
                    👑 ক্যাপ্টেন: <strong className="text-[#00FF66]">{currentTeam.captainName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    📞 মোবাইল: <strong className="font-mono-num">{currentTeam.captainPhone}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    👥 মোট খেলোয়াড়:{' '}
                    <strong className="text-[#FFD700] font-mono-num">
                      {currentTeam.players.length} জন
                    </strong>
                  </span>
                </div>
              </div>

              {/* Right: Team ID & Secret PIN Box */}
              <div className="bg-[#021508]/90 border-2 border-[#00F0FF] rounded-2xl p-3 sm:p-3.5 min-w-[240px] space-y-2 shadow-[0_0_16px_rgba(0,240,255,0.25)]">
                <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                  <span className="text-[11px] font-display font-black text-[#00F0FF] flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#FFD700]" />
                    টিম আইডি ও পিন কার্ড
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard
                          .writeText(`Team: ${currentTeam.teamName} | ID: ${currentTeam.teamIdCode} | PIN: ${currentTeam.pinCode}`)
                          .catch(() => {});
                      }
                      setNotice({
                        type: 'SUCCESS',
                        text: `📋 টিম আইডি (${currentTeam.teamIdCode}) ও পিন নাম্বার কপি করা হয়েছে!`
                      });
                    }}
                    className="text-[10px] font-bold text-[#FFD700] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> কপি
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/40 rounded-xl p-2 border border-white/10">
                    <div className="text-[10px] text-emerald-300">টিম আইডি (ID)</div>
                    <div className="text-sm sm:text-base font-mono-num font-black text-white">
                      {currentTeam.teamIdCode}
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-300">পিন নাম্বার (PIN)</div>
                      <div className="text-sm sm:text-base font-mono-num font-black text-[#FFD700]">
                        {showPin ? currentTeam.pinCode : '••••'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPin((s) => !s)}
                      className="text-emerald-200 hover:text-white cursor-pointer"
                      title="Show/Hide PIN"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Activation Call-to-Action Bar */}
            <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              {!currentTeam.isActive ? (
                <>
                  <div className="text-xs text-amber-200 font-semibold">
                    ⚡ অ্যাপের ভিতর আপনার এই টিমটি একটিভ করতে <strong className="text-[#FFD700]">মিনিমাম ৫০০ পয়েন্ট</strong> লাগবে।
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleActivateTeam(currentTeam)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#00FF66] text-[#021A0A] font-display font-black text-xs sm:text-sm shadow-[0_0_18px_rgba(255,215,0,0.6)] hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      🛡️ ৫০০ পয়েন্ট দিয়ে এখনই টিম অ্যাক্টিভ করুন →
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenDeposit(100)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66] text-[#00FF66] font-display font-black text-xs cursor-pointer"
                    >
                      + ৫০০ পয়েন্ট কিনুন (১০০ টাকা)
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-[#00FF66] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      আপনার টিমটি অ্যাপের ভিতর সম্পূর্ণ অ্যাক্টিভ (Active)! এখন ভিডিও লাইভ (২০০ পয়েন্ট) বা বল বাই বল লাইভ (১০০ পয়েন্ট) খেলতে পারবেন।
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onGoVideoLive}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2E93] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                    >
                      🎥 ভিডিও খেলা লাইভ (200 Pts)
                    </button>
                    <button
                      type="button"
                      onClick={onGoBallByBallLive}
                      className="px-3 py-1.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
                    >
                      🏏 বল বাই বল লাইভ (100 Pts)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Squad Composition Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              {
                label: 'মোট খেলোয়াড়',
                val: `${currentTeam.players.length} জন`,
                color: 'text-[#FFD700] border-[#FFD700]/50'
              },
              {
                label: 'ব্যাটসম্যান',
                val: `${
                  currentTeam.players.filter((p) => p.role.includes('ব্যাটসম্যান')).length
                } জন`,
                color: 'text-[#00FF66] border-emerald-500/40'
              },
              {
                label: 'অলরাউন্ডার',
                val: `${
                  currentTeam.players.filter((p) => p.role.includes('অলরাউন্ডার')).length
                } জন`,
                color: 'text-[#00F0FF] border-cyan-500/40'
              },
              {
                label: 'ফাস্ট ও স্পিন বোলার',
                val: `${currentTeam.players.filter((p) => p.role.includes('বোলার')).length} জন`,
                color: 'text-pink-400 border-pink-500/40'
              },
              {
                label: 'গড় বয়স (Age)',
                val: `${
                  currentTeam.players.length > 0
                    ? Math.round(
                        currentTeam.players.reduce((s, p) => s + p.age, 0) /
                          currentTeam.players.length
                      )
                    : 22
                } বছর`,
                color: 'text-amber-300 border-amber-500/40'
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className={`bg-[#072B12] border rounded-xl p-3 text-center ${st.color}`}
              >
                <div className="text-[11px] text-emerald-200 font-semibold">{st.label}</div>
                <div className="text-base sm:text-lg font-mono-num font-black mt-0.5">{st.val}</div>
              </div>
            ))}
          </div>

          {/* Detailed Players List Header + Add Player Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#083016] border border-[#00FF66]/40 rounded-2xl p-3.5">
            <div>
              <h3 className="text-sm sm:text-base font-display font-black text-[#FFD700]">
                📋 টিমের সকল খেলোয়াড়দের বিস্তারিত তালিকা ({currentTeam.players.length} জন)
              </h3>
              <p className="text-xs text-emerald-200">
                কে কোন পজিশনে খেলে, কার কত বয়স, বাড়ি কোথায় এবং কে কেমন খেলোয়াড় তার সম্পূর্ণ প্রোফাইল
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ADD_PLAYER')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ নতুন খেলোয়াড় যোগ করুন</span>
            </button>
          </div>

          {/* Players Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTeam.players.map((pl, index) => (
              <div
                key={pl.id}
                className="bg-gradient-to-br from-[#082E14] via-[#05210E] to-[#031509] border border-[#00FF66]/50 hover:border-[#FFD700] rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Player Number & Jersey Badge */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#FFD700] to-[#D97706] text-[#021A0A] flex flex-col items-center justify-center shrink-0 shadow">
                      <span className="text-[9px] font-bold leading-none">#{index + 1}</span>
                      <span className="text-sm font-mono-num font-black leading-tight">
                        {pl.jerseyNo}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-sm sm:text-base font-display font-black text-white truncate">
                          {pl.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66]/50 text-[#00FF66] text-[10px] font-bold">
                          {pl.role}
                        </span>
                      </div>

                      {/* Age & Home Location */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-100 mt-1">
                        <span className="font-bold text-[#FFD700]">
                          🎂 বয়স: {pl.age} বছর
                        </span>
                        <span className="flex items-center gap-1 text-cyan-200">
                          <MapPin className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                          <span>বাড়ি: {pl.homeVillage}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(pl.id, pl.name)}
                    title="খেলোয়াড় মুছে ফেলুন"
                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* কে কেমন খেলোয়াড় (Player Skill & Quality Box) */}
                <div className="bg-[#021407] border border-emerald-700/60 rounded-xl px-3 py-2 text-xs">
                  <span className="text-[#FFD700] font-bold">🏏 কেমন খেলোয়াড়: </span>
                  <span className="text-white">{pl.playerQuality}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-300 pt-0.5">
                  <span className="flex items-center gap-1 font-mono-num">
                    <Phone className="w-3 h-3 text-[#00FF66]" /> {pl.phone}
                  </span>
                  <span className="text-[#FFD700] font-bold">জার্সি নং #{pl.jerseyNo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: ADD NEW PLAYER TO TEAM FORM (খেলোয়াড়ের নাম, বয়স, বাড়ি কোথায়, কেমন খেলোয়াড়)
         ==================================================================== */}
      {activeTab === 'ADD_PLAYER' && currentTeam && (
        <form
          onSubmit={handleAddPlayerToTeam}
          className="bg-[#083016] border-2 border-[#00FF66] rounded-2xl p-4 sm:p-5 space-y-4 max-w-2xl mx-auto shadow-[0_0_24px_rgba(0,255,102,0.2)]"
        >
          <div className="border-b border-emerald-700/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700]">
                ➕ "{currentTeam.teamName}" টিমে নতুন খেলোয়াড় যোগ করুন
              </h2>
              <p className="text-xs text-emerald-200">
                খেলোয়াড়ের নাম, বয়স কত, তার বাড়ি কোথায় এবং সে কেমন খেলোয়াড় তা নিচে লিখে সেভ করুন
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#021A0A] border border-[#FFD700] text-xs font-mono-num font-bold text-[#FFD700]">
              খেলোয়াড় #{currentTeam.players.length + 1}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                ১. খেলোয়াড়ের নাম (Player Name) *
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="যেমন: তামিম ইকবাল / সোহেল রানা"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                ২. খেলোয়াড়ের বয়স কত (Age) *
              </label>
              <input
                type="number"
                required
                min={10}
                max={65}
                value={playerAge}
                onChange={(e) => setPlayerAge(e.target.value)}
                placeholder="যেমন: 22"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white font-mono-num focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                ৩. তার বাড়ি কোথায় (গ্রাম / এলাকা ও জেলা) *
              </label>
              <input
                type="text"
                required
                value={playerVillage}
                onChange={(e) => setPlayerVillage(e.target.value)}
                placeholder="যেমন: রূপগঞ্জ উত্তরপাড়া, নারায়ণগঞ্জ"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                ৪. খেলোয়াড়ের পজিশন (Role) *
              </label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value as TeamPlayerMember['role'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
              >
                <option value="ওপেনিং ব্যাটসম্যান">ওপেনিং ব্যাটসম্যান (Opening Batsman)</option>
                <option value="মিডল অর্ডার ব্যাটসম্যান">মিডল অর্ডার ব্যাটসম্যান (Middle-Order)</option>
                <option value="ব্যাটিং অলরাউন্ডার">ব্যাটিং অলরাউন্ডার (Batting Allrounder)</option>
                <option value="বোলিং অলরাউন্ডার">বোলিং অলরাউন্ডার (Bowling Allrounder)</option>
                <option value="ফাস্ট বোলার">ফাস্ট বোলার (Fast Bowler)</option>
                <option value="স্পিন বোলার">স্পিন বোলার (Spin Bowler)</option>
                <option value="উইকেটকিপার ব্যাটসম্যান">উইকেটকিপার ব্যাটসম্যান (Wicketkeeper)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFD700] mb-1">
              ৫. কে কেমন খেলোয়াড় (খেলার ধরন ও বিশেষ দক্ষতা বিস্তারিত লিখুন) *
            </label>
            <input
              type="text"
              value={playerQuality}
              onChange={(e) => setPlayerQuality(e.target.value)}
              placeholder="যেমন: ডানহাতি হার্ড-হিটার ব্যাটসম্যান, ডেথ ওভারে ছক্কা মারতে ও ফাস্ট বোলিংয়ে সেরা"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                জার্সি নাম্বার (Jersey No)
              </label>
              <input
                type="number"
                value={playerJersey}
                onChange={(e) => setPlayerJersey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#021A0A] border border-emerald-600 text-xs text-white font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                খেলোয়াড়ের মোবাইল নাম্বার
              </label>
              <input
                type="tel"
                value={playerPhone}
                onChange={(e) => setPlayerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2 rounded-xl bg-[#021A0A] border border-emerald-600 text-xs text-white font-mono-num"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-sm shadow-lg cursor-pointer"
            >
              ✅ টিম তালিকায় খেলোয়াড় সেভ করুন →
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SQUAD')}
              className="px-4 py-3 rounded-xl bg-[#021A0A] border border-white/20 text-white font-bold text-xs cursor-pointer"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      {/* ====================================================================
          TAB 3: CREATE NEW TEAM WITH ID & PIN (নতুন টিম সাজান ও ৫০০ পয়েন্টে অ্যাক্টিভ করুন)
         ==================================================================== */}
      {activeTab === 'CREATE_TEAM' && (
        <div className="bg-[#083016] border-2 border-[#FFD700] rounded-2xl p-4 sm:p-5 space-y-4 max-w-2xl mx-auto shadow-[0_0_24px_rgba(255,215,0,0.2)]">
          <div className="border-b border-emerald-700/60 pb-3">
            <h2 className="text-base sm:text-lg font-display font-black text-[#FFD700]">
              🛡️ আপনার নতুন টিম তৈরি করুন (টিম আইডি ও পিন নাম্বার সহ)
            </h2>
            <p className="text-xs text-emerald-200">
              টিম সাজিয়ে রাখার পর অ্যাপের ভিতর টিমটি অ্যাক্টিভ করতে মিনিমাম ৫০০ পয়েন্ট লাগবে
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">টিমের নাম (Team Name) *</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="যেমন: সোনারগাঁও রয়্যালস একাদশ"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                টিমের গ্রাম / এলাকা (Home Village) *
              </label>
              <input
                type="text"
                value={newVillage}
                onChange={(e) => setNewVillage(e.target.value)}
                placeholder="যেমন: মোগরাপাড়া, সোনারগাঁও"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">জেলা (District)</label>
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">ক্যাপ্টেনের নাম *</label>
              <input
                type="text"
                value={newCaptain}
                onChange={(e) => setNewCaptain(e.target.value)}
                placeholder="ক্যাপ্টেনের নাম"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFD700] mb-1">
                ৪ সংখ্যার গোপন পিন (PIN) *
              </label>
              <input
                type="text"
                maxLength={4}
                value={newPinCode}
                onChange={(e) => setNewPinCode(e.target.value)}
                placeholder="যেমন: 5566"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border-2 border-[#FFD700] text-sm text-[#FFD700] font-mono-num font-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-200 mb-1">ক্যাপ্টেনের মোবাইল নাম্বার</label>
            <input
              type="tel"
              value={newCaptainPhone}
              onChange={(e) => setNewCaptainPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs sm:text-sm text-white font-mono-num"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => handleCreateNewTeam(e, true)}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#00FF66] text-[#021A0A] font-display font-black text-xs sm:text-sm shadow-lg cursor-pointer"
            >
              ⚡ ৫০০ পয়েন্ট দিয়ে টিম তৈরি ও অ্যাক্টিভ করুন
            </button>
            <button
              type="button"
              onClick={(e) => handleCreateNewTeam(e, false)}
              className="py-3 px-4 rounded-xl bg-[#021A0A] border-2 border-[#00FF66] text-[#00FF66] font-display font-black text-xs sm:text-sm cursor-pointer hover:bg-[#0B3B18]"
            >
              📋 আগে টিম সাজিয়ে রাখুন (পরে ৫০০ পয়েন্টে অ্যাক্টিভ)
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: TEAM ID/PIN LOOKUP & POINT SELLING PACKAGES (পয়েন্ট বিক্রি ও পিন রিচার্জ)
         ==================================================================== */}
      {activeTab === 'ID_PIN_STORE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Point Selling Packages (500 / 200 / 100 Points) */}
          <div className="bg-gradient-to-b from-[#0A3818] to-[#041D0B] border-2 border-[#FFD700] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#FFD700] text-[#021A0A] font-display font-black text-[10px]">
                  OFFICIAL POINT STORE
                </span>
                <h3 className="text-base sm:text-lg font-display font-black text-white mt-1">
                  🪙 পয়েন্ট কিনুন (বিকাশ / নগদ ও পিন কার্ড)
                </h3>
                <p className="text-xs text-emerald-200">
                  টিম অ্যাক্টিভ, ভিডিও খেলা লাইভ এবং বল বাই বল লাইভ করার জন্য পয়েন্ট প্যাকেজ
                </p>
              </div>
              <Wallet className="w-8 h-8 text-[#FFD700]" />
            </div>

            <div className="space-y-2.5">
              {[
                {
                  pts: 500,
                  tk: 100,
                  title: '🛡️ টিম অ্যাক্টিভেশন প্যাক (৫০০ পয়েন্ট)',
                  desc: 'অ্যাপের ভিতর আপনার সাজানো টিমটি অফিসিয়ালি অ্যাক্টিভ করতে মিনিমাম ৫০০ পয়েন্ট',
                  badge: 'MOST POPULAR',
                  border: 'border-[#FFD700] bg-[#10401C]'
                },
                {
                  pts: 200,
                  tk: 40,
                  title: '🎥 ভিডিও খেলা লাইভ প্যাক (২০০ পয়েন্ট)',
                  desc: 'মোবাইল ক্যামেরা দিয়ে গ্রামের ক্রিকেট খেলা সরাসরি ভিডিও লাইভ করতে মিনিমাম ২০০ পয়েন্ট',
                  badge: 'VIDEO LIVE',
                  border: 'border-[#FF2E93] bg-[#2B0918]'
                },
                {
                  pts: 100,
                  tk: 20,
                  title: '🏏 বল বাই বল লাইভ প্যাক (১০০ পয়েন্ট)',
                  desc: 'বল বাই বল লাইভ স্কোর ও দুই দলের খেলোয়াড়দের নাম প্রচার করতে মিনিমাম ১০০ পয়েন্ট',
                  badge: 'BALL BY BALL',
                  border: 'border-[#00F0FF] bg-[#062B36]'
                },
                {
                  pts: 1000,
                  tk: 200,
                  title: '👑 অল-ইন-ওয়ান প্রো প্যাক (১০০০ পয়েন্ট)',
                  desc: '১টি টিম অ্যাক্টিভ (৫০০) + ২টি ভিডিও লাইভ (৪০০) + ১টি বল বাই বল লাইভ (১০০)',
                  badge: 'BEST VALUE',
                  border: 'border-[#00FF66] bg-[#093516]'
                }
              ].map((pkg) => (
                <div
                  key={pkg.pts}
                  className={`rounded-xl border-2 p-3.5 flex items-center justify-between gap-3 ${pkg.border}`}
                >
                  <div className="space-y-0.5">
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[#FFD700] font-display font-black text-[9px]">
                      {pkg.badge}
                    </span>
                    <div className="text-sm font-display font-black text-white">{pkg.title}</div>
                    <p className="text-[11px] text-emerald-100 leading-snug">{pkg.desc}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1.5">
                    <div className="text-base font-mono-num font-black text-[#FFD700]">
                      ৳{pkg.tk} টাকা
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenDeposit(pkg.tk)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-md hover:brightness-110"
                    >
                      পয়েন্ট কিনুন →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Point PIN Number Redeem + Team ID/PIN Search */}
          <div className="space-y-4">
            {/* Instant Point PIN Code Recharge */}
            <form
              onSubmit={handleRedeemPointPin}
              className="bg-gradient-to-b from-[#1F0B2E] to-[#062412] border-2 border-[#00F0FF] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg"
            >
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-2.5">
                <KeyRound className="w-6 h-6 text-[#FFD700]" />
                <div>
                  <h3 className="text-sm sm:text-base font-display font-black text-[#FFD700]">
                    🔑 পিন নাম্বার দিয়ে সাথে সাথে পয়েন্ট রিচার্জ (Point PIN Card)
                  </h3>
                  <p className="text-xs text-emerald-200">
                    পয়েন্ট কেনার পর পাওয়া গোপন পিন নাম্বারটি নিচে বসিয়ে পয়েন্ট যোগ করুন
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00F0FF] mb-1">
                  গোপন পয়েন্ট পিন নাম্বার লিখুন (Enter Point PIN):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pointPinInput}
                    onChange={(e) => setPointPinInput(e.target.value)}
                    placeholder="যেমন: PIN500 / PIN200 / PIN100"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#021A0A] border-2 border-[#00F0FF] text-white font-mono-num font-black text-sm uppercase focus:outline-none focus:border-[#FFD700]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer shrink-0"
                  >
                    রিচার্জ করুন
                  </button>
                </div>
              </div>

              {/* Quick Demo Test PIN Buttons */}
              <div className="bg-black/35 border border-white/10 rounded-xl p-2.5 space-y-1.5">
                <div className="text-[11px] text-emerald-300 font-semibold">
                  ⚡ ওয়ান-ক্লিক টেস্ট পিন (ক্লিক করে চেক করুন):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'PIN500', label: 'PIN500 (+৫০০ পয়েন্ট)' },
                    { code: 'PIN200', label: 'PIN200 (+২০০ পয়েন্ট)' },
                    { code: 'PIN100', label: 'PIN100 (+১০০ পয়েন্ট)' },
                    { code: 'PIN1000', label: 'PIN1000 (+১০০০ পয়েন্ট)' }
                  ].map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => setPointPinInput(p.code)}
                      className="px-2.5 py-1 rounded-lg bg-[#0A3A18] hover:bg-[#135426] border border-[#FFD700]/60 text-[11px] font-mono-num font-bold text-[#FFD700] cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Search / Unlock Team by ID & PIN */}
            <form
              onSubmit={handleFindTeamByPin}
              className="bg-[#083016] border border-[#00FF66]/60 rounded-2xl p-4 sm:p-5 space-y-3"
            >
              <h3 className="text-sm font-display font-black text-[#FFD700]">
                🔍 টিম আইডি ও পিন নাম্বার দিয়ে আপনার টিম খুঁজুন
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={searchIdInput}
                  onChange={(e) => setSearchIdInput(e.target.value)}
                  placeholder="টিম আইডি (যেমন: SV-7824)"
                  className="px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num"
                />
                <input
                  type="text"
                  value={searchPinInput}
                  onChange={(e) => setSearchPinInput(e.target.value)}
                  placeholder="পিন নাম্বার (যেমন: 4920)"
                  className="px-3 py-2 rounded-xl bg-[#021A0A] border border-emerald-500 text-xs text-white font-mono-num"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00FF66] text-[#021A0A] font-display font-black text-xs cursor-pointer"
              >
                🔓 টিম ওপেন করুন →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
