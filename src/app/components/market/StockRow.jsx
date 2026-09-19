// Flagship Stock Row — Company logo + premium financial data display
import React from 'react';
import { formatINR, formatPercent, formatVolume } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CompanyLogo from '../common/CompanyLogo';

export function StockRow({ stock, onClick }) {
  if (!stock) return null;

  const isPos = stock.change >= 0;
  const cleanSym = stock.symbol.replace('NSE:', '').replace('BSE:', '');

  return (
    <div
      onClick={onClick}
      className="stock-row"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '11px 14px',
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, 2fr) minmax(90px, 1fr) minmax(110px, 1fr) minmax(80px, 1fr)',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Company Logo + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
        <CompanyLogo symbol={cleanSym} size={34} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {cleanSym}
            </span>
            <span style={{
              fontSize: '9px',
              padding: '1px 5px',
              borderRadius: '3px',
              backgroundColor: 'rgba(59,130,246,0.12)',
              color: 'var(--accent-bright)',
              border: '1px solid rgba(59,130,246,0.25)',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}>
              NSE
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stock.name}
          </span>
        </div>
      </div>

      {/* LTP */}
      <div className="num-tabular" style={{ textAlign: 'right', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        {formatINR(stock.ltp)}
      </div>

      {/* Change Pill */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
        <span
          className="num-tabular"
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: isPos ? 'var(--positive-text)' : 'var(--negative-text)',
            backgroundColor: isPos ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
            border: `1px solid ${isPos ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
            padding: '2px 7px',
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          {isPos ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {formatPercent(stock.changePercent)}
        </span>
        <span className="num-tabular" style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>
          {isPos ? '+' : ''}{stock.change.toFixed(2)}
        </span>
      </div>

      {/* Volume */}
      <div className="num-tabular" style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
        {formatVolume(stock.volume)}
      </div>
    </div>
  );
}

export default StockRow;
