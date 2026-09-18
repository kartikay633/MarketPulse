// ROADMAP: Section 2 & Phase 2 — Market Breadth Bar Component
import React from 'react';
import { formatNumber } from '../../utils/formatters';

export function MarketBreadthBar({ breadth }) {
  if (!breadth) return null;

  const { advancing = 0, declining = 0, unchanged = 0 } = breadth;
  const total = advancing + declining + unchanged || 1;

  const advPct = ((advancing / total) * 100).toFixed(1);
  const decPct = ((declining / total) * 100).toFixed(1);
  const unchPct = ((unchanged / total) * 100).toFixed(1);

  const adRatio = declining > 0 ? (advancing / declining).toFixed(2) : advancing;

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: '12px',
        backgroundColor: '#12121a',
        border: '1px solid #1e1e30',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0f5' }}>Market Breadth (NSE)</span>
          <span style={{ fontSize: '11px', color: '#606078' }}>A/D Ratio: <strong style={{ color: '#f0f0f5' }}>{adRatio}</strong></span>
        </div>
        <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
          <span style={{ color: '#00c853', fontWeight: 600 }}>
            {formatNumber(advancing, 0)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#a0a0b8' }}>Adv ({advPct}%)</span>
          </span>
          <span style={{ color: '#ff1744', fontWeight: 600 }}>
            {formatNumber(declining, 0)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#a0a0b8' }}>Dec ({decPct}%)</span>
          </span>
          <span style={{ color: '#a0a0b8', fontWeight: 500 }}>
            {formatNumber(unchanged, 0)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#606078' }}>Unch</span>
          </span>
        </div>
      </div>

      {/* Segmented Breadth Bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#1a1a28',
          gap: '2px',
        }}
      >
        <div
          style={{
            width: `${advPct}%`,
            backgroundColor: '#00c853',
            transition: 'width 0.4s ease',
          }}
          title={`Advancing: ${advancing}`}
        />
        <div
          style={{
            width: `${unchPct}%`,
            backgroundColor: '#606078',
            transition: 'width 0.4s ease',
          }}
          title={`Unchanged: ${unchanged}`}
        />
        <div
          style={{
            width: `${decPct}%`,
            backgroundColor: '#ff1744',
            transition: 'width 0.4s ease',
          }}
          title={`Declining: ${declining}`}
        />
      </div>
    </div>
  );
}

export default MarketBreadthBar;
