import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSchemes: 0, totalCategories: 0, searches: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, catRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/schemes/categories')
        ]);
        setStats(statsRes.data);
        setCategories(catRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const catIcons = { Housing:'🏠', Health:'🏥', Education:'🎓', Employment:'💼', Women:'👩', Agriculture:'🌾', Insurance:'🛡️', 'Senior Citizens':'👴', Disability:'♿', Startup:'🚀', 'Skill Development':'🛠️' };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Welcome! Check which government schemes you qualify for — it takes 30 seconds.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-label">Total Schemes</div>
            <div className="stat-value" style={{ color: 'var(--saffron)' }}>{stats.totalSchemes}</div>
            <div className="stat-desc">Covered in database</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗂️</div>
            <div className="stat-label">Categories</div>
            <div className="stat-value" style={{ color: 'var(--saffron)' }}>{stats.totalCategories}</div>
            <div className="stat-desc">Scheme categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔍</div>
            <div className="stat-label">Your Searches</div>
            <div className="stat-value" style={{ color: 'var(--green-l)' }}>{stats.searches}</div>
            <div className="stat-desc">Eligibility checks done</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🇮🇳</div>
            <div className="stat-label">Coverage</div>
            <div className="stat-value" style={{ color: 'var(--green-l)' }}>Pan India</div>
            <div className="stat-desc">All states supported</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.1), rgba(19,136,8,0.08))', border: '1px solid rgba(255,149,0,0.2)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              🔍 Check your eligibility now
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              Enter your profile once — see all schemes you qualify for instantly
            </div>
          </div>
          <Link to="/checker" style={{ padding: '12px 28px', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--saffron), #e67e00)', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
            Check Now →
          </Link>
        </div>

        {/* Categories */}
        <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Browse by Category</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/browse?category=${cat.name}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,149,0,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{catIcons[cat.name] || '📋'}</div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cat.count} scheme{cat.count !== 1 ? 's' : ''}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
