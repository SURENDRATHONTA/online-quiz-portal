const Question = require("../models/Question");
const Result = require("../models/Result");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");

// ==========================
// Start Quiz
// ==========================
const startQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const questions = await Question.find(
            { quiz: quizId },
            {
                correctAnswer: 0,
                marks: 0,
                __v: 0
            }
        );

        res.status(200).json({
            success: true,
            questions
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
// Submit Quiz (Fully Corrected for Complete Question Sets)
// ==========================
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        // Support questions created by the dashboard, API, or directly in Atlas.
        const quiz = await Quiz.findById(quizId); 
        const quizObjectId = mongoose.Types.ObjectId.isValid(quizId)
            ? new mongoose.Types.ObjectId(quizId)
            : null;
        const questionLinks = [{ quiz: quizId }, { quizId }, { quiz_id: quizId }, { quizID: quizId }];
        if (quizObjectId) {
            questionLinks.push(
                { quiz: quizObjectId },
                { quizId: quizObjectId },
                { quiz_id: quizObjectId },
                { quizID: quizObjectId }
            );
        }
        // Use the native collection so Atlas documents using a legacy link
        // field are not removed by Mongoose strict query rules.
        let questions = await Question.collection.find({ $or: questionLinks }).toArray();
        if (questions.length === 0 && Array.isArray(quiz?.questions)) {
            questions = quiz.questions.map((question) => ({
                _id: question._id,
                question: question.question || question.questionText || question.title || question.text,
                options: question.options || question.choices || [],
                correctAnswer: question.correctAnswer
                    ?? question.correctOption
                    ?? question.answer
                    ?? question.correct,
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

        if (questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "This quiz has no questions assigned.",
                errorCode: "QUIZ_QUESTIONS_EMPTY"
            });
        }

        let score = 0;
        let totalMarks = 0;
        let answerDetails = [];

        // Loop through every single question found in the database for this quiz
        questions.forEach((question) => {
            const qMarks = question.marks || 1;
            totalMarks += qMarks;

            // Find the student's answer matching this question's ID
            const studentAnswer = (Array.isArray(answers) ? answers : []).find(
                (ans, answerIndex) =>
                    String(ans.questionId) === String(question._id) ||
                    answerIndex === questions.indexOf(question)
            );

            const studentChoice = String(studentAnswer?.selectedOption ?? "").trim();
            const correctChoiceVal = question.correctAnswer;
            let isCorrect = false;

            if (studentAnswer) {
                // Dual-Check Evaluation (Text vs Index)
                if (studentChoice.toLowerCase() === String(correctChoiceVal ?? "").trim().toLowerCase()) {
                    isCorrect = true;
                } else {
                    const optionIndex = (question.options || []).findIndex(
                        opt => String(opt).trim().toLowerCase() === studentChoice.toLowerCase()
                    );
                    const correctIndex = Number.parseInt(String(correctChoiceVal), 10);
                    const correctLetter = String(correctChoiceVal).length === 1
                        ? String(correctChoiceVal).toLowerCase().charCodeAt(0) - 97
                        : -1;
                    if (
                        optionIndex !== -1 &&
                        (optionIndex === correctIndex ||
                            optionIndex + 1 === correctIndex ||
                            optionIndex === correctLetter)
                    ) {
                        isCorrect = true;
                    }
                }
            }

            const marksAwarded = isCorrect ? qMarks : 0;
            if (isCorrect) score += qMarks;

            answerDetails.push({
                question: question.question || question.questionText || question.title || "",
                questionId: question._id,
                selectedOption: studentAnswer?.selectedOption ?? null,
                correctAnswer: correctChoiceVal,
                isCorrect,
                marksAwarded
            });
        });

        const percentage =
            totalMarks === 0
                ? 0
                : (score / totalMarks) * 100;

        const result = new Result({
            userId: req.user.id,
            student: req.user.id,
            quiz: quizId,
            quizTitle: quiz?.title || "Online Assessment",
            answers: answerDetails,
            score,
            totalQuestions: questions.length, // Dynamically set to the actual total (e.g., 10)
            totalMarks,
            percentage
        });

        await result.save();

        res.status(200).json({
            success: true,
            message: "Quiz Submitted Successfully",
            result
        });

    } catch (error) {
        console.error("Submit Quiz Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error during submission",
            errorCode: "QUIZ_SUBMISSION_FAILED"
        });
    }
};

module.exports = {
    startQuiz,
    submitQuiz
};