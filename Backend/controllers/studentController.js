const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

// ==========================
// Get Available Quizzes
// ==========================
const getAvailableQuizzes = async (req, res) => {

    try {

        const quizzes = await Quiz.find(
            { isActive: true },
            {
                title: 1,
                description: 1,
                timeLimit: 1,
                totalMarks: 1
            }
        );

        res.status(200).json({
            success: true,
            quizzes
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ==========================
// Get Student Results
// ==========================
const getStudentResults = async (req, res) => {

    try {

        const results = await Result.find({
            student: req.user.id
        })
        .populate("quiz", "title")
        .populate("answers.question", "question");

        res.status(200).json({
            success: true,
            results
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {
    getAvailableQuizzes,
    getStudentResults
};