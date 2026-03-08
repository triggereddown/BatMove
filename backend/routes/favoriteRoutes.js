const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:tmdbId', checkFavorite);
router.delete('/:tmdbId', removeFavorite);

module.exports = router;
