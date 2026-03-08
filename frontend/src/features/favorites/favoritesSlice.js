import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.add(movieData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (tmdbId, { rejectWithValue }) => {
    try {
      await favoritesApi.remove(tmdbId);
      return tmdbId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearFavoritesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.pending, (state) => { state.loading = true; })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFavorite.pending, (state) => { state.loading = true; })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.tmdbId !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
