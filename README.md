# Internship Tracker

A full-stack internship/job application tracker.

## Tech Stack
- **Frontend:** React (Create React App), React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth

## Features
- User registration and login
- Add, edit, view, and delete job applications
- Track application status (Applied, Interview, Offered, Rejected)
- Optional deadline and location tracking
- Optional document attachments (resume, cover letter, offer letter)

## Project Structure
- `client/` – React frontend
- `server/` – Express + MongoDB API

## Prerequisites
- Node.js 18+
- npm
- MongoDB connection string

## Setup

### 1) Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start backend:
```bash
npm run dev
```

### 2) Frontend
In a second terminal:
```bash
cd client
npm install
npm start
```

The frontend runs on `http://localhost:3000` and talks to the backend at `http://localhost:5000` by default.

## API Overview
- `POST /api/auth/register` – create account
- `POST /api/auth/login` – login
- `GET /api/jobs` – list jobs (auth required)
- `POST /api/jobs` – create a job (auth required)
- `PUT /api/jobs/:id` – update a job (auth required)
- `DELETE /api/jobs/:id` – delete a job (auth required)

## Notes
- Uploaded files are stored in `server/uploads/`.
- Make sure `JWT_SECRET` and `MONGO_URI` are set before running the server.