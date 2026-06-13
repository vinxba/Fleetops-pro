import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Wrench,
  BarChart3,
  LogOut,
  Package,
  X,
} from 'lucide-react';

export default function Sidebar({
  currentPage,
  setCurrentPage,
  setIsLoggedIn,
  sidebarOpen,
  setSidebarOpen,
}) {
  const items = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Fleet', label: 'Fleet', icon: Truck },
    { id: 'Parts', label: 'Parts', icon: Package },
    { id: 'Service Entry', label: 'Service Entry', icon: Wrench, borderDashed: true },
    { id: 'Reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-slate-50 dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0 lg:flex lg:h-full lg:overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Navigation
          </span>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isSelected = currentPage === item.id;

              if (item.borderDashed && !isSelected) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setSidebarOpen(false);
                    }}
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
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
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

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition text-left text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 dark:hover:text-red-400 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}