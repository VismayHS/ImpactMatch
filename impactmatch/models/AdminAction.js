const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'ngo_approved',
      'ngo_rejected',
      'ngo_suspended',
      'user_suspended',
      'user_promoted',
      'cause_approved',
      'cause_flagged',
      'cause_removed',
      'report_generated'
    ]
  },
  targetType: {
    type: String,
    required: true,
    enum: ['user', 'ngo', 'cause', 'system']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: Object,
    default: {}
  },
  reason: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

adminActionSchema.index({ adminId: 1, timestamp: -1 });
adminActionSchema.index({ targetType: 1, targetId: 1 });
adminActionSchema.index({ actionType: 1, timestamp: -1 });

module.exports = mongoose.model('AdminAction', adminActionSchema);
