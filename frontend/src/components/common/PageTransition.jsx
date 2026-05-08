import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const [cachedChildren, setCachedChildren] = useState(children);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
    } else {
      setCachedChildren(children);
    }
  }, [location, displayLocation, children]);

  const onAnimationEnd = (e) => {
    // Prevent inner animations from triggering this
    if (e.target !== e.currentTarget) return;
    
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
      setCachedChildren(children);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-[var(--accent-primary)] z-[99999] transition-transform duration-300 ease-in-out pointer-events-none origin-left"
        style={{
          transform: transitionStage === 'fadeOut' ? 'scaleX(1)' : 'scaleX(0)'
        }}
      />
      <div
        className={
          transitionStage === "fadeIn" 
            ? "animate-[fadeInPage_0.4s_ease_forwards]" 
            : "animate-[fadeOutPage_0.3s_ease_forwards]"
        }
        onAnimationEnd={onAnimationEnd}
      >
        {transitionStage === 'fadeOut' ? cachedChildren : children}
      </div>
      <style>{`
        @keyframes fadeOutPage {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
};
