const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    enum: ['user', 'ngo', 'admin', 'organisation'],
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
  // NGO Verification fields
  aiTrustScore: {
    type: Number,
    default: null, // AI-generated trust score (0-100)
  },
  dashboardAccess: {
    type: Boolean,
    default: true, // false if AI score < 75, true if >= 75 or not NGO
  },
  certificateVerified: {
    type: Boolean,
    default: false, // Manual admin verification of certificate
  },
  // User preference fields for TF-IDF cause matching
  selectedInterests: [{
    type: String, // Array of selected cause categories
  }],
  selectedCities: [{
    type: String, // Array of selected cities
  }],
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);
