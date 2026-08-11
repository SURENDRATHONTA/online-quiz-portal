const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/analyticsController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", verifyToken, adminMiddleware, getAdminStats);

module.exports = router;