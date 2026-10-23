import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Bell, Flame, User as UserIcon } from 'lucide-react';
import { User, BroadcastAnnouncement } from '../types';

interface TopStatusBarProps {
  user: User | null;
  announcements: BroadcastAnnouncement[];
  onOpenAnnouncements: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onReplaySplash?: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  user,
  announcements,
  onOpenAnnouncements,
  onOpenAuth,
  onOpenProfile,
  onReplaySplash,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('8:00 PM');
  const activeAnnouncementsCount = announcements.filter(a => a.active).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      setCurrentTime(`${hours}:${strMinutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shrink-0 z-30 bg-[#0D021A]/80 backdrop-blur-xl border-b border-purple-500/20 pt-2 px-4 pb-3">
      {/* Mobile Telephony Status Strip */}
      <div className="flex items-center justify-between text-[11px] font-mono-num text-slate-400 mb-2 px-1">
        <span className="font-semibold tracking-tight text-slate-200">{currentTime}</span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[10px] font-bold tracking-tighter text-[#FF0055]">5G+</span>
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Main Top Header Strip */}
      <div className="flex items-center justify-between gap-3">
        {/* Brand Lockup (Clickable to Replay Splash Intro) */}
        <div 
          onClick={onReplaySplash}
          className="flex items-center gap-2 cursor-pointer group"
          title="Click to replay Intro Splash Animation"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,85,0.5)] border border-white/20 group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-sm text-white tracking-tighter">QP</span>
          </div>
          <div>
            <h1 className="font-display font-black text-base tracking-wider text-white leading-tight">
              QP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-[#c084fc]">COMMUNITY</span>
            </h1>
            <p className="text-[10px] text-purple-300/80 uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:text-purple-200">
              <span>Question Practice Engine</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Streak Indicator (if user logged in) */}
          {user && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span className="font-mono-num">{user.streakDays}d</span>
            </div>
          )}

          {/* Broadcast Announcement Bell with Pulsing Glow */}
          <button
            onClick={onOpenAnnouncements}
            className="relative p-2 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-200 hover:text-white hover:border-[#FF0055]/50 transition-all cursor-pointer"
            aria-label="View Broadcast Announcements"
          >
            <Bell className="w-4 h-4" />
            {activeAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF0055] text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_#FF0055] animate-bounce">
                {activeAnnouncementsCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Toggle */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1 pl-2 pr-2.5 rounded-xl bg-[#16062a] border border-purple-500/40 hover:border-[#FF0055]/60 transition-all cursor-pointer group"
            >
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-6 h-6 rounded-lg object-cover border border-purple-400/40"
              />
              <span className="text-xs font-semibold text-slate-200 max-w-[70px] truncate group-hover:text-white">
                {user.fullName.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] transition-all cursor-pointer active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
