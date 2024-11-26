// emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // Log to console
  debug: true, // Include SMTP traffic in the logs
});

const sendRegistrationEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Registration Successful",
    html: `
  <h1>Hello ${firstName}!</h1>
  <p>Thank you for registering on our <strong>Azboard Property Management and Home Services</strong>.</p>
  <p>Your email is <strong>${email}</strong>.</p>
  <p>We are excited to have you on board!</p>
  <p>Best regards,<br>AZBOARD.</p>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Error sending registration email:", error);
  }
};

const sendBookingConfirmationEmail = async (
  email,
  planName,
  serviceLocation,
  hours,
  totalAmount
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Booking Confirmation",
    html: `
        <h1>Your Booking is Confirmed!</h1>
        <p>Thank you for your booking.</p>
        <p><strong>Service Name:</strong> ${planName}</p>
        <p><strong>Service Location:</strong> ${serviceLocation}</p>
        <p><strong>Hours:</strong> ${hours}</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
        <p>We look forward to serving you!</p>
        <p>Best regards,<br>AZBOARD.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};

const sendPlanBookingConfirmationEmail = async (
  email,
  planName,
  planserviceLocation,
  planduration,
  plantotalAmount
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Booking Confirmation",
    html: `
        <h1>Your Booking is Confirmed!</h1>
        <p>Thank you for your booking.</p>
        <p><strong>Plan Name:</strong> ${planName}</p>
        <p><strong>Service Location:</strong> ${planserviceLocation}</p>
        <p><strong>Duration:</strong> ${planduration}</p>
        <p><strong>Total Amount:</strong> $${plantotalAmount}</p>
        <p>We look forward to serving you!</p>
        <p>Best regards,<br>AZBOARD.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};
module.exports = {
  sendRegistrationEmail,
  sendBookingConfirmationEmail,
  sendPlanBookingConfirmationEmail,
};
