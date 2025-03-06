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
    required: true // Set to false if password is optional
  },
  membership_plan: {
    type: String,
    required: true  // Set to false if this field is optional
  },
  gender: {
    type: String,
    required: true, // Set to false if gender is optional
    enum: ['Male', 'Female', 'Other']  // Optional values
  }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
