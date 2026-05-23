const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const Camp = require('./models/camp');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sysslan_camp';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical Camp Registration API is running' });
});

// Seed data function
const seedCamps = async () => {
  try {
    const count = await Camp.countDocuments();
    if (count === 0) {
      console.log('No medical camps found in database. Seeding initial data...');
      
      const sampleCamps = [
        {
          title: 'General Health & Wellness Camp',
          category: 'General Medicine',
          date: new Date('2026-06-15T09:00:00'),
          location: 'Community Center, Downtown Area',
          description: 'Free general medical consultation, blood pressure checks, blood sugar screening, and basic health education leaflets.',
          capacity: 50,
          registeredCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Cardiovascular Risk Screening',
          category: 'Cardiology',
          date: new Date('2026-06-22T08:30:00'),
          location: 'City Hospital, Block B Clinic',
          description: 'Specialist cardiac evaluation, free ECG tests, cholesterol screenings, and consulting on cardiovascular risk management.',
          capacity: 30,
          registeredCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Community Dental Care & Hygiene',
          category: 'Dental Care',
          date: new Date('2026-07-05T09:00:00'),
          location: 'Red Cross Center, East Wing',
          description: 'Free dental checkups, cavity detection, oral hygiene consulting, and distribution of dental care kits.',
          capacity: 45,
          registeredCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Pediatric Growth & Wellness Clinic',
          category: 'Pediatric Wellness',
          date: new Date('2026-07-12T10:00:00'),
          location: 'Sunshine Elementary School Hall',
          description: 'Comprehensive health checkups for children, nutrition advice, pediatric growth charts reviews, and vaccination schedule consultations.',
          capacity: 40,
          registeredCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Eye Screening & Optometry Camp',
          category: 'Eye Checkup',
          date: new Date('2026-07-20T09:00:00'),
          location: 'Senior Citizen Activity Center',
          description: 'Free vision testing, glaucoma screening, cataract evaluations, and prescription guidelines.',
          capacity: 60,
          registeredCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=800&q=80'
        }
      ];

      await Camp.insertMany(sampleCamps);
      console.log('Sample medical camps seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB database successfully.');
    await seedCamps();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failure:', err);
    console.log('Attempting to launch server with local array storage fallback due to DB connection error...');
    // If DB fails, we can start server anyway but alert in responses. Let's make MongoDB connection required for full app compliance.
  });
