const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  name: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
