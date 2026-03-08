# 🎬 BatMove — Movie Discovery Platform

A full-stack, production-grade movie discovery platform built with **Node.js/Express** backend and **React.js** frontend. Discover trending movies, TV shows, manage favorites, track watch history, and administer content — all with a premium dark cinematic UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Redux Toolkit, React Router v6, Axios, Vite |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB |
| **External API** | TMDB (The Movie Database) |
| **Styling** | Pure CSS with CSS Variables, Google Fonts |
| **Notifications** | react-hot-toast |

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or Atlas cloud instance)
- **TMDB API Key** — get one free at [themoviedb.org](https://www.themoviedb.org/settings/api)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env` and fill in your values (see Environment Variables table below), then:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Edit `frontend/.env` and fill in your values, then:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/batmove` |
| `JWT_SECRET` | Secret key for JWT tokens | `my_super_secret_key_123` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `TMDB_API_KEY` | TMDB API key | `abc123...` |
| `TMDB_BASE_URL` | TMDB API base URL | `https://api.themoviedb.org/3` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_TMDB_API_KEY` | TMDB API key | `abc123...` |
| `VITE_TMDB_BASE_URL` | TMDB API base URL | `https://api.themoviedb.org/3` |
| `VITE_TMDB_IMAGE_BASE_URL` | TMDB poster image URL | `https://image.tmdb.org/t/p/w500` |
| `VITE_TMDB_BACKDROP_URL` | TMDB backdrop image URL | `https://image.tmdb.org/t/p/original` |
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:5000` |

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| POST | `/api/auth/logout` | Logout | Public |

### Movies (`/api/movies`) — Admin-created
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/movies` | Get all movies (paginated) | Public |
| GET | `/api/movies/:id` | Get single movie | Public |
| POST | `/api/movies` | Create movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |

### Favorites (`/api/favorites`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/favorites` | Get favorites | Protected |
| POST | `/api/favorites` | Add favorite | Protected |
| GET | `/api/favorites/check/:tmdbId` | Check if favorited | Protected |
| DELETE | `/api/favorites/:tmdbId` | Remove favorite | Protected |

### Watch History (`/api/history`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/history` | Get history (max 50) | Protected |
| POST | `/api/history` | Add to history | Protected |
| DELETE | `/api/history/:id` | Remove entry | Protected |
| DELETE | `/api/history` | Clear all history | Protected |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get single user | Admin |
| PUT | `/api/admin/users/:id/ban` | Toggle ban | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

## Creating an Admin User

1. Register a regular user through the app
2. Open MongoDB (Compass, mongosh, or Atlas)
3. Update the user's role:

```javascript
db.users.updateOne(
  { email: "your-admin@email.com" },
  { $set: { role: "admin" } }
)
```

## Folder Structure

```
BatMove/
├── README.md
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/db.js
│   ├── models/         (User, Movie, Favorite, WatchHistory)
│   ├── controllers/    (auth, movie, favorite, watchHistory, admin)
│   ├── routes/         (auth, movie, favorite, watchHistory, admin)
│   ├── middleware/      (authMiddleware, adminMiddleware)
│   └── utils/          (errorHandler)
└── frontend/
    ├── .env
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── api/index.js          (single source of truth for all API calls)
        ├── app/store.js          (Redux store)
        ├── features/             (auth, movies, favorites, watchHistory slices)
        ├── hooks/                (useDebounce, useInfiniteScroll)
        ├── utils/                (constants, helpers)
        ├── components/
        │   ├── common/           (Navbar, Footer, MovieCard, etc.)
        │   └── admin/            (AdminSidebar, MovieForm, UserTable)
        ├── pages/                (Home, Movies, TVShows, Search, etc.)
        │   └── admin/            (Dashboard, Movies, Users management)
        ├── styles/global.css
        ├── App.jsx
        └── main.jsx
```

## License

MIT
