// routes/booking.js
const express = require('express');
const path = require('path');
const Booking = require('../modles/Booking');
const router = express.Router();
const multer = require('multer');
const { sendPlanBookingConfirmationEmail } = require('../services/emailService'); 
// In your router file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique file name
  },
});

const upload = multer({ storage });
// routes/booking.js
router.post('/bookings', upload.single('serviceImage'), async (req, res) => {
  const { planName, planserviceLocation, planpaymentId, planuser, planemail, planduration, plantotalAmount } = req.body;
  const serviceImage = req.file ? req.file.filename : null;
  
  // Validate incoming data
  if (!planName || !planserviceLocation || !planpaymentId || !planuser || !planemail || !planduration || plantotalAmount === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Calculate end date based on duration
  const durationInDays = parseInt(planduration) * 30; // assuming planduration is in months
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationInDays);

  try {
    const newBooking = new Booking({
      planName,
      planserviceLocation,
      planpaymentId,
      planuser,
      planemail,
      planduration,
      plantotalAmount,
      serviceImage,
      endDate, // Save the calculated end date
    });

    await newBooking.save();

    await sendPlanBookingConfirmationEmail(planemail, planName, planserviceLocation, planduration, plantotalAmount);

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});


router.get('/booking', async (req, res) => {
  const { user, serviceName, serviceLocation } = req.query;

  try {
    // Filter bookings based on the username, service name, and location
    const bookings = await Booking.find({
      planuser: user,
      planName: serviceName,
      planserviceLocation: serviceLocation,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});


router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings from the database
    res.status(200).json(bookings); // Send the bookings as the response
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

  
// DELETE /api/bookings/:id
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deletedBooking = await Booking.findByIdAndDelete(id); // Delete the booking by ID

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' }); // Handle not found case
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking }); // Return success response
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' }); // Return server error
  }
});
module.exports = router;
