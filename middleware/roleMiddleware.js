// roleMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware to check if user has required role
function checkRole(role) {
    return function (req, res, next) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            if (decoded.role !== role) {
                return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
            }

            req.user = decoded;
            next();
        });
    };
}

module.exports = { checkRole };
