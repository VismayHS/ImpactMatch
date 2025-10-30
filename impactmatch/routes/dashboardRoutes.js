const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cause = require('../models/Cause');
const Match = require('../models/Match');

// GET /api/dashboard?userId=<id>
// Get user dashboard data
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get joined causes (interested)
    const joinedMatches = await Match.find({ userId, status: 'interested' }).populate('causeId');
    const joined = joinedMatches.map((m) => ({
      matchId: m._id,
      id: m.causeId._id,
      name: m.causeId.name,
      description: m.causeId.description,
      category: m.causeId.category,
      city: m.causeId.city,
      status: m.status,
      joinedAt: m.createdAt,
    }));

    // Get verified causes
    const verifiedMatches = await Match.find({ userId, status: 'verified' }).populate('causeId');
    const verified = verifiedMatches.map((m) => ({
      matchId: m._id,
      id: m.causeId._id,
      name: m.causeId.name,
      description: m.causeId.description,
      category: m.causeId.category,
      city: m.causeId.city,
      status: m.status,
      verifiedAt: m.verifiedAt,
      txHash: m.txHash,
    }));

    // Calculate category analytics
    const allMatches = await Match.find({ userId }).populate('causeId');
    const categoryCount = {};
    allMatches.forEach((m) => {
      const cat = m.causeId.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const analytics = Object.keys(categoryCount).map((category) => ({
      category,
      count: categoryCount[category],
    }));

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        impactScore: user.impactScore,
        badges: user.badges,
      },
      joined,
      verified,
      analytics,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/dashboard/map?userId=<id>
// Get map data for user's causes
router.get('/map', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get all matches for user
    const matches = await Match.find({ userId }).populate('causeId');

    const mapData = matches.map((m) => ({
      id: m.causeId._id,
      name: m.causeId.name,
      description: m.causeId.description,
      category: m.causeId.category,
      city: m.causeId.city,
      lat: m.causeId.lat,
      lng: m.causeId.lng,
      verified: m.status === 'verified',
      txHash: m.txHash,
    }));

    res.json({ causes: mapData });
  } catch (error) {
    console.error('Map data error:', error);
    res.status(500).json({ error: 'Failed to load map data' });
  }
});

module.exports = router;
