require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const crypto = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');
const {
  deletePortfolioMessage,
  hasSupabaseConfig,
  listPortfolioMessages,
  savePortfolioMessage,
  updatePortfolioMessage,
} = require('./supabase');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : true,
}));
app.use(express.json());

let db;
let client;
let resend;
const memoryUsers = [];

const adminEmails = new Set(
  String(process.env.ADMIN_EMAILS || process.env.RECIPIENT_EMAIL || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean),
);

const isAdminEmail = email => adminEmails.has(normalizeEmail(email));

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
    if (!database) return null;
    return database.collection(collectionName).insertOne(document);
  } catch (error) {
    console.error(`Could not save ${collectionName}:`, error.message);
    throw error;
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
    role: isAdminEmail(email) ? 'admin' : 'member',
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
  role: isAdminEmail(user.email) ? 'admin' : 'member',
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

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (!isAdminEmail(req.user.email)) {
      return res.status(403).json({ success: false, message: 'Admin access is required.' });
    }
    next();
  });
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

  if (isAdminEmail(email)) {
    return res.status(403).json({
      success: false,
      message: 'Admin accounts cannot be created from the public signup form.',
    });
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
  if (process.env.RESEND_API_KEY) {
    if (!process.env.RECIPIENT_EMAIL) {
      throw new Error('RECIPIENT_EMAIL is not configured.');
    }

    resend ||= new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Nawed Dev <onboarding@resend.dev>',
      to: [process.env.RECIPIENT_EMAIL],
      replyTo,
      subject,
      text,
      html,
    });

    if (error) throw new Error(error.message || 'Resend could not deliver the notification.');
    return;
  }

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

const persistPortfolioMessage = async (type, document) => {
  if (hasSupabaseConfig()) {
    return savePortfolioMessage(type, document);
  }

  const collectionName = type === 'hire' ? 'hireInquiries' : 'contactMessages';
  return saveDocument(collectionName, {
    ...document,
    status: 'new',
    updatedAt: new Date(),
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

    await persistPortfolioMessage('hire', inquiryDocument);

    let emailSent = true;
    try {
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
    } catch (emailError) {
      emailSent = false;
      console.error('Hire notification email error:', emailError.message);
    }

    res.status(emailSent ? 200 : 202).json({
      success: true,
      message: emailSent ? 'Inquiry sent successfully!' : 'Inquiry saved successfully. Email notification is delayed.',
    });
  } catch (error) {
    console.error('Hire inquiry error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save your inquiry.' });
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

    await persistPortfolioMessage('contact', messageDocument);

    let emailSent = true;
    try {
      await sendPortfolioEmail({
        replyTo: sanitizedEmail,
        subject: `Contact from ${sanitizedName}`,
        text: `New contact message from ${sanitizedName} (${sanitizedEmail}).\n\n${sanitizedMessage}`,
        html: `<p><b>From:</b> ${sanitizedName} (${sanitizedEmail})</p><p><b>Message:</b> ${sanitizedMessage}</p>`,
      });
    } catch (emailError) {
      emailSent = false;
      console.error('Contact notification email error:', emailError.message);
    }

    res.status(emailSent ? 200 : 202).json({
      success: true,
      message: emailSent ? 'Message sent!' : 'Message saved successfully. Email notification is delayed.',
    });
  } catch (error) {
    console.error('Contact message error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save your message.' });
  }
});

const normalizeMongoMessage = (item, type) => ({
  id: String(item._id),
  type,
  name: item.name,
  email: item.email,
  message: item.message || item.details || 'Not provided',
  project_type: item.projectType || null,
  budget: item.budget || null,
  source: item.source,
  status: item.status || 'new',
  created_at: item.createdAt,
  updated_at: item.updatedAt || item.createdAt,
});

app.get('/api/admin/messages', requireAdmin, async (req, res) => {
  try {
    if (hasSupabaseConfig()) {
      const messages = await listPortfolioMessages();
      return res.json({ success: true, data: messages, storage: 'supabase' });
    }

    const database = await connectMongo();
    if (!database) return res.json({ success: true, data: [], storage: 'memory' });

    const [contacts, hires] = await Promise.all([
      database.collection('contactMessages').find({}).toArray(),
      database.collection('hireInquiries').find({}).toArray(),
    ]);
    const messages = [
      ...contacts.map(item => normalizeMongoMessage(item, 'contact')),
      ...hires.map(item => normalizeMongoMessage(item, 'hire')),
    ].sort((left, right) => new Date(right.created_at) - new Date(left.created_at));

    res.json({ success: true, data: messages, storage: 'mongodb' });
  } catch (error) {
    console.error('Admin message list error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load messages.' });
  }
});

app.patch('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const status = String(req.body.status || '').toLowerCase();
  if (!['new', 'read', 'archived'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid message status.' });
  }

  try {
    if (hasSupabaseConfig()) {
      const message = await updatePortfolioMessage(req.params.id, status);
      return res.json({ success: true, data: message });
    }

    const database = await connectMongo();
    const type = req.body.type === 'hire' ? 'hire' : 'contact';
    if (!database || !ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const collectionName = type === 'hire' ? 'hireInquiries' : 'contactMessages';
    const result = await database.collection(collectionName).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } },
    );
    if (!result.matchedCount) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true });
  } catch (error) {
    console.error('Admin message update error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update message.' });
  }
});

app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  try {
    if (hasSupabaseConfig()) {
      await deletePortfolioMessage(req.params.id);
      return res.json({ success: true });
    }

    const database = await connectMongo();
    const type = req.query.type === 'hire' ? 'hire' : 'contact';
    if (!database || !ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const collectionName = type === 'hire' ? 'hireInquiries' : 'contactMessages';
    const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true });
  } catch (error) {
    console.error('Admin message delete error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nawed Dev backend',
    platform: process.env.RENDER ? 'render' : 'node',
    messageStorage: hasSupabaseConfig() ? 'supabase' : (process.env.MONGO_URI ? 'mongodb' : 'memory'),
    notificationProvider: process.env.RESEND_API_KEY ? 'resend' : (process.env.MAIL_USER ? 'gmail' : 'unconfigured'),
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
