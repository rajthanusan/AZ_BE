const mongoose = require('mongoose');

const arDataSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true, // Ensure this field is always provided
    },
    designDescription: {
        type: String,
        required: true, // Ensure this field is always provided
    },
    imagePath: {
        type: String,
        required: false, // Optional, for storing the path of uploaded images
    }
});

// Create the ARData model
const ARData = mongoose.model('ARData', arDataSchema);

module.exports = ARData;
