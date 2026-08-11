import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Top Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: '#1e293b', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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
      <header style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <span style={{ background: '#e0e7ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
          🚀 Next-Gen Online Quiz Assessment Platform
        </span>
        <h1 style={{ fontSize: '42px', color: '#0f172a', marginBottom: '20px', lineHeight: '1.2' }}>
          Smart Evaluations & Real-Time Skill Testing for Modern Teams
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '35px' }}>
          Secure, timed, and automated evaluations built for students and instructors. Create assessments, monitor live results, and track performance seamlessly.
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
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 20px 80px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>⏱️ Timed Assessments</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Dynamic timers enforce strict testing conditions with automatic submissions upon expiry.</p>
        </div>

        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>📊 Admin Analytics</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Track total student participation, average scores, and individual attempt histories in real time.</p>
        </div>

        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>🔒 Secure & Verified</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>Email OTP verification guarantees authenticated student records and secure database entries.</p>
        </div>
      </section>
    </div>
  );
}