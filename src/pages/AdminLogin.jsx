import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dummyOtp, setDummyOtp] = useState('');
  const navigate = useNavigate();

  const handlePhonePasswordSubmit = (e) => {
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

    // 🔥 Dummy credentials
    if (phone === "9999999999" && password === "Admin@123") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDummyOtp(generatedOtp);
      setIsOtpSent(true);
      setSuccessMessage(`Captcha: ${generatedOtp}`);
    } else {
      setError("Invalid phone number or password. Only admins can log in here.");
    }

    setLoading(false);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (otp !== dummyOtp) {
      setError('Invalid Captcha. Please try again.');
      setLoading(false);
      return;
    }

    setSuccessMessage("Admin login successful! Redirecting...");
    localStorage.setItem("adminLogin", JSON.stringify({ name: "Admin", phone }));
    setTimeout(() => navigate('/admin-dashboard'), 1000);
  };

  return (
    <div className="auth-container">
      <h2>Admin Login to MyKhata</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!isOtpSent ? (
        <form onSubmit={handlePhonePasswordSubmit}>
          <div className="form-group">
            <label>Admin Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div className="form-group">
            <label>Enter Captcha</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          </div>
          <button type="submit" className="btn-primary">Verify OTP</button>
        </form>
      )}

      <div className="auth-links">
        <p>Regular user? <Link to="/">User Login</Link></p>
      </div>
    </div>
  );
}

export default AdminLogin;
