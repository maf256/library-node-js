const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('./src/jsonwebtoken');
const User = require('../models/user'); // Assume you have a user model for checking credentials

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = generateToken(user._id);
    return res.json({ token });
  }

  return res.status(400).json({ message: 'Invalid credentials' });
});

module.exports = router;
