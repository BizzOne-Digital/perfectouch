const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ---------------------------
// CORS
// ---------------------------
// NOTE: origin '*' aur credentials:true sath nahi chalte.
// FRONTEND_URL ko Vercel env vars mein exact frontend domain set karo
// e.g. https://perfecttouch-frontend.vercel.app
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---------------------------
// MongoDB connection (serverless-safe)
// ---------------------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // bufferCommands ko default (true) rehne do — yeh mongoose ko queries
    // buffer karne deta hai jab tak connection poori tarah ready na ho.
    // Serverless cold-start mein false set karna race condition create karta hai.
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    isConnected = false;
    console.error('❌ MongoDB Error:', err.message);
    throw err;
  }
};

// Har request se pehle DB connection ensure karo (Vercel cold starts ke liye zaroori)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Database connection failed',
      error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
});

// ---------------------------
// Routes
// ---------------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PerfectTouch API is running',
    dbConnected: mongoose.connection.readyState === 1,
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'PerfectTouch Auto Detailing API' });
});

// ---------------------------
// Global error handler (optional but useful)
// ---------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ---------------------------
// Local dev only
// ---------------------------
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

module.exports = app;