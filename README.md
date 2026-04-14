# Internship Tracker

A full-stack web app for tracking internship/job applications from first apply to final outcome. It includes secure authentication, per-user application management, file attachments, status tracking, deadline/follow-up reminders, and optional map previews for application locations.

## Features

- **Authentication**
  - Register and log in with JWT-based auth.
  - Passwords are hashed with bcrypt before storage.
- **Application tracking**
  - Create, list, and delete applications.
  - Track `Applied`, `Interview`, `Offered`, and `Rejected` states.
  - Save optional deadlines.
- **Documents**
  - Attach resume, cover letter, and offer letter.
  - Files are uploaded from the client as Base64 and saved on the server.
- **Location + maps**
  - Store city/state and optional latitude/longitude.
  - Dashboard renders embedded OpenStreetMap preview when coordinates exist.
- **Smart reminders**
  - Deadline reminders when an application due date is within 0–2 days.
  - Follow-up reminder for applications still in `Applied` after 7 days.
- **Deployment-ready structure**
  - Includes Render deployment config for API and static frontend.

## Tech Stack

### Frontend (`client/`)
- React (Create React App)
- React Router
- Axios
- CSS variables design system (dark UI)

### Backend (`server/`)
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- CORS + dotenv

## Project Structure

```text
internship-tracker/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Shared UI components (Navbar)
│       ├── pages/          # Login/Register/Dashboard/AddJob pages
│       └── api.js          # API base URL + auth header helper
├── server/                 # Express API
│   ├── controllers/        # Auth + job business logic
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas (User, Job)
│   ├── routes/             # Auth + jobs routes
│   ├── uploads/            # Saved document files (runtime)
│   └── server.js           # API entry point
└── render.yaml             # Render multi-service deployment config
```

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

### 1) Clone and install

```bash
git clone https://github.com/Sauood-Ansari/internship-tracker.git
cd internship-tracker

cd server && npm install
cd ../client && npm install
```

### 2) Configure environment variables

Create `server/.env`:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_jwt_secret>
PORT=5000
MAIL_WEBHOOK_URL=<your_email_provider_webhook_url>
MAIL_WEBHOOK_TOKEN=<optional_bearer_token_for_webhook>
```

Optional for client (`client/.env`):

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

If omitted, the client uses the deployed API URL in `client/src/api.js`.

### 3) Run the app

In one terminal (backend):

```bash
cd server
npm run dev
```

In another terminal (frontend):

```bash
cd client
npm start
```

Then open: `http://localhost:3000`

## API Overview

Base URL (local): `http://localhost:5000`

### Auth
- `POST /api/auth/register`
  - body: `{ name, email, password }`
- `POST /api/auth/login`
  - body: `{ email, password }`
  - response includes JWT token

### Jobs (requires `Authorization: Bearer <token>`)
- `POST /api/jobs` create application
- `GET /api/jobs` list current user applications
- `DELETE /api/jobs/:id` delete one application

### Create Job Request Example

```json
{
  "title": "Software Engineering Intern",
  "company": "Acme Inc",
  "status": "Applied",
  "deadline": "2026-05-20",
  "city": "San Francisco",
  "state": "CA",
  "lat": 37.7749,
  "lng": -122.4194,
  "resumeFile": "data:application/pdf;base64,...",
  "coverLetterFile": "data:application/pdf;base64,...",
  "offerLetterFile": ""
}
```

## Data Model Summary

### User
- `name` (required)
- `email` (required, unique)
- `password` (required, hashed)

### Job
- `title`, `company`, `status`
- `deadline`
- `userId`
- `location`: `city`, `state`, `lat`, `lng`
- `documents`: `resume`, `coverLetter`, `offerLetter`
- automatic `createdAt` / `updatedAt`

## Deployment (Render)

This repo ships with a root `render.yaml` that defines:
- **Node web service** for `server/`
- **Static web service** for `client/`
- environment variables for `MONGO_URI`, `JWT_SECRET`, and `REACT_APP_API_BASE_URL`

For SPA routing, the client is configured to rewrite all routes to `index.html`.

## Known Notes

- Uploaded files are stored on the API filesystem under `server/uploads/`.
  - For production, you may want persistent cloud storage (S3, Cloudinary, etc.).
- The dashboard assumes a valid token exists in localStorage when calling protected routes.
- Add stronger validation/authorization checks before production hardening.

## Roadmap Ideas

- Search/filter/sort applications
- Email or push notifications for reminders
- Kanban board for status columns
- Analytics (conversion rates, response time, company pipeline)
- Role-based admin/reporting
