const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { authMiddleware, verifyRole, verifyNGOApproved, verifyDashboardAccess } = require('../middleware/auth');
const { getPersonalizedCauses } = require('../utils/tfidfMatcher');

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
// Get all causes or causes by NGO
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

// GET /api/causes/filters/options
// Get all unique cities for filter checkboxes (simplified to cities only)
router.get('/filters/options', async (req, res) => {
  try {
    // Get all unique cities only
    const cities = await Cause.distinct('city');

    res.json({
      cities: cities.sort()
    });
  } catch (error) {
    console.error('Fetch filter options error:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

// GET /api/causes/personalized
// Get personalized causes based on user's selected CITIES only (simplified)
router.get('/personalized', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user city preferences only
    const user = await User.findById(userId).select('selectedCities');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('🔍 PERSONALIZED CAUSES REQUEST (CITY-BASED):');
    console.log('  User ID:', userId);
    console.log('  User from DB:', JSON.stringify(user, null, 2));
    console.log('  Selected Cities:', user.selectedCities || []);
    console.log('  Cities type:', typeof user.selectedCities, 'Array?', Array.isArray(user.selectedCities));
    console.log('  Cities length:', (user.selectedCities || []).length);

    // Fetch all active causes
    const causes = await Cause.find({ status: 'active' })
      .populate('ngoId', 'name email city')
      .lean();

    console.log('  Total active causes:', causes.length);

    // ⚠️ CRITICAL CHECK: Verify selectedCities is not empty
    const selectedCities = user.selectedCities || [];
    console.log('  🚨 PASSING TO FILTER:', {
      selectedCitiesArray: selectedCities,
      isArray: Array.isArray(selectedCities),
      length: selectedCities.length,
      isEmpty: selectedCities.length === 0
    });

    // Apply city-based filtering and ranking
    const personalizedCauses = getPersonalizedCauses(causes, {
      selectedCities: selectedCities
    });

    console.log('  Filtered/Ranked causes:', personalizedCauses.length);
    console.log('  Sample causes returned:', personalizedCauses.slice(0, 3).map(c => ({
      name: c.name,
      city: c.city,
      score: c.relevanceScore
    })));

    res.json({ 
      causes: personalizedCauses,
      preferences: {
        selectedCities: user.selectedCities || []
      }
    });
  } catch (error) {
    console.error('Fetch personalized causes error:', error);
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
