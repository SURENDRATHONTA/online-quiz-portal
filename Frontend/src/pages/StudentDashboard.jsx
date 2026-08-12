import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import API from '../services/api';

export default function StudentDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedQuizzes] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("savedQuizzes")) || [];
        } catch {
            return [];
        }
    });
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    const fetchStudentData = async (isRefresh = false) => {
            if (isRefresh) setRefreshing(true);
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
                setRefreshing(false);
            }
    };

    useEffect(() => {
        fetchStudentData();
    }, []);

    // Calculate metrics
    const completedQuizIds = results.map(r => r.quiz?._id || r.quiz);
    const completedCount = new Set(completedQuizIds).size;
    const student = (() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    })();
    const studentName = student.name || "Student";
    const totalMarks = results.reduce((total, result) => total + (Number(result.totalMarks) || result.answers?.length || 0), 0);
    const totalScore = results.reduce((total, result) => total + (Number(result.score) || 0), 0);
    const averageScore = totalMarks ? Math.round((totalScore / totalMarks) * 100) : 0;
    const performance = results.reduce((summary, result) => {
        const percentage = Number(result.percentage)
            || (Number(result.totalMarks) ? (Number(result.score || 0) / Number(result.totalMarks)) * 100 : 0);
        if (percentage >= 80) summary.excellent += 1;
        else if (percentage >= 60) summary.good += 1;
        else if (percentage >= 40) summary.average += 1;
        else summary.needsSupport += 1;
        return summary;
    }, { excellent: 0, good: 0, average: 0, needsSupport: 0 });
    const performanceTotal = results.length || 1;
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading student dashboard...</div>;
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <StudentNavbar />

            <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
                <section className="student-hero-banner">
                    <div className="student-hero-copy">
                        <span className="hero-kicker">✦ Your learning space</span>
                        <h1>Welcome back, {studentName.split(" ")[0]}!</h1>
                        <p>Build your confidence one quiz at a time. Your next achievement is only a challenge away.</p>
                        <div className="hero-actions">
                            <button onClick={() => navigate("/quiz")}>Find a quiz →</button>
                            <button className="hero-secondary-action" onClick={() => navigate("/student-profile")}>View profile</button>
                        </div>
                    </div>
                    <div className="hero-orbit">
                        <span className="orbit-ring orbit-ring-one" />
                        <span className="orbit-ring orbit-ring-two" />
                        <span className="hero-trophy">🏆</span>
                    </div>
                    <div className="hero-mini-stats">
                        <div><strong>{completedCount}</strong><span>completed</span></div>
                        <div><strong>{savedQuizzes.length}</strong><span>saved</span></div>
                        <div><strong>{averageScore}%</strong><span>accuracy</span></div>
                    </div>
                </section>

                {error && <p style={{ color: "#dc2626", background: "#fee2e2", padding: "10px", borderRadius: "6px", textAlign: "center" }}>{error}</p>}

                <section className="dashboard-performance-snapshot">
                    <div className="snapshot-heading">
                        <div>
                            <span className="eyebrow">Dashboard snapshot</span>
                            <h3>Your performance at a glance</h3>
                        </div>
                        <button onClick={() => document.getElementById("performance-analysis")?.scrollIntoView({ behavior: "smooth" })}>
                            View full analysis →
                        </button>
                    </div>
                    <div className="snapshot-content">
                        <div className="snapshot-score">
                            <strong>{averageScore}%</strong>
                            <span>average accuracy</span>
                        </div>
                        <div className="snapshot-progress">
                            <div className="snapshot-progress-label"><span>Overall progress</span><b>{averageScore}%</b></div>
                            <div className="snapshot-progress-track"><span style={{ width: `${averageScore}%` }} /></div>
                            <p>{results.length ? "Keep practicing to move your score into the next level." : "Complete your first quiz to start tracking progress."}</p>
                        </div>
                        <div className="snapshot-level">
                            <span>Current level</span>
                            <strong>{averageScore >= 80 ? "Excellent" : averageScore >= 60 ? "Strong start" : averageScore >= 40 ? "Growing" : "Getting started"}</strong>
                        </div>
                    </div>
                </section>

                <div className="student-dashboard-toolbar">
                    <div>
                        <span className="eyebrow">Your learning hub</span>
                        <h3>Ready for your next challenge?</h3>
                    </div>
                    <button className="dashboard-refresh-btn" onClick={() => fetchStudentData(true)} disabled={refreshing}>
                        {refreshing ? "Refreshing..." : "↻ Refresh data"}
                    </button>
                </div>

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
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Average Accuracy</h4>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>{averageScore}%</span>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Saved for Later</h4>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0891b2' }}>{savedQuizzes.length}</span>
                    </div>
                </div>

                <section id="performance-analysis" className="performance-analytics-panel student-performance-panel">
                    <div className="analytics-panel-heading">
                        <div>
                            <span className="eyebrow">Your performance</span>
                            <h3>Learning progress analysis</h3>
                            <p>See how your completed quiz scores are improving over time.</p>
                        </div>
                        <div className="performance-score-ring">
                            <strong>{averageScore}%</strong>
                            <span>your average</span>
                        </div>
                    </div>
                    <div className="performance-analysis-grid">
                        <div className="performance-breakdown">
                            {[
                                ['Excellent', performance.excellent, '#10b981', '80–100%'],
                                ['Good', performance.good, '#06b6d4', '60–79%'],
                                ['Average', performance.average, '#f59e0b', '40–59%'],
                                ['Needs practice', performance.needsSupport, '#f43f5e', 'Below 40%']
                            ].map(([label, count, color, range]) => (
                                <div className="performance-bar-row" key={label}>
                                    <div className="performance-bar-label"><span><i style={{ background: color }} />{label}</span><b>{count}</b></div>
                                    <div className="performance-bar-track"><span style={{ width: `${(count / performanceTotal) * 100}%`, background: color }} /></div>
                                    <small>{range}</small>
                                </div>
                            ))}
                        </div>
                        <div className="performance-donut-wrap">
                            <div
                                className="performance-donut"
                                style={{
                                    '--excellent': `${(performance.excellent / performanceTotal) * 100}%`,
                                    '--good': `${((performance.excellent + performance.good) / performanceTotal) * 100}%`,
                                    '--average': `${((performance.excellent + performance.good + performance.average) / performanceTotal) * 100}%`
                                }}
                            >
                                <div><strong>{results.length}</strong><span>completed</span></div>
                            </div>
                            <div className="performance-legend">
                                <span><i className="legend-excellent" />Excellent</span>
                                <span><i className="legend-good" />Good</span>
                                <span><i className="legend-average" />Average</span>
                                <span><i className="legend-support" />Needs practice</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="recent-activity-panel">
                    <div className="recent-activity-heading">
                        <div>
                            <span className="eyebrow">Progress timeline</span>
                            <h3>Recent activity</h3>
                        </div>
                        <button onClick={() => navigate('/results')}>View all results →</button>
                    </div>
                    {results.length === 0 ? (
                        <p className="activity-empty">Your completed quiz activity will appear here.</p>
                    ) : (
                        results.slice(0, 3).map((result, index) => (
                            <div className="activity-row" key={result._id || index}>
                                <span className="activity-icon">✓</span>
                                <div>
                                    <strong>{result.quiz?.title || result.quizTitle || "Assessment"}</strong>
                                    <span>{new Date(result.submittedAt || result.createdAt).toLocaleDateString()}</span>
                                </div>
                                <b>{result.score ?? 0} pts</b>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}