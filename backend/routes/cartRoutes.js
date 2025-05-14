const express = require('express');
const router = express.Router();
const {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cartController');

router.get('/', getCarts);
router.post('/', createCart);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);

module.exports = router;
