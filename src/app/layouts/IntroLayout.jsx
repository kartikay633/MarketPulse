// ROADMAP: Section 5 — Frontend Architecture (IntroLayout)
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function IntroLayout() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </div>
  );
}
