import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../api';
import { DEFAULT_POSTER } from './constants';

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date like "March 8, 2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Date unavailable';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Date unavailable';
  }
};

/**
 * Truncate text to max length with ellipsis
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return 'Description not available';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get CSS color class based on rating score
 */
export const getRatingColor = (rating) => {
  if (rating >= 8) return 'rating-excellent';
  if (rating >= 6) return 'rating-good';
  if (rating >= 4) return 'rating-average';
  return 'rating-poor';
};

/**
 * Get YouTube embed URL from various formats
 */
export const getYouTubeEmbedUrl = (link) => {
  if (!link) return null;

  // Already an embed URL
  if (link.includes('youtube.com/embed/')) return link;

  // Full YouTube URL
  const fullMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (fullMatch) return `https://www.youtube.com/embed/${fullMatch[1]}`;

  // Just a key
  if (/^[a-zA-Z0-9_-]+$/.test(link)) {
    return `https://www.youtube.com/embed/${link}`;
  }

  return null;
};

/**
 * Get image URL with fallback
 */
export const getImageUrl = (path) => {
  if (!path || path === '') return DEFAULT_POSTER;
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}${path}`;
};

/**
 * Get backdrop URL with fallback
 */
export const getBackdropUrl = (path) => {
  if (!path || path === '') return null;
  if (path.startsWith('http')) return path;
  return `${BACKDROP_BASE_URL}${path}`;
};

/**
 * Extract trailer key from TMDB videos response
 */
export const extractTrailerKey = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) return null;

  const trailer = videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  if (trailer) return trailer.key;

  // Fallback to any YouTube video
  const anyYouTube = videos.results.find((v) => v.site === 'YouTube');
  return anyYouTube ? anyYouTube.key : null;
};

/**
 * Get year from date string
 */
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

/**
 * Format vote average to one decimal
 */
export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'NR';
  return Number(rating).toFixed(1);
};
