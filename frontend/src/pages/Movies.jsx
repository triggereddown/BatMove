import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopular, fetchGenres, fetchMoviesByGenre } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Movies = () => {
  const dispatch = useDispatch();
  const { popular, genres, loading, page, totalPages } = useSelector((state) => state.movies);
  const [activeGenre, setActiveGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useScrollReveal([popular, loading]);

  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchPopular(1));
    setCurrentPage(1);
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (loading || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (activeGenre) {
      dispatch(fetchMoviesByGenre({ genreId: activeGenre, page: nextPage }));
    } else {
      dispatch(fetchPopular(nextPage));
    }
  }, [loading, currentPage, totalPages, activeGenre, dispatch]);

  const sentinelRef = useInfiniteScroll(loadMore);

  const handleGenreClick = (genreId) => {
    if (activeGenre === genreId) {
      setActiveGenre(null);
      setCurrentPage(1);
      dispatch(fetchPopular(1));
    } else {
      setActiveGenre(genreId);
      setCurrentPage(1);
      dispatch(fetchMoviesByGenre({ genreId, page: 1 }));
    }
  };

  return (
    <div className="page-container" id="movies-page">
      <div className="mb-8 pt-4" data-reveal="true">
        <h1 className="relative mb-3 font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <span className="w-1.5 h-10 bg-accentPrimary mr-4 rounded-sm transform origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] scale-y-0 group-hover/header:scale-y-100 reveal-line" />
          <span className="inline-flex">
            {'MOVIES'.split('').map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 reveal-char"
                style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Discover the most popular movies from around the world</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8" id="genre-filters">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!activeGenre ? 'bg-accentPrimary border-accentPrimary text-white shadow-glow' : 'border-borderLayer bg-glass text-textSecondary hover:border-textMuted hover:text-textPrimary'}`}
          onClick={() => { setActiveGenre(null); setCurrentPage(1); dispatch(fetchPopular(1)); }}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeGenre === genre.id ? 'bg-accentPrimary border-accentPrimary text-white shadow-glow' : 'border-borderLayer bg-glass text-textSecondary hover:border-textMuted hover:text-textPrimary'}`}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5" id="movies-grid">
        {popular.map((movie, index) => (
          <div key={movie.id} data-reveal="true" data-reveal-delay={(index % 6) * 50}>
            <MovieCard movie={movie} mediaType="movie" />
          </div>
        ))}
        {loading &&
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
        }
      </div>

      {popular.length === 0 && !loading && (
        <div className="text-center py-20 px-8 text-textMuted" id="movies-empty">
          <h3 className="font-heading text-2xl text-textSecondary mb-2">No movies found</h3>
          <p>Try selecting a different genre or check back later.</p>
        </div>
      )}

      <div ref={sentinelRef} className="h-px w-full" />
      
      <style>{`
        [data-reveal].revealed .reveal-line { transform: scaleY(1); }
        [data-reveal].revealed .reveal-char { animation: charsReveal 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes charsReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          to { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Movies;
