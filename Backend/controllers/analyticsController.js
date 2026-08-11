const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

const getAdminStats = async (req, res) => {
    try {
        console.log("Fetching admin analytics stats...");
        
        const totalStudents = await User.countDocuments({ role: "student" }).catch(() => 0);
        const totalQuizzes = await Quiz.countDocuments({}).catch(() => 0);
        const allResults = await Result.find({}).catch(() => []);
        
        const totalAttempts = allResults ? allResults.length : 0;

        let totalScorePercentage = 0;
        if (totalAttempts > 0) {
            allResults.forEach(r => {
                const maxMarks = r.totalMarks || 1;
                const score = r.score || 0;
                const percentage = r.percentage || ((score / maxMarks) * 100);
                totalScorePercentage += percentage;
            });
        }
        
        const averageScore = totalAttempts > 0 ? (totalScorePercentage / totalAttempts).toFixed(1) : 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalStudents: totalStudents || 0,
                totalQuizzes: totalQuizzes || 0,
                totalAttempts,
                averageScore
            }
        });

    } catch (error) {
        console.error("❌ CRITICAL ANALYTICS ERROR:", error.message);
        console.error(error.stack);
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        });
    }
};

module.exports = {
    getAdminStats
};