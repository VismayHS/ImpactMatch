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
    enum: ['interested', 'verified'],
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
  txHash: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Match', matchSchema);
