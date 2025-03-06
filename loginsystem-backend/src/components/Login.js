import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', credentials);
            localStorage.setItem('adminToken', response.data.token);
            navigate('/dashboard'); 
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    name="email"
                    value={credentials.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    name="password"
                    value={credentials.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
