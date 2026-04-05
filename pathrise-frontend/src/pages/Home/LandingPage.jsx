import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiZap, FiTarget, FiBarChart } from 'react-icons/fi';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="nav glass">
        <div className="logo">
          Path<span>Rise</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Jobs</Link>
          <Link to="/login" className="nav-link">Freelance</Link>
          <Link to="/login" className="nav-link">Companies</Link>
          <Link to="/login" className="nav-link">About</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Login</Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-tag">Enterprise Talent Platform</div>
          <h1 className="hero-title text-gradient">
            Hire smarter.<br />Get hired faster.
          </h1>
          <p className="hero-subtitle">
            The next-generation recruitment platform connecting top talent with industry leaders. Powered by data, built for efficiency.
          </p>
          <div className="hero-actions">
            <Link to="/signup?role=Employer" className="btn-primary">
              Find Talent <FiArrowRight />
            </Link>
            <Link to="/signup?role=Candidate" className="btn-secondary">
              Find Jobs
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon"><FiZap size={24} /></div>
            <h3 className="feature-title">Fast Hiring</h3>
            <p className="feature-desc">Reduce time-to-hire by 40% with our automated screening and matching algorithms.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiTarget size={24} /></div>
            <h3 className="feature-title">Top 1% Talent</h3>
            <p className="feature-desc">Access a curated pool of pre-vetted professionals ready to make an impact from day one.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiBarChart size={24} /></div>
            <h3 className="feature-title">Data Driven</h3>
            <p className="feature-desc">Make informed decisions with deep analytics on candidate performance and market trends.</p>
          </div>
        </section>

        <section className="stats">
          <div className="stats-grid">
            <div className="stat-item">
              <h2 className="text-gradient">10k+</h2>
              <p>Active Jobs</p>
            </div>
            <div className="stat-item">
              <h2 className="text-gradient">50k+</h2>
              <p>Candidates</p>
            </div>
            <div className="stat-item">
              <h2 className="text-gradient">500+</h2>
              <p>Top Companies</p>
            </div>
            <div className="stat-item">
              <h2 className="text-gradient">95%</h2>
              <p>Success Rate</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 PathRise Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
