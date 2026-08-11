const express = require("express");
const router = express.Router();

const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    submitQuiz,
    getAllResults
} = require("../controllers/quizController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Result = require("../models/Result"); 
const Question = require("../models/Question"); // 👈 Ensure Question model is imported to populate questions

// ==========================
// Create Quiz (Admin Only)
// ==========================
router.post("/", verifyToken, adminMiddleware, createQuiz);

// ==========================
// View All Quizzes (Standard & Alias)
// ==========================
router.get("/", verifyToken, getAllQuizzes);
router.get("/quizzes", verifyToken, getAllQuizzes);

// ==========================
// View All Results (Admin Only)
// ==========================
router.get("/results", verifyToken, adminMiddleware, getAllResults);

// ==========================
// View Student's Own Results (For Student Dashboard & History)
// ==========================
router.get("/my-results", verifyToken, async (req, res) => {
    try {
        const studentId = req.user.id;
        
        const results = await Result.find({
            $or: [
                { student: studentId },
                { userId: studentId }
            ]
        })
        .sort({ submittedAt: -1, createdAt: -1 })
        .populate("quiz", "title totalMarks");

        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("Fetch student results error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching results",
            errorCode: "RESULT_HISTORY_FETCH_FAILED"
        });
    }
});

// ==========================
// View Single Quiz By ID (FIXED to include questions array)
// ==========================
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const Quiz = require("../models/Quiz");
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
                errorCode: "QUIZ_NOT_FOUND"
            });
        }

        // New quizzes store questions in the Question collection. Older quizzes
        // may still contain them embedded in the quiz document.
        let questions = await Question.find({
            $or: [
                { quiz: req.params.id },
                { quizId: req.params.id },
                { quiz_id: req.params.id },
                { quizID: req.params.id }
            ]
        }).lean();
        if (questions.length === 0 && Array.isArray(quiz.questions)) {
            questions = quiz.questions.map((question) => ({
                _id: question._id,
                question: question.question || question.questionText || question.title,
                options: question.options || [],
                correctAnswer: question.correctAnswer ?? question.correctOption ?? question.answer,
                marks: question.marks || 1
            }));
        }
        questions = questions.map((question) => ({
            ...question,
            question: question.question || question.questionText || question.title || question.text,
            options: question.options || question.choices || [],
            correctAnswer: question.correctAnswer
                ?? question.correctOption
                ?? question.answer
                ?? question.correct,
            marks: question.marks || 1
        }));

        res.status(200).json({
            success: true,
            quiz: {
                ...quiz.toObject(),
                questions // 👈 Attaches questions to the quiz object response
            }
        });
    } catch (error) {
        console.error("Error fetching single quiz:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching quiz",
            errorCode: "QUIZ_FETCH_FAILED"
        });
    }
});

// Quiz Submission Route (Handles security & manual submits)
router.post("/:id/submit", verifyToken, submitQuiz);

module.exports = router;