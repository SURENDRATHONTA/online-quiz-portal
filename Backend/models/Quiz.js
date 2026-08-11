const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    timeLimit: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Add the questions array schema here
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            answer: { type: String, required: true },
            marks: { type: Number, default: 1, min: 1 }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Quiz", quizSchema);