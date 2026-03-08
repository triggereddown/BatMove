import React from 'react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`flex items-center justify-center py-16 ${fullScreen ? 'min-h-[60vh]' : ''}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex justify-center items-center">
          <div className="w-10 h-10 border-[3px] border-borderLayer border-t-accentPrimary rounded-full animate-spin"></div>
          <div className="w-7 h-7 border-[3px] border-borderLayer border-t-accentPrimary rounded-full animate-spin absolute" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-4 h-4 border-[3px] border-borderLayer border-t-accentPrimary rounded-full animate-spin absolute" style={{ animationDelay: '0.3s' }}></div>
        </div>
        <p className="text-textMuted text-sm mt-3">Loading content...</p>
      </div>
    </div>
  );
};

export default Loader;
