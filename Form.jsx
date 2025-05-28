import React, { useState, useEffect } from 'react';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: '',
    message: ''
  });

  const [submissions, setSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
    setSubmissions(savedSubmissions);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send booking');
      }

      const updatedSubmissions = [...submissions, formData];
      setSubmissions(updatedSubmissions);
      localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
      setSubmitSuccess(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        appointmentType: '',
        message: ''
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      alert('Error submitting booking. Please make sure the server is running.\n' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    const drafts = JSON.parse(localStorage.getItem('bookingDrafts')) || [];
    localStorage.setItem('bookingDrafts', JSON.stringify([...drafts, formData]));
    alert('Draft saved successfully!');
  };

  const handleDelete = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      appointmentType: '',
      message: ''
    });
    setSubmitSuccess(false);
    alert('Form cleared successfully!');
  };

  return (
    <div className="website-surface">
      <h2 className="form-title">YOUR BOOKING FOR APPOINTMENT</h2>
      <div className="appointment-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Name" required />
          </div>

          <div className="form-group">
            <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Email" required />
          </div>

          <div className="form-group">
            <input type="tel" id="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
          </div>

          <div className="form-group">
            <select id="appointmentType" className="dropdown-container" value={formData.appointmentType} onChange={handleChange} required>
              <option value="">Select appointment type</option>
              <option value="One on One Consulting">One on One Consulting</option>
              <option value="Consultation">Consultation</option>
            </select>
            
          </div>

          <div className="form-group">
            <textarea id="message" className="form-control" value={formData.message} onChange={handleChange} placeholder="Write your inquiry here..." required></textarea>
          </div>

          <div className="button-group">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleDelete}>Delete</button>
          </div>

          <button type="submit" disabled={isSubmitting} className="button-submit">
            <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>

        {submitSuccess && <p className="success-message">Booking submitted successfully!</p>}

        
        
      </div>
      <p className="btn-2025">© 2025 Bo Ki's your Booking</p>
    </div>
  );
};

export default Form;