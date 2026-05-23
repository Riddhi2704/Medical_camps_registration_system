import React from 'react';

export default function MedCampLogo({ size = 32, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Top Segment */}
      <path d="M48 15h24v33H48z" fill="#0d9488" />
      
      {/* Left Segment */}
      <path d="M15 48h33v24H15z" fill="#0d9488" />
      
      {/* Right Segment */}
      <path d="M72 48h22c6 0 11 5 11 11s-5 11-11 11H72V48z" fill="#2dd4bf" />
      
      {/* Bottom Segment */}
      <path d="M48 72h24v22c0 6-5 11-11 11s-11-5-11-11V72z" fill="#2dd4bf" />
      
      {/* Center Junction */}
      <path d="M48 48h24v24H48z" fill="#0d9488" />
      
      {/* White Swoosh sweep line */}
      <path 
        d="M25 88 C 45 75, 75 45, 95 25" 
        stroke="#ffffff" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />
      
      {/* Green/Cyan Outer sweep line */}
      <path 
        d="M32 98 C 58 83, 83 58, 98 32" 
        stroke="#0d9488" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
