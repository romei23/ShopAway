const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAll);     // GET all products
router.get('/:id', productController.getById); // GET single product by ID

module.exports = router;
