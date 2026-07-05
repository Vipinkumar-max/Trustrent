const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['room', '1BHK', '2BHK', 'PG', 'flat'],
    default: 'flat'
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  furnishing: {
    type: String,
    enum: ['furnished', 'semi', 'unfurnished'],
    default: 'semi'
  },
  amenities: [String],
  photos: [String],
  available: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);