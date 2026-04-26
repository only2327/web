const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  subject:    { type: String, required: true, trim: true },
  title:      { type: String, required: true, trim: true },
  description:{ type: String, default: '', trim: true },
  link:       { type: String, default: '', trim: true },
  uploadedBy: { type: String, default: 'Anonymous', trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
