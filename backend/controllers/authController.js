const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Function to generate JWT Token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, password, department, accessLevel } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            password: hashedPassword,
            department: department || null, // Allow null value
            accessLevel: accessLevel || "admin", // Default to "admin"
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = createToken(user._id);

        // Send response with user details
        res.json({
            user: {
                id: user._id,
                name: user.name,
                department: user.department || null, // Ensure it can be null
                accessLevel: user.accessLevel,
            },
            token,
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
