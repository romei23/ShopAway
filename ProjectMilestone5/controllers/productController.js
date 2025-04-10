const fs = require('fs');
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
        const newProduct = req.body;
        await productModel.add(newProduct);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        await productModel.update(productId, updatedProduct);
        res.json({ message: `Product with ID ${productId} updated successfully`, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.getById(id);

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
            await productModel.add(product);
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
        const results = await productModel.searchByName(q);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.filterByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const results = await productModel.filterByCategory(categoryId);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

