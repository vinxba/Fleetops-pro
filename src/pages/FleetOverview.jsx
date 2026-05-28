import React from 'react';
import { CheckCircle2, Wrench, AlertTriangle, Clock, Plus, FileSpreadsheet, FileText } from 'lucide-react';

export default function FleetOverview({ navigateToService }) {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      
      {/* Content Header Actions Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry and service management.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={navigateToService} className="bg-[#0f4c81] hover:bg-blue-950 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition">
            <Plus className="mr-1.5 h-4 w-4" /> Log Service
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg border border-slate-300 shadow-sm flex items-center transition">
            <FileSpreadsheet className="mr-1.5 h-4 w-4 text-slate-400" /> Generate Report
          </button>
        </div>
      </div>

      {/* Main Framework Numerical Grid Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Active Units</span>
            <CheckCircle2 className="text-green-500 h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">28</span>
            <span className="text-xs font-semibold text-slate-400 ml-1">/ 32 Total</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-600 h-full rounded-full" style={{ width: '87.5%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>In Service</span>
            <Wrench className="text-orange-500 h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">3</span>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">Ongoing maintenance</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Alerts</span>
            <AlertTriangle className="text-red-500 h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">1</span>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">Needs attention</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
      </div>

      {/* Grid Table Workspace Framework Rows Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Table Column Dashboard Widget */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/70 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Clock className="text-slate-700 h-4 w-4" />
              <h3 className="text-sm font-bold text-slate-800">Service Alerts: 100,000km Milestone</h3>
            </div>
            <span className="bg-orange-500 text-white font-bold tracking-wider text-[9px] px-2 py-0.5 rounded">3 VEHICLES NEAR LIMIT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/60">
                  <th className="py-3 px-5">Unit ID</th>
                  <th className="py-3 px-5">Model</th>
                  <th className="py-3 px-5">Current KM</th>
                  <th className="py-3 px-5">Remaining</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-5 font-bold text-blue-600 border-l-2 border-blue-500 bg-blue-50/10">FR-092</td>
                  <td className="py-4 px-5">Freightliner Cascadia</td>
                  <td className="py-4 px-5 font-bold text-slate-800">99,842 km</td>
                  <td className="py-4 px-5 font-bold text-red-500">158 km</td>
                  <td className="py-4 px-5 text-right"><span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">❗ URGENT</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-5 font-bold text-blue-600">VN-104</td>
                  <td className="py-4 px-5">Volvo VNL 860</td>
                  <td className="py-4 px-5 font-bold text-slate-800">98,210 km</td>
                  <td className="py-4 px-5">1,790 km</td>
                  <td className="py-4 px-5 text-right"><span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">🕒 DUE SOON</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-5 font-bold text-blue-600">KW-331</td>
                  <td className="py-4 px-5">Kenworth T680</td>
                  <td className="py-4 px-5 font-bold text-slate-800">96,500 km</td>
                  <td className="py-4 px-5">3,500 km</td>
                  <td className="py-4 px-5 text-right"><span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">ⓘ MONITOR</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Active Timeline Activity Column */}
        <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">Recent Activity</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="bg-green-100 text-green-600 p-1.5 rounded-lg shrink-0">🛠️</div>
                <div>
                  <h4 className="font-bold text-slate-800">Service Completed: FR-092</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Brake pad replacement and hydraulic flush.</p>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mt-1">2 hours ago • By MECH_ID: 88</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg shrink-0">📋</div>
                <div>
                  <h4 className="font-bold text-slate-800">Maintenance Logged: VN-012</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Scheduled oil change and filter replacement.</p>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mt-1">Yesterday • By MECH_ID: 42</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg shrink-0">📊</div>
                <div>
                  <h4 className="font-bold text-slate-800">Report Generated: Q3 Fuel</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Efficiency metrics for long-haul routes.</p>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mt-1">Oct 14, 10:24 AM • BY SYSTEM</span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full text-center text-[10px] font-bold text-blue-600 hover:text-blue-700 border-t border-slate-100 pt-3 uppercase tracking-wider">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}