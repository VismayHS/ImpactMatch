const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { authMiddleware, verifyRole, verifyNGOApproved } = require('../middleware/auth');

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
// Create a new cause (NGO only - must be verified)
router.post('/', authMiddleware, verifyRole('ngo'), verifyNGOApproved, upload.single('image'), async (req, res) => {
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
