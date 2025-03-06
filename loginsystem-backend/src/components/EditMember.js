import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";  // Directly using axios for API requests

const EditMember = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/members/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error fetching member details:", error);
            }
        };
        fetchMember();
    }, [id, token]);

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/admin/members/${id}`, 
                { name, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Member updated successfully!");
            navigate("/members");
        } catch (error) {
            alert("Update failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Edit Member</h2>
            <div style={{ marginTop: "20px" }}>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Name" 
                    style={{ padding: "10px", marginBottom: "10px", width: "80%" }}
                />
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    style={{ padding: "10px", marginBottom: "10px", width: "80%" }}
                />
                <button 
                    onClick={handleUpdate} 
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                >
                    Update Member
                </button>
            </div>
        </div>
    );
};

export default EditMember;
