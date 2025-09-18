import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp } from "../utils/sendOtp.js";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register Retailer
export const registerRetailer = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      phone,
      password: hashedPassword,
      role: "retailer",
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
    });

    await user.save();
    await sendOtp(phone, otp);

    res.status(201).json({ message: "OTP sent to phone. Verify to complete registration." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register Distributor
export const registerDistributor = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      phone,
      password: hashedPassword,
      role: "distributor",
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await user.save();
    await sendOtp(phone, otp);

    res.status(201).json({ message: "OTP sent to phone. Verify to complete registration." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({ message: "OTP verified successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ message: "Please verify OTP first" });

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
