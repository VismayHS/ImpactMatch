const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Verification = require('../models/Verification');
const { recordImpact } = require('../utils/blockchain');
const { authMiddleware, verifyRole, verifyNGOApproved } = require('../middleware/auth');

// Helper function to calculate badge tier
function calculateBadges(score) {
  const badges = [];
  if (score >= 200) badges.push('GOLD');
  else if (score >= 100) badges.push('SILVER');
  else if (score >= 50) badges.push('BRONZE');
  return badges;
} 

// GET /api/verify/pending?userId=<id>
// Get pending verifications for user (authenticated users only)
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get matches with 'interested' status
    const pendingMatches = await Match.find({ userId, status: 'interested' }).populate('causeId');

    const pending = pendingMatches.map((m) => ({
      matchId: m._id,
      cause: {
        id: m.causeId._id,
        name: m.causeId.name,
        description: m.causeId.description,
        category: m.causeId.category,
        city: m.causeId.city,
      },
      joinedAt: m.createdAt,
    }));

    res.json({ pending });
  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
});

// GET /api/verify (or /api/verifications)
// Get all verifications (for analytics/dashboard - authenticated users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId, verifierId, matchId } = req.query;
    
    let query = {};
    if (matchId) query.matchId = matchId;
    if (verifierId) query.verifierId = verifierId;
    
    const verifications = await Verification.find(query)
      .populate({
        path: 'matchId',
        populate: [
          { path: 'userId', select: 'name email city' },
          { path: 'causeId', select: 'title category city ngoId' }
        ]
      })
      .populate('verifierId', 'name email role')
      .limit(100)
      .lean();
    
    // Filter by userId if provided (user who was verified)
    let filteredVerifications = verifications;
    if (userId) {
      filteredVerifications = verifications.filter(v => 
        v.matchId && v.matchId.userId && v.matchId.userId._id.toString() === userId
      );
    }
    
    res.json({ verifications: filteredVerifications });
  } catch (error) {
    console.error('Fetch verifications error:', error);
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
});

// POST /api/verify
// Verify a match and record on blockchain (NGO only - must be verified)
router.post('/', authMiddleware, verifyRole('ngo'), verifyNGOApproved, async (req, res) => {
  try {
    const { matchId, verifierId } = req.body;

    if (!matchId || !verifierId) {
      return res.status(400).json({ error: 'matchId and verifierId are required' });
    }

    // Get match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status === 'verified') {
      return res.status(400).json({ error: 'Match already verified' });
    }

    // Get user for blockchain address (using userId as address for demo)
    const user = await User.findById(match.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Record on blockchain
    // In production, use actual Ethereum address; for demo, use a mock address
    const volunteerAddress = process.env.DEMO_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const causeId = match.causeId.toString().slice(-8); // Use last 8 chars as numeric ID

    let blockchainResult;
    try {
      blockchainResult = await recordImpact(volunteerAddress, causeId, match.userId.toString());
    } catch (blockchainError) {
      console.error('Blockchain recording failed:', blockchainError);
      return res.status(500).json({ error: 'Blockchain recording failed', details: blockchainError.message });
    }

    // Update match
    match.status = 'verified';
    match.verifiedAt = new Date();
    match.txHash = blockchainResult.txHash;
    await match.save();

    // Create verification record
    const verification = new Verification({
      matchId: match._id,
      verifierId,
      txHash: blockchainResult.txHash,
      blockchainEventData: blockchainResult.event,
    });
    await verification.save();

    // Update user score (+20 for verification)
    user.impactScore += 20;
    user.badges = calculateBadges(user.impactScore);
    await user.save();

    res.json({
      message: 'Verification successful',
      txHash: blockchainResult.txHash,
      blockchainEvent: blockchainResult.event,
      updatedUser: {
        impactScore: user.impactScore,
        badges: user.badges,
      },
      verification: {
        id: verification._id,
        matchId: verification.matchId,
        verifiedAt: match.verifiedAt,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
