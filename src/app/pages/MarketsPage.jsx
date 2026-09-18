import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketOverview, useGainers, useLosers, useActive } from '../hooks/useMarketData';
import IndexCard from '../components/market/IndexCard';
import MarketBreadthBar from '../components/market/MarketBreadthBar';
import SectorBar from '../components/market/SectorBar';
import StockRow from '../components/market/StockRow';
import MarketHeatmap from '../components/market/MarketHeatmap';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { Search } from 'lucide-react';

export default function MarketsPage() {
  const navigate = useNavigate();
  const { data: overview, isLoading: isOverviewLoading } = useMarketOverview();
  const { data: gainers = [], isLoading: isGainersLoading } = useGainers(20);
  const { data: losers = [], isLoading: isLosersLoading } = useLosers(20);
  const { data: active = [], isLoading: isActiveLoading } = useActive(20);

  const [filterText, setFilterText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'gainers' | 'losers' | 'active'

  const filterList = (list) => {
    if (!filterText) return list;
    const q = filterText.toLowerCase();
    return list.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f0f5' }}>
              Indian Equities Overview
            </h1>
            <p style={{ fontSize: '13px', color: '#a0a0b8', marginTop: '4px' }}>
              Real-time benchmark indices, sector heatmaps, market breadth, and mover distribution
            </p>
          </div>
        </div>

        {/* Major Indices */}
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

        {/* Market Breadth */}
        {overview?.breadth && <MarketBreadthBar breadth={overview.breadth} />}

        {/* Sector Breakdown */}
        {overview?.sectors && <SectorBar sectors={overview.sectors} />}

        {/* Indian Equities Treemap Heatmap */}
        <MarketHeatmap />

        {/* Extended Stock Movers Tables */}
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: '#12121a',
            border: '1px solid #1e1e30',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: activeCategory === 'all' ? 600 : 500,
                  backgroundColor: activeCategory === 'all' ? '#3366ff' : '#1a1a28',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                All Movers
              </button>
              <button
                onClick={() => setActiveCategory('gainers')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: activeCategory === 'gainers' ? 600 : 500,
                  backgroundColor: activeCategory === 'gainers' ? 'rgba(0, 200, 83, 0.2)' : '#1a1a28',
                  color: activeCategory === 'gainers' ? '#00c853' : '#a0a0b8',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Top Gainers ({gainers.length})
              </button>
              <button
                onClick={() => setActiveCategory('losers')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: activeCategory === 'losers' ? 600 : 500,
                  backgroundColor: activeCategory === 'losers' ? 'rgba(255, 23, 68, 0.2)' : '#1a1a28',
                  color: activeCategory === 'losers' ? '#ff1744' : '#a0a0b8',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Top Losers ({losers.length})
              </button>
              <button
                onClick={() => setActiveCategory('active')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: activeCategory === 'active' ? 600 : 500,
                  backgroundColor: activeCategory === 'active' ? 'rgba(51, 102, 255, 0.2)' : '#1a1a28',
                  color: activeCategory === 'active' ? '#3366ff' : '#a0a0b8',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Volume Leaders ({active.length})
              </button>
            </div>

            {/* Quick Search in list */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: '#0a0a0f',
                border: '1px solid #222236',
              }}
            >
              <Search size={14} color="#606078" />
              <input
                type="text"
                placeholder="Filter symbols..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f0f0f5',
                  fontSize: '13px',
                  outline: 'none',
                  width: '160px',
                }}
              />
            </div>
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
            <span style={{ textAlign: 'right' }}>Change (%)</span>
            <span style={{ textAlign: 'right' }}>Volume</span>
          </div>

          {/* Table Body */}
          {isGainersLoading || isLosersLoading ? (
            <TableSkeleton rows={8} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(activeCategory === 'all' || activeCategory === 'gainers') && (
                <>
                  {activeCategory === 'all' && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#00c853', padding: '6px 4px' }}>
                      Top Daily Gainers
                    </div>
                  )}
                  {filterList(gainers).map((s) => (
                    <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                  ))}
                </>
              )}

              {(activeCategory === 'all' || activeCategory === 'losers') && (
                <>
                  {activeCategory === 'all' && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#ff1744', padding: '12px 4px 6px 4px' }}>
                      Top Daily Losers
                    </div>
                  )}
                  {filterList(losers).map((s) => (
                    <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                  ))}
                </>
              )}

              {activeCategory === 'active' &&
                filterList(active).map((s) => (
                  <StockRow key={s.symbol} stock={s} onClick={() => navigate(`/stocks/${s.symbol}`)} />
                ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
