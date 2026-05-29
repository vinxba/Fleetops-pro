import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FleetOverview from './pages/FleetOverview';
import ServiceEntry from './pages/ServiceEntry';
import ReportsPage from './pages/ReportsPage';
import FleetPage from './pages/FleetPage';
import LoginPage from './pages/LoginPage';
import PartsPage from './pages/PartsPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [targetVehicleId, setTargetVehicleId] = useState(null);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="bg-[#f8fafc] text-slate-800 h-screen flex flex-col overflow-hidden antialiased"> 
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {currentPage === 'Dashboard' && (
              <FleetOverview navigateToService={() => setCurrentPage('Service Entry')} />
            )}
            {currentPage === 'Parts' && (
              <PartsPage 
                onVehicleClick={(vehicleName) => {
                  setTargetVehicleId(vehicleName);
                  setCurrentPage('Fleet');
                }} 
              />
            )}
            {currentPage === 'Service Entry' && <ServiceEntry />}
            {currentPage === 'Reports' && <ReportsPage />}
            {currentPage === 'Fleet' && (
              <FleetPage 
                initialVehicleId={targetVehicleId} 
                onClearSelection={() => setTargetVehicleId(null)} 
              />
            )}
          </div>

          {/* Global Application Footer */}
          <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-center shrink-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Proprietary Dashboard Interface <span className="mx-2 text-slate-200">|</span> Powered by <span className="text-blue-600">Careergize</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}