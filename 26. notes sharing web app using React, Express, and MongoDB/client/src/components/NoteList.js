import React from 'react';
import NoteCard from './NoteCard';

function NoteList({ grouped, loading, totalNotes, onDelete, searchActive }) {
  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner"></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  const subjects = Object.keys(grouped);

  if (subjects.length === 0) {
    return (
      <div className="state-message empty">
        <div className="empty-icon">📭</div>
        <h3>No notes found</h3>
        <p>{searchActive ? 'Try adjusting your search criteria.' : 'Be the first to upload a note!'}</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {subjects.map(subject => (
        <div key={subject} className="subject-group">
          <div className="subject-header">
            <h2 className="subject-title">📚 {subject}</h2>
            <div className="subject-line"></div>
            <span className="subject-count">{grouped[subject].length} notes</span>
          </div>
          
          <div className="notes-grid">
            {grouped[subject].map(note => (
              <NoteCard key={note._id} note={note} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
