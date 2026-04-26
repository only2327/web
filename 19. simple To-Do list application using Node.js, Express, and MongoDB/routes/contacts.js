const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET - Show all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('contacts', { contacts });
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST - Add new contact
router.post('/add', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.redirect('/contacts');
    }
    const contact = new Contact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    });
    await contact.save();
    res.redirect('/contacts');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

// POST - Delete contact
router.post('/delete/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/contacts');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;
