import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CampCard from './components/CampCard';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import MedCampLogo from './components/MedCampLogo';
import { Mail, Globe, Linkedin, Instagram, Activity, Award, Heart, Shield, ArrowRight } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('user'); // 'user' or 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(sessionStorage.getItem('isAdminAuthenticated') === 'true');
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stats summaries
  const [stats, setStats] = useState({
    activeCamps: 0,
    totalSlots: 0,
    filledSlots: 0
  });

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/camps');
      if (!response.ok) throw new Error('Could not retrieve medical camps');
      const data = await response.json();
      setCamps(data);
      
      // Calculate stats (only for active/future camps)
      const futureCamps = data.filter(c => new Date(c.date) > new Date());
      const active = futureCamps.length;
      const capacitySum = futureCamps.reduce((acc, c) => acc + c.capacity, 0);
      const registeredSum = futureCamps.reduce((acc, c) => acc + c.registeredCount, 0);
      
      setStats({
        activeCamps: active,
        totalSlots: capacitySum,
        filledSlots: registeredSum
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = (camp = null) => {
    setSelectedCamp(camp);
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setSelectedCamp(null);
    setIsRegisterOpen(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('isAdminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    setCurrentView('user');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories
  const categories = [
    'All', 'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
    'Gynecology', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry',
    'ENT', 'Oncology', 'Urology', 'Nephrology', 'Gastroenterology',
    'Pulmonology', 'Physiotherapy'
  ];

  // Filtered camps (only active/future camps are displayed on home portal)
  const filteredCamps = camps.filter(camp => {
    const matchesCategory = selectedCategory === 'All' || camp.category === selectedCategory;
    const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          camp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isFutureCamp = new Date(camp.date) > new Date();
    return matchesCategory && matchesSearch && isFutureCamp;
  });

  return (
    <div className="app-container">
      {/* Background Animated Blobs */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Navigation */}
      <Navbar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        onOpenRegister={() => handleOpenRegister(null)} 
      />

      {currentView === 'user' ? (
        <main>
          {/* Hero Section */}
          <section id="home" className="hero">
            <div className="hero-content">
              <div className="hero-tag pulse-tag">
                <Activity size={14} className="tag-icon" /> Your Health, Our Mission
              </div>
              <h1 className="hero-title">
                A Healthier Community, <span>Together</span>.
              </h1>
              <p className="hero-desc">
                Welcome to the Medical Camp Registration Portal. Discover free checkups, consult specialists, and register online to reserve your family's healthcare slot instantly.
              </p>
              <div className="hero-actions">
                <a href="#camps" className="btn btn-primary">
                  Explore Camps <ArrowRight size={18} />
                </a>
                <button onClick={() => handleViewChange('admin')} className="btn btn-secondary">
                  <Shield size={16} /> Admin Panel
                </button>
              </div>

              {/* Statistics Panel */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{stats.activeCamps}</div>
                  <div className="stat-label">Active Camps</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{stats.totalSlots}</div>
                  <div className="stat-label">Available Slots</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{stats.filledSlots}</div>
                  <div className="stat-label">Registered Patients</div>
                </div>
              </div>
            </div>

            {/* Visual Graphic Image */}
            <div className="hero-graphic">
              <div className="graphic-glow"></div>
              <img 
                src="/medical_doctors_vector.png" 
                alt="Sysslan Camp Medical Consultation" 
                className="hero-illustration" 
              />
            </div>
          </section>

          {/* Camps Grid Section */}
          <section id="camps" className="camps-section">
            <div className="section-header">
              <h2 className="section-title">Available Medical Camps</h2>
              <p className="section-desc">
                Select from our upcoming specializations. Check locations, timings, and book your session early.
              </p>
            </div>

            {/* Filters and Search controls */}
            <div className="controls-bar">
              <div className="categories">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search camps or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Grid display */}
            {loading ? (
              <div className="empty-state">Loading active healthcare camps database...</div>
            ) : error ? (
              <div className="empty-state" style={{ color: '#ef4444' }}>{error}</div>
            ) : filteredCamps.length === 0 ? (
              <div className="empty-state">No medical camps fit the select filter filters.</div>
            ) : (
              <div className="camps-grid">
                {filteredCamps.map(camp => (
                  <CampCard 
                    key={camp._id} 
                    camp={camp} 
                    onRegister={() => handleOpenRegister(camp)} 
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      ) : !isAdminAuthenticated ? (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess} 
          onCancel={() => handleViewChange('user')} 
        />
      ) : (
        <AdminDashboard 
          camps={camps} 
          onRefreshData={fetchCamps} 
          onLogout={handleLogout} 
        />
      )}

      {/* Footer Section */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <div className="footer-logo">
              <MedCampLogo size={36} className="logo-svg" />
              <span className="brand-text logo-title">MedCamp <span className="portal-sub">portal</span></span>
            </div>
            <p className="footer-desc">
              Building robust digital infrastructure to support rural and metropolitan medical camp coordination. Providing accessibility, simplicity, and community wellness.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home" className="footer-link-item" onClick={() => handleViewChange('user')}>Home</a></li>
              <li><a href="#camps" className="footer-link-item" onClick={() => handleViewChange('user')}>Medical Camps</a></li>
              <li>
                <button 
                  onClick={() => handleViewChange('admin')} 
                  className="footer-link-item"
                  style={{ background: 'transparent', border: 'none', textAlign: 'left' }}
                >
                  Admin Telemetry Hub
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-contact-details">
            <h4 className="footer-title">Contact Sysslan IT</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@sysslan.com</span>
            </div>
            <div className="contact-item">
              <Globe size={16} />
              <a href="https://www.sysslan.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>www.sysslan.com</a>
            </div>
            <div className="contact-item" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <a href="https://www.linkedin.com/company/sysslan-it-solutions" target="_blank" rel="noreferrer" style={{ color: 'inherit' }} title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/sysslan-it-solutions" target="_blank" rel="noreferrer" style={{ color: 'inherit' }} title="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sysslan IT Solutions. All rights reserved. Internship Cohort Project.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with React & MERN stack <Award size={14} style={{ color: 'var(--accent-orange)' }} />
          </p>
        </div>
      </footer>

      {/* Registration Modal Overlay */}
      {isRegisterOpen && (
        <RegistrationForm 
          selectedCamp={selectedCamp}
          camps={camps}
          onClose={handleCloseRegister}
          onSubmitSuccess={fetchCamps}
        />
      )}
    </div>
  );
}

export default App;
