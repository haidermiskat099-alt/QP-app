import React from 'react';
import { Compass, Zap, Trophy, ShieldCheck, User, MessageSquare, Youtube } from 'lucide-react';
import { sounds } from '../utils/audio';

export type TabType = 'home' | 'practice' | 'chat' | 'youtube' | 'leaderboard' | 'admin' | 'profile';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isAdmin: boolean;
  unreadChatCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  isAdmin,
  unreadChatCount = 0,
}) => {
  interface TabItem {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Quizzes', icon: Compass },
    { id: 'practice', label: 'Drills', icon: Zap },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadChatCount > 0 ? `${unreadChatCount}` : undefined },
    { id: 'youtube', label: 'Edu Video', icon: Youtube },
    { id: 'leaderboard', label: 'Top 5', icon: Trophy },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: isAdmin ? '4' : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSelect = (tab: TabType) => {
    sounds.playTap();
    onChangeTab(tab);
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="shrink-0 z-30 bg-[#0c0218]/95 backdrop-blur-2xl border-t border-purple-500/25 px-1 py-1.5"
    >
      <div className="grid grid-cols-7 items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id as TabType)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Glow Pill Indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF0055]/20 via-[#8A2BE2]/25 to-[#FF0055]/20 rounded-xl border border-[#FF0055]/40 shadow-[0_0_12px_rgba(255,0,85,0.3)] animate-fadeIn" />
              )}

              {/* Icon Container with subtle glow */}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#FF0055] drop-shadow-[0_0_6px_#FF0055]' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-bold bg-[#FF0055] text-white shadow-[0_0_6px_#FF0055]">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-medium tracking-tight mt-0.5 truncate transition-colors whitespace-nowrap shrink-0 ${
                  isActive ? 'font-bold text-white' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
