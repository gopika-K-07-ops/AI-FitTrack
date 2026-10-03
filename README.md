# AI FitTrack — MERN AI Fitness Platform

A full-stack MERN starter project for the AI FitTrack specification.

## Stack
- Frontend: React, Vite, Axios, React Router, Redux Toolkit, Chart.js
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB
- AI: Google Gemini API
- Security: Helmet, CORS, express-rate-limit, validation, protected routes

## Project structure

AI-FitTrack/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md

## Run

### 1. MongoDB
Start MongoDB locally or use MongoDB Atlas.

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:
```bash
cp .env.example .env
```

Backend runs on `http://localhost:5000`.

### 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal.

## Environment variables

Backend `.env`:
- MONGO_URI
- JWT_SECRET
- GEMINI_API_KEY
- PORT
- CLIENT_URL

Frontend `.env`:
- VITE_API_URL

The Gemini key is never placed in frontend code.

## Main API routes

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Workouts:
- GET /api/workouts
- POST /api/workouts
- PUT /api/workouts/:id
- DELETE /api/workouts/:id
- POST /api/workouts/:id/complete

Goals:
- GET /api/goals
- POST /api/goals

Progress:
- GET /api/progress/summary

AI:
- POST /api/ai/recommend

Admin:
- GET /api/admin/stats

Health:
- GET /api/health

## Demo admin
Register a normal user first. To create an admin, set the user's MongoDB `role` to `admin` in the database.

## Notes
This is a working full-stack starter. Real Gemini responses require a valid GEMINI_API_KEY. Fitness recommendations are informational and should not replace professional medical advice.
