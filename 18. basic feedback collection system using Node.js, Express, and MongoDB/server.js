const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect('mongodb://127.0.0.1:27017/collegefeedbackDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅  MongoDB connected successfully'))
  .catch((err) => console.error('❌  MongoDB connection error:', err));

// ─── Feedback Schema & Model ──────────────────────────────────────────────────
const feedbackSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  feedback: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine (views folder)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /  → Feedback submission form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /submit  → Save feedback to MongoDB
app.post('/submit', async (req, res) => {
  try {
    const { studentName, subject, feedback } = req.body;

    if (!studentName || !subject || !feedback) {
      return res.status(400).send('All fields are required.');
    }

    const newFeedback = new Feedback({ studentName, subject, feedback });
    await newFeedback.save();

    res.redirect('/feedbacks');
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).send('Server error. Please try again.');
  }
});

// GET /feedbacks  → Display all feedback entries
app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.render('feedbacks', { feedbacks });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).send('Server error. Please try again.');
  }
});

// DELETE /delete/:id  → Delete a feedback entry
app.post('/delete/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.redirect('/feedbacks');
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).send('Server error. Please try again.');
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
  console.log(`📋  Submit feedback : http://localhost:${PORT}/`);
  console.log(`📊  View feedbacks  : http://localhost:${PORT}/feedbacks`);
});
