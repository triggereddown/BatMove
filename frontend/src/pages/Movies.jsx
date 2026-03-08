import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopular, fetchGenres, fetchMoviesByGenre } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const Movies = () => {
  const dispatch = useDispatch();
  const { popular, genres, loading, page, totalPages } = useSelector((state) => state.movies);
  const [activeGenre, setActiveGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      <div className="mb-8 pt-4">
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide mb-2">Movies</h1>
        <p className="text-textSecondary text-lg">Discover the most popular movies from around the world</p>
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
        {popular.map((movie) => (
          <MovieCard key={movie.id} movie={movie} mediaType="movie" />
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

      <div ref={sentinelRef} className="h-px" />
    </div>
  );
};

export default Movies;
