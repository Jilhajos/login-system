const Trainer = require('../models/Trainer');

const addTrainer = async (req, res) => {
    try {
        const { name, specialization,phone } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Trainer name is required" });
        }
        const existingTrainer = await Trainer.findOne({ name });
        if (existingTrainer) {
            return res.status(400).json({ error: "Trainer with this name already exists" });
        }
        const newTrainer = new Trainer({
            name,
            specialization,
            phone,
            availability: true,
            assignedMembers: 0
        });

        await newTrainer.save();
        res.status(201).json({ message: "Trainer added successfully!", trainer: newTrainer });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

const getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find({ availability: true });
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTrainer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTrainer = await Trainer.findByIdAndDelete(id);
        if (!deletedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.json({ message: "Trainer deleted successfully", trainer: deletedTrainer });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

module.exports = { addTrainer, getTrainers, deleteTrainer };
