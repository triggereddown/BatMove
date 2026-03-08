import axios from 'axios';

// ─── CONFIG ────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const BACKDROP_BASE_URL = import.meta.env.VITE_TMDB_BACKDROP_URL;

// ─── AXIOS INSTANCES ───────────────────────────────────
export const backendApi = axios.create({ baseURL: BACKEND_URL });
export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    accept: 'application/json'
  }
});

// Attach JWT to backend requests automatically
backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses globally — auto redirect to login
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── TMDB API FUNCTIONS ────────────────────────────────
export const tmdbEndpoints = {
  getTrending: (mediaType = 'all', timeWindow = 'week') =>
    tmdbApi.get(`/trending/${mediaType}/${timeWindow}`),

  getPopularMovies: (page = 1) =>
    tmdbApi.get(`/movie/popular?page=${page}`),

  getPopularTVShows: (page = 1) =>
    tmdbApi.get(`/tv/popular?page=${page}`),

  getMovieDetails: (movieId) =>
    tmdbApi.get(`/movie/${movieId}?append_to_response=videos,credits,similar`),

  getTVDetails: (tvId) =>
    tmdbApi.get(`/tv/${tvId}?append_to_response=videos,credits,similar`),

  searchMulti: (query, page = 1) =>
    tmdbApi.get(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`),

  getMovieVideos: (movieId) =>
    tmdbApi.get(`/movie/${movieId}/videos`),

  getTVVideos: (tvId) =>
    tmdbApi.get(`/tv/${tvId}/videos`),

  getTopRatedMovies: (page = 1) =>
    tmdbApi.get(`/movie/top_rated?page=${page}`),

  getUpcomingMovies: (page = 1) =>
    tmdbApi.get(`/movie/upcoming?page=${page}`),

  getMoviesByGenre: (genreId, page = 1) =>
    tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}`),

  getPersonDetails: (personId) =>
    tmdbApi.get(`/person/${personId}?append_to_response=movie_credits,tv_credits`),

  getGenreList: () =>
    tmdbApi.get(`/genre/movie/list`)
};

// ─── BACKEND API FUNCTIONS ─────────────────────────────
export const authApi = {
  register: (data) => backendApi.post('/api/auth/register', data),
  login: (data) => backendApi.post('/api/auth/login', data),
  getMe: () => backendApi.get('/api/auth/me'),
  logout: () => backendApi.post('/api/auth/logout')
};

export const favoritesApi = {
  getAll: () => backendApi.get('/api/favorites'),
  add: (data) => backendApi.post('/api/favorites', data),
  remove: (tmdbId) => backendApi.delete(`/api/favorites/${tmdbId}`),
  check: (tmdbId) => backendApi.get(`/api/favorites/check/${tmdbId}`)
};

export const historyApi = {
  getAll: () => backendApi.get('/api/history'),
  add: (data) => backendApi.post('/api/history', data),
  removeOne: (id) => backendApi.delete(`/api/history/${id}`),
  clearAll: () => backendApi.delete('/api/history')
};

export const adminMoviesApi = {
  getAll: (page = 1) => backendApi.get(`/api/movies?page=${page}&limit=10`),
  getOne: (id) => backendApi.get(`/api/movies/${id}`),
  create: (data) => backendApi.post('/api/movies', data),
  update: (id, data) => backendApi.put(`/api/movies/${id}`, data),
  remove: (id) => backendApi.delete(`/api/movies/${id}`)
};

export const adminUsersApi = {
  getAll: () => backendApi.get('/api/admin/users'),
  getOne: (id) => backendApi.get(`/api/admin/users/${id}`),
  toggleBan: (id) => backendApi.put(`/api/admin/users/${id}/ban`),
  remove: (id) => backendApi.delete(`/api/admin/users/${id}`),
  getStats: () => backendApi.get('/api/admin/stats')
};
