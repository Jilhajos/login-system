const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }, 
    specialization: { type: String },
    assignedMembers: { type: Number, default: 0 },
    availability: { type: Boolean, default: true }
});

module.exports = mongoose.model('Trainer', TrainerSchema);
