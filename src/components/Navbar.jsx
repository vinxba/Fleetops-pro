import React from 'react';
import { Truck } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const tabs = ['Dashboard', 'Fleet', 'Reports'];

  return (
    <header className="bg-white border-b border-slate-200 h-16 min-h-16 flex items-center justify-between px-6 z-30 select-none">
      {/* Brand Identity Branding Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('Dashboard')}>
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Truck className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl text-[#082f49] tracking-tight">
          FleetOps <span className="text-blue-600">Pro</span>
        </span>
      </div>
      
      {/* Right Content Controls */}
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex space-x-2 text-[11px] font-bold tracking-wider uppercase">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentPage(tab)}
              className={`px-3 py-1.5 rounded-md border transition ${
                currentPage === tab
                  ? 'text-blue-600 border-dashed border-blue-400 bg-blue-50/40'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        {/* Profile Avatar Frame Link */}
        <div className="flex items-center">
          <img 
            className="h-9 w-9 rounded-md object-cover ring-2 ring-slate-100 cursor-pointer" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
            alt="Fleet controller supervisor profile layout avatar" 
          />
        </div>
      </div>
    </header>
  );
}