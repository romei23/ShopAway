const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/session
router.get('/session', authController.getSession);

// POST /api/auth/register
router.post('/register', authController.register);

module.exports = router;
router.post('/register', authController.register);
