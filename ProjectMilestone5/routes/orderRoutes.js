const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/my-orders', isAuthenticated, orderController.getUserOrders);

module.exports = router;
