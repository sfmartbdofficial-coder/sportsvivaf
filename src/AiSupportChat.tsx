import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  X,
  Headphones,
  Wallet,
  Radio,
  Video,
  Users,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
  isError?: boolean;
}

const QUICK_QUESTIONS = [
  '🪙 পয়েন্ট কিভাবে কিনবো ও কত টাকা লাগে?',
  '🏏 আমার টিম ও পিন নাম্বার কিভাবে তৈরি করবো?',
  '📹 গ্রামের খেলা ভিডিও লাইভ করার নিয়ম কী?',
  '🔴 বল বাই বল লাইভ স্কোরিং কিভাবে করবো?',
  '📱 পয়েন্ট দিয়ে মোবাইল রিচার্জ কিভাবে করবো?',
  '🔑 লগইন করার নিয়ম কী?'
];

const INITIAL_WELCOME_MESSAGE: AiChatMessage = {
  id: 'welcome-msg',
  role: 'model',
  text: 'আসসালামু আলাইকুম! 👋 স্বাগতম Live Support Chat-এ।\nআপনার যেকোনো সমস্যা বা প্রশ্ন এখানে বাংলায় বা ইংরেজিতে লিখুন—সাথে সাথে সমাধান দিয়ে দেবো!',
  time: 'এইমাত্র'
};

function cleanSupportText(raw: string): string {
  return String(raw || '')
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*([^\s*])/g, '$1• $2')
    .replace(/\*+/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/SportsViva\s+AI\s+Support\s+Assistant/gi, 'Live Support Chat')
    .replace(/SportsViva\s+AI\s+Live\s+Support/gi, 'Live Support Chat')
    .replace(/SportsViva\s+AI/gi, 'Live Support Chat')
    .replace(/AI\s+Live\s+Support/gi, 'Live Support Chat')
    .replace(/AI\s+Support/gi, 'Live Support Chat')
    .replace(/\bAI\b/g, 'Live Support')
    .replace(/এআই\s*লাইভ\s*সাপোর্ট/g, 'লাইভ সাপোর্ট চ্যাট')
    .replace(/এআই\s*সাপোর্ট/g, 'লাইভ সাপোর্ট')
    .replace(/এআই/g, 'লাইভ সাপোর্ট')
    .trim();
}

export interface AiSupportChatProps {
  userName?: string;
  points: number;
  activeTeamsCount: number;
  onOpenDeposit: () => void;
  onNavigate?: (page: 'MY_TEAM' | 'LIVE_VIDEO' | 'GOLIVE' | 'STORE' | 'SUPPORT') => void;
  compact?: boolean;
}

