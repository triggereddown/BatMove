const express = require('express');
const router = express.Router();
const { getUsers, getUser, toggleBanUser, deleteUser, getStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
