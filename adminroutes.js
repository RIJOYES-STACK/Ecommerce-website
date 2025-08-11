const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../models/Admin');
const users = require('../models/users');
const products = require('../models/product');
const orders = require('../models/order');
const cart = require('../models/carts');
const { authenticate,adminsonly } = require('../middleware/Authadmin');
const router = express.Router();
const multer = require('multer');
const {uploader}=require('cloudinary').v2
const cloudinary = require('../middleware/Config/cloudinaryconfig');
const upload = multer({ storage: multer.memoryStorage() }); // Temporary memory storage


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingadmin = await admin.findOne({ email });
        if (existingadmin) {
            return res.status(404).json({ message: "Admin already existed" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newadmin = new admin({ name, email, password: hashedpassword });
        await newadmin.save();
        res.status(201).json({ message: "Admin has registered successfully" });
    } catch (err) {
        console.error("Error during admin registration:", err);
        res.status(500).json({ message: "Error during registration", error: err.message });
    }
});


// Admin login
router.post('/login',authenticate, async (req, res) => {
    const { email, password } = req.body;
    try {
        const Admin = await admin.findOne({ email });
        if (!Admin) return res.status(400).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, Admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: Admin._id }, process.env.JWT_SECRET, { expiresIn: '7h' });
        res.json({ message: "Admin login successfully", token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Admin - Add a new product (with image upload)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Upload image to Cloudinary with a promise
        const result = await new Promise((resolve, reject) => {
            const stream = uploader.upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            stream.end(req.file.buffer);
        });

        // Create new product with Cloudinary image URL
        const newProduct = new products({
            name,
            description,
            price,
            image: result.secure_url,
            category,
            stock
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


// Dashboard route
router.get('/dashboard', authenticate, async (req, res) => {
    res.json({ message: "Welcome to the dashboard" });
});

// Product management routes
router.get('/product',authenticate,adminsonly, async (req, res) => {
    try {
        const productsList = await products.find();
        res.json(productsList);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/products/:id',authenticate, async (req, res) => {
    try {
        const product = await products.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.put('/product/:id', authenticate, adminsonly, upload.single('image'), async (req, res) => {
    console.log("product ID to update", req.params.id);
    try {
        const { name, description, price, category, stock } = req.body;
        const updateFields = { name, description, price, category, stock };

        // Handle image upload if a new image is provided
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = uploader.upload_stream({ folder: "products" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file.buffer);
            });

            updateFields.image = result.secure_url;
        }

        const updatedProduct = await products.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "No product found with this ID" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});


router.delete('/product/:id', authenticate,adminsonly,async (req, res) => {
    try {
        const deletedProduct = await products.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "No product found with this ID" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});


// Order management routes
router.get('/order', authenticate,adminsonly, async (req, res) => {
    try{
    const order = await orders.find().populate('userId products.productId');
    if(!order){
        res.status(404).json({message:"order not found"});
    }
    res.json(order);
    }catch(err){
        console.error("error getting individiual error",err);
        res.status(500).json("error updating error",err);
    }
});

router.get('/order/:id', authenticate,adminsonly, async (req, res) => {
    try{
    const order = await orders.findById(req.params.id).populate('userId products.productId');
    if(!order){
        res.status(404).json({message:"order not found on this id"});
     }
    res.json(order);
    }catch(err){
        console.error("error getting individiual error",err);
        res.status(500).json("error updating error",err);
    }
});

router.put('/order/:id/status',authenticate,adminsonly,async(req,res)=>{
    try{
      const {status}=req.body;
      const updatedorder=await orders.findByIdAndUpdate(req.params.id,{status},{new:true});
      if(!updatedorder){
        res.status(404).json({message:"order not found"});
      }
      res.status(200).json(updatedorder);
      }catch(err){
        console.error("error updating error",err)
        res.status(500).json({message:"error updating order status",err:err.message});
      }


});

// Cart management routes
router.get('/cart', authenticate, async (req, res) => {
    const carts = await cart.find();
    res.json(carts);
});

router.delete('/cart/:id', authenticate,adminsonly,async (req, res) => {
    try {
        const deleted = await cart.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Cart item with this id not found" });
        }
        res.json({ message: "Cart item has been deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting cart item' });
    }
});



// User management routes
router.get('/user', authenticate, async (req, res) => {
    const Users = await users.find();
    res.json(Users); // Fixed this to res.json instead of req.json
});

router.delete('/user/:id', authenticate,adminsonly, async (req, res) => {
    try {
        const deleted = await users.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "User with this id not found" });
        }
        res.json({ message: "User has been deleted from cart" });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
