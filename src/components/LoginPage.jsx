import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    // Basic client-side validation could be added here
    // For prototype simply navigate to applications page
    navigate('/applications');
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
            <input className="login" name="username" type="text" placeholder="Enter your username" required />

            <h3 id="input-credentials-2">Password</h3>
            <input className="login" name="password" type="password" placeholder="Enter your password" required />

            <div className="login-actions" style={{ marginTop: 18 }}>
              <button type="submit" id="signIn-btn">Sign In</button>
            </div>
          </form>
        </div>

        <p>Don't have an account? <a href="#">Register here</a></p>
      </div>
    </main>
  );
}
