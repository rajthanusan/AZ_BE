//authRoutes.js
const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/roleMiddleware.js');

// Example route for admin access
router.get('/admin', checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

// Example route for user access
router.get('/user', checkRole('user'), (req, res) => {
    res.json({ message: 'Welcome User' });
});



// Import the controller functions
const {
    registerUser,
    registerAdmin,
    login,
    adminDashboard,
    userDashboard
} = require('../controllers/authController.js'); // Ensure the path is correct

// Define routes
router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/admin-dashboard', adminDashboard);
router.get('/user-dashboard', userDashboard);

module.exports = router;
