import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiPlay, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import { fetchMovieDetail, clearCurrentMovie } from '../features/movies/moviesSlice';
import { addFavorite, removeFavorite } from '../features/favorites/favoritesSlice';
import { addToHistory } from '../features/watchHistory/watchHistorySlice';
import TrailerModal from '../components/common/TrailerModal';
import MovieCard from '../components/common/MovieCard';
import Loader from '../components/common/Loader';
import { getImageUrl, getBackdropUrl, formatDate, formatRating, extractTrailerKey, truncateText } from '../utils/helpers';
import toast from 'react-hot-toast';

const MovieDetail = ({ mediaType = 'movie' }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, loading } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorites);
  const [showTrailer, setShowTrailer] = useState(false);

  const tmdbId = String(id);
  const isFavorited = favorites.some((fav) => String(fav.tmdbId) === tmdbId);

  useEffect(() => {
    dispatch(fetchMovieDetail({ id, mediaType }));
    return () => dispatch(clearCurrentMovie());
  }, [id, mediaType, dispatch]);

  useEffect(() => {
    if (currentMovie && isAuthenticated) {
      dispatch(addToHistory({
        tmdbId: tmdbId,
        title: currentMovie.title || currentMovie.name || 'Unknown',
        posterPath: currentMovie.poster_path || '',
        mediaType: mediaType === 'tv' ? 'tv' : 'movie'
      }));
    }
  }, [currentMovie, isAuthenticated, dispatch, tmdbId, mediaType]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return toast.error('Please login to add favorites');
    
    if (isFavorited) {
      dispatch(removeFavorite(tmdbId));
      toast.success('Removed from favorites');
    } else {
      dispatch(addFavorite({
        tmdbId,
        title: currentMovie.title || currentMovie.name,
        posterPath: currentMovie.poster_path || '',
        mediaType: mediaType === 'tv' ? 'tv' : 'movie'
      }));
      toast.success('Added to favorites');
    }
  };

  if (loading || !currentMovie) return <Loader fullScreen />;

  const title = currentMovie.title || currentMovie.name || 'Untitled';
  const tagline = currentMovie.tagline || '';
  const overview = currentMovie.overview || 'Description not available';
  const rating = currentMovie.vote_average || 0;
  const releaseDate = currentMovie.release_date || currentMovie.first_air_date || '';
  const genres = currentMovie.genres || [];
  const runtime = currentMovie.runtime || currentMovie.episode_run_time?.[0] || 0;
  const backdropPath = currentMovie.backdrop_path || '';
  const posterPath = currentMovie.poster_path || '';
  const trailerKey = extractTrailerKey(currentMovie.videos);
  const cast = currentMovie.credits?.cast?.slice(0, 12) || [];
  const similar = currentMovie.similar?.results?.slice(0, 12) || [];

  return (
    <div className="w-full animate-fade-in pb-12" id="movie-detail-page">
      {/* Backdrop */}
      <div 
        className="w-full h-[40vh] md:h-[60vh] min-h-[400px] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${getBackdropUrl(backdropPath)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/80 to-bgPrimary/30" />
      </div>

      {/* Main Info */}
      <div className="flex flex-col lg:flex-row gap-10 px-[4%] lg:px-[6%] max-w-[1200px] mx-auto -mt-[120px] lg:-mt-[180px] relative z-10 items-center lg:items-start text-center lg:text-left">
        {/* Poster Wrapper */}
        <div className="shrink-0">
          <img
            src={getImageUrl(posterPath)}
            alt={title}
            className="w-[200px] lg:w-[260px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] border-2 border-borderLayer object-cover aspect-[2/3]"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </div>

        {/* Info Box */}
        <div className="pt-0 lg:pt-4 flex-1">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-2">{title}</h1>
          {tagline && <p className="text-textMuted italic text-lg mb-4">"{tagline}"</p>}

          <div className="flex items-center justify-center lg:justify-start gap-5 mb-4 flex-wrap">
            {rating > 0 && (
              <span className="flex items-center gap-1.5 text-accentSecondary font-mono font-bold text-lg">
                <FiStar className="fill-current" /> {formatRating(rating)} / 10
              </span>
            )}
            {releaseDate && (
              <span className="text-textSecondary flex items-center gap-1.5">
                <FiCalendar /> {formatDate(releaseDate)}
              </span>
            )}
            {runtime > 0 && (
              <span className="text-textSecondary flex items-center gap-1.5">
                <FiClock /> {runtime} min
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
            {genres.map((genre) => (
              <span key={genre.id} className="py-1 px-3 rounded-full text-xs font-medium border border-borderLayer text-textSecondary bg-glass backdrop-blur-sm">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-textSecondary text-lg leading-relaxed mb-8 max-w-[700px] mx-auto lg:mx-0">
            {overview}
          </p>

          <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
            <button className="btn btn-lg btn-primary" onClick={() => setShowTrailer(true)}>
              <FiPlay className="fill-current" /> Watch Trailer
            </button>
            <button
              className={`btn btn-lg ${isFavorited ? 'btn-favorited' : 'btn-ghost'}`}
              onClick={handleToggleFavorite}
            >
              <FiHeart className={isFavorited ? 'fill-current' : ''} /> 
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="px-[4%] lg:px-[6%] max-w-[1200px] mx-auto mt-16">
          <h2 className="section-title">Cast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  src={getImageUrl(actor.profile_path)}
                  alt={actor.name}
                  className="w-full aspect-[2/3] object-cover rounded-xl mb-2 bg-bgCard"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <span className="block text-[0.85rem] font-semibold text-textPrimary truncate">{actor.name}</span>
                <span className="block text-[0.75rem] text-textMuted truncate">{actor.character}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Content */}
      {similar.length > 0 && (
        <section className="px-[4%] lg:px-[6%] max-w-[1200px] mx-auto mt-16">
          <h2 className="section-title">Similar {mediaType === 'tv' ? 'Shows' : 'Movies'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
            ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetail;
