const User = require('../modles/user');
const ARData = require('../modles/ARData');
const ChatLog = require('../modles/ChatLog');


// Controller to get all users
exports.getAllUsers = async (req, res) => {
    try {// controllers/adminController.js
        const User = require('../modles/user'); // Import the User model
        const ARData = require('../modles/ARData'); // Import the AR data model (replace with actual model)
        const ChatLogs = require('../modles/ChatLog'); // Import the chat logs model (replace with actual model)
        console.log("Fetching users from database...");
        const users = await User.find(); // Fetch users from the database
        console.log("Users data fetched successfully:", users);
        res.status(200).json({ data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Controller to get AR data
exports.getARData = async (req, res) => {
    try {
        console.log("Fetching AR data from database...");
        const arData = await ARData.find(); // Fetch AR data from the database
        console.log("AR data fetched successfully:", arData);
        res.status(200).json({ data: arData });
    } catch (error) {
        console.error("Error fetching AR data:", error);
        res.status(500).json({ message: "Error fetching AR data" });
    }
};

// Controller to get chat logs
exports.getChatLogs = async (req, res) => {
    try {
        console.log("Fetching chat logs from database...");
        const chatLogs = await ChatLog.find(); // Fetch chat logs from the database
        console.log("Chat logs fetched successfully:", chatLogs);
        res.status(200).json({ data: chatLogs });
    } catch (error) {
        console.error("Error fetching chat logs:", error);
        res.status(500).json({ message: "Error fetching chat logs" });
    }
};
