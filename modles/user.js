// //user.js
const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // First name of the user
  lastName: { type: String, required: true },  // Last name of the user
  email: { type: String, required: true, unique: true }, // Email address must be unique
  password: { type: String, required: true }, // Password field,
  
  role: { type: String, enum: ['user', 'admin'], default: 'admin' } // Role with default value 'user',
  
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;


