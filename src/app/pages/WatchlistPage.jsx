// ROADMAP: Section 5 & 11 — Watchlist Page Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useWatchlist';
import { Star, Plus, Trash2, Zap, ArrowUpRight, TrendingUp, TrendingDown, Search, Activity } from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../utils/formatters';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBoundary from '../components/common/ErrorBoundary';

const POPULAR_ADD_SUGGESTIONS = ['NSE:BHARTIARTL', 'NSE:TATAMOTORS', 'NSE:ITC', 'NSE:LT', 'NSE:SBIN', 'NSE:MARUTI'];

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const [addInput, setAddInput] = useState('');

  const handleAddSymbol = (sym) => {
    const symbolToAdd = (sym || addInput).trim().toUpperCase();
    if (!symbolToAdd) return;
    const formatted = symbolToAdd.includes(':') ? symbolToAdd : `NSE:${symbolToAdd}`;
    addMutation.mutate(formatted, {
      onSuccess: () => setAddInput(''),
    });
  };

  const handleRemove = (e, symbol) => {
    e.stopPropagation();
    removeMutation.mutate(symbol);
  };

  const advances = items.filter((i) => i.change >= 0).length;
  const declines = items.filter((i) => i.change < 0).length;

  return (
    <ErrorBoundary>
      <div style={{ padding: '28px 36px 64px', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '1px solid #1c1c2e',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Star size={17} fill="#ffffff" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                My Watchlist
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#1b1b2d',
                  color: '#eab308',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                }}
              >
                {items.length} TRACKED
              </span>
            </div>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: 0 }}>
              Real-time multi-stock tracker enriched with live NSE/BSE tick feeds and direct paper trading shortcuts.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0e0e18', padding: '8px 16px', borderRadius: '10px', border: '1px solid #1c1c2e' }}>
            <span style={{ fontSize: '12px', color: '#8888a6' }}>Breadth:</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#00c076', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={13} /> {advances} Up
            </span>
            <span style={{ color: '#333348' }}>•</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff3b57', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={13} /> {declines} Down
            </span>
          </div>
        </div>

        {/* Add Symbol Input Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px',
            backgroundColor: '#0d0d16',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid #1e1e32',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={15} color="#6366f1" />
            <input
              type="text"
              placeholder="Add stock symbol (e.g. RELIANCE, TCS, INFY)..."
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f0f0fa',
                fontSize: '13.5px',
              }}
            />
            <button
              onClick={() => handleAddSymbol()}
              disabled={!addInput.trim() || addMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: addInput.trim() ? '#6366f1' : '#1c1c2e',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: addInput.trim() ? 'pointer' : 'default',
              }}
            >
              <Plus size={13} /> Add Symbol
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#686884' }}>Suggestions:</span>
            {POPULAR_ADD_SUGGESTIONS.slice(0, 4).map((sym) => {
              const clean = sym.replace('NSE:', '');
              const alreadyHas = items.some((i) => i.symbol === sym);
              if (alreadyHas) return null;
              return (
                <button
                  key={sym}
                  onClick={() => handleAddSymbol(sym)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#141422',
                    border: '1px solid #24243a',
                    color: '#818cf8',
                    cursor: 'pointer',
                  }}
                >
                  +{clean}
                </button>
              );
            })}
          </div>
        </div>

        {/* Watchlist Table */}
        <div
          style={{
            backgroundColor: '#0d0d16',
            borderRadius: '16px',
            border: '1px solid #1e1e32',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 2fr) minmax(110px, 1fr) minmax(130px, 1fr) minmax(140px, 1fr) minmax(120px, 1fr) 140px',
              padding: '14px 20px',
              backgroundColor: '#090910',
              borderBottom: '1px solid #1c1c2e',
              fontSize: '11px',
              fontWeight: 700,
              color: '#656584',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>Instrument</span>
            <span style={{ textAlign: 'right' }}>LTP</span>
            <span style={{ textAlign: 'right' }}>Change (%)</span>
            <span style={{ textAlign: 'right' }}>Day High / Low</span>
            <span style={{ textAlign: 'right' }}>Volume</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div style={{ padding: '16px' }}>
              <TableSkeleton rows={6} />
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                padding: '64px 20px',
                textAlign: 'center',
                color: '#686888',
              }}
            >
              <Star size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0fa', marginBottom: '6px' }}>
                Your watchlist is empty
              </div>
              <div style={{ fontSize: '13px', marginBottom: '18px' }}>
                Track your favorite NSE and BSE stocks with real-time ticks and instant execution.
              </div>
              <button
                onClick={() => handleAddSymbol('NSE:RELIANCE')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Add RELIANCE to Watchlist
              </button>
            </div>
          ) : (
            <div>
              {items.map((item, idx) => {
                const isPos = item.change >= 0;
                const color = isPos ? '#00c076' : '#ff3b57';
                return (
                  <div
                    key={item.symbol}
                    onClick={() => navigate(`/stocks/${item.symbol}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 2fr) minmax(110px, 1fr) minmax(130px, 1fr) minmax(140px, 1fr) minmax(120px, 1fr) 140px',
                      alignItems: 'center',
                      padding: '14px 20px',
                      borderBottom: idx === items.length - 1 ? 'none' : '1px solid #141422',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#131320')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Symbol & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#18182a',
                          border: '1px solid #26263e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#818cf8',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {item.symbol.includes(':') ? item.symbol.split(':')[1].substring(0, 2) : item.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: '#f0f0fa', fontSize: '13.5px' }}>
                            {item.symbol}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: '#1b1b2d',
                              color: '#8b8ba8',
                            }}
                          >
                            {item.exchange || 'NSE'}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#7a7a96', marginTop: '2px' }}>
                          {item.name}
                        </div>
                      </div>
                    </div>

                    {/* LTP */}
                    <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                      ₹{formatIndianNumber(item.ltp)}
                    </div>

                    {/* Change & % */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color }}>
                        {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                      <span style={{ fontSize: '11px', color: '#777790', fontFamily: "'JetBrains Mono', monospace" }}>
                        {isPos ? '+' : ''}₹{formatIndianNumber(Math.abs(item.change))}
                      </span>
                    </div>

                    {/* Day Range */}
                    <div style={{ textAlign: 'right', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: '#00c076' }}>₹{formatIndianNumber(item.high || item.ltp)}</span>
                      <span style={{ color: '#55556a', margin: '0 4px' }}>/</span>
                      <span style={{ color: '#ff3b57' }}>₹{formatIndianNumber(item.low || item.ltp)}</span>
                    </div>

                    {/* Volume */}
                    <div style={{ textAlign: 'right', fontSize: '12.5px', color: '#9d9db8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatIndianNumber(item.volume || 1000000)}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trade?symbol=${encodeURIComponent(item.symbol)}`);
                        }}
                        title="Execute Trade"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #282845',
                          color: '#818cf8',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4f46e5';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1a1a2e';
                          e.currentTarget.style.color = '#818cf8';
                        }}
                      >
                        <Zap size={11} /> Trade
                      </button>

                      <button
                        onClick={(e) => handleRemove(e, item.symbol)}
                        title="Remove from Watchlist"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#656580',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3b57')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#656580')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
