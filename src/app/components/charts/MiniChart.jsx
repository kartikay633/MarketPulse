// ROADMAP: Section 5 — MiniChart (Sparkline Component)
import React from 'react';

export default function MiniChart({
  data = [],
  width = 120,
  height = 36,
  isPositive = true,
  strokeWidth = 2,
}) {
  if (!data || data.length < 2) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#44445a',
          fontSize: '10px',
        }}
      >
        --
      </div>
    );
  }

  const values = data.map((d) => (typeof d === 'number' ? d : (d.close ?? d.value ?? 0)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((val, index) => {
    const x = (index / (values.length - 1)) * (width - 4) + 2;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const strokeColor = isPositive ? '#00c076' : '#ff3b57';
  const fillColor = isPositive ? 'rgba(0, 192, 118, 0.12)' : 'rgba(255, 59, 87, 0.12)';

  // Closed area polygon for soft gradient
  const areaD = `${pathD} L ${width - 2},${height} L 2,${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <path d={areaD} fill={fillColor} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
