// ROADMAP: Section 3, 5 & Design Refinement — Institutional Terminal TopBar
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useMarketOverview } from '../hooks/useMarketData';
import { MarketStatusBadge } from '../components/market/MarketStatusBadge';
import SearchModal from '../components/navigation/SearchModal';
import { Search, Bell, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

export function TopBar() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { data: overview } = useMarketOverview();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.includes('Mac');
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

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

  const displayName = profile?.displayName || user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out of terminal');
    navigate('/login');
  };

  const handleToggleTheme = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  };

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header className="topbar">
        {/* Global Search Bar */}
        <div
          className="topbar-search"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={14} color="var(--text-muted)" />
          <span className="topbar-search-placeholder">Search NSE/BSE stocks, indices...</span>
          <span className="topbar-kbd">{shortcutKey}</span>
        </div>

        {/* Right Terminal Controls */}
        <div className="topbar-controls">
          {/* Real-time Market Status */}
          <MarketStatusBadge
            status={overview?.status || 'CLOSED'}
            reason={overview?.statusMessage}
          />

          {/* Theme Toggle Button */}
          <button
            className="topbar-icon-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            onClick={handleToggleTheme}
            style={{ color: theme === 'dark' ? '#F59E0B' : '#3B82F6' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Price Alerts Notification Button */}
          <button
            className="topbar-icon-btn"
            title="Price Alerts & Triggers"
            onClick={() => navigate('/alerts')}
          >
            <Bell size={15} />
            <span className="topbar-notification-dot" />
          </button>

          {/* User Profile Menu */}
          <div style={{ position: 'relative' }}>
            <div
              className="topbar-profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="topbar-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="topbar-profile-name">{displayName}</span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="dropdown-backdrop"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="topbar-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-label">Account</div>
                    <div className="dropdown-value">
                      {user?.email || 'demo@marketpulse.in'}
                    </div>
                  </div>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                  >
                    Settings & Profile
                  </button>

                  <button
                    className="dropdown-item dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default TopBar;
