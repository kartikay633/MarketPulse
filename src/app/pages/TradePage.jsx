// ROADMAP: Section 5 & 11 — Paper Trade Terminal Component
// Institutional Terminal Styling — Exact Market Pulse Design System
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStockQuote } from '../hooks/useMarketData';
import { usePortfolio, useOrders, useExecuteTrade } from '../hooks/useTrade';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Wallet,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import ErrorBoundary from '../components/common/ErrorBoundary';
import CompanyLogo from '../components/common/CompanyLogo';

const POPULAR_SYMBOLS = [
  'NSE:RELIANCE',
  'NSE:TCS',
  'NSE:HDFCBANK',
  'NSE:INFY',
  'NSE:ICICIBANK',
  'NSE:TATAMOTORS',
  'NSE:ITC',
  'NSE:SBIN',
];

export default function TradePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSymbol = searchParams.get('symbol') || 'NSE:RELIANCE';
  const [selectedSymbol, setSelectedSymbol] = useState(urlSymbol);
  const [customInput, setCustomInput] = useState('');
  const [orderType, setOrderType] = useState('BUY'); // 'BUY' | 'SELL'
  const [quantity, setQuantity] = useState(10);

  // Sync if URL query param changes
  useEffect(() => {
    if (urlSymbol && urlSymbol !== selectedSymbol) {
      setSelectedSymbol(urlSymbol);
    }
  }, [urlSymbol]);

  // Fetch Live Quote for selected symbol
  const { data: quote, isLoading: isQuoteLoading, refetch: refetchQuote } = useStockQuote(selectedSymbol);

  // Fetch Portfolio & Orders
  const { data: portfolioData, isLoading: isPortfolioLoading, refetch: refetchPortfolio } = usePortfolio();
  const { data: orders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useOrders(50);
  const executeMutation = useExecuteTrade();

  const cashBalance = portfolioData?.account?.cashBalance ?? 1000000;
  const positions = portfolioData?.positions ?? [];
  const currentPosition = positions.find(
    (p) => p.symbol.toUpperCase() === selectedSymbol.toUpperCase()
  );

  const ltp = quote?.ltp || 0;
  const isPositive = (quote?.change ?? 0) >= 0;
  const orderTotal = Number((quantity * ltp).toFixed(2));

  // Validation
  const canBuy = orderType === 'BUY' && cashBalance >= orderTotal && quantity > 0 && ltp > 0;
  const canSell =
    orderType === 'SELL' &&
    currentPosition &&
    currentPosition.quantity >= quantity &&
    quantity > 0 &&
    ltp > 0;
  const isExecutable = orderType === 'BUY' ? canBuy : canSell;

  const handleSelectSymbol = (sym) => {
    setSelectedSymbol(sym);
    setSearchParams({ symbol: sym });
    setCustomInput('');
  };

  const handleCustomSymbolSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const sym = customInput.trim().toUpperCase();
    const formatted = sym.includes(':') ? sym : `NSE:${sym}`;
    handleSelectSymbol(formatted);
  };

  const handleExecute = () => {
    if (!isExecutable || executeMutation.isPending) return;

    executeMutation.mutate(
      {
        symbol: selectedSymbol,
        type: orderType,
        quantity: parseInt(quantity, 10),
      },
      {
        onSuccess: () => {
          refetchQuote();
          refetchPortfolio();
          refetchOrders();
        },
      }
    );
  };

  const quickQtyList = [1, 5, 10, 25, 50, 100];

  return (
    <ErrorBoundary>
      <div className="page-container-wide">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 className="page-title">
                Simulated Trading Desk
              </h1>
              <span className="badge badge--accent">
                PAPER CAPITAL ₹10,00,000
              </span>
            </div>
            <p className="page-subtitle">
              Simulated order ticket executing against live NSE / BSE market ticks with zero risk to personal capital.
            </p>
          </div>

          {/* Virtual Account Balance Pill */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 18px',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <Wallet size={18} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Available Cash
              </div>
              <div className="num-tabular" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹{formatIndianNumber(cashBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Ticker Quick Selector Bar */}
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
            Quick Select:
          </span>
          {POPULAR_SYMBOLS.map((sym) => {
            const isSel = sym.toUpperCase() === selectedSymbol.toUpperCase();
            const cleanSym = sym.replace('NSE:', '');
            return (
              <button
                key={sym}
                onClick={() => handleSelectSymbol(sym)}
                className={`quick-select-chip ${isSel ? 'quick-select-chip--active' : ''}`}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CompanyLogo symbol={cleanSym} size={18} />
                {cleanSym}
              </button>
            );
          })}

          {/* Search/Custom input */}
          <form onSubmit={handleCustomSymbolSubmit} style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} className="input-icon" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Symbol (e.g. INFY)"
                className="input input--with-icon"
                style={{ width: '170px', padding: '6px 10px 6px 32px', fontSize: '12px' }}
              />
            </div>
          </form>
        </div>

        {/* 2-Column Terminal Layout: Order Ticket on Left, Position & History on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Order Ticket Card */}
          <div className="card card-padded">
            {/* Live Ticker Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '18px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CompanyLogo symbol={selectedSymbol.replace('NSE:', '').replace('BSE:', '')} size={42} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {quote?.symbol || selectedSymbol}
                    </h2>
                    <span className="badge badge--accent badge--sm">NSE</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                    {quote?.name || 'Listed Equity'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="num-tabular" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{formatIndianNumber(ltp)}
                </div>
                <div
                  className={`num-tabular ${isPositive ? 'text-positive' : 'text-negative'}`}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>
                    {isPositive ? '+' : ''}₹{formatIndianNumber(Math.abs(quote?.change ?? 0))} ({isPositive ? '+' : ''}
                    {(quote?.changePercent ?? 0).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Order Type Switcher (BUY vs SELL) */}
            <div className="order-type-switcher" style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setOrderType('BUY')}
                className={`order-type-btn ${orderType === 'BUY' ? 'order-type-btn--buy' : ''}`}
              >
                <TrendingUp size={13} />
                <span>BUY / LONG</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('SELL')}
                className={`order-type-btn ${orderType === 'SELL' ? 'order-type-btn--sell' : ''}`}
              >
                <TrendingDown size={13} />
                <span>SELL / EXIT</span>
              </button>
            </div>

            {/* Product Type & Order Type Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Product</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Delivery (CNC)
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Execution</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  Market (LTP)
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Quantity (Shares)</label>
                {currentPosition && (
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                    Owned: {currentPosition.quantity}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="num-tabular"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                <div style={{ padding: '0 14px', color: 'var(--text-muted)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  QTY
                </div>
              </div>

              {/* Quick Stepper Pills */}
              <div className="qty-stepper" style={{ marginTop: '8px' }}>
                {quickQtyList.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`qty-stepper-btn ${quantity === num ? 'qty-stepper-btn--active' : ''}`}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                border: '1px solid var(--border)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Est. Execution Price</span>
                <span className="num-tabular" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{formatIndianNumber(ltp)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Required Capital</span>
                <span className="num-tabular" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{formatIndianNumber(orderTotal)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12.5px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Available Cash Post-Trade</span>
                <span
                  className={`num-tabular ${
                    orderType === 'BUY'
                      ? cashBalance - orderTotal >= 0
                        ? 'text-positive'
                        : 'text-negative'
                      : 'text-positive'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  ₹{formatIndianNumber(orderType === 'BUY' ? cashBalance - orderTotal : cashBalance + orderTotal)}
                </span>
              </div>
            </div>

            {/* Error / Validation Warning */}
            {orderType === 'BUY' && cashBalance < orderTotal && (
              <div className="alert-box alert-box--error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>Insufficient virtual cash balance for this order.</span>
              </div>
            )}

            {orderType === 'SELL' && (!currentPosition || currentPosition.quantity < quantity) && (
              <div className="alert-box alert-box--error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>You hold {currentPosition?.quantity || 0} shares of {selectedSymbol}.</span>
              </div>
            )}

            {/* Execute Button */}
            <button
              type="button"
              disabled={!isExecutable || executeMutation.isPending}
              onClick={handleExecute}
              className={`btn ${orderType === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13.5px',
                letterSpacing: '0.01em',
              }}
            >
              {executeMutation.isPending ? (
                <span>Submitting Simulated Order...</span>
              ) : (
                <>
                  <Zap size={15} />
                  <span>
                    Execute {orderType} Order • ₹{formatIndianNumber(orderTotal)}
                  </span>
                </>
              )}
            </button>

            {/* Simulated note */}
            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '11px',
              }}
            >
              <ShieldCheck size={13} color="var(--accent)" />
              <span>Simulated Execution • Live Upstox Data • No Capital Risk</span>
            </div>
          </div>

          {/* Right Column: Active Position Card & Order History Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Active Position for this symbol if held */}
            {currentPosition && (
              <div
                className="card card-padded"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: currentPosition.unrealizedPL >= 0 ? '3px solid var(--positive)' : '3px solid var(--negative)',
                }}
              >
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Active Holding ({currentPosition.symbol})
                  </div>
                  <div className="num-tabular" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {currentPosition.quantity} Shares @ avg ₹{formatIndianNumber(currentPosition.avgPrice)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Unrealized P&L
                  </div>
                  <div
                    className={`num-tabular ${currentPosition.unrealizedPL >= 0 ? 'text-positive' : 'text-negative'}`}
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    {currentPosition.unrealizedPL >= 0 ? '+' : ''}₹{formatIndianNumber(currentPosition.unrealizedPL)} (
                    {currentPosition.unrealizedPLPercent >= 0 ? '+' : ''}
                    {currentPosition.unrealizedPLPercent}%)
                  </div>
                </div>

                <button
                  onClick={() => navigate('/portfolio')}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <span>View in Portfolio</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* Order History Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="var(--accent)" />
                  <span>Simulated Order Audit Log ({orders.length})</span>
                </div>
                <button
                  onClick={() => refetchOrders()}
                  title="Refresh orders"
                  className="btn btn-ghost"
                  style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                >
                  <RefreshCw size={11} />
                  <span>Refresh</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-title">No executed paper orders yet</div>
                  <div className="empty-state-description">
                    Use the order ticket on the left to submit simulated trades against live quotes.
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>TIME</th>
                        <th>INSTRUMENT</th>
                        <th>SIDE</th>
                        <th style={{ textAlign: 'right' }}>QTY</th>
                        <th style={{ textAlign: 'right' }}>EXEC PRICE</th>
                        <th style={{ textAlign: 'right' }}>VALUE</th>
                        <th style={{ textAlign: 'center' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const isBuy = o.type === 'BUY';
                        const timeStr = o.createdAt
                          ? new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : '--';
                        return (
                          <tr key={o.id}>
                            <td style={{ color: 'var(--text-muted)' }}>{timeStr}</td>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.symbol}</td>
                            <td>
                              <span className={`badge ${isBuy ? 'badge--positive' : 'badge--negative'}`}>
                                {o.type}
                              </span>
                            </td>
                            <td className="num-tabular" style={{ textAlign: 'right', color: 'var(--text-primary)' }}>{o.quantity}</td>
                            <td className="num-tabular" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>₹{formatIndianNumber(o.price)}</td>
                            <td className="num-tabular" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                              ₹{formatIndianNumber(o.price * o.quantity)}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="badge badge--positive">
                                <CheckCircle2 size={10} />
                                EXECUTED
                              </span>
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
        </div>
      </div>
    </ErrorBoundary>
  );
}
