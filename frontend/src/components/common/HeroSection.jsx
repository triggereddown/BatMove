import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import TrailerModal from './TrailerModal';
import { getBackdropUrl, extractTrailerKey, truncateText, getYear } from '../../utils/helpers';

const HeroSection = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (bgRef.current) {
          const scrollY = window.scrollY;
          // Apply parallax only if in view
          if (scrollY < window.innerHeight) {
            bgRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current || window.innerWidth < 768) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // limit range for subtle effect
    const limitedX = 40 + (x * 0.2);
    const limitedY = 40 + (y * 0.2);
    
    setMousePos({ x: limitedX, y: limitedY });
  };

  const MagneticButton = ({ children, onClick, className }) => {
    const btnRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseBtnMove = (e) => {
      if (!btnRef.current || window.innerWidth < 768) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x*x + y*y);
      const maxDist = 50;
      if (distance < maxDist) {
        setPos({ x: (x / maxDist) * 8, y: (y / maxDist) * 8 });
      } else {
        setPos({ x: 0, y: 0 });
      }
    };

    const handleMouseBtnLeave = () => setPos({ x: 0, y: 0 });

    return (
      <button 
        ref={btnRef}
        className={`${className} transition-transform duration-200 ease-out`}
        onClick={onClick}
        onMouseMove={handleMouseBtnMove}
        onMouseLeave={handleMouseBtnLeave}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        {children}
      </button>
    );
  };

  if (!movie) return <div className="min-h-[75vh] md:min-h-[85vh] bg-bgSecondary skeleton-shimmer"></div>;

  const title = movie.title || movie.name;
  const overview = truncateText(movie.overview, 180);
  const releaseDate = movie.release_date || movie.first_air_date;
  const rating = movie.vote_average;
  const isTV = Boolean(movie.name);
  const trailerKey = extractTrailerKey(movie.videos);



  return (
    <div 
      ref={heroRef}
      className="relative w-full min-h-[75vh] md:min-h-[85vh] overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {/* Background with Parallax */}
      <div 
        ref={bgRef}
        className="absolute top-[-10vh] left-0 right-0 bottom-[-10vh] bg-cover bg-center bg-no-repeat will-change-transform" 
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
      />
      
      {/* Dynamic Overlay */}
      <div 
        className="absolute inset-0 flex items-end md:items-center px-[4%] md:px-[6%] pb-10 md:pb-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(10,10,15,0.4) 40%, var(--bg-primary) 100%)`
        }}
      />
      {/* Fallback solid overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/80 to-transparent md:bg-gradient-to-r md:from-bgPrimary/95 md:via-bgPrimary/60 md:to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-[4%] flex items-center h-full pt-20">
        <div className="max-w-[700px] md:pt-16">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl leading-[1.05] tracking-wide mb-4 text-white flex flex-wrap gap-x-3 overflow-hidden">
            {title.split(' ').map((word, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 animate-[heroSlideUp_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]" 
                style={{ animationDelay: `${0.1 + (i * 0.08)}s` }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 flex-wrap opacity-0 animate-[heroFadeIn_0.8s_ease_0.6s_forwards]">
            {rating > 0 && (
              <span className="flex items-center gap-1.5 text-accentSecondary font-mono font-bold text-lg animate-[heroPulse_2s_ease_1s_1]">
                <FiStar className="fill-current" /> {rating.toFixed(1)} / 10
              </span>
            )}
            {releaseDate && (
              <span className="text-textSecondary text-[0.95rem] py-0.5 px-2.5 border border-borderLayer rounded-md">
                {getYear(releaseDate)}
              </span>
            )}
            <span className="text-textSecondary text-[0.95rem] py-0.5 px-2.5 border border-borderLayer rounded-md uppercase tracking-wider text-xs">
              {isTV ? 'TV Series' : 'Movie'}
            </span>
          </div>
          
          <p className="text-textSecondary text-[1.05rem] leading-relaxed mb-6 hidden md:block opacity-0 animate-[heroFadeIn_0.8s_ease_0.8s_forwards]">
            {overview}
          </p>

          <div className="flex gap-4 flex-wrap opacity-0 animate-[heroFadeIn_0.8s_ease_1s_forwards]">
            <MagneticButton className="btn btn-base btn-primary" onClick={() => setShowTrailer(true)}>
              <FiPlay className="fill-current" /> Watch Trailer
            </MagneticButton>
            <MagneticButton className="btn btn-base btn-ghost" onClick={() => navigate(`/${isTV ? 'tv' : 'movie'}/${movie.id}`)}>
              <FiInfo /> More Info
            </MagneticButton>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal 
          trailerKey={trailerKey} 
          onClose={() => setShowTrailer(false)} 
          movie={movie}
        />
      )}

      <style>{`
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heroPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); text-shadow: 0 0 10px rgba(245,166,35,0.6); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
