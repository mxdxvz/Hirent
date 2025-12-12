const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { itemId, quantity: qty } = req.body;
  const quantity = Number(qty) || 1;
  const userId = req.user.userId;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart, create one
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((p) => p.itemId.toString() === itemId);

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ itemId, quantity });
    }

    const updatedCart = await cart.save();

    const populatedCart = await Cart.findById(updatedCart._id).populate({
      path: 'items.itemId',
      populate: { path: 'owner', select: 'name' }
    });

    return res.status(201).send(populatedCart);

  } catch (err) {
    console.error("[ADD TO CART] Error:", err);
    res.status(500).send("Something went wrong");
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params; // Correctly get itemId from params
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(p => p.itemId.toString() === itemId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.json(cart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const payload = req.body || {};
    return res.json({ message: 'Update cart item (placeholder)', data: payload });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate({
      path: 'items.itemId',
      populate: { path: 'owner', select: 'name' }
    });
    if (!cart) {
      return res.json({ items: [] });
    }
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
