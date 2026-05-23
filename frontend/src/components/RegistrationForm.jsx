import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function RegistrationForm({ selectedCamp, camps, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    contactNumber: '',
    campId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredDetails, setRegisteredDetails] = useState(null);

  useEffect(() => {
    if (selectedCamp) {
      setFormData(prev => ({ ...prev, campId: selectedCamp._id }));
    } else if (camps && camps.length > 0) {
      // Find first available camp
      const available = camps.find(c => c.capacity > c.registeredCount);
      if (available) {
        setFormData(prev => ({ ...prev, campId: available._id }));
      }
    }
  }, [selectedCamp, camps]);

  const validate = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      tempErrors.fullName = 'Name must be at least 3 characters.';
    }

    if (!formData.age) {
      tempErrors.age = 'Age is required.';
    } else {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        tempErrors.age = 'Please enter a valid age (1 - 120).';
      }
    }

    if (!formData.contactNumber.trim()) {
      tempErrors.contactNumber = 'Contact Number is required.';
    } else {
      const phoneRegex = /^\+?[0-9\s\-]{8,15}$/;
      if (!phoneRegex.test(formData.contactNumber.trim())) {
        tempErrors.contactNumber = 'Please enter a valid phone number (8-15 digits).';
      }
    }

    if (!formData.campId) {
      tempErrors.campId = 'Please select a medical camp.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit registration');
      }

      setRegisteredDetails(data);
      setShowSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(); // refresh parent camps data
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Confetti Pieces
  const renderConfetti = () => {
    const pieces = [];
    const colors = ['#06b6d4', '#f97316', '#6366f1', '#10b981', '#ec4899'];
    for (let i = 0; i < 40; i++) {
      const left = Math.random() * 100 + '%';
      const delay = Math.random() * 2 + 's';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 6 + 6 + 'px';
      pieces.push(
        <div 
          key={i} 
          className="confetti-piece"
          style={{
            left,
            animationDelay: delay,
            backgroundColor: color,
            width: size,
            height: size,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      );
    }
    return pieces;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close" aria-label="Close">
          <X size={18} />
        </button>

        {showSuccess ? (
          <div className="success-overlay">
            <div className="confetti-container">
              {renderConfetti()}
            </div>
            <div className="success-icon-wrapper">
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 className="success-title">Registration Successful!</h3>
            <p className="success-msg">
              Thank you, <strong>{registeredDetails?.fullName}</strong>. <br />
              You have been registered for <strong>{registeredDetails?.camp?.title}</strong>.<br />
              Please remember to carry a valid ID card on the day of the camp.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '150px' }}>
              Close Window
            </button>
          </div>
        ) : (
          <div className="register-form-container">
            <h3 className="register-title">Camp Registration</h3>
            <p className="register-subtitle">
              {selectedCamp ? `Registering for: ${selectedCamp.title}` : 'Fill in details to secure your spot'}
            </p>

            {submitError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Camp Selection - Only show if not pre-selected from card */}
              {!selectedCamp && (
                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <select
                    name="campId"
                    value={formData.campId}
                    onChange={handleChange}
                    className="form-input"
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select Medical Camp</option>
                    {camps
                      .filter(c => c.capacity > c.registeredCount)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.title} ({c.capacity - c.registeredCount} seats left)
                        </option>
                      ))
                    }
                  </select>
                  <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                    Choose Medical Camp
                  </label>
                  {errors.campId && <span className="form-error">{errors.campId}</span>}
                </div>
              )}

              {/* Full Name */}
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder=" "
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <label className="form-label">Full Name</label>
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              {/* Age */}
              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  placeholder=" "
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <label className="form-label">Age</label>
                {errors.age && <span className="form-error">{errors.age}</span>}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder=" "
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <label className="form-label">Contact Number (e.g. +91 9876543210)</label>
                {errors.contactNumber && <span className="form-error">{errors.contactNumber}</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary form-submit-btn"
              >
                {isSubmitting ? 'Processing Registration...' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
