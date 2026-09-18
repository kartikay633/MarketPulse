// ROADMAP: Section 5 & 11 — Paper Trade Terminal Component
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStockQuote } from '../hooks/useMarketData';
import { usePortfolio, useOrders, useExecuteTrade } from '../hooks/useTrade';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Wallet,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../utils/formatters';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { TableSkeleton } from '../components/common/LoadingSkeleton';

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
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Zap size={17} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Paper Trading Terminal
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                SIMULATED ₹10L
              </span>
            </div>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: 0 }}>
              Live execution order ticket using real-time Upstox NSE/BSE tick prices with zero real capital risk.
            </p>
          </div>

          {/* Virtual Account Balance Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#0e0e18',
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #1c1c2e',
            }}
          >
            <Wallet size={16} color="#818cf8" />
            <div>
              <div style={{ fontSize: '11px', color: '#8888a6', fontWeight: 600 }}>AVAILABLE CASH</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                ₹{formatIndianNumber(cashBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Ticker Quick Selector Bar */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#686884', fontWeight: 600, marginRight: '4px' }}>
            QUICK ASSETS:
          </span>
          {POPULAR_SYMBOLS.map((sym) => {
            const isSel = sym.toUpperCase() === selectedSymbol.toUpperCase();
            return (
              <button
                key={sym}
                onClick={() => handleSelectSymbol(sym)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: isSel ? '1px solid #6366f1' : '1px solid #1c1c2e',
                  backgroundColor: isSel ? 'rgba(99, 102, 241, 0.15)' : '#0f0f1c',
                  color: isSel ? '#a5b4fc' : '#8888a6',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {sym.replace('NSE:', '')}
              </button>
            );
          })}

          {/* Search/Custom input */}
          <form onSubmit={handleCustomSymbolSubmit} style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0e0e1a',
                border: '1px solid #24243a',
                borderRadius: '6px',
                padding: '4px 10px',
              }}
            >
              <Search size={13} color="#686884" style={{ marginRight: '6px' }} />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Symbol (e.g. INFY)"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  width: '120px',
                }}
              />
            </div>
          </form>
        </div>

        {/* 2-Column Terminal Layout: Order Ticket on Left, Position & History on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Order Ticket Card */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Live Ticker Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #181828',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {quote?.symbol || selectedSymbol}
                  </h2>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#1b1b30',
                      color: '#818cf8',
                    }}
                  >
                    NSE
                  </span>
                </div>
                <div style={{ color: '#8888a6', fontSize: '13px', marginTop: '3px' }}>
                  {quote?.name || 'Equity Stock'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                  ₹{formatIndianNumber(ltp)}
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: isPositive ? '#00c076' : '#ff3b57',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    marginTop: '2px',
                  }}
                >
                  {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>
                    {isPositive ? '+' : ''}₹{formatIndianNumber(Math.abs(quote?.change ?? 0))} ({isPositive ? '+' : ''}
                    {(quote?.changePercent ?? 0).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Order Type Switcher (BUY vs SELL) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '20px',
                backgroundColor: '#07070f',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid #181828',
              }}
            >
              <button
                type="button"
                onClick={() => setOrderType('BUY')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: orderType === 'BUY' ? '#00c076' : 'transparent',
                  color: orderType === 'BUY' ? '#ffffff' : '#8888a6',
                  transition: 'all 0.15s ease',
                  boxShadow: orderType === 'BUY' ? '0 2px 12px rgba(0, 192, 118, 0.35)' : 'none',
                }}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setOrderType('SELL')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: orderType === 'SELL' ? '#ff3b57' : 'transparent',
                  color: orderType === 'SELL' ? '#ffffff' : '#8888a6',
                  transition: 'all 0.15s ease',
                  boxShadow: orderType === 'SELL' ? '0 2px 12px rgba(255, 59, 87, 0.35)' : 'none',
                }}
              >
                SELL / EXIT
              </button>
            </div>

            {/* Product Type & Order Type Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#121222',
                  border: '1px solid #222238',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '10.5px', color: '#78789a', fontWeight: 600 }}>PRODUCT</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f0f0f5', marginTop: '2px' }}>
                  Delivery (CNC)
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#121222',
                  border: '1px solid #222238',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '10.5px', color: '#78789a', fontWeight: 600 }}>EXECUTION</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f0f0f5', marginTop: '2px' }}>
                  Market (LTP)
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0a0c0' }}>QUANTITY (SHARES)</label>
                {currentPosition && (
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>
                    Owned: {currentPosition.quantity} shares
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#07070f',
                  border: '1px solid #222238',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
                <div style={{ padding: '0 14px', color: '#686884', fontSize: '13px', fontWeight: 600 }}>
                  QTY
                </div>
              </div>

              {/* Quick Stepper Pills */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {quickQtyList.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      borderRadius: '4px',
                      backgroundColor: quantity === num ? '#22223a' : '#10101c',
                      border: quantity === num ? '1px solid #6366f1' : '1px solid #1c1c2e',
                      color: quantity === num ? '#ffffff' : '#8888a6',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div
              style={{
                backgroundColor: '#090913',
                borderRadius: '8px',
                padding: '14px',
                border: '1px solid #181828',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#8888a6' }}>Est. Execution Price</span>
                <span style={{ color: '#f0f0fa', fontWeight: 600 }}>₹{formatIndianNumber(ltp)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#8888a6' }}>Approx Required Capital</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>₹{formatIndianNumber(orderTotal)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12.5px',
                  paddingTop: '8px',
                  borderTop: '1px solid #181828',
                }}
              >
                <span style={{ color: '#8888a6' }}>Virtual Cash After Trade</span>
                <span
                  style={{
                    color:
                      orderType === 'BUY'
                        ? cashBalance - orderTotal >= 0
                          ? '#00c076'
                          : '#ff3b57'
                        : '#00c076',
                    fontWeight: 700,
                  }}
                >
                  ₹{formatIndianNumber(orderType === 'BUY' ? cashBalance - orderTotal : cashBalance + orderTotal)}
                </span>
              </div>
            </div>

            {/* Error / Validation Warning */}
            {orderType === 'BUY' && cashBalance < orderTotal && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 59, 87, 0.1)',
                  border: '1px solid rgba(255, 59, 87, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  color: '#ff3b57',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={15} />
                <span>Insufficient virtual cash balance for this order.</span>
              </div>
            )}

            {orderType === 'SELL' && (!currentPosition || currentPosition.quantity < quantity) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 59, 87, 0.1)',
                  border: '1px solid rgba(255, 59, 87, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  color: '#ff3b57',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={15} />
                <span>You only own {currentPosition?.quantity || 0} shares of {selectedSymbol}.</span>
              </div>
            )}

            {/* Execute Button */}
            <button
              type="button"
              disabled={!isExecutable || executeMutation.isPending}
              onClick={handleExecute}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '0.02em',
                border: 'none',
                cursor: isExecutable && !executeMutation.isPending ? 'pointer' : 'not-allowed',
                backgroundColor:
                  !isExecutable || executeMutation.isPending
                    ? '#222234'
                    : orderType === 'BUY'
                    ? '#00c076'
                    : '#ff3b57',
                color: !isExecutable || executeMutation.isPending ? '#686884' : '#ffffff',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow:
                  isExecutable && !executeMutation.isPending
                    ? orderType === 'BUY'
                      ? '0 4px 20px rgba(0, 192, 118, 0.35)'
                      : '0 4px 20px rgba(255, 59, 87, 0.35)'
                    : 'none',
              }}
            >
              {executeMutation.isPending ? (
                <span>Executing Order...</span>
              ) : (
                <>
                  <Zap size={16} />
                  <span>
                    {orderType} {quantity} SHARES • ₹{formatIndianNumber(orderTotal)}
                  </span>
                </>
              )}
            </button>

            {/* Security note */}
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#555570',
                fontSize: '11px',
              }}
            >
              <ShieldCheck size={13} />
              <span>Simulated Execution • Real-time Upstox Feed • No actual funds used</span>
            </div>
          </div>

          {/* Right Column: Active Position Card & Order History Table */}
          <div>
            {/* Active Position for this symbol if held */}
            {currentPosition && (
              <div
                style={{
                  backgroundColor: '#0c0c16',
                  borderRadius: '12px',
                  border: '1px solid #1c1c2e',
                  padding: '18px 22px',
                  marginBottom: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#8888a6', fontWeight: 600 }}>CURRENT HOLDING</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                    {currentPosition.quantity} Shares @ avg ₹{formatIndianNumber(currentPosition.avgPrice)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#8888a6', fontWeight: 600 }}>UNREALIZED P&L</div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: currentPosition.unrealizedPL >= 0 ? '#00c076' : '#ff3b57',
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
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#16162a',
                    color: '#818cf8',
                    border: '1px solid #282848',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>View Portfolio</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {/* Order History Table */}
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
                  padding: '16px 20px',
                  borderBottom: '1px solid #1c1c2e',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#818cf8" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Executed Paper Orders
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#1b1b30',
                      color: '#8888aa',
                    }}
                  >
                    {orders.length}
                  </span>
                </div>

                <button
                  onClick={() => refetchOrders()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8888a6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                  }}
                >
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>

              {isOrdersLoading ? (
                <div style={{ padding: '16px' }}>
                  <TableSkeleton rows={4} />
                </div>
              ) : orders.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <Zap size={32} color="#333348" style={{ marginBottom: '10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#8888a6' }}>No orders executed yet</div>
                  <div style={{ fontSize: '12px', color: '#555570', marginTop: '4px' }}>
                    Use the order ticket on the left to execute your first simulated trade.
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #181828', color: '#686884', fontSize: '11.5px' }}>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>SIDE</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>SYMBOL</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>QUANTITY</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>PRICE</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>TOTAL VALUE</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>STATUS</th>
                        <th style={{ padding: '12px 18px', fontWeight: 600 }}>TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord, idx) => {
                        const isBuy = ord.type === 'BUY';
                        const timeStr = ord.timestamp
                          ? new Date(ord.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })
                          : '—';

                        return (
                          <tr
                            key={ord.id || idx}
                            style={{
                              borderBottom: '1px solid #141424',
                              transition: 'background-color 0.15s ease',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleSelectSymbol(ord.symbol)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#121222')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '12px 18px' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: isBuy ? 'rgba(0, 192, 118, 0.15)' : 'rgba(255, 59, 87, 0.15)',
                                  color: isBuy ? '#00c076' : '#ff3b57',
                                }}
                              >
                                {ord.type}
                              </span>
                            </td>
                            <td style={{ padding: '12px 18px', fontWeight: 700, color: '#f0f0f8' }}>
                              {ord.symbol}
                            </td>
                            <td style={{ padding: '12px 18px', color: '#c0c0d8' }}>{ord.quantity}</td>
                            <td style={{ padding: '12px 18px', color: '#ffffff', fontWeight: 600 }}>
                              ₹{formatIndianNumber(ord.price)}
                            </td>
                            <td style={{ padding: '12px 18px', color: '#ffffff', fontWeight: 700 }}>
                              ₹{formatIndianNumber(ord.totalValue)}
                            </td>
                            <td style={{ padding: '12px 18px' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  color: '#00c076',
                                  fontWeight: 700,
                                }}
                              >
                                <CheckCircle2 size={12} /> {ord.status || 'FILLED'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 18px', color: '#787898', fontSize: '12px' }}>{timeStr}</td>
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
