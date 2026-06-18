require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : true,
}));
app.use(express.json());

let db;
let client;
const memoryUsers = [];

const connectMongo = async () => {
  if (db) return db;

  const mongoUri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'portfolio';

  if (!mongoUri) {
    return null;
  }

  client = new MongoClient(mongoUri, { serverApi: '1' });
  await client.connect();
  db = client.db(dbName);
  return db;
};

const saveDocument = async (collectionName, document) => {
  try {
    const database = await connectMongo();
    if (!database) return;
    await database.collection(collectionName).insertOne(document);
  } catch (error) {
    console.error(`Could not save ${collectionName}:`, error.message);
  }
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const tokenSecret = process.env.JWT_SECRET || process.env.MAIL_PASS || 'nawed-dev-local-secret';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  if (!storedPassword || !storedPassword.includes(':')) return false;
  const [salt, hash] = storedPassword.split(':');
  const passwordHash = hashPassword(password, salt).split(':')[1];
  if (hash.length !== passwordHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(passwordHash));
};

const signToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', tokenSecret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  if (!token) return null;
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', tokenSecret).update(`${header}.${body}`).digest('base64url');
  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

const findUserByEmail = async (email) => {
  const database = await connectMongo();
  if (!database) return memoryUsers.find(user => user.email === email) || null;
  return database.collection('users').findOne({ email });
};

const createUser = async ({ name, email, password }) => {
  const user = {
    name,
    email,
    passwordHash: hashPassword(password),
    role: 'admin',
    createdAt: new Date(),
  };

  const database = await connectMongo();
  if (!database) {
    memoryUsers.push(user);
    return user;
  }

  await database.collection('users').createIndex({ email: 1 }, { unique: true });
  await database.collection('users').insertOne(user);
  return user;
};

const publicUser = (user) => ({
  name: user.name,
  email: user.email,
  role: user.role || 'admin',
});

const requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }

  req.user = payload;
  next();
};

const sanitizeInput = (value) => {
  if (!value) return '';
  return String(value).replace(/[&<>"']/g, (char) => {
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return escapeMap[char];
  });
};

app.post('/api/auth/signup', async (req, res) => {
  const name = sanitizeInput(req.body.name).trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await createUser({ name, email, password });
    const safeUser = publicUser(user);
    const token = signToken(safeUser);
    res.status(201).json({ success: true, message: 'Account created successfully.', token, user: safeUser });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ success: false, message: 'Could not create account.' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const safeUser = publicUser(user);
    const token = signToken(safeUser);
    res.json({ success: true, message: 'Signed in successfully.', token, user: safeUser });
  } catch (error) {
    console.error('Signin error:', error.message);
    res.status(500).json({ success: false, message: 'Could not sign in.' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

const createTransporter = () => {
  const { MAIL_USER, MAIL_PASS, RECIPIENT_EMAIL } = process.env;

  if (!MAIL_USER || !MAIL_PASS || !RECIPIENT_EMAIL) {
    throw new Error('Email environment variables are not configured.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
};

const sendPortfolioEmail = async ({ replyTo, subject, text, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Nawed Portfolio" <${process.env.MAIL_USER}>`,
    replyTo,
    to: process.env.RECIPIENT_EMAIL,
    subject,
    text,
    html,
  });
};

app.post('/api/hire', async (req, res) => {
  const { name, email, projectType, budget, details } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  const sanitizedName = sanitizeInput(name).trim();
  const sanitizedEmail = sanitizeInput(email).trim();
  const sanitizedProjectType = sanitizeInput(projectType).trim();
  const sanitizedBudget = sanitizeInput(budget).trim();
  const sanitizedDetails = sanitizeInput(details).trim();

  try {
    const inquiryDocument = {
      name: sanitizedName,
      email: sanitizedEmail,
      projectType: sanitizedProjectType || 'Not specified',
      budget: sanitizedBudget || 'Not specified',
      details: sanitizedDetails || 'Not provided',
      createdAt: new Date(),
      source: 'hire-form',
    };

    await sendPortfolioEmail({
      replyTo: sanitizedEmail,
      subject: `Hire Inquiry from ${sanitizedName}`,
      text: `New inquiry from ${sanitizedName} (${sanitizedEmail}). Project: ${sanitizedProjectType}. Budget: ${sanitizedBudget}. Details: ${sanitizedDetails}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#18181b">
          <h2>New Hire Inquiry</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Project Type:</strong> ${sanitizedProjectType || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${sanitizedBudget || 'Not specified'}</p>
          <p><strong>Details:</strong></p>
          <p>${sanitizedDetails || 'Not provided'}</p>
        </div>
      `,
    });

    await saveDocument('hireInquiries', inquiryDocument);

    res.json({ success: true, message: 'Email sent successfully!', data: inquiryDocument });
  } catch (error) {
    console.error('Hire email error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  const sanitizedName = sanitizeInput(name).trim();
  const sanitizedEmail = sanitizeInput(email).trim();
  const sanitizedMessage = sanitizeInput(message).trim();

  try {
    const messageDocument = {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      createdAt: new Date(),
      source: 'contact-form',
    };

    await sendPortfolioEmail({
      replyTo: sanitizedEmail,
      subject: `Contact from ${sanitizedName}`,
      text: `New contact message from ${sanitizedName} (${sanitizedEmail}).\n\n${sanitizedMessage}`,
      html: `<p><b>From:</b> ${sanitizedName} (${sanitizedEmail})</p><p><b>Message:</b> ${sanitizedMessage}</p>`,
    });

    await saveDocument('contactMessages', messageDocument);

    res.json({ success: true, message: 'Message sent!', data: messageDocument });
  } catch (error) {
    console.error('Contact email error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

app.get('/api/dashboard/hire', requireAuth, async (req, res) => {
  try {
    const database = await connectMongo();
    if (!database) return res.json({ success: true, data: [] });
    const items = await database.collection('hireInquiries').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch hire inquiries.' });
  }
});

app.get('/api/dashboard/contact', requireAuth, async (req, res) => {
  try {
    const database = await connectMongo();
    if (!database) return res.json({ success: true, data: [] });
    const items = await database.collection('contactMessages').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nawed Dev backend',
    platform: process.env.RENDER ? 'render' : 'node',
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Nawed Dev backend is running.',
    health: '/api/health',
  });
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Nawed Dev backend running on port ${port}`);
  });
}

module.exports = app;
