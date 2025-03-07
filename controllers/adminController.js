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

// Admin Registration logic
const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });

        await newAdmin.save();  // Save the new admin to the database
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering admin', details: error.message });
    }
};

// Admin login logic
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email exists in the Admin model
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
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

        res.status(200).json({
            ...member.toObject(),
            trainerName: member.trainerName,  // Rename trainer to trainerName
            trainer: undefined  // Hide trainer field
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching member', details: error.message });
    }
};

// Edit a member
const editMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { name, email, phone, age, trainerName, membership_plan, gender } = req.body;

        // Find the existing member
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        let newTrainer = null;
        if (trainerName) {
            newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });

            // Update previous trainer's assigned count
            if (member.trainerName && member.trainerName !== newTrainer.name) {
                const previousTrainer = await Trainer.findOne({ name: member.trainerName });
                if (previousTrainer) {
                    previousTrainer.assignedMembers = Math.max(0, previousTrainer.assignedMembers - 1);
                    await previousTrainer.save();
                }
            }
        }

        // **Updated method: Use findByIdAndUpdate**
        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            {
                $set: {
                    name: name || member.name,
                    email: email || member.email,
                    phone: phone || member.phone,
                    age: age || member.age,
                    trainerName: newTrainer ? newTrainer.name : member.trainerName,
                    membership_plan: membership_plan || member.membership_plan,
                    gender: gender || member.gender
                }
            },
            { new: true } // Return the updated document
        );

        // Update new trainer's assigned member count
        if (newTrainer) {
            newTrainer.assignedMembers = await Member.countDocuments({ trainerName: newTrainer.name });
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
            trainerName: newTrainer ? newTrainer.name : null,
            password: hashedPassword,
            membership_plan,
            gender
        });

        await newMember.save();

        if (newTrainer) {
            newTrainer.assignedMembers = await Member.countDocuments({ trainerName: newTrainer.name });
            await newTrainer.save();
        }

        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        res.status(500).json({ error: 'Error adding member', details: error.message });
    }
};

// Delete member and update trainer's assigned members count
const deleteMember = async (req, res) => {
    try {
        const { memberId } = req.params;

        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        // If member has an assigned trainer, update the trainer's assigned member count
        if (member.trainerName) {
            const trainer = await Trainer.findOne({ name: member.trainerName });
            if (trainer) {
                trainer.assignedMembers = Math.max(0, trainer.assignedMembers - 1);
                await trainer.save();
            }
        }

        await Member.findByIdAndDelete(memberId);

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting member', details: error.message });
    }
};

// Forgot Password - Send reset instruction email to admin
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email matches the admin email from the Admin model
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // You can store the reset token in a database or session here for verification later

        // Construct the reset password link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Send reset password email to admin
        await sendMail(email, 'Admin Password Reset Request', `Click the link to reset your password: ${resetLink}`);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending password reset email', details: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Check if the email exists in the Admin model
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // If newPassword is not provided, return an error
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin password in the database
        admin.password = hashedPassword;
        await admin.save();

        // Send a confirmation email
        await sendMail(email, 'Your password has been reset', 'Your password has been successfully reset.');

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting password', details: error.message });
    }
};


module.exports = { 
    adminRegister,  // Added admin registration
    adminLogin, 
    getMembers, 
    getMemberById, 
    editMember, 
    addMember, 
    deleteMember,  // Added delete functionality
    forgotPassword, 
    resetPassword 
};
