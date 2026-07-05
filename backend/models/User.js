const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['tenant', 'landlord'],
    default: 'tenant'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  trustScore: {
    type: Number,
    default: 30
  },
  profilePic: {
    type: String
  },
  occupation: {
    type: String
  },
  monthlyIncome: {
    type: Number
  }
}, { timestamps: true });
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);