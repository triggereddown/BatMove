import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearchResults } from '../features/movies/moviesSlice';
import MovieCard from '../components/common/MovieCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useDebounce from '../hooks/useDebounce';
import { FiSearch, FiFilm, FiTv, FiUsers } from 'react-icons/fi';

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const debouncedQuery = useDebounce(query, 500);
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.movies);

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
      <div className="mb-8 pt-4">
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide mb-2">Explore</h1>
        <p className="text-textSecondary text-lg">Find your favorite movies, TV shows, and people</p>
      </div>

      <div className="max-w-[700px] mb-12 relative group">
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
        <div className="text-center py-20 px-4 text-textMuted flex flex-col items-center">
          <FiSearch size={64}  className="mb-4 opacity-30" />
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
        <div className="text-center py-32 px-4 text-textMuted flex flex-col items-center">
          <FiSearch size={72} className="mb-6 opacity-30 text-accentPrimary" />
          <h3 className="font-heading text-3xl text-textPrimary mb-3 tracking-wide">Start Searching</h3>
          <p className="text-lg">Type at least 2 characters to discover cinematic brilliance.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
