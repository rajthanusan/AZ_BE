// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
// console.log(sessionStorage.getItem('token'));

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your secret key
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied, admin only' });
        }
        next(); // User is an admin, proceed to the next middleware or route handler
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = adminMiddleware;
