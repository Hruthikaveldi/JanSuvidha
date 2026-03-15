import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar','Lakshadweep','Dadra & Nagar Haveli'];

export default function Checker() {
  const [form, setForm] = useState({ age: '', income: '', gender: '', caste: '', state: '', occupation: '' });
  const [results, setResults] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true); setResults(null);
    try {
      const res = await axios.post('/api/schemes/check', form);
      setResults(res.data);
      setActiveCategory('All');
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) { setError(err.response?.data?.error || 'Check failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const visibleSchemes = results
    ? (activeCategory === 'All' ? results.schemes : results.schemes.filter(s => s.category === activeCategory))
    : [];

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🔍 Check Eligibility</h1>
        <p className="page-sub">Fill in your details below — we'll instantly show every government scheme you qualify for.</p>

        {error && <div className="error-msg" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

        <div className="checker-card">
          <div className="checker-title">👤 Your Profile</div>
          <p className="checker-sub">All fields are required. Your data is used only for scheme matching.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" placeholder="e.g. 28" min="0" max="100"
                  value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Family Income (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 250000" min="0"
                  value={form.income} onChange={e => setForm({...form, income: e.target.value})} required />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Caste / Category</label>
                <select className="form-select" value={form.caste} onChange={e => setForm({...form, caste: e.target.value})} required>
                  <option value="">Select category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="ews">EWS (Economically Weaker Section)</option>
                  <option value="muslim">Minority – Muslim</option>
                  <option value="christian">Minority – Christian</option>
                  <option value="sikh">Minority – Sikh</option>
                  <option value="buddhist">Minority – Buddhist</option>
                  <option value="jain">Minority – Jain</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State / UT</label>
                <select className="form-select" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Occupation</label>
                <select className="form-select" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} required>
                  <option value="">Select occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer / Agriculture</option>
                  <option value="daily wage">Daily Wage Worker</option>
                  <option value="labourer">Labourer / Construction Worker</option>
                  <option value="self employed">Self Employed / Small Business</option>
                  <option value="domestic worker">Domestic Worker</option>
                  <option value="government employee">Government Employee</option>
                  <option value="private employee">Private Sector Employee</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="sanitation worker">Sanitation Worker</option>
                  <option value="construction worker">Construction Worker</option>
                </select>
              </div>
            </div>

            <button className="check-btn" type="submit" disabled={loading}>
              {loading ? '⏳ Checking all 44 schemes...' : '🔍 Find My Eligible Schemes'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div id="results-section">
            <div className="results-header">
              <div>
                <div className="results-count">
                  🎉 You qualify for <span>{results.total}</span> schemes
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  Across {results.categories.length} categories — click any scheme to apply
                </div>
              </div>
              <div className="chakra-badge">
                🔵 Based on your profile
              </div>
            </div>

            <div className="tricolor" />

            {/* Category filter tabs */}
            <div className="category-tabs">
              <div className={`cat-tab ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => setActiveCategory('All')}>
                All ({results.total})
              </div>
              {results.categories.map(cat => (
                <div key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat} ({results.grouped[cat]?.length || 0})
                </div>
              ))}
            </div>

            {/* Scheme cards */}
            <div className="scheme-grid">
              {visibleSchemes.map(scheme => (
                <div key={scheme.id} className="scheme-card">
                  <div className="scheme-top">
                    <span className="scheme-icon">{scheme.icon}</span>
                    <div>
                      <div className="scheme-name">{scheme.name}</div>
                      <span className="scheme-cat">{scheme.category}</span>
                    </div>
                  </div>
                  <p className="scheme-desc">{scheme.description}</p>
                  <div className="scheme-benefit">
                    <span className="scheme-benefit-icon">💰</span>
                    <span>{scheme.benefit}</span>
                  </div>
                  {scheme.eligibility?.conditions?.length > 0 && (
                    <div className="scheme-conditions">
                      {scheme.eligibility.conditions.slice(0,2).map((c, i) => (
                        <div key={i} className="condition-item">
                          <span>✓</span><span>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="scheme-apply" style={{ marginTop: 14, display: 'block' }}>
                    Apply Now →
                  </a>
                </div>
              ))}
            </div>

            {results.total === 0 && (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No schemes found for your profile</div>
                <div className="empty-sub">Try adjusting your income or occupation details</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
