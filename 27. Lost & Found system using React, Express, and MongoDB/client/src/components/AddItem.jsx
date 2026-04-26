import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    contact: '',
    type: 'Lost'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5005/api/items', formData);
      navigate('/');
    } catch (err) {
      setError('Failed to submit item. Make sure the backend server is running.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Report an Item</h1>
      </div>

      <div className="form-card">
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Report Type</label>
            <select 
              id="type"
              name="type" 
              className="form-control" 
              value={formData.type} 
              onChange={handleChange}
              required
            >
              <option value="Lost">I lost something</option>
              <option value="Found">I found something</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input 
              type="text" 
              id="itemName"
              name="itemName" 
              className="form-control" 
              value={formData.itemName} 
              onChange={handleChange} 
              placeholder="e.g. Blue Backpack, Car Keys"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description" 
              className="form-control" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Provide details like color, brand, distinct marks..."
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location (Where it was lost/found)</label>
            <input 
              type="text" 
              id="location"
              name="location" 
              className="form-control" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="e.g. Library 2nd floor, Main Cafeteria"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Your Contact Info</label>
            <input 
              type="text" 
              id="contact"
              name="contact" 
              className="form-control" 
              value={formData.contact} 
              onChange={handleChange} 
              placeholder="Email or Phone Number"
              required 
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Submitting...' : `Submit ${formData.type} Item`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
