import React, { useState, useEffect } from 'react';
import { Plus, Download, Search, Trash2, PieChart, Users, Layers, Calendar, MapPin, ClipboardList, X, LogOut, Pencil } from 'lucide-react';

const cleanImageUrl = (url) => {
  if (!url) return '';
  try {
    if (url.includes('imgurl=')) {
      const match = url.match(/[?&]imgurl=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
  } catch (e) {
    console.error('Error cleaning image URL:', e);
  }
  return url;
};

const categoriesList = [
  'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
  'Gynecology', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry',
  'ENT', 'Oncology', 'Urology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Physiotherapy'
];

const getCategoryDefaultImage = (category) => {
  switch (category) {
    case 'General Medicine':
      return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
    case 'Cardiology':
      return 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80';
    case 'Neurology':
      return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80';
    case 'Orthopedics':
      return 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80';
    case 'Dermatology':
      return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';
    case 'Gynecology':
      return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80';
    case 'Pediatrics':
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
    case 'Psychiatry':
      return 'https://images.unsplash.com/photo-1527137341206-1a2ab814e869?auto=format&fit=crop&w=800&q=80';
    case 'Ophthalmology':
      return 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&w=800&q=80';
    case 'Dentistry':
      return 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';
    case 'ENT':
      return 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=800&q=80';
    case 'Oncology':
      return 'https://images.unsplash.com/photo-1579152183803-85552ba2524a?auto=format&fit=crop&w=800&q=80';
    case 'Urology':
      return 'https://images.unsplash.com/photo-1579152176532-b3a1a9cb844f?auto=format&fit=crop&w=800&q=80';
    case 'Nephrology':
      return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80';
    case 'Gastroenterology':
      return 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80';
    case 'Pulmonology':
      return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
    case 'Physiotherapy':
      return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80';
    default:
      return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
  }
};

export default function AdminDashboard({ camps, onRefreshData, onLogout }) {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [adminTab, setAdminTab] = useState('registrations'); // 'registrations' or 'camps'

  // Edit Participant Modal State
  const [showEdit, setShowEdit] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    age: '',
    contactNumber: '',
    campId: ''
  });
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit Camp State
  const [showEditCamp, setShowEditCamp] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [editCampFormData, setEditCampFormData] = useState({
    title: '',
    category: 'General Medicine',
    date: '',
    location: '',
    description: '',
    capacity: '',
    imageUrl: ''
  });
  const [editCampError, setEditCampError] = useState('');
  const [isUpdatingCamp, setIsUpdatingCamp] = useState(false);

  const handleOpenEditCamp = (camp) => {
    setEditingCamp(camp);
    
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const d = new Date(camp.date);
    const tzoffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);

    setEditCampFormData({
      title: camp.title,
      category: camp.category,
      date: localISOTime,
      location: camp.location,
      description: camp.description,
      capacity: camp.capacity,
      imageUrl: camp.imageUrl || ''
    });
    setEditCampError('');
    setShowEditCamp(true);
  };

  const handleEditCampChange = (e) => {
    const { name, value } = e.target;
    setEditCampFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'category') {
        updated.imageUrl = getCategoryDefaultImage(value);
      }
      return updated;
    });
  };

  const handleEditCampSubmit = async (e) => {
    e.preventDefault();
    if (!editCampFormData.title.trim() || !editCampFormData.date || !editCampFormData.location.trim() || !editCampFormData.description.trim() || !editCampFormData.capacity) {
      setEditCampError('Please fill out all required fields.');
      return;
    }

    const cap = Number(editCampFormData.capacity);
    if (isNaN(cap) || cap <= 0) {
      setEditCampError('Capacity must be a positive number.');
      return;
    }

    setIsUpdatingCamp(true);
    setEditCampError('');

    try {
      const response = await fetch(`http://localhost:5000/api/camps/${editingCamp._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editCampFormData,
          imageUrl: cleanImageUrl(editCampFormData.imageUrl),
          capacity: cap
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update camp');

      setShowEditCamp(false);
      setEditingCamp(null);
      onRefreshData();
    } catch (err) {
      setEditCampError(err.message);
    } finally {
      setIsUpdatingCamp(false);
    }
  };

  const handleDeleteCamp = async (id, title) => {
    const confirmMessage = `WARNING: Are you sure you want to delete the camp "${title}"?\n\nThis will PERMANENTLY cancel and delete ALL registrations associated with this camp! This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/camps/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete camp');

      alert(data.message);
      fetchParticipants();
      onRefreshData();
    } catch (err) {
      alert(`Error deleting camp: ${err.message}`);
    }
  };
  

  // Add Camp Modal State
  const [showAddCamp, setShowAddCamp] = useState(false);
  const [newCamp, setNewCamp] = useState({
    title: '',
    category: 'General Medicine',
    date: '',
    location: '',
    description: '',
    capacity: '',
    imageUrl: ''
  });
  const [addCampError, setAddCampError] = useState('');
  const [isCreatingCamp, setIsCreatingCamp] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/participants');
      if (!response.ok) throw new Error('Failed to load participants');
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration and release the reserved slot?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/participants/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to cancel registration');
      
      // Update local state and trigger parent refresh to update slots left
      setParticipants(prev => prev.filter(p => p._id !== id));
      onRefreshData();
    } catch (err) {
      alert(`Error canceling registration: ${err.message}`);
    }
  };

  const handleAddCampChange = (e) => {
    const { name, value } = e.target;
    setNewCamp(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'category') {
        updated.imageUrl = getCategoryDefaultImage(value);
      }
      return updated;
    });
  };

  const handleAddCampSubmit = async (e) => {
    e.preventDefault();
    if (!newCamp.title.trim() || !newCamp.date || !newCamp.location.trim() || !newCamp.description.trim() || !newCamp.capacity) {
      setAddCampError('Please fill out all required fields.');
      return;
    }

    const cap = Number(newCamp.capacity);
    if (isNaN(cap) || cap <= 0) {
      setAddCampError('Capacity must be a positive number.');
      return;
    }

    setIsCreatingCamp(true);
    setAddCampError('');

    try {
      const response = await fetch('http://localhost:5000/api/camps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newCamp,
          imageUrl: cleanImageUrl(newCamp.imageUrl),
          capacity: cap
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create camp');

      setShowAddCamp(false);
      setNewCamp({
        title: '',
        category: 'General Medicine',
        date: '',
        location: '',
        description: '',
        capacity: '',
        imageUrl: ''
      });
      onRefreshData(); // refresh parent camps
    } catch (err) {
      setAddCampError(err.message);
    } finally {
      setIsCreatingCamp(false);
    }
  };

  // Exporter to CSV
  const exportToCSV = () => {
    if (participants.length === 0) {
      alert('No registration data available to export.');
      return;
    }

    const headers = ['Registration ID', 'Full Name', 'Age', 'Contact Number', 'Camp Title', 'Camp Location', 'Camp Date', 'Registration Date'];
    const rows = participants.map(p => [
      p._id,
      p.fullName,
      p.age,
      p.contactNumber,
      p.camp?.title || 'Unknown Camp',
      p.camp?.location || 'N/A',
      p.camp?.date ? new Date(p.camp.date).toLocaleDateString() : 'N/A',
      new Date(p.registeredAt).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Medical_Camp_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalRegistrations = participants.length;
  const totalCamps = camps.length;
  const totalCapacity = camps.reduce((sum, c) => sum + c.capacity, 0);
  const capacityUsedPercent = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  // Filter registrations
  const filteredParticipants = participants.filter(p => {
    const s = searchTerm.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(s) ||
      p.contactNumber.includes(s) ||
      (p.camp?.title || '').toLowerCase().includes(s)
    );
  });

  return (
    <section className="admin-section">
      <div className="admin-glass-container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <div className="admin-icon">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem', textAlign: 'left' }}>Admin Telemetry Hub</h2>
              <p className="seats-label">Manage active camps and monitor registered patient listings</p>
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={exportToCSV} className="btn btn-secondary btn-admin-action">
              <Download size={16} /> Export CSV
            </button>
            <button onClick={() => setShowAddCamp(true)} className="btn btn-primary btn-admin-action">
              <Plus size={16} /> Add Medical Camp
            </button>
            <button onClick={onLogout} className="btn btn-secondary btn-admin-action" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="admin-metrics">
          <div 
            className="metric-card" 
            onClick={() => { setAdminTab('registrations'); setSearchTerm(''); }}
            style={{ 
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              border: adminTab === 'registrations' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
              background: adminTab === 'registrations' ? 'rgba(16, 185, 129, 0.05)' : '',
              transform: adminTab === 'registrations' ? 'scale(1.02)' : 'none'
            }}
          >
            <div className="metric-icon blue">
              <Users size={22} />
            </div>
            <div>
              <div className="metric-value">{totalRegistrations}</div>
              <div className="metric-label">Total Registered Patients</div>
            </div>
          </div>
          
          <div 
            className="metric-card" 
            onClick={() => { setAdminTab('camps'); setSearchTerm(''); }}
            style={{ 
              cursor: 'pointer', 
              transition: 'all 0.3s ease',
              border: adminTab === 'camps' ? '2px solid var(--accent-orange)' : '1px solid var(--border-glass)',
              background: adminTab === 'camps' ? 'rgba(249, 115, 22, 0.05)' : '',
              transform: adminTab === 'camps' ? 'scale(1.02)' : 'none'
            }}
          >
            <div className="metric-icon orange">
              <Layers size={22} />
            </div>
            <div>
              <div className="metric-value">{totalCamps}</div>
              <div className="metric-label">Active Medical Camps (Click to view)</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)' }}>
              <PieChart size={22} />
            </div>
            <div>
              <div className="metric-value">{capacityUsedPercent}%</div>
              <div className="metric-label">Slot Capacity Utilization</div>
            </div>
          </div>
        </div>

        {/* Table Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className="section-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
            {adminTab === 'registrations' ? 'Registrations Logs' : 'Active Medical Camps'}
          </h3>
          <div className="search-box">
            <input 
              type="text" 
              placeholder={adminTab === 'registrations' ? 'Search by name, phone or camp...' : 'Search by title or location...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" size={16} />
          </div>
        </div>

        {/* Conditional Table Display */}
        {adminTab === 'registrations' ? (
          loading ? (
            <div className="empty-state">Fetching registration database records...</div>
          ) : error ? (
            <div className="empty-state" style={{ color: '#ef4444' }}>{error}</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="empty-state">No matching registration records found in logs.</div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Contact Details</th>
                    <th>Assigned Medical Camp</th>
                    <th>Registered Date</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.fullName}</td>
                      <td>{p.age} yrs</td>
                      <td>{p.contactNumber}</td>
                      <td>
                        <span className="table-badge cyan">{p.camp?.title || 'Unknown Camp'}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{new Date(p.registeredAt).toLocaleDateString()}</td>
                      <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="btn-table-delete" 
                          style={{ color: 'var(--accent-cyan)' }}
                          title="Edit Registration"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleCancelRegistration(p._id)}
                          className="btn-table-delete" 
                          title="Cancel Registration"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Active Camps Table list */
          (() => {
            const filteredCamps = camps.filter(c => {
              const s = searchTerm.toLowerCase();
              return c.title.toLowerCase().includes(s) || c.location.toLowerCase().includes(s);
            });

            return filteredCamps.length === 0 ? (
              <div className="empty-state">No matching medical camps found in database.</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Camp Title</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Location Area</th>
                      <th>Registrations Slot</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCamps.map(c => {
                      const seatsLeft = c.capacity - c.registeredCount;
                      const formattedDate = new Date(c.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={c._id}>
                          <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{c.title}</td>
                          <td>
                            <span className="table-badge cyan" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent-orange)' }}>
                              {c.category}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{formattedDate}</td>
                          <td>{c.location}</td>
                          <td>
                            <span style={{ fontWeight: '500', color: seatsLeft <= 0 ? '#ef4444' : 'var(--accent-cyan)' }}>
                              {c.registeredCount} / {c.capacity}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                            <button 
                              onClick={() => handleOpenEditCamp(c)}
                              className="btn-table-delete" 
                              style={{ color: 'var(--accent-cyan)' }}
                              title="Edit Camp Details"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCamp(c._id, c.title)}
                              className="btn-table-delete" 
                              title="Delete Camp"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()
        )}

      </div>

      {/* Add Camp Modal */}
      {showAddCamp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button onClick={() => setShowAddCamp(false)} className="modal-close">
              <X size={18} />
            </button>
            <div className="register-form-container">
              <h3 className="register-title">Setup New Medical Camp</h3>
              <p className="register-subtitle">Register and advertise a new health screening division</p>

              {addCampError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {addCampError}
                </div>
              )}

              <form onSubmit={handleAddCampSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    placeholder=" "
                    value={newCamp.title}
                    onChange={handleAddCampChange}
                    className="form-input"
                    required
                  />
                  <label className="form-label">Camp Title</label>
                </div>

                <div className="admin-form-grid">
                  <div className="form-group">
                    <select
                      name="category"
                      value={newCamp.category}
                      onChange={handleAddCampChange}
                      className="form-input"
                      style={{ appearance: 'none', cursor: 'pointer' }}
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Category</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="capacity"
                      placeholder=" "
                      value={newCamp.capacity}
                      onChange={handleAddCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label">Total Slot Capacity</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="datetime-local"
                      name="date"
                      placeholder=" "
                      value={newCamp.date}
                      onChange={handleAddCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Event Date & Time</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="location"
                      placeholder=" "
                      value={newCamp.location}
                      onChange={handleAddCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label">Camp Location Area</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="imageUrl"
                      placeholder=" "
                      value={newCamp.imageUrl}
                      onChange={handleAddCampChange}
                      className="form-input"
                    />
                    <label className="form-label">Image URL (Unsplash Link or leave empty)</label>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <textarea
                    name="description"
                    placeholder="Brief details about screening activities..."
                    value={newCamp.description}
                    onChange={handleAddCampChange}
                    className="form-input"
                    required
                    style={{ height: '80px', resize: 'none' }}
                  />
                  <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Screening Details & Scope</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isCreatingCamp} 
                  className="btn btn-primary form-submit-btn"
                >
                  {isCreatingCamp ? 'Creating Camp Entry...' : 'Create Medical Camp'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {/* Edit Camp Modal */}
      {showEditCamp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button onClick={() => setShowEditCamp(false)} className="modal-close">
              <X size={18} />
            </button>
            <div className="register-form-container">
              <h3 className="register-title">Edit Medical Camp</h3>
              <p className="register-subtitle">Update healthcare screening unit details</p>

              {editCampError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {editCampError}
                </div>
              )}

              <form onSubmit={handleEditCampSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    placeholder=" "
                    value={editCampFormData.title}
                    onChange={handleEditCampChange}
                    className="form-input"
                    required
                  />
                  <label className="form-label">Camp Title</label>
                </div>

                <div className="admin-form-grid">
                  <div className="form-group">
                    <select
                      name="category"
                      value={editCampFormData.category}
                      onChange={handleEditCampChange}
                      className="form-input"
                      style={{ appearance: 'none', cursor: 'pointer' }}
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Category</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="capacity"
                      placeholder=" "
                      value={editCampFormData.capacity}
                      onChange={handleEditCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label">Total Slot Capacity</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="datetime-local"
                      name="date"
                      placeholder=" "
                      value={editCampFormData.date}
                      onChange={handleEditCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Event Date & Time</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="location"
                      placeholder=" "
                      value={editCampFormData.location}
                      onChange={handleEditCampChange}
                      className="form-input"
                      required
                    />
                    <label className="form-label">Camp Location Area</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="imageUrl"
                      placeholder=" "
                      value={editCampFormData.imageUrl}
                      onChange={handleEditCampChange}
                      className="form-input"
                    />
                    <label className="form-label">Image URL (Unsplash Link or leave empty)</label>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <textarea
                    name="description"
                    placeholder="Brief details about screening activities..."
                    value={editCampFormData.description}
                    onChange={handleEditCampChange}
                    className="form-input"
                    required
                    style={{ height: '80px', resize: 'none' }}
                  />
                  <label className="form-label" style={{ top: '0', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Screening Details & Scope</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isUpdatingCamp} 
                  className="btn btn-primary form-submit-btn"
                >
                  {isUpdatingCamp ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
