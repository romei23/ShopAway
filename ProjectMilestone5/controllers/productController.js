const fs = require('fs');
const { db } = require('../db/db');
const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAll();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        console.log("======== NEW PRODUCT SUBMISSION ========");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { name, description, price, category } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        if (!category || category.trim() === "") {
            return res.status(400).json({ error: "Category is required" });
        }

        // Look up category_id by name
        const categoryRow = await productModel.getCategoryByName(category);
        if (!categoryRow) {
            console.error("Category not found in database for:", category);
            return res.status(400).json({ error: "Invalid category name" });
        }

        // Build product with resolved category_id
        const newProduct = {
            name,
            description,
            price: parseFloat(price),
            category_id: categoryRow.id,
            image_url: `/uploads/${file.filename}`,
            is_featured: 0 // Optional default
        };

        // Add to DB
        await productModel.add(newProduct);

        res.status(201).json({ message: 'Product added successfully', product: newProduct });

    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, image_url } = req.body;
        const file = req.file;

        const categoryRow = await productModel.getCategoryByName(category);
        if (!categoryRow) {
            return res.status(400).json({ error: "Invalid category name" });
        }

        const updatedProduct = {
            name,
            description,
            price: parseFloat(price),
            category_id: categoryRow.id,
            image_url: file ? `/uploads/${file.filename}` : image_url,
            is_featured: 0
        };

        await productModel.update(productId, updatedProduct);
        res.json({ message: `Product ${productId} updated`, product: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.getByIdWithCategory(id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(fileContent);

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
        }

        for (const product of products) {
            const categoryRow = await productModel.getCategoryByName(product.category);
            if (!categoryRow) continue;

            await productModel.add({
                name: product.name,
                description: product.description,
                price: product.price,
                image_url: product.image,
                category_id: categoryRow.id,
                is_featured: 0,
            });
        }

        res.json({ message: 'Bulk upload successful', count: products.length });
    } catch (error) {
        console.error("Error during bulk upload:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.searchProducts = async (req, res) => {
    const { q } = req.query;

    try {
        if (!q || q.trim() === '') {
            return res.status(400).json({ error: "Search term is required" });
        }

        const results = await productModel.searchByName(q);
        res.json(results);
    } catch (err) {
        console.error("Search error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// productController.js
exports.filterByCategory = async (req, res) => {
    const categoryName = req.params.categoryName.toLowerCase();
    try {
        const products = await productModel.filterByCategoryName(categoryName);
        res.json(products);
    } catch (err) {
        console.error("Error filtering by category:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await productModel.deleteById(id);
        res.json({ message: "Deleted", id });
    } catch (err) {
        console.error("Delete failed:", err.message);
        res.status(500).json({ error: "Failed to delete" });
    }
};



