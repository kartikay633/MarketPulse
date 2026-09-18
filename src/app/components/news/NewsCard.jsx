// ROADMAP: Section 5 & 9 — NewsCard Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, TrendingUp, TrendingDown, Clock, Newspaper } from 'lucide-react';

export default function NewsCard({ article, compact = false }) {
  const navigate = useNavigate();

  if (!article) return null;

  const formatTimeAgo = (isoString) => {
    if (!isoString) return '';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 60) return `${Math.max(diffMins, 1)}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  const sentiment = article.sentiment || 'neutral';
  const isPositive = sentiment === 'positive';
  const isNegative = sentiment === 'negative';

  return (
    <article
      style={{
        backgroundColor: '#0d0d16',
        borderRadius: '12px',
        border: '1px solid #1e1e32',
        padding: compact ? '14px 16px' : '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#37375a';
        e.currentTarget.style.backgroundColor = '#12121e';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e1e32';
        e.currentTarget.style.backgroundColor = '#0d0d16';
      }}
    >
      {/* Meta Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#717192',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: '#9d9db8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Newspaper size={12} color="#6366f1" />
            {article.source}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} />
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Sentiment Badge */}
        {sentiment !== 'neutral' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: isPositive ? 'rgba(0, 192, 118, 0.12)' : 'rgba(255, 59, 87, 0.12)',
              color: isPositive ? '#00c076' : '#ff3b57',
              border: `1px solid ${isPositive ? 'rgba(0, 192, 118, 0.25)' : 'rgba(255, 59, 87, 0.25)'}`,
            }}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? 'Bullish' : 'Bearish'}
          </span>
        )}
      </div>

      {/* Article Title */}
      <h3
        style={{
          margin: 0,
          fontSize: compact ? '13.5px' : '15px',
          fontWeight: 600,
          lineHeight: 1.45,
          color: '#f0f0fa',
        }}
      >
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '5px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#818cf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#f0f0fa')}
        >
          <span>{article.title}</span>
          <ExternalLink size={12} style={{ flexShrink: 0, opacity: 0.6, transform: 'translateY(1px)' }} />
        </a>
      </h3>

      {/* Summary Snippet */}
      {!compact && article.summary && (
        <p
          style={{
            margin: 0,
            fontSize: '12.5px',
            color: '#8c8ca8',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.summary}
        </p>
      )}

      {/* Related Symbols Footer */}
      {article.relatedSymbols && article.relatedSymbols.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '10.5px', color: '#60607a', fontWeight: 500 }}>Related:</span>
          {article.relatedSymbols.slice(0, 4).map((sym) => (
            <button
              key={sym}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/stocks/${sym}`);
              }}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '5px',
                backgroundColor: '#161626',
                color: '#818cf8',
                border: '1px solid #282845',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#23233c';
                e.currentTarget.style.borderColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#161626';
                e.currentTarget.style.borderColor = '#282845';
              }}
            >
              {sym}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
