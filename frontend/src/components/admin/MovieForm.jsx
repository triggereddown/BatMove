import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../utils/constants';

const MovieForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', posterUrl: '', backdropUrl: '',
    trailerYoutubeLink: '', releaseDate: '', genre: [],
    category: 'movie', tmdbId: '', rating: 0
  });

  const [genreInput, setGenreInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setFormData({ ...initialData, category: initialData.category || 'movie', rating: initialData.rating || 0 });
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.releaseDate?.trim()) newErrors.releaseDate = 'Release date is required';
    if (formData.rating < 0 || formData.rating > 10) newErrors.rating = 'Rating must be between 0 and 10';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddGenre = () => {
    const g = genreInput.trim();
    if (g && !formData.genre.includes(g)) {
      setFormData((prev) => ({ ...prev, genre: [...prev.genre, g] }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre) => {
    setFormData((prev) => ({ ...prev, genre: prev.genre.filter((g) => g !== genre) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  return (
    <form className="flex flex-col gap-5 max-w-[700px]" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className={`form-input ${errors.title ? 'form-input-error' : ''}`} placeholder="Enter movie title" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-input min-h-[100px] resize-y" rows={4} placeholder="Enter movie description" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Poster URL</label>
          <input type="text" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="form-input" placeholder="https://..." />
        </div>
        <div className="form-group">
          <label className="form-label">Backdrop URL</label>
          <input type="text" name="backdropUrl" value={formData.backdropUrl} onChange={handleChange} className="form-input" placeholder="https://..." />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Trailer YouTube Link</label>
        <input type="text" name="trailerYoutubeLink" value={formData.trailerYoutubeLink} onChange={handleChange} className="form-input" placeholder="https://youtube.com/watch?v=..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Release Date *</label>
          <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className={`form-input w-full ${errors.releaseDate ? 'form-input-error' : ''}`} />
          {errors.releaseDate && <span className="form-error">{errors.releaseDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="form-input w-full cursor-pointer bg-bgSecondary">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-bgSecondary text-textPrimary">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Genres</label>
        <div className="flex gap-2">
          <input 
            type="text" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} 
            className="form-input flex-1" placeholder="Type genre and press Add"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGenre(); } }}
          />
          <button type="button" className="btn btn-sm btn-primary" onClick={handleAddGenre}>Add</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.genre.map((g) => (
            <span key={g} className="inline-flex items-center gap-1.5 px-3 py-1 bg-accentPrimary/10 text-accentPrimary rounded-full text-xs font-semibold">
              {g}
              <button type="button" onClick={() => handleRemoveGenre(g)} className="text-accentPrimary hover:text-white transition-colors">&times;</button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">TMDB ID (optional)</label>
          <input type="text" name="tmdbId" value={formData.tmdbId} onChange={handleChange} className="form-input" placeholder="e.g. 12345" />
        </div>
        <div className="form-group">
          <label className="form-label">Rating (0-10)</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} className={`form-input ${errors.rating ? 'form-input-error' : ''}`} min="0" max="10" step="0.1" />
          {errors.rating && <span className="form-error">{errors.rating}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-lg btn-primary mt-4" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Movie' : 'Add Movie'}
      </button>
    </form>
  );
};

export default MovieForm;
