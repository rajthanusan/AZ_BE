const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/booking");
const bookingRoutes2 = require("./routes/bookingservice");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const servicePlanRoutes = require("./routes/servicePlanRoutes");
const aiRoutes = require("./routes/chatRoutes");

// Import PayPal service
const { createOrder, captureOrder } = require("./services/paypalService");

require('./services/scheduler'); 

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// PayPal Routes
app.post("/api/paypal/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const orderId = await createOrder(amount); // Call PayPal service function
    res.status(200).json({ id: orderId });
  } catch (error) {
    res.status(500).json({ error: "Error creating PayPal order" });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  const { orderID } = req.body;

  try {
    const capture = await captureOrder(orderID); // Call PayPal service function
    res.status(200).json({ capture });
  } catch (error) {
    res.status(500).json({ error: "Error capturing PayPal order" });
  }
});

// Mount other routes
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", bookingRoutes);
app.use("/api", bookingRoutes2);
app.use("/api/admin", adminRoutes);
app.use("/api/service-plans", servicePlanRoutes);
app.use("/api/aichat", aiRoutes);
app.use('/uploads', express.static('uploads'));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
