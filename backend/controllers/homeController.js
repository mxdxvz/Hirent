const Users = require('../models/Users');
const Wishlist = require("../models/wishlist.model");
const Items = require('../models/Items');
const Location = require('../models/Location');

exports.getPersonalizedHome = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Get user profile
    const user = await Users.findById(userId).select('location categoryPreferences recentlyViewed');

    // 2. Wishlist activity
    const wishlist = await Wishlist.find({ userId })
      .populate('itemId')
      .limit(5);

    // 3. Cart activitys
    let cart = [];
    if (Items.schema.paths.inCartUsers) {
      cart = await Items.find({ inCartUsers: userId }).limit(5);
    }

    // 4. Recently viewed items
    let recentlyViewed = [];
    if (user.recentlyViewed?.length > 0) {
      recentlyViewed = await Items.find({
        _id: { $in: user.recentlyViewed }
      }).limit(5);
    }

    // 5. Booking history
    const bookingHistory = []; 

    // 6. Recommendations based on categories
    let recommended = [];
    if (user.categoryPreferences?.length > 0) {
      recommended = await Items.find({
        category: { $in: user.categoryPreferences }
      }).limit(10);
    }

    // 7. Nearby items (based on stored user location)
    const nearbyItems = await Items.find({
      "location.city": user.location?.city || null
    }).limit(10);

    return res.status(200).json({
      success: true,
      data: {
        wishlist,
        cart,
        recentlyViewed,
        bookingHistory,
        recommended,
        nearbyItems,
        userLocation: user.location,
        categoryPreferences: user.categoryPreferences
      }
    });

  } catch (error) {
    console.log("HOME PERSONALIZED ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch personalized homepage data"
    });
  }
};
