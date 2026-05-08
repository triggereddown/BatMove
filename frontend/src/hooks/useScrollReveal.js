import { useEffect } from 'react';

export const useScrollReveal = (deps = []) => {
  useEffect(() => {
    let observer;
    
    // Wait for the next frame so DOM is guaranteed to be painted/ready
    const rafId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-reveal]:not(.revealed)');
      
      elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        
        let delay = el.getAttribute('data-reveal-delay') || '0';
        if (el.hasAttribute('data-reveal-stagger')) {
          const groupStagger = el.getAttribute('data-reveal-stagger') || 50;
          delay = String(index * parseInt(groupStagger));
        }
        
        el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
      });

      observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('revealed');
            
            // Re-apply styles inline just in case
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            
            // Unobserve to trigger only once
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.15 });

      elements.forEach(el => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
