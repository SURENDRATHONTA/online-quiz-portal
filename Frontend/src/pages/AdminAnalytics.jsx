import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import api from '../services/api';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0
  });
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch Analytics, Student Results, and Quizzes simultaneously
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [statsRes, resultsRes, quizzesRes] = await Promise.all([
          api.get('/analytics/stats', config),
          api.get('/quizzes/results', config),
          api.get('/quizzes', config)
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }

        if (resultsRes.data.success) {
          setResults(resultsRes.data.results);
        }

        if (quizzesRes.data.success) {
          setQuizzes(quizzesRes.data.quizzes);
        }
      } catch (err) {
        console.error("Admin data fetch error:", err);
        setMessage(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Delete Quiz Handler
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await api.delete(`/admin/quizzes/${quizId}`);
      if (response.data.success) {
        setMessage('Quiz deleted successfully.');
        setQuizzes(quizzes.filter(q => q._id !== quizId));
      }
    } catch (err) {
      setMessage('Failed to delete the quiz.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading analytics and management data...</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Integrated Admin Navbar */}
      <AdminNavbar />

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
        <h2 style={{ marginBottom: '8px', color: '#1e293b' }}>
          Admin Management Dashboard 📊
        </h2>
        <p style={{ color: '#64748b', marginBottom: '25px' }}>Monitor live assessments, evaluate student performance, and modify database quizzes.</p>

        {message && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
            {message}
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Total Students</h4>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalStudents}</span>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Available Quizzes</h4>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{stats.totalQuizzes}</span>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Total Attempts</h4>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>{stats.totalAttempts}</span>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h4 style={{ color: '#64748b', margin: '0 0 10px 0' }}>Average Score</h4>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#9333ea' }}>{stats.averageScore}%</span>
          </div>
        </div>

        {/* Quiz Management Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Active Assessments Management 🛠️</h3>
          {quizzes.length === 0 ? (
            <p style={{ color: '#64748b', background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>No quizzes found. Click "Add / Insert Quiz" in the navbar to create one.</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {quizzes.map((quiz) => (
                <div key={quiz._id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{quiz.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{quiz.description}</p>
                    <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {quiz.questions?.length || 0} Questions | {quiz.totalMarks || 0} Marks | {quiz.timeLimit} Mins
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Delete Quiz 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Attempt History Table */}
        <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Student Quiz Attempt Records 📋</h3>
        
        {results.length === 0 ? (
          <p style={{ color: '#64748b', background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>No student attempts recorded yet.</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>
                  <th style={{ padding: '12px 15px' }}>Student Name</th>
                  <th style={{ padding: '12px 15px' }}>Quiz Title</th>
                  <th style={{ padding: '12px 15px' }}>Score</th>
                  <th style={{ padding: '12px 15px' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155' }}>
                    <td style={{ padding: '12px 15px', fontWeight: '500' }}>{record.student?.name || 'Unknown Student'}</td>
                    <td style={{ padding: '12px 15px' }}>{record.quiz?.title || 'General Quiz'}</td>
                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#16a34a' }}>
                      {record.score} / {record.totalMarks || '-'} ({record.percentage || 0}%)
                    </td>
                    <td style={{ padding: '12px 15px', color: '#64748b' }}>
                      {record.submittedAt ? new Date(record.submittedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;