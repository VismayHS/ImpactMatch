const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'impactmatch_super_secret_key_2024');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.suspended) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// Verify user has specific role(s)
const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: `Access denied. This resource is for ${allowedRoles.join(' or ')} only.`,
          userRole: req.user.role,
          requiredRole: allowedRoles
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};

// Verify NGO is approved before allowing certain actions
const verifyNGOApproved = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'NGO account required' });
    }

    if (!req.user.verified) {
      return res.status(403).json({ 
        error: 'NGO verification pending. Please wait for admin approval.',
        verified: false,
        pendingApproval: true
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Verification check failed' });
  }
};

// Verify NGO has dashboard access (AI score >= 75)
const verifyDashboardAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Non-NGOs always have dashboard access
    if (req.user.role !== 'ngo') {
      return next();
    }

    // Check if NGO has dashboard access
    if (!req.user.dashboardAccess) {
      return res.status(403).json({ 
        error: 'Dashboard access restricted. Your AI trust score is below the required threshold (75). Please wait for manual verification.',
        dashboardAccess: false,
        aiTrustScore: req.user.aiTrustScore,
        certificateVerified: req.user.certificateVerified,
        requiresManualReview: true
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Dashboard access check failed' });
  }
};

// Generate JWT token with expiry
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'impactmatch_super_secret_key_2024',
    { expiresIn }
  );
};

// Verify token and return decoded data (for checking expiry on frontend)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'impactmatch_super_secret_key_2024');
  } catch (error) {
    return null;
  }
};

module.exports = {
  authMiddleware,
  verifyRole,
  verifyNGOApproved,
  verifyDashboardAccess,
  generateToken,
  verifyToken,
};
