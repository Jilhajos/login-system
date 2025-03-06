import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios

const AddMember = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const token = localStorage.getItem("token"); // Get the stored token
    const navigate = useNavigate();

    const handleAddMember = async () => {
        try {
            await axios.post("http://localhost:5000/api/admin/members", 
                { name, email }, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert("Member added successfully!");
            navigate("/members"); // Redirect to members page
        } catch (error) {
            alert("Error adding member: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Add Member</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button onClick={handleAddMember}>Save</button>
        </div>
    );
};

export default AddMember;
