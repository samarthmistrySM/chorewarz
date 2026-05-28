# Task Tracking App

A shared flat task tracker with a Vite + React frontend and Node + Express backend using MongoDB.

## Features

- Shared schedule for 4 flatmates
- Garbage collection and water motor duties every 2 days per person
- Cleaning duty every 2 weeks per person
- Task completion with recurring schedule generation
- MVC backend structure with models, controllers, services, and routes

## Setup

### Backend

1. Open terminal in `server`
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Copy `.env.example` to `.env` and update `MONGO_URI` if needed
4. Seed initial data:
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open terminal in `ui`
2. Install dependencies:
   ```bash
   cd ui
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## Notes

- The frontend uses `http://localhost:4000/api/tasks` by default.
- Add `VITE_API_URL` in `ui/.env` if you want a different backend host.
- The backend uses MongoDB and expects `MONGO_URI` in `server/.env`.
