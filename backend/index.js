const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.set('trust proxy', 1); // ✅ Support reverse proxy headers (Vercel, Heroku, etc.)

// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:5173'], // 🔒 Update this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(helmet());
app.use(express.json());

// ✅ Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Also logs to terminal

// ✅ Rate limiter (15 min window, max 100 requests)
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ✅ Routes
app.use('/api/carts', cartRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const log = `[${new Date().toISOString()}] ${err.stack}\n`;
  fs.appendFile(path.join(__dirname, 'error.log'), log, () => {});
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('✅ Backend running on port 5000'));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
