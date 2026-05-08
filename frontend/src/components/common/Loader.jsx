import React from 'react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`flex items-center justify-center py-16 ${fullScreen ? 'min-h-[60vh]' : ''}`}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 animate-[spin_2s_linear_infinite]">
          {/* Outer rim with film holes (dashed) */}
          <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-textSecondary opacity-40 box-border" />
          {/* Inner rim */}
          <div className="absolute inset-[6px] rounded-full border-[3px] border-textSecondary opacity-50" />
          {/* Spokes */}
          <div className="absolute top-1/2 left-1/2 w-12 h-[3px] bg-textSecondary opacity-50 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-12 h-[3px] bg-textSecondary opacity-50 -translate-x-1/2 -translate-y-1/2 rotate-60" />
          <div className="absolute top-1/2 left-1/2 w-12 h-[3px] bg-textSecondary opacity-50 -translate-x-1/2 -translate-y-1/2 -rotate-60" />
          {/* Center axis */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-bgPrimary border-[2px] border-textSecondary rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Accent loading sweep */}
          <div className="absolute inset-[-2px] rounded-full border-[4px] border-transparent border-t-accentPrimary blur-[1px] animate-[spin_1s_ease-in-out_infinite]" />
        </div>
        <p className="text-textMuted text-xs mt-2 animate-pulse font-mono tracking-widest uppercase relative after:content-['...'] after:absolute">Loading</p>
      </div>
    </div>
  );
};

export default Loader;
