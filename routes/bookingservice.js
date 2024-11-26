const express = require('express');
const router = express.Router();
const Booking = require('../modles/Bookingservice'); // Corrected 'modles' to 'models'
const { sendBookingConfirmationEmail } = require('../services/emailService'); // Adjust the path as needed

router.post('/bookingservice', async (req, res) => {
  console.log(req.body); // Log incoming request body
  const { planName, serviceLocation, hours, paymentId, email, totalAmount } = req.body;

  // Validate incoming data
  if (!planName || !serviceLocation || !hours || !paymentId || !email || !totalAmount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new booking instance
    const newBooking = new Booking({
      planName,
      serviceLocation,
      hours,
      paymentId,
      email,
      totalAmount,
    });

    // Save the booking to the database
    await newBooking.save();

    // Send booking confirmation email
    await sendBookingConfirmationEmail(email, planName, serviceLocation, hours, totalAmount);

    // Respond with success message
    res.status(201).json({ message: 'Booking successfully created', bookingId: newBooking._id });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bookings/:id
router.get('/bookingservice/:id', async (req, res) => {
  const { id } = req.params; // Get booking ID from URL parameters

  try {
    const booking = await Booking.findById(id); // Find the booking by ID

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' }); // Handle not found case
    }

    res.status(200).json(booking); // Respond with the found booking
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bookings
router.get('/bookingservice', async (req, res) => {
  try {
    // Fetch all bookings from the database
    const bookings = await Booking.find();

    // Respond with the list of bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/bookings/:id
router.delete('/bookingservice/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request params
    const deletedBooking = await Booking.findByIdAndDelete(id); // Use 'Booking' instead of 'BookingService'

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' }); // If booking doesn't exist, return a 404 error
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking }); // Return success response
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' }); // Return a server error if something goes wrong
  }
});

module.exports = router;




