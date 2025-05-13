import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
     
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save the new user
        await newUser.save();

        // Generate JWT token and send as a cookie
        const token = generateToken(newUser._id, res);

        // Send success response
        return res.status(201).json({
            message: "User created successfully",
            _id: newUser._id,
            username: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            token, // Include token in the response
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = (req, res) => {
    res.send("login route");
};

export const logout = (req, res) => {
    res.send("logout route");
};
