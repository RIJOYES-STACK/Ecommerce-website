const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/users');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(400).json({ message: "Access denied. No token provided." });
        }

        // Handle "Bearer <token>" format
        const tokenParts = token.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(400).json({ message: "Invalid token format." });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debug the token content

        // Check Admin or User
        let user = await Admin.findById(decoded.id);
        if (user) {
            req.isAdmin = true;
        } else {
            user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            req.isAdmin = false;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid token." });
    }
};

// Middleware to restrict access to only Admins
const adminsonly = async (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { authenticate, adminsonly };
