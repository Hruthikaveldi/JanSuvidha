import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function Browse() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  // Always read activeCategory FROM the URL — single source of truth
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    axios.get('/api/schemes/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;
    axios.get('/api/schemes', { params })
      .then(r => setSchemes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  // When user clicks a category tab, update the URL
  const handleCategoryClick = (cat) => {
    if (cat === '') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">📋 Browse All Schemes</h1>
        <p className="page-sub">
          Explore all {schemes.length} government schemes.
          {activeCategory && <span> Showing: <strong style={{ color: 'var(--saffron)' }}>{activeCategory}</strong></span>}
        </p>

        <div className="browse-header">
          <input
            className="search-input"
            placeholder="Search schemes by name, benefit, keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs" style={{ marginBottom: 20 }}>
          <div
            className={`cat-tab ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            All
          </div>
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`cat-tab ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name} ({cat.count})
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : schemes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No schemes found</div>
            <div className="empty-sub">Try a different search term or category</div>
          </div>
        ) : (
          <div className="scheme-grid">
            {schemes.map(scheme => (
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
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="scheme-apply"
                  style={{ display: 'block', marginTop: 14 }}
                >
                  Apply Now →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}