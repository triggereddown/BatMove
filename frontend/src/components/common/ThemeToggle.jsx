import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { triggerThemeRipple } from './ThemeRipple';

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    triggerThemeRipple(x, y, isDark);
    
    // Short delay to allow animation to start
    setTimeout(() => {
      toggleTheme();
    }, 100);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative flex items-center w-[48px] h-[26px] rounded-full p-1 transition-all duration-400 no-theme-transition focus:outline-none hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] ${
        isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-gradient-to-r from-blue-300 to-sky-400 border border-transparent hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]'
      }`}
      aria-label="Toggle Theme"
    >
      <div 
        className={`absolute flex justify-center items-center w-[18px] h-[18px] rounded-full bg-white shadow-md no-theme-transition transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark ? 'translate-x-0 rotate-0' : 'translate-x-[22px] rotate-[360deg]'
        }`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </div>
    </button>
  );
};
