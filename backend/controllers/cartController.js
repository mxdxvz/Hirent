const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { itemId, quantity: qty } = req.body;
  const quantity = Number(qty);
  const userId = req.user.userId;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Cart exists for user
      let itemIndex = cart.items.findIndex(p => p.itemId == itemId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        let productItem = cart.items[itemIndex];
        productItem.quantity = quantity;
        cart.items[itemIndex] = productItem;
      } else {
        // Product does not exists in cart, add new item
        cart.items.push({ itemId, quantity });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        items: [{ itemId, quantity }]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
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
