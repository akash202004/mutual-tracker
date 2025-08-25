# Mutual Fund Tracker

A full-stack web application to discover, track, and manage mutual fund investments. Built with React, TypeScript, Vite (frontend) and Express, MongoDB (backend).

## Features

- Search and view mutual funds with real-time NAV data
- Register/login and manage your account
- Save mutual funds to your personal list
- View details and historical NAV for each fund
- Remove funds from your saved list
- JWT-based authentication
- Responsive dark-themed UI

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT

## Project Structure

```
backend/      # Express API server
frontend/     # React client app
```

## Getting Started

### Backend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `backend/` with:
   ```env
   # Server port
   PORT=5000
   # Node environment
   NODE_ENV=development
   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/mutual-fund-tracker
   # JWT secret for authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   # Allowed CORS origin for frontend
   CORS_ORIGIN=http://localhost:3000
   ```
3. Start MongoDB locally
4. Run the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `frontend/` with:
   ```env
   # Backend API base URL
   VITE_BASE=http://localhost:5000/api
   # Mutual Fund public API base URL (required for fund data)
   VITE_MF=https://api.mfapi.in/mf
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

## API Endpoints

### User

- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile (auth required)

### Saved Funds

- `GET /api/saved-funds/` - List saved funds (auth required)
- `POST /api/saved-funds/` - Save a fund (auth required)
- `GET /api/saved-funds/check/:schemeCode` - Check if fund is saved
- `DELETE /api/saved-funds/:schemeCode` - Remove saved fund
- `PATCH /api/saved-funds/:schemeCode/nav` - Update NAV

## License

MIT
