import React from 'react';
import MedCampLogo from './MedCampLogo';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Navbar({ currentView, onViewChange, onOpenRegister }) {
  return (
    <header className="header">
      <div className="navbar">
        <div className="brand" onClick={() => onViewChange('user')}>
          <MedCampLogo size={38} className="logo-svg" />
          <span className="brand-text logo-title">MedCamp <span className="portal-sub">portal</span></span>
        </div>
        
        <nav>
          <ul className="nav-links">
            {currentView === 'user' ? (
              <>
                <li><a href="#home" className="nav-link active">Home</a></li>
                <li><a href="#camps" className="nav-link">Medical Camps</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
                <li>
                  <button 
                    onClick={() => onViewChange('admin')} 
                    className="nav-link"
                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Shield size={15} /> Admin Portal
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button 
                    onClick={() => onViewChange('user')} 
                    className="nav-link"
                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ArrowLeft size={16} /> Back to Portal
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div>
          {currentView === 'user' ? (
            <button onClick={onOpenRegister} className="nav-cta-btn">
              Register Now
            </button>
          ) : (
            <div className="table-badge cyan" style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '600' }}>
              Logged in as Admin
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
