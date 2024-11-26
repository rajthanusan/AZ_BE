const express = require('express');
const Booking = require('../modles/Booking'); // Ensure the correct path
const router = express.Router();
const { sendBookingConfirmationEmail } = require('../services/emailService');

router.post('/bookingservice', async (req, res) => {
  console.log(req.body); // Log incoming request body
  const { planName, serviceLocation, hours, paymentId, email, totalAmount } = req.body;

  // Validate incoming data
  if (!planName || !serviceLocation || !hours || !paymentId || !email || !totalAmount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newBooking = new Booking({
      planName,
      serviceLocation,
      hours,
      paymentId,
      email,
      totalAmount,
    });

    await newBooking.save();

    // Send booking confirmation email
    await sendBookingConfirmationEmail(email, planName, serviceLocation, hours, totalAmount);

    res.status(201).json({ message: 'Booking successfully created', bookingId: newBooking._id });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;