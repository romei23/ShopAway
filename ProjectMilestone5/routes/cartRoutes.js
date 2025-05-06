const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth'); // ✅ import middleware

/// Instead of requiring userId from URL, use session
router.get('/', isAuthenticated, cartController.getCart);
router.post('/add', isAuthenticated, cartController.addToCart);
router.delete('/:productId', isAuthenticated, cartController.removeFromCart);
router.post('/checkout', isAuthenticated, cartController.checkoutCart);

module.exports = router;
