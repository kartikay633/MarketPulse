// ROADMAP: Section 5 & 12 — Price Alerts Management Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlerts, useCreateAlert, useDeleteAlert } from '../hooks/useAlerts';
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../utils/formatters';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

const QUICK_ALERT_SUGGESTIONS = [
  { symbol: 'NSE:RELIANCE', defaultTarget: 3050, condition: 'ABOVE' },
  { symbol: 'NSE:TCS', defaultTarget: 2000, condition: 'BELOW' },
  { symbol: 'NSE:HDFCBANK', defaultTarget: 750, condition: 'ABOVE' },
  { symbol: 'NSE:INFY', defaultTarget: 1100, condition: 'ABOVE' },
];

export default function AlertsPage() {
  const navigate = useNavigate();
  const { data: alerts = [], isLoading, refetch } = useAlerts();
  const createMutation = useCreateAlert();
  const deleteMutation = useDeleteAlert();

  // New alert form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [symbol, setSymbol] = useState('NSE:RELIANCE');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('ABOVE');
  const [note, setNote] = useState('');

  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'TRIGGERED'

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const triggeredAlerts = alerts.filter((a) => a.status === 'TRIGGERED');

  const filteredAlerts = alerts.filter((a) => {
    if (filterTab === 'ACTIVE') return a.status === 'ACTIVE';
    if (filterTab === 'TRIGGERED') return a.status === 'TRIGGERED';
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!symbol || !targetPrice) return;

    const formattedSym = symbol.trim().toUpperCase().includes(':')
      ? symbol.trim().toUpperCase()
      : `NSE:${symbol.trim().toUpperCase()}`;

    createMutation.mutate(
      {
        symbol: formattedSym,
        targetPrice: parseFloat(targetPrice),
        condition,
        note,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setTargetPrice('');
          setNote('');
        },
      }
    );
  };

  const handleQuickAdd = (item) => {
    setSymbol(item.symbol);
    setTargetPrice(item.defaultTarget.toString());
    setCondition(item.condition);
    setShowCreateModal(true);
  };

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
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <BellRing size={17} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Price Triggers & Alerts
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                {activeAlerts.length} ACTIVE
              </span>
            </div>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: 0 }}>
              Live threshold triggers monitoring NSE/BSE equity prices in real-time with automated trigger detection.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowCreateModal(!showCreateModal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              }}
            >
              <Plus size={15} />
              <span>Set New Alert</span>
            </button>
          </div>
        </div>

        {/* Inline / Expandable Creation Form */}
        {showCreateModal && (
          <div
            style={{
              backgroundColor: '#0d0d18',
              borderRadius: '14px',
              border: '1px solid #282845',
              padding: '24px',
              marginBottom: '28px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Configure Price Alert
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#8888a6', cursor: 'pointer', fontSize: '13px' }}
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* Symbol */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#a0a0c0', marginBottom: '6px' }}>
                  STOCK SYMBOL
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. NSE:RELIANCE"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#141424',
                    border: '1px solid #282845',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#a0a0c0', marginBottom: '6px' }}>
                  CONDITION
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#141424',
                    border: '1px solid #282845',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="ABOVE">Price Rises Above (≥)</option>
                  <option value="BELOW">Price Drops Below (≤)</option>
                </select>
              </div>

              {/* Target Price */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#a0a0c0', marginBottom: '6px' }}>
                  TARGET PRICE (₹)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 3100.00"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#141424',
                    border: '1px solid #282845',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#a0a0c0', marginBottom: '6px' }}>
                  TRIGGER NOTE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Resistance breakout"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#141424',
                    border: '1px solid #282845',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {createMutation.isPending ? 'Saving...' : 'Confirm & Activate Alert'}
                </button>
              </div>
            </form>

            {/* Quick Suggestions */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', color: '#686884', fontWeight: 600 }}>QUICK PRESETS:</span>
              {QUICK_ALERT_SUGGESTIONS.map((item) => (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#141424',
                    border: '1px solid #282845',
                    color: '#a0a0c0',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                  }}
                >
                  {item.symbol.replace('NSE:', '')} {item.condition === 'ABOVE' ? '≥' : '≤'} ₹{item.defaultTarget}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['ALL', 'ACTIVE', 'TRIGGERED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: filterTab === tab ? '1px solid #f59e0b' : '1px solid #1c1c2e',
                backgroundColor: filterTab === tab ? 'rgba(245, 158, 11, 0.15)' : '#0c0c16',
                color: filterTab === tab ? '#fbbf24' : '#8888a6',
                cursor: 'pointer',
              }}
            >
              {tab === 'ALL' && `All Alerts (${alerts.length})`}
              {tab === 'ACTIVE' && `Active (${activeAlerts.length})`}
              {tab === 'TRIGGERED' && `Triggered (${triggeredAlerts.length})`}
            </button>
          ))}
        </div>

        {/* Alerts Grid / Cards */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : filteredAlerts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '64px 24px',
              textAlign: 'center',
            }}
          >
            <Bell size={40} color="#333348" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f0f5', margin: '0 0 6px' }}>
              No {filterTab.toLowerCase()} price alerts
            </h3>
            <p style={{ color: '#8888a6', fontSize: '13px', margin: '0 0 20px' }}>
              Set custom price triggers on your favorite equities to receive notifications when targets are hit.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Plus size={15} />
              <span>Create Your First Alert</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredAlerts.map((alert) => {
              const isTriggered = alert.status === 'TRIGGERED';
              const isAbove = alert.condition === 'ABOVE';
              const dist = alert.distancePercent ?? 0;
              const isClose = Math.abs(dist) <= 3;

              return (
                <div
                  key={alert.id}
                  style={{
                    backgroundColor: '#0c0c16',
                    borderRadius: '12px',
                    border: isTriggered
                      ? '1px solid rgba(0, 192, 118, 0.4)'
                      : isClose
                      ? '1px solid rgba(245, 158, 11, 0.4)'
                      : '1px solid #1c1c2e',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Card Header: Symbol & Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>{alert.symbol}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#18182a',
                              color: '#818cf8',
                            }}
                          >
                            NSE
                          </span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#8888a6', marginTop: '2px' }}>{alert.name}</div>
                      </div>

                      {/* Status Badge */}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: isTriggered
                            ? 'rgba(0, 192, 118, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                          color: isTriggered ? '#00c076' : '#f59e0b',
                          border: isTriggered
                            ? '1px solid rgba(0, 192, 118, 0.3)'
                            : '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        {isTriggered ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        <span>{alert.status}</span>
                      </span>
                    </div>

                    {/* Price Comparison Block */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        backgroundColor: '#080812',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #161626',
                        marginBottom: '14px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '10.5px', color: '#787898', fontWeight: 600 }}>CURRENT LTP</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                          ₹{formatIndianNumber(alert.currentPrice)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10.5px', color: '#787898', fontWeight: 600 }}>
                          TARGET ({isAbove ? '≥' : '≤'})
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                          ₹{formatIndianNumber(alert.targetPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Proximity / Distance bar */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
                        <span style={{ color: '#8888a6' }}>Distance to Target:</span>
                        <span style={{ fontWeight: 700, color: isTriggered ? '#00c076' : '#a0a0c0' }}>
                          {isTriggered ? 'Target Reached' : `${dist > 0 ? '+' : ''}${dist}% away`}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: '#181828',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: isTriggered ? '100%' : `${Math.min(Math.max(100 - Math.abs(dist), 15), 100)}%`,
                            height: '100%',
                            backgroundColor: isTriggered ? '#00c076' : isClose ? '#f59e0b' : '#6366f1',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Note if provided */}
                    {alert.note && (
                      <div style={{ fontSize: '12px', color: '#9090b0', fontStyle: 'italic', marginBottom: '14px' }}>
                        "{alert.note}"
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #161626',
                    }}
                  >
                    <button
                      onClick={() => navigate(`/trade?symbol=${encodeURIComponent(alert.symbol)}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
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
                      <Zap size={13} />
                      <span>Trade</span>
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(alert.id)}
                      disabled={deleteMutation.isPending}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#686884',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3b57')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#686884')}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
