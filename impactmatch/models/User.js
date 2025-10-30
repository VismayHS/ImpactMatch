const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  interests: {
    type: String, // Comma-separated string
    required: true,
  },
  availability: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'organisation', 'ngo', 'admin'],
    default: 'user',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  officeAddress: {
    type: String,
    default: '',
  },
  certificateUploaded: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: true, // true by default, false for NGOs until admin approval
  },
  impactScore: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: String, // 'BRONZE', 'SILVER', 'GOLD'
  }],
  joinedCauses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
