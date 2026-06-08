import React, { useState } from 'react';
import { 
  Download, Route, CircleDollarSign, Clock3, TrendingUp, 
  TrendingDown, Percent, Filter, Search, Truck 
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  const months = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
  
  const vehicleStats = [
    { id: '#402-VFH', name: 'VOLVO FH 500', totalKm: 14200, fuel: 3850, events: 2, downtime: 12, cost: 1850.00, status: 'OPERATIONAL', trends: [45, 55, 40, 60, 75, 90] },
    { id: '#511-SCA', name: 'SCANIA R450', totalKm: 12150, fuel: 3200, events: 1, downtime: 4, cost: 920.00, status: 'SERVICE DUE', trends: [55, 45, 60, 40, 65, 50] },
    { id: '#202-LHD', name: 'COMMERCIAL VAN', totalKm: 8400, fuel: 1100, events: 0, downtime: 0, cost: 0.00, status: 'OPERATIONAL', trends: [20, 25, 22, 28, 30, 35] },
    { id: '#LC-881', name: 'LAND CRUISER 79', totalKm: 1200, fuel: 450, events: 1, downtime: 48, cost: 550.00, status: 'IN REPAIR', trends: [10, 15, 12, 18, 5, 2] }
  ];

  const filteredData = selectedVehicle === 'All Vehicles' 
    ? vehicleStats 
    : vehicleStats.filter(v => `${v.id} - ${v.name}` === selectedVehicle);

  const summary = {
    totalKm: filteredData.reduce((sum, v) => sum + v.totalKm, 0),
    totalCost: filteredData.reduce((sum, v) => sum + v.cost, 0),
    totalDowntime: filteredData.reduce((sum, v) => sum + v.downtime, 0),
    chartData: selectedVehicle === 'All Vehicles' 
      ? [75, 85, 65, 90, 95, 100] // Aggregate Fleet View
      : filteredData[0].trends
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 select-none">
      
      {/* Page Title & Main Header Export Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Operational performance summary for the selected period.</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition self-start sm:self-center cursor-pointer">
          <Download className="mr-1.5 h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Filter Control Ribbon Panel */}
      <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-end gap-4 justify-end">
        <div className="w-full md:w-64 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle</label>
          <select 
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option>All Vehicles</option>
            {vehicleStats.map(v => (
              <option key={v.id}>{v.id} - {v.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-64 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Period</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer">
            <option>October 2023</option>
            <option>September 2023</option>
            <option>Quarter 3 2023</option>
          </select>
        </div>
        <button className="bg-blue-900 hover:bg-blue-900 text-white p-2.5 rounded-lg flex items-center justify-center transition cursor-pointer">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Main Framework Metric Grid Boxes Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Distance Card */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Total Distance</span>
            <Route className="text-blue-500 h-5 w-5" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-slate-950">{summary.totalKm.toLocaleString()}</span>
              <span className="text-xs font-bold text-blue-600">KM</span>
            </div>
            <span className="text-[11px] font-bold text-green-600 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% vs last month
            </span>
          </div>
        </div>

        {/* Service Cost Card */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Service Cost</span>
            <CircleDollarSign className="text-amber-600 h-5 w-5" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-amber-600">${summary.totalCost.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">USD</span>
            </div>
            <span className="text-[11px] font-bold text-red-500 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" /> Over budget by 4%
            </span>
          </div>
        </div>

        {/* Fleet Downtime Card */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Fleet Downtime</span>
            <Clock3 className="text-red-500 h-5 w-5" />
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-baseline space-x-0.5">
                <span className="text-3xl font-bold text-slate-950">{summary.totalDowntime}</span>
                <span className="text-xs font-bold text-slate-500">HRS</span>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(summary.totalDowntime / 2, 100)}%` }}></div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 block mt-2">{selectedVehicle === 'All Vehicles' ? `Avg. ${(summary.totalDowntime / vehicleStats.length).toFixed(1)} hrs per vehicle` : 'Cumulative downtime for period'}</span>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Segment splits: Chart trends and Quick widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Trend Bar Analytics Mockup Frame (Takes 2 Columns) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mileage Trends (Last 6 Months)</h3>
            <div className="flex items-center space-x-4 text-[10px] font-bold">
              <span className="flex items-center text-slate-500"><span className="w-2.5 h-2.5 bg-blue-900 rounded-full mr-1.5 inline-block"></span>Distance (k)</span>
              <span className="flex items-center text-slate-500"><span className="w-2.5 h-2.5 bg-orange-200 rounded-full mr-1.5 inline-block"></span>Efficiency</span>
            </div>
          </div>
          
          {/* Abstract Vector Simulated Dashboard Bar Graph Alignments */}
          <div className="flex-1 flex items-end justify-between px-4 pt-10 pb-2">
            {summary.chartData.map((height, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group max-w-[45px]">
                <div className="w-full bg-blue-900 rounded-t-sm transition duration-300 group-hover:bg-blue-900" style={{ height: `${height * 1.8}px` }}></div>
                <span className="text-[10px] font-bold text-slate-400 mt-3 block tracking-wide">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Small Analytics Sidebar Informational Badges Stack */}
        <div className="space-y-5 flex flex-col justify-between">
          
          {/* Idle Time Reduction Badge */}
          <div className="bg-blue-950 text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Idle Time Reduction</h4>
              <span className="text-3xl font-extrabold block mt-2 tracking-tight">-18.4%</span>
            </div>
            <p className="text-[11px] font-medium text-blue-100 mt-4">Fuel savings: <span className="font-bold text-white">$1,200 approx.</span></p>
            <Percent className="absolute right-[-10px] bottom-[-10px] h-24 w-24 text-blue-700/20 pointer-events-none rotate-12" />
          </div>

          {/* Fleet Utilization Badge */}
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/60 rounded-xl p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fleet Utilization</h4>
              <span className="text-3xl font-extrabold text-slate-900 block mt-2 tracking-tight">92.5%</span>
            </div>
            <span className="text-[11px] font-bold text-green-600 flex items-center mt-4">
              ✓ Target reached
            </span>
          </div>

        </div>
      </div>

      {/* Main Vehicle Breakdown Matrix Table Section Layout */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Monthly Vehicle Breakdown</h3>
          <div className="relative flex items-center w-full sm:w-64">
            <input type="text" placeholder="Search vehicle ID..." className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-slate-300 font-semibold" />
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="py-3 px-5">Vehicle ID</th>
                <th className="py-3 px-5">Total KM</th>
                <th className="py-3 px-5">Fuel Used (L)</th>
                <th className="py-3 px-5">Service Events</th>
                <th className="py-3 px-5">Downtime</th>
                <th className="py-3 px-5">Maintenance Cost</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-4 px-5 flex items-center space-x-3">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg border border-blue-100 shadow-sm">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 leading-tight font-bold">{row.id}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{row.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-600">{row.totalKm.toLocaleString()}</td>
                  <td className="py-4 px-5 font-semibold text-slate-600">{row.fuel.toLocaleString()}</td>
                  <td className="py-4 px-5 font-semibold text-slate-600">{row.events}</td>
                  <td className="py-4 px-5 font-bold text-red-500/90">{row.downtime}h</td>
                  <td className="py-4 px-5 text-slate-900">${row.cost.toLocaleString()}</td>
                  <td className="py-4 px-5 text-right">
                    <span className={`text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md ${
                      row.status === 'OPERATIONAL' 
                        ? 'text-green-700 bg-green-50 border border-green-200' 
                        : 'text-orange-700 bg-orange-50 border border-orange-200'
                    }`}>
                      ● {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}