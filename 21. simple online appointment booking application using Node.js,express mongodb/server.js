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
mongoose.connect('mongodb://127.0.0.1:27017/appointments_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB (appointments_db)');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Define Appointment Schema and Model
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Available services (could be stored in DB too, but hardcoded for simplicity)
const availableServices = [
  { id: 'salon', name: 'Hair Salon' },
  { id: 'consultant', name: 'Business Consultant' },
  { id: 'dentist', name: 'Dentist' },
  { id: 'massage', name: 'Massage Therapy' },
  { id: 'mechanic', name: 'Car Mechanic' }
];

// API Routes

// 1. Get available services
app.get('/api/services', (req, res) => {
  res.json(availableServices);
});

// 2. Create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, date, time, service } = req.body;
    
    const newAppointment = new Appointment({
      name,
      date,
      time,
      service
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// 3. Get all booked appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// 4. Update an appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// 5. Delete an appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
