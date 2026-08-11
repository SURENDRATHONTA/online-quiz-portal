const express = require("express");
const router = express.Router();
const { saveResult, getUserResults, getAdminResults } = require("../controllers/resultController");
const verifyToken = require("../middleware/authMiddleware");

// ==========================
// Save Quiz Score
// ==========================
router.post("/save", verifyToken, saveResult);

// ==========================
// Fetch All Results for Admin Dashboard
// ==========================
router.get("/", verifyToken, getAdminResults); // 👈 Add this route for the admin dashboard

// ==========================
// Fetch Past Results for Specific User
// ==========================
router.get("/user/:userId", verifyToken, getUserResults);

module.exports = router;