// ROADMAP: Section 5 & 9 — NewsFeed Component
import React, { useState } from 'react';
import NewsCard from './NewsCard';
import { Skeleton } from '../common/LoadingSkeleton';
import { Search, Filter, Newspaper, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All News' },
  { id: 'markets', label: 'Markets' },
  { id: 'stocks', label: 'Equities & Companies' },
  { id: 'economy', label: 'Economy & Policy' },
];

export default function NewsFeed({
  articles = [],
  isLoading = false,
  selectedCategory = 'all',
  onCategoryChange,
  onRefresh,
}) {
  const [filterText, setFilterText] = useState('');

  const filtered = articles.filter((a) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.summary?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q) ||
      (a.relatedSymbols || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category Pills & Search Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#0a0a12',
          borderRadius: '12px',
          border: '1px solid #1c1c2e',
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange && onCategoryChange(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#6366f1' : '#141422',
                  color: isActive ? '#ffffff' : '#8888aa',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#12121e',
              border: '1px solid #232338',
            }}
          >
            <Search size={14} color="#686888" />
            <input
              type="text"
              placeholder="Filter headlines..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f0f0fa',
                fontSize: '12px',
                width: '150px',
              }}
            />
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh News"
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#141422',
                border: '1px solid #232338',
                color: '#8b8ba8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: '#0d0d16',
                border: '1px solid #1c1c2e',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <Skeleton width="120px" height="14px" />
              <Skeleton width="85%" height="18px" />
              <Skeleton width="60%" height="14px" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            backgroundColor: '#0d0d16',
            borderRadius: '12px',
            border: '1px solid #1c1c2e',
            color: '#717192',
          }}
        >
          <Newspaper size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0fa', marginBottom: '4px' }}>
            No news articles found
          </div>
          <div style={{ fontSize: '12px' }}>
            {filterText ? `No articles matching "${filterText}"` : 'No articles available for this category right now.'}
          </div>
        </div>
      )}

      {/* Articles List */}
      {!isLoading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
