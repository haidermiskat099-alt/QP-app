import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Diamond, Zap, Terminal, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Sequence stages:
  // stage 0: Intro text "Welcome to Question Practice Community"
  // stage 1: Reveal team credits with dark red-purple glassmorphism
  // stage 2: Ready to enter
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Stage 0 -> Stage 1 transition after 1.8 seconds
    const timer1 = setTimeout(() => {
      setStage(1);
      sounds.playTap();
    }, 1800);

    // Stage 1 -> Stage 2 (auto-enter prompt) after 4.8 seconds
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 4800);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 70);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  const handleEnter = () => {
    sounds.playCorrect();
    onFinish();
  };

  const teamCredits = [
    {
      role: 'Owner',
      name: 'Haider',
      icon: Crown,
      glowColor: '#FF0055',
      badgeClass: 'border-[#FF0055]/50 bg-red-950/40 text-red-200 shadow-[0_0_15px_rgba(255,0,85,0.35)]',
      iconClass: 'text-[#FF0055]',
      subtitle: 'Vision & Community Governance'
    },
    {
      role: 'Co-founder',
      name: 'Aritra',
      icon: Diamond,
      glowColor: '#8A2BE2',
      badgeClass: 'border-purple-500/50 bg-purple-950/40 text-purple-200 shadow-[0_0_15px_rgba(138,43,226,0.35)]',
      iconClass: 'text-[#8A2BE2]',
      subtitle: 'Curriculum & Question Analytics'
    },
    {
      role: 'CEO',
      name: 'Ranbir',
      icon: Zap,
      glowColor: '#ec4899',
      badgeClass: 'border-pink-500/50 bg-pink-950/40 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.35)]',
      iconClass: 'text-pink-400',
      subtitle: 'Strategy & Community Growth'
    },
    {
      role: 'IT Head',
      name: 'Gentleman',
      icon: Terminal,
      glowColor: '#a855f7',
      badgeClass: 'border-violet-500/50 bg-violet-950/40 text-violet-200 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      iconClass: 'text-violet-400',
      subtitle: 'Architecture & Engine Infrastructure'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D021A] overflow-hidden select-none animate-fadeIn">
      {/* Blurry Red and Purple Aura Orbs */}
      <div 
        className="absolute top-[10%] -left-[10%] w-[550px] h-[550px] rounded-full blur-[160px] opacity-60 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, rgba(138, 43, 226, 0.4) 50%, transparent 70%)',
        }}
      />
      <div 
        className="absolute bottom-[10%] -right-[10%] w-[550px] h-[550px] rounded-full blur-[160px] opacity-55 mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, #FF0055 0%, rgba(255, 0, 85, 0.4) 50%, transparent 70%)',
          animationDuration: '6s',
        }}
      />

      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-[36px] glass-panel-glow border border-purple-500/35 shadow-[0_0_60px_rgba(255,0,85,0.35)] flex flex-col items-center text-center space-y-6">
        {/* Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF0055] via-purple-600 to-[#8A2BE2] flex items-center justify-center shadow-[0_0_35px_#FF0055] border-2 border-white/30 animate-pulse">
            <span className="font-display font-black text-3xl text-white tracking-wider">
              QP
            </span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF0055] flex items-center justify-center shadow-[0_0_10px_#FF0055]">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* SEQUENCE STEP 1: "Welcome to Question Practice Community" */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight glow-text-red transition-all duration-700">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-purple-300 to-[#8A2BE2]">
              Question Practice Community
            </span>
          </h1>
          <p className="text-xs text-purple-300/80 font-medium tracking-wide">
            Next-Gen Competitive Test Preparation & Speed Mastery
          </p>
        </div>

        {/* SEQUENCE STEP 2: Immediately reveal Team Credits in Dark Red-Purple Glassmorphism */}
        {stage >= 1 && (
          <div className="w-full space-y-3 animate-slideDown">
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FF0055]/60" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF0055] font-display">
                Leadership & Core Team
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#8A2BE2]/60" />
            </div>

            {/* 4 Team Member Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              {teamCredits.map((member, idx) => {
                const Icon = member.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl glass-panel border transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 ${member.badgeClass}`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${idx * 0.15}s both`,
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        boxShadow: `0 0 12px ${member.glowColor}40`,
                      }}
                    >
                      <Icon className={`w-5 h-5 ${member.iconClass}`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          {member.role}
                        </span>
                        <span className="text-slate-500">·</span>
                        <h3 className="text-sm font-bold text-white truncate">
                          {member.name}
                        </h3>
                      </div>
                      <p className="text-[10px] text-purple-300/80 truncate">
                        {member.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress Bar & Enter Action */}
        <div className="w-full space-y-3 pt-2">
          <div className="w-full h-1.5 rounded-full bg-purple-950/80 overflow-hidden border border-purple-500/20">
            <div 
              className="h-full bg-gradient-to-r from-[#FF0055] via-purple-500 to-[#8A2BE2] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={handleEnter}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(255,0,85,0.5)] hover:shadow-[0_0_35px_rgba(255,0,85,0.8)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter QP Community</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
