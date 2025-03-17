const Trainer = require('../models/Trainer');

// Function to generate a unique trainerID (e.g., TRN-123456)
const generateTrainerID = () => {
    return `TRN-${Math.floor(100000 + Math.random() * 900000)}`;
};

// Normalize object keys (convert to lowercase & replace spaces with "_")
const normalizeKeys = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const trimmedKey = key.trim();
        const newKey = trimmedKey.toLowerCase().replace(/\s+/g, "_"); // Convert to lowercase & replace spaces with "_"
        newObj[newKey] = obj[key];
    }
    console.log("Normalized Object:", newObj); 
    return newObj;
};


// Add Trainer (Now includes a unique trainerID)
const addTrainer = async (req, res) => {
    try {
        console.log("Raw Request Body:", req.body); 
        const normalizedBody = normalizeKeys(req.body);
        console.log("Normalized Body:", normalizedBody);

        const { trainer_name, specialization, phone_number } = normalizedBody;

        if (!trainer_name) {
            return res.status(400).json({ error: "Trainer name is required" });
        }

        const existingTrainer = await Trainer.findOne({ trainer_name });
        if (existingTrainer) {
            return res.status(400).json({ error: "Trainer with this name already exists" });
        }

        const newTrainer = new Trainer({
            trainerID: generateTrainerID(),
            trainer_name,
            specialization,
            phone_number,
            availability: true,
            assigned_Members: 0
        });

        await newTrainer.save();
        res.status(201).json({ message: "Trainer added successfully!", trainer: newTrainer });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Get all available trainers
const getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find({ availability: true });
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Trainer by ID
const getTrainerById = async (req, res) => {
    try {
        const { trainerID } = req.params;
        const trainer = await Trainer.findOne({ trainerID });

        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.status(200).json(trainer);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Edit Trainer Details
const editTrainer = async (req, res) => {
    try {
        const { trainerID } = req.params;
        const normalizedBody = normalizeKeys(req.body);
        const { trainer_name, specialization, phone_number, availability } = normalizedBody;

        const updatedTrainer = await Trainer.findOneAndUpdate(
            { trainerID }, // Find by trainerID instead of _id
            { trainer_name, specialization, phone_number, availability },
            { new: true }
        );

        if (!updatedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.json({ message: "Trainer details updated successfully!", trainer: updatedTrainer });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Delete Trainer
const deleteTrainer = async (req, res) => {
    try {
        const { trainerID } = req.params;
        const deletedTrainer = await Trainer.findOneAndDelete({ trainerID });

        if (!deletedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.json({ message: "Trainer deleted successfully", trainer: deletedTrainer });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

module.exports = { addTrainer, getTrainers, getTrainerById, editTrainer, deleteTrainer };
