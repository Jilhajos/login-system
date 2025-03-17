const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, required: true },
    trainer_name: { type: String },
    membershipID: { type: String, unique: true },
    password: { type: String },
    membership_plan: { type: String, required: false, default:null},
    amount_Paid: { type: Number, default: 0 },
    payment_status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
    membership_status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },

    payment_date: { type: Date, default: null }, 
    renewal_date: { type: Date, default: null }, 

    passport_photo: { type: Buffer },
    photo_mime_type: { type: String }  // Storing MIME type (JPEG, PNG, etc.)
});

module.exports = mongoose.model('Member', MemberSchema);
