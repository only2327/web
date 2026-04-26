import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

function App() {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/notes');
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  // Group notes by subject after filtering
  const grouped = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? notes.filter(n =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          (n.description || '').toLowerCase().includes(q)
        )
      : notes;

    return filtered.reduce((acc, note) => {
      (acc[note.subject] = acc[note.subject] || []).push(note);
      return acc;
    }, {});
  }, [notes, search]);

  const totalNotes    = notes.length;
  const totalSubjects = new Set(notes.map(n => n.subject)).size;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">📓</div>
            <div>
              <div className="logo-title">NoteShare</div>
              <div className="logo-sub">Academic Notes Sharing Portal</div>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-chip">
              <span className="dot dot-blue"></span>
              Notes: <strong>{totalNotes}</strong>
            </div>
            <div className="stat-chip">
              <span className="dot dot-purple"></span>
              Subjects: <strong>{totalSubjects}</strong>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        {/* Left: Upload Form */}
        <aside className="sidebar">
          <NoteForm onNoteAdded={fetchNotes} />
        </aside>

        {/* Right: Notes Browser */}
        <section className="content">
          {/* Search */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search notes by title, subject or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Notes List */}
          <NoteList
            grouped={grouped}
            loading={loading}
            totalNotes={totalNotes}
            onDelete={handleDelete}
            searchActive={!!search.trim()}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
