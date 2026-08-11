const express = require("express");

const router = express.Router();

const {
    addQuestion,
    getQuestionsByQuiz
} = require("../controllers/questionController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================
// Admin Routes
// ==========================

// Add Question (Admin Only)
router.post(
    "/",
    verifyToken,
    adminMiddleware,
    addQuestion
);

// ==========================
// Get Questions of a Quiz
// ==========================

router.get(
    "/:quizId",
    verifyToken,
    getQuestionsByQuiz
);

module.exports = router;