import React, { useState } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  onAdminClick,
  isAdmin,
}) => {
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const toggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-slate-100 z-10 selection:bg-[#FF0055]/30">
      {/* Top Device & Environment Control Bar (Desktop view) */}
      <div className="w-full max-w-6xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-purple-500/15 backdrop-blur-md bg-[#0D021A]/70 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-purple-300 to-[#8A2BE2]">
            QP COMMUNITY
          </span>
          <span className="hidden sm:inline-block text-slate-500 font-mono text-[11px]">
            Question Practice Engine · Flutter / React Native Architecture
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Admin Indicator/Action if already admin */}
          {isAdmin && (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-950/60 text-red-300 border border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF0055]" />
              <span className="font-semibold">Secret Admin Active</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Device Viewport Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-purple-950/50 border border-purple-500/20">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                isMobileFrame
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Frame</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                !isMobileFrame
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wide Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center items-start p-0 sm:py-6 sm:px-4">
        {isMobileFrame ? (
          /* Realistic Flutter / React Native Mobile Device Shell */
          <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[48px] bg-[#0c0218] border-0 sm:border-[8px] sm:border-[#21093a] sm:shadow-[0_0_60px_rgba(138,43,226,0.35),0_0_20px_rgba(255,0,85,0.25)] overflow-hidden flex flex-col transition-all duration-300">
            {/* Top Phone Speaker / Dynamic Island */}
            <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#000000] rounded-b-2xl z-50 items-center justify-center gap-2 border-b border-purple-500/20">
              <div className="w-10 h-1 bg-slate-800 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
            </div>

            {/* Inner Mobile Screen Content */}
            <div className="relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-[#0D021A] via-[#120324] to-[#0A0115]">
              {children}
            </div>

            {/* Bottom Home Indicator Bar (iOS style) */}
            <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full pointer-events-none z-50" />
          </div>
        ) : (
          /* Responsive Wide Layout */
          <div className="w-full max-w-4xl min-h-[820px] rounded-3xl glass-panel-glow overflow-hidden flex flex-col shadow-[0_0_50px_rgba(138,43,226,0.2)]">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
