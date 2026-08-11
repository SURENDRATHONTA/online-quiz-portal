const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
{
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },

    question: {
        type: String,
        required: true,
        trim: true
    },

    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length === 4;
            },
            message: "A question must have exactly 4 options."
        }
    },

    correctAnswer: {
        type: String,
        required: true
    },

    marks: {
        type: Number,
        default: 1
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);