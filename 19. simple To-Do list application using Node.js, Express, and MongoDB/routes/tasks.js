const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET - Show all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('todo', { tasks });
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST - Add new task
router.post('/add', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.redirect('/todo');
    }
    const task = new Task({ title: title.trim() });
    await task.save();
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST - Toggle task completion
router.post('/complete/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = !task.completed;
      await task.save();
    }
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST - Delete task
router.post('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/todo');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;
