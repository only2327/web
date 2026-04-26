const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/rentalDB')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
    itemType: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    rentalDuration: { type: Number, required: true }, // in days
    bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Available Items
const availableItems = [
    { id: 1, name: 'Mountain Bike', type: 'Bike', pricePerDay: 15, img: '🚲' },
    { id: 2, name: 'MacBook Pro', type: 'Laptop', pricePerDay: 50, img: '💻' },
    { id: 3, name: 'DSLR Camera', type: 'Camera', pricePerDay: 30, img: '📷' }
];

// Routes

// Home page: Display items and booking form
app.get('/', (req, res) => {
    res.render('index', { items: availableItems, message: null });
});

// Handle booking submission
app.post('/book', async (req, res) => {
    try {
        const { itemType, customerName, customerPhone, rentalDuration } = req.body;
        
        const newBooking = new Booking({
            itemType,
            customerName,
            customerPhone,
            rentalDuration
        });

        await newBooking.save();
        res.render('index', { items: availableItems, message: 'Booking successful!' });
    } catch (error) {
        console.error(error);
        res.render('index', { items: availableItems, message: 'Error processing booking. Please try again.' });
    }
});

// View all bookings
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.render('bookings', { bookings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving bookings.');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
