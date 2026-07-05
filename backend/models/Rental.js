const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  listing:  { type: mongoose.Schema.Types.ObjectId, 
              ref: 'Listing', required: true },
  tenant:   { type: mongoose.Schema.Types.ObjectId, 
              ref: 'User', required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, 
              ref: 'User', required: true },
  
  // Payment
  rent:          { type: Number, required: true },
  deposit:       { type: Number, required: true },
  platformFee:   { type: Number },
  
  // Status
 status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
},
  
  // Dates
  startDate:  { type: Date },
  endDate:    { type: Date },
  
  // Payment info
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  depositReleased:   { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);