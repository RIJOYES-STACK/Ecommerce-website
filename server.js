const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const Products = require('../Routes/productroutes');
const carts = require('../Routes/cartroutes');
const users = require('../Routes/usersRoutes');
const orders = require('../Routes/orderRoutes');
const Admin = require('../Routes/adminroutes');
const Rolecheck = require('../Routes/Userroleroutes');

app.use('/api/products', Products);
app.use('/api/cart', carts);
app.use('/api/users', users);
app.use('/api/orders', orders);
app.use('/api/admin', Admin);
app.use('/api/role', Rolecheck);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
