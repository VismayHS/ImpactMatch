const ActivityLog = require('../models/ActivityLog');

/**
 * Log user activity
 * @param {String} action - Action performed (e.g., 'user_register')
 * @param {Object} options - Additional options
 */
const logActivity = async (action, options = {}) => {
  try {
    const log = new ActivityLog({
      action,
      userId: options.userId || null,
      performedBy: options.performedBy || options.userId || null,
      userType: options.userType || 'user',
      details: options.details || '',
      metadata: options.metadata || {},
      ipAddress: options.ipAddress || '',
      userAgent: options.userAgent || '',
    });

    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error - logging shouldn't break the main flow
    return null;
  }
};

/**
 * Get request metadata for logging
 */
const getRequestMetadata = (req) => {
  return {
    ipAddress: req.ip || req.connection.remoteAddress || '',
    userAgent: req.get('user-agent') || '',
  };
};

module.exports = {
  logActivity,
  getRequestMetadata,
};
