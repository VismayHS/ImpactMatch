const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGODetails = require('../models/NGODetails');
const ActivityLog = require('../models/ActivityLog');
const Cause = require('../models/Cause');
const Match = require('../models/Match');
const { authMiddleware, verifyRole, generateToken } = require('../middleware/auth');
const { logActivity, getRequestMetadata } = require('../utils/logger');
const upload = require('../utils/upload');
const path = require('path');

// Admin login (special endpoint for admin authentication)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find admin user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin (in production, hash password with bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check admin role
    if (user.role !== 'admin' && !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access only' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Log admin login
    const metadata = getRequestMetadata(req);
    await logActivity('admin_login', {
      userId: user._id,
      userType: 'admin',
      details: `Admin ${user.name} logged in`,
      ...metadata,
    });

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      individualUsers,
      organizationUsers,
      ngoUsers,
      pendingNGOs,
      totalCauses,
      totalMatches,
      verifiedMatches,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'organisation' }),
      User.countDocuments({ role: 'ngo' }),
      NGODetails.countDocuments({ status: 'pending' }),
      Cause.countDocuments(),
      Match.countDocuments(),
      Match.countDocuments({ status: 'verified' }),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email role verified createdAt'),
    ]);

    // Get user growth data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalUsers,
        individualUsers,
        organizationUsers,
        ngoUsers,
        pendingNGOs,
        totalCauses,
        totalMatches,
        verifiedMatches,
      },
      recentUsers,
      userGrowth,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get all users with filters
