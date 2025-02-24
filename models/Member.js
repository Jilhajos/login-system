const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    emergency_contact: { type: String },
    health_conditions: { type: String },
    membership_plan: { type: String, required: true },
    trainerName: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Member', MemberSchema);
