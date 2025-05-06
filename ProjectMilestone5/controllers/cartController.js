const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel'); 

exports.getCart = async (req, res) => {
  const userId = req.session.userId;
  try {
    const items = await cartModel.getCartItems(userId);
    res.status(200).json(items);
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await cartModel.addItem(userId, productId, quantity);
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('❌ Error adding to cart:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.session.userId;
  const productId = req.params.productId;
  try {
    await cartModel.removeItem(userId, productId);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove item error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.session.userId;
  try {
    await cartModel.checkout(userId);
    res.json({ message: "Checkout completed" });
  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.session.userId;
  try {
    const cartId = await cartModel.getActiveCartId(userId);
    if (!cartId) return res.status(400).json({ error: "No active cart" });

    const items = await cartModel.getCartItems(userId);
    if (!items.length) return res.status(400).json({ error: "Cart is empty" });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = await orderModel.createOrder(userId, total, items);

    await cartModel.clearCart(cartId);
    res.json({ message: "Order placed", orderId });
  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
};
