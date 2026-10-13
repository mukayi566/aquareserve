import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar, MobileNav } from './Sidebar';
import { DemoTour } from './DemoTour';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar - sits below banner */}
      <TopBar />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Demo tour overlay */}
      <DemoTour />
    </div>
  );
};
