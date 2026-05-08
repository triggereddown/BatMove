import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminMoviesApi } from '../../api';
import MovieForm from '../../components/admin/MovieForm';
import toast from 'react-hot-toast';

const AdminAddMovie = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await adminMoviesApi.create(formData);
      toast.success('Movie added successfully!');
      navigate('/admin/movies');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto overflow-hidden pb-8" id="admin-add-movie">
      <div className="mb-8 pt-2 opacity-0 animate-[heroFadeIn_0.6s_ease_forwards]">
        <h1 className="font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary mb-2">Add New Movie</h1>
        <p className="text-textSecondary text-lg">Fill in the details to add a new movie to the catalog</p>
      </div>

      <div className="bg-glass border border-borderLayer rounded-2xl p-6 sm:p-8 max-w-[760px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-0 animate-[formSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
        <MovieForm onSubmit={handleSubmit} loading={loading} />
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

export default AdminAddMovie;
