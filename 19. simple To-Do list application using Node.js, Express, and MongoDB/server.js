const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/todo_contact_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const taskRoutes    = require('./routes/tasks');
const contactRoutes = require('./routes/contacts');

app.use('/todo',     taskRoutes);
app.use('/contacts', contactRoutes);

// Home - redirect to to-do
app.get('/', (req, res) => {
  res.redirect('/todo');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   📋 To-Do List   → http://localhost:${PORT}/todo`);
  console.log(`   📇 Contacts     → http://localhost:${PORT}/contacts`);
});
