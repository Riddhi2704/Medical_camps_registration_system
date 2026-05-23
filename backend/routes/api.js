const express = require('express');
const router = express.Router();
const Camp = require('../models/camp');
const Participant = require('../models/participant');

// GET all camps
router.get('/camps', async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new camp
router.post('/camps', async (req, res) => {
  const { title, category, date, location, description, capacity, imageUrl } = req.body;
  
  if (!title || !category || !date || !location || !description || capacity === undefined) {
    return res.status(400).json({ message: 'All fields (title, category, date, location, description, capacity) are required.' });
  }

  const camp = new Camp({
    title,
    category,
    date,
    location,
    description,
    capacity,
    imageUrl: imageUrl || ''
  });

  try {
    const newCamp = await camp.save();
    res.status(201).json(newCamp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST register a participant
router.post('/register', async (req, res) => {
  const { fullName, age, contactNumber, campId } = req.body;

  if (!fullName || !age || !contactNumber || !campId) {
    return res.status(400).json({ message: 'Full name, age, contact number, and camp selection are required.' });
  }

  try {
    // Check if camp exists
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: 'Selected medical camp not found.' });
    }

    // Check if capacity is reached
    if (camp.registeredCount >= camp.capacity) {
      return res.status(400).json({ message: 'Registration full. This camp has reached maximum capacity.' });
    }

    // Create participant
    const participant = new Participant({
      fullName,
      age: Number(age),
      contactNumber,
      camp: campId
    });

    const newParticipant = await participant.save();

    // Increment camp registration count
    camp.registeredCount += 1;
    await camp.save();

    // Return the response, populated with camp info
    const populatedParticipant = await Participant.findById(newParticipant._id).populate('camp');
    res.status(201).json(populatedParticipant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a participant registration (admin view)
router.put('/participants/:id', async (req, res) => {
  const { fullName, age, contactNumber, campId } = req.body;

  if (!fullName || !age || !contactNumber || !campId) {
    return res.status(400).json({ message: 'Full name, age, contact number, and camp selection are required.' });
  }

  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: 'Registration record not found.' });
    }

    // Check if camp assignment changed
    if (participant.camp.toString() !== campId) {
      const oldCamp = await Camp.findById(participant.camp);
      const newCamp = await Camp.findById(campId);

      if (!newCamp) {
        return res.status(404).json({ message: 'New medical camp selection not found.' });
      }

      // Check if new camp has capacity
      if (newCamp.registeredCount >= newCamp.capacity) {
        return res.status(400).json({ message: 'Selected medical camp is at full capacity.' });
      }

      // Decrement old camp
      if (oldCamp && oldCamp.registeredCount > 0) {
        oldCamp.registeredCount -= 1;
        await oldCamp.save();
      }

      // Increment new camp
      newCamp.registeredCount += 1;
      await newCamp.save();

      participant.camp = campId;
    }

    participant.fullName = fullName;
    participant.age = Number(age);
    participant.contactNumber = contactNumber;

    const updatedParticipant = await participant.save();
    const populated = await Participant.findById(updatedParticipant._id).populate('camp');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all participants (admin view)
router.get('/participants', async (req, res) => {
  try {
    const participants = await Participant.find().populate('camp').sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a participant (admin view - cancel registration)
router.delete('/participants/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: 'Registration record not found.' });
    }

    // Decrement the camp's registration count
    const camp = await Camp.findById(participant.camp);
    if (camp && camp.registeredCount > 0) {
      camp.registeredCount -= 1;
      await camp.save();
    }

    await Participant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration cancelled and participant record removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update a camp (admin view)
router.put('/camps/:id', async (req, res) => {
  const { title, category, date, location, description, capacity, imageUrl } = req.body;

  if (!title || !category || !date || !location || !description || capacity === undefined) {
    return res.status(400).json({ message: 'All fields (title, category, date, location, description, capacity) are required.' });
  }

  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Medical camp not found.' });
    }

    camp.title = title;
    camp.category = category;
    camp.date = new Date(date);
    camp.location = location;
    camp.description = description;
    camp.capacity = Number(capacity);
    if (imageUrl !== undefined) {
      camp.imageUrl = imageUrl;
    }

    const updatedCamp = await camp.save();
    res.json(updatedCamp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a camp and its associated registrations (admin view)
router.delete('/camps/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Medical camp not found.' });
    }

    // Delete all participants registered for this camp
    await Participant.deleteMany({ camp: req.params.id });
    
    // Delete the camp itself
    await Camp.findByIdAndDelete(req.params.id);

    res.json({ message: 'Medical camp and all associated registrations deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
