const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist.model");
const Item = require("../models/Item");
const auth = require("../middleware/authMiddleware");

// ADD ITEM
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.body;

    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      return res.status(404).json({ message: "Item not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [itemId] });
    } else {
      if (!wishlist.items.includes(itemId)) {
        wishlist.items.push(itemId);
      }
    }

    await wishlist.save();
    return res.status(201).json({ message: "Item added to wishlist", wishlist });

  } catch (error) {
    console.error("[WISHLIST POST] Error:", error);
    return res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
});

// REMOVE ITEM
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items.pull(itemId);
    await wishlist.save();

    return res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("[WISHLIST DELETE] Error:", error);
    return res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
});

// FETCH USER WISHLIST
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: 'items',
      populate: { path: 'owner', select: 'name' }
    });
    
    if (!wishlist) {
      return res.json([]);
    }

    return res.json(wishlist.items);

  } catch (error) {
    console.error("[WISHLIST GET] Error:", error);
    return res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
});

module.exports = router;