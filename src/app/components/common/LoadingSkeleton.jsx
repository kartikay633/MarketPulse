// ROADMAP: Section 5 — Loading Skeleton Component
import React from 'react';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#1a1a28',
        backgroundImage: 'linear-gradient(90deg, #1a1a28 0%, #222236 50%, #1a1a28 100%)',
        backgroundSize: '200% 100%',
        animation: 'pulseGlow 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#12121a',
        border: '1px solid #1e1e30',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="90px" height="14px" />
        <Skeleton width="45px" height="18px" borderRadius="10px" />
      </div>
      <Skeleton width="130px" height="28px" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="60px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '8px',
            backgroundColor: '#12121a',
            border: '1px solid #1e1e30',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="110px" height="14px" />
            <Skeleton width="70px" height="12px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <Skeleton width="80px" height="16px" />
            <Skeleton width="50px" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = '460px' }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: '16px',
        backgroundColor: '#0d0d16',
        border: '1px solid #1e1e32',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="180px" height="24px" />
        <Skeleton width="120px" height="24px" />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '20px 0' }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={`${30 + Math.sin(i) * 25 + (i % 5) * 10}%`}
            borderRadius="3px"
          />
        ))}
      </div>
    </div>
  );
}

export const LoadingSkeleton = Skeleton;
export default Skeleton;
