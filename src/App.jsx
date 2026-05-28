import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FleetOverview from './pages/FleetOverview';
import ServiceEntry from './pages/ServiceEntry';

export default function App() {
  // Navigation states: 'Dashboard' or 'Service Entry'
  const [currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <div className="bg-[#f8fafc] text-slate-800 h-screen flex flex-col overflow-hidden antialiased">
      {/* Shared Navbar Component */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex flex-1 overflow-hidden">
        {/* Shared Sidebar Component */}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Dynamic Workspace Switcher */}
        <div className="flex-1 overflow-y-auto">
          {currentPage === 'Dashboard' && (
            <FleetOverview navigateToService={() => setCurrentPage('Service Entry')} />
          )}
          {currentPage === 'Service Entry' && <ServiceEntry />}
          {['Fleet', 'Reports'].includes(currentPage) && (
            <div className="p-8 text-center text-slate-400 mt-20">
              <span className="text-4xl block mb-2">🚧</span>
              <h2 className="text-xl font-bold text-slate-700">{currentPage} Module</h2>
              <p className="text-sm mt-1">This workspace view is currently under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}