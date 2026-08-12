import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div>
          <h3>Online Quiz Evaluation Portal</h3>
          <p>Learn, practice, and measure your progress with confidence.</p>
        </div>
        <div className="site-footer-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Online Quiz Evaluation Portal</span>
        <span>Built for better learning experiences</span>
      </div>
    </footer>
  );
}

export default Footer;
