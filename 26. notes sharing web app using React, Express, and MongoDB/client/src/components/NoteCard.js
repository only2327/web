import React from 'react';

function NoteCard({ note, onDelete }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="note-card">
      <div className="note-header">
        <span className="badge">{note.subject}</span>
        <button className="btn-icon btn-delete" onClick={() => onDelete(note._id)} title="Delete Note">
          🗑️
        </button>
      </div>
      
      <h3 className="note-title">{note.title}</h3>
      
      {note.description && (
        <p className="note-desc">{note.description}</p>
      )}
      
      {note.link && (
        <a href={note.link} target="_blank" rel="noopener noreferrer" className="note-link">
          🔗 {note.link.length > 40 ? note.link.substring(0, 40) + '...' : note.link}
        </a>
      )}
      
      <div className="note-footer">
        <span className="note-author">👤 {note.uploadedBy || 'Anonymous'}</span>
        <span className="note-date">📅 {formattedDate}</span>
      </div>
    </div>
  );
}

export default NoteCard;
