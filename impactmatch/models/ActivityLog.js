const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user_register',
      'user_login',
      'user_logout',
      'ngo_register',
      'ngo_certificate_upload',
      'ngo_verified',
      'ngo_rejected',
      'cause_joined',
      'cause_verified',
      'admin_login',
      'admin_action',
      'profile_update',
      'password_change',
    ],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userType: {
    type: String,
    enum: ['user', 'organisation', 'ngo', 'admin', 'system'],
    default: 'user',
  },
  details: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
