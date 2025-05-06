const { get } = require('../routes/productRoutes');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ProjectMilestone5/db/shopall.db');

// Get all products
const getAll = () => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT products.*, categories.name AS category
        FROM products
        LEFT JOIN categories ON products.category_id = categories.id
      `;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const add = (product) => {
    return new Promise((resolve, reject) => {
        const { name, description, image_url, price, category_id, is_featured } = product;

        const query = `
        INSERT INTO products (name, description, image_url, price, category_id, is_featured)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

        db.run(query, [name, description, image_url, price, category_id, is_featured || 0], function (err) {
            if (err) {
                console.error("SQL Insert Error:", err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};



// Update a product (also converts category name to ID)
const update = (id, product) => {
    return new Promise((resolve, reject) => {
        const { name, description, image_url, price, category_id, is_featured } = product;
        const updatedAt = new Date().toISOString();

        console.log("Running UPDATE with:", name, description, image_url, price, category_id, id);

        const query = `
            UPDATE products 
            SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ?
            WHERE id = ?
            `;

        db.run(query, [name, description, image_url, price, category_id, is_featured || 0, id], function (err) {

            if (err) {
                console.error("❌ UPDATE ERROR:", err.message);
                return reject(err);
            } else {
                console.log("✅ SQL UPDATE succeeded");
                resolve();
            }
        });
    });
};



// Get a product by ID
const getById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM products WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Search products by name
const searchByName = (query) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM products WHERE name LIKE ?`;
        db.all(sql, [`%${query}%`], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Filter products by category ID
const filterByCategoryName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT p.*, c.name AS category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE LOWER(c.name) = ?
      `;
        db.all(query, [name.toLowerCase()], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};


const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getCategoryByName = (name) => {
    return new Promise((resolve, reject) => {
        const sql = `S    console.error("❌ Delete failed:", err.message);
        ELECT id FROM categories WHERE LOWER(name) = LOWER(?)`;
        db.get(sql, [name], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const getByIdWithCategory = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT p.*, c.name AS category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};





// Export all functions
module.exports = {
    getAll,
    getById,
    add,
    update,
    searchByName,
    filterByCategoryName,
    deleteById,
    getCategoryByName,
    getByIdWithCategory
};
