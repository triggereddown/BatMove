import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbEndpoints } from '../../api';

// ─── THUNKS ────────────────────────────────────────────

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getTrending('all', 'week');
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch trending');
    }
  }
);

export const fetchPopular = createAsyncThunk(
  'movies/fetchPopular',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getPopularMovies(page);
      return { results: response.data.results, totalPages: response.data.total_pages, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch popular movies');
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  'movies/fetchTopRated',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getTopRatedMovies(page);
      return { results: response.data.results, totalPages: response.data.total_pages, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch top rated');
    }
  }
);

export const fetchUpcoming = createAsyncThunk(
  'movies/fetchUpcoming',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getUpcomingMovies(page);
      return { results: response.data.results, totalPages: response.data.total_pages, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch upcoming');
    }
  }
);

export const fetchTVShows = createAsyncThunk(
  'movies/fetchTVShows',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getPopularTVShows(page);
      return { results: response.data.results, totalPages: response.data.total_pages, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch TV shows');
    }
  }
);

export const fetchMovieDetail = createAsyncThunk(
  'movies/fetchMovieDetail',
  async ({ id, mediaType = 'movie' }, { rejectWithValue }) => {
    try {
      const response = mediaType === 'tv'
        ? await tmdbEndpoints.getTVDetails(id)
        : await tmdbEndpoints.getMovieDetails(id);
      return { ...response.data, media_type: mediaType };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch details');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.searchMulti(query, page);
      return {
        results: response.data.results,
        totalPages: response.data.total_pages,
        page
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Search failed');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getGenreList();
      return response.data.genres;
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch genres');
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchMoviesByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbEndpoints.getMoviesByGenre(genreId, page);
      return { results: response.data.results, totalPages: response.data.total_pages, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch by genre');
    }
  }
);

// ─── SLICE ─────────────────────────────────────────────

const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  upcoming: [],
  tvShows: [],
  searchResults: [],
  currentMovie: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 0,
  genres: []
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.page = 1;
      state.totalPages = 0;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.pending, (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Popular
      .addCase(fetchPopular.pending, (state) => { state.loading = true; })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.popular = action.payload.results;
        } else {
          state.popular = [...state.popular, ...action.payload.results];
        }
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Top Rated
      .addCase(fetchTopRated.pending, (state) => { state.loading = true; })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.topRated = action.payload.results;
        } else {
          state.topRated = [...state.topRated, ...action.payload.results];
        }
      })
      .addCase(fetchTopRated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upcoming
      .addCase(fetchUpcoming.pending, (state) => { state.loading = true; })
      .addCase(fetchUpcoming.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.upcoming = action.payload.results;
        } else {
          state.upcoming = [...state.upcoming, ...action.payload.results];
        }
      })
      .addCase(fetchUpcoming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // TV Shows
      .addCase(fetchTVShows.pending, (state) => { state.loading = true; })
      .addCase(fetchTVShows.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.tvShows = action.payload.results;
        } else {
          state.tvShows = [...state.tvShows, ...action.payload.results];
        }
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchTVShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Movie Detail
      .addCase(fetchMovieDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search
      .addCase(searchMovies.pending, (state) => { state.loading = true; })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.searchResults = action.payload.results;
        } else {
          state.searchResults = [...state.searchResults, ...action.payload.results];
        }
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Genres
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      // Movies by Genre
      .addCase(fetchMoviesByGenre.pending, (state) => { state.loading = true; })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.popular = action.payload.results;
        } else {
          state.popular = [...state.popular, ...action.payload.results];
        }
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentMovie, clearSearchResults, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
