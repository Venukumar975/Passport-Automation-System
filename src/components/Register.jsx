import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/register.css';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data && data.message ? data.message : 'Registration failed');
        setLoading(false);
        return;
      }

      // On success, navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Register failed', err);
      setError('Registration failed — try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="reg-root">
      <form className="reg-card" onSubmit={onSubmit}>
        <div className="reg-brand">
          <img src="./icons/passport.webp" alt="passport" className="reg-icon" />
          <h2>Create account</h2>
        </div>

        {error && <div className="reg-error">{error}</div>}

        <label>Username</label>
        <input value={username} placeholder = "Enter your User name" onChange={(e)=>setUsername(e.target.value)} required />

        <label>Email</label>
        <input type="email" placeholder = "Enter your Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder = "Enter your Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

        <div className="reg-actions">
          <button type="submit" className="reg-primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
          <button type="button" className="reg-link" onClick={()=>navigate('/login')}>Back to login</button>
        </div>
      </form>
    </main>
  );
}
