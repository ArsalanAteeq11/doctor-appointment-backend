import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js";
dotenv.config();

// Generate a JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Setup Nodemailer to send OTP via email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Use email from environment variables
    pass: process.env.EMAIL_PASS, // Use app password from environment variables
  },
  tls: {
    rejectUnauthorized: false, // Bypass self-signed certificate check
  },
});

// User Registration
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.json({ message: "All fields are required", success: false });
    }

    // Check if the email is already registered
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.json({
        message: "User already exists!",
        success: false,
      });
    }

    // Hash password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Create new user with OTP and expiration time (15 mins from now)
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      role,
      otp: otp,
      otpExpires: Date.now() + 15 * 60 * 1000, // OTP expires in 15 minutes
    });
    await newUser.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL, // Use email from environment variables
      to: email,
      subject: "OTP Verification",
      text: `Your OTP code is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "OTP sent to your email. Please verify your account.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// OTP Verification
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.json({ message: "All fields are required", success: false });
    }

    // Find user by email and check if OTP matches and is not expired
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // Check if OTP has not expired
    });

    if (!user) {
      return res.json({ message: "Invalid or expired OTP", success: false });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    user.otpExpires = undefined; // Clear expiration
    await user.save();

    const token = createToken(user._id);

    res.json({
      message: "Account verified successfully!",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required", success: false });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Invalid email or password", success: false });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.json({
        message: "Please verify your account first",
        success: false,
      });
    }

    // Check if the password matches
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid email or password", success: false });
    }

    // Generate and return JWT token
    const token = createToken(user._id);
    return res.json({
      success: true,
      token,
      message: `${user.username} logged in successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.json({ message: "No users found", success: false });
    }
    res.json({ users, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    if (!doctors) {
      return res.json({ message: "No doctors found", success: false });
    }
    res.json({ doctors, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" });
    if (!patients) {
      return res.json({ message: "No patients found", success: false });
    }
    res.json({ patients, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }
    res.json({ user, success: true });
  } catch (error) {
    console.log(error);
  }
};