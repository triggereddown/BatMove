import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchCurrentUser } from './features/auth/authSlice';
import { fetchFavorites } from './features/favorites/favoritesSlice';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/AdminSidebar';

// Protected routes
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import WatchHistory from './pages/WatchHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminAddMovie from './pages/admin/AdminAddMovie';
import AdminEditMovie from './pages/admin/AdminEditMovie';
import AdminUsers from './pages/admin/AdminUsers';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AdminLayout = ({ children }) => (
  <div className="flex flex-col lg:flex-row min-h-screen bg-bgPrimary">
    <AdminSidebar />
    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
      {children}
    </main>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16161e',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.07)'
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#16161e' } },
          error: { iconTheme: { primary: '#e50914', secondary: '#16161e' } }
        }}
      />

      <Routes>
        {/* Admin Routes — separate layout without Navbar/Footer */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/movies" element={<AdminRoute><AdminLayout><AdminMovies /></AdminLayout></AdminRoute>} />
        <Route path="/admin/movies/add" element={<AdminRoute><AdminLayout><AdminAddMovie /></AdminLayout></AdminRoute>} />
        <Route path="/admin/movies/edit/:id" element={<AdminRoute><AdminLayout><AdminEditMovie /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />

        {/* Public and Protected Routes — with Navbar/Footer */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen bg-bgPrimary text-textPrimary font-body">
            <Navbar />
            <main className="flex-1 pt-[70px]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TVShows />} />
                <Route path="/movie/:id" element={<MovieDetail mediaType="movie" />} />
                <Route path="/tv/:id" element={<MovieDetail mediaType="tv" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
