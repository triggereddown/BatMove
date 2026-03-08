import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiLogOut, FiSettings, FiUser, FiHeart, FiClock, FiFilm } from 'react-icons/fi';
import { logoutUser } from '../../features/auth/authSlice';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeMenus = () => setDropdownOpen(false);
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
  ];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-colors duration-300 border-b border-borderLayer backdrop-blur-xl ${scrolled ? 'bg-bgPrimary/95' : 'bg-bgPrimary/60'}`} id="main-nav">
      <div className="max-w-[1440px] mx-auto px-[4%] flex items-center justify-between h-[70px]">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-2xl px-1">🦇</span>
          <span className="font-heading text-accentPrimary tracking-widest text-[1.8rem] leading-none mt-1">BATMOVE</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 flex-1 px-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `px-4 py-2 rounded-md font-medium text-[0.95rem] transition-colors duration-250 ${isActive ? 'bg-white/5 text-textPrimary' : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'}`}
            >
              {link.name}
            </NavLink>
          ))}
          <div className="ml-4 flex-1">
            <SearchBar />
          </div>
        </nav>

        {/* Right Section (Auth / Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-borderLayer bg-glass transition-colors hover:border-textMuted"
                onClick={toggleDropdown}
                id="user-menu-btn"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accentPrimary flex items-center justify-center font-bold text-sm text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-textSecondary">{user?.username}</span>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-bgCard border border-borderLayer rounded-xl shadow-modal min-w-[200px] overflow-hidden z-[100] animate-drop-in">
                  <Link to="/favorites" className="flex items-center gap-2.5 px-4 py-3 text-sm text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-colors">
                    <FiHeart /> My Favorites
                  </Link>
                  <Link to="/history" className="flex items-center gap-2.5 px-4 py-3 text-sm text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-colors">
                    <FiClock /> Watch History
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-3 text-sm text-accentSecondary hover:bg-white/5 transition-colors font-medium border-t border-borderLayer">
                      <FiSettings /> Admin Panel
                    </Link>
                  )}
                  <div className="h-[1px] bg-borderLayer"></div>
                  <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-3 text-sm text-accentPrimary hover:bg-white/5 transition-colors w-full text-left font-medium" id="logout-btn">
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-base btn-ghost" id="login-link">Sign In</Link>
              <Link to="/register" className="btn btn-base btn-primary" id="register-link">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-textPrimary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-[70px] left-0 w-full h-[calc(100vh-70px)] bg-bgPrimary/98 backdrop-blur-xl flex flex-col items-center justify-center gap-4 transition-transform duration-300 z-[999] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-[80%] mb-4">
          <SearchBar onClose={() => setMobileMenuOpen(false)} />
        </div>
        
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-xl py-3 px-6 text-textSecondary hover:text-textPrimary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <div className="w-[80%] border-t border-borderLayer mt-4 pt-4 flex flex-col items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-textMuted text-sm mb-2">Logged in as {user?.username}</span>
              <Link to="/favorites" className="w-full text-center py-3 text-textSecondary" onClick={() => setMobileMenuOpen(false)}>My Favorites</Link>
              <Link to="/history" className="w-full text-center py-3 text-textSecondary" onClick={() => setMobileMenuOpen(false)}>Watch History</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="w-full text-center py-3 text-accentSecondary" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="w-full btn btn-base btn-ghost mt-2 border-accentPrimary text-accentPrimary">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="w-full btn btn-base btn-ghost justify-center" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="w-full btn btn-base btn-primary justify-center mt-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
