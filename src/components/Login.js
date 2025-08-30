import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Import Redux
import { useDispatch } from 'react-redux';
import { setUser } from '../admin_components/userSlice';  // Adjust path if needed

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const dispatch = useDispatch();  // Redux dispatcher

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        loginUser(data.user);  // save to AuthContext/localStorage

        // Also dispatch user data to Redux store
        dispatch(setUser({
          userId: data.user._id || data.user.id || null,
          email: data.user.email,
          isAdmin: data.user.role === 'admin' || data.user.role === 'superadmin',
        }));

        // Redirect based on role
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Server error');
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-left"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/vision.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="login-right">
        <div className="login-box">
          <h1>Login</h1>
          <h3>WELL VISION</h3>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">SUBMIT</button>

            {message && <p className="message">{message}</p>}

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px' }}>
                Forgot Password?
              </Link>
              <br />
              <span style={{ fontSize: '13px' }}>
                Don't have an account?{' '}
                <Link to="/register">
                  <strong>Register</strong>
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
