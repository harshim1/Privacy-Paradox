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

module.exports = router;
