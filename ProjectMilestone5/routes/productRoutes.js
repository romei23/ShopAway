const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);                // 🔍 Search route
router.get('/category/:categoryId', productController.filterByCategory); // 🗂 Filter by category
router.get('/:id', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.post('/upload', upload.single('jsonFile'), productController.bulkUpload);

module.exports = router;
