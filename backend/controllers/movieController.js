const Movie = require('../models/Movie');

// @desc    Get all admin movies (paginated)
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Movie.countDocuments();
  const movies = await Movie.find()
    .populate('addedBy', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: movies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('addedBy', 'username');

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  res.json({
    success: true,
    data: movie
  });
};

// @desc    Create a movie
// @route   POST /api/movies
// @access  Admin only
const createMovie = async (req, res) => {
  const { title, description, posterUrl, backdropUrl, trailerYoutubeLink, releaseDate, genre, category, tmdbId, rating } = req.body;

  if (!title || !releaseDate) {
    return res.status(400).json({
      success: false,
      message: 'Title and release date are required'
    });
  }

  const movie = await Movie.create({
    title,
    description,
    posterUrl,
    backdropUrl,
    trailerYoutubeLink,
    releaseDate,
    genre: genre || [],
    category,
    tmdbId,
    rating,
    addedBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: movie,
    message: 'Movie created successfully'
  });
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Admin only
const updateMovie = async (req, res) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: movie,
    message: 'Movie updated successfully'
  });
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Admin only
const deleteMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  await Movie.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Movie deleted successfully'
  });
};

module.exports = { getMovies, getMovie, createMovie, updateMovie, deleteMovie };
