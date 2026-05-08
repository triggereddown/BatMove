import { useEffect, useState, useRef } from 'react';
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
import { useScrollReveal } from '../hooks/useScrollReveal';

const MovieDetail = ({ mediaType = 'movie' }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, loading } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorites);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const bgRef = useRef(null);
  const titleRef = useRef(null);

  const tmdbId = String(id);
  const isFavorited = favorites.some((fav) => String(fav.tmdbId) === tmdbId);

  useScrollReveal([currentMovie]);

  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (bgRef.current && scrollY < window.innerHeight) {
          bgRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
        }
        if (titleRef.current && scrollY < window.innerHeight) {
          titleRef.current.style.transform = `translate3d(0, ${scrollY * -0.15}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
    <div className="w-full animate-fade-in pb-12 overflow-hidden" id="movie-detail-page">
      {/* Backdrop */}
      <div className="w-full h-[40vh] md:h-[60vh] min-h-[400px] relative overflow-hidden">
        <div 
          ref={bgRef}
          className="absolute inset-[-10%] bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: `url(${getBackdropUrl(backdropPath)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/80 to-bgPrimary/30 pointer-events-none" />
      </div>

      {/* Main Info */}
      <div className="flex flex-col lg:flex-row gap-10 px-[4%] lg:px-[6%] max-w-[1200px] mx-auto -mt-[120px] lg:-mt-[180px] relative z-10 items-center lg:items-start text-center lg:text-left">
        {/* Poster Wrapper */}
        <div className="shrink-0 relative group perspective-[1000px]">
          <img
            src={getImageUrl(posterPath)}
            alt={title}
            className="w-[200px] lg:w-[260px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-borderLayer object-cover aspect-[2/3] transition-transform duration-500 ease-out group-hover:rotate-y-6 group-hover:rotate-x-6"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </div>

        {/* Info Box */}
        <div className="pt-0 lg:pt-4 flex-1" ref={titleRef} style={{ willChange: 'transform' }}>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight mb-2 drop-shadow-md">{title}</h1>
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

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
            {genres.map((genre) => (
              <span key={genre.id} className="py-1 px-3 rounded-full text-xs font-medium border border-white/10 text-white bg-black/40 backdrop-blur-md">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Animated Tabs */}
          <div className="flex gap-6 border-b border-borderLayer mb-6 relative justify-center lg:justify-start">
            <button 
              className={`py-2 text-[0.95rem] font-medium transition-colors ${activeTab === 'overview' ? 'text-textPrimary' : 'text-textMuted hover:text-textPrimary'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            {mediaType === 'tv' && (
              <button 
                className={`py-2 text-[0.95rem] font-medium transition-colors ${activeTab === 'episodes' ? 'text-textPrimary' : 'text-textMuted hover:text-textPrimary'}`}
                onClick={() => setActiveTab('episodes')}
              >
                Episodes
              </button>
            )}
            {/* Sliding Underline */}
            <div 
              className="absolute bottom-[-1px] h-[2px] bg-accentPrimary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ 
                left: activeTab === 'overview' ? (window.innerWidth < 1024 ? 'calc(50% - 40px)' : '0') : (window.innerWidth < 1024 ? 'calc(50% + 30px)' : '90px'), 
                width: activeTab === 'overview' ? '70px' : '70px' 
              }}
            />
          </div>

          <p className="text-textSecondary text-lg leading-relaxed mb-8 max-w-[700px] mx-auto lg:mx-0 min-h-[100px]">
            {activeTab === 'overview' ? overview : 'Episodes list would go here...'}
          </p>

          <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
            <button 
              className="group relative overflow-hidden btn btn-lg btn-primary rounded-full px-8 py-3 bg-[var(--accent-primary)] text-white isolate focus:outline-none" 
              onClick={() => setShowTrailer(true)}
            >
              {/* Ripple Effect Background */}
              <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-full transition-transform duration-500 ease-out origin-center group-hover:scale-[2]" />
              <span className="relative flex items-center gap-2 font-semibold">
                <FiPlay className="fill-current" /> Watch Trailer
              </span>
            </button>
            
            <button
              className={`btn btn-lg rounded-full px-8 py-3 transition-colors ${isFavorited ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-glass border border-borderLayer text-textPrimary hover:border-textMuted'}`}
              onClick={handleToggleFavorite}
            >
              <FiHeart className={`${isFavorited ? 'fill-current' : ''} shadow-glow`} /> 
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="px-[4%] lg:px-[6%] max-w-[1200px] mx-auto mt-20" data-reveal="true">
          <h2 className="relative mb-6 font-heading text-2xl tracking-[0.15em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
            <span className="w-1 h-8 bg-accentPrimary mr-4 rounded-sm" />
            Cast
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x" style={{ scrollbarWidth: 'none' }}>
            {cast.map((actor, index) => (
              <div 
                key={actor.id} 
                className="text-center shrink-0 w-[120px] sm:w-[140px] snap-start opacity-0 animate-[heroSlideLeft_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={getImageUrl(actor.profile_path)}
                  alt={actor.name}
                  className="w-full aspect-[2/3] object-cover rounded-xl mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105"
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
          movie={currentMovie}
        />
      )}
      
      <style>{`
        @keyframes heroSlideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;
