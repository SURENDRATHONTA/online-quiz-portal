const dotenv = require("dotenv");

// Load Environment Variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resultRoutes = require("./routes/resultRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Debug (Temporary)
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

// Connect Database
connectDB();

const app = express();

// ==========================
// 🛡️ Fixed CORS Middleware Configuration
// ==========================
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002", 
        "http://localhost:3003",
        "http://localhost:3004"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to Online Quiz Evaluation System");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attempt", attemptRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});