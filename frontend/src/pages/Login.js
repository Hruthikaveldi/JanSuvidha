import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">🇮🇳</div>
            <span className="auth-logo-text">JanSuvidha</span>
          </div>
          <h1 className="auth-headline">Find every scheme<br />you deserve.</h1>
          <p className="auth-sub">
            Over 800 central government schemes exist. Most Indians miss out because they don't know they qualify. JanSuvidha finds everything you're entitled to — in 30 seconds.
          </p>
          <div className="stat-pills">
            <div className="stat-pill"><strong>44+</strong> schemes covered</div>
            <div className="stat-pill"><strong>11</strong> categories</div>
            <div className="stat-pill"><strong>80%</strong> Indians miss out</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to check your eligibility</p>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
          <p className="auth-switch">New user? <Link to="/register">Create free account</Link></p>
        </div>
      </div>
    </div>
  );
}
