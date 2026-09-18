// ROADMAP: Section 5 & Phase 1 — Auth Layout
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        backgroundImage: `
          radial-gradient(ellipse at 50% -20%, rgba(51, 102, 255, 0.15), transparent 70%),
          radial-gradient(circle at 10% 90%, rgba(39, 200, 255, 0.05), transparent 40%),
          radial-gradient(circle at 90% 10%, rgba(51, 102, 255, 0.05), transparent 40%)
        `,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(30, 30, 48, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 30, 48, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Logo */}
      <div style={{ marginBottom: '32px', textAlign: 'center', zIndex: 1 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a, #3366ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(51, 102, 255, 0.4)',
              border: '1px solid rgba(51, 102, 255, 0.6)',
            }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#fff' }}>M</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.15em', color: '#f0f0f5' }}>
              MARKET
            </span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.15em', color: '#3366ff' }}>
              PULSE
            </span>
          </div>
        </Link>
        <p style={{ fontSize: '12px', color: '#a0a0b8', marginTop: '6px', letterSpacing: '0.05em' }}>
          INDIAN FINANCIAL INTELLIGENCE PLATFORM
        </p>
      </div>

      {/* Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(18, 18, 26, 0.85)',
          border: '1px solid rgba(42, 42, 68, 0.8)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Outlet />
      </div>

      {/* Footer copyright */}
      <div style={{ marginTop: '32px', fontSize: '11px', color: '#606078', textAlign: 'center', zIndex: 1 }}>
        &copy; {new Date().getFullYear()} Market Pulse • NSE & BSE Equities Analytics
      </div>
    </div>
  );
}
