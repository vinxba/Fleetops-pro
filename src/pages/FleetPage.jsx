import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Filter, MoreVertical, RotateCcw, Settings, Truck, HelpCircle, X, ArrowLeft, Calendar, History, Package, Gauge, Upload } from 'lucide-react';

// Import local images
import MitsubishiL200 from '../assets/images/MitsubishiL200.jpg';
import tankerImage from '../assets/images/MitsubishiL200.jpg';
import commercialVanImage from '../assets/images/commercial_van.jpg';
import landCruiserImage from '../assets/images/land_cruiser.jpg';
import logisticsHaulerImage from '../assets/images/logistics_hauler.jpg';
import excavatorImage from '../assets/images/excavator.jpg';

export default function FleetPage({ vehiclesData, initialVehicleId, onClearSelection }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filterTabs = [
    { label: 'ALL', value: 'ALL', count: null },
    { label: 'READY', value: 'READY', icon: '✔' },
    { label: 'IN REPAIR', value: 'IN REPAIR', icon: '🔧' },
    { label: 'OVERDUE', value: 'OVERDUE', icon: '⚠' },
  ];

  const fleetAssets = [
    {
      id: 'KWT-56888',
      type: 'Mitsubishi L200',
      subtext: 'DOUBLE CAB PICKUP',
      status: 'READY',
      image: MitsubishiL200,
      metrics: [
        { label: 'CURRENT MILEAGE', value: '142,500 KM', progress: 100, progressColor: 'bg-blue-600' },
        { label: 'FUEL LEVEL', value: '85%', progress: 85, progressColor: 'bg-emerald-600' }
      ],
      repairHistory: [
        { date: 'Aug 12, 2024', task: 'Brake Pad Replacement', cost: '$240.00', technician: 'Tech-04' },
        { date: 'Jun 05, 2024', task: 'Oil Filter & Lubrication', cost: '$120.00', technician: 'Tech-01' },
        { date: 'Mar 18, 2024', task: 'Tire Rotation & Alignment', cost: '$85.00', technician: 'Tech-04' }
      ],
      partsRemoved: [
        { part: 'OEM Brake Pads (Front)', sn: 'BP-9921-X', replacedDate: 'Aug 12, 2024' },
        { part: 'Synthetic Oil Filter', sn: 'FL-440-Z', replacedDate: 'Jun 05, 2024' },
        { part: 'Air Intake Filter', sn: 'AF-112-Q', replacedDate: 'Jan 10, 2024' }
      ],
      technicalSpecs: [
        { label: 'Engine', value: '2.4L MIVEC Diesel' },
        { label: 'Transmission', value: '6-Speed Manual' },
        { label: 'Payload', value: '1,080 kg' }
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
        { label: 'CURRENT MILEAGE', value: '42,120 KM', progress: 100, progressColor: 'bg-blue-600' },
        { label: 'BATTERY HEALTH', value: '45%', progress: 45, progressColor: 'bg-amber-600' }
      ],
      repairHistory: [
        { date: 'Sep 24, 2024', task: 'Alternator Repair', cost: '$410.00', technician: 'Tech-09' }
      ],
      partsRemoved: [
        { part: 'Alternator Assembly', sn: 'ALT-BK-22', replacedDate: 'Sep 24, 2024' }
      ],
      technicalSpecs: [
        { label: 'Engine', value: '2.0L Turbo' },
        { label: 'Transmission', value: 'Automatic' },
        { label: 'Payload', value: '850 kg' }
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
        { label: 'CURRENT MILEAGE', value: '18,502 KM', progress: 100, progressColor: 'bg-blue-600' },
        { label: 'OIL LEVEL', value: '12%', progress: 12, progressColor: 'bg-red-500' }
      ],
      repairHistory: [
        { date: 'Dec 12, 2023', task: 'Full Service A', cost: '$550.00', technician: 'Tech-02' }
      ],
      partsRemoved: [
        { part: 'Spark Plugs (x6)', sn: 'NGK-IR-7', replacedDate: 'Dec 12, 2023' }
      ],
      technicalSpecs: [
        { label: 'Engine', value: '4.5L V8 Turbo Diesel' },
        { label: 'Transmission', value: '5-Speed Manual' },
        { label: 'Fuel Tank', value: '130L Dual Tank' }
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

  useEffect(() => {
    if (initialVehicleId) {
      const autoSelected = fleetAssets.find(a => a.type === initialVehicleId || a.id === initialVehicleId);
      if (autoSelected) setSelectedVehicle(autoSelected);
    }
  }, [initialVehicleId]);

  // Render Detail View
  if (selectedVehicle) {
    return (
      <div className="p-6 lg:p-8 space-y-8 bg-[#f8fafc] w-full min-h-screen animate-in fade-in duration-500">
        {/* Detail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-black text-[#0f2d4a] tracking-tighter">{selectedVehicle.type}</h1>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                  selectedVehicle.status === 'READY' ? 'bg-emerald-100 text-emerald-700' :
                  selectedVehicle.status === 'IN REPAIR' ? 'bg-amber-100 text-amber-700' : 'bg-red-600 text-white'
                }`}>
                  {selectedVehicle.status}
                </span>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]">{selectedVehicle.id} • {selectedVehicle.subtext}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-slate-200 text-[#0f2d4a] text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-slate-50 transition shadow-sm">
              Edit Details
            </button>
            <button className="bg-[#0f2d4a] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition active:scale-95">
              Schedule Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Primary Info Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Hero Image & Metrics */}
            <div className="bg-white border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
              <div className="h-80 relative">
                <img src={selectedVehicle.image} alt={selectedVehicle.type} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="p-10 -mt-16 relative grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center space-x-2 mb-3 text-blue-600">
                    <Gauge size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Driven</span>
                  </div>
                  <span className="text-2xl font-black text-[#0f2d4a]">{selectedVehicle.metrics[0].value}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center space-x-2 mb-3 text-emerald-600">
                    <Calendar size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Next Service</span>
                  </div>
                  <span className="text-2xl font-black text-[#0f2d4a]">{selectedVehicle.footerLeft.value}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center space-x-2 mb-3 text-orange-600">
                    <Package size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Load Capacity</span>
                  </div>
                  <span className="text-2xl font-black text-[#0f2d4a]">{selectedVehicle.technicalSpecs?.find(s => s.label === 'Payload')?.value || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Repair History Table */}
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><History size={20} /></div>
                  <h3 className="text-xl font-black text-[#0f2d4a]">Maintenance History</h3>
                </div>
                <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All Records</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="pb-4 px-2 text-blue-600">Date</th>
                      <th className="pb-4 px-2">Operation Details</th>
                      <th className="pb-4 px-2">Cost (USD)</th>
                      <th className="pb-4 px-2">Technician</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {selectedVehicle.repairHistory?.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                        <td className="py-5 px-2 font-bold text-slate-800 whitespace-nowrap">{entry.date}</td>
                        <td className="py-5 px-2 font-black text-[#0f2d4a]">{entry.task}</td>
                        <td className="py-5 px-2 font-bold text-slate-500">{entry.cost}</td>
                        <td className="py-5 px-2 font-bold text-blue-600">{entry.technician}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-8">
            {/* Parts Inventory Section */}
            <div className="bg-[#0f2d4a] text-white rounded-[3rem] p-10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <Package size={22} className="text-white opacity-80" />
                <h2 className="text-xl font-black !text-white">Components Replaced</h2>
              </div>
              <div className="space-y-6">
                {selectedVehicle.partsRemoved?.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500/30 pl-5 py-1">
                    <span className="text-[10px] font-black !text-white uppercase tracking-[0.2em] block mb-1">{item.replacedDate}</span>
                    <h4 className="font-bold text-sm leading-tight !text-white">{item.part}</h4>
                    <p className="text-[10px] font-bold !text-white mt-1 uppercase tracking-widest">S/N: {item.sn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-[#0f2d4a] mb-8">Technical Specs</h3>
              <div className="space-y-5">
                {selectedVehicle.technicalSpecs?.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-black text-[#0f2d4a]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parts Utilization Card */}
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-[#0f2d4a] mb-8">Consumables Utilization</h3>
              <div className="space-y-4">
                {selectedVehicle.partsRemoved?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#0f2d4a]">{item.part}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">S/N: {item.sn}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">{item.replacedDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-[#f8fafc] w-full select-none">
      
      {/* Title & Core Top Action Control Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2d4a] tracking-tight">Vehicle Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Total 32 vehicles active across 4 depots</p>
        </div>
        
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0b4d82] hover:bg-blue-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition cursor-pointer"
          >
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
          <div key={index} onClick={() => setSelectedVehicle(asset)} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px] cursor-pointer group">
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

      {/* Add Vehicle Registration Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 lg:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#0f2d4a] tracking-tighter">Register New Asset</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Fleet Inventory Initialization</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }} className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); setImagePreview(null); }}>
                {/* Image Upload Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Photograph</label>
                  <div className="relative group/upload">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className={`h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 transition group-hover/upload:bg-slate-100 group-hover/upload:border-blue-400 overflow-hidden shadow-inner`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-300 mb-2 group-hover/upload:text-blue-500 transition-colors" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Click to upload vehicle photo</span>
                        </>
                      )}
                    </div>
                    {imagePreview && (
                      <button 
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-lg shadow-sm text-red-500 z-20 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset ID (Unit / Plate)</label>
                  <input type="text" placeholder="e.g. KWT-56888" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model / Type</label>
                    <input type="text" placeholder="e.g. Mitsubishi L200" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <input type="text" placeholder="e.g. Pickup" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kilometers Driven (Odometer)</label>
                    <div className="relative flex items-center">
                      <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition pr-12" required />
                      <span className="absolute right-4 text-[9px] font-black text-slate-300">KM</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Initial Status</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                      <option value="READY">READY</option>
                      <option value="IN REPAIR">IN REPAIR</option>
                      <option value="OVERDUE">OVERDUE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Service Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Next Service Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }} 
                    className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#0f2d4a] text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition active:scale-95 cursor-pointer"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}