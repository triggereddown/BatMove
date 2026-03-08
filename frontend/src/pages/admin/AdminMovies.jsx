import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { adminMoviesApi } from '../../api';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  const fetchMovies = async (p = 1) => {
    setLoading(true);
    try {
      const response = await adminMoviesApi.getAll(p);
      setMovies(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminMoviesApi.remove(id);
      toast.success(`"${title}" deleted`);
      fetchMovies(page);
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  if (loading && movies.length === 0) return <Loader />;

  return (
    <div className="w-full max-w-[1100px] mx-auto animate-fade-in" id="admin-movies">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pt-2">
        <div>
          <h1 className="font-heading text-4xl tracking-wide mb-1">Movies</h1>
          <p className="text-textSecondary">Manage your movie catalog</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/movies/add')}>
          <FiPlus /> Add New Movie
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-borderLayer bg-bgCard mb-6">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-bgSecondary border-b border-borderLayer">
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Poster</th>
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Title</th>
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Category</th>
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Release Date</th>
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Rating</th>
              <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id} className="border-b border-borderLayer hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={movie.posterUrl || '/placeholder.jpg'}
                    alt={movie.title}
                    className="w-11 h-16 object-cover rounded shadow-md border border-borderLayer"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-textPrimary">{movie.title}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold leading-none bg-accentPrimary/10 text-accentPrimary capitalize border border-accentPrimary/20">
                    {movie.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-textSecondary">{formatDate(movie.releaseDate)}</td>
                <td className="px-4 py-3 text-textSecondary">{movie.rating}/10</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-ghost hover:text-white"
                      onClick={() => navigate(`/admin/movies/edit/${movie._id}`)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger px-3 py-1.5"
                      onClick={() => handleDelete(movie._id, movie.title)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {movies.length === 0 && !loading && (
          <div className="p-10 text-center text-textMuted">No movies found. Add your first movie!</div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="btn btn-sm btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-[0.9rem] text-textSecondary font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn-sm btn-ghost"
            disabled={page >= pagination.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
