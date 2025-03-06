// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <nav>
                <Link to="/members">View Members</Link>
            </nav>
        </div>
    );
};

export default Dashboard;
