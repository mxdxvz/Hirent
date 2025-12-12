const mongoose = require('mongoose');
const User = require('../models/Users');
const Item = require('../models/Item');

// Helper function to get a populated wishlist, ensuring it always returns an array.
const getPopulatedWishlist = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];

  const user = await User.findById(userId).populate({
    path: 'wishlist',
    model: 'Item',
    select: 'title images pricePerDay category',
  });

  // Ensure we return an array even if the user or wishlist is not found.
  return user?.wishlist || [];
};

// GET /api/wishlist - Fetch the user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await getPopulatedWishlist(req.user.userId);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error('[WISHLIST GET_ERROR]:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching wishlist.' });
  }
};

// POST /api/wishlist - Add an item to the wishlist
exports.addToWishlist = async (req, res) => {
  const { itemId } = req.body;
  const { userId } = req.user;

  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ success: false, message: 'Valid Item ID is required.' });
  }

  try {
    // Ensure the item exists before adding it
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // Add to wishlist and check if the user exists
    const user = await User.findByIdAndUpdate(userId, 
      { $addToSet: { wishlist: itemId } },
      { new: true } // Return the modified document
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updatedWishlist = await getPopulatedWishlist(userId);
    res.status(200).json({ success: true, wishlist: updatedWishlist });

  } catch (error) {
    console.error('[WISHLIST_ADD_ERROR]:', error);
    res.status(500).json({ success: false, message: 'Server error while adding to wishlist.' });
  }
};

// DELETE /api/wishlist/:itemId - Remove an item from the wishlist
exports.removeFromWishlist = async (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ success: false, message: 'Valid Item ID is required.' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, 
      { $pull: { wishlist: itemId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updatedWishlist = await getPopulatedWishlist(userId);
    res.status(200).json({ success: true, wishlist: updatedWishlist });

  } catch (error) {
    console.error('[WISHLIST_REMOVE_ERROR]:', error);
    res.status(500).json({ success: false, message: 'Server error while removing from wishlist.' });
  }
};
