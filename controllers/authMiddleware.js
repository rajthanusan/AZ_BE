const jwt = require('jsonwebtoken');
const User = require('../modles/user');

// General authentication middleware to verify the JWT token
const authMiddleware = async (req, res, next) => {
    try {
        // Check if the authorization header is present
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach the user to the request object for use in next middleware or routes
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Admin-specific authentication middleware
const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Call the general auth middleware to check authentication
        await authMiddleware(req, res, async () => {
            // Check if the user has an admin role
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }

            // If the user is an admin, proceed to the next middleware or route handler
            next();
        });
    } catch (error) {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { authMiddleware, adminAuthMiddleware };
