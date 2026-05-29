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
    <aside className="w-64 bg-[#f8fafc] border-r border-slate-200/80 flex flex-col justify-between hidden lg:flex select-none">
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
                  className="w-full flex items-center space-x-3 border border-dashed border-blue-300 bg-blue-50/30 text-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left"
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
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
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
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left text-red-500 hover:bg-red-50 hover:text-red-700 mt-4"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>

      </div>
      
      
    </aside>
  );
} 