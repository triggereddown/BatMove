import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const playIconRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef();

  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    setIsVisible(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, input, textarea, [role="button"]');
      const isPoster = e.target.closest('[data-cursor="play"]');

      if (ringRef.current) {
        if (isPoster) {
          ringRef.current.classList.add('w-[80px]', 'h-[80px]', 'bg-accentPrimary/40');
          ringRef.current.classList.remove('w-9', 'h-9', 'w-[60px]', 'h-[60px]', 'bg-accentPrimary/10');
          if (dotRef.current) dotRef.current.classList.add('opacity-0');
          if (playIconRef.current) playIconRef.current.classList.remove('opacity-0', 'scale-50');
        } else if (isInteractive) {
          ringRef.current.classList.add('w-[60px]', 'h-[60px]', 'bg-accentPrimary/10');
          ringRef.current.classList.remove('w-9', 'h-9', 'w-[80px]', 'h-[80px]', 'bg-accentPrimary/40');
          if (dotRef.current) dotRef.current.classList.remove('opacity-0');
          if (playIconRef.current) playIconRef.current.classList.add('opacity-0', 'scale-50');
        } else {
          ringRef.current.classList.add('w-9', 'h-9');
          ringRef.current.classList.remove('w-[60px]', 'h-[60px]', 'w-[80px]', 'h-[80px]', 'bg-accentPrimary/10', 'bg-accentPrimary/40');
          if (dotRef.current) dotRef.current.classList.remove('opacity-0');
          if (playIconRef.current) playIconRef.current.classList.add('opacity-0', 'scale-50');
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000] bg-[var(--cursor-color)] shadow-glow transition-opacity duration-200" 
      />
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border-2 border-[var(--cursor-color)] rounded-full pointer-events-none z-[9999] transition-[width,height,background-color] duration-250 flex items-center justify-center will-change-transform"
      >
        <div ref={playIconRef} className="opacity-0 scale-50 transition-all duration-300 pointer-events-none text-white ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </>
  );
};
