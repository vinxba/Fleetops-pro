import React from 'react';
import { LayoutDashboard, Truck, Wrench, BarChart3, LogOut, Package } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, setIsLoggedIn }) {
  const items = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Fleet', label: 'Fleet', icon: Truck },
    { id: 'Parts', label: 'Parts', icon: Package },
    { id: 'Service Entry', label: 'Service Entry', icon: Wrench, borderDashed: true },
    { id: 'Reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700 hidden lg:flex flex-col justify-between select-none">
      <div className="p-4 space-y-6">
        {/* Vertical Panel List */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isSelected = currentPage === item.id;

            if (item.borderDashed && !isSelected) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className="w-full flex items-center space-x-3 border border-dashed border-blue-300 bg-blue-50/30 text-blue-600 dark:border-blue-500 dark:bg-slate-800/60 dark:text-blue-300 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10'
                    : 'text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setIsLoggedIn(false)}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 dark:hover:text-red-400 hover:text-red-700 mt-4"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>

      </div>
      
      
    </aside>
  );
} 