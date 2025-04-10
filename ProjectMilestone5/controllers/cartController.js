// /controllers/cartController.js
const cartModel = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    await cartModel.addItem(userId, productId, quantity);
    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const items = await cartModel.getCartItems(userId);
    res.status(200).json(items);
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    await cartModel.removeItem(userId, productId);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    await cartModel.checkout(userId);
    res.json({ message: "Checkout completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

