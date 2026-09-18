// ROADMAP: Section 5, 8 & Phase 3 — StockDetailPage Component
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockQuote, useStockHistory } from '../../app/hooks/useStockData';
import { useStockNews } from '../../app/hooks/useNews';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useWatchlist';
import StockChart from '../components/charts/StockChart';
import NewsCard from '../components/news/NewsCard';
import AIInsightPanel from '../components/ai/AIInsightPanel';
import { MarketStatusBadge } from '../components/market/MarketStatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Share2,
  ArrowLeft,
  Sparkles,
  Newspaper,
  Info,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../utils/formatters';
import { toast } from 'sonner';

export default function StockDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1D');

  // Fetch stock quote, candles, and stock news
  const { data: quote, isLoading: isQuoteLoading, error: quoteError } = useStockQuote(symbol);
  const { data: candles, isLoading: isCandlesLoading } = useStockHistory(symbol, timeframe);
  const { data: stockNews = [], isLoading: isNewsLoading } = useStockNews(symbol, 3);

  // Watchlist integration
  const { data: watchlistItems = [] } = useWatchlist();
  const addWatchlistMutation = useAddToWatchlist();
  const removeWatchlistMutation = useRemoveFromWatchlist();

  const isWatchlisted = watchlistItems.some(
    (item) => (item.symbol || '').toUpperCase() === (symbol || '').toUpperCase()
  );

  const handleToggleWatchlist = () => {
    const sym = quote?.symbol || symbol;
    if (isWatchlisted) {
      removeWatchlistMutation.mutate(sym);
    } else {
      addWatchlistMutation.mutate(sym);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isQuoteLoading) {
    return (
      <div style={{ padding: '28px 36px', maxWidth: '1400px', margin: '0 auto' }}>
        <LoadingSkeleton type="chart" />
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (quoteError || !quote) {
    return (
      <div
        style={{
          padding: '80px 20px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#1b1b2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#8b8ba8',
          }}
        >
          <Info size={28} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f0f5', marginBottom: '8px' }}>
          Stock Not Found
        </h2>
        <p style={{ color: '#8888a6', fontSize: '14px', marginBottom: '24px' }}>
          We could not find active market quote data for symbol "{symbol}". Please verify the symbol or search again.
        </p>
        <button
          onClick={() => navigate('/markets')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Markets
        </button>
      </div>
    );
  }

  const isPositive = quote.change >= 0;
  const ltp = quote.ltp ?? 0;
  const change = quote.change ?? 0;
  const changePercent = quote.changePercent ?? 0;

  // 52-Week Range calculation
  const low52 = quote.fiftyTwoWeekLow || ltp * 0.75;
  const high52 = quote.fiftyTwoWeekHigh || ltp * 1.25;
  const range52Percent = Math.min(Math.max(((ltp - low52) / (high52 - low52 || 1)) * 100, 0), 100);

  return (
    <div style={{ padding: '24px 32px 64px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Navigation Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#8b8ba8',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f0f0fa')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8b8ba8')}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <span style={{ color: '#44445c' }}>/</span>
        <span style={{ color: '#686884', fontSize: '13px' }}>Stocks</span>
        <span style={{ color: '#44445c' }}>/</span>
        <span style={{ color: '#a0a0c0', fontSize: '13px', fontWeight: 600 }}>{quote.symbol}</span>
      </div>

      {/* Stock Header Section */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid #1c1c2e',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              {quote.symbol}
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: '#1b1b30',
                color: '#818cf8',
                border: '1px solid #282845',
              }}
            >
              {quote.exchange || 'NSE'}
            </span>
            <MarketStatusBadge status={quote.marketStatus || 'CLOSED'} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9090b0', fontSize: '14px' }}>
            <span style={{ fontWeight: 500 }}>{quote.name}</span>
            {quote.sector && (
              <>
                <span>•</span>
                <span
                  style={{
                    fontSize: '11.5px',
                    backgroundColor: '#131322',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#8888aa',
                  }}
                >
                  {quote.sector}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ₹{formatIndianNumber(ltp)}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px',
                fontWeight: 700,
                color: isPositive ? '#00c076' : '#ff3b57',
                marginTop: '3px',
              }}
            >
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {isPositive ? '+' : ''}₹{formatIndianNumber(Math.abs(change))} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleToggleWatchlist}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: isWatchlisted ? '1px solid #eab308' : '1px solid #282845',
                backgroundColor: isWatchlisted ? 'rgba(234, 179, 8, 0.1)' : '#141422',
                color: isWatchlisted ? '#eab308' : '#d0d0e6',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Star size={15} fill={isWatchlisted ? '#eab308' : 'none'} />
              <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => navigate(`/trade?symbol=${encodeURIComponent(quote.symbol)}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
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
              <Zap size={15} />
              <span>Paper Trade</span>
            </button>

            <button
              onClick={handleShare}
              title="Share Stock"
              style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#141422',
                border: '1px solid #282845',
                color: '#8b8ba8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div style={{ marginBottom: '28px' }}>
        <StockChart
          symbol={quote.symbol}
          candles={candles}
          isLoading={isCandlesLoading}
          selectedTimeframe={timeframe}
          onTimeframeChange={(tf) => setTimeframe(tf)}
        />
      </div>

      {/* Key Statistics Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f0f8', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          Key Market Statistics
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Day Open */}
          <div style={{ backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Day Open
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f0fa', fontFamily: "'JetBrains Mono', monospace" }}>
              ₹{formatIndianNumber(quote.open || ltp)}
            </div>
          </div>

          {/* Day Range (High / Low) */}
          <div style={{ backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Day High / Low
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f0f0fa', fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: '#00c076' }}>₹{formatIndianNumber(quote.high || ltp)}</span> / <span style={{ color: '#ff3b57' }}>₹{formatIndianNumber(quote.low || ltp)}</span>
            </div>
          </div>

          {/* Previous Close */}
          <div style={{ backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Previous Close
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f0fa', fontFamily: "'JetBrains Mono', monospace" }}>
              ₹{formatIndianNumber(quote.previousClose || ltp)}
            </div>
          </div>

          {/* Volume */}
          <div style={{ backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Trading Volume
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f0fa', fontFamily: "'JetBrains Mono', monospace" }}>
              {formatIndianNumber(quote.volume || 1200000)}
            </div>
          </div>

          {/* 52-Week Range Bar */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                52-Week Range
              </span>
              <span style={{ fontSize: '12px', color: '#9d9db8' }}>
                Current: <strong style={{ color: '#fff' }}>₹{formatIndianNumber(ltp)}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#ff3b57', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                ₹{formatIndianNumber(low52)}
              </span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#1d1d2f', borderRadius: '3px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${range52Percent}%`,
                    background: 'linear-gradient(90deg, #ff3b57, #6366f1, #00c076)',
                    borderRadius: '3px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${range52Percent}%`,
                    top: '-3px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#00c076', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                ₹{formatIndianNumber(high52)}
              </span>
            </div>
          </div>

          {/* Sector & Industry */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#0d0d16', padding: '16px', borderRadius: '12px', border: '1px solid #1c1c2e' }}>
            <div style={{ color: '#737392', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Classification
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={16} color="#6366f1" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0fa' }}>
                {quote.sector || 'Equities'}
              </span>
              <span style={{ color: '#44445c' }}>•</span>
              <span style={{ fontSize: '13px', color: '#8b8ba8' }}>
                {quote.industry || 'NSE Large Cap'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: AI Insights & Related News */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Pulse AI Insights Panel */}
        <AIInsightPanel symbol={quote.symbol} />

        {/* Latest Stock News & Catalysts */}
        <div
          style={{
            backgroundColor: '#0d0d16',
            borderRadius: '16px',
            border: '1px solid #1c1c2e',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Newspaper size={17} color="#00c076" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Related News & Catalysts
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stockNews.length > 0 ? (
              stockNews.map((article) => (
                <NewsCard key={article.id} article={article} compact />
              ))
            ) : (
              <div style={{ color: '#686884', fontSize: '13px', padding: '16px 0' }}>
                No direct corporate filings or news found for this ticker today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
