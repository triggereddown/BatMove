const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    default: 'Description not available'
  },
  posterUrl: {
    type: String,
    default: ''
  },
  backdropUrl: {
    type: String,
    default: ''
  },
  trailerYoutubeLink: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: String,
    required: [true, 'Release date is required']
  },
  genre: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['movie', 'tv', 'anime', 'documentary'],
    default: 'movie'
  },
  tmdbId: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

movieSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
