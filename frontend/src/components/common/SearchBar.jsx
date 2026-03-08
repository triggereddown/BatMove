import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchMovies, clearSearchResults } from '../../features/movies/moviesSlice';
import useDebounce from '../../hooks/useDebounce';
import { getImageUrl } from '../../utils/helpers';

const SearchBar = ({ isExpanded, onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  
  const { searchResults, loading } = useSelector((state) => state.movies);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchMovies({ query: debouncedQuery, page: 1 }));
      setIsOpen(true);
    } else {
      setIsOpen(false);
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      if (onClose) onClose();
      setQuery('');
    }
  };

  const handleResultClick = (id, mediaType) => {
    navigate(`/${mediaType}/${id}`);
    setIsOpen(false);
    setQuery('');
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${isExpanded ? 'w-full max-w-[600px] mx-auto mb-8' : 'w-full min-w-[240px]'}`} ref={searchRef}>
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center bg-bgCard border border-borderLayer rounded-full px-4 transition-all duration-300 focus-within:border-accentPrimary focus-within:shadow-[0_0_0_3px_rgba(229,9,20,0.15)]"
      >
        <FiSearch className="text-textMuted text-lg flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows..."
          className="flex-1 bg-transparent border-none outline-none text-textPrimary px-3 py-2 text-[0.95rem] placeholder:text-textMuted"
          id="global-search-input"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="text-textMuted hover:text-textPrimary transition-colors p-1">
            <FiX />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-bgCard border border-borderLayer rounded-xl shadow-modal overflow-hidden z-[100] animate-drop-in">
          {loading ? (
             <div className="p-4 text-center text-textMuted text-sm">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto">
              {searchResults.slice(0, 5).map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 border-b border-borderLayer last:border-0"
                  onClick={() => handleResultClick(result.id, result.media_type)}
                >
                  <img 
                    src={getImageUrl(result.poster_path || result.profile_path)} 
                    alt={result.title || result.name} 
                    className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[0.9rem] font-medium text-textPrimary truncate">{result.title || result.name}</span>
                    <span className="text-xs text-textMuted uppercase">{result.media_type}</span>
                  </div>
                </div>
              ))}
              <button 
                className="w-full block text-center p-3 text-accentPrimary font-semibold text-[0.85rem] border-t border-borderLayer transition-colors hover:bg-accentPrimary/10"
                onClick={handleSubmit}
              >
                View all results for "{query}"
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-textMuted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
