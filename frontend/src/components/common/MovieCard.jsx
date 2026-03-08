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

  const tmdbId = String(movie.id);
  const isFavorited = favorites.some((fav) => String(fav.tmdbId) === tmdbId);

  const handleCardClick = () => {
    navigate(`/${mediaType}/${tmdbId}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Login to add favorites');
    
    if (isFavorited) {
      dispatch(removeFavorite(tmdbId));
      toast.success('Removed from favorites');
    } else {
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

  return (
    <div 
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-bgCard border border-borderLayer hover:scale-[1.04] hover:shadow-card-hover hover:border-white/10 group"
      onClick={handleCardClick}
      id={`movie-${tmdbId}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-between items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors duration-250 ${isFavorited ? 'bg-accentPrimary text-white shadow-glow' : 'bg-black/60 text-textPrimary hover:bg-accentPrimary hover:text-white'}`}
            onClick={handleFavoriteClick}
            aria-label="Toggle Favorite"
          >
            <FiHeart className={isFavorited ? 'fill-current' : ''} />
          </button>
        </div>
        {rating > 0 && (
          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-md font-mono text-[0.78rem] font-bold text-accentSecondary flex items-center gap-1">
            <FiStar className="fill-current" /> {formatRating(rating)}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-[0.9rem] font-semibold truncate mb-0.5">{title}</h3>
        {releaseDate && (
          <p className="text-[0.8rem] text-textMuted font-mono">{getYear(releaseDate)}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
