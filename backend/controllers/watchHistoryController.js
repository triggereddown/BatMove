const WatchHistory = require('../models/WatchHistory');

const MAX_HISTORY = 50;

// @desc    Get user's watch history
// @route   GET /api/history
// @access  Protected
const getHistory = async (req, res) => {
  const history = await WatchHistory.find({ userId: req.user._id })
    .sort({ watchedAt: -1 })
    .limit(MAX_HISTORY);

  res.json({
    success: true,
    data: history
  });
};

// @desc    Add to watch history
// @route   POST /api/history
// @access  Protected
const addToHistory = async (req, res) => {
  const { tmdbId, movieDbId, title, posterPath, mediaType } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Movie title is required'
    });
  }

  // Check if this movie was already viewed recently and update timestamp
  const existing = await WatchHistory.findOne({
    userId: req.user._id,
    tmdbId
  });

  if (existing) {
    existing.watchedAt = Date.now();
    await existing.save();

    return res.json({
      success: true,
      data: existing,
      message: 'Watch history updated'
    });
  }

  // Cap at MAX_HISTORY entries — delete oldest if over limit
  const count = await WatchHistory.countDocuments({ userId: req.user._id });
  if (count >= MAX_HISTORY) {
    const oldest = await WatchHistory.find({ userId: req.user._id })
      .sort({ watchedAt: 1 })
      .limit(count - MAX_HISTORY + 1);

    const idsToDelete = oldest.map((entry) => entry._id);
    await WatchHistory.deleteMany({ _id: { $in: idsToDelete } });
  }

  const entry = await WatchHistory.create({
    userId: req.user._id,
    tmdbId,
    movieDbId,
    title,
    posterPath,
    mediaType
  });

  res.status(201).json({
    success: true,
    data: entry,
    message: 'Added to watch history'
  });
};

// @desc    Remove one history entry
// @route   DELETE /api/history/:id
// @access  Protected
const removeFromHistory = async (req, res) => {
  const entry = await WatchHistory.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: 'History entry not found'
    });
  }

  res.json({
    success: true,
    message: 'History entry removed'
  });
};

// @desc    Clear all history
// @route   DELETE /api/history
// @access  Protected
const clearHistory = async (req, res) => {
  await WatchHistory.deleteMany({ userId: req.user._id });

  res.json({
    success: true,
    message: 'Watch history cleared'
  });
};

module.exports = { getHistory, addToHistory, removeFromHistory, clearHistory };
