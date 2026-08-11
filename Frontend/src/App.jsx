import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard'; 
import TakeQuiz from './pages/TakeQuiz';
import ResultHistory from './pages/ResultHistory';

import AdminAnalytics from './pages/AdminAnalytics';
import CreateQuiz from './pages/CreateQuiz';

function App() {
  return (
    <Router>
      <Routes>
        {/* Unified Login & Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Student Registration Route */}
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/quiz" element={<StudentDashboard />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
        <Route path="/results" element={<ResultHistory />} />
        <Route path="/result-history" element={<ResultHistory />} />

        {/* Admin Routes (Aliases mapped to support both dashboard and analytics links) */}
        <Route path="/admin-dashboard" element={<AdminAnalytics />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/create-quiz" element={<CreateQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;