import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Members = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();  // Initialize navigate function
  
  // Fetch member data
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("API Fetch Error:", error);
      alert("Failed to fetch members.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);  // Refetch data every time the page is loaded

  return (
    <div>
      <h1>Members List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Trainer</th>
            <th>Membership Plan</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.age}</td>
              <td>{member.trainerName || "No Trainer"}</td>
              <td>{member.membershipPlan}</td>
              <td>{member.gender}</td>
              <td>
                <button onClick={() => navigate(`/editMember/${member._id}`)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
