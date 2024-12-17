const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { JWT_SECRET } = process.env;

// POST /login
router.post('/login', async (req, res) => { 
  const { email, password } = req.body;

  try {
    // Find user with role_type = 'a'
    const user = await User.findOne({ where: { email } });
    if (!user || user.role_type !== 'a') {
      return res.status(404).json({
        status: 404,
        message: 'User not found or not authorized.',
      });
    }

    // Verify password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role_type },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      status: 200,
      message: 'Logged in',
      redirect: '/dashboard',
      result: {
        user_id: user.id,
        access_token: token,
        token_type: 'Bearer',
        role_type: user.role_type,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 500,
      message: 'Server error.',
    });
  }
});

module.exports = router;
