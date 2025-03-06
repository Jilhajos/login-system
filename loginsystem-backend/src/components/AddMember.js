import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

const AddMember = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        trainerName: '',
        password: '',
        membershipPlan: '',
        gender: 'Male'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                alert('Authorization failed. Please log in.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/admin/members', 
                formData,
                { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            alert('Member added successfully');
            navigate('/members');
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        }
    };

    return (
        <div>
            <h2>Add New Member</h2>
            <form onSubmit={handleAddMember}>
                {Object.keys(formData).map((field) => (
                    field !== 'gender' ? (
                        <input
                            key={field}
                            type={field === 'age' ? 'number' : field === 'password' ? 'password' : 'text'}
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    ) : (
                        <select key={field} name={field} value={formData[field]} onChange={handleChange} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    )
                ))}
                <button type="submit">Add Member</button>
            </form>
        </div>
    );
};

export default AddMember;
