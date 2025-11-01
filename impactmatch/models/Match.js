const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  causeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cause',
    required: true,
  },
  status: {
    type: String,
    enum: ['interested', 'verified', 'rejected'],
    default: 'interested',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  txHash: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Match', matchSchema);
