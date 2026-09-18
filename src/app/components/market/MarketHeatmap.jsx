// ROADMAP: Section 5, 8 & 14 — Indian Equity Market Treemap Heatmap
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Layers, ArrowUpRight, Zap } from 'lucide-react';
import { formatIndianNumber } from '../../utils/formatters';

const HEATMAP_DATA = [
  {
    sector: 'Banking & Financials',
    weight: 35,
    stocks: [
      { symbol: 'NSE:HDFCBANK', name: 'HDFC Bank', ltp: 731.00, change: 18.00, changePercent: 2.46, weight: 11 },
      { symbol: 'NSE:ICICIBANK', name: 'ICICI Bank', ltp: 1245.50, change: 14.20, changePercent: 1.15, weight: 8 },
      { symbol: 'NSE:SBIN', name: 'State Bank of India', ltp: 996.20, change: 7.50, changePercent: 0.75, weight: 6 },
      { symbol: 'NSE:KOTAKBANK', name: 'Kotak Mahindra Bank', ltp: 1780.00, change: -12.40, changePercent: -0.69, weight: 4 },
      { symbol: 'NSE:AXISBANK', name: 'Axis Bank', ltp: 1188.00, change: 8.50, changePercent: 0.72, weight: 4 },
      { symbol: 'NSE:BAJFINANCE', name: 'Bajaj Finance', ltp: 6920.00, change: -45.00, changePercent: -0.65, weight: 4 },
    ],
  },
  {
    sector: 'Technology & Software',
    weight: 22,
    stocks: [
      { symbol: 'NSE:TCS', name: 'Tata Consultancy Services', ltp: 2105.00, change: -85.00, changePercent: -4.04, weight: 10 },
      { symbol: 'NSE:INFY', name: 'Infosys Ltd', ltp: 1051.40, change: -7.20, changePercent: -0.68, weight: 7 },
      { symbol: 'NSE:HCLTECH', name: 'HCL Technologies', ltp: 1680.00, change: 15.60, changePercent: 0.94, weight: 3 },
      { symbol: 'NSE:WIPRO', name: 'Wipro Limited', ltp: 520.00, change: 3.10, changePercent: 0.60, weight: 2 },
    ],
  },
  {
    sector: 'Energy & Power',
    weight: 18,
    stocks: [
      { symbol: 'NSE:RELIANCE', name: 'Reliance Industries', ltp: 2980.50, change: 65.10, changePercent: 2.23, weight: 12 },
      { symbol: 'NSE:NTPC', name: 'NTPC Limited', ltp: 385.00, change: 4.20, changePercent: 1.10, weight: 3 },
      { symbol: 'NSE:ONGC', name: 'ONGC', ltp: 295.40, change: -2.10, changePercent: -0.71, weight: 3 },
    ],
  },
  {
    sector: 'Automobiles & Mobility',
    weight: 12,
    stocks: [
      { symbol: 'NSE:TATAMOTORS', name: 'Tata Motors', ltp: 303.80, change: -10.70, changePercent: -3.52, weight: 5 },
      { symbol: 'NSE:MARUTI', name: 'Maruti Suzuki', ltp: 12450.00, change: 185.00, changePercent: 1.51, weight: 4 },
      { symbol: 'NSE:M&M', name: 'Mahindra & Mahindra', ltp: 2850.00, change: 32.00, changePercent: 1.14, weight: 3 },
    ],
  },
  {
    sector: 'Consumer Goods & FMCG',
    weight: 10,
    stocks: [
      { symbol: 'NSE:ITC', name: 'ITC Limited', ltp: 262.30, change: -3.90, changePercent: -1.49, weight: 5 },
      { symbol: 'NSE:HINDUNILVR', name: 'Hindustan Unilever', ltp: 2380.00, change: 18.50, changePercent: 0.78, weight: 5 },
    ],
  },
];

function getChangeColor(pct) {
  if (pct >= 2.0) return '#059669'; // Deep Green
  if (pct >= 0.5) return '#10b981'; // Vibrant Green
  if (pct > -0.5) return '#374151'; // Neutral Slate
  if (pct > -2.0) return '#e11d48'; // Soft Red
  return '#be123c'; // Deep Red
}

export default function MarketHeatmap() {
  const navigate = useNavigate();
  const [hoveredStock, setHoveredStock] = useState(null);

  return (
    <div
      style={{
        backgroundColor: '#0c0c16',
        borderRadius: '14px',
        border: '1px solid #1c1c2e',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={17} color="#818cf8" />
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Indian Equities Market Treemap
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
              }}
            >
              NIFTY 50 WEIGHTS
            </span>
          </div>
          <p style={{ color: '#8888a6', fontSize: '13px', margin: '4px 0 0' }}>
            Interactive heatmap colored by % day change and sized by market capitalization weight.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#8888a6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#be123c' }} />
            <span>&lt; -2%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#e11d48' }} />
            <span>-0.5% to -2%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#374151' }} />
            <span>Neutral</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
            <span>+0.5% to +2%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#059669' }} />
            <span>&gt; +2%</span>
          </div>
        </div>
      </div>

      {/* Sector Groups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {HEATMAP_DATA.map((group) => (
          <div
            key={group.sector}
            style={{
              backgroundColor: '#07070f',
              borderRadius: '10px',
              border: '1px solid #181828',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
              <span style={{ fontWeight: 700, color: '#a0a0c8' }}>{group.sector}</span>
              <span style={{ color: '#686884' }}>{group.weight}% Mkt Wt</span>
            </div>

            {/* Stocks in this sector */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px',
                flex: 1,
              }}
            >
              {group.stocks.map((stk) => {
                const bg = getChangeColor(stk.changePercent);
                const isPos = stk.changePercent >= 0;

                return (
                  <div
                    key={stk.symbol}
                    onClick={() => navigate(`/stocks/${encodeURIComponent(stk.symbol)}`)}
                    onMouseEnter={() => setHoveredStock(stk)}
                    onMouseLeave={() => setHoveredStock(null)}
                    style={{
                      backgroundColor: bg,
                      borderRadius: '8px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '75px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                      {stk.symbol.replace('NSE:', '')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                      ₹{formatIndianNumber(stk.ltp)}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      <span>
                        {isPos ? '+' : ''}
                        {stk.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hover Information Banner */}
      {hoveredStock && (
        <div
          style={{
            marginTop: '16px',
            backgroundColor: '#121222',
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #282845',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>{hoveredStock.symbol}</span>
            <span style={{ color: '#8888a6' }}>• {hoveredStock.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>₹{formatIndianNumber(hoveredStock.ltp)}</span>
            <span
              style={{
                fontWeight: 700,
                color: hoveredStock.changePercent >= 0 ? '#00c076' : '#ff3b57',
              }}
            >
              {hoveredStock.changePercent >= 0 ? '+' : ''}
              {hoveredStock.changePercent.toFixed(2)}%
            </span>
            <span style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              Click to view chart <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
