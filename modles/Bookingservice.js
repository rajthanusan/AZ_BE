const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  serviceLocation: { type: String, required: true },
  hours: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Payment ID field
  email: { type: String, required: true }, // Add email field
  totalAmount: { type: Number, required: true }, // Total amount field
}, {
  timestamps: true, // Automatically create timestamps for the booking
});

const Booking = mongoose.model('Bookingservice', BookingSchema); // Corrected model name

module.exports = Booking;


