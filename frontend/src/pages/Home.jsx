import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, fetchTVShows } from '../features/movies/moviesSlice';
import HeroSection from '../components/common/HeroSection';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ScrollSection = ({ title, data, loading, seeAllLink, mediaType = 'movie' }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-14" data-reveal="true">
      <div className="flex justify-between items-end mb-6">
        <h2 className="relative mb-0 font-heading text-2xl tracking-[0.15em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          {/* Decorative animated line */}
          <span className="w-1 h-8 bg-accentPrimary mr-4 rounded-sm transform origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] scale-y-0 group-hover/header:scale-y-100 reveal-line" />
          
          <span className="inline-flex">
            {title.split('').map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 reveal-char"
                style={{ animationDelay: `${0.1 + (i * 0.03)}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="text-accentPrimary font-semibold flex items-center gap-1 group/link transition-colors hover:text-accentSecondary text-sm md:text-base">
            See All 
            <FiChevronRight className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/link:translate-x-1.5 group-hover/link:scale-110" />
          </Link>
        )}
      </div>
      <div className="relative group">
        <button 
          className="absolute left-[-8px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-bgPrimary/85 border border-borderLayer text-textPrimary flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accentPrimary hover:border-accentPrimary hover:scale-110 shadow-lg"
          onClick={() => scroll('left')} 
          aria-label="Scroll left"
        >
          <FiChevronLeft size={20} />
        </button>
        <div 
          className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none snap-x" 
          ref={scrollRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => <div key={i} className="snap-start shrink-0 w-[180px]"><SkeletonCard /></div>)
          ) : data.length === 0 ? (
            <div className="w-full h-[270px] rounded-xl flex items-center justify-center bg-bgSecondary border border-borderLayer text-textSecondary flex-col gap-3">
              <span className="text-3xl opacity-50">📡</span>
              <p className="font-medium">Failed to load {title.split(' ')[1]}</p>
              <p className="text-sm opacity-60">Check your API connection</p>
            </div>
          ) : (
            data.map((movie) => (
              <div key={movie.id} className="snap-start shrink-0 w-[180px]">
                <MovieCard movie={movie} mediaType={movie.media_type || mediaType} />
              </div>
            ))
          )}
        </div>
        <button 
          className="absolute right-[-8px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-bgPrimary/85 border border-borderLayer text-textPrimary flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accentPrimary hover:border-accentPrimary hover:scale-110 shadow-lg"
          onClick={() => scroll('right')} 
          aria-label="Scroll right"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
      <style>{`
        [data-reveal].revealed .reveal-line {
          transform: scaleY(1);
        }
        [data-reveal].revealed .reveal-char {
          animation: charsReveal 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes charsReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          to { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { trending, popular, topRated, upcoming, tvShows, loading } = useSelector((state) => state.movies);

  useScrollReveal([trending, popular, topRated, upcoming, tvShows]);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchPopular(1));
    dispatch(fetchTopRated(1));
    dispatch(fetchUpcoming(1));
    dispatch(fetchTVShows(1));
  }, [dispatch]);

  const heroMovie = trending.length > 0 ? trending[0] : null;

  return (
    <div className="w-full animate-fade-in pb-10" id="home-page">
      <HeroSection movie={heroMovie} />

      <div className="px-[4%] max-w-[1440px] mx-auto mt-12">
        <ScrollSection
          title="🔥 Trending This Week"
          data={trending}
          loading={loading && trending.length === 0}
          seeAllLink="/movies"
        />
        <ScrollSection
          title="🎬 Popular Movies"
          data={popular.slice(0, 20)}
          loading={loading && popular.length === 0}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <ScrollSection
          title="⭐ Top Rated"
          data={topRated.slice(0, 20)}
          loading={loading && topRated.length === 0}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <ScrollSection
          title="📅 Upcoming"
          data={upcoming.slice(0, 20)}
          loading={loading && upcoming.length === 0}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <ScrollSection
          title="📺 Popular TV Shows"
          data={tvShows.slice(0, 20)}
          loading={loading && tvShows.length === 0}
          seeAllLink="/tv"
          mediaType="tv"
        />
      </div>
    </div>
  );
};

export default Home;
