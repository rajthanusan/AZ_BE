const Booking = require('../modles/Booking');

const bookService = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, postalCode, city, country, duration, paymentMethod, cardholderName, cardNumber, expirationDate, cvc } = req.body;

        // Create a new booking document
        const newBooking = new Booking({
            name,
            email,
            phoneNumber,
            address,
            postalCode,
            city,
            country,
            duration,
            paymentMethod,
            cardholderName,
            cardNumber,
            expirationDate,
            cvc
        });

        // Save to the database
        await newBooking.save();

        res.status(201).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error booking service:', error);
        res.status(500).json({ error: 'An error occurred while processing your booking.' });
    }
};

module.exports = { bookService };
