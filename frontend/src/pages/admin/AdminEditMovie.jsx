import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminMoviesApi } from '../../api';
import MovieForm from '../../components/admin/MovieForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminEditMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await adminMoviesApi.getOne(id);
        setMovie(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch movie');
        navigate('/admin/movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await adminMoviesApi.update(id, formData);
      toast.success('Movie updated successfully!');
      navigate('/admin/movies');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update movie');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-[1100px] mx-auto overflow-hidden pb-8" id="admin-edit-movie">
      <div className="mb-8 pt-2 opacity-0 animate-[heroFadeIn_0.6s_ease_forwards]">
        <h1 className="font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary mb-2">Edit Movie</h1>
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Update the details for "{movie?.title}"</p>
      </div>

      <div className="bg-glass border border-borderLayer rounded-2xl p-6 sm:p-8 max-w-[760px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-0 animate-[formSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
        <MovieForm initialData={movie} onSubmit={handleSubmit} loading={submitting} />
      </div>

      <style>{`
        @keyframes formSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminEditMovie;
