import React, { useState } from 'react';

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'Computer Science', 'English', 'History', 'Geography', 
  'Economics', 'Accounts', 'Other'
];

function NoteForm({ onNoteAdded }) {
  const initialState = { subject: '', title: '', description: '', link: '', uploadedBy: '' };
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.title.trim()) {
      setAlert({ type: 'error', msg: 'Subject and Title are required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setAlert({ type: 'success', msg: 'Note uploaded successfully!' });
      setForm(initialState);
      onNoteAdded();
      
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message || 'Upload failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2 className="card-title">
        <span className="icon">📤</span> Upload Note
      </h2>
      
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject *</label>
          <select name="subject" value={form.subject} onChange={handleChange} className="form-control">
            <option value="">— Select Subject —</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Note Title *</label>
          <input 
            type="text" 
            name="title" 
            placeholder="e.g. Chapter 3 – Integration" 
            value={form.title} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            placeholder="Brief summary..." 
            value={form.description} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Resource Link</label>
          <input 
            type="url" 
            name="link" 
            placeholder="e.g. https://drive.google.com/..." 
            value={form.link} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Uploaded By</label>
          <input 
            type="text" 
            name="uploadedBy" 
            placeholder="Your name (optional)" 
            value={form.uploadedBy} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : '🚀 Upload Note'}
        </button>
      </form>
    </div>
  );
}

export default NoteForm;
