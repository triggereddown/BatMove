const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tmdbId: {
    type: String
  },
  movieDbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  title: {
    type: String,
    required: [true, 'Movie title is required']
  },
  posterPath: {
    type: String,
    default: ''
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv', 'custom'],
    default: 'movie'
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast user-based queries
watchHistorySchema.index({ userId: 1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
