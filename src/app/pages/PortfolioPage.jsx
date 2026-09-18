// ROADMAP: Section 5 & 11 — Virtual Paper Trading Portfolio Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../hooks/useTrade';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  ArrowUpRight,
  Zap,
  RefreshCw,
  BarChart3,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../utils/formatters';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { TableSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';

const ALLOCATION_COLORS = [
  '#6366f1',
  '#00c076',
  '#eab308',
  '#ec4899',
  '#3b82f6',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
];

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { data: portfolio, isLoading, refetch } = usePortfolio();

  const account = portfolio?.account || {
    cashBalance: 1000000,
    totalInvested: 0,
    totalCurrentValue: 0,
    portfolioTotalValue: 1000000,
    totalPL: 0,
    totalPLPercent: 0,
    dayTotalPL: 0,
  };

  const positions = portfolio?.positions || [];
  const isPositiveOverall = account.totalPL >= 0;
  const isPositiveDay = account.dayTotalPL >= 0;

  // Compute allocation breakdown
  const totalVal = account.portfolioTotalValue || 1000000;
  const cashPercent = totalVal > 0 ? ((account.cashBalance / totalVal) * 100).toFixed(1) : 100;

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
                  background: 'linear-gradient(135deg, #00c076, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <PieChart size={17} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Virtual Portfolio
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(0, 192, 118, 0.15)',
                  color: '#00c076',
                  border: '1px solid rgba(0, 192, 118, 0.3)',
                }}
              >
                LIVE HOLDINGS
              </span>
            </div>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: 0 }}>
              Real-time mark-to-market valuation, unrealized P&L, and asset allocation of your simulated trading holdings.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => refetch()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: '#10101c',
                border: '1px solid #222238',
                color: '#8888a6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => navigate('/trade')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Zap size={14} />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Hero Cards */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {/* 1. Total Portfolio Value */}
            <div
              style={{
                backgroundColor: '#0c0c16',
                borderRadius: '12px',
                border: '1px solid #1c1c2e',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#8888a6', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Portfolio Value
                </span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                  }}
                >
                  <BarChart3 size={15} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                ₹{formatIndianNumber(account.portfolioTotalValue)}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginTop: '6px',
                  color: isPositiveOverall ? '#00c076' : '#ff3b57',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isPositiveOverall ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                <span>
                  {isPositiveOverall ? '+' : ''}₹{formatIndianNumber(account.totalPL)} ({isPositiveOverall ? '+' : ''}
                  {account.totalPLPercent}%) Total Return
                </span>
              </div>
            </div>

            {/* 2. Total Unrealized P&L */}
            <div
              style={{
                backgroundColor: '#0c0c16',
                borderRadius: '12px',
                border: '1px solid #1c1c2e',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#8888a6', fontWeight: 600, textTransform: 'uppercase' }}>
                  Unrealized P&L
                </span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: isPositiveOverall ? 'rgba(0, 192, 118, 0.15)' : 'rgba(255, 59, 87, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isPositiveOverall ? '#00c076' : '#ff3b57',
                  }}
                >
                  {isPositiveOverall ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                </div>
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: isPositiveOverall ? '#00c076' : '#ff3b57',
                  letterSpacing: '-0.02em',
                }}
              >
                {isPositiveOverall ? '+' : ''}₹{formatIndianNumber(account.totalPL)}
              </div>
              <div style={{ fontSize: '12px', color: '#8888a6', marginTop: '6px' }}>
                Day Change:{' '}
                <span style={{ color: isPositiveDay ? '#00c076' : '#ff3b57', fontWeight: 700 }}>
                  {isPositiveDay ? '+' : ''}₹{formatIndianNumber(account.dayTotalPL)}
                </span>
              </div>
            </div>

            {/* 3. Invested Capital */}
            <div
              style={{
                backgroundColor: '#0c0c16',
                borderRadius: '12px',
                border: '1px solid #1c1c2e',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#8888a6', fontWeight: 600, textTransform: 'uppercase' }}>
                  Invested Capital
                </span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#eab308',
                  }}
                >
                  <Coins size={15} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                ₹{formatIndianNumber(account.totalInvested)}
              </div>
              <div style={{ fontSize: '12px', color: '#8888a6', marginTop: '6px' }}>
                Current Value: <span style={{ color: '#f0f0fa', fontWeight: 600 }}>₹{formatIndianNumber(account.totalCurrentValue)}</span>
              </div>
            </div>

            {/* 4. Available Virtual Cash */}
            <div
              style={{
                backgroundColor: '#0c0c16',
                borderRadius: '12px',
                border: '1px solid #1c1c2e',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#8888a6', fontWeight: 600, textTransform: 'uppercase' }}>
                  Available Cash
                </span>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6',
                  }}
                >
                  <Wallet size={15} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                ₹{formatIndianNumber(account.cashBalance)}
              </div>
              <div style={{ fontSize: '12px', color: '#8888a6', marginTop: '6px' }}>
                {cashPercent}% of total capital in cash
              </div>
            </div>
          </div>
        )}

        {/* Asset Allocation Breakdown Bar */}
        <div
          style={{
            backgroundColor: '#0c0c16',
            borderRadius: '12px',
            border: '1px solid #1c1c2e',
            padding: '18px 22px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={15} color="#818cf8" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Asset Allocation</span>
            </div>
            <span style={{ fontSize: '12px', color: '#8888a6' }}>
              {positions.length} Active Positions • Cash: {cashPercent}%
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div
            style={{
              height: '10px',
              borderRadius: '5px',
              backgroundColor: '#181828',
              display: 'flex',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            {/* Cash segment */}
            <div
              style={{
                width: `${cashPercent}%`,
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease',
              }}
              title={`Cash: ${cashPercent}%`}
            />
            {/* Holding segments */}
            {positions.map((pos, idx) => {
              const posPercent = totalVal > 0 ? ((pos.currentValue / totalVal) * 100).toFixed(1) : 0;
              const color = ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length];
              return (
                <div
                  key={pos.symbol}
                  style={{
                    width: `${posPercent}%`,
                    backgroundColor: color,
                    transition: 'width 0.3s ease',
                  }}
                  title={`${pos.symbol}: ${posPercent}%`}
                />
              );
            })}
          </div>

          {/* Legend Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              <span style={{ color: '#a0a0c0' }}>Cash ({cashPercent}%)</span>
            </div>
            {positions.map((pos, idx) => {
              const posPercent = totalVal > 0 ? ((pos.currentValue / totalVal) * 100).toFixed(1) : 0;
              const color = ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length];
              return (
                <div key={pos.symbol} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                  <span style={{ color: '#a0a0c0' }}>
                    {pos.symbol.replace('NSE:', '')} ({posPercent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Holdings Table */}
        <div
          style={{
            backgroundColor: '#0c0c16',
            borderRadius: '14px',
            border: '1px solid #1c1c2e',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid #1c1c2e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Stock Holdings ({positions.length})
              </h2>
              <span style={{ fontSize: '12px', color: '#8888a6' }}>
                Positions enriched with real-time Upstox market ticks
              </span>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '20px' }}>
              <TableSkeleton rows={5} />
            </div>
          ) : positions.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <PieChart size={40} color="#333348" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f0f5', margin: '0 0 6px' }}>
                No active stock holdings
              </h3>
              <p style={{ color: '#8888a6', fontSize: '13px', margin: '0 0 20px' }}>
                You have ₹10,00,000 in virtual trading capital ready to be deployed.
              </p>
              <button
                onClick={() => navigate('/trade')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Zap size={15} />
                <span>Place Your First Paper Trade</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #181828', color: '#686884', fontSize: '11.5px' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>INSTRUMENT</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>QTY</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>AVG PRICE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>LTP</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>INVESTED</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>CURRENT VALUE</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600 }}>UNREALIZED P&L</th>
                    <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => {
                    const isPos = pos.unrealizedPL >= 0;
                    const isDayPos = (pos.change ?? 0) >= 0;

                    return (
                      <tr
                        key={pos.symbol}
                        style={{
                          borderBottom: '1px solid #141424',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#10101c')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {/* Instrument */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                }}
                                onClick={() => navigate(`/stocks/${encodeURIComponent(pos.symbol)}`)}
                              >
                                {pos.symbol}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#8888a6' }}>{pos.name}</div>
                            </div>
                          </div>
                        </td>

                        {/* Qty */}
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: '#f0f0fa' }}>{pos.quantity}</td>

                        {/* Avg Price */}
                        <td style={{ padding: '14px 20px', color: '#c0c0d8' }}>₹{formatIndianNumber(pos.avgPrice)}</td>

                        {/* Current LTP */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff' }}>₹{formatIndianNumber(pos.currentPrice)}</div>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: isDayPos ? '#00c076' : '#ff3b57',
                            }}
                          >
                            {isDayPos ? '+' : ''}
                            {(pos.changePercent ?? 0).toFixed(2)}%
                          </div>
                        </td>

                        {/* Invested */}
                        <td style={{ padding: '14px 20px', color: '#c0c0d8' }}>
                          ₹{formatIndianNumber(pos.investedValue)}
                        </td>

                        {/* Current Value */}
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: '#ffffff' }}>
                          ₹{formatIndianNumber(pos.currentValue)}
                        </td>

                        {/* Unrealized P&L */}
                        <td style={{ padding: '14px 20px' }}>
                          <div
                            style={{
                              fontWeight: 800,
                              color: isPos ? '#00c076' : '#ff3b57',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            <span>
                              {isPos ? '+' : ''}₹{formatIndianNumber(pos.unrealizedPL)}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isPos ? '#00c076' : '#ff3b57',
                            }}
                          >
                            {isPos ? '+' : ''}
                            {pos.unrealizedPLPercent}%
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => navigate(`/trade?symbol=${encodeURIComponent(pos.symbol)}`)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#a5b4fc',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Trade
                            </button>
                            <button
                              onClick={() => navigate(`/stocks/${encodeURIComponent(pos.symbol)}`)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#161626',
                                border: '1px solid #222238',
                                color: '#8888a6',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              <ArrowUpRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
