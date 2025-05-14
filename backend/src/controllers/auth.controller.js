import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
     const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }
        // Generate JWT token and send as a cookie
        const token = generateToken(user._id, res);

        // Send success response
        return res.status(200).json({
            message: "Login successful",
            _id: user._id,
            username: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
  try {
    
    res.cookie("jwt", "", { maxAge:0});
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Please provide a profile picture"});
        }

        const UserResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: UserResponse.secure_url} , {new: true});
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const checkauth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkauth controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}