const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addToCart,
  removeItemFromCart,
  updateCartItem,
  getCart
} = require('../controllers/cartController');

// /api/cart/add
router.post('/add', auth, addToCart);

// /api/cart/remove/:itemId
router.delete('/:itemId', auth, removeItemFromCart);

// /api/cart/update
router.put('/update', auth, updateCartItem);

// /api/cart
router.get('/', auth, getCart);

module.exports = router;