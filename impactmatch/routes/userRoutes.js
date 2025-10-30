const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGODetails = require('../models/NGODetails');
const Match = require('../models/Match');
const { authMiddleware, generateToken } = require('../utils/auth');
const { logActivity, getRequestMetadata } = require('../utils/logger');
const upload = require('../utils/upload');
const path = require('path');

// POST /api/users/login
// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In production, compare hashed password with bcrypt
    // For demo, direct comparison (NOT SECURE)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Log login activity
    const metadata = getRequestMetadata(req);
    await logActivity('user_login', {
      userId: user._id,
      userType: user.role,
      details: `User ${user.name} logged in`,
      ...metadata,
    });

    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        interests: user.interests,
        role: user.role,
        verified: user.verified,
        impactScore: user.impactScore,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/users/register
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      city, 
      interests, 
      availability, 
      role,
      officeAddress,
      certificateUploaded,
      verified
    } = req.body;

    // Validation
    if (!name || !email || !password || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with role-specific fields
    const userData = {
      name,
      email,
      password, // In production, hash this with bcrypt
      city,
      interests: Array.isArray(interests) ? interests.join(', ') : interests,
      availability: availability || 'weekends',
      role: role || 'user',
      impactScore: 0,
      badges: [],
      joinedCauses: [],
    };

    // Add role-specific fields
    if (role === 'organisation') {
      userData.officeAddress = officeAddress || '';
      userData.verified = true;
    } else if (role === 'ngo') {
      userData.certificateUploaded = certificateUploaded || false;
      userData.verified = verified !== undefined ? verified : false; // NGOs need admin approval
    } else {
      userData.verified = true; // Regular users are auto-verified
    }

    const user = new User(userData);
    await user.save();

    // Log registration activity
    const metadata = getRequestMetadata(req);
    await logActivity(role === 'ngo' ? 'ngo_register' : 'user_register', {
      userId: user._id,
      userType: role || 'user',
      details: `New ${role || 'user'} registered: ${user.name}`,
      metadata: { email, city, role },
      ...metadata,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        interests: user.interests,
        role: user.role,
        verified: user.verified,
        impactScore: user.impactScore,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/users/:id
// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('joinedCauses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      interests: user.interests,
      role: user.role,
      verified: user.verified,
      officeAddress: user.officeAddress,
      certificateUploaded: user.certificateUploaded,
      impactScore: user.impactScore,
      badges: user.badges,
      joinedCauses: user.joinedCauses,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id
// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { interests, availability, city } = req.body;

    const updateData = {};
    if (interests) updateData.interests = Array.isArray(interests) ? interests.join(', ') : interests;
    if (availability) updateData.availability = availability;
    if (city) updateData.city = city;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        city: user.city,
        interests: user.interests,
        impactScore: user.impactScore,
        badges: user.badges,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// POST /api/users/upload-certificate
// Upload NGO government certificate
router.post('/upload-certificate', upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, registrationNumber } = req.body;

    if (!userId || !registrationNumber) {
      return res.status(400).json({ error: 'User ID and registration number required' });
    }

    // Verify user exists and is NGO
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'ngo') {
      return res.status(400).json({ error: 'Only NGO users can upload certificates' });
    }

    // Create or update NGO details
    const certificateUrl = `/uploads/certificates/${req.file.filename}`;
    
    let ngoDetails = await NGODetails.findOne({ userId });
    
    if (ngoDetails) {
      // Update existing
      ngoDetails.registrationNumber = registrationNumber;
      ngoDetails.certificateUrl = certificateUrl;
      ngoDetails.certificateFileName = req.file.originalname;
      ngoDetails.status = 'pending';
      await ngoDetails.save();
    } else {
      // Create new
      ngoDetails = new NGODetails({
        userId,
        registrationNumber,
        certificateUrl,
        certificateFileName: req.file.originalname,
        status: 'pending',
      });
      await ngoDetails.save();
    }

    // Update user
    await User.findByIdAndUpdate(userId, {
      certificateUploaded: true,
      verified: false, // Requires admin approval
    });

    // Log activity
    const metadata = getRequestMetadata(req);
    await logActivity('ngo_certificate_upload', {
      userId,
      userType: 'ngo',
      details: `NGO certificate uploaded by ${user.name}`,
      metadata: { fileName: req.file.originalname, registrationNumber },
      ...metadata,
    });

    res.json({
      message: 'Certificate uploaded successfully. Awaiting admin verification.',
      certificateUrl,
      ngoDetails,
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
