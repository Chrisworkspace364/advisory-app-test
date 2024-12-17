const express = require('express');
const { fetchListings } = require('../API/listing'); // Fetch function from listing API
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 401, message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 403, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

router.get('/listings', authenticate, async (req, res) => {
  try {
    const data = await fetchListings();
    res.json({
      status: 200,
      message: 'Success',
      result: { current_page: 1, data },
    });
  } catch (err) {
    console.error('Error fetching dashboard listings:', err);
    res.status(500).json({ status: 500, message: 'Server error.' });
  }
});

module.exports = router;
