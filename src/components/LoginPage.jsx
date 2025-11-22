import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(
          { username: username.trim(), 
            password 
          }
        ),
      });

      const data = await resp.json();
      const { user } = data;

      if (!resp.ok) {
        const msg = data && data.message ? data.message : 'Invalid credentials';
        alert(msg);
        setLoading(false);
        return;
      }
      else {        
        // --- FIX STARTS HERE ---
        // We manually update the global state so ProtectedRoute knows we are in.
        login(user); 
        // --- FIX ENDS HERE ---

        if (user.role === "admin"){
          navigate('/admin-dashboard')
        }
        else{
          // Login success — navigate to applications page
           navigate('/applications');
        }
           
      }
      
    } catch (err) {
      console.error('Login request failed', err);
      alert('Login failed — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="login-box1">
      <div id="login-box2">
        <div>
          <img id="p-icon" src="./icons/passport.webp" alt="Passport-icon" />
        </div>
        <h1>Passport Services</h1>
        <h4>Sign in to your account to manage applications</h4>

        <div id="input-field">
          <form id="login-form" onSubmit={onSubmit}>
            <h3 id="input-credentials-1">Username / Email</h3>
            <input
              className="login"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <h3 id="input-credentials-2">Password</h3>
            <input
              className="login"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-actions" style={{ marginTop: 18 }}>
              <button type="submit" id="signIn-btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
            </div>
          </form>
        </div>

        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </main>
  );
}