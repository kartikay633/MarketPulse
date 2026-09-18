// ROADMAP: Section 3 & 5 — AppLayout Component
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0a0a0f',
        color: '#f0f0f5',
        overflow: 'hidden',
      }}
    >
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Right Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <TopBar />
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
