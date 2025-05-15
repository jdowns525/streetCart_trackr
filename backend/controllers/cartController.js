const mongoose = require('mongoose');
const Cart = require('../models/Cart');

// GET all carts
exports.getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    next(err);
  }
};

// POST create new cart
exports.createCart = async (req, res, next) => {
  try {
    const { lat, lng, name, notes } = req.body;
    const cart = await Cart.create({ lat, lng, name, notes });
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

// PUT update existing cart
exports.updateCart = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid cart ID' });
  }

  try {
    const { name, notes, lat, lng } = req.body;
    const updated = await Cart.findByIdAndUpdate(
      id,
      { name, notes, lat, lng },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE a cart by ID
exports.deleteCart = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid cart ID' });
  }

  try {
    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
