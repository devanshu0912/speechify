import React, { useState } from 'react';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm]     = useState({ email: '', password: '', name: '' });
  const [mode, setMode]     = useState('login');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let data;
      if (mode === 'login') {
        data = await api.login(form.email, form.password);
      } else {
        data = await api.signup(form.name, form.email, form.password);
      }
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-brand">
          <div className="hero-logo">🧠</div>
          <h1 className="hero-title">Speechify</h1>
          <p className="hero-tagline">
            AI-Enabled Personalized Reading<br />Assistant for Dyslexia
          </p>
          <ul className="hero-features">
            <li><div className="feat-icon">🔊</div> Adaptive Text-to-Speech</li>
            <li><div className="feat-icon">🎤</div> Speech-to-Text Dictation</li>
            <li><div className="feat-icon">✨</div> AI-Powered Summarization</li>
            <li><div className="feat-icon">🎮</div> Gamified Word Practice</li>
            <li><div className="feat-icon">📊</div> Progress Tracking in MongoDB</li>
            <li><div className="feat-icon">🌙</div> Dark Mode & Color Overlays</li>
          </ul>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-box">
          <h2>{mode === 'login' ? 'Welcome back!' : 'Get started free'}</h2>
          <p className="login-subtitle">
            {mode === 'login' ? 'Sign in to your Speechify account.' : 'Create your account in seconds.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Your full name"
                  value={form.name} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@gmail.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password"
                placeholder={mode === 'login' ? 'Your password' : 'Min. 6 characters'}
                value={form.password} onChange={handleChange} required />
            </div>
            {error && <p className="form-error">⚠️ {error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? '→ Sign In' : '→ Create Account'}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }}>Sign up free</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
