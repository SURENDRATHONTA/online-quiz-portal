import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
      setMessage('A 6-digit OTP has been sent to your email.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to send reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setMessage('Enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/verify-reset-otp', { email, otp });
      setResetToken(response.data.resetToken);
      setStep('password');
      setMessage('Email verified. Choose a new password.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setMessage('Password must meet all the requirements shown below.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword, confirmPassword });
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '50px auto', padding: '35px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1e293b' }}>Reset Password</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        {step === 'email' && 'Enter your account email to receive an OTP.'}
        {step === 'otp' && 'Enter the OTP sent to your email.'}
        {step === 'password' && 'Create and confirm your new password.'}
      </p>

      {step === 'email' && (
        <form onSubmit={submitRequest}>
          <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={verifyOtp}>
          <input type="text" inputMode="numeric" maxLength="6" placeholder="6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', letterSpacing: '4px', textAlign: 'center' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={resetPassword}>
          <input type="password" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }} />
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }} />
          <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px', color: '#64748b' }}>
            {passwordRequirements.map((requirement) => (
              <li key={requirement.label} style={{ color: requirement.test(newPassword) ? '#16a34a' : '#64748b' }}>
                {requirement.test(newPassword) ? '✓' : '○'} {requirement.label}
              </li>
            ))}
          </ul>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {message && <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: message.includes('successfully') || message.includes('verified') || message.includes('sent') ? '#16a34a' : '#dc2626' }}>{message}</p>}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Back to login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
