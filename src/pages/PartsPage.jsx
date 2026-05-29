import React, { useState } from 'react';
import { Search, Plus, Download, Filter, MoreVertical, Package, X, CheckCircle2, AlertTriangle, Clock, History, Truck } from 'lucide-react';

export default function PartsPage({ onVehicleClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const partsData = [
    { id: 'P-101', name: 'Brake Pads (Front)', category: 'Brakes', stock: 12, price: '$45.00', status: 'IN STOCK' },
    { id: 'P-102', name: 'Oil Filter', category: 'Engine', stock: 5, price: '$15.00', status: 'LOW STOCK' },
    { id: 'P-103', name: 'Air Intake Filter', category: 'Engine', stock: 24, price: '$22.00', status: 'IN STOCK' },
    { id: 'P-104', name: 'Wiper Blades', category: 'Exterior', stock: 0, price: '$12.00', status: 'OUT OF STOCK' },
  ];

  const usageHistory = [
    { part: 'Heavy Duty Tires', vehicle: 'Land Cruiser 79', date: 'Oct 24, 2024', qty: 2, tech: 'Tech-04' },
    { part: 'Oil Filter (Synthetic)', vehicle: 'Mitsubishi L200', date: 'Oct 22, 2024', qty: 1, tech: 'Tech-01' },
    { part: 'Brake Pad Kit', vehicle: 'Commercial Van', date: 'Oct 20, 2024', qty: 1, tech: 'Tech-09' },
  ];

  // Calculate metrics for the header cards
  const totalParts = partsData.length;
  const inStockCount = partsData.filter(p => p.status === 'IN STOCK').length;
  const lowStockCount = partsData.filter(p => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK').length;

  const filterTabs = [
    { label: 'ALL', value: 'ALL' },
    { label: 'IN STOCK', value: 'IN STOCK' },
    { label: 'LOW STOCK', value: 'LOW STOCK' },
    { label: 'OUT OF STOCK', value: 'OUT OF STOCK' },
  ];

  const filteredParts = partsData.filter((part) => {
    const matchesFilter = activeFilter === 'ALL' || part.status === activeFilter;
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-[#f8fafc] w-full select-none animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2d4a] tracking-tight">Parts Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Manage and track fleet maintenance components</p>
        </div>
        
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0b4d82] hover:bg-blue-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Part
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center transition cursor-pointer">
            <Download className="mr-1.5 h-4 w-4 text-slate-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Numerical Metric Grid Row - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Total Inventory</span>
            <Package className="text-blue-500 h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-[#0f2d4a] tracking-tighter">{totalParts}</span>
            <span className="text-xs font-bold text-slate-400 ml-2">Unique SKUs</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Healthy Stock</span>
            <CheckCircle2 className="text-emerald-500 h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-emerald-600 tracking-tighter">{inStockCount}</span>
            <span className="text-xs font-bold text-slate-400 ml-2">Available</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(inStockCount / totalParts) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Attention Required</span>
            <AlertTriangle className="text-red-500 h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-red-600 tracking-tighter">{lowStockCount}</span>
            <span className="text-xs font-bold text-slate-400 ml-2">Low / Empty</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: `${(lowStockCount / totalParts) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Search by part name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-600 outline-none focus:border-slate-300 shadow-sm transition"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-50 transition shadow-sm cursor-pointer">
          <Filter size={18} />
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider">
        <span className="text-slate-400 mr-2 uppercase">Inventory Status:</span>
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-3 py-1.5 rounded-md uppercase font-bold transition cursor-pointer text-[10px] tracking-wide ${
              activeFilter === tab.value
                ? 'bg-[#005cb2] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid: Table and History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Parts Table */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-4 px-6">Part Information</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Stock Level</th>
                    <th className="py-4 px-6">Unit Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
                  {filteredParts.map((part, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition group">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-[#0f2d4a] group-hover:text-white transition-colors">
                            <Package size={16} />
                          </div>
                          <div>
                            <div className="text-slate-900 font-bold">{part.name}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{part.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 uppercase text-[10px] tracking-wider">{part.category}</td>
                      <td className="py-4 px-6 font-bold text-slate-700">{part.stock} Units</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{part.price}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase ${
                          part.status === 'IN STOCK' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          part.status === 'LOW STOCK' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {part.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-slate-600 transition cursor-pointer"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Parts Used History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm h-full">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <History size={20} />
              </div>
              <h3 className="text-lg font-black text-[#0f2d4a] tracking-tight">Used History</h3>
            </div>
            
            <div className="space-y-6">
              {usageHistory.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onVehicleClick?.(item.vehicle)}
                  className="relative pl-6 border-l-2 border-slate-100 pb-1 cursor-pointer group/item hover:border-blue-500 transition-colors"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{item.date}</span>
                  <h4 className="font-bold text-sm text-slate-800 leading-tight group-hover/item:text-blue-600 transition-colors">{item.part}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <Truck size={12} className="text-blue-500" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{item.vehicle}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Qty: {item.qty} • Logged by {item.tech}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition cursor-pointer">
              View Full Usage Log
            </button>
          </div>
        </div>
      </div>

      {/* Add Part Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 lg:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#0f2d4a] tracking-tighter">Add New Part</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Inventory Management</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Part Name</label>
                  <input type="text" placeholder="e.g. Brake Pads (Front)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU / ID</label>
                    <input type="text" placeholder="SKU-8822" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (Unit)</label>
                    <input type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                </div>
                <div className="pt-6 flex space-x-3">
                  <button type="submit" className="flex-1 bg-[#0f2d4a] text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition active:scale-95 cursor-pointer">Add Part</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}