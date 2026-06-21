# Nawed Portfolio - React + Express + Supabase

A full-stack personal portfolio for Md Nawed Alam, Full Stack Developer.

## Project Structure

```
nawed-portfolio/
├── api/
│   └── server.js         ← Express API routes and Render/Vercel backend entry
├── supabase/
│   └── schema.sql        ← Message table, indexes, grants, and RLS setup
├── public/
│   └── Nawed_Resume.pdf  ← Downloadable CV
└── src/
    ├── components/
    │   ├── Navbar.js
    │   ├── Hero.js       ← Photo embedded as base64
    │   ├── Stats.js
    │   ├── Projects.js   ← 12 projects with filter tabs
    │   ├── Services.js
    │   ├── Skills.js
    │   ├── HireModal.js  ← POST to /api/hire
    │   ├── Contact.js    ← POST to /api/contact
    │   └── Footer.js
    ├── data/
    │   └── projects.js   ← All project + skill data
    └── App.js
```

## Setup & Run

### 1. Frontend
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

### 2. Backend
```bash
npm install
# Set env vars:
# MAIL_USER=mdalamnawed@gmail.com
# MAIL_PASS=your_gmail_app_password
npm start
# Runs on http://localhost:5000
```

### 3. Gmail App Password
- Go to Google Account → Security → 2-Step Verification → App passwords
- Generate a password for "Mail"
- Set as MAIL_PASS env variable

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/hire | Sends hire inquiry email |
| POST | /api/contact | Sends general contact email |
| GET | /api/admin/messages | Lists all messages for the admin |
| PATCH | /api/admin/messages/:id | Updates message status |
| DELETE | /api/admin/messages/:id | Deletes a message |

## Supabase message backend

1. Create a Supabase project.
2. Open its SQL Editor and run `supabase/schema.sql` once.
3. Add these server environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`)
   - `ADMIN_EMAILS=your-admin-email@gmail.com`
4. Never expose the Supabase secret key through a `VITE_` environment variable.

The `portfolio_messages` table has RLS enabled. Browser roles have no table access; only the server API can manage messages. If Supabase is not configured, the API temporarily falls back to MongoDB.

## Deploy
- Frontend: Vercel / GitHub Pages / Hostinger static site (`npm run build`)
- Backend: Vercel serverless API or Render web service

### Vercel frontend and API
This repository can run the frontend and API together on Vercel.

1. Vercel build command: `npm run build`
2. Vercel output directory: `build`
3. Vercel rewrites `/api/*` to `api/server.js`.
4. Add environment variables in Vercel:
   - `MAIL_USER`
   - `MAIL_PASS`
   - `RECIPIENT_EMAIL`
   - `JWT_SECRET`
   - `ADMIN_EMAILS`
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `MONGO_URI` optional
   - `MONGO_DB_NAME` optional

### Render backend deployment
The backend can also run as a normal Node web service on Render using `render.yaml`.

1. Connect this GitHub repository to Render.
2. Create a new Web Service or Blueprint from `render.yaml`.
3. Render settings:
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/api/health`
4. Add environment variables in Render:
   - `MAIL_USER`
   - `MAIL_PASS`
   - `RECIPIENT_EMAIL`
   - `JWT_SECRET`
   - `ADMIN_EMAILS`
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `MONGO_URI` optional
   - `MONGO_DB_NAME=portfolio`
   - `CORS_ORIGIN=https://naweddev.com,https://nawed-portfolio-mohdnaweds-projects.vercel.app`
5. After Render gives you a backend URL, set this in Vercel:
   - `VITE_API_BASE_URL=https://your-render-service.onrender.com`
6. Redeploy Vercel so the frontend sends contact and hire form requests to Render.

### Hostinger ready deployment

#### Option A — Full Hostinger deployment with Node backend
1. Build frontend:
   ```bash
   npm install
   npm run build
   ```
2. Upload the generated `build/` folder to Hostinger static site hosting.
3. Deploy backend under Hostinger Node.js hosting:
   - Upload the project files
   - Run `npm install` in the project root
   - Set the backend start command to `npm start`
4. Configure backend environment variables in Hostinger:
   - `MONGO_URI`
   - `MONGO_DB_NAME`
   - `MAIL_USER`
   - `MAIL_PASS`
   - `RECIPIENT_EMAIL`
   - `PORT` (if your Hostinger app requires it)
5. Set the frontend production API base URL in Hostinger build environment:
   - `VITE_API_BASE_URL=https://your-backend.example.com`

#### Option B — Frontend on Hostinger, backend external
1. Deploy `build/` to Hostinger static hosting.
2. Deploy backend to a Node-friendly host (Railway, Render, Fly, Vercel Serverless).
3. Use MongoDB Atlas for the database.
4. Set `VITE_API_BASE_URL` to the external backend URL.

### Example frontend environment variables
Create a `.env.production` file at the project root before building:
```
VITE_API_BASE_URL=https://your-backend.example.com
```

### Hostinger notes
- Hostinger shared static hosting cannot run Express or MongoDB directly.
- Hostinger Node hosting can run the backend, but MongoDB still needs Atlas or another external database.
- The frontend now uses a production API base URL from `import.meta.env.VITE_API_BASE_URL`.
- Do not commit `.env` files to source control.

## Deploy frontend to GitHub Pages
1. Create `.github/workflows/deploy.yml` with the GitHub Pages workflow.
2. Push `main` to GitHub.
3. In your repository settings, enable GitHub Pages using the `gh-pages` branch.
4. Set `VITE_API_BASE_URL` before building so the frontend points to your backend.

### GitHub Pages notes
- This publishes only the frontend static site.
- Your backend still needs a separate Node deployment.
- Use an external Node host or Hostinger Node hosting for the backend.

## Auth
- `/signup` creates an account through `POST /api/auth/signup`.
- `/signin` logs in through `POST /api/auth/signin`.
- The navbar shows Sign In when logged out and Sign Out when logged in.
- `/admin` is restricted to emails listed in `ADMIN_EMAILS` and manages contact and hire messages.
- Public signups receive a normal member role and cannot access admin APIs. Admin emails cannot be registered through the public signup form.
- Set `JWT_SECRET` in production.
- Set `MONGO_URI` in production so users persist across deploys and server restarts. Without MongoDB, auth works only as a temporary local development fallback.
