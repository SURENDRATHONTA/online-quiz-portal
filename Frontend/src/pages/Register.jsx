import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'One digit', test: (value) => /\d/.test(value) },
  { label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) }
];

const isStrongPassword = (value) =>
  passwordRequirements.every((requirement) => requirement.test(value));

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI Control States
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send or Resend OTP
  const handleSendOTP = async () => {
    if (!email) {
      setMessage('❌ Please enter your email address first.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/send-otp', { email });
      if (response.status === 200 || response.data.success) {
        setOtpSent(true);
        setOtp(''); // Clear out old typed numbers
        setMessage('✅ A fresh 6-digit OTP has been sent to your email.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the entered 6-digit OTP inline
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('❌ Please enter the complete 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      if (response.status === 200 || response.data.success) {
        setIsVerified(true);
        setMessage('✔️ Email Verified Successfully!');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Final Account Creation Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setMessage('❌ Password must meet all the requirements shown below.');
      return;
    }

    if (!isVerified) {
      setMessage('❌ Please verify your email with the OTP before creating an account.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.status === 200 || response.status === 201 || response.data.success) {
        setMessage('✅ Account successfully created! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '50px auto', padding: '35px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1e293b' }}>Create Account 🚀</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>Sign up to start taking quizzes.</p>
      
      <form onSubmit={handleRegister}>
        {/* Full Name */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#64748b' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        
        {/* Email Address */}
        <div style={{ marginBottom: '5px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#64748b' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isVerified}
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', background: isVerified ? '#f1f5f9' : '#fff' }}
          />
        </div>

        {/* Send / Resend OTP Button */}
        {!isVerified && (
          <div style={{ marginBottom: '15px', textAlign: 'right' }}>
            <button 
              type="button" 
              onClick={handleSendOTP}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '13px', padding: 0 }}
            >
              {otpSent ? 'Resend OTP ➔' : 'Send OTP ➔'}
            </button>
          </div>
        )}

        {/* OTP Input and Verify Button */}
        {otpSent && !isVerified && (
          <div style={{ marginBottom: '15px', padding: '12px', background: '#f8f9fa', borderRadius: '5px', border: '1px dashed #ccc' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '13px', color: '#475569' }}>Enter 6-digit OTP</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="------" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                style={{ flex: 1, padding: '8px', fontSize: '16px', textAlign: 'center', letterSpacing: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button 
                type="button" 
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{ padding: '8px 15px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* Verified Success State Checkmark Banner */}
        {isVerified && (
          <div style={{ marginBottom: '15px', padding: '10px', background: '#dcfce7', color: '#16a34a', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            Email Verified Successfully ✔️
          </div>
        )}

        {/* Password Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#64748b' }}>Password</label>
          <input 
            type="password" 
            placeholder="Create a password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            minLength="8"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
            title="Use at least 8 characters with uppercase, lowercase, digit, and special character"
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '12px', color: '#64748b' }}>
            {passwordRequirements.map((requirement) => {
              const requirementMet = requirement.test(password);
              return (
                <li key={requirement.label} style={{ color: requirementMet ? '#16a34a' : '#64748b' }}>
                  {requirementMet ? '✓' : '○'} {requirement.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Final Registration Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: isVerified ? '#2563eb' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: isVerified ? 'pointer' : 'not-allowed' }}
        >
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>

      {message && (
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: message.includes('❌') ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
          {message}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ color: '#666', fontSize: '14px' }}>Already have an account? </span>
        <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
      </div>
    </div>
  );
}

export default Register;