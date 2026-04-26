const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Note = require('./models/Note');

const app = express();
const PORT = 5000;

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection ─────────────────────────────────────────────
mongoose.connect('mongodb://127.0.0.1:27017/notesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected – notesDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// ── API Routes ─────────────────────────────────────────────────────

// GET all notes (newest first)
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST – upload a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { subject, title, description, link, uploadedBy } = req.body;
    if (!subject || !title) {
      return res.status(400).json({ error: 'Subject and Title are required' });
    }
    const note = new Note({ subject, title, description, link, uploadedBy });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload note' });
  }
});

// DELETE a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// ── Serve React Build (Production) ────────────────────────────────
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
