import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();
  const isAdmin = user.role === 'admin';
  const firstName = user.name?.split(' ')[0];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Top Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: '#99b414', color: '#bbc10f', boxShadow: '0 2px 10px rgba(131, 139, 28, 0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎓 Online Quiz Evaluation Portal
        </h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '8px 18px', background: 'transparent', color: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '8px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="home-hero" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="floating-welcome-card">
          <span className="floating-welcome-icon">{isAdmin ? '🛠️' : '🎓'}</span>
          <div>
            <strong>{firstName ? `Welcome back, online quiz!` : 'Welcome to your learning space!'}</strong>
            <span>{isAdmin ? 'Your command center is ready.' : 'Your next achievement starts here.'}</span>
          </div>
          <span className="floating-welcome-sparkle">✦</span>
        </div>
        <span style={{ background: '#e0e7ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
          🚀 Next-Gen Online Quiz Assessment Platform
        </span>
        <h1 style={{ fontSize: '42px', color: '#0f172a', marginBottom: '20px', lineHeight: '1.2' }}>
          {isAdmin ? 'Powerful tools to manage smarter assessments' : 'Smart learning and real-time skill testing'}
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '35px' }}>
          {isAdmin
            ? 'Create engaging quizzes, monitor student performance, and make data-informed decisions from one beautiful admin workspace.'
            : 'Take secure, timed quizzes, review your results, and build confidence with a personalized student experience.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
          >
            Access Portal ➔
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '14px 28px', background: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Register Student Account
          </button>
        </div>
      </header>

      {/* Feature Highlights Grid */}
      <section className="home-features" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 20px 80px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        <div className="home-feature-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span className="home-feature-icon">{isAdmin ? '🧩' : '⏱️'}</span>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>{isAdmin ? 'Build Better Quizzes' : 'Timed Assessments'}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{isAdmin ? 'Create structured assessments with questions, options, marks, and time limits in minutes.' : 'Complete focused assessments with dynamic timers and automatic submission when time expires.'}</p>
        </div>

        <div className="home-feature-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span className="home-feature-icon">{isAdmin ? '📊' : '📈'}</span>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>{isAdmin ? 'Actionable Analytics' : 'Track Your Progress'}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{isAdmin ? 'Review participation, scores, attempts, and recent submissions to understand performance.' : 'See completed quizzes, accuracy, saved assessments, and detailed result history in one place.'}</p>
        </div>

        <div className="home-feature-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span className="home-feature-icon">{isAdmin ? '🛡️' : '🔒'}</span>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>{isAdmin ? 'Confident Control' : 'Secure & Verified'}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{isAdmin ? 'Manage the assessment experience from a focused workspace with clear controls and safe access.' : 'Email OTP verification and protected accounts keep your learning records safe and reliable.'}</p>
        </div>
      </section>
    </div>
  );
}