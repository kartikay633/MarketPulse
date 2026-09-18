// ROADMAP: Section 5 & 14 — User Profile & Settings Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { usePortfolio } from '../hooks/useTrade';
import { useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
  Settings,
  User,
  Shield,
  RotateCcw,
  Sliders,
  CheckCircle2,
  LogOut,
  Bell,
  Cpu,
  Database,
  Radio,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import { toast } from 'sonner';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile, logout } = useAuthStore();
  const { data: portfolio } = usePortfolio();

  const [defaultChartType, setDefaultChartType] = useState(() => localStorage.getItem('mp_default_chart') || 'Candles');
  const [refreshInterval, setRefreshInterval] = useState(() => localStorage.getItem('mp_refresh_interval') || '15');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('mp_sound_enabled') === 'true');
  const [isResetting, setIsResetting] = useState(false);

  const handleChartTypeChange = (type) => {
    setDefaultChartType(type);
    localStorage.setItem('mp_default_chart', type);
    toast.success(`Default chart type set to ${type}`);
  };

  const handleIntervalChange = (val) => {
    setRefreshInterval(val);
    localStorage.setItem('mp_refresh_interval', val);
    toast.success(`Data refresh interval updated to ${val}s`);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('mp_sound_enabled', String(next));
    toast.info(`Trade sound effects ${next ? 'enabled' : 'disabled'}`);
  };

  const handleResetPortfolio = async () => {
    if (!window.confirm('Are you sure you want to reset your virtual portfolio? This will restore your virtual balance to ₹10,00,000 and clear your active positions.')) {
      return;
    }

    try {
      setIsResetting(true);
      const res = await api.post('/portfolio/reset');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['trade'] });
      toast.success(res.data.message || 'Portfolio reset to ₹10,00,000');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset portfolio');
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const email = user?.email || 'demo@marketpulse.in';
  const cashBalance = portfolio?.account?.cashBalance ?? 1000000;

  return (
    <ErrorBoundary>
      <div style={{ padding: '28px 36px 64px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid #1c1c2e',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Settings size={19} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              User Profile & Settings
            </h1>
            <p style={{ color: '#8888a6', fontSize: '13.5px', margin: '4px 0 0' }}>
              Manage your simulated trading account, charting preferences, and API connectivity.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* 1. Profile Information Card */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <User size={18} color="#818cf8" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Trader Profile
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{displayName}</div>
                <div style={{ fontSize: '13.5px', color: '#8888a6', marginTop: '2px' }}>{email}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    PRO SIMULATION TRADER
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 192, 118, 0.15)',
                      color: '#00c076',
                      border: '1px solid rgba(0, 192, 118, 0.3)',
                    }}
                  >
                    NSE/BSE LIVE ACCESS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Paper Trading Account Controls */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Zap size={18} color="#00c076" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Virtual Paper Trading Controls
              </h2>
            </div>

            <div
              style={{
                backgroundColor: '#07070e',
                borderRadius: '10px',
                border: '1px solid #181828',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: '#8888a6', fontWeight: 600 }}>CURRENT AVAILABLE CASH</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  ₹{formatIndianNumber(cashBalance)}
                </div>
                <div style={{ fontSize: '12px', color: '#686884', marginTop: '4px' }}>
                  Base initial provisioning: ₹10,00,000 (10 Lakhs INR)
                </div>
              </div>

              <button
                onClick={handleResetPortfolio}
                disabled={isResetting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 59, 87, 0.12)',
                  border: '1px solid rgba(255, 59, 87, 0.3)',
                  color: '#ff3b57',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: isResetting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <RotateCcw size={15} />
                <span>{isResetting ? 'Resetting...' : 'Reset Virtual Balance to ₹10L'}</span>
              </button>
            </div>
            <p style={{ color: '#686884', fontSize: '12px', margin: 0 }}>
              * Resetting your account will wipe existing simulated equity positions and restore available virtual cash to ₹10,00,000.
            </p>
          </div>

          {/* 3. Terminal & Charting Preferences */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sliders size={18} color="#eab308" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Charting & Terminal Preferences
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Default Chart Type */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a0a0c0', marginBottom: '8px' }}>
                  DEFAULT CHART TYPE
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Candles', 'Area', 'Line'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleChartTypeChange(type)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: defaultChartType === type ? '1px solid #6366f1' : '1px solid #1c1c2e',
                        backgroundColor: defaultChartType === type ? 'rgba(99, 102, 241, 0.15)' : '#0a0a14',
                        color: defaultChartType === type ? '#a5b4fc' : '#8888a6',
                        cursor: 'pointer',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Polling Interval */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a0a0c0', marginBottom: '8px' }}>
                  LIVE TICK REFRESH INTERVAL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['5', '15', '30', '60'].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => handleIntervalChange(sec)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: refreshInterval === sec ? '1px solid #6366f1' : '1px solid #1c1c2e',
                        backgroundColor: refreshInterval === sec ? 'rgba(99, 102, 241, 0.15)' : '#0a0a14',
                        color: refreshInterval === sec ? '#a5b4fc' : '#8888a6',
                        cursor: 'pointer',
                      }}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Live API Connectivity Diagnostics */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Cpu size={18} color="#00c076" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Live Data Feeds & Infrastructure
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {/* Upstox */}
              <div style={{ backgroundColor: '#07070e', padding: '14px', borderRadius: '8px', border: '1px solid #181828' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Upstox Market V2</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#00c076', fontWeight: 700 }}>
                    <CheckCircle2 size={13} /> Active
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#8888a6' }}>NSE & BSE Tick Stream</div>
              </div>

              {/* Marketaux */}
              <div style={{ backgroundColor: '#07070e', padding: '14px', borderRadius: '8px', border: '1px solid #181828' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Marketaux News</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#00c076', fontWeight: 700 }}>
                    <CheckCircle2 size={13} /> Active
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#8888a6' }}>Indian Financial Headlines</div>
              </div>

              {/* Gemini 1.5 Flash */}
              <div style={{ backgroundColor: '#07070e', padding: '14px', borderRadius: '8px', border: '1px solid #181828' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Pulse AI Assistant</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#00c076', fontWeight: 700 }}>
                    <CheckCircle2 size={13} /> Active
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#8888a6' }}>Gemini 1.5 Flash Grounded</div>
              </div>
            </div>
          </div>

          {/* 5. Session & Sign Out */}
          <div
            style={{
              backgroundColor: '#0c0c16',
              borderRadius: '14px',
              border: '1px solid #1c1c2e',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                End Current Session
              </h3>
              <p style={{ color: '#8888a6', fontSize: '12.5px', margin: '4px 0 0' }}>
                Sign out of Market Pulse terminal on this browser.
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#18182a',
                border: '1px solid #282848',
                color: '#f0f0fa',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
