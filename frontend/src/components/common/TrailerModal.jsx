import { useEffect, useState } from 'react';
import { FiX, FiVideoOff } from 'react-icons/fi';
import ReactPlayer from 'react-player/youtube';
import { getBackdropUrl } from '../../utils/helpers';

const TrailerModal = ({ trailerKey, onClose, movie }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Slight delay for entrance animation frame
    requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const bgImage = movie?.backdrop_path || movie?.poster_path;

  return (
    <div 
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden transition-all duration-400`}
      onClick={handleClose}
    >
      {/* Blurred Backdrop */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${isClosing ? 'opacity-0' : (isVisible ? 'opacity-100' : 'opacity-0')}`}
        style={{ 
          backgroundImage: bgImage ? `url(${getBackdropUrl(bgImage)})` : 'none',
          filter: 'blur(40px) brightness(0.4)',
          transform: 'scale(1.1)'
        }} 
      />
      <div className="absolute inset-0 bg-[var(--overlay)] mix-blend-multiply" />

      <div 
        className={`relative w-full max-w-[1000px] my-auto transition-all ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${isClosing ? 'opacity-0 scale-90 duration-250' : (isVisible ? 'opacity-100 scale-100 duration-400' : 'opacity-0 scale-[0.85]')}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-heading text-2xl md:text-3xl text-white tracking-wider truncate">
            {movie?.title || movie?.name || 'TRAILER'}
          </h2>
          <button 
            className="group relative text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 hover:text-accentPrimary"
            onClick={handleClose}
            aria-label="Close trailer"
          >
            <svg 
              className="w-10 h-10 absolute inset-0 -rotate-90 stroke-[var(--border-strong)] transition-all duration-500 rounded-full group-hover:stroke-accentPrimary"
              viewBox="0 0 100 100"
              fill="transparent"
            >
              <circle cx="50" cy="50" r="48" strokeWidth="4" strokeDasharray="301" strokeDashoffset="301" className="transition-all duration-500 ease-out group-hover:stroke-dashoffset-0" />
            </svg>
            <FiX size={24} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90 z-10" />
          </button>
        </div>

        {trailerKey ? (
          <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-[var(--shadow-modal)] bg-black ring-1 ring-white/10">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              playing
              controls
              config={{ youtube: { playerVars: { origin: window.location.origin, modestbranding: 1, rel: 0 } } }}
            />
          </div>
        ) : (
          <div className="text-center py-20 px-8 bg-glass backdrop-blur-xl rounded-2xl border border-borderLayer shadow-modal">
            <FiVideoOff className="text-6xl text-textMuted mx-auto mb-6 opacity-50" />
            <h3 className="font-heading text-3xl tracking-wide mb-3 text-textPrimary">Trailer Unavailable</h3>
            <p className="text-textSecondary text-lg">We couldn't find a trailer for this title.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
