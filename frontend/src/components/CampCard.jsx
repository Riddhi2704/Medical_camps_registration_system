import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle2, Activity } from 'lucide-react';

const getCategoryFallbackImage = (category) => {
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

export default function CampCard({ camp, onRegister }) {
  const { title, category, date, location, description, capacity, registeredCount, imageUrl } = camp;
  const cleanedUrl = cleanImageUrl(imageUrl);
  const fallbackUrl = getCategoryFallbackImage(category);
  
  const [imgSrc, setImgSrc] = useState(cleanedUrl || fallbackUrl);
  const [triedFallback, setTriedFallback] = useState(!cleanedUrl || cleanedUrl === fallbackUrl);
  const [imgError, setImgError] = useState(false);

  const seatsLeft = capacity - registeredCount;
  const isFull = seatsLeft <= 0;

  // Sync state if camp details update
  useEffect(() => {
    const cleaned = cleanImageUrl(imageUrl);
    const fallback = getCategoryFallbackImage(category);
    setImgSrc(cleaned || fallback);
    setTriedFallback(!cleaned || cleaned === fallback);
    setImgError(false);
  }, [imageUrl, category]);

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleImageError = () => {
    if (!triedFallback) {
      setImgSrc(fallbackUrl);
      setTriedFallback(true);
    } else {
      setImgError(true);
    }
  };

  return (
    <div className="camp-card">
      <div className="camp-card-image-wrapper">
        {!imgError && imgSrc ? (
          <img 
            src={imgSrc} 
            alt={title} 
            className="camp-card-image"
            onError={handleImageError}
          />
        ) : (
          <div className="camp-card-image-fallback">
            <Activity size={38} className="fallback-icon" />
            <span className="fallback-text">{category}</span>
          </div>
        )}
        <div className="camp-card-overlay">
          <span className="camp-category-badge">{category}</span>
        </div>
      </div>
      
      <div className="camp-card-content">
        <h3 className="camp-card-title">{title}</h3>
        <p className="camp-card-desc">{description}</p>
        
        <div className="camp-card-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className="meta-item">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          <div className="meta-item">
            <Users size={16} />
            <span>Capacity: {capacity} registered</span>
          </div>
        </div>
        
        <div className="camp-card-footer">
          <div className="seats-counter">
            <span className="seats-label">Availability</span>
            {isFull ? (
              <span className="seats-number full">Fully Booked</span>
            ) : (
              <span className="seats-number available">{seatsLeft} Seats Left</span>
            )}
          </div>
          
          <button 
            onClick={() => !isFull && onRegister(camp)}
            disabled={isFull}
            className={`btn btn-primary btn-card-register ${isFull ? 'full' : ''}`}
          >
            {isFull ? 'Closed' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
