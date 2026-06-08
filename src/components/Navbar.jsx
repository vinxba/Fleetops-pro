import React from 'react';
import { Truck, Bell, Moon, Sun } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, theme, setTheme }) {
  const tabs = ['Dashboard', 'Fleet', 'Reports'];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 h-16 min-h-16 flex items-center justify-between px-6 z-30 select-none">
      {/* Brand Identity Branding Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('Dashboard')}>
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Truck className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">
          FleetOps <span className="text-blue-600 dark:text-blue-300">Pro</span>
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
                  ? 'text-blue-600 border-dashed border-blue-400 bg-blue-50/40 dark:text-blue-300 dark:border-blue-500 dark:bg-slate-800/70'
                  : 'text-slate-500 border-transparent hover:text-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        {/* Theme Toggle Control */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell Control */}
        <div className="relative group cursor-pointer">
          <div className="p-2 rounded-xl text-slate-400 group-hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-blue-300 transition-all duration-300">
            <Bell size={20} />
          </div>
          {/* Active Status Badge */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full shadow-sm group-hover:scale-110 transition-transform"></span>
        </div>

        {/* Profile Avatar Frame Link */}
        {/* <div className="flex items-center">
          <img 
            className="h-9 w-9 rounded-md object-cover ring-2 ring-slate-100 cursor-pointer" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
            alt="Fleet controller supervisor profile layout avatar" 
          />
        </div> */}
      </div>
    </header>
  );
}