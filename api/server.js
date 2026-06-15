require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

let db;
let client;

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

const sanitizeInput = (value) => {
  if (!value) return '';
  return String(value).replace(/[&<>"']/g, (char) => {
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return escapeMap[char];
  });
};

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

app.get('/api/dashboard/hire', async (req, res) => {
  try {
    const database = await connectMongo();
    if (!database) return res.json({ success: true, data: [] });
    const items = await database.collection('hireInquiries').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch hire inquiries.' });
  }
});

app.get('/api/dashboard/contact', async (req, res) => {
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
  res.json({ status: 'Backend is running on Vercel!' });
});

module.exports = app;
