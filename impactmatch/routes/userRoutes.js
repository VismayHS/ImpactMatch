const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGODetails = require('../models/NGODetails');
const Match = require('../models/Match');
const { generateToken } = require('../utils/auth');
const { authMiddleware, verifyRole } = require('../middleware/auth');
const { logActivity, getRequestMetadata } = require('../utils/logger');
const axios = require('axios');

// AI Model URL for NGO verification
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';
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

    // Compare hashed password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
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
        // NGO-specific fields
        dashboardAccess: user.dashboardAccess,
        aiTrustScore: user.aiTrustScore,
        certificateVerified: user.certificateVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/users/forgot-password
// Request password reset (for demo - just logs the request)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    
    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // In production, you would:
    // 1. Generate a unique reset token
    // 2. Store token with expiry in database
    // 3. Send email with reset link
    // 4. Create a reset password page that validates token
    
    // For demo purposes, just log it
    console.log(`Password reset requested for: ${email} (${user.role})`);
    
    // Log activity
    const metadata = getRequestMetadata(req);
    await logActivity('password_reset_request', {
      userId: user._id,
      userType: user.role,
      details: `Password reset requested for ${email}`,
      metadata: { email },
      ...metadata,
    });

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
      // For demo, include reset info (remove in production!)
      demo: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
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

    // Add role-specific fields for NGOs
    if (role === 'ngo') {
      userData.officeAddress = officeAddress || '';
      userData.certificateUploaded = certificateUploaded || false;
      
      // 🤖 AI-powered NGO verification
      let trustScore = 0;
      let dashboardAccess = false;
      
      try {
        console.log(`🔍 Running AI verification for NGO: ${name}`);
        const aiResponse = await axios.post(
          `${AI_MODEL_URL}/verify_ngo`,
          { ngo_name: name },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
          }
        );
        
        trustScore = aiResponse.data.trust_score || 0;
        const trustLevel = aiResponse.data.trust_level || 'UNKNOWN';
        
        console.log(`✅ AI Trust Score: ${trustScore}/100 (${trustLevel})`);
        
        // Dashboard access control based on trust score
        if (trustScore >= 75) {
          dashboardAccess = true;
          console.log(`✅ NGO granted dashboard access (score: ${trustScore})`);
        } else {
          dashboardAccess = false;
          console.log(`🔒 NGO dashboard locked - score too low (${trustScore} < 75)`);
        }
        
        // Store AI verification data
        userData.aiTrustScore = trustScore;
        userData.dashboardAccess = dashboardAccess;
        userData.certificateVerified = false; // Always requires manual admin verification
        userData.verified = false; // NGO not verified until admin approves certificate
        
      } catch (aiError) {
        console.error('⚠️ AI verification failed:', aiError.message);
        // If AI fails, lock dashboard and require manual review
        userData.aiTrustScore = 0;
        userData.dashboardAccess = false;
        userData.certificateVerified = false;
        userData.verified = false;
      }
      
    } else if (role === 'organisation') {
      // Organization-specific fields
      userData.officeAddress = officeAddress || '';
      userData.verified = true; // Organizations are auto-verified
      userData.dashboardAccess = true;
      userData.certificateVerified = false;
      userData.aiTrustScore = null;
      console.log(`✅ Organisation registered: ${name} in ${city}`);
      
    } else {
      userData.verified = true; // Regular users are auto-verified
      userData.dashboardAccess = true;
    }

    const user = new User(userData);
    await user.save();

    // Log registration activity
    const metadata = getRequestMetadata(req);
    let activityType = 'user_register';
    if (role === 'ngo') activityType = 'ngo_register';
    else if (role === 'organisation') activityType = 'organisation_register';
    
    await logActivity(activityType, {
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
    console.error('❌ Registration error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/users/:id
// Get user profile (Protected - requires auth)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is accessing their own profile OR is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

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
// Update user profile (Protected - requires auth)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is updating their own profile OR is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { 
      interests, 
      availability, 
      city, 
      name, 
      email, 
      officeAddress, 
      verified, 
      suspended,
      selectedInterests,
      selectedCategories,
      selectedCities,
      certificateVerified,
      dashboardAccess
    } = req.body;

    const updateData = {};
    if (interests) updateData.interests = Array.isArray(interests) ? interests.join(', ') : interests;
    if (availability) updateData.availability = availability;
    if (city) updateData.city = city;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (officeAddress) updateData.officeAddress = officeAddress;
    
    // User preference updates (for TF-IDF and personalized filtering)
    if (selectedInterests !== undefined) updateData.selectedInterests = selectedInterests;
    if (selectedCategories !== undefined) updateData.selectedCategories = selectedCategories;
    if (selectedCities !== undefined) updateData.selectedCities = selectedCities;

    console.log('💾 UPDATING USER PREFERENCES:');
    console.log('  User ID:', req.params.id);
    console.log('  New selectedInterests:', selectedInterests);
    console.log('  New selectedCategories:', selectedCategories);
    console.log('  New selectedCities:', selectedCities);
    console.log('  UpdateData:', JSON.stringify(updateData, null, 2));

    // Only admins can update verified, certificateVerified, dashboardAccess, and suspended status
    if (req.user.role === 'admin') {
      if (verified !== undefined) updateData.verified = verified;
      if (suspended !== undefined) updateData.suspended = suspended;
      if (certificateVerified !== undefined) updateData.certificateVerified = certificateVerified;
      if (dashboardAccess !== undefined) updateData.dashboardAccess = dashboardAccess;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        officeAddress: user.officeAddress,
        interests: user.interests,
        impactScore: user.impactScore,
        badges: user.badges,
        selectedInterests: user.selectedInterests,
        selectedCategories: user.selectedCategories,
        selectedCities: user.selectedCities,
        dashboardAccess: user.dashboardAccess,
        certificateVerified: user.certificateVerified,
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
