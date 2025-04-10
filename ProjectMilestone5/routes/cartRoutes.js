// ProjectMilestone5/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add item to cart
router.post('/add', cartController.addToCart);

// Get cart items by userId
router.get('/:userId', cartController.getCart);

router.delete('/:userId/:productId', cartController.removeFromCart);

router.post('/:userId/checkout', cartController.checkoutCart);

module.exports = router;
