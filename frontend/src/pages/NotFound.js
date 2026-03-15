import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--font-b)', textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🇮🇳</div>
      <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 64, fontWeight: 800, color: 'var(--saffron)', marginBottom: 8 }}>404</h1>
      <p style={{ color: 'var(--muted)', fontSize: 18, marginBottom: 8 }}>Page not found</p>
      <p style={{ color: 'var(--dim)', fontSize: 14, marginBottom: 32 }}>This scheme doesn't exist in our database!</p>
      <Link to="/dashboard" style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,var(--saffron),#e67e00)', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 15 }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}
