import { Link } from 'react-router-dom';
import { FiHeart, FiFilm, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-bgSecondary border-t border-borderLayer pt-12 mt-16 pb-6 px-[4%]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl px-1">🦇</span>
              <span className="font-heading text-accentPrimary tracking-widest text-2xl">BATMOVE</span>
            </Link>
            <p className="text-textSecondary text-sm leading-relaxed max-w-[300px]">
              Your premium destination for discovering movies, exploring TV shows, 
              and tracking your entertainment journey.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-textPrimary text-base tracking-[0.12em] uppercase mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/movies" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">Movies</Link>
              <Link to="/tv" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">TV Shows</Link>
              <Link to="/search" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">Search</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-textPrimary text-base tracking-[0.12em] uppercase mb-4">Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">Sign In</Link>
              <Link to="/register" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">Create Account</Link>
              <Link to="/favorites" className="text-textSecondary text-sm hover:text-textPrimary transition-colors">My Favorites</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-textPrimary text-base tracking-[0.12em] uppercase mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors"><FiGithub size={20} /></a>
            </div>
            <p className="text-textSecondary text-xs">Powered by TMDB API</p>
          </div>
        </div>

        <div className="border-t border-borderLayer pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-textMuted text-xs">
            &copy; {new Date().getFullYear()} BatMove Platform. All rights reserved.
          </p>
          <p className="text-textMuted text-xs flex items-center gap-1.5">
            Designed with <FiHeart className="text-accentPrimary fill-current" size={12} /> for movie lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
