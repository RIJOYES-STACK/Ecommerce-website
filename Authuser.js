const jwt = require('jsonwebtoken');

const verifyuser = (req, res, next) => {
    try {

        const authHeader = req.headers['authorization'];  


        if (!authHeader) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Access denied, invalid token format" });
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = { verifyuser };
