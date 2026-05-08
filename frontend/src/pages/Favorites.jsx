import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { fetchFavorites, removeFavorite } from '../features/favorites/favoritesSlice';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.favorites);

  useScrollReveal([items, loading]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = (tmdbId, title) => {
    dispatch(removeFavorite(tmdbId));
    toast.success(`Removed "${title}" from favorites`);
  };

  const handleCardClick = (item) => {
    const route = item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`;
    navigate(route);
  };

  if (loading && items.length === 0) return <Loader fullScreen />;

  return (
    <div className="page-container" id="favorites-page">
      <div className="mb-8 pt-4" data-reveal="true">
        <h1 className="relative mb-3 font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <FiHeart className="text-accentPrimary mr-4" />
          <span className="inline-flex">
            {'MY FAVORITES'.split('').map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 reveal-char"
                style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Your personal collection of favorite movies and shows</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 px-8 text-textMuted flex flex-col items-center opacity-0 animate-[heroFadeIn_0.8s_ease_0.5s_forwards]">
          <div className="relative w-24 h-24 mb-6">
            <svg viewBox="0 0 24 24" className="w-full h-full stroke-[var(--border-strong)] fill-none">
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                strokeDasharray="100" 
                strokeDashoffset="100" 
                strokeWidth="1"
                className="animate-[drawHeart_2s_ease_forwards_infinite_alternate]"
              />
              <path 
                d="M12 4 L10 10 L14 16 L12 21" 
                strokeDasharray="40" 
                strokeDashoffset="40" 
                strokeWidth="1"
                className="animate-[drawHeart_1.5s_ease_forwards_infinite_alternate_0.5s]"
              />
            </svg>
          </div>
          <h3 className="font-heading text-2xl text-textSecondary mb-2">You haven't added any favorites yet.</h3>
          <p className="mb-6">Browse movies and TV shows to add them to your favorites!</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/movies')}>
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {items.map((item, index) => (
            <div 
              key={item._id} 
              className="bg-bgCard border border-borderLayer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-textSecondary/30 group cursor-pointer opacity-0 animate-[springPop_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]" 
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handleCardClick(item)}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={getImageUrl(item.posterPath)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <span className="absolute top-2 left-2 bg-accentPrimary text-white px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase tracking-wider backdrop-blur-md">
                  {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                </span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button
                    className="flex items-center gap-1.5 text-white bg-red-600/90 py-1.5 px-3 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.tmdbId, item.title); }}
                    title="Remove from favorites"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-[0.9rem] font-semibold truncate" title={item.title}>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Styles for Animations */}
      <style>{`
        [data-reveal].revealed .reveal-char { animation: charsReveal 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes charsReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          to { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes springPop {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          60% { transform: scale(1.03) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes drawHeart {
          to { stroke-dashoffset: 0; fill: rgba(229,9,20,0.1); stroke: var(--accent-primary); }
        }
      `}</style>
    </div>
  );
};

export default Favorites;
