const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ProjectMilestone5/db/shopall.db');

// Add item to cart
exports.addItem = (userId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    const getCartQuery = `SELECT id FROM carts WHERE user_id = ? AND status = 'new'`;
    db.get(getCartQuery, [userId], (err, cart) => {
      if (err) return reject(err);

      if (cart) {
        insertIntoCartProducts(cart.id);
      } else {
        const createCartQuery = `INSERT INTO carts (user_id, status, created_at) VALUES (?, 'new', datetime('now'))`;
        db.run(createCartQuery, [userId], function (err) {
          if (err) return reject(err);
          insertIntoCartProducts(this.lastID);
        });
      }

      function insertIntoCartProducts(cartId) {
        const query = `
          INSERT INTO cartproducts (cart_id, product_id, quantity)
          VALUES (?, ?, ?)
          ON CONFLICT(cart_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
        `;
        db.run(query, [cartId, productId, quantity], function (err) {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
};

// Get cart items
exports.getCartItems = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT cp.product_id, p.name, p.price, cp.quantity, p.image_url
      FROM cartproducts cp
      JOIN products p ON cp.product_id = p.id
      JOIN carts c ON cp.cart_id = c.id
      WHERE c.user_id = ? AND c.status = 'new'
    `;
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Remove product
exports.removeItem = (userId, productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM cartproducts
      WHERE cart_id = (SELECT id FROM carts WHERE user_id = ? AND status = 'new')
      AND product_id = ?
    `;
    db.run(query, [userId, productId], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Checkout: Convert cart to order and clear cart
exports.checkout = (userId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get("SELECT id FROM carts WHERE user_id = ? AND status = 'new'", [userId], (err, cart) => {
        if (err) return reject(err);
        if (!cart) return reject(new Error("No active cart found"));

        const cartId = cart.id;

        const getCartItems = `
          SELECT cp.product_id, p.name, p.price, cp.quantity, p.image_url
          FROM cartproducts cp
          JOIN products p ON cp.product_id = p.id
          WHERE cp.cart_id = ?
        `;

        db.all(getCartItems, [cartId], (err, items) => {
          if (err) return reject(err);

          const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

          const insertOrder = `
            INSERT INTO orders (user_id, total, created_at)
            VALUES (?, ?, datetime('now'))
          `;

          db.run(insertOrder, [userId, total], function (err) {
            if (err) return reject(err);
            const orderId = this.lastID;

            const insertOrderItem = db.prepare(`
              INSERT INTO order_items (order_id, product_id, quantity, price, image_url, product_name)
              VALUES (?, ?, ?, ?, ?, ?)
            `);

            items.forEach(item => {
              insertOrderItem.run(orderId, item.product_id, item.quantity, item.price, item.image_url, item.name);
            });

            insertOrderItem.finalize(err => {
              if (err) return reject(err);

              db.run(`UPDATE carts SET status = 'purchased' WHERE id = ?`, [cartId], function (err) {
                if (err) return reject(err);

                db.run(`DELETE FROM cartproducts WHERE cart_id = ?`, [cartId], function (err) {
                  if (err) return reject(err);
                  resolve({ orderId, total, items });
                });
              });
            });
          });
        });
      });
    });
  });
};

// Get the active cart ID for a user
exports.getActiveCartId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM carts WHERE user_id = ? AND status = 'new'`;
    db.get(query, [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.id : null);
    });
  });
};

// Clear cart products (after checkout)
exports.clearCart = (cartId) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM cartproducts WHERE cart_id = ?`;
    db.run(query, [cartId], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};
