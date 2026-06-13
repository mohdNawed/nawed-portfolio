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
- Frontend: Vercel / Netlify (`npm run build`)
- Backend: Render / Railway / Heroku
