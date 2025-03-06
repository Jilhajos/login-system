import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Directly using axios for API requests

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/login", { email, password });
            localStorage.setItem("token", response.data.token);
            alert("Login Successful!");
            navigate("/dashboard"); // Redirect to Dashboard after login
        } catch (error) {
            alert("Login Failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Admin Login</h2>
            <div style={{ marginTop: "20px" }}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    style={{ padding: "10px", marginBottom: "10px", width: "80%" }}
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    style={{ padding: "10px", marginBottom: "10px", width: "80%" }}
                />
                <button 
                    onClick={handleLogin} 
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
