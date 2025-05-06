const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ProjectMilestone5/db/shopall.db');

const createOrder = (userId, total, items) => {
    return new Promise((resolve, reject) => {
        const now = new Date().toISOString();
        db.run("INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)", [userId, total, now], function (err) {
            if (err) return reject(err);
            const orderId = this.lastID;

            const stmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price, image_url) VALUES (?, ?, ?, ?, ?)");
            items.forEach(item => {
                stmt.run(orderId, item.product_id, item.quantity, item.price, item.image_url);
            });
            stmt.finalize();

            resolve(orderId);
        });
    });
};

module.exports = {
    createOrder
};
