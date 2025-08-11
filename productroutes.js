const express = require('express');
const router = express.Router();
const product = require('../models/product');
const { authenticate } = require('../middleware/Authadmin');


// Get all products
router.get('/products', async (req, res) => {
    try {
        const Product = await product.find();
        if (!Product) {
            return res.status(404).json({ message: "Products not found" });
        }
        res.status(200).json(Product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const Product = await product.findById(req.params.id);
        if (!Product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(Product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Search products
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const Product = await product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(Product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
