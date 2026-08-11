import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#2563eb', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: 0, fontSize: '18px' }}>Online Quiz Evaluation Portal — Student Portal 🎓</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/quiz" style={{ color: '#e0e7ff', textDecoration: 'none', fontWeight: '500' }}>Available Quizzes</Link>
        <Link to="/results" style={{ color: '#e0e7ff', textDecoration: 'none', fontWeight: '500' }}>Result History</Link>
        <button 
          onClick={handleLogout}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default StudentNavbar;