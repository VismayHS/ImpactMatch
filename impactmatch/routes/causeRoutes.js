const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { authMiddleware, verifyRole, verifyNGOApproved, verifyDashboardAccess } = require('../middleware/auth');
const matchingService = require('../services/matchingService');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/causes/');
  },
  filename: (req, file, cb) => {
    cb(null, `cause-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/causes
// Get all causes with optional filtering
router.get('/', async (req, res) => {
  try {
    const { ngoId, status } = req.query;
    
    let query = {};
    if (ngoId) query.ngoId = ngoId;
    if (status) query.status = status;

    const causes = await Cause.find(query)
      .populate('ngoId', 'name email city')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ causes });
  } catch (error) {
    console.error('Fetch causes error:', error);
    res.status(500).json({ error: 'Failed to fetch causes' });
  }
});

// GET /api/causes/personalized
// Get personalized causes using REAL AI matching algorithm
router.get('/personalized', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch full user profile with interests and preferences
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('🤖 AI MATCHING REQUEST:');
    console.log('  User:', user.name);
    console.log('  Interests:', user.interests);
    console.log('  City:', user.city);
    console.log('  Availability:', user.availability);

    // Fetch all active causes with NGO details
    const causes = await Cause.find({ status: 'active' })
      .populate('ngoId', 'name email city interests')
      .lean();

    console.log('  Total causes:', causes.length);

    // Calculate REAL match scores using AI algorithm
    const matchedCauses = causes.map(cause => {
      // Calculate match between volunteer and NGO
      const matchResult = matchingService.calculateMatch(user, {
        ...cause.ngoId,
        interests: cause.category, // Use cause category as NGO interest
        city: cause.city || cause.ngoId?.city
      });

      return {
        ...cause,
        matchScore: matchResult.matchScore,
        matchLevel: matchResult.matchLevel,
        matchReasons: matchResult.reasons,
        matchBreakdown: matchResult.breakdown
      };
    });

    // Sort by match score (highest first)
    matchedCauses.sort((a, b) => b.matchScore - a.matchScore);

    console.log('  ✅ Top 3 matches:');
    matchedCauses.slice(0, 3).forEach((c, i) => {
      console.log(`    ${i+1}. ${c.name} - ${c.matchScore}% (${c.matchLevel})`);
      console.log(`       Reasons: ${c.matchReasons.join(', ')}`);
    });

    res.json({ 
      causes: matchedCauses,
      totalMatches: matchedCauses.length,
      algorithm: 'AI-powered matching (Cosine Similarity + Multi-factor scoring)'
    });
  } catch (error) {
    console.error('AI matching error:', error);
    res.status(500).json({ error: 'Failed to fetch personalized causes' });
  }
});

// GET /api/causes/:id
// Get single cause by ID
router.get('/:id', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id)
      .populate('ngoId', 'name email')
      .lean();
    
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }
    
    res.json({ cause });
  } catch (error) {
    console.error('Fetch cause error:', error);
    res.status(500).json({ error: 'Failed to fetch cause' });
  }
});

// POST /api/causes
// Create a new cause (NGO only - must have dashboard access)
router.post('/', authMiddleware, verifyRole('ngo'), verifyDashboardAccess, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, city, lat, lng, volunteerLimit, ngoId } = req.body;

    if (!title || !description || !category || !city || !ngoId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify NGO exists and is verified
    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.role !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can create causes' });
    }

    const causeData = {
      name: title,
      description,
      category,
      city,
      lat: parseFloat(lat) || undefined,
      lng: parseFloat(lng) || undefined,
      ngoId,
      volunteerLimit: parseInt(volunteerLimit) || 50,
      volunteersJoined: 0,
      status: ngo.verified ? 'active' : 'pending_approval'
    };

    if (req.file) {
      causeData.image = `/uploads/causes/${req.file.filename}`;
    }

    const cause = new Cause(causeData);
    await cause.save();

    res.status(201).json({
      message: 'Cause created successfully',
      cause: cause.toObject()
    });
  } catch (error) {
    console.error('Create cause error:', error);
    res.status(500).json({ error: 'Failed to create cause' });
  }
});

// PUT /api/causes/:id
// Update a cause (NGO or Admin only)
router.put('/:id', authMiddleware, verifyRole('ngo', 'admin'), async (req, res) => {
  try {
    const { title, description, category, city, lat, lng, volunteerLimit, status } = req.body;

    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    // Update fields
    if (title) cause.name = title;
    if (description) cause.description = description;
    if (category) cause.category = category;
    if (city) cause.city = city;
    if (lat) cause.lat = parseFloat(lat);
    if (lng) cause.lng = parseFloat(lng);
    if (volunteerLimit) cause.volunteerLimit = parseInt(volunteerLimit);
    if (status) cause.status = status;

    await cause.save();

    res.json({
      message: 'Cause updated successfully',
      cause: cause.toObject()
    });
  } catch (error) {
    console.error('Update cause error:', error);
    res.status(500).json({ error: 'Failed to update cause' });
  }
});

// DELETE /api/causes/:id
// Delete a cause (NGO or Admin only)
router.delete('/:id', authMiddleware, verifyRole('ngo', 'admin'), async (req, res) => {
  try {
    const cause = await Cause.findByIdAndDelete(req.params.id);
    
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    res.json({ message: 'Cause deleted successfully' });
  } catch (error) {
    console.error('Delete cause error:', error);
    res.status(500).json({ error: 'Failed to delete cause' });
  }
});

module.exports = router;
