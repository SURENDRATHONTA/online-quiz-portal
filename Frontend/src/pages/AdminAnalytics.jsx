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
  const [search, setSearch] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Analytics, Student Results, and Quizzes simultaneously
  const fetchAdminData = async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
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
        setRefreshing(false);
      }
  };

  useEffect(() => {
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

  const filteredQuizzes = quizzes.filter((quiz) => {
    const query = search.trim().toLowerCase();
    return !query || quiz.title?.toLowerCase().includes(query) || quiz.description?.toLowerCase().includes(query);
  });
  const filteredResults = results.filter((record) => {
    const query = resultSearch.trim().toLowerCase();
    return !query
      || record.student?.name?.toLowerCase().includes(query)
      || record.quiz?.title?.toLowerCase().includes(query);
  });
  const recentResults = [...results]
    .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
    .slice(0, 5);
  const performance = results.reduce((summary, record) => {
    const percentage = Number(record.percentage)
      || (Number(record.totalMarks) ? (Number(record.score || 0) / Number(record.totalMarks)) * 100 : 0);
    if (percentage >= 80) summary.excellent += 1;
    else if (percentage >= 60) summary.good += 1;
    else if (percentage >= 40) summary.average += 1;
    else summary.needsSupport += 1;
    return summary;
  }, { excellent: 0, good: 0, average: 0, needsSupport: 0 });
  const performanceTotal = results.length || 1;
  const averagePerformance = results.length
    ? Math.round(results.reduce((total, record) => {
      return total + (Number(record.percentage)
        || (Number(record.totalMarks) ? (Number(record.score || 0) / Number(record.totalMarks)) * 100 : 0));
    }, 0) / results.length)
    : 0;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading analytics and management data...</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Integrated Admin Navbar */}
      <AdminNavbar />

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
        <section className="admin-hero-banner">
          <div>
            <span className="hero-kicker">✦ Control center</span>
            <h1>Admin command center</h1>
            <p>Monitor learners, manage assessments, and keep your quiz platform running smoothly.</p>
          </div>
          <div className="admin-hero-actions">
            <button onClick={() => fetchAdminData(true)} disabled={refreshing}>{refreshing ? 'Refreshing...' : '↻ Refresh dashboard'}</button>
            <button onClick={() => window.location.href = '/admin/create-quiz'}>＋ Create quiz</button>
          </div>
        </section>

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

        <section id="performance-analysis" className="performance-analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <span className="eyebrow">Performance intelligence</span>
              <h3>Student performance analysis</h3>
              <p>Understand how students are performing across all submitted attempts.</p>
            </div>
            <div className="performance-score-ring" style={{ '--score': `${averagePerformance * 3.6}deg` }}>
              <strong>{averagePerformance}%</strong>
              <span>average score</span>
            </div>
          </div>
          <div className="performance-analysis-grid">
            <div className="performance-breakdown">
              {[
                ['Excellent', performance.excellent, '#10b981', '80–100%'],
                ['Good', performance.good, '#06b6d4', '60–79%'],
                ['Average', performance.average, '#f59e0b', '40–59%'],
                ['Needs support', performance.needsSupport, '#f43f5e', 'Below 40%']
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
                <div><strong>{results.length}</strong><span>attempts</span></div>
              </div>
              <div className="performance-legend">
                <span><i className="legend-excellent" />Excellent</span>
                <span><i className="legend-good" />Good</span>
                <span><i className="legend-average" />Average</span>
                <span><i className="legend-support" />Needs support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Management Section */}
        <div style={{ marginBottom: '40px' }}>
          <div className="admin-section-heading">
            <div>
              <h3 style={{ marginBottom: '5px', color: '#1e293b' }}>Active Assessments Management 🛠️</h3>
              <p className="admin-section-meta">{filteredQuizzes.length} of {quizzes.length} quizzes shown</p>
            </div>
            <input className="admin-search-input" placeholder="Search quizzes..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          {filteredQuizzes.length === 0 ? (
            <p style={{ color: '#64748b', background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>No quizzes found. Click "Add / Insert Quiz" in the navbar to create one.</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredQuizzes.map((quiz) => (
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
        <div className="admin-section-heading admin-results-heading">
          <div>
            <h3 style={{ marginBottom: '5px', color: '#1e293b' }}>Student Quiz Attempt Records 📋</h3>
            <p className="admin-section-meta">{filteredResults.length} attempt{filteredResults.length === 1 ? '' : 's'} found</p>
          </div>
          <input className="admin-search-input" placeholder="Search student or quiz..." value={resultSearch} onChange={(event) => setResultSearch(event.target.value)} />
        </div>
        
        {filteredResults.length === 0 ? (
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
                {filteredResults.map((record, index) => (
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

        <section className="admin-recent-panel">
          <div className="admin-section-heading">
            <div>
              <span className="eyebrow">Live overview</span>
              <h3>Recent submissions</h3>
            </div>
            <span className="admin-live-badge"><span /> Live data</span>
          </div>
          {recentResults.length === 0 ? <p className="admin-section-meta">Recent submissions will appear here.</p> : recentResults.map((record, index) => (
            <div className="admin-recent-row" key={record._id || index}>
              <span className="admin-recent-avatar">{(record.student?.name || 'S').charAt(0).toUpperCase()}</span>
              <div><strong>{record.student?.name || 'Unknown Student'}</strong><span>{record.quiz?.title || 'General Quiz'}</span></div>
              <b>{record.score ?? 0} / {record.totalMarks || '-'}</b>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default AdminAnalytics;