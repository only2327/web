import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async (typeFilter) => {
    try {
      setLoading(true);
      let url = 'http://localhost:5005/api/items';
      if (typeFilter && typeFilter !== 'All') {
        url += `?type=${typeFilter}`;
      }
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setItems(response.data);
        setError(null);
      } else {
        setItems([]);
        setError('Server returned invalid data. Make sure you started the backend server.');
      }
    } catch (err) {
      setError('Failed to fetch items. Make sure the backend server is running in a separate terminal.');
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(filter);
  }, [filter]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Recently Reported</h1>
        <Link to="/add" className="btn">Report New Item</Link>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Items
        </button>
        <button 
          className={`filter-btn ${filter === 'Lost' ? 'active lost' : ''}`}
          onClick={() => setFilter('Lost')}
        >
          Lost Items
        </button>
        <button 
          className={`filter-btn ${filter === 'Found' ? 'active found' : ''}`}
          onClick={() => setFilter('Found')}
        >
          Found Items
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading items...</div>
      ) : error ? (
        <div className="empty-state" style={{ color: 'var(--danger-color)' }}>{error}</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>There are no items matching your current filter.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div className="item-card" key={item._id}>
              <div className="item-content">
                <span className={`item-badge ${item.type.toLowerCase()}`}>
                  {item.type}
                </span>
                <h3 className="item-title">{item.itemName}</h3>
                <p className="item-desc">{item.description}</p>
                
                <div className="item-meta">
                  <div className="meta-row">
                    <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {item.location}
                  </div>
                  <div className="meta-row">
                    <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {item.contact}
                  </div>
                  <div className="meta-row">
                    <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
