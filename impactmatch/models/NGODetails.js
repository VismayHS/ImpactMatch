const mongoose = require('mongoose');

const ngoDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  certificateUrl: {
    type: String,
    required: true,
  },
  certificateFileName: {
    type: String,
    required: true,
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  verificationNotes: {
    type: String,
    default: '',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
ngoDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NGODetails', ngoDetailsSchema);
