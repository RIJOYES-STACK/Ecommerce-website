const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// Login route
router.post('/login/:role', async (req, res) => {
    const { role } = req.params;
    const { email, password } = req.body;

    try {
        let user = null;

        if (role === 'admin') {
            user = await Admin.findOne({ email });
        } else if (role === 'user') {
            user = await Users.findOne({ email });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7h' });
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Role check route (already present)
router.get('/', async (req, res) => {
    try {
        const userId = req.admin ? req.admin.id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found' });
        }

        const isAdmin = await Admin.findById(userId);
        res.json({ isAdmin: !!isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking role', error: error.message });
    }
});

module.exports = router;
