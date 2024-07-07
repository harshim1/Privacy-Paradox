// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'f682e19d7f61d0afae998a7c081157de36292dc52d7e9c291d912f65abbbe5973ef2252fe11ab29fde0a8e51fee02782ea7046fb66d4fa94bffe5b1e34d02d93', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload,'f682e19d7f61d0afae998a7c081157de36292dc52d7e9c291d912f65abbbe5973ef2252fe11ab29fde0a8e51fee02782ea7046fb66d4fa94bffe5b1e34d02d93', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user's friends
router.get('/users/:userId/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', '-password');
    res.json(user.friends);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add friend
router.post('/add-friend', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ msg: 'User not found' });

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
