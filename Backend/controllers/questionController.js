const Question = require("../models/Question");

// ==========================
// Add Question
// ==========================
const addQuestion = async (req, res) => {
    try {

        const {
            quiz,
            question,
            options,
            correctAnswer,
            marks
        } = req.body;

        // Check if exactly 4 options are provided
        if (!options || options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Exactly 4 options are required."
            });
        }

        const newQuestion = new Question({
            quiz,
            question,
            options,
            correctAnswer,
            marks
        });

        await newQuestion.save();

        res.status(201).json({
            success: true,
            message: "Question added successfully.",
            question: newQuestion
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
// Get Questions by Quiz
// ==========================
const getQuestionsByQuiz = async (req, res) => {

    try {
        let questions = await Question.find({
            $or: [
                { quiz: req.params.quizId },
                { quizId: req.params.quizId },
                { quiz_id: req.params.quizId },
                { quizID: req.params.quizId }
            ]
        }).lean();

        if (questions.length === 0) {
            const Quiz = require("../models/Quiz");
            const quiz = await Quiz.findById(req.params.quizId).lean();
            questions = (quiz?.questions || []).map((question) => ({
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

        res.json({
            success: true,
            questions,
            errorCode: questions.length === 0 ? "QUIZ_QUESTIONS_EMPTY" : null
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
            errorCode: "QUESTIONS_FETCH_FAILED"
        });

    }

};

module.exports = {
    addQuestion,
    getQuestionsByQuiz
};