import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditMember = () => {
    const { id: memberId } = useParams();  // Get memberId from URL
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        trainerName: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/members/edit/${memberId}`);
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                    age: response.data.age || "",
                    trainerName: response.data.trainerName || "",
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching member:", error);
                setError("Failed to fetch member details.");
                setLoading(false);
            }
        };

        fetchMember();
    }, [memberId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/api/admin/members/edit/${memberId}`, formData);
            alert("Member updated successfully!");
        } catch (error) {
            console.error("Error updating member:", error);
            setError("Failed to update member details.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Edit Member</h2>
            <form>
                {Object.keys(formData).map((field) => (
                    <input
                        key={field}
                        type={field === "age" ? "number" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        required
                    />
                ))}
                <button type="button" onClick={handleSave}>Save</button>
            </form>
        </div>
    );
};

export default EditMember;
