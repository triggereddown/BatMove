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
    <div className="w-full max-w-[1100px] mx-auto animate-fade-in" id="admin-edit-movie">
      <div className="mb-6 pt-2">
        <h1 className="font-heading text-4xl tracking-wide mb-1">Edit Movie</h1>
        <p className="text-textSecondary">Update the details for "{movie?.title}"</p>
      </div>

      <div className="bg-bgCard border border-borderLayer rounded-2xl p-6 sm:p-8 max-w-[760px] shadow-modal">
        <MovieForm initialData={movie} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
};

export default AdminEditMovie;
