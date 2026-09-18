// ROADMAP: Section 2 & Phase 2 — Sector Performance Component
import React from 'react';
import { formatPercent } from '../../utils/formatters';

export function SectorBar({ sectors = [] }) {
  if (!sectors || sectors.length === 0) return null;

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '14px',
        backgroundColor: '#12121a',
        border: '1px solid #1e1e30',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0f5' }}>Sectoral Performance</h3>
        <span style={{ fontSize: '11px', color: '#606078' }}>NSE Indices</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {sectors.map((sec) => {
          const isPos = sec.changePercent >= 0;
          const color = isPos ? '#00c853' : '#ff1744';
          const bgBar = isPos ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255, 23, 68, 0.15)';
          const barWidth = Math.min(Math.abs(sec.changePercent) * 25, 100);

          return (
            <div
              key={sec.name}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#161622',
                border: '1px solid #1e1e30',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#f0f0f5' }}>{sec.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color }}>
                  {formatPercent(sec.changePercent)}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#222236',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${barWidth}%`,
                    backgroundColor: color,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SectorBar;
