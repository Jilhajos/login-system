const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Admin = require('../models/Admin');

// ✅ Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// ✅ Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", token, adminId: admin._id });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// ✅ Fetch Members
const getMembers = async (req, res) => {
    try {
        const members = await Member.find().select("-password");
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: "Error fetching members", details: error.message });
    }
};

// ✅ Fetch Trainers
const getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching trainers", details: error.message });
    }
};

// ✅ Assign Trainer to a Member
//const assignTrainer = async (req, res) => {
    //try {
        //const { trainerName } = req.body;
        //const { memberId } = req.params;

        //const trainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, "i") });
        //if (!trainer) return res.status(404).json({ error: "Trainer not found" });

        //if (!trainer.availability) return res.status(400).json({ error: "Trainer is not available" });

        //const member = await Member.findById(memberId);
        //if (!member) return res.status(404).json({ error: "Member not found" });

        //member.trainer = trainer.name;
        //await member.save();

        //trainer.assignedMembers += 1;
        //await trainer.save();

        //res.status(200).json({ message: "Trainer assigned successfully", member });
    //} catch (error) {
       // res.status(500).json({ error: "Server error", details: error.message });
    //}
//};
const assignTrainer = async (req, res) => {
    try {
        const { trainerName } = req.body;
        const { memberId } = req.params;

        // Find the requested trainer
        const newTrainer = await Trainer.findOne({ name: new RegExp(`^${trainerName}$`, "i") });
        if (!newTrainer) return res.status(404).json({ error: "Trainer not found" });

        if (!newTrainer.availability) return res.status(400).json({ error: "Trainer is not available" });

        // Find the member
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ error: "Member not found" });

        // Check if the member already has a trainer
        if (member.trainer && member.trainer !== newTrainer.name) {
            // Find previous trainer
            const previousTrainer = await Trainer.findOne({ name: member.trainer });
            if (previousTrainer) {
                // Decrement previous trainer's assigned members count
                previousTrainer.assignedMembers = Math.max(0, previousTrainer.assignedMembers - 1);
                await previousTrainer.save();
            }
        }

        // ✅ Update trainer name and return updated member
        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            { trainer: newTrainer.name },
            { new: true } // Ensures we return the updated document
        );

        // ✅ Update new trainer's assigned members count
        newTrainer.assignedMembers = await Member.countDocuments({ trainer: newTrainer.name });
        await newTrainer.save();

        res.status(200).json({ message: "Trainer assigned successfully", member: updatedMember });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};




module.exports = { registerAdmin, loginAdmin, getMembers, getTrainers, assignTrainer };
