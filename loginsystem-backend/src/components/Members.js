import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const Members = () => {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/members", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching members:", error.response?.data?.error || error.message);
            }
        };
        fetchMembers();
    }, [token]);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Members List</h2>
            <button 
                onClick={() => navigate("/add-member")} 
                style={{ padding: "10px 15px", marginBottom: "20px", cursor: "pointer" }}
            >
                Add Member
            </button>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {members.map((member) => (
                    <li key={member._id} style={{ marginBottom: "10px" }}>
                        {member.name} - {member.email}
                        <button 
                            onClick={() => navigate(`/edit-member/${member._id}`)} 
                            style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Members;
