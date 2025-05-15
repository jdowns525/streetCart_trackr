const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.set('trust proxy', 1); // ✅ Fix for rate-limit warning behind a proxy

// ✅ Secure and robust middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ✅ API routes
app.use('/api/carts', cartRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('✅ Backend running on port 5000')))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
