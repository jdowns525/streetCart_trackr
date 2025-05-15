// /backend/routes/cartRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/cartController');

const router = express.Router();

const validateCart = [
  body('lat').isFloat({ min: -90, max: 90 }),
  body('lng').isFloat({ min: -180, max: 180 }),
  body('name').isString().trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

router.get('/', controller.getCarts);
router.post('/', validateCart, controller.createCart);
router.put('/:id', controller.updateCart);
router.delete('/:id', controller.deleteCart);

module.exports = router;
