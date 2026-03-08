const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
