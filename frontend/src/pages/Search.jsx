import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearchResults } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useDebounce from '../hooks/useDebounce';
import { FiSearch, FiFilm, FiTv, FiUsers } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const debouncedQuery = useDebounce(query, 500);
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.movies);

  useScrollReveal([searchResults, loading]);

  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchMovies({ query: debouncedQuery, page: 1 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => () => dispatch(clearSearchResults()), [dispatch]);

  const movies = searchResults.filter((r) => r.media_type === 'movie');
  const tvShows = searchResults.filter((r) => r.media_type === 'tv');
  const people = searchResults.filter((r) => r.media_type === 'person');

  return (
    <div className="page-container" id="search-page">
      <div className="mb-12 pt-4" data-reveal="true">
        <h1 className="relative mb-3 font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <span className="w-1.5 h-10 bg-accentPrimary mr-4 rounded-sm transform origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] scale-y-0 group-hover/header:scale-y-100 reveal-line" />
          <span className="inline-flex">
            {'EXPLORE'.split('').map((char, i) => (
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
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Find your favorite movies, TV shows, and people</p>
      </div>

      <div className="max-w-[700px] mb-12 relative group opacity-0 animate-[formSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
        <div className="flex items-center bg-bgCard border border-borderLayer rounded-2xl px-5 transition-all duration-300 focus-within:border-accentPrimary focus-within:shadow-[0_0_0_4px_rgba(229,9,20,0.15)] h-16">
          <FiSearch className="text-textMuted text-2xl flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type at least 2 characters to search..."
            className="flex-1 bg-transparent border-none outline-none text-textPrimary px-4 text-lg placeholder:text-textMuted"
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && debouncedQuery.length >= 2 && searchResults.length === 0 && (
        <div className="text-center py-20 px-4 text-textMuted flex flex-col items-center opacity-0 animate-[heroFadeIn_0.8s_ease_0.2s_forwards]">
          <FiSearch size={64}  className="mb-4 opacity-30 text-accentPrimary animate-[pulse_3s_ease-in-out_infinite]" />
          <h3 className="font-heading text-2xl text-textSecondary mb-2">No results found</h3>
          <p>Try a different search term or check your spelling.</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title flex items-center gap-2"><FiFilm /> Movies ({movies.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} mediaType="movie" />)}
          </div>
        </section>
      )}

      {!loading && tvShows.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title flex items-center gap-2"><FiTv /> TV Shows ({tvShows.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {tvShows.map((show) => <MovieCard key={show.id} movie={show} mediaType="tv" />)}
          </div>
        </section>
      )}

      {!loading && people.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title flex items-center gap-2"><FiUsers /> People ({people.length})</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {people.map((person) => (
              <div key={person.id} className="text-center bg-bgCard border border-borderLayer rounded-2xl p-4 transition-transform hover:-translate-y-1">
                <img
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : '/placeholder.jpg'}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-borderLayer"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <span className="block text-[0.9rem] font-semibold text-textPrimary leading-tight mb-1">{person.name}</span>
                <span className="block text-[0.75rem] text-textMuted uppercase">{person.known_for_department}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && debouncedQuery.length < 2 && searchResults.length === 0 && (
        <div className="text-center py-32 px-4 text-textMuted flex flex-col items-center opacity-0 animate-[heroFadeIn_0.8s_ease_0.6s_forwards]">
          <div className="relative w-24 h-24 mb-6">
             <div className="absolute inset-0 border-4 border-dashed border-borderStrong rounded-full animate-[spin_10s_linear_infinite]" />
             <FiSearch size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accentPrimary" />
          </div>
          <h3 className="font-heading text-3xl text-textPrimary mb-3 tracking-wide">Start Searching</h3>
          <p className="text-lg">Type at least 2 characters to discover cinematic brilliance.</p>
        </div>
      )}

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
        @keyframes formSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Search;
