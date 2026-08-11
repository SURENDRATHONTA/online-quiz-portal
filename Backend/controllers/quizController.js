const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const Question = require("../models/Question");

// ==========================
// Create Quiz (With Questions Support)
// ==========================
const createQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            timeLimit,
            totalMarks,
            questions
        } = req.body;

        const normalizedQuestions = (questions || []).map((q) => ({
            question: q.question || q.questionText || q.title,
            options: q.options,
            correctAnswer: q.correctAnswer ?? q.correctOption ?? q.answer,
            marks: Number(q.marks) > 0 ? Number(q.marks) : 1
        }));

        const invalidQuestion = normalizedQuestions.find(
            (q) =>
                !q.question ||
                !Array.isArray(q.options) ||
                q.options.length !== 4 ||
                !q.options.every((option) => option) ||
                !q.correctAnswer
        );

        if (invalidQuestion) {
            return res.status(400).json({
                success: false,
                message: "Each question must include text, exactly 4 options, and a correct answer."
            });
        }

        const quiz = new Quiz({
            title,
            description,
            timeLimit,
            totalMarks: normalizedQuestions.reduce((sum, question) => sum + question.marks, 0),
            questions: normalizedQuestions.map((question) => ({
                questionText: question.question,
                options: question.options,
                answer: question.correctAnswer,
                marks: question.marks
            })),
            createdBy: req.user.id
        });

        await quiz.save();

        // If questions are provided inline, save them to the separate Question collection as well
        if (normalizedQuestions.length > 0) {
            const questionDocs = normalizedQuestions.map(q => ({
                quiz: quiz._id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                marks: q.marks
            }));
            await Question.insertMany(questionDocs);
        }

        res.status(201).json({
            success: true,
            message: "Quiz and questions created successfully",
            quiz,
            questionCount: normalizedQuestions.length,
            totalMarks: normalizedQuestions.reduce((sum, question) => sum + question.marks, 0)
        });

    } catch (error) {
        console.error("Create Quiz Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================
// Get All Quizzes
// ==========================
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({})
            .populate("createdBy", "name email");
        const quizIds = quizzes.map((quiz) => quiz._id);
        const storedQuestions = await Question.collection.find({
            $or: [
                { quiz: { $in: quizIds } },
                { quiz: { $in: quizIds.map((id) => id.toString()) } },
                { quizId: { $in: quizIds } },
                { quizId: { $in: quizIds.map((id) => id.toString()) } },
                { quiz_id: { $in: quizIds } },
                { quiz_id: { $in: quizIds.map((id) => id.toString()) } },
                { quizID: { $in: quizIds } },
                { quizID: { $in: quizIds.map((id) => id.toString()) } }
            ]
        }).toArray();

        res.status(200).json({
            success: true,
            quizzes: quizzes.map((quiz) => {
                const questions = storedQuestions.filter(
                    (question) => [
                        question.quiz,
                        question.quizId,
                        question.quiz_id,
                        question.quizID
                    ].some((quizReference) => quizReference && quizReference.toString() === quiz._id.toString())
                );

                return {
                    ...quiz.toObject(),
                    questions: questions.length > 0
                        ? questions
                        : (quiz.questions || []).map((question) => ({
                            _id: question._id,
                            question: question.question || question.questionText || question.title,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer ?? question.correctOption ?? question.answer,
                            marks: question.marks || 1
                        }))
                };
            })
        });

    } catch (error) {
        console.error("Get Quizzes Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================
// Get Quiz By ID (Fetches from separate Question collection)
// ==========================
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).lean();
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        // Explicitly fetch questions linked to this quiz from the Question model collection
        const questions = await Question.find({ quiz: req.params.id }).lean();

        res.status(200).json({
            success: true,
            quiz: {
                ...quiz,
                questions // 👈 Attaches the full list so frontend components can render them
            }
        });

    } catch (error) {
        console.error("Get Quiz By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        });
    }
};

// ==========================
// Submit Quiz (Fully Corrected Grading Logic)
// ==========================
const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        let studentId = req.user ? req.user.id : null;
        const { answers, token } = req.body; 

        // Fallback for beacon requests where auth headers are missing
        if (!studentId && token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
                studentId = decoded.id;
            } catch (e) {
                console.error("Beacon token decode error:", e);
            }
        }

        if (!studentId) {
            return res.status(401).json({ success: false, message: "Unauthorized student session" });
        }

        const quiz = await Quiz.findById(quizId).lean();
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        // Fetch questions from the normalized collection, with a fallback for
        // quizzes created using the original embedded-question schema.
        let questions = await Question.find({
            $or: [
                { quiz: quizId },
                { quizId },
                { quiz_id: quizId },
                { quizID: quizId }
            ]
        }).lean();
        if (questions.length === 0 && Array.isArray(quiz.questions)) {
            questions = quiz.questions.map((question) => ({
                _id: question._id,
                question: question.question || question.questionText || question.title || question.text,
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
            marks: Number(question.marks) > 0 ? Number(question.marks) : 1
        }));

        let score = 0;
        let totalMarks = questions.reduce((total, question) => total + (question.marks || 1), 0);
        let answerDetails = [];
        const submittedAnswers = Array.isArray(answers)
            ? answers.reduce((lookup, answer) => {
                lookup[String(answer.questionId)] = answer.selectedOption;
                return lookup;
            }, {})
            : (answers && typeof answers === "object" ? answers : {});

        questions.forEach((q, index) => {
            const qIdStr = q._id.toString();
            const studentAns = submittedAnswers[qIdStr] !== undefined
                ? submittedAnswers[qIdStr]
                : submittedAnswers[index];

            if (studentAns !== undefined && studentAns !== null) {
                const studentChoiceStr = String(studentAns).trim().toLowerCase();
                const correctVal = q.correctAnswer !== undefined ? q.correctAnswer : q.correctOption;
                const correctValStr = String(correctVal ?? "").trim().toLowerCase();

                let isCorrect = false;

                // Condition 1: Direct text match
                if (studentChoiceStr === correctValStr) {
                    isCorrect = true;
                } 
                // Condition 2: Index-based match
                else {
                    const optionIndex = q.options ? q.options.findIndex(opt => String(opt).trim().toLowerCase() === studentChoiceStr) : -1;
                    const correctIndex = Number.parseInt(correctValStr, 10);
                    const correctLetter = correctValStr.length === 1
                        ? correctValStr.charCodeAt(0) - "a".charCodeAt(0)
                        : -1;
                    if (
                        optionIndex !== -1 &&
                        (optionIndex === correctIndex ||
                            optionIndex + 1 === correctIndex ||
                            optionIndex === correctLetter)
                    ) {
                        isCorrect = true;
                    } else if (String(studentAns) === String(correctVal)) {
                        isCorrect = true;
                    }
                }

                if (isCorrect) {
                    score += q.marks || 1;
                }

                answerDetails.push({
                    questionId: qIdStr,
                    question: q.question || q.questionText || q.title || "",
                    selectedOption: studentAns,
                    correctAnswer: correctVal,
                    isCorrect
                });
            }
        });

        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
        // Status is evaluated neutrally or omitted since you requested exact marks representation
        const status = percentage >= 50 ? "Pass" : "Fail";

        const newResult = new Result({
            student: studentId,
            quiz: quizId,
            quizTitle: quiz.title,
            score,
            totalMarks,
            totalQuestions: questions.length,
            percentage,
            status,
            answers: answerDetails,
            submittedAt: new Date()
        });

        await newResult.save();

        res.status(200).json({
            success: true,
            message: "Quiz submitted successfully.",
            score,
            totalMarks,
            percentage,
            status,
            resultId: newResult._id
        });

    } catch (error) {
        console.error("Submit Quiz Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
            errorCode: "QUIZ_SUBMISSION_FAILED"
        });
    }
};

// ==========================
// Get All Results (Admin) - Bulletproof Version
// ==========================
const getAllResults = async (req, res) => {
    try {
        const results = await Result.find({}).sort({ submittedAt: -1, createdAt: -1 }).lean();

        const populatedResults = await Promise.all(results.map(async (result) => {
            let studentData = null;
            let quizData = null;

            try {
                if (result.student || result.userId) {
                    const User = require("../models/User");
                    studentData = await User.findById(result.student || result.userId).select("name email").lean();
                }
            } catch (e) { /* ignore lookup errors */ }

            try {
                if (result.quiz) {
                    quizData = await Quiz.findById(result.quiz).select("title").lean();
                }
            } catch (e) { /* ignore lookup errors */ }

            return {
                ...result,
                student: studentData || { name: "Unknown Student", email: "N/A" },
                quiz: quizData || { title: result.quizTitle || "Online Quiz" }
            };
        }));

        res.status(200).json({
            success: true,
            results: populatedResults
        });

    } catch (error) {
        console.error("Get Results Detailed Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        });
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    submitQuiz,
    getAllResults
};