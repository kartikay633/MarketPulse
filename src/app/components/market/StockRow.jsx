// ROADMAP: Section 5 & Phase 2 — Stock Row Component
import React from 'react';
import { formatINR, formatPercent, formatVolume } from '../../utils/formatters';

export function StockRow({ stock, onClick }) {
  if (!stock) return null;

  const isPos = stock.change >= 0;
  const color = isPos ? '#00c853' : '#ff1744';
  const cleanSym = stock.symbol.replace('NSE:', '').replace('BSE:', '');

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, 2fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr)',
        alignItems: 'center',
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: '#12121a',
        border: '1px solid #1a1a28',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#181824';
        e.currentTarget.style.borderColor = 'rgba(51, 102, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#12121a';
        e.currentTarget.style.borderColor = '#1a1a28';
      }}
    >
      {/* Symbol & Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0f5' }}>{cleanSym}</span>
          <span style={{ fontSize: '10px', color: '#606078', background: '#1a1a28', padding: '1px 5px', borderRadius: '3px' }}>NSE</span>
        </div>
        <span style={{ fontSize: '11px', color: '#a0a0b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {stock.name}
        </span>
      </div>

      {/* LTP */}
      <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#f0f0f5' }}>
        {formatINR(stock.ltp)}
      </div>

      {/* Change & % */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color }}>
          {formatPercent(stock.changePercent)}
        </span>
        <span style={{ fontSize: '10px', color: '#a0a0b8' }}>
          {isPos ? '+' : ''}{stock.change.toFixed(2)}
        </span>
      </div>

      {/* Volume */}
      <div style={{ textAlign: 'right', fontSize: '12px', color: '#a0a0b8', fontFamily: "'JetBrains Mono', monospace" }}>
        {formatVolume(stock.volume)}
      </div>
    </div>
  );
}

export default StockRow;
