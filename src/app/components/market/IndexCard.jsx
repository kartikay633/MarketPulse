// ROADMAP: Section 5 & Phase 2 — Index Card Component
import React from 'react';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function IndexCard({ index }) {
  if (!index) return null;

  const isPositive = index.change >= 0;
  const isVix = index.symbol === 'INDIA_VIX';

  // For VIX, lower is calm/bullish, higher is fear/volatility
  const accentColor = isPositive ? '#00c853' : '#ff1744';
  const bgTint = isPositive ? 'rgba(0, 200, 83, 0.06)' : 'rgba(255, 23, 68, 0.06)';
  const borderTint = isPositive ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 23, 68, 0.2)';

  // Calculate day range percentage (low to high)
  const range = (index.high && index.low && index.high > index.low)
    ? Math.min(Math.max(((index.value - index.low) / (index.high - index.low)) * 100, 0), 100)
    : 50;

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '14px',
        backgroundColor: '#12121a',
        border: '1px solid #1e1e30',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderTint;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${bgTint}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e1e30';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      {/* Subtle background ambient corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: bgTint,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header: Name & Change Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#a0a0b8', letterSpacing: '0.04em' }}>
          {index.name}
        </span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: bgTint,
            border: `1px solid ${borderTint}`,
            color: accentColor,
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{formatPercent(index.changePercent)}</span>
        </div>
      </div>

      {/* Hero Index Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', zIndex: 1 }}>
        <span
          style={{
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#f0f0f5',
            letterSpacing: '-0.02em',
          }}
        >
          {formatNumber(index.value, 2)}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 500, color: accentColor }}>
          {isPositive ? '+' : ''}{formatNumber(index.change, 2)}
        </span>
      </div>

      {/* Day's Range Indicator */}
      {index.low && index.high && (
        <div style={{ zIndex: 1, marginTop: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#606078', marginBottom: '4px' }}>
            <span>L: {formatNumber(index.low, 1)}</span>
            <span>H: {formatNumber(index.high, 1)}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#1a1a28',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${range}%`,
                background: `linear-gradient(90deg, #1e3a8a, ${accentColor})`,
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default IndexCard;
