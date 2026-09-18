// ROADMAP: Section 5 & 9 — Financial News Page
import React, { useState } from 'react';
import { useMarketNews } from '../hooks/useNews';
import NewsFeed from '../components/news/NewsFeed';
import { Newspaper, Sparkles, TrendingUp, Compass, Globe, ShieldAlert } from 'lucide-react';
import ErrorBoundary from '../components/common/ErrorBoundary';

const TRENDING_TOPICS = [
  { tag: 'RBI Policy', category: 'economy' },
  { tag: 'NIFTY 50 Record', category: 'markets' },
  { tag: 'IT Earnings', category: 'stocks' },
  { tag: 'Renewable Energy', category: 'stocks' },
  { tag: 'Auto Sales Cycle', category: 'economy' },
  { tag: 'Banking FII Inflows', category: 'markets' },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: articles = [], isLoading, refetch } = useMarketNews(selectedCategory, 25);

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
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Newspaper size={17} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Financial News Pulse
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#064e3b',
                  color: '#34d399',
                  border: '1px solid #059669',
                }}
              >
                LIVE WIRE
              </span>
            </div>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: 0 }}>
              Curated real-time Indian stock market intelligence, macroeconomic indicators, and corporate disclosures.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#717192' }}>
            <Globe size={14} />
            <span>Marketaux API & Leading Indian Financial Sources</span>
          </div>
        </div>

        {/* Main Content Grid (News Feed + Sidebar) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.5fr) minmax(300px, 1fr)', gap: '28px' }}>
          {/* Left Column: News Feed */}
          <div>
            <NewsFeed
              articles={articles}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => setSelectedCategory(cat)}
              onRefresh={() => refetch()}
            />
          </div>

          {/* Right Column: Trending Topics & Sentiment Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Trending Topics Card */}
            <div
              style={{
                backgroundColor: '#0d0d16',
                borderRadius: '16px',
                border: '1px solid #1e1e32',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Compass size={16} color="#6366f1" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0fa', margin: 0 }}>
                  Trending Catalyst Themes
                </h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic.tag}
                    onClick={() => setSelectedCategory(topic.category)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#141422',
                      border: '1px solid #24243a',
                      color: '#c4c4dc',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#24243a';
                      e.currentTarget.style.color = '#c4c4dc';
                    }}
                  >
                    #{topic.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Indian Market Sentiment Meter */}
            <div
              style={{
                backgroundColor: '#0d0d16',
                borderRadius: '16px',
                border: '1px solid #1e1e32',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp size={16} color="#00c076" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0fa', margin: 0 }}>
                  Newswire Sentiment
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#8888a6' }}>Aggregated Today:</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#00c076' }}>74% Bullish / Neutral</span>
              </div>

              <div style={{ height: '8px', width: '100%', backgroundColor: '#191929', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '62%', backgroundColor: '#00c076' }} title="Positive: 62%" />
                <div style={{ width: '26%', backgroundColor: '#6366f1' }} title="Neutral: 26%" />
                <div style={{ width: '12%', backgroundColor: '#ff3b57' }} title="Cautious: 12%" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#686884' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00c076' }} /> Bullish
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1' }} /> Neutral
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff3b57' }} /> Bearish
                </span>
              </div>
            </div>

            {/* Editorial Disclaimer */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#10101a',
                border: '1px solid #1a1a28',
                fontSize: '11.5px',
                color: '#656580',
                lineHeight: 1.5,
                display: 'flex',
                gap: '8px',
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#8888a6' }} />
              <div>
                Financial news is provided for educational and analytical purposes only. Headlines do not constitute investment advice or buy/sell recommendations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
