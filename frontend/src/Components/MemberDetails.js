import React, { useState, useEffect } from "react";
import axios from "axios";

const MemberDetails = ({ member }) => {
    const [trainerName, setTrainerName] = useState(member.trainerName || "");
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/trainers")
            .then((response) => setTrainers(response.data))
            .catch((error) => console.error("Error fetching trainers:", error));
    }, []);

    const updateTrainer = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/admin/assign-trainer/${member._id}`, {
                trainerName
            });

            alert("Trainer updated successfully!");
        } catch (error) {
            console.error("Error updating trainer:", error);
            alert("Failed to update trainer.");
        }
    };

    return (
        <div>
            <h3>Member Details</h3>
            <p><strong>Name:</strong> {member.name}</p>
            <p><strong>Phone:</strong> {member.phone}</p>
            <p><strong>Current Trainer:</strong></p>

            <select value={trainerName} onChange={(e) => setTrainerName(e.target.value)}>
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                    <option key={trainer.name} value={trainer.name}>
                        {trainer.name} ({trainer.specialization})
                    </option>
                ))}
            </select>

            <button onClick={updateTrainer}>Update Trainer</button>
        </div>
    );
};

export default MemberDetails;
