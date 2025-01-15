const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/Middleware');

router.get('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
  
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

 
    if (updates.password) {
      return res.status(400).json({ message: 'Password updates are not allowed here' });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;