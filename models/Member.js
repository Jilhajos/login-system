const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  trainer: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  membership_plan: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  resetToken: {  // ✅ Added field to store the reset token
    type: String
  },
  resetTokenExpiration: {  // ✅ Added field for expiration time
    type: Date
  }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
