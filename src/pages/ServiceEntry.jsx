import React from 'react';
import { Upload, Info, FileText, Calendar, ShieldCheck, MapPin, Camera, AlertCircle } from 'lucide-react';

export default function ServiceEntry() {
  const commonItems = [
    'Oil & Filter Change', 'Brake Inspection & Adjust',
    'Tire Rotation / Pressure', 'Coolant System Flush',
    'Transmission Fluid', 'Electrical System Test'
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Service & Repair Entry</h1>
        <p className="text-xs text-slate-400 mt-0.5">Log detailed maintenance records to maintain fleet uptime and structural integrity.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Elements: Forms Data Entry Layout (Takes 2 Columns) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* General Information Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-4">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-2">General Information</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Vehicle Selection</label>
              <div className="relative">
                <select className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none appearance-none cursor-pointer">
                
                  <option>FR-092 - Freightliner Cascadia</option>
                  <option>VN-104 - Volvo VNL 860</option>
                </select>
                <div className="absolute right-3 top-3.5 text-slate-400 text-[10px]">▼</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Service Date</label>
                <div className="relative flex items-center">
                  <input type="text" defaultValue="11/24/2023" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none" />
                  <Calendar className="absolute right-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Odometer Reading (KM)</label>
                <div className="relative flex items-center">
                  <input type="text" placeholder="000,000" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none pr-12" />
                  <span className="absolute right-0 bg-blue-50 border-l border-slate-200 px-3 py-2.5 rounded-r-lg text-[10px] font-bold text-blue-600">KM</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Service Type</label>
                <select className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer">
                  <option>Routine Maintenance</option>
                  <option>Critical Repair</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Cost (Est.)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                  <input type="text" defaultValue="0.00" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 pl-7 text-xs font-semibold text-slate-700 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Section Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-5">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-2">Service Details</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Work Performed / Complaints</label>
              <textarea placeholder="Describe the specific work performed or initial complaints reported by the driver..." rows="3" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 outline-none resize-none"></textarea>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Common Service Items</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {commonItems.map((item, index) => (
                  <label key={index} className="flex items-center space-x-3 border border-slate-100 dark:border-slate-700 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 cursor-pointer transition">
                    <input type="checkbox" className="h-3.5 w-3.5 accent-blue-600 rounded border-slate-300" />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown / Accident Details Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Breakdown / Accident Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Breakdown Location</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="GPS or Location Name" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 pl-10 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Cause</label>
                <input type="text" placeholder="Reason for breakdown" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Insurance Claim Status</label>
                <select className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-blue-300 transition">
                  <option>No Claim Required</option>
                  <option>Pending Filing</option>
                  <option>Claim Filed</option>
                  <option>Settled</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Accident Images</label>
                <button type="button" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800 transition">
                  <Camera className="h-4 w-4 mr-2" /> Upload Incident Photos
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Driver Remarks</label>
              <textarea placeholder="Specific details from the driver regarding the incident..." rows="2" className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 outline-none resize-none focus:border-blue-300 transition"></textarea>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <button type="button" className="px-8 py-4 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition cursor-pointer active:scale-95">
              Save Draft
            </button>
            <button type="submit" className="px-10 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition active:scale-95 cursor-pointer">
              Complete Service Entry
            </button>
          </div>

        </div>

        {/* Right Side Info Cards Column Layout */}
        <div className="space-y-5">
          
          {/* File Upload Box Widget */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-4">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-2">Documentation</h3>
            <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/30 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition">
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-700">Attach Invoices or Receipts</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
            
            {/* Embedded Active Document Frame file listing */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-bold text-slate-600">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>mechanic_quote_441.pdf</span>
              </div>
              <span className="text-red-500 cursor-pointer text-xs font-normal hover:font-bold">×</span>
            </div>
          </div>

          


        </div>

      </div>
    </div>
  );
}