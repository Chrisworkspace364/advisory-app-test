const Listing = require('../models/Listing');
const { calculateDistance } = require('../utils/distance');

// fetch listigns
const fetchListings = async () => {
  const listings = await Listing.findAll();
  return listings.map((listing) => ({
    id: listing.id,
    name: listing.name,
    latitude: listing.latitude,
    longitude: listing.longitude,
    distance: calculateDistance(listing.latitude, listing.longitude),
    created_at: listing.created_at,
    updated_at: listing.updated_at,
  }));
};

const express = require('express');
const router = express.Router();

// GET Get lsiting
router.get('/listings/get', async (req, res) => {
  try {
    const data = await fetchListings();
    res.json({
      status: 200,
      message: 'Success',
      result: { current_page: 1, data },
    });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ status: 500, message: 'Server error.' });
  }
});

// POST: Add Listing
router.post('/listings/add', async (req, res) => {
  const { name, latitude, longitude } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ status: 400, message: 'Missing required fields.' });
  }

  try {
    const newListing = await Listing.create({
      name,
      latitude,
      longitude,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({
      status: 201,
      message: 'Listing added successfully.',
      result: newListing,
    });
  } catch (err) {
    console.error('Error adding listing:', err);
    res.status(500).json({ status: 500, message: 'Server error.' });
  }
});

// PUT: Edit listing
router.put('/listings/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;

  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ status: 404, message: 'Listing not found.' });
    }

    // Update fields
    listing.name = name || listing.name;
    listing.latitude = latitude || listing.latitude;
    listing.longitude = longitude || listing.longitude;
    listing.updated_at = new Date();

    await listing.save();

    res.json({
      status: 200,
      message: 'Listing updated successfully.',
      result: listing,
    });
  } catch (err) {
    console.error('Error editing listing:', err);
    res.status(500).json({ status: 500, message: 'Server error.' });
  }
});

// DELETE: Delete listing
router.delete('/listings/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ status: 404, message: 'Listing not found.' });
    }

    await listing.destroy();
    res.json({ status: 200, message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ status: 500, message: 'Server error.' });
  }
});

module.exports = { router, fetchListings };
