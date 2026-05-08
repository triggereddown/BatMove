import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import moviesReducer from '../features/movies/moviesSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import watchHistoryReducer from '../features/watchHistory/watchHistorySlice';
import themeReducer from '../features/theme/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    watchHistory: watchHistoryReducer,
    theme: themeReducer
  },
  devTools: import.meta.env.DEV
});

export default store;
