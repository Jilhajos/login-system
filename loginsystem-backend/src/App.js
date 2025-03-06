// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import AddMember from './components/AddMember';
import EditMember from './components/EditMember';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Route for Login */}
                <Route path="/" element={<Login />} />

                {/* Route for Admin Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Route for Members Section */}
                <Route path="/members" element={<Members />} />

                {/* Route to Add a New Member */}
                <Route path="/add-member" element={<AddMember />} />

                {/* Route to Edit Member Details */}
                <Route path="/edit-member/:id" element={<EditMember />} />
            </Routes>
        </Router>
    );
};

export default App;
