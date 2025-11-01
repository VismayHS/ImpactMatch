const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Verification = require('../models/Verification');
const { recordImpact } = require('../utils/blockchain');
const { authMiddleware, verifyRole, verifyNGOApproved } = require('../middleware/auth');
const axios = require('axios');

// AI Model URL for NGO verification
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';

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

    console.log('📥 Verification request received:', { matchId, verifierId });

    if (!matchId || !verifierId) {
      return res.status(400).json({ error: 'matchId and verifierId are required' });
    }

    // Get match with populated causeId
    const match = await Match.findById(matchId).populate('causeId userId');
    if (!match) {
      console.error('❌ Match not found:', matchId);
      return res.status(404).json({ error: 'Match not found' });
    }

    console.log('📋 Match found:', {
      matchId: match._id,
      status: match.status,
      hasCauseId: !!match.causeId,
      hasUserId: !!match.userId
    });

    if (match.status === 'verified') {
      return res.status(400).json({ error: 'Match already verified' });
    }

    // Get user for blockchain address (using userId as address for demo)
    const user = await User.findById(match.userId);
    if (!user) {
      console.error('❌ User not found:', match.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Record on blockchain
    // In production, use actual Ethereum address; for demo, use a mock address
    const volunteerAddress = process.env.DEMO_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const causeId = match.causeId._id.toString().slice(-8); // Use last 8 chars as numeric ID

    console.log('🔗 Recording on blockchain:', { volunteerAddress, causeId });

    let blockchainResult;
    try {
      blockchainResult = await recordImpact(volunteerAddress, causeId, match.userId.toString());
      console.log('✅ Blockchain recorded:', blockchainResult);
    } catch (blockchainError) {
      console.error('❌ Blockchain recording failed:', blockchainError);
      return res.status(500).json({ error: 'Blockchain recording failed', details: blockchainError.message });
    }

    // Update match
    match.status = 'verified';
    match.verifiedAt = new Date();
    match.txHash = blockchainResult.txHash;
    await match.save();

    console.log('✅ Match updated to verified');

    // Create verification record
    const verification = new Verification({
      matchId: match._id,
      verifierId,
      txHash: blockchainResult.txHash,
      blockchainEventData: blockchainResult.event,
    });
    await verification.save();

    console.log('✅ Verification record created');

    // Update user score (+20 for verification)
    user.impactScore += 20;
    user.badges = calculateBadges(user.impactScore);
    await user.save();

    console.log('✅ User score updated:', { impactScore: user.impactScore, badges: user.badges });

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
    console.error('❌ Verification error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

// POST /api/verify/deny
// Deny/reject a volunteer's attendance (NGO only - must be verified)
router.post('/deny', authMiddleware, verifyRole('ngo'), verifyNGOApproved, async (req, res) => {
  try {
    const { matchId, verifierId, reason } = req.body;

    if (!matchId || !verifierId) {
      return res.status(400).json({ error: 'matchId and verifierId are required' });
    }

    // Get match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status === 'verified') {
      return res.status(400).json({ error: 'Cannot deny an already verified match' });
    }

    if (match.status === 'rejected') {
      return res.status(400).json({ error: 'Match already rejected' });
    }

    // Update match status to rejected
    match.status = 'rejected';
    match.rejectedAt = new Date();
    match.rejectedBy = verifierId;
    if (reason) {
      match.rejectionReason = reason;
    }
    await match.save();

    res.json({
      message: 'Attendance denied successfully',
      match: {
        id: match._id,
        status: match.status,
        rejectedAt: match.rejectedAt,
      },
    });
  } catch (error) {
    console.error('Deny verification error:', error);
    res.status(500).json({ error: 'Failed to deny attendance' });
  }
});

// POST /api/verify/ngo
// AI-powered NGO verification endpoint
router.post('/ngo', async (req, res) => {
  try {
    const { ngoName } = req.body;

    if (!ngoName) {
      return res.status(400).json({ error: 'NGO name is required' });
    }

    console.log(`🔍 AI Verification request for: ${ngoName}`);

    // Call AI verification service
    try {
      const response = await axios.post(
        `${AI_MODEL_URL}/verify_ngo`,
        { ngo_name: ngoName },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000  // 30 second timeout for web scraping
        }
      );

      const verificationData = response.data;
      
      console.log(`✅ AI Verification complete: Trust Score ${verificationData.trust_score}/100 (${verificationData.trust_level})`);

      // Return full verification data
      res.json({
        success: true,
        ngoName: verificationData.ngo_name,
        trustScore: verificationData.trust_score,
        trustLevel: verificationData.trust_level,
        sentimentLabel: verificationData.sentiment_label,
        sentimentScore: verificationData.sentiment_score,
        numLinks: verificationData.num_links,
        links: verificationData.links,
        notes: verificationData.notes,
        verified: verificationData.trust_score >= 60,  // Auto-verify if trust score >= 60
        timestamp: new Date()
      });

    } catch (aiError) {
      console.error('❌ AI verification service error:', aiError.message);
      
      // Fallback: Return neutral score if AI service is down
      res.json({
        success: false,
        ngoName,
        trustScore: 50,
        trustLevel: 'UNKNOWN',
        sentimentLabel: 'NEUTRAL',
        sentimentScore: 0.5,
        numLinks: 0,
        links: [],
        notes: ['AI service unavailable - manual verification required'],
        verified: false,
        requiresManualReview: true,
        error: 'AI service temporarily unavailable',
        timestamp: new Date()
      });
    }

  } catch (error) {
    console.error('NGO verification error:', error);
    res.status(500).json({ error: 'Failed to verify NGO' });
  }
});

module.exports = router;
