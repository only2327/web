const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Vehicle = require('./models/Vehicle');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/usedVehiclesDB')
    .then(() => console.log('Connected to MongoDB locally'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Display all vehicles
app.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.render('index', { vehicles });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading listings');
    }
});

// Handle form submission
app.post('/add-vehicle', async (req, res) => {
    try {
        const { type, make, model, year, price, mileage, description } = req.body;
        
        const newVehicle = new Vehicle({
            type,
            make,
            model,
            year,
            price,
            mileage,
            description
        });
        
        await newVehicle.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding vehicle listing');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
