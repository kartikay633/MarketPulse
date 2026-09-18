// ROADMAP: Section 5 & 10 — AIInsightPanel Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIStockInsight } from '../../hooks/useAI';
import { Sparkles, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Skeleton } from '../common/LoadingSkeleton';

export default function AIInsightPanel({ symbol }) {
  const navigate = useNavigate();
  const { data: insight, isLoading } = useAIStockInsight(symbol);

  if (isLoading) {
    return (
      <div
        style={{
          padding: '20px',
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
          <Skeleton width="70px" height="18px" borderRadius="10px" />
        </div>
        <Skeleton width="100%" height="45px" />
        <Skeleton width="85%" height="16px" />
      </div>
    );
  }

  const sentiment = insight?.sentiment || 'neutral';
  const isBullish = sentiment === 'bullish';
  const isBearish = sentiment === 'bearish';

  return (
    <div
      style={{
        backgroundColor: '#0d0d16',
        borderRadius: '16px',
        border: '1px solid #24243a',
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={15} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Pulse AI Stock Insights
          </h3>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '6px',
            backgroundColor: isBullish
              ? 'rgba(0, 192, 118, 0.15)'
              : isBearish
              ? 'rgba(255, 59, 87, 0.15)'
              : 'rgba(99, 102, 241, 0.15)',
            color: isBullish ? '#00c076' : isBearish ? '#ff3b57' : '#818cf8',
            border: `1px solid ${
              isBullish
                ? 'rgba(0, 192, 118, 0.3)'
                : isBearish
                ? 'rgba(255, 59, 87, 0.3)'
                : 'rgba(99, 102, 241, 0.3)'
            }`,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isBullish ? <TrendingUp size={12} /> : isBearish ? <TrendingDown size={12} /> : <Activity size={12} />}
          {sentiment}
        </span>
      </div>

      {/* Insight Narrative */}
      <div
        style={{
          padding: '14px 16px',
          backgroundColor: '#12121e',
          borderRadius: '10px',
          border: '1px solid #1f1f33',
          marginBottom: '14px',
          fontSize: '13px',
          color: '#d4d4e8',
          lineHeight: 1.6,
        }}
      >
        {insight?.summary}
      </div>

      {/* Technical Note / Key Factor */}
      {insight?.technicalNote && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#a0a0c0', marginBottom: '14px' }}>
          <strong style={{ color: '#818cf8' }}>Technical Note:</strong>
          <span>{insight.technicalNote}</span>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '11px', color: '#686884', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} /> Verified Upstox & Marketaux data
        </span>
        <button
          onClick={() => navigate(`/ai?q=Deep%20dive%20into%20${encodeURIComponent(symbol)}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            color: '#818cf8',
            fontWeight: 600,
            fontSize: '12.5px',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span>Ask Pulse AI about {symbol}</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
