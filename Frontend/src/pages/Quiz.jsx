import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setQuizzes(response.data.quizzes);
        }
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading available tests...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Welcome, {user.name} 👋</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Select a timed competitive set to start your evaluation.</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Available Mock Tests</h3>

      {quizzes.length === 0 ? (
        <p style={{ color: '#64748b' }}>No quizzes available right now.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {quizzes.map((quiz) => (
            <div key={quiz._id || quiz.id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#2563eb' }}>
                  ⚡ {quiz.title || quiz.quizTitle || "Set-1"}
                </h4>
                <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                  {quiz.description || "Timed technical assessment"} ({quiz.timeLimit || 5} Minutes)
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  onClick={() => navigate(`/take-quiz/${quiz._id || quiz.id}`)}
                  style={{ 
                    width: '130px', 
                    height: '42px', 
                    background: '#2563eb', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Start Test ➔
                </button>

                <button 
                  onClick={() => navigate('/result-history')}
                  style={{ 
                    width: '130px', 
                    height: '42px', 
                    background: '#10b981', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  View Results 📊
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;