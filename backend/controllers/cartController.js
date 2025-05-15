const Cart = require('../models/Cart');

exports.getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    next(err);
  }
};

exports.createCart = async (req, res, next) => {
  try {
    const { lat, lng, name, notes } = req.body;
    const cart = await Cart.create({ lat, lng, name, notes });
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, notes } = req.body;
    const updated = await Cart.findByIdAndUpdate(id, { name, notes }, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
