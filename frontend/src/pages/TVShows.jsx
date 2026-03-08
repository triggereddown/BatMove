import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTVShows } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const TVShows = () => {
  const dispatch = useDispatch();
  const { tvShows, loading, page, totalPages } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTVShows(1));
    setCurrentPage(1);
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (loading || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchTVShows(nextPage));
  }, [loading, currentPage, totalPages, dispatch]);

  const sentinelRef = useInfiniteScroll(loadMore);

  return (
    <div className="page-container" id="tv-page">
      <div className="mb-8 pt-4">
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide mb-2">TV Shows</h1>
        <p className="text-textSecondary text-lg">Explore the most popular TV series trending right now</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5" id="tv-grid">
        {tvShows.map((show) => (
          <MovieCard key={show.id} movie={show} mediaType="tv" />
        ))}
        {loading &&
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
        }
      </div>

      {tvShows.length === 0 && !loading && (
        <div className="text-center py-20 px-8 text-textMuted" id="tv-empty">
          <h3 className="font-heading text-2xl text-textSecondary mb-2">No TV shows found</h3>
          <p>Check back later for popular series.</p>
        </div>
      )}

      <div ref={sentinelRef} className="h-px" />
    </div>
  );
};

export default TVShows;
