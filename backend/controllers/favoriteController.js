const Favorite = require('../models/Favorite');

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Protected
const getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).sort({ addedAt: -1 });

  res.json({
    success: true,
    data: favorites
  });
};

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Protected
const addFavorite = async (req, res) => {
  const { tmdbId, movieDbId, title, posterPath, mediaType } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Movie title is required'
    });
  }

  if (!tmdbId && !movieDbId) {
    return res.status(400).json({
      success: false,
      message: 'Either tmdbId or movieDbId is required'
    });
  }

  // Check for existing favorite
  const existing = await Favorite.findOne({ userId: req.user._id, tmdbId });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Movie is already in your favorites'
    });
  }

  const favorite = await Favorite.create({
    userId: req.user._id,
    tmdbId,
    movieDbId,
    title,
    posterPath,
    mediaType
  });

  res.status(201).json({
    success: true,
    data: favorite,
    message: 'Added to favorites'
  });
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:tmdbId
// @access  Protected
const removeFavorite = async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    userId: req.user._id,
    tmdbId: req.params.tmdbId
  });

  if (!favorite) {
    return res.status(404).json({
      success: false,
      message: 'Favorite not found'
    });
  }

  res.json({
    success: true,
    message: 'Removed from favorites'
  });
};

// @desc    Check if movie is in favorites
// @route   GET /api/favorites/check/:tmdbId
// @access  Protected
const checkFavorite = async (req, res) => {
  const favorite = await Favorite.findOne({
    userId: req.user._id,
    tmdbId: req.params.tmdbId
  });

  res.json({
    success: true,
    data: { isFavorite: !!favorite }
  });
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
