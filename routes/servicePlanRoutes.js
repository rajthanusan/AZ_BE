const express = require('express');
const router = express.Router();
const ServicePlan = require('../modles/servicePlan');  // Make sure the path to the ServicePlan model is correct

// Get all service plans
router.get('/', async (req, res) => {
    try {
        const servicePlans = await ServicePlan.find();  // Fetch all service plans from the database
        res.json(servicePlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const { planType, planDescription, planAmount } = req.body;

    // Validation: Check if all required fields are present
    if (!planType || !planDescription || !planAmount) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const servicePlan = new ServicePlan({
        planType,
        planDescription,
        planAmount
    });

    try {
        const newServicePlan = await servicePlan.save();
        res.status(201).json(newServicePlan); // Successfully created
    } catch (error) {
        res.status(500).json({ message: error.message }); // Internal server error
    }
});
// Update a service plan by ID
router.put('/:id', async (req, res) => {
    const { planType, planDescription, planAmount } = req.body;
    try {
        const servicePlan = await ServicePlan.findById(req.params.id);
        if (!servicePlan) {
            return res.status(404).json({ message: 'Service Plan not found' });
        }

        // Update service plan details
        servicePlan.planType = planType || servicePlan.planType;
        servicePlan.planDescription = planDescription || servicePlan.planDescription;
        servicePlan.planAmount = planAmount || servicePlan.planAmount;

        await servicePlan.save();  // Save updated service plan
        res.json({ message: 'Service Plan updated successfully', servicePlan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a service plan
router.delete('/:id', async (req, res) => {
    try {
        const result = await ServicePlan.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Service Plan not found' });
        }

        res.json({ message: 'Service Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
