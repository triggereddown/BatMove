import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiLogOut, FiSettings, FiUser, FiHeart, FiClock, FiFilm } from 'react-icons/fi';
import { logoutUser } from '../../features/auth/authSlice';
import SearchBar from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeLink = document.querySelector('.nav-link.active');
      const navContainer = document.querySelector('.desktop-nav');
      if (activeLink && navContainer) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = navContainer.getBoundingClientRect();
        setIndicatorStyle({
          width: linkRect.width - 16, // approximate padding
          transform: `translateX(${linkRect.left - navRect.left + 8}px)`, // center
          opacity: 1,
        });
      } else {
        setIndicatorStyle({ opacity: 0 });
      }
    };
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname]);

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
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] border-b border-borderLayer ${scrolled ? 'bg-navbarBg backdrop-blur-xl h-[60px]' : 'bg-transparent backdrop-blur-md h-[80px]'}`} id="main-nav">
      <div className="max-w-[1440px] mx-auto px-[4%] flex items-center justify-between h-full">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-2xl px-1">🦇</span>
          <span className="font-heading text-accentPrimary tracking-[0.15em] text-[1.8rem] leading-none mt-1 transition-transform duration-300 group-hover:scale-[1.03]">
            BATMOVE
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="desktop-nav relative hidden md:flex items-center gap-2 flex-1 px-8">
          <div 
            className="absolute bottom-[-10px] h-[3px] rounded-t-sm bg-accentPrimary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(229,9,20,0.4)]" 
            style={indicatorStyle}
          />
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active text-textPrimary' : 'text-textSecondary hover:text-textPrimary hover:bg-glass'} px-4 py-2 rounded-md font-medium text-[0.95rem] transition-colors duration-250`}
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
                <div className="absolute top-[calc(100%+8px)] right-0 bg-bgCard border border-borderLayer rounded-xl shadow-[var(--shadow-card)] min-w-[200px] overflow-hidden z-[100] animate-drop-in">
                  <Link to="/favorites" className="flex items-center gap-2.5 px-4 py-3 text-sm text-textSecondary hover:bg-glass hover:text-textPrimary transition-colors">
                    <FiHeart /> My Favorites
                  </Link>
                  <Link to="/history" className="flex items-center gap-2.5 px-4 py-3 text-sm text-textSecondary hover:bg-glass hover:text-textPrimary transition-colors">
                    <FiClock /> Watch History
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-3 text-sm text-accentSecondary hover:bg-glass transition-colors font-medium border-t border-borderLayer">
                      <FiSettings /> Admin Panel
                    </Link>
                  )}
                  <div className="h-[1px] bg-borderLayer"></div>
                  <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-3 text-sm text-accentPrimary hover:bg-glass transition-colors w-full text-left font-medium" id="logout-btn">
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
          
          <div className="ml-2 pl-2 border-l border-borderLayer hidden md:block">
            <ThemeToggle />
          </div>
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
      <div className={`md:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-bgPrimary/98 backdrop-blur-xl flex flex-col items-center justify-start pt-10 gap-4 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] z-[999] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-[80%] mb-4 opacity-0 animate-[heroSlideIn_0.4s_ease_0.1s_forwards]">
          <SearchBar onClose={() => setMobileMenuOpen(false)} />
        </div>
        
        {navLinks.map((link, index) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-xl py-2 px-6 text-textSecondary hover:text-textPrimary transition-colors opacity-0 animate-[heroSlideIn_0.4s_ease_forwards]"
            style={{ animationDelay: `${0.15 + (index * 0.06)}s` }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <div className="w-[80%] border-t border-borderLayer mt-4 pt-6 flex flex-col items-center gap-3 opacity-0 animate-[heroSlideIn_0.4s_ease_0.35s_forwards]">
          
          <div className="mb-4">
            <ThemeToggle />
          </div>
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
