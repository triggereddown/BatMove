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
    <form className="flex flex-col gap-6 max-w-[700px] mb-12" onSubmit={handleSubmit}>
      <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.2s_forwards]">
        <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Title *</label>
        <div className="relative group">
          <input type="text" name="title" value={formData.title} onChange={handleChange} className={`form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full ${errors.title ? 'form-input-error' : ''}`} placeholder="Enter movie title" />
          <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
        </div>
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.3s_forwards]">
        <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Description</label>
        <div className="relative group">
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full min-h-[120px] resize-y" rows={4} placeholder="Enter movie description" />
          <span className="absolute bottom-[4px] left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-0 animate-[inputSlideUp_0.6s_ease_0.4s_forwards]">
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Poster URL</label>
          <div className="relative group">
            <input type="text" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full" placeholder="https://..." />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Backdrop URL</label>
          <div className="relative group">
            <input type="text" name="backdropUrl" value={formData.backdropUrl} onChange={handleChange} className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full" placeholder="https://..." />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
        </div>
      </div>

      <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.5s_forwards]">
        <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Trailer YouTube Link</label>
        <div className="relative group">
          <input type="text" name="trailerYoutubeLink" value={formData.trailerYoutubeLink} onChange={handleChange} className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full" placeholder="https://youtube.com/watch?v=..." />
          <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-0 animate-[inputSlideUp_0.6s_ease_0.6s_forwards]">
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Release Date *</label>
          <div className="relative group">
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className={`form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full ${errors.releaseDate ? 'form-input-error' : ''}`} />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
          {errors.releaseDate && <span className="form-error">{errors.releaseDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Category</label>
          <div className="relative group">
            <select name="category" value={formData.category} onChange={handleChange} className="form-input w-full cursor-pointer bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 appearance-none">
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-bgSecondary text-textPrimary">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-textMuted">
              &#9662;
            </div>
          </div>
        </div>
      </div>

      <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.7s_forwards]">
        <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Genres</label>
        <div className="flex gap-2">
          <div className="relative group flex-1">
            <input 
              type="text" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} 
              className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full" placeholder="Type genre and press Add"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGenre(); } }}
            />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
          <button type="button" className="btn btn-primary px-6 relative overflow-hidden group isolate" onClick={handleAddGenre}>
            <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-md transition-transform duration-500 ease-out origin-center group-hover:scale-[2]" />
            <span className="relative z-10">Add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.genre.map((g) => (
            <span key={g} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/20 rounded-full text-[0.8rem] font-medium transition-all hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30">
              {g}
              <button type="button" onClick={() => handleRemoveGenre(g)} className="opacity-70 hover:opacity-100 transition-opacity">&times;</button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-0 animate-[inputSlideUp_0.6s_ease_0.8s_forwards]">
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">TMDB ID (optional)</label>
          <div className="relative group">
            <input type="text" name="tmdbId" value={formData.tmdbId} onChange={handleChange} className="form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full" placeholder="e.g. 12345" />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label text-[0.85rem] uppercase tracking-wider font-semibold text-textSecondary mb-2">Rating (0-10)</label>
          <div className="relative group">
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} className={`form-input bg-glass border border-borderLayer focus:border-accentPrimary transition-all duration-300 w-full ${errors.rating ? 'form-input-error' : ''}`} min="0" max="10" step="0.1" />
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
          </div>
          {errors.rating && <span className="form-error">{errors.rating}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-lg btn-primary mt-6 relative overflow-hidden group isolate" disabled={loading} style={{ animation: 'inputSlideUp 0.6s ease 0.9s forwards', opacity: 0 }}>
        <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-full transition-transform duration-500 ease-out origin-center group-hover:scale-[2]" />
        <span className="relative z-10 font-bold tracking-wide uppercase">{loading ? 'Saving...' : initialData ? 'Update Movie' : 'Add Movie'}</span>
      </button>

      <style>{`
        @keyframes inputSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
};

export default MovieForm;
