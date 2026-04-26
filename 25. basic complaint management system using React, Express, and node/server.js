const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Complaint = require('./models/Complaint');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect('mongodb://127.0.0.1:27017/complaintDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ─── API Routes ────────────────────────────────────────────────────────────────

// GET all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST submit new complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const { name, category, issue } = req.body;

    if (!name || !category || !issue) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const complaint = new Complaint({ name, category, issue });
    const saved = await complaint.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// PATCH update complaint status
app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Complaint not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE a complaint
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
