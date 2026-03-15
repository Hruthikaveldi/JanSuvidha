import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed'); }
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
          <h1 className="auth-headline">Your rights.<br />In 30 seconds.</h1>
          <p className="auth-sub">
            Enter your basic details — age, income, caste, state, occupation — and instantly see every central government scheme you qualify for, with direct apply links.
          </p>
          <div className="stat-pills">
            <div className="stat-pill">🏠 Housing schemes</div>
            <div className="stat-pill">🏥 Health schemes</div>
            <div className="stat-pill">🎓 Scholarships</div>
            <div className="stat-pill">💼 Employment</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Free — no credit card needed</p>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" placeholder="Rahul Sharma"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
