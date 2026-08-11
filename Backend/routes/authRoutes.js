const express = require("express");
const router = express.Router();
const { register, verifyOTP, login, sendOTP } = require("../controllers/authController");

// Ensure this line is present
router.post("/send-otp", sendOTP);

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

module.exports = router;