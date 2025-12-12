const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const auth = require("../middleware/authMiddleware");

// All routes in this file are protected and require authentication
router.use(auth);

// GET / - Fetch the user's wishlist
router.get('/', getWishlist);

// POST / - Add an item to the wishlist
router.post('/', addToWishlist);

// DELETE /:itemId - Remove an item from the wishlist
router.delete('/:itemId', removeFromWishlist);

module.exports = router;