import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      try {
        const membersResponse = await axios.get("http://localhost:5000/api/admin/members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const trainersResponse = await axios.get("http://localhost:5000/api/admin/trainers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMembers(membersResponse.data);
        setTrainers(trainersResponse.data);
      } catch (error) {
        console.error("API Fetch Error:", error);
        alert("Failed to fetch members/trainers.");
      }
    };

    fetchData();
  }, []);

  const handleUpdateTrainer = async (memberId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/assign-trainer/${memberId}`,
        { trainerName: selectedTrainer },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Trainer updated successfully!");
      setEditingMemberId(null);

      // Refresh data
      const updatedMembers = members.map((member) =>
        member._id === memberId ? { ...member, trainerName: selectedTrainer } : member
      );
      setMembers(updatedMembers);
    } catch (error) {
      console.error("Error updating trainer:", error);
      alert("Failed to update trainer.");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Members Table */}
      <h3>Members List</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Emergency Contact</th>
            <th>Health Conditions</th>
            <th>Membership Plan</th>
            <th>Trainer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.age}</td>
              <td>{member.gender}</td>
              <td>{member.phone}</td>
              <td>{member.email}</td>
              <td>{member.address}</td>
              <td>{member.emergency_contact}</td>
              <td>{member.health_conditions}</td>
              <td>{member.membership_plan}</td>
              <td>
                {editingMemberId === member._id ? (
                  <select value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
                    <option value="">Select Trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer._id} value={trainer.name}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  member.trainerName || "No Trainer Assigned"
                )}
              </td>
              <td>
                {editingMemberId === member._id ? (
                  <button onClick={() => handleUpdateTrainer(member._id)}>Save</button>
                ) : (
                  <button onClick={() => setEditingMemberId(member._id)}>Edit Trainer</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Trainers Table */}
      <h3>Trainers List</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Trainer ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Specialization</th>
            <th>Assigned Members</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer._id}>
              <td>{trainer._id}</td>
              <td>{trainer.name}</td>
              <td>{trainer.phone}</td>
              <td>{trainer.specialization}</td>
              <td>{trainer.assignedMembers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
