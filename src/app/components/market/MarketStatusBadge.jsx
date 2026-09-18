// ROADMAP: Section 2 & 8 — Market Status Badge Component
import React from 'react';

export function MarketStatusBadge({ status = 'CLOSED', reason, nextEvent, compact = false }) {
  const isLive = status === 'OPEN';
  const isPre = status === 'PRE_MARKET';
  const isPost = status === 'POST_MARKET';

  const dotColor = isLive ? '#00c853' : isPre ? '#ffab00' : isPost ? '#3366ff' : '#ff1744';
  const bgColor = isLive
    ? 'rgba(0, 200, 83, 0.1)'
    : isPre
    ? 'rgba(255, 171, 0, 0.1)'
    : isPost
    ? 'rgba(51, 102, 255, 0.1)'
    : 'rgba(255, 23, 68, 0.1)';
  const borderColor = isLive
    ? 'rgba(0, 200, 83, 0.25)'
    : isPre
    ? 'rgba(255, 171, 0, 0.25)'
    : isPost
    ? 'rgba(51, 102, 255, 0.25)'
    : 'rgba(255, 23, 68, 0.25)';

  const label = isLive
    ? 'MARKET LIVE'
    : isPre
    ? 'PRE-OPEN SESSION'
    : isPost
    ? 'POST-MARKET'
    : 'MARKET CLOSED';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '2px 8px' : '4px 10px',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        fontSize: compact ? '10px' : '11px',
        fontWeight: 600,
        color: dotColor,
        letterSpacing: '0.04em',
      }}
      title={nextEvent || reason || label}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: isLive ? `0 0 8px ${dotColor}` : 'none',
          animation: isLive ? 'pulseGlow 2s infinite' : 'none',
        }}
      />
      <span>{label}</span>
      {!compact && nextEvent && (
        <span style={{ color: '#a0a0b8', fontWeight: 400, fontSize: '10px', marginLeft: '4px' }}>
          • {nextEvent}
        </span>
      )}
    </div>
  );
}

export default MarketStatusBadge;
