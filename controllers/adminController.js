const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const { sendMail } = require('../utils/mailer');

dotenv.config();

// Admin login logic
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};

// Fetch all members
const getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching members', details: error.message });
    }
};

// Fetch a single member
const getMemberById = async (req, res) => {
    try {
        const { memberId } = req.params;
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching member details', details: error.message });
    }
};

// Edit member details
const editMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { name, email, phone, age, trainerName } = req.body;

        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        let newTrainer = null;
        if (trainerName) {
            newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });

            if (member.trainer && member.trainer !== newTrainer.name) {
                const previousTrainer = await Trainer.findOne({ name: member.trainer });
                if (previousTrainer) {
                    previousTrainer.assignedMembers = Math.max(0, previousTrainer.assignedMembers - 1);
                    await previousTrainer.save();
                }
            }
        }

        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            { name, email, phone, age, trainer: newTrainer ? newTrainer.name : member.trainer },
            { new: true }
        );

        if (newTrainer) {
            newTrainer.assignedMembers = await Member.countDocuments({ trainer: newTrainer.name });
            await newTrainer.save();
        }

        res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        res.status(500).json({ error: 'Error updating member', details: error.message });
    }
};

// Add new member
const addMember = async (req, res) => {
    try {
        const { name, email, phone, age, trainerName, password, membership_plan, gender } = req.body;

        if (!password || !membership_plan || !gender) {
            return res.status(400).json({ error: 'Password, Membership Plan, and Gender are required.' });
        }

        let newTrainer = null;
        if (trainerName) {
            newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newMember = new Member({
            name,
            email,
            phone,
            age,
            trainer: newTrainer ? newTrainer.name : null,
            password: hashedPassword,
            membership_plan,
            gender
        });

        await newMember.save();

        if (newTrainer) {
            newTrainer.assignedMembers = await Member.countDocuments({ trainer: newTrainer.name });
            await newTrainer.save();
        }

        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        res.status(500).json({ error: 'Error adding member', details: error.message });
    }
};

// Forgot Password - Send reset token via email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const member = await Member.findOne({ email });

        if (!member) return res.status(404).json({ error: 'Member not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        member.resetToken = resetToken;
        member.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

        await member.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendMail(email, 'Password Reset Request', `Click the link to reset your password: ${resetLink}`);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending password reset email', details: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const member = await Member.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!member) return res.status(400).json({ error: 'Invalid or expired token' });

        member.password = await bcrypt.hash(newPassword, 10);
        member.resetToken = undefined;
        member.resetTokenExpiration = undefined;

        await member.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password', details: error.message });
    }
};

module.exports = { 
    adminLogin, 
    getMembers, 
    getMemberById, 
    editMember, 
    addMember, 
    forgotPassword, 
    resetPassword 
};
