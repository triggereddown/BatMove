import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const triggerThemeRipple = (x, y, isDark) => {
  const event = new CustomEvent('theme-ripple-trigger', { detail: { x, y, isDark } });
  window.dispatchEvent(event);
};

export const ThemeRipple = () => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleTrigger = (e) => {
      const { x, y, isDark } = e.detail;
      const targetColor = isDark ? '#f5f5f7' : '#0a0a0f';
      const id = Date.now();
      
      setRipples(prev => [...prev, { id, x, y, color: targetColor }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 650);
    };

    window.addEventListener('theme-ripple-trigger', handleTrigger);
    return () => window.removeEventListener('theme-ripple-trigger', handleTrigger);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 0,
            height: 0,
            backgroundColor: r.color,
            transform: 'translate(-50%, -50%)',
            animation: 'themeRippleAnim 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        />
      ))}
    </div>,
    document.body
  );
};

ThemeRipple.displayName = 'ThemeRipple';

