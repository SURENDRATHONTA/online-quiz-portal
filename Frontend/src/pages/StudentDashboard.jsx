import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import API from '../services/api';

export default function StudentDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 🚀 Fetch available quizzes safely
                try {
                    const { data } = await API.get("/quizzes", config);
                    if (data.success) {
                        setQuizzes(data.quizzes || []);
                    }
                } catch (qErr) {
                    console.error("Error loading available quizzes:", qErr);
                    setError("Failed to load available quizzes.");
                }

                // 🚀 Fetch past attempt history safely
                try {
                    const resultsRes = await API.get("/quizzes/my-results", config);
                    if (resultsRes.data.success) {
                        setResults(resultsRes.data.results || []);
                    }
                } catch (rErr) {
                    console.warn("Results history optional/empty:", rErr);
                }

            } catch (err) {
                console.error("Dashboard general error:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    const handleStartQuiz = (quizId) => {
        navigate(`/take-quiz/${quizId}`);
    };

    // Calculate metrics
    const completedQuizIds = results.map(r => r.quiz?._id || r.quiz);
    const completedCount = new Set(completedQuizIds).size;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading student dashboard...</div>;
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <StudentNavbar />

            <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
                <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Student Dashboard 🚀</h2>
                <p style={{ color: '#64748b', marginBottom: '25px' }}>Track your active assessments, completions, and test your skills.</p>

                {error && <p style={{ color: "#dc2626", background: "#fee2e2", padding: "10px", borderRadius: "6px", textAlign: "center" }}>{error}</p>}

                {/* Summary Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Available Quizzes</h4>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{quizzes.length}</span>
                    </div>

                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Completed Quizzes</h4>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{completedCount}</span>
                    </div>

                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Total Attempts</h4>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>{results.length}</span>
                    </div>
                </div>

                {/* Quizzes Grid */}
                <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Active Assessments</h3>
                <div style={{ display: "grid", gap: "20px" }}>
                    {quizzes.length === 0 ? (
                        <p style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>No active quizzes available right now.</p>
                    ) : null}

                    {quizzes.map((q) => (
                        <div key={q._id} style={{ background: '#fff', border: "1px solid #e2e8f0", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", color: '#1e293b' }}>{q.title}</h3>
                                <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: '14px' }}>{q.description}</p>
                                <span style={{ display: 'inline-block', fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                    {q.questions?.length || 0} Questions | {q.timeLimit} minutes
                                </span>
                            </div>

                            <button 
                                onClick={() => handleStartQuiz(q._id)}
                                style={{ padding: "10px 18px", background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", borderRadius: "6px", fontWeight: "bold" }}
                            >
                                Start Quiz 🚀
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}