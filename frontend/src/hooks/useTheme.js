import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode, setTheme, toggleTheme as toggleThemeAction } from '../features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);

  useEffect(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem('cinemate-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      dispatch(setTheme(savedTheme));
    } else {
      // 2. Check system preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(isSystemDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  useEffect(() => {
    // Sync <html> element class
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    // Update local storage
    localStorage.setItem('cinemate-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return {
    mode,
    isDark: mode === 'dark',
    toggleTheme,
    setTheme: (newMode) => dispatch(setTheme(newMode))
  };
};
