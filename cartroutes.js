const express = require('express');
const router = express.Router();
const Cart = require('../models/carts');
const Product = require('../models/product');
const { verifyuser } = require('../middleware/Authuser');

// Get user's cart
router.get('/', verifyuser, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        
        // Remove products with null productId
        cart.products = cart.products.filter(p => p.productId !== null);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        await cart.save(); // Save the cleaned-up cart
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});


// Add products to cart
router.post('/add', verifyuser, async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, products: [] });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
});

// Update product quantity in cart
router.put('/update', verifyuser, async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId); 
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating cart' });
    }
});

// Remove product from cart
router.delete('/remove/:productId', verifyuser, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.products = cart.products.filter(p => p.productId.toString() !== req.params.productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error removing product from cart' });
    }
});

// Clear cart
router.delete('/clear', verifyuser, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.products = [];
        await cart.save();
        res.json({ message: "Cart cleared" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

module.exports = router;
