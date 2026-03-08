import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { fetchFavorites, removeFavorite } from '../features/favorites/favoritesSlice';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.favorites);

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
      <div className="mb-8 pt-4">
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide mb-2 flex items-center gap-3"><FiHeart className="text-accentPrimary" /> My Favorites</h1>
        <p className="text-textSecondary text-lg">Your personal collection of favorite movies and shows</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 px-8 text-textMuted flex flex-col items-center">
          <FiHeart size={64} className="mb-6 opacity-30 text-accentPrimary" />
          <h3 className="font-heading text-2xl text-textSecondary mb-2">You haven't added any favorites yet.</h3>
          <p className="mb-6">Browse movies and TV shows to add them to your favorites!</p>
          <button className="btn btn-primary" onClick={() => navigate('/movies')}>
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {items.map((item) => (
            <div key={item._id} className="bg-bgCard border border-borderLayer rounded-xl overflow-hidden transition-colors hover:border-white/10 group cursor-pointer" onClick={() => handleCardClick(item)}>
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
    </div>
  );
};

export default Favorites;
