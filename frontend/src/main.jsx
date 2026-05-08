import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import './styles/global.css';
import { useTheme } from './hooks/useTheme';

const ThemeInitializer = ({ children }) => {
  useTheme();
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeInitializer>
        <App />
      </ThemeInitializer>
    </Provider>
  </React.StrictMode>
);
