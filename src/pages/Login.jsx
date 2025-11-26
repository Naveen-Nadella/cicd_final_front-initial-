import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dummyOtp, setDummyOtp] = useState('');
  const navigate = useNavigate();

  const handlePhonePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!/^\d{10}$/.test(phone)) {
      setError('A valid 10-digit phone number is required');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

   // Dummy credentials for user
if (phone === "9876543210" && password === "User@123") {
  setUserData({ name: "Demo User", phone });   // optional
  setIsOtpSent(true);
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  setDummyOtp(generatedOtp);
  setSuccessMessage(`Captcha: ${generatedOtp}`);
} else {
  setError("Invalid phone number or password");
}
setLoading(false);

  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!otp.trim() || otp.length !== 6) {
      setError('Enter a valid 6-digit Captcha');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (otp !== dummyOtp) {
        setError('Invalid Captcha. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Login successful! Redirecting to dashboard...');
      if (setUser) setUser(userData);

      setTimeout(() => navigate('/user'), 1000);
      setLoading(false);
    }, 1000);
  };

  const handleResendOtp = () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    setTimeout(() => {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDummyOtp(generatedOtp);
      setSuccessMessage(`OTP resent to ${phone} (Dummy OTP: ${generatedOtp})`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <h2>Login to MyKhata</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!isOtpSent ? (
        <form onSubmit={handlePhonePasswordSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone number"
              required
              pattern="[0-9]{10}"
              maxLength={10}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div className="form-group">
            <label>Enter Captcha</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit captcha"
              maxLength={6}
              required
              pattern="[0-9]{6}"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleResendOtp} disabled={loading}>
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setIsOtpSent(false)} disabled={loading}>
            Back
          </button>
        </form>
      )}

      <div className="auth-links">
        <p>New user? <Link to="/signup">Sign up here</Link></p>
        <p>Admin? <Link to="/admin">Admin Login</Link></p>
      </div>
    </div>
  );
}

export default Login;
