require('dotenv').config(); // Load .env variables first
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error;
    process.exit(1); // Stop the server if JWT secret is missing
}

// Function to generate a unique Membership ID
const generateMembershipID = async () => {
    let membershipID;
    let isUnique = false;

    while (!isUnique) {
        membershipID = `GYM-${Math.floor(100000 + Math.random() * 900000)}`;
        const existingMember = await Member.findOne({ membershipID });
        if (!existingMember) {
            isUnique = true; // Ensure ID is unique before assigning
        }
    }

    return membershipID;
};

// Handle OTPless Authentication Response
const handleOTPlessLogin = async (req, res) => {
    const { email } = req.body; // OTPless sends email after OTP verification

    try {
        // Check if the user already exists
        let user = await Member.findOne({ email });

        if (!user) {
            // New user → Redirect to registration page
            return res.status(200).json({ message: "New user, redirect to registration", newUser: true, email });
        }

        // Existing user → Generate JWT token & redirect to home page
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Login Successful", token, user });

    } catch (error) {
        res.status(500).json({ error: "Authentication failed", details: error.message });
    }
};

// Register New User and Auto-Login
const registerUser = async (req, res) => {
    const { name, email, phone, age, trainerName, gender, address} = req.body;

    try {
        // Check if user already exists
        let existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already registered" });
        }

        // Generate unique membership ID
        const membershipID = await generateMembershipID();

        // Create new user in MongoDB
        const newUser = new Member({ 
            name,
            address, 
            email, 
            phone, 
            age, 
            trainerName, 
            membership_plan, 
            gender,
            membershipID 
        });
        await newUser.save();

        // Auto-login: Generate JWT token after successful registration
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Registration successful, auto-logged in", token, user: newUser });

    } catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
};

module.exports = { handleOTPlessLogin, registerUser };
