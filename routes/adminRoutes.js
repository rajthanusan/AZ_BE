// routes/adminRoutes.js
const express = require('express');
const { getAllUsers, getARData, getChatLogs } = require('../controllers/adminController');
const { adminAuthMiddleware } = require('../controllers/authMiddleware');

const router = express.Router();

// Route to fetch all users
router.get('/', adminAuthMiddleware, getAllUsers);

// Route to fetch AR data
router.get('/ar-data', adminAuthMiddleware, getARData);

// Route to fetch AI chatbot logs
router.get('/chat-logs', adminAuthMiddleware, getChatLogs);

module.exports = router;
