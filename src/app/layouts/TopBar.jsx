// ROADMAP: Section 3 & 5 — TopBar Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useMarketOverview } from '../hooks/useMarketData';
import { MarketStatusBadge } from '../components/market/MarketStatusBadge';
import SearchModal from '../components/navigation/SearchModal';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export function TopBar() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const { data: overview } = useMarketOverview();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayName = profile?.displayName || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Trader';

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out of terminal');
    navigate('/login');
  };

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header
        style={{
          height: '64px',
          backgroundColor: '#0a0a0f',
          borderBottom: '1px solid #1e1e30',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Search Input Bar */}
        <div
          onClick={() => setIsSearchOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: '#12121a',
          border: '1px solid #222236',
          width: '360px',
          cursor: 'pointer',
          color: '#606078',
          fontSize: '13px',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#3366ff';
          e.currentTarget.style.backgroundColor = '#181824';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#222236';
          e.currentTarget.style.backgroundColor = '#12121a';
        }}
      >
        <Search size={15} color="#606078" />
        <span style={{ flex: 1 }}>Search NSE/BSE stocks, indices, sectors...</span>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: '#1e1e30',
            color: '#a0a0b8',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Real-time Market Status */}
        <MarketStatusBadge
          status={overview?.status || 'CLOSED'}
          reason={overview?.statusMessage}
        />

        {/* Notifications */}
        <button
          title="Alerts & Notifications"
          onClick={() => navigate('/alerts')}
          style={{
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: '#12121a',
            border: '1px solid #1e1e30',
            color: '#a0a0b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#3366ff',
            }}
          />
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 6px',
              borderRadius: '8px',
              backgroundColor: '#12121a',
              border: '1px solid #1e1e30',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a, #3366ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f0f0f5' }}>{displayName}</span>
            <ChevronDown size={14} color="#606078" />
          </div>

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '180px',
                backgroundColor: '#12121a',
                border: '1px solid #2a2a44',
                borderRadius: '10px',
                padding: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #1e1e30', marginBottom: '4px' }}>
                <div style={{ fontSize: '11px', color: '#606078' }}>Signed in as</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#f0f0f5', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#a0a0b8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1a28')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Settings & Preferences
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#ff5252',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 23, 68, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  </>
);
}

export default TopBar;
