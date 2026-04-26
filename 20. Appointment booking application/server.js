const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
// Note: We avoid top-level await for mongoose.connect to ensure the server starts even if DB is slow.
// We handle connection events.
mongoose.connect('mongodb://127.0.0.1:27017/appointmentDB').then(() => {
    console.log('Successfully connected to MongoDB.');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define Mongoose Schema & Model
const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    reason: { type: String },
    status: { type: String, default: 'Pending' } // Pending, Confirmed, Cancelled
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// --- API Routes ---

// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ appointmentDate: 1, appointmentTime: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
});

// Create a new appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const { patientName, doctorName, appointmentDate, appointmentTime, reason } = req.body;
        
        const newAppointment = new Appointment({
            patientName,
            doctorName,
            appointmentDate,
            appointmentTime,
            reason
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to book appointment.' });
    }
});

// Update appointment status
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        res.json(updatedAppointment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update appointment.' });
    }
});

// Delete (Cancel) an appointment
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        res.json({ message: 'Appointment cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel appointment.' });
    }
});

// Fallback to index.html for any other route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
