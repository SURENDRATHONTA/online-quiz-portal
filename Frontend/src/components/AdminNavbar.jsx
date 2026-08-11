import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#1e293b', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: 0, fontSize: '18px' }}>Admin Portal 🛠️</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/admin/analytics" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Student Analytics</Link>
        <Link to="/admin/create-quiz" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Add/Insert Quiz</Link>
        
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

export default AdminNavbar;