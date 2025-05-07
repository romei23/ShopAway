const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth'); // import middleware

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ROUTES

// Public routes (no auth)
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:categoryName', productController.filterByCategory);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, upload.single('image'), productController.addProduct);
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'), productController.updateProduct);
router.post('/upload', isAuthenticated, isAdmin, upload.single('jsonFile'), productController.bulkUpload);
router.delete('/:id', isAuthenticated, isAdmin, productController.deleteProduct);

module.exports = router;
