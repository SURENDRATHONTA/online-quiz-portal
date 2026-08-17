import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function TakeQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [loadErrorCode, setLoadErrorCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmitRef = useRef(null);
    const answersRef = useRef(answers);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const handleSubmitQuiz = useCallback(async (isViolation = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        const formattedAnswers = Object.entries(answersRef.current).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption
        }));

        try {
            if (isViolation) {
                const payload = JSON.stringify({ quizId: id, answers: formattedAnswers, token });
                navigator.sendBeacon(
                    "http://localhost:5000/api/attempt/submit",
                    new Blob([payload], { type: "application/json" })
                );
            } else {
                await API.post("/attempt/submit", { quizId: id, answers: formattedAnswers }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigate("/results");
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
            alert(
                `${error.response?.data?.message || "Quiz submission failed."} ` +
                `(${error.response?.data?.errorCode || "QUIZ_SUBMISSION_FAILED"})`
            );
        }
    }, [id, isSubmitting, navigate]);

    useEffect(() => {
        handleSubmitRef.current = handleSubmitQuiz;
    }, [handleSubmitQuiz]);

    useEffect(() => {
        const fetchQuiz = async () => {
            const token = localStorage.getItem("token");
            try {
                const { data } = await API.get(`/quizzes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!data.success || !data.quiz) {
                    setLoadError(data.message || "This assessment could not be loaded.");
                    setLoadErrorCode(data.errorCode || "QUIZ_INVALID_RESPONSE");
                    return;
                }

                const loadedQuiz = {
                    ...data.quiz,
                    questions: Array.isArray(data.quiz.questions) ? data.quiz.questions : []
                };
                if (loadedQuiz.questions.length === 0) {
                    const questionsResponse = await API.get(`/questions/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    loadedQuiz.questions = questionsResponse.data.questions || [];
                }
                setQuiz(loadedQuiz);
                setTimeLeft((loadedQuiz.timeLimit || 15) * 60);
            } catch (error) {
                console.error("Error loading quiz:", error);
                setLoadError(error.response?.data?.message || "Unable to load this assessment.");
                setLoadErrorCode(error.response?.data?.errorCode || "QUIZ_FETCH_FAILED");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0 || isSubmitting) return undefined;
        const timer = setInterval(() => {
            setTimeLeft((previous) => (previous <= 1 ? 0 : previous - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitting]);

    if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading practice quiz...</div>;

    return (
        <div style={{ padding: "30px", maxWidth: "800px", margin: "auto", background: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "15px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, color: "#1e293b" }}>{quiz?.title || "Practice Quiz"}</h2>
                <div style={{ textAlign: "right" }}>
                    <span style={{ color: "#16a34a", fontWeight: "bold", display: "block" }}>Practice Mode</span>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>Time Left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
                </div>
            </div>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <p style={{ color: "#0f766e", fontWeight: "bold", background: "#ccfbf1", padding: "10px", borderRadius: "6px" }}>
                    Practice mode is active: review the questions, answer at your own pace, and submit when you are ready.
                </p>
                {loadError ? (
                    <p style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}>{loadError} ({loadErrorCode})</p>
                ) : quiz?.questions?.length ? (
                    quiz.questions.map((question, questionIndex) => {
                        const questionId = question._id || questionIndex;
                        return (
                            <div key={questionId} style={{ marginTop: "20px", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9" }}>
                                <h4 style={{ color: "#1e293b" }}>Q{questionIndex + 1}. {question.question || question.questionText || question.title}</h4>
                                <div style={{ display: "grid", gap: "8px" }}>
                                    {(question.options || []).map((option, optionIndex) => (
                                        <label key={optionIndex} style={{ display: "flex", gap: "10px", padding: "10px", background: "#f8fafc" }}>
                                            <input type="radio" name={`question-${questionId}`} checked={answers[questionId] === option} onChange={() => setAnswers((previous) => ({ ...previous, [questionId]: option }))} />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}>No questions assigned. Error code: QUIZ_QUESTIONS_EMPTY</p>
                )}
            </div>
            <button onClick={() => handleSubmitRef.current(false)} disabled={isSubmitting} style={{ width: "100%", padding: "14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold" }}>
                {isSubmitting ? "Submitting Practice Result..." : "Finish Practice"}
            </button>
        </div>
    );
}
