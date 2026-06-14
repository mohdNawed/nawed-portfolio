// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const { MongoClient } = require('mongodb');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const mongoUri = process.env.MONGO_URI;
// const dbName = process.env.MONGO_DB_NAME || 'portfolio';
// let db;
// let client;

// const connectMongo = async () => {
//   if (!mongoUri) {
//     throw new Error('MONGO_URI is not configured in environment variables.');
//   }
//   client = new MongoClient(mongoUri, {
//     serverApi: '1',
//   });
//   await client.connect();
//   db = client.db(dbName);
//   console.log(`MongoDB connected to database: ${dbName}`);
// };

// const startServer = async () => {
//   try {
//     await connectMongo();
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
//   } catch (error) {
//     console.error('Failed to start backend:', error.message);
//     process.exit(1);
//   }
// };

// startServer();

// process.on('SIGINT', async () => {
//   console.log('Shutting down backend...');
//   if (client) await client.close();
//   process.exit(0);
// });

// // Email validation function
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// // Sanitize input to prevent XSS
// const sanitizeInput = (str) => {
//   if (!str) return '';
//   return String(str).replace(/[&<>"']/g, (char) => {
//     const escapeMap = {
//       '&': '&amp;',
//       '<': '&lt;',
//       '>': '&gt;',
//       '"': '&quot;',
//       "'": '&#x27;'
//     };
//     return escapeMap[char];
//   });
// };

// // POST /api/hire — sends hire inquiry email
// app.post('/api/hire', async (req, res) => {
//   const { name, email, projectType, budget, details } = req.body;

//   // Validation
//   if (!name || !email) {
//     return res.status(400).json({ success: false, message: 'Name and email are required.' });
//   }

//   if (!validateEmail(email)) {
//     return res.status(400).json({ success: false, message: 'Invalid email format.' });
//   }

//   // Sanitize inputs
//   const sanitizedName = sanitizeInput(name).trim();
//   const sanitizedEmail = sanitizeInput(email).trim();
//   const sanitizedProjectType = sanitizeInput(projectType).trim();
//   const sanitizedBudget = sanitizeInput(budget).trim();
//   const sanitizedDetails = sanitizeInput(details).trim();

//   if (!sanitizedName || sanitizedName.length < 2) {
//     return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
//   }

//   try {
//     const mailUser = process.env.MAIL_USER;
//     const mailPass = process.env.MAIL_PASS;
//     const recipientEmail = process.env.RECIPIENT_EMAIL;

//     if (!mailUser || !mailPass || !recipientEmail) {
//       console.error('Email environment variables not configured');
//       return res.status(500).json({ success: false, message: 'Server configuration error.' });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: mailUser,
//         pass: mailPass,
//       },
//     });

//     const inquiryDocument = {
//       name: sanitizedName,
//       email: sanitizedEmail,
//       projectType: sanitizedProjectType || 'Not specified',
//       budget: sanitizedBudget || 'Not specified',
//       details: sanitizedDetails || 'Not provided',
//       createdAt: new Date(),
//       source: 'hire-form',
//     };

//     await db.collection('hireInquiries').insertOne(inquiryDocument);

//     await transporter.sendMail({
//       from: `"${sanitizedName}" <${sanitizedEmail}>`,
//       to: recipientEmail,
//       subject: `Hire Inquiry: ${sanitizedProjectType || 'Project'} from ${sanitizedName}`,
//       html: `
//         <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #e4e4e7;border-radius:12px;">
//           <h2 style="color:#4f46e5;margin-bottom:4px;">New Hire Inquiry 🚀</h2>
//           <p style="color:#71717a;margin-top:0;">Someone wants to work with you!</p>
//           <table style="width:100%;border-collapse:collapse;margin-top:16px;">
//             <tr><td style="padding:8px 0;color:#71717a;width:130px;">Name</td><td style="font-weight:600;">${sanitizedName}</td></tr>
//             <tr><td style="padding:8px 0;color:#71717a;">Email</td><td><a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></td></tr>
//             <tr><td style="padding:8px 0;color:#71717a;">Project Type</td><td>${sanitizedProjectType || 'Not specified'}</td></tr>
//             <tr><td style="padding:8px 0;color:#71717a;">Budget</td><td>${sanitizedBudget || 'Not specified'}</td></tr>
//           </table>
//           <div style="margin-top:16px;padding:16px;background:#f4f4f5;border-radius:8px;">
//             <strong>Project Details:</strong>
//             <p style="margin-top:8px;color:#27272a;">${sanitizedDetails || 'Not provided'}</p>
//           </div>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: 'Email sent successfully!', data: inquiryDocument });
//   } catch (err) {
//     console.error('Hire email error:', err.message);
//     res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
//   }
// });

// // POST /api/contact — general contact
// app.post('/api/contact', async (req, res) => {
//   const { name, email, message } = req.body;

//   // Validation
//   if (!name || !email || !message) {
//     return res.status(400).json({ success: false, message: 'All fields are required.' });
//   }

