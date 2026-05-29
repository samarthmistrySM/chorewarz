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

- The frontend uses `http://localhost:4000` by default (`VITE_API_URL` in `ui/.env`).
- The backend uses MongoDB and expects `MONGO_URI` in `server/.env`.
- Run MongoDB locally (or use Atlas) before `npm run dev` in `server`.

### Deploying on Vercel

**UI (`ui` project)**

1. Set **Root Directory** to `ui`.
2. Add env var `VITE_API_URL` = your public API URL (not `localhost`).
3. `ui/vercel.json` rewrites all routes to `index.html` so refresh on `/groups/...` works.

**API (`server` project)**

1. Set **Root Directory** to `server`.
2. Add `MONGO_URI`, `JWT_SECRET`, and other vars from `server/.env.example`.
3. Use a hosted MongoDB (e.g. Atlas); `127.0.0.1` will not work on Vercel.
