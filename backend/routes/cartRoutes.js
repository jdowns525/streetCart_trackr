const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cartController');

const router = express.Router();

// Validate request payloads
const cartValidation = [
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude is invalid'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude is invalid'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('notes').optional().isString().trim(),
];

// Error handler middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', getCarts);
router.post('/', cartValidation, validateRequest, createCart);
router.put('/:id', cartValidation, validateRequest, updateCart);
router.delete('/:id', deleteCart);

module.exports = router;
