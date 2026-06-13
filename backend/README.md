# Backend Setup

## Environment
Create a `.env` file in the `backend/` folder with the following keys:

```env
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
MONGO_DB_NAME=portfolio
PORT=5000
```

## Install dependencies

```bash
npm install
```

## Run backend

```bash
npm start
```

## Local development

```bash
npm run dev
```

## Hostinger deployment

1. Set environment variables in Hostinger Node.js app settings:
   - `MONGO_URI`
   - `MONGO_DB_NAME`
   - `MAIL_USER`
   - `MAIL_PASS`
   - `RECIPIENT_EMAIL`
   - `PORT` (optional)
2. Install dependencies and start the app.
3. Use MongoDB Atlas for your database.

## Optional Docker deployment

If you prefer Docker, use the provided `Dockerfile`.

## Database Collections

- `hireInquiries`
- `contactMessages`
