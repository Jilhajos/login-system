require('dotenv').config();
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is missing from .env file");
    process.exit(1);
}

const normalizeKeys = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = key.toLowerCase().replace(/\s+/g, "_");
        newObj[newKey] = obj[key];
    }
    return newObj;
};

const generateMembershipID = async () => {
    let membershipID;
    let isUnique = false;

    while (!isUnique) {
        membershipID = `GYM${Math.floor(100000 + Math.random() * 900000)}`;
        const existingMember = await Member.findOne({ membershipID });
        if (!existingMember) {
            isUnique = true; 
        }
    }

    return membershipID;
};

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    console.log("Received Authorization Header:", authHeader); 

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Decoded Token:", decoded); 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await Member.findById(req.user.id).select("-password"); 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
    }
};

// Handle OTPless Authentication Response
const handleOTPlessLogin = async (req, res) => {
    const normalizedBody = normalizeKeys(req.body);
    const { email } = normalizedBody; // OTPless sends email after OTP verification

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
        console.error("Authentication Error:", error.message);
        res.status(500).json({ error: "Authentication failed", details: error.message });
    }
};

// Register New User and Auto-Login
const registerUser = async (req, res) => {
    const normalizedBody = normalizeKeys(req.body);
    const { full_name, email, phone_number, age, gender, trainer_name, address, emergency_contact, health_condition, pincode } = normalizedBody;

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
            full_name,
            email,
            phone_number,
            age,
            gender,
            emergency_contact,
            health_condition,
            pincode,
            trainer_name,
            address,
            membershipID,
            amount_Paid: 0, // Default
            payment_status: 'pending', // Default
            membership_status: 'Inactive', // Default
            payment_date: null,
            renewal_date: null
        });

        await newUser.save();

        // Auto-login: Generate JWT token after successful registration
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Registration successful, auto-logged in", token, user: newUser });

    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
};

module.exports = { handleOTPlessLogin, registerUser, getUserProfile, verifyToken };
