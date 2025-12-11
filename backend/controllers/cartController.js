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

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    return res.json({ message: `Remove ${itemId} from cart (placeholder)` });
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
