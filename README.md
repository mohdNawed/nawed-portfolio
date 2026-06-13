# Nawed Portfolio — React + Express

A full-stack personal portfolio for Md Nawed Alam, Full Stack Developer.

## Project Structure

```
nawed-portfolio/
├── backend/              ← Express.js server
│   ├── server.js         ← API routes (/api/hire, /api/contact)
│   └── package.json
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
npm start
# Runs on http://localhost:3000
```

### 2. Backend
```bash
cd backend
npm install
# Set env vars:
# MAIL_USER=mdalamnawed@gmail.com
# MAIL_PASS=your_gmail_app_password
node server.js
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

## Deploy
- Frontend: Hostinger static site / Vercel / Netlify (`npm run build`)
- Backend: Hostinger Node hosting / Render / Railway / Fly / Heroku

### Hostinger ready deployment

#### Option A — Full Hostinger deployment with Node backend
1. Build frontend:
   ```bash
   npm install
   npm run build
   ```
2. Upload the generated `build/` folder to Hostinger static site hosting.
3. Deploy backend under Hostinger Node.js hosting:
   - Upload the `backend/` folder
   - Run `npm install` in `backend/`
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
