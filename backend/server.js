require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const watchHistoryRoutes = require('./routes/watchHistoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ─── MIDDLEWARE ─────────────────────────────────────────
const allowedOrigins = [
  'https://bat-move.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── ROUTES ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BatMove API is running 🎬' });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', watchHistoryRoutes);
app.use('/api/admin', adminRoutes);

// ─── GLOBAL ERROR HANDLER ──────────────────────────────
app.use(errorHandler);

// ─── START SERVER ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 BatMove API running on port ${PORT}`);
  });
};

startServer();
