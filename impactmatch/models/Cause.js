const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: false,
  },
  lng: {
    type: Number,
    required: false,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  volunteerLimit: {
    type: Number,
    default: 50,
  },
  volunteersJoined: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'pending_approval'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cause', causeSchema);
