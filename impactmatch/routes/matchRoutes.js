const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cause = require('../models/Cause');
const Match = require('../models/Match');
const { getNearbyCities } = require('../utils/geolocation');
const natural = require('natural');

// Helper function to calculate badge tier
function calculateBadges(score) {
  const badges = [];
  if (score >= 200) badges.push('GOLD');
  else if (score >= 100) badges.push('SILVER');
  else if (score >= 50) badges.push('BRONZE');
  return badges;
}

// POST /api/match
// Get AI-matched causes for a user
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get causes from user's city and nearby cities
    const cities = getNearbyCities(user.city);
    const causes = await Cause.find({ city: { $in: cities } });

    if (causes.length === 0) {
      return res.json({ matches: [] });
    }

    // TF-IDF matching
    const tfidf = new natural.TfIdf();

    // Add user interests as document 0
    tfidf.addDocument(user.interests.toLowerCase());

    // Add each cause description as a document
    causes.forEach((cause) => {
      const text = `${cause.name} ${cause.description} ${cause.category}`.toLowerCase();
      tfidf.addDocument(text);
    });

    // Calculate similarity scores
    const matches = [];
    causes.forEach((cause, index) => {
      let similarity = 0;
      tfidf.tfidfs(user.interests.toLowerCase(), (i, measure) => {
        if (i === index + 1) {
          // +1 because user doc is at index 0
          similarity = measure;
        }
      });

      matches.push({
        id: cause._id,
        name: cause.name,
        description: cause.description,
        category: cause.category,
        city: cause.city,
        lat: cause.lat,
        lng: cause.lng,
        similarity: Math.min(similarity * 100, 100).toFixed(2), // Convert to percentage, cap at 100
      });
    });

    // Sort by similarity and return top 10
    matches.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));
    const topMatches = matches.slice(0, 10);

    res.json({ matches: topMatches });
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ error: 'Matching failed' });
  }
});

// GET /api/match/causes
// Get all causes for map display
router.get('/causes', async (req, res) => {
  try {
    // Fetch all causes from database
    const causes = await Cause.find({}).limit(100).lean();
    
    res.json(causes);
  } catch (error) {
    console.error('Fetch causes error:', error);
    res.status(500).json({ error: 'Failed to fetch causes' });
  }
});

// POST /api/match/join
// User joins/likes a cause
router.post('/join', async (req, res) => {
  try {
    const { userId, causeId } = req.body;

    if (!userId || !causeId) {
      return res.status(400).json({ error: 'userId and causeId are required' });
    }

    // Check if already joined
    const existingMatch = await Match.findOne({ userId, causeId });
    if (existingMatch) {
      return res.status(400).json({ error: 'Already joined this cause' });
    }

    // Create match
    const match = new Match({
      userId,
      causeId,
      status: 'interested',
    });
    await match.save();

    // Update user: add to joinedCauses and increment score by +10
    const user = await User.findById(userId);
    user.joinedCauses.push(match._id);
    user.impactScore += 10;
    user.badges = calculateBadges(user.impactScore);
    await user.save();

    res.json({
      message: 'Joined cause successfully',
      match: {
        id: match._id,
        causeId: match.causeId,
        status: match.status,
      },
      updatedUser: {
        impactScore: user.impactScore,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Join cause error:', error);
    res.status(500).json({ error: 'Failed to join cause' });
  }
});

module.exports = router;
