import React, { useState } from 'react';
import { Search, Plus, Download, Filter, MoreVertical, RotateCcw, Settings, Truck, HelpCircle } from 'lucide-react';

// Import local images
import tankerImage from '../assets/images/tanker.jpg';
import commercialVanImage from '../assets/images/commercial_van.jpg';
import landCruiserImage from '../assets/images/land_cruiser.jpg';
import logisticsHaulerImage from '../assets/images/logistics_hauler.jpg';
import excavatorImage from '../assets/images/excavator.jpg';

export default function FleetPage({ vehiclesData }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filterTabs = [
    { label: 'ALL', value: 'ALL', count: null },
    { label: 'READY', value: 'READY', icon: '✔' },
    { label: 'IN REPAIR', value: 'IN REPAIR', icon: '🔧' },
    { label: 'OVERDUE', value: 'OVERDUE', icon: '⚠' },
  ];

  const fleetAssets = [
    {
      id: 'FLT-992-TX',
      type: 'Heavy Duty Tanker',
      subtext: '12 WHEELER',
      status: 'READY',
      image: tankerImage,
      metrics: [
        { label: 'CURRENT MILEAGE', value: '142,500 KM' },
        { label: 'FUEL LEVEL', value: '85%', progress: 85, progressColor: 'bg-emerald-600' }
      ],
      footerLeft: { label: 'NEXT SERVICE', value: '12 Sep 2024' },
      footerRight: 'actions',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'V-202-LHD',
      type: 'Commercial Van',
      subtext: '4 DOOR',
      status: 'IN REPAIR',
      image: commercialVanImage,
      metrics: [
        { label: 'CURRENT MILEAGE', value: '42,120 KM' },
        { label: 'BATTERY HEALTH', value: '45%', progress: 45, progressColor: 'bg-amber-600' }
      ],
      footerLeft: { label: 'EST. COMPLETION', value: 'TODAY, 16:00', valueColor: 'text-amber-600' },
      footerRight: 'history',
      iconBg: 'bg-orange-50 text-orange-600'
    },
    {
      id: '4x4-LC-881',
      type: 'Land Cruiser 79',
      subtext: 'ALL TERRAIN',
      status: 'OVERDUE',
      image: landCruiserImage,
      metrics: [
        { label: 'CURRENT MILEAGE', value: '18,502 KM' },
        { label: 'OIL LEVEL', value: '12%', progress: 12, progressColor: 'bg-red-500' }
      ],
      footerLeft: { label: 'SERVICE DELAY', value: '+14 DAYS', valueColor: 'text-red-600' },
      footerRight: 'book_now',
      iconBg: 'bg-red-50 text-red-500'
    },
    {
      id: 'TRK-505',
      type: 'Logistics Hauler',
      subtext: 'IND-UNIT',
      status: 'READY',
      image: logisticsHaulerImage,
      metrics: [
        { label: 'MILEAGE', value: '149,336 KM' },
        { label: 'UTILIZATION', value: '', progress: 78, progressColor: 'bg-blue-600' }
      ],
      footerLeft: { label: 'ASSIGNED DRIVER', value: 'Officer #134' },
      footerRight: 'settings',
      iconBg: 'bg-blue-50 text-blue-500'
    },
    {
      id: 'CAT-112',
      type: 'Excavator 300',
      subtext: 'IND-UNIT',
      status: 'IN REPAIR',
      image: excavatorImage,
      metrics: [
        { label: 'MILEAGE', value: '30,716 KM' },
        { label: 'UTILIZATION', value: '', progress: 62, progressColor: 'bg-blue-600' }
      ],
      footerLeft: { label: 'ASSIGNED DRIVER', value: 'Officer #469' },
      footerRight: 'settings',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'OIL-882',
      type: 'Fuel Transporter',
      subtext: 'IND-UNIT',
      status: 'READY',
      image: tankerImage, // Reusing tanker image for another tanker
      metrics: [
        { label: 'MILEAGE', value: '2,122 KM' },
        { label: 'UTILIZATION', value: '', progress: 30, progressColor: 'bg-blue-600' }
      ],
      footerLeft: { label: 'ASSIGNED DRIVER', value: 'Officer #600' },
      footerRight: 'settings',
      iconBg: 'bg-blue-50 text-blue-600'
    }
  ];

  const filteredAssets = fleetAssets.filter(asset => {
    const matchesFilter = activeFilter === 'ALL' || asset.status === activeFilter;
    const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.subtext.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-[#f8fafc] w-full select-none">
      
      {/* Title & Core Top Action Control Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2d4a] tracking-tight">Vehicle Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Total 32 vehicles active across 4 depots</p>
        </div>
        
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button className="bg-[#0b4d82] hover:bg-blue-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition cursor-pointer">
            <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center transition cursor-pointer">
            <Download className="mr-1.5 h-4 w-4 text-slate-400" /> Export
          </button>
        </div>
      </div>

      {/* Global Lookup Command Search Box Bar */}
      <div className="relative">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-600 outline-none focus:border-slate-300 shadow-sm transition"
        />
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
      </div>

      {/* Filtering Navigation Row Ribbons */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider">
        <span className="text-slate-400 mr-2 uppercase">Filter by Status:</span>
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
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Asset Framework Card Inventory Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAssets.map((asset, index) => (
          <div key={index} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px]">
            {/* Upper Frame Block Segment Info Header */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3.5">
                  <div className={`p-3 rounded-xl ${asset.iconBg} shrink-0`}>
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f2d4a] leading-tight tracking-tight">{asset.type}</h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">
                      {asset.id} <span className="mx-1.5 text-slate-300">•</span> {asset.subtext}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Telemetry Status Tag Badges */}
              <span className={`text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md ${
                asset.status === 'READY' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                asset.status === 'IN REPAIR' ? 'text-amber-700 bg-amber-50 border border-amber-100' :
                'text-white bg-red-600'
              }`}>
                {asset.status === 'READY' ? '● READY' : asset.status}
              </span>
            </div>
            {/* Vehicle Image */}
            <div className="w-full h-28 bg-slate-100 rounded-lg overflow-hidden mb-4">
              <img src={asset.image} alt={asset.type} className="w-full h-full object-cover" />
            </div>

            {/* Core Card Parameters Metric List Bars Area */}
            <div className="my-5 grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3.5">
              {asset.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider block">{metric.label}</span>
                  <span className="text-xs font-extrabold text-slate-800 block">{metric.value || '\u00A0'}</span>
                  {metric.progress !== undefined && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`${metric.progressColor} h-full rounded-full`} style={{ width: `${metric.progress}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lower Layout Action Blocks Base Footers */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <div>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase">{asset.footerLeft.label}</span>
                <span className={`text-xs font-extrabold mt-0.5 block ${asset.footerLeft.colorColor || 'text-slate-800'} ${asset.footerLeft.valueColor || ''}`}>
                  {asset.footerLeft.value}
                </span>
              </div>

              {/* Context Action Elements Switches */}
              <div className="text-slate-400">
                {asset.footerRight === 'actions' && (
                  <button className="hover:text-slate-600 p-1 cursor-pointer"><MoreVertical className="h-4 w-4" /></button>
                )}
                {asset.footerRight === 'history' && (
                  <button className="hover:text-slate-600 p-1 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"><RotateCcw className="h-3.5 w-3.5 text-blue-600" /></button>
                )}
                {asset.footerRight === 'book_now' && (
                  <button className="bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-md cursor-pointer shadow-sm">Book Now</button>
                )}
                {asset.footerRight === 'settings' && (
                  <button className="hover:text-slate-600 p-1 cursor-pointer"><Settings className="h-4 w-4 text-slate-400" /></button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}