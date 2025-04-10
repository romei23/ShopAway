// filepath: ProjectMilestone5/models/productModel.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ProjectMilestone5/db/shopall.db');

// Get all products
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Add a product
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

// Update a product
const update = (id, product) => {
    return new Promise((resolve, reject) => {
        const { name, description, image_url, price, category_id, is_featured } = product;
        const query = `
            UPDATE products 
            SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ?
            WHERE id = ?
        `;
        db.run(query, [name, description, image_url, price, category_id, is_featured || 0, id], function (err) {
            if (err) reject(err);
            else resolve();
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
const filterByCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM products WHERE category_id = ?`;
        db.all(sql, [categoryId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
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
    filterByCategory
};


