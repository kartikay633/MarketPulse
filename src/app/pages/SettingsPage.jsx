// ROADMAP: Section 5 & 14 — User Profile & Settings Page
// Institutional Terminal Styling — Exact Market Pulse Design System
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { usePortfolio } from '../hooks/useTrade';
import { useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
  Settings,
  User,
  RotateCcw,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import { toast } from 'sonner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useThemeStore } from '../stores/themeStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile, logout } = useAuthStore();
  const { data: portfolio } = usePortfolio();

  const [defaultChartType, setDefaultChartType] = useState(() => localStorage.getItem('mp_default_chart') || 'Candles');
  const [refreshInterval, setRefreshInterval] = useState(() => localStorage.getItem('mp_refresh_interval') || '15');
  const [isResetting, setIsResetting] = useState(false);

  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Active theme changed to ${newTheme.toUpperCase()}`);
  };

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

  const handleResetPortfolio = async () => {
    if (!window.confirm('Are you sure you want to reset your virtual portfolio? This will restore your simulated balance to ₹10,00,000 and clear your active positions.')) {
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
      <div className="page-container-narrow">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
          <div className="ai-avatar">
            <Settings size={16} />
          </div>
          <div>
            <h1 className="page-title">Account & Terminal Settings</h1>
            <p className="page-subtitle" style={{ margin: '2px 0 0' }}>
              Simulated capital configuration, chart display preferences, and session controls.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Profile Card */}
          <div className="card card-body">
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Trader Profile
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '16px', fontWeight: 600 }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '2px' }}>{email}</div>
              </div>
              <span className="badge badge--positive badge--sm" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}>
                ACTIVE SESSION
              </span>
            </div>
          </div>

          {/* Paper Trading Account Card */}
          <div className="card card-body">
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Simulated Capital
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Available Cash</div>
                <div className="num-tabular" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  ₹{formatIndianNumber(cashBalance)}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Default Base Capital</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                  ₹10,00,000
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Restore your virtual account back to its initial ₹10,00,000 balance and clear paper holdings.
              </div>
              <button className="btn btn-danger" onClick={handleResetPortfolio} disabled={isResetting}>
                <RotateCcw size={12} />
                <span>{isResetting ? 'Resetting...' : 'Reset Portfolio'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Preferences */}
          <div className="card card-body">
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Terminal Preferences
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Terminal Theme */}
              <div className="settings-row">
                <div>
                  <div className="settings-label">Terminal Color Theme</div>
                  <div className="settings-description">Toggle between High-Contrast OLED Dark Mode and Institutional Light Mode</div>
                </div>
                <div className="settings-toggle-group">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`settings-toggle-btn${theme === 'dark' ? ' settings-toggle-btn--active' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Moon size={13} />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`settings-toggle-btn${theme === 'light' ? ' settings-toggle-btn--active' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Sun size={13} />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Default Chart Type */}
              <div className="settings-row">
                <div>
                  <div className="settings-label">Default Chart Style</div>
                  <div className="settings-description">Select preferred series representation on stock pages</div>
                </div>
                <div className="settings-toggle-group">
                  {['Candles', 'Line', 'Area'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleChartTypeChange(type)}
                      className={`settings-toggle-btn${defaultChartType === type ? ' settings-toggle-btn--active' : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Refresh Interval */}
              <div className="settings-row">
                <div>
                  <div className="settings-label">Market Data Polling Rate</div>
                  <div className="settings-description">Background interval for updating quote telemetry</div>
                </div>
                <div className="settings-toggle-group">
                  {['5', '15', '30', '60'].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => handleIntervalChange(sec)}
                      className={`settings-toggle-btn${refreshInterval === sec ? ' settings-toggle-btn--active' : ''}`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Session Termination */}
          <div className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Sign Out</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Clear local session token and return to authentication portal</div>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
