const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
});

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
module.exports = ChatLog;
