// // models/Service.js
// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//   serviceName: { 
//     type: String, 
//     required: true 
//   },
//   serviceDescription: { 
//     type: String, 
//     required: true 
//   },
//   serviceAmountPerHour: { type: Number, required: true }

// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// const Service = mongoose.model('Service', serviceSchema);

// module.exports = Service;
// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//   serviceName: { 
//     type: String, 
//     required: true 
//   },
//   serviceDescription: { 
//     type: String, 
//     required: true 
//   },
//   serviceAmountPerHour: { 
//     type: Number, 
//     required: true 
//   },
//   serviceImage: { 
//     type: String, 
//     required: false // Image is not required, but can be stored
//   }
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// const Service = mongoose.model('Service', serviceSchema);

// module.exports = Service;
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: { 
    type: String, 
    required: true 
  },
  serviceDescription: { 
    type: String, 
    required: true 
  },
  serviceAmountPerHour: { 
    type: Number, 
    required: true 
  },
  serviceImage: { 
    type: String, 
    required: false 
  }
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;