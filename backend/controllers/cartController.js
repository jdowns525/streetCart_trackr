const Cart = require('../models/Cart');

exports.getCarts = async (req, res) => {
  const carts = await Cart.find();
  res.json(carts);
};

exports.createCart = async (req, res) => {
  const { lat, lng, name, notes } = req.body;
  const cart = await Cart.create({ lat, lng, name, notes });
  res.status(201).json(cart);
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  const { name, notes } = req.body;
  const updated = await Cart.findByIdAndUpdate(id, { name, notes }, { new: true });
  res.json(updated);
};

exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  await Cart.findByIdAndDelete(id);
  res.status(204).end();
};
