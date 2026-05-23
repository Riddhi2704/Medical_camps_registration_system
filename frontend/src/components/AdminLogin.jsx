import React, { useState } from 'react';
import { Shield, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Artificial tiny delay for premium feel loading state
    setTimeout(() => {
      if (username === 'Login@2026' && password === 'Login@123') {
        onLoginSuccess();
      } else {
        setError('Incorrect Login ID or Password. Please try again.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div 
        className="admin-glass-container" 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '2.5rem 2rem', 
          animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div 
            className="logo-icon" 
            style={{ 
              margin: '0 auto 1rem auto', 
              width: '50px', 
              height: '50px', 
              borderRadius: '16px',
              animation: 'none'
            }}
          >
            <Shield size={26} />
          </div>
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Gate</h2>
          <p className="seats-label">Provide administrative authorization credentials</p>
        </div>

        {error && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: '#ef4444', 
              padding: '0.75rem 1rem', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              marginBottom: '1.5rem' 
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
            <label className="form-label">Login ID</label>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              name="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            <label className="form-label">Password</label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn btn-primary form-submit-btn"
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <KeyRound size={16} />
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <button 
          onClick={onCancel}
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', padding: '0.75rem' }}
        >
          <ArrowLeft size={16} />
          Return to Portal
        </button>
      </div>
    </div>
  );
}
