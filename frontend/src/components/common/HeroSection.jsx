import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import TrailerModal from './TrailerModal';
import { getBackdropUrl, extractTrailerKey, truncateText, getYear } from '../../utils/helpers';

const HeroSection = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  if (!movie) return <div className="h-[85vh] bg-bgSecondary skeleton-shimmer"></div>;

  const title = movie.title || movie.name;
  const overview = truncateText(movie.overview, 180);
  const releaseDate = movie.release_date || movie.first_air_date;
  const rating = movie.vote_average;
  const isTV = Boolean(movie.name);
  const trailerKey = extractTrailerKey(movie.videos);

  return (
    <div className="relative w-full min-h-[75vh] md:min-h-[85vh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/60 to-transparent md:bg-gradient-to-r md:from-bgPrimary/95 md:via-bgPrimary/50 md:to-transparent flex items-end md:items-center px-[4%] md:px-[6%] pb-10 md:pb-0">
        <div className="max-w-[700px] md:pt-16 animate-slide-in">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-wide mb-4 text-white">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {rating > 0 && (
              <span className="flex items-center gap-1.5 text-accentSecondary font-mono font-bold text-lg">
                <FiStar className="fill-current" /> {rating.toFixed(1)} / 10
              </span>
            )}
            {releaseDate && (
              <span className="text-textSecondary text-[0.95rem] py-0.5 px-2.5 border border-borderLayer rounded-md">
                {getYear(releaseDate)}
              </span>
            )}
            <span className="text-textSecondary text-[0.95rem] py-0.5 px-2.5 border border-borderLayer rounded-md uppercase tracking-wider text-xs">
              {isTV ? 'TV Series' : 'Movie'}
            </span>
          </div>
          
          <p className="text-textSecondary text-[1.05rem] leading-relaxed mb-6 hidden md:block">
            {overview}
          </p>

          <div className="flex gap-4 flex-wrap">
            <button className="btn btn-base btn-primary" onClick={() => setShowTrailer(true)}>
              <FiPlay className="fill-current" /> Watch Trailer
            </button>
            <button className="btn btn-base btn-ghost" onClick={() => navigate(`/${isTV ? 'tv' : 'movie'}/${movie.id}`)}>
              <FiInfo /> More Info
            </button>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal trailerKey={trailerKey} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
};

export default HeroSection;
