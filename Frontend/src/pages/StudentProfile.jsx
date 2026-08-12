import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import API from '../services/api';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

export default function StudentProfile() {
  const [user] = useState(getStoredUser);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    API.get('/quizzes/my-results', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      if (data.success) setResults(data.results || []);
    }).catch((error) => {
      console.error('Error loading profile results:', error);
    });
  }, [navigate]);

  const stats = useMemo(() => {
    const totalMarks = results.reduce((total, result) => total + (Number(result.totalMarks) || result.answers?.length || 0), 0);
    const score = results.reduce((total, result) => total + (Number(result.score) || 0), 0);
    return {
      attempts: results.length,
      quizzes: new Set(results.map((result) => result.quiz?._id || result.quiz)).size,
      accuracy: totalMarks ? Math.round((score / totalMarks) * 100) : 0
    };
  }, [results]);

  const name = user.name || 'Student';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="student-page">
      <StudentNavbar />
      <main className="profile-page">
        <div className="profile-heading">
          <div>
            <span className="eyebrow">Student account</span>
            <h1>My Profile</h1>
            <p>Manage your learning identity and view your progress at a glance.</p>
          </div>
          <Link className="profile-action" to="/quiz">Explore quizzes</Link>
        </div>

        <section className="profile-layout">
          <article className="profile-card profile-identity-card">
            <div className="profile-avatar">{initials}</div>
            <h2>{name}</h2>
            <p>{user.email || 'Student account'}</p>
            <span className="profile-status"><span /> Verified student</span>
            <div className="profile-details">
              <div><span>Role</span><strong>Student</strong></div>
              <div><span>Learning mode</span><strong>Self-paced</strong></div>
            </div>
          </article>

          <div className="profile-stat-grid">
            <article className="profile-card profile-stat-card"><span className="profile-stat-icon">🎯</span><span>Quiz attempts</span><strong>{stats.attempts}</strong><small>Keep building momentum</small></article>
            <article className="profile-card profile-stat-card"><span className="profile-stat-icon">🏆</span><span>Quizzes completed</span><strong>{stats.quizzes}</strong><small>Unique assessments finished</small></article>
            <article className="profile-card profile-stat-card"><span className="profile-stat-icon">📈</span><span>Average accuracy</span><strong>{stats.accuracy}%</strong><small>Based on submitted answers</small></article>
          </div>
        </section>

        <section className="profile-card achievement-panel">
          <div>
            <span className="eyebrow">Keep learning</span>
            <h2>Your next achievement is waiting</h2>
            <p>Take another available quiz to improve your accuracy and grow your learning streak.</p>
          </div>
          <button className="profile-action" onClick={() => navigate('/quiz')}>Start a quiz →</button>
        </section>
      </main>
    </div>
  );
}
