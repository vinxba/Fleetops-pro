import React, { useState, useEffect } from 'react';
import { CheckCircle2, Wrench, AlertTriangle, Clock, Plus, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none">
          {/* Main Workspace Header Title & CTA Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Overview</h1>
              <p className="text-sm text-slate-500 mt-0.5">Real-time telemetry and service management.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="text-xs text-slate-500 font-medium">
                {currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="ml-1.5">{currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <Link to="/service" className="bg-[#0b3b80] hover:bg-blue-950 text-white text-xs font-bold tracking-wide uppercase px-4 py-3 rounded-lg shadow-sm flex items-center transition">
                <Plus className="mr-1.5 h-4 w-4" /> Log Service
              </Link>
              <Link to="/reports" className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold tracking-wide uppercase px-4 py-3 rounded-lg border border-slate-300 shadow-sm flex items-center transition">
                <FileSpreadsheet className="mr-1.5 h-4 w-4 text-slate-500" /> Generate Report
              </Link>
            </div>
          </div>

          {/* Metric Status Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box Metric 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Active Vehicles</span>
                  <CheckCircle2 className="text-green-500 h-4 w-4" />
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-3xl font-bold text-slate-900">28</span>
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">/ 32 Total</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                <div className="bg-green-600 h-full rounded-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>

            {/* Box Metric 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>In Service</span>
                  <Wrench className="text-orange-500 h-4 w-4" />
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-slate-900">3</span>
                  <span className="text-xs font-medium text-slate-500 block mt-1">Ongoing maintenance</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            {/* Box Metric 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Alerts</span>
                  <AlertTriangle className="text-red-500 h-4 w-4" />
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-slate-900">1</span>
                  <span className="text-xs font-medium text-slate-500 block mt-1">Needs attention</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          {/* Two Column Table + Activity Split Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Table Box Left Container Panel */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Clock className="text-amber-600 h-5 w-5" />
                  <h3 className="text-base font-bold text-slate-800">Service Alerts: 100,000km Milestone</h3>
                </div>
                <span className="bg-orange-500 text-white font-bold tracking-wide text-[10px] px-2.5 py-1 rounded">3 VEHICLES NEAR LIMIT</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                      <th className="py-3.5 px-5">Unit ID</th>
                      <th className="py-3.5 px-5">Model</th>
                      <th className="py-3.5 px-5">Current KM</th>
                      <th className="py-3.5 px-5">Remaining</th>
                      <th className="py-3.5 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {/* Item Row 1 */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-5 font-bold text-blue-600 border-l-2 border-blue-500 bg-blue-50/10">FR-092</td>
                      <td className="py-4 px-5 text-slate-600">Freightliner Cascadia</td>
                      <td className="py-4 px-5 font-semibold text-slate-800">99,842 km</td>
                      <td className="py-4 px-5 font-bold text-red-500">158 km</td>
                      <td className="py-4 px-5 text-right">
                        <span className="text-[10px] font-bold tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md">❗ URGENT</span>
                      </td>
                    </tr>
                    {/* Item Row 2 */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-5 font-bold text-blue-600">VN-104</td>
                      <td className="py-4 px-5 text-slate-600">Volvo VNL 860</td>
                      <td className="py-4 px-5 font-semibold text-slate-800">98,210 km</td>
                      <td className="py-4 px-5 text-slate-600">1,790 km</td>
                      <td className="py-4 px-5 text-right">
                        <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md">🕒 DUE SOON</span>
                      </td>
                    </tr>
                    {/* Item Row 3 */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-5 font-bold text-blue-600">KW-331</td>
                      <td className="py-4 px-5 text-slate-600">Kenworth T680</td>
                      <td className="py-4 px-5 font-semibold text-slate-800">96,500 km</td>
                      <td className="py-4 px-5 text-slate-600">3,500 km</td>
                      <td className="py-4 px-5 text-right">
                        <span className="text-[10px] font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">ⓘ MONITOR</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Column Right Container Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-3.5 border-b border-slate-100">Recent Activity</h3>
                
                <div className="mt-4 space-y-4">
                  {/* Event Log 1 */}
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="bg-green-50 text-green-600 p-2 rounded-lg shrink-0">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">Service Completed: FR-092</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Brake pad replacement and hydraulic flush.</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mt-1">2 hours ago • By MECH_ID: 88</span>
                    </div>
                  </div>

                  {/* Event Log 2 */}
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="bg-amber-50 text-amber-600 p-2 rounded-lg shrink-0">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">Maintenance Logged: VN-012</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Scheduled oil change and filter replacement.</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mt-1">Yesterday • By MECH_ID: 42</span>
                    </div>
                  </div>

                  {/* Event Log 3 */}
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                      <Info className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">Report Generated: Q3 Fuel</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Efficiency metrics for long-haul routes.</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mt-1">Oct 14, 10:24 AM • BY SYSTEM</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition border-t border-slate-100 pt-4 uppercase tracking-wider">
                View All Activity
              </button>
            </div>  

          </div>
        </div>
      );
    }