export const AiSupportChatPanel: React.FC<AiSupportChatProps> = ({
  userName,
  points,
  activeTeamsCount,
  onOpenDeposit,
  onNavigate,
  compact = false
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory
            .filter((m) => !m.isError && m.id !== 'welcome-msg')
            .slice(-8)
            .map((m) => ({ role: m.role, text: m.text })),
          userContext: {
            name: userName || 'SportsViva User',
            points,
            activeTeamsCount
          }
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errText = cleanSupportText(
          data.error || 'সার্ভার থেকে এই মুহূর্তে উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
        );
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: errText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `support-${Date.now()}`,
            role: 'model',
            text: cleanSupportText(data.reply),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: 'সংযোগ সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-[#00FF66] bg-gradient-to-b from-[#062E14] via-[#041F0D] to-[#021207] shadow-[0_0_28px_rgba(0,255,102,0.3)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A481E] via-[#0E5E27] to-[#083817] border-b border-[#00FF66]/50 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#00FF66] p-0.5 shadow-[0_0_12px_rgba(255,215,0,0.6)] shrink-0">
            <div className="w-full h-full rounded-[10px] bg-[#021A0A] flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#FFD700]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00FF66] border-2 border-[#021A0A] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-display font-black text-[#FFD700] leading-none">
                LIVE SUPPORT CHAT
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] font-display font-black text-[9px]">
                24/7 ONLINE
              </span>
            </div>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              যেকোনো সমস্যা বা প্রশ্ন লিখুন — সাথে সাথে সমাধান পান
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages([INITIAL_WELCOME_MESSAGE])}
          title="চ্যাট রিসেট করুন"
          className="px-2.5 py-1.5 rounded-lg bg-[#021A0A]/80 border border-emerald-500/40 text-emerald-200 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">নতুন চ্যাট</span>
        </button>
      </div>

      {/* Quick Action Bar for Instant Solutions */}
      <div className="bg-[#031A0A] border-b border-emerald-800/70 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={onOpenDeposit}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-[#021A0A] font-display font-black text-[10px] shrink-0 flex items-center gap-1 cursor-pointer shadow"
        >
          <Wallet className="w-3 h-3" />
          + পয়েন্ট কিনুন ({points} Pts)
        </button>
        {onNavigate && (
          <>
            <button
              type="button"
              onClick={() => onNavigate('MY_TEAM')}
              className="px-2.5 py-1 rounded-lg bg-[#0A3A18] border border-[#00FF66]/50 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 hover:border-[#FFD700] cursor-pointer"
            >
              <Users className="w-3 h-3 text-[#00FF66]" />
              আমার টিম (500 Pts)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('LIVE_VIDEO')}
              className="px-2.5 py-1 rounded-lg bg-[#0A3A18] border border-red-400/50 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 hover:border-[#FFD700] cursor-pointer"
            >
              <Video className="w-3 h-3 text-red-400" />
              ভিডিও লাইভ (200 Pts)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('GOLIVE')}
              className="px-2.5 py-1 rounded-lg bg-[#0A3A18] border border-amber-400/50 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 hover:border-[#FFD700] cursor-pointer"
            >
              <Radio className="w-3 h-3 text-[#FFD700]" />
              বল বাই বল (100 Pts)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('STORE')}
              className="px-2.5 py-1 rounded-lg bg-[#0A3A18] border border-cyan-400/50 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 hover:border-[#FFD700] cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 text-cyan-300" />
              মোবাইল রিচার্জ ও স্টোর
            </button>
          </>
        )}
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatScrollRef}
        className={`p-3.5 space-y-3 overflow-y-auto ${
          compact ? 'h-[290px] sm:h-[330px]' : 'h-[340px] sm:h-[400px]'
        } bg-[#021408]/90`}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#021A0A] font-bold rounded-br-xs shadow-[0_2px_12px_rgba(0,255,102,0.25)]'
                    : msg.isError
                    ? 'bg-red-950/90 border border-red-500 text-red-100 rounded-bl-xs'
                    : 'bg-[#093516] border border-[#00FF66]/40 text-white rounded-bl-xs shadow-md'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-display font-black text-[#FFD700] mb-1">
                    {msg.isError ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-red-300">Live Support Chat</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>Live Support Chat</span>
                      </>
                    )}
                  </div>
                )}
                <div>{isUser ? msg.text : cleanSupportText(msg.text)}</div>
              </div>
              <span className="text-[9px] text-emerald-400/80 mt-0.5 px-1">{msg.time}</span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-[#093516] border border-[#00FF66]/40 rounded-2xl rounded-bl-xs px-4 py-2.5 text-xs text-emerald-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#00FF66] animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-bounce [animation-delay:300ms]" />
              <span className="ml-1 font-bold text-[#FFD700]">Live Support লিখছে...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Preset Question Chips */}
      <div className="bg-[#041F0C] border-t border-emerald-800/80 px-3 py-2">
        <div className="text-[10px] font-bold text-[#FFD700] mb-1.5">
          💡 এক ক্লিকে প্রশ্ন করুন (Quick Questions):
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-[#083817] hover:bg-[#0E5223] border border-[#00FF66]/40 text-[11px] text-emerald-100 hover:text-[#FFD700] font-semibold shrink-0 transition-all cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="bg-[#021207] border-t border-[#00FF66]/40 p-2.5 sm:p-3 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="আপনার যেকোনো সমস্যা বা প্রশ্ন এখানে লিখুন..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#072B12] border border-[#00FF66]/60 text-xs sm:text-sm text-white placeholder:text-emerald-300/60 focus:outline-none focus:border-[#FFD700]"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>পাঠান</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export const FloatingAiSupportWidget: React.FC<AiSupportChatProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button (Bottom Right above nav) */}
      <div className="fixed bottom-20 right-3 sm:right-5 z-40 flex flex-col items-end gap-2">
        {/* Floating Live Support Chat Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#052E16] via-[#0B5D27] to-[#052E16] border-2 border-[#FFD700] text-white shadow-[0_0_22px_rgba(0,255,102,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00FF66] border border-[#021A0A]" />
          </span>

          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#00FF66] flex items-center justify-center text-[#021A0A] shadow">
            {isOpen ? <X className="w-4 h-4 stroke-[2.8]" /> : <MessageSquare className="w-4 h-4 stroke-[2.5]" />}
          </div>

          <div className="text-left leading-tight pr-0.5">
            <div className="text-[11px] sm:text-xs font-display font-black text-[#FFD700] flex items-center gap-1">
              <span>Live Support Chat</span>
              <Sparkles className="w-3 h-3 text-[#00FF66]" />
            </div>
            <div className="text-[9px] text-emerald-100 font-semibold">২৪/৭ সমস্যা ও সমাধান</div>
          </div>
        </button>
      </div>

      {/* Floating Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between bg-[#021A0A] border-2 border-b-0 border-[#FFD700] rounded-t-2xl px-4 py-2">
              <div className="flex items-center gap-2 text-xs font-display font-black text-[#FFD700]">
                <Headphones className="w-4 h-4 text-[#00FF66]" />
                <span>LIVE SUPPORT CHAT</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>বন্ধ করুন</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <AiSupportChatPanel
              {...props}
              compact
              onNavigate={(targetPage) => {
                if (props.onNavigate) {
                  props.onNavigate(targetPage);
                }
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
