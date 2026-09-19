import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MarketTickerTape from '../components/market/MarketTickerTape';
import FloatingAIWidget from '../components/ai/FloatingAIWidget';

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Persistent Sticky Terminal Header (TopBar + Live NSE/BSE Feed) */}
        <div className="app-header-area">
          <TopBar />
          <MarketTickerTape />
        </div>
        <main className="app-main-content">
          <Outlet />
        </main>
      </div>

      {/* Flagship Floating Pulse AI Assistant */}
      <FloatingAIWidget />
    </div>
  );
}
