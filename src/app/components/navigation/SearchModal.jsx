// ROADMAP: Section 5 & 16 — SearchModal Component
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, TrendingUp, Clock, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

const RECENT_KEY = 'marketpulse_recent_searches';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Load recent searches on mount / open
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch {
        setRecentSearches([]);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/search?q=${encodeURIComponent(query.trim())}`);
        setResults(res.data?.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search request error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Keyboard navigation listener (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      const activeList = query.trim() ? results : (recentSearches.length > 0 ? recentSearches : results);
      if (!activeList || activeList.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % activeList.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeList[selectedIndex]) {
          handleSelect(activeList[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, recentSearches, selectedIndex, query]);

  const handleSelect = (item) => {
    // Save to recents
    try {
      const updated = [
        item,
        ...recentSearches.filter((s) => s.symbol !== item.symbol),
      ].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    onClose();
    navigate(`/stocks/${item.symbol}`);
  };

  const handleClearRecents = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  if (!isOpen) return null;

  const displayList = query.trim() ? results : (recentSearches.length > 0 ? recentSearches : results);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 10, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: '#0d0d16',
          borderRadius: '16px',
          border: '1px solid #282845',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #1e1e32',
          }}
        >
          <Search size={18} color="#6366f1" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search stocks by symbol, company, or sector (e.g. RELIANCE, TCS, Banking)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f0f0fa',
              fontSize: '15px',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6e6e88',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              backgroundColor: '#1b1b2d',
              color: '#8b8ba8',
              padding: '3px 7px',
              borderRadius: '5px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '10px 8px',
          }}
        >
          {!query.trim() && recentSearches.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#717192',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} /> Recent Searches
              </span>
              <button
                onClick={handleClearRecents}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>
          )}

          {!query.trim() && recentSearches.length === 0 && (
            <div
              style={{
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#717192',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <TrendingUp size={12} /> Popular Benchmarks & Equities
            </div>
          )}

          {displayList.length === 0 && !loading && (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                color: '#656580',
                fontSize: '13px',
              }}
            >
              No stocks found matching "{query}"
            </div>
          )}

          {displayList.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.symbol}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#1e1e35' : 'transparent',
                  transition: 'background-color 0.1s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#2a2a4c' : '#141422',
                      border: '1px solid #27273f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#6366f1' : '#8888aa',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {item.symbol.includes(':') ? item.symbol.split(':')[1].substring(0, 2) : item.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#f0f0fa', fontSize: '13.5px' }}>
                        {item.symbol}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: '#1b1b2d',
                          color: '#8b8ba8',
                          fontWeight: 500,
                        }}
                      >
                        {item.exchange || 'NSE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#82829e', marginTop: '2px' }}>
                      {item.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.sector && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#141424',
                        color: '#9e9ebb',
                        border: '1px solid #222238',
                      }}
                    >
                      {item.sector}
                    </span>
                  )}
                  {isSelected && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#6366f1',
                        fontWeight: 500,
                      }}
                    >
                      Select <CornerDownLeft size={12} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Shortcut Hints */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid #1c1c2e',
            backgroundColor: '#090910',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#686884',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><kbd style={{ background: '#19192b', padding: '2px 5px', borderRadius: '3px', color: '#9d9dbb' }}>↑</kbd> <kbd style={{ background: '#19192b', padding: '2px 5px', borderRadius: '3px', color: '#9d9dbb' }}>↓</kbd> Navigate</span>
            <span><kbd style={{ background: '#19192b', padding: '2px 5px', borderRadius: '3px', color: '#9d9dbb' }}>↵</kbd> Select</span>
            <span><kbd style={{ background: '#19192b', padding: '2px 5px', borderRadius: '3px', color: '#9d9dbb' }}>Esc</kbd> Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6366f1' }}>
            <Sparkles size={12} /> Real-time NSE/BSE
          </div>
        </div>
      </div>
    </div>
  );
}