router.get('/users', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { role, verified, search, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details by ID
router.get('/users/:id', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('joinedCauses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If NGO, get NGO details
    let ngoDetails = null;
    if (user.role === 'ngo') {
      ngoDetails = await NGODetails.findOne({ userId: user._id })
        .populate('verifiedBy', 'name email');
    }

    // Get activity logs for this user
    const activityLogs = await ActivityLog.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      user,
      ngoDetails,
      activityLogs,
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Get all NGO certificates
router.get('/ngos/certificates', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ngoDetails, total] = await Promise.all([
      NGODetails.find(filter)
        .populate('userId', 'name email createdAt')
        .populate('verifiedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      NGODetails.countDocuments(filter),
    ]);

    res.json({
      ngos: ngoDetails,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get NGO certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch NGO certificates' });
  }
});

// Get pending NGO verifications (includes AI trust scores and certificate status)
router.get('/ngos/pending', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find all NGOs that need manual verification
    const [pendingNGOs, total] = await Promise.all([
      User.find({ 
        role: 'ngo',
        certificateVerified: false // Not yet verified by admin
      })
        .select('name email city createdAt aiTrustScore dashboardAccess certificateVerified verified certificateUploaded')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments({ 
        role: 'ngo',
        certificateVerified: false
      })
    ]);

    // Get NGO details for each pending NGO
    const ngosWithDetails = await Promise.all(
      pendingNGOs.map(async (ngo) => {
        const ngoDetails = await NGODetails.findOne({ userId: ngo._id });
        return {
          ...ngo,
          ngoDetails,
          status: ngo.dashboardAccess ? 'has_access' : 'locked',
          requiresUrgentReview: !ngo.dashboardAccess // AI score < 75
        };
      })
    );

    // Separate into high priority (locked) and low priority (has access)
    const lockedNGOs = ngosWithDetails.filter(ngo => !ngo.dashboardAccess);
    const accessGrantedNGOs = ngosWithDetails.filter(ngo => ngo.dashboardAccess);

    res.json({
      pendingNGOs: ngosWithDetails,
      summary: {
        total,
        locked: lockedNGOs.length,
        accessGranted: accessGrantedNGOs.length
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get pending NGOs error:', error);
    res.status(500).json({ error: 'Failed to fetch pending NGO verifications' });
  }
});

// Verify/Reject NGO
router.post('/ngos/:id/verify', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { status, notes, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ngoDetails = await NGODetails.findById(req.params.id);
    
    if (!ngoDetails) {
      return res.status(404).json({ error: 'NGO details not found' });
    }

    // Update NGO details
    ngoDetails.status = status;
    ngoDetails.verifiedByAdmin = status === 'approved';
    ngoDetails.verifiedBy = req.user._id;
    ngoDetails.verifiedAt = new Date();
    ngoDetails.verificationNotes = notes || '';
    ngoDetails.rejectionReason = status === 'rejected' ? rejectionReason : '';
    await ngoDetails.save();

    // Update user verification status
    await User.findByIdAndUpdate(ngoDetails.userId, {
      verified: status === 'approved',
      certificateVerified: status === 'approved',
      dashboardAccess: status === 'approved' // Grant access if approved
    });

    // Log activity
    const metadata = getRequestMetadata(req);
    await logActivity(status === 'approved' ? 'ngo_verified' : 'ngo_rejected', {
      userId: ngoDetails.userId,
      performedBy: req.user._id,
      userType: 'admin',
      details: `NGO ${status} by admin ${req.user.name}`,
      metadata: { ngoDetailsId: ngoDetails._id, notes, rejectionReason },
      ...metadata,
    });

    res.json({
      message: `NGO ${status} successfully`,
      ngoDetails,
    });
  } catch (error) {
    console.error('NGO verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Manually verify NGO certificate (for new system with AI scores)
router.post('/ngos/verify-certificate/:userId', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { approved, notes, rejectionReason, grantDashboardAccess } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({ error: 'NGO user not found' });
    }

    // Update user verification fields
    const updateData = {
      certificateVerified: approved,
      verified: approved
    };

    // Admin can override dashboard access
    if (grantDashboardAccess !== undefined) {
      updateData.dashboardAccess = grantDashboardAccess;
    } else if (approved) {
      // If approved and not specified, grant access
      updateData.dashboardAccess = true;
    }

    await User.findByIdAndUpdate(userId, updateData);

    // Update or create NGO details
    let ngoDetails = await NGODetails.findOne({ userId });
    if (ngoDetails) {
      ngoDetails.status = approved ? 'approved' : 'rejected';
      ngoDetails.verifiedByAdmin = approved;
      ngoDetails.verifiedBy = req.user._id;
      ngoDetails.verifiedAt = new Date();
      ngoDetails.verificationNotes = notes || '';
      ngoDetails.rejectionReason = approved ? '' : (rejectionReason || '');
      await ngoDetails.save();
    }

    // Log activity
    const metadata = getRequestMetadata(req);
    await logActivity(approved ? 'ngo_certificate_approved' : 'ngo_certificate_rejected', {
      userId,
      performedBy: req.user._id,
      userType: 'admin',
      details: `NGO certificate ${approved ? 'approved' : 'rejected'} by admin ${req.user.name}`,
      metadata: { 
        aiTrustScore: user.aiTrustScore,
        dashboardAccess: updateData.dashboardAccess,
        notes, 
        rejectionReason 
      },
      ...metadata,
    });

    res.json({
      message: `NGO certificate ${approved ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        certificateVerified: updateData.certificateVerified,
        dashboardAccess: updateData.dashboardAccess,
        verified: updateData.verified
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get activity logs
router.get('/logs', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const { 
      action, 
      userType, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 50 
    } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (userType) filter.userType = userType;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('userId', 'name email role')
        .populate('performedBy', 'name email role')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Export logs as CSV
router.get('/logs/export', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email')
      .populate('performedBy', 'name email')
      .sort({ timestamp: -1 })
      .limit(5000); // Limit to prevent memory issues

    // Create CSV
    const csvHeader = 'Timestamp,Action,User,User Type,Performed By,Details,IP Address\n';
    const csvRows = logs.map(log => {
      return [
        log.timestamp.toISOString(),
        log.action,
        log.userId ? `${log.userId.name} (${log.userId.email})` : 'N/A',
        log.userType,
        log.performedBy ? `${log.performedBy.name} (${log.performedBy.email})` : 'System',
        `"${log.details.replace(/"/g, '""')}"`,
        log.ipAddress,
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=activity-logs.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export logs error:', error);
    res.status(500).json({ error: 'Failed to export logs' });
  }
});

// Delete user (soft delete - set verified to false)
router.delete('/users/:id', authMiddleware, verifyRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verified: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log activity
    const metadata = getRequestMetadata(req);
    await logActivity('admin_action', {
      userId: req.params.id,
      performedBy: req.user._id,
      userType: 'admin',
      details: `User ${user.name} deactivated by admin ${req.user.name}`,
      metadata: { action: 'delete_user' },
      ...metadata,
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
