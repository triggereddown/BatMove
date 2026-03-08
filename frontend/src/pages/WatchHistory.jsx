import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTrash2, FiTrash } from 'react-icons/fi';
import { fetchHistory, removeFromHistory, clearHistory } from '../features/watchHistory/watchHistorySlice';
import { getImageUrl, formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const WatchHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.watchHistory);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromHistory(id));
    toast.success('Entry removed from history');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all watch history?')) {
      dispatch(clearHistory());
      toast.success('Watch history cleared');
    }
  };

  const handleItemClick = (item) => {
    const route = item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`;
    navigate(route);
  };

  if (loading && items.length === 0) return <Loader fullScreen />;

  return (
    <div className="page-container" id="history-page">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-4">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl tracking-wide mb-2 flex items-center gap-3"><FiClock className="text-accentSecondary" /> Watch History</h1>
          <p className="text-textSecondary text-lg">Your recently viewed movies and shows</p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleClearAll}>
            <FiTrash /> Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 px-8 text-textMuted flex flex-col items-center">
          <FiClock size={64} className="mb-6 opacity-30 text-accentSecondary" />
          <h3 className="font-heading text-2xl text-textSecondary mb-2">No watch history yet</h3>
          <p className="mb-6">Movies and shows you view will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/movies')}>
            Start Watching
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-bgCard border border-borderLayer rounded-xl p-3 transition-colors hover:border-white/10 group">
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => handleItemClick(item)}>
                <img
                  src={getImageUrl(item.posterPath)}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded-md"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                <div className="flex flex-col">
                  <h3 className="text-[0.95rem] font-semibold text-textPrimary group-hover:text-accentPrimary transition-colors">{item.title}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-textMuted uppercase">{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                    <span className="text-xs text-textMuted flex items-center gap-1">
                      <FiClock /> {formatDate(item.watchedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="text-textMuted p-2 sm:px-4 rounded-md transition-colors hover:text-red-500 hover:bg-red-500/10 hidden sm:block"
                onClick={() => handleRemove(item._id)}
                title="Remove"
              >
                <FiTrash2 />
              </button>
              {/* Mobile Remove Button */}
              <button
                className="text-textMuted p-2 transition-colors hover:text-red-500 sm:hidden"
                onClick={() => handleRemove(item._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
