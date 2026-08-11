import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use lowercase 'api' to match the import
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save session data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Role-based routing from the same login page
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/quiz');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>Online Quiz Evaluation Portal 🚀</h2>
      
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Student Registration Link */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Register as Student</span>
        </p>
      </div>
    </div>
  );
}

export default Login;