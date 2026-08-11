const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: false
    },
    quizTitle: {
        type: String,
        default: "General Knowledge / MERN"
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        default: 3
    },
    totalMarks: {
        type: Number,
        default: 3
    },
    percentage: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Pass", "Fail"]
    },
    answers: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Result", resultSchema);