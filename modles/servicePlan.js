const mongoose = require('mongoose');

// Define the schema for the ServicePlan model
const servicePlanSchema = new mongoose.Schema({
  planType: { type: String, required: true }, // Type of the service plan (e.g., Basic, Premium)
  planDescription: { type: String, required: true }, // Description of the service plan
  planAmount: { type: Number, required: true }, // Amount charged for the plan
  createdAt: { type: Date, default: Date.now } // Timestamp for when the plan was created
});

// Create and export the ServicePlan model
const ServicePlan = mongoose.model('ServicePlan', servicePlanSchema);
module.exports = ServicePlan;
