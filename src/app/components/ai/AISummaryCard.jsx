// ROADMAP: Section 5 & 10 — AISummaryCard Component
import React from 'react';
import { Link } from 'react-router-dom';
import { useAIMarketSummary } from '../../hooks/useAI';
import { Sparkles, ArrowRight, TrendingUp, RefreshCw, ShieldCheck } from 'lucide-react';
import { Skeleton } from '../common/LoadingSkeleton';

export default function AISummaryCard() {
  const { data: summary, isLoading, refetch, isFetching } = useAIMarketSummary();

  if (isLoading) {
    return (
      <div
        style={{
          padding: '22px',
          borderRadius: '16px',
          backgroundColor: '#0d0d16',
          border: '1px solid #1e1e32',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="160px" height="20px" />
          <Skeleton width="80px" height="18px" borderRadius="10px" />
        </div>
        <Skeleton width="100%" height="36px" />
        <Skeleton width="90%" height="16px" />
        <Skeleton width="75%" height="16px" />
      </div>
    );
  }

  const isBullish = summary?.marketStance === 'Bullish Momentum';

  return (
    <div
      style={{
        padding: '22px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(13, 13, 22, 0.95))',
        border: '1px solid rgba(99, 102, 241, 0.28)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={14} />
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f0f0fa' }}>
            Pulse AI Market Intelligence
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: isBullish ? 'rgba(0, 192, 118, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: isBullish ? '#00c076' : '#818cf8',
              border: `1px solid ${isBullish ? 'rgba(0, 192, 118, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            }}
          >
            {summary?.marketStance || 'Market Pulse'}
          </span>

          <button
            onClick={() => refetch()}
            title="Refresh AI Digest"
            style={{
              background: 'none',
              border: 'none',
              color: '#717192',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RefreshCw size={12} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Headline */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.4 }}>
        {summary?.headline}
      </h3>

      {/* Summary Narrative */}
      <p style={{ fontSize: '12.5px', color: '#a5a5c5', lineHeight: 1.6, margin: 0 }}>
        {summary?.summary}
      </p>

      {/* Key Drivers */}
      {summary?.keyDrivers && summary.keyDrivers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
          {summary.keyDrivers.slice(0, 2).map((driver, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#c4c4dc' }}>
              <span style={{ color: '#818cf8', fontWeight: 700, lineHeight: 1.2 }}>•</span>
              <span style={{ lineHeight: 1.45 }}>{driver}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer CTA to /ai */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '11px', color: '#656580', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} /> Grounded in live Upstox data
        </span>
        <Link
          to="/ai"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: '#818cf8',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <span>Ask Pulse AI</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
