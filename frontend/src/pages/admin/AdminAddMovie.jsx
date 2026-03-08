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
    <div className="w-full max-w-[1100px] mx-auto animate-fade-in" id="admin-add-movie">
      <div className="mb-6 pt-2">
        <h1 className="font-heading text-4xl tracking-wide mb-1">Add New Movie</h1>
        <p className="text-textSecondary">Fill in the details to add a new movie to the catalog</p>
      </div>

      <div className="bg-bgCard border border-borderLayer rounded-2xl p-6 sm:p-8 max-w-[760px] shadow-modal">
        <MovieForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default AdminAddMovie;
