const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Admin = require('../models/Admin');
const { sendMail } = require('../utils/mailer');

dotenv.config();


const normalizeKeys = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = key.toLowerCase().replace(/\s+/g, "_"); 
        newObj[newKey] = obj[key];
    }
    return newObj;
};

// Admin Registration
const adminRegister = async (req, res) => {
    try {
        const normalizedBody = normalizeKeys(req.body);
        const { email, password } = normalizedBody;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: 'Admin already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering admin', details: error.message });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const normalizedBody = normalizeKeys(req.body);
        const { email, password } = normalizedBody;
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const normalizedBody = normalizeKeys(req.body);
        const { email } = normalizedBody;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');

        admin.resetToken = resetToken;
        admin.resetTokenExpiry = Date.now() + 3600000;
        await admin.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendMail(email, 'Admin Password Reset Request', `Click the link to reset your password: ${resetLink}`);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending password reset email', details: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const normalizedBody = normalizeKeys(req.body);
        const { email, new_password } = normalizedBody;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        if (!new_password) {
            return res.status(400).json({ error: 'New password is required' });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);

        admin.password = hashedPassword;
        await admin.save();

        await sendMail(email, 'Your password has been reset', 'Your password has been successfully reset.');

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password', details: error.message });
    }
};

const getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching members', details: error.message });
    }
};

const getMemberById = async (req, res) => {
    try {
        const { membershipID } = req.params;
        const member = await Member.findOne({ membershipID });

        if (!member) return res.status(404).json({ error: 'Member not found' });

        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching member', details: error.message });
    }
};

const editMember = async (req, res) => {
    try {
        const normalizedBody = normalizeKeys(req.body);

        const { membershipID } = req.params;
        const { full_name, email, phone_number, age, trainer_name, membership_plan, gender } = normalizedBody;

        const member = await Member.findOne({ membershipID });
        if (!member) return res.status(404).json({ error: 'Member not found' });

        let newTrainer = null;
        if (trainer_name) {
            newTrainer = await Trainer.findOne({ trainer_name: new RegExp(`^${trainer_name}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });

            if (member.trainer_name !== newTrainer.trainer_name) {
                const previousTrainer = await Trainer.findOne({ trainer_name: member.trainer_name });
                if (previousTrainer) {
                    previousTrainer.assigned_Members = Math.max(0, previousTrainer.assigned_Members - 1);
                    await previousTrainer.save();
                }
            }
        }

        const updatedMember = await Member.findOneAndUpdate(
            { membershipID },
            { full_name, email, phone_number, age, trainer_name: newTrainer ? newTrainer.trainer_name : member.trainer_name, membership_plan, gender },
            { new: true }
        );

        if (newTrainer) {
            newTrainer.assigned_Members = await Member.countDocuments({ trainer_name: newTrainer.trainer_name });
            await newTrainer.save();
        }

        res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        res.status(500).json({ error: 'Error updating member', details: error.message });
    }
};

const addMember = async (req, res) => {
    try {
        const mappedBody = normalizeKeys(req.body);

        const { full_name, email, phone_number, age, trainer_name, password, membership_plan, gender } = mappedBody;

        let newTrainer = null;
        if (trainer_name) {
            newTrainer = await Trainer.findOne({ trainer_name: new RegExp(`^${trainer_name}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });
        }
        let membershipID;
        let isUnique = false;
        while (!isUnique) {
            membershipID = `GYM${Math.floor(100000 + Math.random() * 900000)}`;
            const existingMember = await Member.findOne({ membershipID });
            if (!existingMember) isUnique = true;
        }

        const newMember = new Member({
            full_name,
            email,
            phone_number,
            age,
            trainer_name: newTrainer ? newTrainer.trainer_name : null,
            membership_plan,
            gender,
            membershipID 
        });

        await newMember.save();

        if (newTrainer) {
            newTrainer.assigned_Members = await Member.countDocuments({ trainer_name: newTrainer.trainer_name });
            await newTrainer.save();
        }

        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        res.status(500).json({ error: 'Error adding member', details: error.message });
    }
};


const deleteMember = async (req, res) => {

    try {

        const { membershipID } = req.params;

        const member = await Member.findOne({ membershipID });
        if (!member) return res.status(404).json({ error: 'Member not found' });

        if (member.trainer_name) {
            const trainer = await Trainer.findOne({ trainer_name: member.trainer_name });
            if (trainer) {
                trainer.assigned_Members = Math.max(0, trainer.assigned_Members - 1);
                await trainer.save();
            }
        }

        await Member.findOneAndDelete({ membershipID });

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting member', details: error.message });
    }
};



module.exports = { adminRegister, adminLogin, forgotPassword, resetPassword, getMembers, getMemberById, editMember, addMember,deleteMember };
