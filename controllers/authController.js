const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

const registerMember = async (req, res) => {
    try {
        const { name, age, gender, phone, email, address, emergency_contact, health_conditions, membership_plan, trainerName, password } = req.body;

        if (!name || !age || !phone || !membership_plan || !email || !password || !trainerName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existingMember = await Member.findOne({ $or: [{ email }, { phone }] });
        if (existingMember) {
            return res.status(400).json({ error: "Email or phone already in use" });
        }
        const trainer = await Trainer.findOne({ name: trainerName });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }
        if (!trainer.availability) {
            return res.status(400).json({ error: "Trainer is fully booked. Please choose another trainer." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newMember = new Member({
            name,
            age,
            gender,
            phone,
            email,
            address,
            emergency_contact,
            health_conditions,
            membership_plan,
            trainerName,
            password: hashedPassword
        });
        await newMember.save();
        const updatedTrainer = await Trainer.findOneAndUpdate(
            { name: trainerName },
            { $inc: { assignedMembers: 1 } },
            { new: true }
        );
        if (updatedTrainer.assignedMembers >= 5) {
            await Trainer.findOneAndUpdate({ name: trainerName }, { availability: false });
        }
        res.status(201).json({ message: "Member registered successfully!", member: newMember });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
const loginMember = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: member._id, email: member.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login successful", token, memberId: member._id });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
const getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerMember, loginMember, getMembers };