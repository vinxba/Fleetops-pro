import React, { useEffect, useState } from 'react';
import { Truck, Sparkles } from 'lucide-react';
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
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('FleetOps');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={(company) => {
      setIsLoggedIn(true);
      if (company) setSelectedCompany(company);
    }} />;
  }

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden antialiased ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 dark:bg-slate-950 text-slate-800'}`}>
      <Navbar
        companyName={selectedCompany}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        setTheme={setTheme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setIsLoggedIn={setIsLoggedIn}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {currentPage === 'Dashboard' && (
              <FleetOverview
                companyName={selectedCompany}
                navigateToService={() => setCurrentPage('Service Entry')}
                navigateToReports={() => setCurrentPage('Reports')}
              />
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
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shrink-0 select-none">
            {/* Brand Mark */}
            <div className="flex items-center space-x-2.5">
              <div className="bg-blue-600 text-white p-1 rounded-md">
                <Truck className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {selectedCompany} <span className="text-blue-600">Pro</span>
              </span>
              <span className="hidden md:inline text-[9px] font-bold text-slate-300 dark:text-slate-400 uppercase tracking-[0.25em]">
                &copy; {new Date().getFullYear()} &middot; All Rights Reserved
              </span>
            </div>

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {['Dashboard', 'Fleet', 'Reports'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {page}
                </button>
              ))}
              <span className="text-slate-200">|</span>
              <span className="cursor-default">Privacy</span>
              <span className="cursor-default">Terms</span>
              <span className="cursor-default">Support</span>
            </nav>

            {/* Powered By Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Powered by</span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 shadow-sm">
                <Sparkles className="h-3 w-3" />
                <span className="text-[10px] font-black tracking-wide">Careergize</span>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}