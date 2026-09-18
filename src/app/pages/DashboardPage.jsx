// ROADMAP: Section 2, 5 & Phase 2 — Main Dashboard Page
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useMarketOverview, useGainers, useLosers, useActive } from '../hooks/useMarketData';
import { useMarketNews } from '../hooks/useNews';
import IndexCard from '../components/market/IndexCard';
import MarketBreadthBar from '../components/market/MarketBreadthBar';
import SectorBar from '../components/market/SectorBar';
import StockRow from '../components/market/StockRow';
import AISummaryCard from '../components/ai/AISummaryCard';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { formatINR } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Newspaper,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('gainers'); // 'gainers' | 'losers' | 'active'

  const { data: overview, isLoading: isOverviewLoading, error: overviewError, refetch: refetchOverview } = useMarketOverview();
  const { data: gainers = [], isLoading: isGainersLoading } = useGainers(8);
  const { data: losers = [], isLoading: isLosersLoading } = useLosers(8);
  const { data: active = [], isLoading: isActiveLoading } = useActive(8);
  const { data: marketNews = [] } = useMarketNews('all', 3);

  const displayName = profile?.displayName || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Trader';

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Welcome & Paper Portfolio Bar */}
        <div
          style={{
            padding: '24px 28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(18, 18, 26, 0.85))',
            border: '1px solid rgba(51, 102, 255, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f5' }}>
                Welcome back, {displayName}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(51, 102, 255, 0.2)',
                  color: '#3366ff',
                  border: '1px solid rgba(51, 102, 255, 0.4)',
                  textTransform: 'uppercase',
                }}
              >
                {profile?.experienceLevel || 'Intermediate'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#a0a0b8' }}>
              Real-time Indian equity terminal. All quotes synchronized with NSE/BSE.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: 'rgba(10, 10, 15, 0.8)',
                border: '1px solid #222236',
              }}
            >
              <Wallet size={20} color="#3366ff" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: '#606078', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Simulated Balance
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#00c853', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatINR(1000000)}
                </span>
              </div>
            </div>

            <button
              onClick={() => refetchOverview()}
              title="Refresh Quotes"
              style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(26, 26, 40, 0.6)',
                border: '1px solid #2a2a44',
                color: '#a0a0b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Hero Indices Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f5', letterSpacing: '0.02em' }}>
              Benchmark Indices
            </h2>
            <Link to="/markets" style={{ fontSize: '12px', color: '#3366ff', fontWeight: 500 }}>
              View all indices &rarr;
            </Link>
          </div>

          {isOverviewLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {overview?.indices?.map((idx) => (
                <IndexCard key={idx.symbol} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Market Breadth */}
        <section>
          {overview?.breadth && <MarketBreadthBar breadth={overview.breadth} />}
        </section>

        {/* Two-Column Core Layout: Top Movers (Left) + Sector Performance & AI Pulse (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
          {/* Left Column: Gainers / Losers / Active Tabs */}
          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: '#12121a',
              border: '1px solid #1e1e30',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Tab Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e1e30', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('gainers')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === 'gainers' ? 600 : 500,
                    backgroundColor: activeTab === 'gainers' ? 'rgba(0, 200, 83, 0.15)' : 'transparent',
                    color: activeTab === 'gainers' ? '#00c853' : '#a0a0b8',
                    border: activeTab === 'gainers' ? '1px solid rgba(0, 200, 83, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <TrendingUp size={13} />
                  <span>Top Gainers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('losers')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === 'losers' ? 600 : 500,
                    backgroundColor: activeTab === 'losers' ? 'rgba(255, 23, 68, 0.15)' : 'transparent',
                    color: activeTab === 'losers' ? '#ff1744' : '#a0a0b8',
                    border: activeTab === 'losers' ? '1px solid rgba(255, 23, 68, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <TrendingDown size={13} />
                  <span>Top Losers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('active')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === 'active' ? 600 : 500,
                    backgroundColor: activeTab === 'active' ? 'rgba(51, 102, 255, 0.15)' : 'transparent',
                    color: activeTab === 'active' ? '#3366ff' : '#a0a0b8',
                    border: activeTab === 'active' ? '1px solid rgba(51, 102, 255, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <Activity size={13} />
                  <span>Most Active</span>
                </button>
              </div>

              <Link to="/markets" style={{ fontSize: '11px', color: '#606078' }}>
                Full table &rarr;
              </Link>
            </div>

            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 2fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr)',
                padding: '0 14px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#606078',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span>Instrument</span>
              <span style={{ textAlign: 'right' }}>LTP</span>
              <span style={{ textAlign: 'right' }}>Change</span>
              <span style={{ textAlign: 'right' }}>Volume</span>
            </div>

            {/* Stock List */}
            {isGainersLoading || isLosersLoading || isActiveLoading ? (
              <TableSkeleton rows={6} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeTab === 'gainers' &&
                  gainers.map((s) => (
                    <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                  ))}
                {activeTab === 'losers' &&
                  losers.map((s) => (
                    <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                  ))}
                {activeTab === 'active' &&
                  active.map((s) => (
                    <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                  ))}
              </div>
            )}
          </div>

          {/* Right Column: Sector Performance & Pulse AI Daily Intelligence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Sector Performance */}
            {overview?.sectors && <SectorBar sectors={overview.sectors} />}

            {/* Pulse AI Market Intelligence Card */}
            <AISummaryCard />

            {/* Live Financial News Pulse Widget */}
            <div
              style={{
                backgroundColor: '#0d0d16',
                borderRadius: '16px',
                border: '1px solid #1e1e32',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Newspaper size={16} color="#00c076" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0fa' }}>Market News Pulse</span>
                </div>
                <Link
                  to="/news"
                  style={{
                    fontSize: '11px',
                    color: '#818cf8',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  View All →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {marketNews.length > 0 ? (
                  marketNews.slice(0, 3).map((article) => (
                    <a
                      key={article.id}
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#12121e',
                        borderRadius: '8px',
                        border: '1px solid #1a1a2a',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#171726';
                        e.currentTarget.style.borderColor = '#2c2c48';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#12121e';
                        e.currentTarget.style.borderColor = '#1a1a2a';
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#e0e0f0', lineHeight: 1.4 }}>
                        {article.title}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#686884' }}>
                        {article.source}
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#686884' }}>Loading latest headlines...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
