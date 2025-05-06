const express = require('express');
const path = require('path');
const session = require('express-session');
const orderRoutes = require('./ProjectMilestone5/routes/orderRoutes'); // ✅ correct
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'ProjectMilestone5', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'ProjectMilestone5', 'uploads')));

// ✅ Session first
app.use(session({
    secret: 'shopall-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Routes (after session)
app.use('/api/products', require('./ProjectMilestone5/routes/productRoutes'));
app.use('/api/cart', require('./ProjectMilestone5/routes/cartRoutes'));
app.use('/api/auth', require('./ProjectMilestone5/routes/authRoutes'));
app.use('/api/orders', orderRoutes); // ✅ only once

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
