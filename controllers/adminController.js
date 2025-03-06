const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// Admin login logic
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password match the values in .env
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
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

// Fetch a single member (for editing)
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

        // Find the member
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: 'Member not found' });

        // If trainer is being updated, update the assigned members count
        let newTrainer = null;
        if (trainerName) {
            newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });

            // If the member already has a trainer, update the previous trainer's assigned member count
            if (member.trainer && member.trainer !== newTrainer.name) {
                const previousTrainer = await Trainer.findOne({ name: member.trainer });
                if (previousTrainer) {
                    previousTrainer.assignedMembers = Math.max(0, previousTrainer.assignedMembers - 1);
                    await previousTrainer.save();
                }
            }
        }

        // Update member details
        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            { name, email, phone, age, trainer: newTrainer ? newTrainer.name : member.trainer },
            { new: true } // Ensures the updated document is returned
        );

        // Update new trainer's assigned members count
        if (newTrainer) {
            newTrainer.assignedMembers = await Member.countDocuments({ trainer: newTrainer.name });
            await newTrainer.save();
        }

        res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        res.status(500).json({ error: 'Error updating member', details: error.message });
    }
};

const addMember = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body); // Log incoming data

        const { name, email, phone, age, trainerName, password, membership_plan, gender } = req.body; // ✅ Use correct field name

        // Validate required fields
        if (!password || !membership_plan || !gender) {
            return res.status(400).json({ error: 'Password, Membership Plan, and Gender are required.' });
        }

        let newTrainer = null;
        if (trainerName) {
            newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, 'i') });
            if (!newTrainer) return res.status(404).json({ error: 'Trainer not found' });

            if (!newTrainer.availability) return res.status(400).json({ error: 'Trainer is not available' });
        }

        const newMember = new Member({
            name,
            email,
            phone,
            age,
            trainer: newTrainer ? newTrainer.name : null,
            password,
            membership_plan, // ✅ Corrected field name
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


module.exports = { adminLogin, getMembers, getMemberById, editMember, addMember };
