# Mutual Fund Tracker Backend

This is the backend API for the Mutual Fund Tracker application.

## Features

- User authentication (register/login)
- Save and manage mutual funds
- JWT-based authentication
- MongoDB database integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mutual-fund-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
```

3. Make sure MongoDB is running on your system

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Saved Funds Routes (`/api/saved-funds`)
- `GET /` - Get all saved funds for user (protected)
- `POST /` - Save a new fund (protected)
- `GET /check/:schemeCode` - Check if fund is saved (protected)
- `DELETE /:schemeCode` - Remove saved fund (protected)
- `PATCH /:schemeCode/nav` - Update fund NAV (protected)

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- timestamps

### SavedFund
- userId (ObjectId, ref: User, required)
- schemeCode (String, required)
- schemeName (String, required)
- currentNav (String, optional)
- timestamps
- Compound index on (userId, schemeCode) for uniqueness

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
``` 