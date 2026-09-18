// ROADMAP: Section 3 & 5 — Sidebar Navigation Component
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
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Markets', path: '/markets', icon: TrendingUp },
  { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { name: 'Trade Terminal', path: '/trade', icon: CandlestickChart },
  { name: 'News Pulse', path: '/news', icon: Newspaper },
  { name: 'Pulse AI', path: '/ai', icon: Bot, badge: 'AI' },
  { name: 'Price Alerts', path: '/alerts', icon: Bell },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        backgroundColor: '#0d0d14',
        borderRight: '1px solid #1e1e30',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '10px',
          borderBottom: '1px solid #1a1a28',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e3a8a, #3366ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(51, 102, 255, 0.4)',
            border: '1px solid rgba(51, 102, 255, 0.6)',
          }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: '#fff' }}>M</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '0.12em', color: '#f0f0f5' }}>
            MARKET
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '0.12em', color: '#3366ff' }}>
            PULSE
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#606078', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px', marginBottom: '6px' }}>
          Platform Navigation
        </span>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#a0a0b8',
                backgroundColor: isActive ? 'rgba(51, 102, 255, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(51, 102, 255, 0.3)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(51, 102, 255, 0.25)',
                    color: '#27c8ff',
                    border: '1px solid rgba(39, 200, 255, 0.4)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div style={{ height: '1px', backgroundColor: '#1a1a28', margin: '14px 4px' }} />

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? '#ffffff' : '#a0a0b8',
            backgroundColor: isActive ? 'rgba(51, 102, 255, 0.15)' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          })}
        >
          <Settings size={16} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Bottom Status Box */}
      <div style={{ padding: '16px', borderTop: '1px solid #1a1a28' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(26, 26, 40, 0.6)',
            border: '1px solid #1e1e30',
            color: '#a0a0b8',
            fontSize: '12px',
            textDecoration: 'none',
            marginBottom: '10px',
          }}
        >
          <Play size={13} color="#3366ff" />
          <span>Replay 3D Intro</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#606078' }}>
          <ShieldCheck size={14} color="#00c853" />
          <span>Paper Capital: ₹10,00,000</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