//   if (!validateEmail(email)) {
//     return res.status(400).json({ success: false, message: 'Invalid email format.' });
//   }

//   // Sanitize inputs
//   const sanitizedName = sanitizeInput(name).trim();
//   const sanitizedEmail = sanitizeInput(email).trim();
//   const sanitizedMessage = sanitizeInput(message).trim();

//   if (!sanitizedName || sanitizedName.length < 2) {
//     return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
//   }

//   if (!sanitizedMessage || sanitizedMessage.length < 5) {
//     return res.status(400).json({ success: false, message: 'Message must be at least 5 characters.' });
//   }

//   try {
//     const mailUser = process.env.MAIL_USER;
//     const mailPass = process.env.MAIL_PASS;
//     const recipientEmail = process.env.RECIPIENT_EMAIL;

//     if (!mailUser || !mailPass || !recipientEmail) {
//       console.error('Email environment variables not configured');
//       return res.status(500).json({ success: false, message: 'Server configuration error.' });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: mailUser,
//         pass: mailPass,
//       },
//     });

//     const messageDocument = {
//       name: sanitizedName,
//       email: sanitizedEmail,
//       message: sanitizedMessage,
//       createdAt: new Date(),
//       source: 'contact-form',
//     };

//     await db.collection('contactMessages').insertOne(messageDocument);

//     await transporter.sendMail({
//       from: `"${sanitizedName}" <${sanitizedEmail}>`,
//       to: recipientEmail,
//       subject: `Contact from ${sanitizedName}`,
//       html: `<p><b>From:</b> ${sanitizedName} (${sanitizedEmail})</p><p><b>Message:</b> ${sanitizedMessage}</p>`,
//     });

//     res.json({ success: true, message: 'Message sent!', data: messageDocument });
//   } catch (err) {
//     console.error('Contact email error:', err.message);
//     res.status(500).json({ success: false, message: 'Failed to send message.' });
//   }
// });

// // GET /api/dashboard/hire — list saved hire inquiries
// app.get('/api/dashboard/hire', async (req, res) => {
//   try {
//     const items = await db
//       .collection('hireInquiries')
//       .find({})
//       .sort({ createdAt: -1 })
//       .toArray();
//     res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('Dashboard hire fetch error:', err.message);
//     res.status(500).json({ success: false, message: 'Failed to fetch hire inquiries.' });
//   }
// });

// // GET /api/dashboard/contact — list saved contact messages
// app.get('/api/dashboard/contact', async (req, res) => {
//   try {
//     const items = await db
//       .collection('contactMessages')
//       .find({})
//       .sort({ createdAt: -1 })
//       .toArray();
//     res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('Dashboard contact fetch error:', err.message);
//     res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'Backend is running!' });
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'portfolio';
let db;
let client;

const connectMongo = async () => {
  if (!mongoUri) {
    throw new Error('❌ MONGO_URI is missing! Please make sure your .env file is saved in the backend folder.');
  }
  
  console.log('Attempting to connect to MongoDB...');
  
  try {
    client = new MongoClient(mongoUri, {
      serverApi: '1',
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ MongoDB successfully connected to database: ${dbName}`);
  } catch (err) {
    console.error('\n❌ MONGODB CONNECTION FAILED!');
    console.error('----------------------------------------');
    console.error('Error Details:', err.message);
    console.error('----------------------------------------');
    console.error('Common fixes:');
    console.error('1. Did you whitelist your IP address in MongoDB Atlas?');
    console.error('2. Is your database password correct in the .env file?');
    console.error('3. Did you accidentally leave < > brackets around the password?');
    throw new Error('Database connection aborted.');
  }
};

const startServer = async () => {
  try {
    await connectMongo();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down backend...');
  if (client) await client.close();
  process.exit(0);
});

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input to prevent XSS
const sanitizeInput = (str) => {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (char) => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[char];
  });
};

// POST /api/hire — sends hire inquiry email
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
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: mailUser, pass: mailPass },
    });

    const inquiryDocument = {
      name: sanitizedName,
      email: sanitizedEmail,
      projectType: sanitizedProjectType || 'Not specified',
      budget: sanitizedBudget || 'Not specified',
      details: sanitizedDetails || 'Not provided',
      createdAt: new Date(),
      source: 'hire-form',
    };

    await db.collection('hireInquiries').insertOne(inquiryDocument);

    await transporter.sendMail({
      from: `"${sanitizedName}" <${sanitizedEmail}>`,
      to: recipientEmail,
      subject: `Hire Inquiry from ${sanitizedName}`,
      text: `New inquiry from ${sanitizedName}. Project: ${sanitizedProjectType}. Budget: ${sanitizedBudget}. Details: ${sanitizedDetails}`
    });

    res.json({ success: true, message: 'Email sent successfully!', data: inquiryDocument });
  } catch (err) {
    console.error('Hire email error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});
