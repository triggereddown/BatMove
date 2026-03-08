const User = require('../models/User');
const Movie = require('../models/Movie');
const Favorite = require('../models/Favorite');
const WatchHistory = require('../models/WatchHistory');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users
  });
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin only
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
};

// @desc    Ban/Unban user (toggle isBanned)
// @route   PUT /api/admin/users/:id/ban
// @access  Admin only
const toggleBanUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot ban an admin user'
    });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({
    success: true,
    data: user,
    message: user.isBanned ? 'User has been banned' : 'User has been unbanned'
  });
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete an admin user'
    });
  }

  // Clean up user related data
  await Favorite.deleteMany({ userId: user._id });
  await WatchHistory.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User and associated data deleted successfully'
  });
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getStats = async (req, res) => {
  const [totalUsers, totalMovies, totalFavorites, totalHistory] = await Promise.all([
    User.countDocuments(),
    Movie.countDocuments(),
    Favorite.countDocuments(),
    WatchHistory.countDocuments()
  ]);

  // Recent users (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalMovies,
      totalFavorites,
      totalHistory,
      recentUsers
    }
  });
};

module.exports = { getUsers, getUser, toggleBanUser, deleteUser, getStats };
