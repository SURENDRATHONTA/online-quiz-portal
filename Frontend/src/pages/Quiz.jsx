import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import StudentNavbar from '../components/StudentNavbar';

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const [selectedBranch, setSelectedBranch] = useState(searchParams.get('branch') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedSemester, setSelectedSemester] = useState(searchParams.get('sem') || '');

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

  const filteredQuizzes = quizzes.filter((quiz) => {
    const branchMatch = selectedBranch ? (quiz.branch || 'CSE') === selectedBranch : true;
    const yearMatch = selectedYear ? (quiz.academicYear || '1st Year') === selectedYear : true;
    const semMatch = selectedSemester ? (quiz.semester || '1.1') === selectedSemester : true;
    return branchMatch && yearMatch && semMatch;
  });

  const groupedQuizzes = filteredQuizzes.reduce((groups, quiz) => {
    const groupKey = `${quiz.branch || 'CSE'} · ${quiz.academicYear || '1st Year'} · ${quiz.semester || '1.1'}`;
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(quiz);
    return groups;
  }, {});

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading available tests...</div>;
  }

  return (
  <div className="available-quizzes-page">
    <StudentNavbar />
    <main style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
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

      <section className="quiz-filter-panel" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569' }}>Branch</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db' }}>
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="Civil">Civil</option>
          </select>        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569' }}>Year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db' }}>
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569' }}>Semester</label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db' }}>
            <option value="">All Semesters</option>
            <option value="1.1">1.1</option>
            <option value="1.2">1.2</option>
            <option value="2.1">2.1</option>
            <option value="2.2">2.2</option>
            <option value="3.1">3.1</option>
            <option value="3.2">3.2</option>
            <option value="4.1">4.1</option>
            <option value="4.2">4.2</option>
          </select>        </div>
      </section>

      <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Available Mock Tests</h3>

      {quizzes.length === 0 ? (
        <p style={{ color: '#64748b' }}>No quizzes available right now.</p>
      ) : filteredQuizzes.length === 0 ? (
        <p style={{ color: '#64748b' }}>No quizzes match the selected branch, year, and semester.</p>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {Object.entries(groupedQuizzes).map(([groupKey, group]) => (
            <section key={groupKey} style={{ background: '#f8fafc', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b' }}>{groupKey}</h4>
                  <p style={{ margin: '6px 0 0 0', color: '#475569', fontSize: '13px' }}>{group.length} quiz{group.length === 1 ? '' : 'zes'} available for this category.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                {group.map((quiz) => (
                  <div key={quiz._id || quiz.id} style={{ background: '#fff', padding: '18px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0f766e' }}>
                        ⚡ {quiz.title || quiz.quizTitle || "Set-1"}
                      </h4>
                      <p style={{ margin: '0 8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        {quiz.description || "Timed technical assessment"}
                      </p>
                      <div style={{ marginTop: '8px', display: 'inline-flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#0f766e', background: '#ecfeff', padding: '5px 10px', borderRadius: '999px' }}>{quiz.branch || 'CSE'}</span>
                        <span style={{ fontSize: '12px', color: '#0f766e', background: '#ecfeff', padding: '5px 10px', borderRadius: '999px' }}>{quiz.academicYear || '1st Year'}</span>
                        <span style={{ fontSize: '12px', color: '#0f766e', background: '#ecfeff', padding: '5px 10px', borderRadius: '999px' }}>Sem {quiz.semester || '1.1'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button 
                        onClick={() => navigate(`/take-quiz/${quiz._id || quiz.id}`)}
                        style={{ 
                          width: '120px', 
                          height: '42px', 
                          background: '#0f766e', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '8px', 
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
                          borderRadius: '8px', 
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
            </section>
          ))}
        </div>
      )}
    </main>
    </div>
  );
}

export default Quiz;