// services/scheduler.js
const cron = require('node-cron');
const Booking = require('../modles/Booking');
const { sendReminderEmail } = require('./emailService');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endingBookings = await Booking.find({
      endDate: today,
    });

    for (const booking of endingBookings) {
      await sendReminderEmail(booking.planemail, booking.planName, booking.planserviceLocation);
    }

    console.log('Reminder emails sent successfully');
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
});
