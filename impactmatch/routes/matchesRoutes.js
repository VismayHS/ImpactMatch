const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cause = require('../models/Cause');
const Match = require('../models/Match');

// Helper function to calculate badge tier
function calculateBadges(score) {
  const badges = [];
  if (score >= 200) badges.push('GOLD');
  else if (score >= 100) badges.push('SILVER');
  else if (score >= 50) badges.push('BRONZE');
  return badges;
}

// GET /api/matches
// Get all matches (for analytics/dashboard)
router.get('/', async (req, res) => {
  try {
    const { userId, causeId, ngoId } = req.query;
    
    let query = {};
    if (userId) query.userId = userId;
    if (causeId) query.causeId = causeId;
    
    const matches = await Match.find(query)
      .populate('userId', 'name email city')
      .populate({
        path: 'causeId',
        select: 'name title category city ngoId',
        populate: {
          path: 'ngoId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    // Filter by ngoId if provided
    let filteredMatches = matches;
    if (ngoId) {
      filteredMatches = matches.filter(match => {
        const causeNgoId = match.causeId?.ngoId?._id || match.causeId?.ngoId;
        return causeNgoId && causeNgoId.toString() === ngoId.toString();
      });
    }
    
    console.log(`📊 Matches API: Total=${matches.length}, Filtered=${filteredMatches.length}, NGOFilter=${ngoId || 'none'}`);
    
    res.json({ matches: filteredMatches });
  } catch (error) {
    console.error('Fetch matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// POST /api/matches
// User joins/likes a cause (swipe right)
router.post('/', async (req, res) => {
  try {
    const { userId, causeId, status } = req.body;

    if (!userId || !causeId) {
      return res.status(400).json({ error: 'userId and causeId are required' });
    }

    // Check if already joined
    const existingMatch = await Match.findOne({ userId, causeId });
    if (existingMatch) {
      return res.status(400).json({ 
        error: 'Already joined this cause',
        match: existingMatch 
      });
    }

    // Verify cause exists
    const cause = await Cause.findById(causeId);
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    // Create match
    const match = new Match({
      userId,
      causeId,
      status: status || 'interested',
    });
    await match.save();

    // Increment volunteersJoined count on the cause
    cause.volunteersJoined = (cause.volunteersJoined || 0) + 1;
    await cause.save();

    // Update user: add to joinedCauses and increment score by +10
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.joinedCauses.push(match._id);
    user.impactScore += 10;
    user.badges = calculateBadges(user.impactScore);
    await user.save();

    console.log(`✅ Match created: User ${user.name} joined cause "${cause.name}" (${cause.volunteersJoined} volunteers now)`);

    res.json({
      message: 'Joined cause successfully',
      match: {
        id: match._id,
        causeId: match.causeId,
        userId: match.userId,
        status: match.status,
        createdAt: match.createdAt,
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

// GET /api/matches/:id
// Get specific match details
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('userId', 'name email city impactScore badges')
      .populate('causeId', 'title description category city ngoId');
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json({ match });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

module.exports = router;
