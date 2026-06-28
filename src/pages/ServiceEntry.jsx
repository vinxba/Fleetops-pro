import React, { useEffect, useState, useRef } from 'react';
import { Upload, Info, FileText, Calendar, ShieldCheck, MapPin, Camera, AlertCircle } from 'lucide-react';

export default function ServiceEntry() {
  const [serviceForm, setServiceForm] = useState({
    vehicle: '',
    service_date: '',
    odometer_reading: '',
    service_type: 'ROUTINE',
    estimated_cost: '',
    actual_cost: '',
    work_performed: '',
    breakdown_details: '',
    accident_details: '',
    workshop_name: '',
    next_service_due_km: '',
    next_service_date: '',
    vehicle_downtime_days: '',
    remarks: '',
  });
  const [formStatus, setFormStatus] = useState({ success: null, error: null, saving: false });
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesStatus, setVehiclesStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function loadVehicles() {
      setVehiclesStatus({ loading: true, error: null });
      try {
        const response = await fetch('https://nventro-backend-c532.onrender.com/api/vehicles/', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Unable to load vehicles (${response.status})`);
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setVehiclesStatus({ loading: false, error: err.message || 'Unable to load vehicles.' });
        }
      } finally {
        setVehiclesStatus((prev) => ({ ...prev, loading: false }));
      }
    }

    loadVehicles();
    return () => controller.abort();
  }, []);

  const commonItems = [
    'Oil & Filter Change', 'Brake Inspection & Adjust',
    'Tire Rotation / Pressure', 'Coolant System Flush',
    'Transmission Fluid', 'Electrical System Test'
  ];

  const validateForm = () => {
    const errors = [];
    if (!serviceForm.vehicle) errors.push('Select a vehicle.');
    if (!serviceForm.service_date) errors.push('Enter a service date.');
    if (!serviceForm.odometer_reading) errors.push('Enter an odometer reading.');
    if (!serviceForm.estimated_cost) errors.push('Enter an estimated cost.');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit invoked');
    const validationErrors = validateForm();
    if (validationErrors.length) {
      setFormStatus({ success: null, error: validationErrors.join(' '), saving: false });
      return;
    }
    setFormStatus({ success: null, error: null, saving: true });

    const payload = {
      vehicle: Number(serviceForm.vehicle) || null,
      service_date: serviceForm.service_date || null,
      odometer_reading: serviceForm.odometer_reading ? Number(serviceForm.odometer_reading) : null,
      service_type: serviceForm.service_type,
      estimated_cost: serviceForm.estimated_cost ? Number(serviceForm.estimated_cost) : null,
      actual_cost: Number(serviceForm.actual_cost) || 0,
      work_performed: serviceForm.work_performed || null,
      breakdown_details: serviceForm.breakdown_details || null,
      accident_details: serviceForm.accident_details || null,
      workshop_name: serviceForm.workshop_name || null,
      next_service_due_km: serviceForm.next_service_due_km ? Number(serviceForm.next_service_due_km) : null,
      next_service_date: serviceForm.next_service_date || null,
      vehicle_downtime_days: serviceForm.vehicle_downtime_days ? Number(serviceForm.vehicle_downtime_days) : null,
      remarks: serviceForm.remarks || null,
    };

    console.group('ServiceEntry submit');
    console.log('Service payload:', payload);

    try {
      const response = await fetch('https://nventro-backend-c532.onrender.com/api/services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status, response.statusText);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      let responseData = null;
      try {
        responseData = JSON.parse(responseText);
      } catch (_) {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.detail || responseData?.message || responseText || `Request failed (${response.status})`
        );
      }

      console.log('Service create response:', responseData || responseText);
      setFormStatus({ success: 'Service record saved successfully.', error: null, saving: false });
      setServiceForm({
        vehicle: '',
        service_date: '',
        odometer_reading: '',
        service_type: 'ROUTINE',
        estimated_cost: '',
        actual_cost: '',
        work_performed: '',
        breakdown_details: '',
        accident_details: '',
        workshop_name: '',
        next_service_due_km: '',
        next_service_date: '',
        vehicle_downtime_days: '',
        remarks: '',
      });
    } catch (error) {
      setFormStatus({ success: null, error: error.message || 'Unable to save service record.', saving: false });
    } finally {
      console.groupEnd();
    }
  };

  const dateInputRef = useRef(null);

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Service & Repair Entry</h1>
        <p className="text-xs text-slate-400 mt-0.5">Log detailed maintenance records to maintain fleet uptime and structural integrity.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Elements: Forms Data Entry Layout (Takes 2 Columns) */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
          
          {/* General Information Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-4">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-2">General Information</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Vehicle Selection</label>
              <div className="relative">
                <select
                  value={serviceForm.vehicle}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, vehicle: e.target.value }))}
                  className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate_number ? `${vehicle.plate_number} - ${vehicle.vehicle_name}` : vehicle.vehicle_name}
                    </option>
                  ))}
                </select>
              </div>
              {vehiclesStatus.loading && <p className="text-[10px] text-slate-500">Loading vehicles...</p>}
              {vehiclesStatus.error && <p className="text-[10px] text-red-500">{vehiclesStatus.error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Service Date</label>
                <div className="relative flex items-center">
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={serviceForm.service_date}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, service_date: e.target.value }))}
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none"
                  />
                  <Calendar
                    className="absolute right-3 h-4 w-4 text-slate-400 cursor-pointer"
                    onClick={() => {
                      if (dateInputRef.current) {
                        if (typeof dateInputRef.current.showPicker === 'function') {
                          dateInputRef.current.showPicker();
                        } else {
                          dateInputRef.current.focus();
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Odometer Reading (KM)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={serviceForm.odometer_reading}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, odometer_reading: e.target.value }))}
                    placeholder="000000"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none pr-12"
                  />
                  <span className="absolute right-0 bg-blue-50 border-l border-slate-200 px-3 py-2.5 rounded-r-lg text-[10px] font-bold text-blue-600">KM</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Workshop Name</label>
              <input
                type="text"
                value={serviceForm.workshop_name}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, workshop_name: e.target.value }))}
                placeholder="Test Motors"
                className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Service Type</label>
                <select
                  value={serviceForm.service_type}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, service_type: e.target.value }))}
                  className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="ROUTINE">Routine Maintenance</option>
                  <option value="REPAIR">Repair</option>
                  <option value="BREAKDOWN">Breakdown</option>
                  <option value="ACCIDENT">Accident</option>
                  <option value="INSPECTION">Inspection</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Estimated Cost</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="text"
                    value={serviceForm.estimated_cost}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, estimated_cost: e.target.value }))}
                    placeholder="10.00"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 pl-7 text-xs font-semibold text-slate-700 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Actual Cost</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="text"
                    value={serviceForm.actual_cost}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, actual_cost: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 pl-7 text-xs font-semibold text-slate-700 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Next Service Due (KM)</label>
                  <input
                    type="number"
                    value={serviceForm.next_service_due_km}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, next_service_due_km: e.target.value }))}
                    placeholder="13000"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Next Service Date</label>
                  <input
                    type="date"
                    value={serviceForm.next_service_date}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, next_service_date: e.target.value }))}
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Vehicle Downtime (Days)</label>
                  <input
                    type="number"
                    value={serviceForm.vehicle_downtime_days}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, vehicle_downtime_days: e.target.value }))}
                    placeholder="2"
                    className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Section Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200/70 shadow-sm rounded-xl p-5 space-y-5">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 pb-2">Service Details</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Work Performed / Complaints</label>
              <textarea
                value={serviceForm.work_performed}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, work_performed: e.target.value }))}
                placeholder="Describe the specific work performed or initial complaints reported by the driver..."
                rows="3"
                className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 outline-none resize-none"
              />
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Breakdown Details</label>
                <input
                  type="text"
                  value={serviceForm.breakdown_details}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, breakdown_details: e.target.value }))}
                  placeholder="No breakdown"
                  className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Accident Details</label>
                <input
                  type="text"
                  value={serviceForm.accident_details}
                  onChange={(e) => setServiceForm((prev) => ({ ...prev, accident_details: e.target.value }))}
                  placeholder="No accident"
                  className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300 transition"
                />
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
              <textarea
                value={serviceForm.remarks}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder="Specific details from the driver regarding the incident..."
                rows="2"
                className="w-full bg-slate-50/50 dark:bg-slate-800/70 border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 outline-none resize-none focus:border-blue-300 transition"
              />
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

          {formStatus.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm font-semibold mt-3">
              {formStatus.error}
            </div>
          )}
          {formStatus.success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4 text-sm font-semibold mt-3">
              {formStatus.success}
            </div>
          )}

        </form>

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