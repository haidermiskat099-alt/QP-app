import React from 'react';

export const AuraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0D021A]">
      {/* Primary Red Glowing Aura Orb (Top-Right / Center-Right) */}
      <div 
        className="absolute -top-[15%] right-[-10%] w-[520px] h-[520px] rounded-full blur-[140px] opacity-45 mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, #FF0055 0%, rgba(255, 0, 85, 0.4) 45%, transparent 70%)',
          animationDuration: '9s',
        }}
      />

      {/* Primary Deep Violet / Purple Glowing Aura Orb (Center-Left / Mid) */}
      <div 
        className="absolute top-[25%] -left-[15%] w-[580px] h-[580px] rounded-full blur-[160px] opacity-50 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, rgba(138, 43, 226, 0.45) 50%, transparent 75%)',
        }}
      />

      {/* Secondary Magenta-Red Radiant Aura (Bottom-Center) */}
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9d00ff 0%, #FF0055 40%, transparent 70%)',
        }}
      />

      {/* Subtle Micro-Grid & Glass Sparkle Layer */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette Rim Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D021A] via-transparent to-[#0D021A]/80 pointer-events-none" />
    </div>
  );
};
