import { useEffect } from 'react';
import { FiX, FiVideoOff } from 'react-icons/fi';
import ReactPlayer from 'react-player/youtube';

const TrailerModal = ({ trailerKey, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div className="relative w-full max-w-[900px]" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute -top-[45px] right-0 text-white w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors duration-250 hover:bg-accentPrimary z-10"
          onClick={onClose}
          aria-label="Close trailer"
        >
          <FiX size={24} />
        </button>

        {trailerKey ? (
          <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-modal bg-black">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              playing
              controls
              config={{ youtube: { playerVars: { origin: window.location.origin } } }}
            />
          </div>
        ) : (
          <div className="text-center py-16 px-8 bg-bgCard rounded-2xl border border-borderLayer shadow-modal">
            <FiVideoOff className="text-5xl text-textMuted mx-auto mb-4" />
            <h3 className="font-heading text-2xl tracking-wide mb-2 text-textPrimary">Trailer Unavailable</h3>
            <p className="text-textSecondary">We couldn't find a trailer for this title.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
