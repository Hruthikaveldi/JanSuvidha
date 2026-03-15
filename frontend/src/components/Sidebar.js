import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;
  const isCategoryActive = (cat) =>
    location.pathname === '/browse' && location.search === `?category=${encodeURIComponent(cat)}`;

  const linkClass = (path) => isActive(path) ? 'sidebar-link active' : 'sidebar-link';

  return (
    <>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
        <span className="mobile-logo-text">🇮🇳 JanSuvidha</span>
      </div>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🇮🇳</div>
          <span className="sidebar-logo-text">JanSuvidha</span>
        </div>

        <div className="sidebar-section-label">Main</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link to="/dashboard" className={linkClass('/dashboard')} onClick={() => setOpen(false)}>
            <span className="sidebar-link-icon">🏠</span> Dashboard
          </Link>
          <Link to="/checker" className={linkClass('/checker')} onClick={() => setOpen(false)}>
            <span className="sidebar-link-icon">🔍</span> Check Eligibility
          </Link>
          <Link to="/browse" className={isActive('/browse') && !location.search ? 'sidebar-link active' : 'sidebar-link'} onClick={() => setOpen(false)}>
            <span className="sidebar-link-icon">📋</span> Browse All Schemes
          </Link>
          <Link to="/history" className={linkClass('/history')} onClick={() => setOpen(false)}>
            <span className="sidebar-link-icon">🕐</span> My History
          </Link>
        </nav>

        <div className="sidebar-section-label" style={{ marginTop: 20 }}>Categories</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            ['🏠', 'Housing'],
            ['🏥', 'Health'],
            ['🎓', 'Education'],
            ['💼', 'Employment'],
            ['👩', 'Women'],
            ['🌾', 'Agriculture'],
            ['🛡️', 'Insurance'],
            ['🚀', 'Startup'],
          ].map(([icon, cat]) => (
            <Link
              key={cat}
              to={`/browse?category=${cat}`}
              className={isCategoryActive(cat) ? 'sidebar-link active' : 'sidebar-link'}
              style={{ fontSize: 13 }}
              onClick={() => setOpen(false)}
            >
              <span className="sidebar-link-icon">{icon}</span> {cat}
            </Link>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign out</button>
        </div>
      </aside>
    </>
  );
}