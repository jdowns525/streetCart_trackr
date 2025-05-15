// /backend/models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  name: String,
  notes: String,
}, { timestamps: true });

// ✅ Add this if you want to support future geolocation filtering
cartSchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model('Cart', cartSchema);
