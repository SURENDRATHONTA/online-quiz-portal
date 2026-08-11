const express = require("express");

const router = express.Router();

const {
    getAvailableQuizzes,
    getStudentResults
} = require("../controllers/studentController");

const verifyToken = require("../middleware/authMiddleware");

// ==========================
// View Available Quizzes
// ==========================
router.get(
    "/quizzes",
    verifyToken,
    getAvailableQuizzes
);

// ==========================
// View Student Results
// ==========================
router.get(
    "/results",
    verifyToken,
    getStudentResults
);

module.exports = router;