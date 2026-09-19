// ROADMAP: Section 3, 5 & Design Refinement — Institutional Terminal Sidebar
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  Briefcase,
  CandlestickChart,
  Newspaper,
  Bot,
  Bell,
  Settings,
  ShieldCheck,
  Play,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '#3B82F6' },
  { name: 'Markets', path: '/markets', icon: TrendingUp, color: '#10B981' },
  { name: 'Watchlist', path: '/watchlist', icon: Bookmark, color: '#F59E0B' },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase, color: '#A855F7' },
  { name: 'Trade Terminal', path: '/trade', icon: CandlestickChart, color: '#06B6D4' },
  { name: 'News Pulse', path: '/news', icon: Newspaper, color: '#F97316' },
  { name: 'Pulse AI', path: '/ai', icon: Bot, badge: 'RESEARCH', color: '#3B82F6' },
  { name: 'Price Alerts', path: '/alerts', icon: Bell, color: '#F43F5E' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img
          src="/official_logo.png"
          alt="Market Pulse"
          className="sidebar-brand-logo"
        />
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-market">MARKET</span>
          <span className="sidebar-brand-pulse">PULSE</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">
          Terminal Cockpit
        </span>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="sidebar-nav-item-inner">
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: isActive ? item.color : 'inherit',
                        filter: isActive ? `drop-shadow(0 0 6px ${item.color})` : 'none',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <span style={{ color: isActive ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 500 }}>
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span 
                      className="badge badge--sm"
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.18)',
                        color: 'var(--accent-bright)',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="sidebar-divider" />

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`
          }
        >
          <div className="sidebar-nav-item-inner">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </NavLink>
      </nav>

      {/* Bottom Status Box */}
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-replay-btn">
          <Play size={13} color="var(--accent)" />
          <span>Replay 3D Intro</span>
        </Link>

        <div className="sidebar-capital">
          <ShieldCheck size={14} color="var(--positive)" />
          <span>Simulated ₹10,00,000</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
