import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import API from "../services/api";

export default function ResultHistory() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const { data } = await API.get("/quizzes/my-results", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(data.success ? data.results || [] : []);
                if (!data.success) {
                    setError(`${data.message || "Failed to load result history."} (${data.errorCode || "RESULT_HISTORY_FETCH_FAILED"})`);
                }
            } catch (requestError) {
                console.error("Error fetching results history:", requestError);
                setError(`${requestError.response?.data?.message || "Failed to load result history."} (${requestError.response?.data?.errorCode || "RESULT_HISTORY_FETCH_FAILED"})`);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [navigate]);

    if (loading) {
        return <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>Loading results history...</div>;
    }

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
            <StudentNavbar />
            <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
                <h2 style={{ color: "#1e293b" }}>Your Result History</h2>
                {error && <p style={{ color: "#dc2626", background: "#fee2e2", padding: "10px" }}>{error}</p>}
                {results.length === 0 ? (
                    <p style={{ background: "#fff", padding: "25px", textAlign: "center", color: "#64748b" }}>
                        No exam attempts recorded yet.
                    </p>
                ) : (
                    <div style={{ display: "grid", gap: "20px" }}>
                        {results.map((result, index) => {
                            const totalQuestions = result.totalQuestions || result.answers?.length || 0;
                            const totalMarks = result.totalMarks || totalQuestions;
                            const calculatedScore = result.answers?.reduce(
                                (total, answer) => total + (Number(answer.marksAwarded) || (answer.isCorrect ? 1 : 0)),
                                0
                            ) || 0;
                            const score = result.score ?? calculatedScore;
                            const countedCorrectAnswers = result.answers
                                ? result.answers.filter((answer) => {
                                    if (answer.isCorrect === true || Number(answer.marksAwarded) > 0) return true;
                                    if (answer.selectedOption === null || answer.selectedOption === undefined) return false;
                                    const selected = String(answer.selectedOption).trim().toLowerCase();
                                    const correct = String(answer.correctAnswer ?? "").trim().toLowerCase();
                                    return selected === correct;
                                }).length
                                : 0;
                            const correctAnswers = score === totalMarks && totalQuestions > 0
                                ? totalQuestions
                                : countedCorrectAnswers;
                            const incorrectAnswers = Math.max(totalQuestions - correctAnswers, 0);
                            return (
                                <div key={result._id || index} style={{ background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <h3>{result.quiz?.title || result.quizTitle || "Assessment"}</h3>
                                    <p>Submitted: {new Date(result.submittedAt || result.createdAt).toLocaleString()}</p>
                                    <p style={{ margin: "8px 0", color: "#2563eb", fontWeight: "bold" }}>
                                        Correct answers: {correctAnswers}
                                    </p>
                                    <p style={{ margin: "8px 0", color: "#dc2626", fontWeight: "bold" }}>
                                        Incorrect answers: {incorrectAnswers}
                                    </p>
                                    <strong>Score: {score} / {totalMarks}</strong>
                                    {result.answers?.length > 0 && (
                                        <div style={{ marginTop: "15px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
                                            <strong>Submitted answers</strong>
                                            {result.answers.map((answer, answerIndex) => (
                                                <p key={answer.questionId || answerIndex} style={{ margin: "8px 0", color: "#475569" }}>
                                                    {answer.question || `Question ${answerIndex + 1}`}: {answer.selectedOption}
                                                    {" - "}
                                                    {answer.isCorrect ? "Correct" : "Incorrect"}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
