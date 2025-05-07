const db = require('../db/db').db;

exports.getUserOrders = (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const query = `
    SELECT o.id AS order_id, o.total, o.created_at,
           oi.quantity, oi.price,
           p.name AS product_name, p.image_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching orders:", err.message);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    // Group products by order
    const orders = {};
    rows.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          id: row.order_id,
          total: row.total,
          created_at: row.created_at,
          items: []
        };
      }
      orders[row.order_id].items.push({
        product_name: row.product_name,
        image_url: row.image_url,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(Object.values(orders));
  });
};
