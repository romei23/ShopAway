const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'ProjectMilestone5', 'public')));

// Routes
app.use('/api/products', require('./ProjectMilestone5/routes/productRoutes'));
app.use('/api/cart', require('./ProjectMilestone5/routes/cartRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/api/cart', require('./ProjectMilestone5/routes/cartRoutes'));

