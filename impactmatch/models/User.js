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
