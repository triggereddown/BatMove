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
  const [isFocused, setIsFocused] = useState(false);
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
      setIsFocused(false);
      if (onClose) onClose();
      setQuery('');
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="text-[var(--accent-secondary)] font-bold">{part}</span>
      ) : (
        part
      )
    );
  };

  const handleResultClick = (id, mediaType) => {
    navigate(`/${mediaType}/${id}`);
    setIsOpen(false);
    setQuery('');
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${isExpanded ? 'w-full max-w-[600px] mx-auto mb-8' : 'w-full min-w-[240px]'}`} ref={searchRef}>
      
      {/* Spotlight Glow */}
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none z-[-1] ${isFocused ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(229,9,20,0.15), transparent 70%)', transform: 'scale(1.1)' }}
      />

      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center bg-bgCard rounded-full px-4 overflow-hidden group"
      >
        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-borderLayer" />
        <div 
          className="absolute bottom-0 left-0 h-[1px] bg-accentPrimary transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]" 
          style={{ width: '100%', transform: isFocused ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left center' }} 
        />
        
        <FiSearch className={`text-lg flex-shrink-0 transition-colors duration-300 ${isFocused ? 'text-accentPrimary' : 'text-textMuted'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search movies, TV shows..."
          className="flex-1 bg-transparent border-none outline-none text-textPrimary px-3 py-[10px] text-[0.95rem] placeholder:text-textMuted w-full"
          id="global-search-input"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="text-textMuted hover:text-accentPrimary transition-colors p-1">
            <FiX />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-bgCard border border-borderLayer rounded-xl shadow-[var(--shadow-modal)] overflow-hidden z-[100] animate-drop-in before:absolute before:inset-0 before:bg-[var(--glass)] before:-z-10">
          {loading ? (
             <div className="p-4 text-center text-textMuted text-sm">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto">
              {searchResults.slice(0, 5).map((result, i) => (
                <div 
                  key={result.id} 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--glass-strong)] border-b border-borderLayer last:border-0 opacity-0 animate-[heroSlideUp_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards]"
                  style={{ animationDelay: `${i * 30}ms` }}
                  onClick={() => handleResultClick(result.id, result.media_type)}
                >
                  <img 
                    src={getImageUrl(result.poster_path || result.profile_path)} 
                    alt={result.title || result.name} 
                    className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[0.9rem] font-medium text-textPrimary truncate" title={result.title || result.name}>
                      {highlightText(result.title || result.name, query)}
                    </span>
                    <span className="text-xs text-textMuted uppercase tracking-wider">{result.media_type}</span>
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
            <div className="p-8 text-center flex flex-col items-center">
              <div className="relative w-16 h-16 mb-3 opacity-60">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-textMuted stroke-current stroke-[1.5]">
                  <circle cx="11" cy="11" r="8" className="animate-[pulse_2s_infinite]" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" className="animate-[pulse_2s_infinite]" style={{ animationDelay: '0.5s' }} />
                  <line x1="11" y1="7" x2="11" y2="15" strokeDasharray="2 2" className="animate-spin-slow origin-center" />
                </svg>
              </div>
              <p className="text-textSecondary">No results found for <span className="text-textPrimary font-medium">"{query}"</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
