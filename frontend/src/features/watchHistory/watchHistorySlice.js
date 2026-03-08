import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { historyApi } from '../../api';

export const fetchHistory = createAsyncThunk(
  'watchHistory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await historyApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const addToHistory = createAsyncThunk(
  'watchHistory/add',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await historyApi.add(movieData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to history');
    }
  }
);

export const removeFromHistory = createAsyncThunk(
  'watchHistory/remove',
  async (id, { rejectWithValue }) => {
    try {
      await historyApi.removeOne(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from history');
    }
  }
);

export const clearHistory = createAsyncThunk(
  'watchHistory/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await historyApi.clearAll();
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear history');
    }
  }
);

const watchHistorySlice = createSlice({
  name: 'watchHistory',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearHistoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        const exists = state.items.findIndex(i => i._id === action.payload._id);
        if (exists >= 0) {
          state.items.splice(exists, 1);
        }
        state.items.unshift(action.payload);
      })
      .addCase(removeFromHistory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { clearHistoryError } = watchHistorySlice.actions;
export default watchHistorySlice.reducer;
