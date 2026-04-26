import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';

function App() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    reviewerName: '',
    rating: 5,
    comment: ''
  });

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', formData);
      setFormData({
        productName: '',
        reviewerName: '',
        rating: 5,
        comment: ''
      });
      fetchReviews(); // Refresh list after submitting
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Generate star rating string
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-muted"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="app-container">
      <Container className="py-5">
        <h1 className="text-center mb-5 text-white title-glow">E-Commerce Feedback Review System</h1>
        
        <Row className="g-4">
          <Col md={5}>
            <div className="glass-card p-4">
              <h3 className="mb-4 text-white">Submit a Review</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Product Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="productName" 
                    value={formData.productName} 
                    onChange={handleChange} 
                    placeholder="Enter product name" 
                    required 
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="reviewerName" 
                    value={formData.reviewerName} 
                    onChange={handleChange} 
                    placeholder="Enter your name" 
                    required 
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Rating (1-5)</Form.Label>
                  <Form.Select 
                    name="rating" 
                    value={formData.rating} 
                    onChange={handleChange} 
                    required
                    className="custom-input"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Comment</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="comment" 
                    value={formData.comment} 
                    onChange={handleChange} 
                    placeholder="Share your experience..." 
                    required 
                    className="custom-input"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 premium-btn">
                  Submit Feedback
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={7}>
            <div className="glass-card p-4 h-100">
              <h3 className="mb-4 text-white">Recent Reviews <Badge bg="info" className="ms-2">{reviews.length}</Badge></h3>
              
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-muted text-center py-5">No reviews yet. Be the first to leave one!</p>
                ) : (
                  reviews.map((review) => (
                    <Card key={review._id} className="review-card mb-3 border-0">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title text-primary mb-0">{review.productName}</h5>
                          <div className="star-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <h6 className="card-subtitle mb-3 text-muted">
                          by {review.reviewerName} <span className="ms-2 small date-text">{new Date(review.date).toLocaleDateString()}</span>
                        </h6>
                        <Card.Text className="review-text">
                          "{review.comment}"
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
