import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiStar } from 'react-icons/fi';
import { getImageUrl, formatRating, getYear } from '../../utils/helpers';
import { addFavorite, removeFavorite } from '../../features/favorites/favoritesSlice';
import toast from 'react-hot-toast';

const MovieCard = ({ movie, mediaType = 'movie' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const [shineStyle, setShineStyle] = useState({ opacity: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [particles, setParticles] = useState([]);

  const tmdbId = String(movie.id);
  const isFavorited = favorites.some((fav) => String(fav.tmdbId) === tmdbId);

  const handleCardClick = () => {
    navigate(`/${mediaType}/${tmdbId}`);
  };

  const fireParticles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.width / 2;
    const startY = rect.height / 2;
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: startX,
      y: startY,
      angle: (i * 360) / 5,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 600);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Login to add favorites');
    
    if (isFavorited) {
      dispatch(removeFavorite(tmdbId));
      toast.success('Removed from favorites');
    } else {
      fireParticles(e);
      dispatch(addFavorite({
        tmdbId,
        title: movie.title || movie.name,
        posterPath: movie.poster_path,
        mediaType
      }));
      toast.success('Added to favorites');
    }
  };

  const title = movie.title || movie.name;
  const rating = movie.vote_average || 0;
  const releaseDate = movie.release_date || movie.first_air_date;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    // Skip 3D effect on mobile for performance
    if (window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
    });
    
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setShineStyle({
      background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.15), transparent 60%)`,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    setTiltStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
    setShineStyle({ opacity: 0 });
  };

  const ratingClass = rating >= 8 ? 'animate-[pulse_2s_infinite]' : '';

  return (
    <div 
      ref={cardRef}
      className="group rounded-xl cursor-pointer bg-bgCard border border-borderLayer hover:shadow-[var(--shadow-card)] hover:border-textSecondary/30 hover:after:opacity-100 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:shadow-[0_0_30px_rgba(229,9,20,0.15)] after:pointer-events-none after:opacity-0 after:transition-opacity after:duration-500 will-change-transform"
      style={{
        ...tiltStyle,
        transition: tiltStyle.transform.includes('rotateX(0deg)') ? 'transform 0.5s ease-out' : 'none',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      id={`movie-${tmdbId}`}
      data-cursor="play"
    >
      <div 
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay transition-opacity duration-300 rounded-xl"
        style={shineStyle}
      />
      
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl" style={{ transform: 'translateZ(20px)' }}>
        <img
          src={getImageUrl(movie.poster_path)}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 ${imgLoaded ? 'scale-100 blur-0' : 'scale-110 blur-xl opacity-50'} group-hover:scale-105`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = '/placeholder.jpg'; setImgLoaded(true); }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-between items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            className={`relative w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors duration-250 z-20 ${isFavorited ? 'bg-accentPrimary text-white shadow-glow' : 'bg-black/60 text-textPrimary hover:bg-accentPrimary hover:text-white'}`}
            onClick={handleFavoriteClick}
            aria-label="Toggle Favorite"
          >
            <FiHeart className={isFavorited ? 'fill-current transform scale-110' : ''} />
            
            {/* Particles */}
            {particles.map(p => (
              <FiHeart 
                key={p.id}
                className="absolute text-accentPrimary pointer-events-none w-3 h-3 fill-current"
                style={{
                  animation: `particleBurst 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards`,
                  ['--angle']: `${p.angle}deg`
                }}
              />
            ))}
          </button>
        </div>
        {rating > 0 && (
          <div className={`absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-md font-mono text-[0.78rem] font-bold text-accentSecondary flex items-center gap-1 z-20 ${ratingClass}`}>
            <FiStar className="fill-current" /> {formatRating(rating)}
          </div>
        )}
      </div>
      <div className="p-3" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="text-[0.95rem] font-semibold truncate mb-0.5" title={title}>{title}</h3>
        {releaseDate && (
          <p className="text-[0.8rem] text-textMuted font-mono">{getYear(releaseDate)}</p>
        )}
      </div>

      <style>{`
        @keyframes particleBurst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--angle)) translateY(-25px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
