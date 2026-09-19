// ROADMAP: Section 5, Phase 1 & Design Refinement — Institutional Auth Layout
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* Brand Header with Authoritative Official Logo */}
      <div className="auth-brand">
        <Link to="/" className="auth-brand-link">
          <img
            src="/official_logo.png"
            alt="Market Pulse Logo"
            className="auth-brand-logo"
          />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span className="auth-brand-market">MARKET</span>
            <span className="auth-brand-pulse">PULSE</span>
          </div>
        </Link>
        <p className="auth-subtitle">
          INDIAN EQUITIES ANALYTICS & INTELLIGENCE
        </p>
      </div>

      {/* Solid Terminal Auth Card */}
      <div className="auth-card">
        <Outlet />
      </div>

      {/* Clean Institutional Footer */}
      <div className="auth-footer">
        Institutional-grade analytics & simulated execution • NSE / BSE Live
      </div>
    </div>
  );
}
