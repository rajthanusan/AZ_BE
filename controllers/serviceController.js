 
// // Sample data for services (In real-world, this would come from a database)
// let services = [
//     { id: 1, name: "Basic Plan", price: 1950, features: ["Regular Cleaning", "Outside Cleaning","Outside Floors", "Waste Management","Basic Repair","Utility Management"] },
//     { id: 2, name: "Premium Plan", price: 9950, features: ["All Weekly Base Plans", "Deep Cleaning","house inside & outside","Windows and Doors", "Garden Maintenance","Interior maintanence and Security check"] },
//     { id: 3, name: "Pro Plan", price: 19500, features: ["All Premium Plans", "Full Property Management","AR painting","AR Room Setup"] }
// ];

// // Controller functions
// const getAllServices = (req, res) => {
//     res.json(services);
// };

// const createService = (req, res) => {
//     const newService = { id: services.length + 1, ...req.body };
//     services.push(newService);
//     res.status(201).json(newService);
// };

// const updateService = (req, res) => {
//     const id = parseInt(req.params.id);
//     const serviceIndex = services.findIndex(service => service.id === id);
//     if (serviceIndex === -1) return res.status(404).send('Service not found.');

//     services[serviceIndex] = { ...services[serviceIndex], ...req.body };
//     res.json(services[serviceIndex]);
// };

// const deleteService = (req, res) => {
//     const id = parseInt(req.params.id);
//     services = services.filter(service => service.id !== id);
//     res.status(204).send();
// };

// // Export the controller functions
// module.exports = {
//     getAllServices,
//     createService,
//     updateService,
//     deleteService
// };
const Service = require('../modles/Service');
const path = require('path');

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
const createService = async (req, res) => {
  const { serviceName, serviceDescription, serviceAmountPerHour } = req.body;

  if (!serviceName || !serviceDescription || !serviceAmountPerHour) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const serviceImage = req.file ? req.file.filename : null;

  const service = new Service({
    serviceName,
    serviceDescription,
    serviceAmountPerHour,
    serviceImage,
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a service by ID
const updateService = async (req, res) => {
  const { serviceName, serviceDescription, serviceAmountPerHour } = req.body;

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.serviceName = serviceName || service.serviceName;
    service.serviceDescription = serviceDescription || service.serviceDescription;
    service.serviceAmountPerHour = serviceAmountPerHour || service.serviceAmountPerHour;

    if (req.file) {
      service.serviceImage = req.file.filename;
    }

    await service.save();
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a service by ID
const deleteService = async (req, res) => {
  try {
    const result = await Service.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};

