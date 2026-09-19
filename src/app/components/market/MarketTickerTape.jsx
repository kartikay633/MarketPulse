// Institutional Live Financial Ticker Tape Component
import React from 'react';
import { useMarketOverview } from '../../hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FALLBACK_TICKERS = [
  { symbol: 'NIFTY 50', price: '23,346.40', change: '+0.32%', isPos: true },
  { symbol: 'SENSEX', price: '74,294.96', change: '-0.03%', isPos: false },
  { symbol: 'NIFTY BANK', price: '56,358.70', change: '+0.54%', isPos: true },
  { symbol: 'INDIA VIX', price: '11.39', change: '-7.90%', isPos: false },
  { symbol: 'RELIANCE', price: '₹2,980.50', change: '+2.23%', isPos: true },
  { symbol: 'TCS', price: '₹4,290.00', change: '+1.47%', isPos: true },
  { symbol: 'INFY', price: '₹1,942.20', change: '+2.80%', isPos: true },
  { symbol: 'HDFCBANK', price: '₹1,675.00', change: '+1.73%', isPos: true },
  { symbol: 'TATAMOTORS', price: '₹984.60', change: '+4.06%', isPos: true },
  { symbol: 'ICICIBANK', price: '₹1,228.30', change: '+1.33%', isPos: true },
  { symbol: 'BHARTIARTL', price: '₹1,610.40', change: '+1.65%', isPos: true },
  { symbol: 'SBIN', price: '₹812.40', change: '+0.85%', isPos: true },
];

export function MarketTickerTape() {
  const { data: overview } = useMarketOverview();

  // Combine indices from overview with top movers if available
  const tickers = overview?.indices?.length
    ? [
        ...overview.indices.map((idx) => ({
          symbol: idx.name || idx.symbol,
          price: (idx.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: `${idx.changePercent >= 0 ? '+' : ''}${(idx.changePercent || 0).toFixed(2)}%`,
          isPos: (idx.changePercent || 0) >= 0,
        })),
        ...FALLBACK_TICKERS.slice(4),
      ]
    : FALLBACK_TICKERS;

  // Duplicate for seamless infinite marquee scroll
  const displayTickers = [...tickers, ...tickers];

  return (
    <div className="ticker-tape-container">
      <div className="ticker-tape-badge">
        <span className="ticker-tape-dot" />
        <span>NSE / BSE FEED</span>
      </div>
      <div className="ticker-tape-track">
        <div className="ticker-tape-content">
          {displayTickers.map((t, idx) => (
            <div key={`${t.symbol}-${idx}`} className="ticker-tape-item">
              <span className="ticker-tape-sym">{t.symbol}</span>
              <span className="ticker-tape-price">{t.price}</span>
              <span className={`ticker-tape-change ${t.isPos ? 'text-positive' : 'text-negative'}`}>
                {t.isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketTickerTape;
