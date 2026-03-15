import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/history')
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatProfile = p => {
    if (!p) return '';
    return `Age ${p.age} · ₹${Number(p.income).toLocaleString('en-IN')}/yr · ${p.gender} · ${p.caste?.toUpperCase()} · ${p.occupation}`;
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🕐 My Search History</h1>
        <p className="page-sub">Your last 10 eligibility checks.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : history.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🕐</div>
            <div className="empty-title">No searches yet</div>
            <div className="empty-sub">Use the Eligibility Checker to get started</div>
            <br />
            <Link to="/checker" style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg,var(--saffron),#e67e00)', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 14 }}>
              Check Now →
            </Link>
          </div>
        ) : (
          <div>
            {history.map((h, i) => (
              <div key={i} className="history-card">
                <div className="history-icon">🔍</div>
                <div className="history-body">
                  <div className="history-title">{formatProfile(h.profile)}</div>
                  <div className="history-meta">
                    {h.categories?.join(' · ')} &nbsp;·&nbsp;
                    {new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="history-badge">{h.resultsCount} schemes</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
