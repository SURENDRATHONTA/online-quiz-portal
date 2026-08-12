const Result = require("../models/Result");
const User = require("../models/user");
const Quiz = require("../models/Quiz");

// ==========================
// Save Quiz Result
// ==========================
const saveResult = async (req, res) => {
    try {
        const { userId, quizTitle, score, totalQuestions } = req.body;
        
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        const newResult = new Result({
            userId: userId,
            student: userId, // Mapping both for compatibility
            quizTitle: quizTitle || "General Knowledge / MERN",
            score,
            totalQuestions,
            totalMarks: totalQuestions,
            percentage
        });

        await newResult.save();
        res.status(201).json({ success: true, message: "Result saved successfully" });
    } catch (error) {
        console.error("Save Result Error:", error);
        res.status(500).json({ success: false, message: "Server error while saving result" });
    }
};

// ==========================
// Get Results for a User
// ==========================
const getUserResults = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const results = await Result.find({ 
            $or: [{ userId: userId }, { student: userId }] 
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("Fetch Results Error:", error);
        res.status(500).json({ success: false, message: "Server error while fetching results" });
    }
};

// ==========================
// Get All Results for Admin Dashboard
// ==========================
const getAdminResults = async (req, res) => {
    try {
        const results = await Result.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Safely populate student and quiz details to protect against schema mismatches
        const populatedResults = await Promise.all(results.map(async (result) => {
            let studentData = null;
            let quizData = null;

            try {
                if (result.student || result.userId) {
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

        res.status(200).json({ success: true, results: populatedResults });
    } catch (error) {
        console.error("Get Admin Results Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching admin results" });
    }
};

module.exports = { 
    saveResult, 
    getUserResults,
    getAdminResults 
};