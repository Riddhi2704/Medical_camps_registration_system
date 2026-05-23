const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
      'Gynecology', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry',
      'ENT', 'Oncology', 'Urology', 'Nephrology', 'Gastroenterology',
      'Pulmonology', 'Physiotherapy'
    ],
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Camp', campSchema);
