const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

// Designated Admin Email Check
const ADMIN_EMAIL = "admin@example.com"; // Replace with your exact admin email

// ==========================
// Standalone Send OTP for Registration
// ==========================
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Prevent registration or OTP generation attempts on the admin email
        if (email === ADMIN_EMAIL) {
            return res.status(400).json({ 
                success: false, 
                message: "This email address is reserved for Admin login and cannot be registered as a student." 
            });
        }

        let user = await User.findOne({ email });
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ success: false, message: "Email already registered and verified." });
            }
            // Update existing unverified user's OTP
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            // Create a temporary stub user record so the OTP can map to it
            user = new User({
                name: "Pending",
                email,
                password: "TEMP_PASSWORD_HASH",
                role: "student",
                otp,
                otpExpiry,
                isVerified: false
            });
            await user.save();
        }

        // Dispatch Email
        await sendEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email."
        });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: "Server error while sending OTP" });
    }
};

// ==========================
// Register User (Final Save after OTP verification)
// ==========================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const strongPassword = typeof password === "string"
            && password.length >= 8
            && /[A-Z]/.test(password)
            && /[a-z]/.test(password)
            && /\d/.test(password)
            && /[^A-Za-z0-9]/.test(password);

        if (!strongPassword) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character."
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Please request and verify your OTP first."
            });
        }

        if (user.isVerified && user.password !== "TEMP_PASSWORD_HASH") {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update stub user with actual name, hashed password, and finalize account
        user.name = name;
        user.password = hashedPassword;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Registration successful."
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================
// Verify OTP
// ==========================
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified && user.password !== "TEMP_PASSWORD_HASH") {
            return res.status(400).json({
                success: false,
                message: "User already verified"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.json({
            success: true,
            message: "Email Verified Successfully"
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================
// Login Controller
// ==========================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found with this email." });
        }

        // Check verification for students if applicable
        if (!user.isVerified && user.role !== 'admin') {
            return res.status(400).json({ success: false, message: "Please verify your email first." });
        }

        // Compare submitted password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        // Generate JWT Token with id property
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

// Export all controller functions safely
module.exports = {
    sendOTP,
    register,
    verifyOTP,
    login
};