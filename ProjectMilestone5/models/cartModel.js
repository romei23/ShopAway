const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ProjectMilestone5/db/shopall.db');

exports.addItem = (userId, productId, quantity) => {
    return new Promise((resolve, reject) => {
      // Step 1: Check if user already has a cart
      const getCartQuery = `SELECT id FROM carts WHERE user_id = ?`;
      db.get(getCartQuery, [userId], (err, cart) => {
        if (err) return reject(err);
  
        if (cart) {
          // Step 2: If cart exists, use the ID
          insertIntoCartProducts(cart.id);
        } else {
          // Step 3: Otherwise, create a cart first
          const createCartQuery = `INSERT INTO carts (status, created_at, user_id) VALUES (?, datetime('now'), ?)`;
          db.run(createCartQuery, ['new', userId], function (err) {
            if (err) return reject(err);
            insertIntoCartProducts(this.lastID); // this.lastID is the new cart ID
          });
        }
  
        function insertIntoCartProducts(cartId) {
          const query = `INSERT INTO cartproducts (cart_id, product_id, quantity) VALUES (?, ?, ?)`;
          db.run(query, [cartId, productId, quantity], function (err) {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
  };

exports.getCartItems = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.name, p.price, cp.quantity 
      FROM cartproducts cp
      JOIN products p ON cp.product_id = p.id
      JOIN carts c ON cp.cart_id = c.id
      WHERE c.user_id = ?`;
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.removeItem = (userId, productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM cartproducts 
      WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?) 
      AND product_id = ?
    `;
    db.run(query, [userId, productId], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.checkout = (userId) => {
  return new Promise((resolve, reject) => {
    const updateCartQuery = `
      UPDATE carts 
      SET status = 'purchased' 
      WHERE user_id = ?`;

    const clearCartProductsQuery = `
      DELETE FROM cartproducts 
      WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)`;

    db.serialize(() => {
      db.run(updateCartQuery, [userId], function (err) {
        if (err) return reject(err);
        db.run(clearCartProductsQuery, [userId], function (err) {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  });
};
