const express = require('express');
const router = express.Router();
const { getHistory, addToHistory, removeFromHistory, clearHistory } = require('../controllers/watchHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getHistory);
router.post('/', addToHistory);
router.delete('/', clearHistory);
router.delete('/:id', removeFromHistory);

module.exports = router;
