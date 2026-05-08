import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTVShows } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TVShows = () => {
  const dispatch = useDispatch();
  const { tvShows, loading, page, totalPages } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useScrollReveal([tvShows, loading]);

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
      <div className="mb-8 pt-4" data-reveal="true">
        <h1 className="relative mb-3 font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <span className="w-1.5 h-10 bg-accentPrimary mr-4 rounded-sm transform origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] scale-y-0 group-hover/header:scale-y-100 reveal-line" />
          <span className="inline-flex">
            {'TV SHOWS'.split('').map((char, i) => (
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
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Explore the most popular TV series trending right now</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5" id="tv-grid">
        {tvShows.map((show, index) => (
          <div key={show.id} data-reveal="true" data-reveal-delay={(index % 6) * 50}>
            <MovieCard movie={show} mediaType="tv" />
          </div>
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

export default TVShows;
