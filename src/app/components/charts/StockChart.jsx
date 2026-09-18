// ROADMAP: Section 5 & 8 — StockChart (TradingView Lightweight Charts v5)
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
} from 'lightweight-charts';
import { BarChart3, LineChart as LineIcon, Activity, Maximize2 } from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../../utils/formatters';

const TIMEFRAMES = [
  { id: '1D', label: '1D' },
  { id: '1W', label: '1W' },
  { id: '1M', label: '1M' },
  { id: '3M', label: '3M' },
  { id: '1Y', label: '1Y' },
  { id: '5Y', label: '5Y' },
];

const CHART_TYPES = [
  { id: 'candlestick', label: 'Candles', icon: BarChart3 },
  { id: 'area', label: 'Area', icon: Activity },
  { id: 'line', label: 'Line', icon: LineIcon },
];

export default function StockChart({
  symbol,
  candles = [],
  isLoading = false,
  selectedTimeframe = '1D',
  onTimeframeChange,
}) {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const [chartType, setChartType] = useState('candlestick');
  const [hoverData, setHoverData] = useState(null);

  // Fallback to latest candle if not hovering
  const latestCandle = useMemo(() => {
    if (!candles || candles.length === 0) return null;
    return candles[candles.length - 1];
  }, [candles]);

  const activeCandle = hoverData || latestCandle;

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = 460;

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#090910' },
        textColor: '#82829e',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#6366f1',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e1e35',
        },
        horzLine: {
          color: '#6366f1',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e1e35',
        },
      },
      timeScale: {
        borderColor: '#1c1c2e',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1c1c2e',
        scaleMargins: {
          top: 0.12,
          bottom: 0.28, // Leave room for volume at bottom
        },
      },
    });

    chartInstanceRef.current = chart;

    // Main price series
    let mainSeries;
    if (chartType === 'candlestick') {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#00c076',
        downColor: '#ff3b57',
        borderVisible: false,
        wickUpColor: '#00c076',
        wickDownColor: '#ff3b57',
      });
    } else if (chartType === 'area') {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: 'rgba(99, 102, 241, 0.45)',
        bottomColor: 'rgba(99, 102, 241, 0.01)',
        lineColor: '#6366f1',
        lineWidth: 2,
      });
    } else {
      mainSeries = chart.addSeries(LineSeries, {
        color: '#6366f1',
        lineWidth: 2,
      });
    }

    mainSeriesRef.current = mainSeries;

    // Volume histogram series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume_scale',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    // Set chart data
    if (candles && candles.length > 0) {
      // Sort in ascending order just in case
      const sorted = [...candles].sort((a, b) => a.time - b.time);

      if (chartType === 'candlestick') {
        mainSeries.setData(sorted);
      } else {
        mainSeries.setData(sorted.map((c) => ({ time: c.time, value: c.close })));
      }

      volumeSeries.setData(
        sorted.map((c) => ({
          time: c.time,
          value: c.volume || 0,
          color: c.close >= c.open ? 'rgba(0, 192, 118, 0.45)' : 'rgba(255, 59, 87, 0.45)',
        }))
      );

      chart.timeScale().fitContent();
    }

    // Crosshair move subscription for live OHLC inspection
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoverData(null);
        return;
      }

      const candleVal = param.seriesData.get(mainSeries);
      const volumeVal = param.seriesData.get(volumeSeries);

      if (candleVal) {
        if (chartType === 'candlestick') {
          setHoverData({
            time: param.time,
            open: candleVal.open,
            high: candleVal.high,
            low: candleVal.low,
            close: candleVal.close,
            volume: volumeVal?.value || 0,
          });
        } else {
          setHoverData({
            time: param.time,
            close: candleVal.value,
            volume: volumeVal?.value || 0,
          });
        }
      }
    });

    // ResizeObserver for responsive width
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const newWidth = entries[0].contentRect.width;
      chart.applyOptions({ width: newWidth });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartInstanceRef.current = null;
    };
  }, [candles, chartType]);

  const handleFit = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().fitContent();
    }
  };

  // Format date/time for tooltip
  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    const d = new Date(timestamp * 1000);
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isBullish = activeCandle ? (activeCandle.close >= (activeCandle.open ?? activeCandle.close)) : true;
  const candleChange = activeCandle && activeCandle.open ? (activeCandle.close - activeCandle.open) : 0;
  const candleChangePct = activeCandle && activeCandle.open ? ((candleChange / activeCandle.open) * 100) : 0;

  return (
    <div
      style={{
        backgroundColor: '#0d0d16',
        borderRadius: '16px',
        border: '1px solid #1e1e32',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Chart Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid #19192b',
          backgroundColor: '#0a0a12',
          gap: '12px',
        }}
      >
        {/* Timeframe Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#131322', padding: '3px', borderRadius: '8px' }}>
          {TIMEFRAMES.map((tf) => {
            const isActive = selectedTimeframe === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => onTimeframeChange && onTimeframeChange(tf.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#6366f1' : 'transparent',
                  color: isActive ? '#ffffff' : '#8888a6',
                  transition: 'all 0.15s ease',
                }}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Chart Type Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#131322', padding: '3px', borderRadius: '8px' }}>
            {CHART_TYPES.map((ct) => {
              const Icon = ct.icon;
              const isActive = chartType === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => setChartType(ct.id)}
                  title={ct.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#242440' : 'transparent',
                    color: isActive ? '#f0f0fa' : '#777794',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={13} />
                  <span>{ct.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleFit}
            title="Reset Zoom / Fit Chart"
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: '#131322',
              border: '1px solid #202035',
              color: '#8b8ba8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Interactive OHLC Legend Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '18px',
          padding: '10px 18px',
          backgroundColor: '#090910',
          borderBottom: '1px solid #151524',
          fontSize: '12px',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div style={{ color: '#6e6e88' }}>
          {activeCandle ? formatTime(activeCandle.time) : '--'}
        </div>

        {activeCandle?.open !== undefined && (
          <div style={{ display: 'flex', gap: '14px' }}>
            <span>
              <span style={{ color: '#606078' }}>O: </span>
              <span style={{ color: '#d0d0e2', fontWeight: 600 }}>₹{formatIndianNumber(activeCandle.open)}</span>
            </span>
            <span>
              <span style={{ color: '#606078' }}>H: </span>
              <span style={{ color: '#00c076', fontWeight: 600 }}>₹{formatIndianNumber(activeCandle.high)}</span>
            </span>
            <span>
              <span style={{ color: '#606078' }}>L: </span>
              <span style={{ color: '#ff3b57', fontWeight: 600 }}>₹{formatIndianNumber(activeCandle.low)}</span>
            </span>
            <span>
              <span style={{ color: '#606078' }}>C: </span>
              <span style={{ color: isBullish ? '#00c076' : '#ff3b57', fontWeight: 700 }}>
                ₹{formatIndianNumber(activeCandle.close)}
              </span>
            </span>
            <span>
              <span style={{ color: isBullish ? '#00c076' : '#ff3b57', fontWeight: 600 }}>
                {candleChange >= 0 ? '+' : ''}{candleChange.toFixed(2)} ({candleChangePct.toFixed(2)}%)
              </span>
            </span>
          </div>
        )}

        {activeCandle?.open === undefined && activeCandle?.close !== undefined && (
          <div>
            <span style={{ color: '#606078' }}>Price: </span>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>₹{formatIndianNumber(activeCandle.close)}</span>
          </div>
        )}

        {activeCandle?.volume !== undefined && (
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ color: '#606078' }}>Vol: </span>
            <span style={{ color: '#a5a5c4' }}>{formatIndianNumber(activeCandle.volume)}</span>
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div style={{ position: 'relative', width: '100%', minHeight: '460px' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(9, 9, 16, 0.7)',
              backdropFilter: 'blur(3px)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#8282a5',
              fontSize: '13px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2.5px solid #282845',
                borderTopColor: '#6366f1',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Fetching live candles...</span>
          </div>
        )}

        <div ref={chartContainerRef} style={{ width: '100%', height: '460px' }} />
      </div>
    </div>
  );
}
