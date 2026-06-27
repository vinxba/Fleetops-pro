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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [addForm, setAddForm] = useState({
    vehicle_code: '',
    vehicle_name: '',
    vehicle_type: '',
    plate_number: '',
    vehicle_using_by: '',
    service_km: '',
    current_km: '',
    model_year: '',
    ards_status: 'READY',
    insurance_upto: '',
    registration_upto: '',
    company: '',
    vehicle_image_url: '',
    remarks: '',
    next_service_date: '',
  });
  const [fleetAssets, setFleetAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const API_BASE_URL = 'https://nventro-backend-c532.onrender.com/api/vehicles/';

  const typeImageMap = {
    'sulphur truck': tankerImage,
    'sulfur truck': tankerImage,
    'fuel transporter': tankerImage,
    'commercial van': commercialVanImage,
    'land cruiser 79': landCruiserImage,
    'logistics hauler': logisticsHaulerImage,
    'excavator 300': excavatorImage,
  };

  const openEditFor = (vehicle) => {
    setEditForm({
      id: vehicle.id ?? vehicle.vehicle_code ?? vehicle.id,
      vehicle_name: vehicle.vehicle_name || vehicle.vehicle || vehicle.type || '',
      vehicle_type: vehicle.vehicle_type || vehicle.type || '',
      plate_number: vehicle.plate_number || '',
      vehicle_using_by: vehicle.vehicle_using_by || vehicle.assigned_driver || '',
      service_km: vehicle.service_km ?? vehicle.monthly_start_mileage ?? '',
      current_km: vehicle.current_km ?? vehicle.monthly_end_mileage ?? '',
      balance_service_km: vehicle.balance_service_km ?? vehicle.service_km_left ?? '',
      model_year: vehicle.model_year || vehicle.model || '',
      ards_status: vehicle.ards_status || vehicle.status || '',
      insurance_upto: vehicle.insurance_upto || '',
      registration_upto: vehicle.registration_upto || '',
      company: vehicle.company || '',
      vehicle_image_url: vehicle.vehicle_image_url || vehicle.vehicle_image || '',
      remarks: vehicle.remarks || vehicle.remark || '',
      monthly_mileage: vehicle.monthly_mileage || '',
      fuel_level: vehicle.fuel_level || '',
      oil_level: vehicle.oil_level || '',
      battery_health: vehicle.battery_health || '',
      next_service_date: vehicle.next_service_date || '',
    });
    setIsEditModalOpen(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editForm) return;

    const updated = {
      ...selectedVehicle,
      type: editForm.vehicle_name,
      vehicle_name: editForm.vehicle_name,
      vehicle_type: editForm.vehicle_type,
      plate_number: editForm.plate_number,
      vehicle_using_by: editForm.vehicle_using_by,
      assigned_driver: editForm.vehicle_using_by,
      current_km: editForm.current_km,
      service_km: editForm.service_km,
      balance_service_km: editForm.balance_service_km,
      model_year: editForm.model_year,
      ards_status: editForm.ards_status,
      status: editForm.ards_status?.toUpperCase() || selectedVehicle.status,
      insurance_upto: editForm.insurance_upto,
      registration_upto: editForm.registration_upto,
      company: editForm.company,
      vehicle_image_url: editForm.vehicle_image_url,
      vehicle_image: editForm.vehicle_image_url,
      remarks: editForm.remarks,
      monthly_mileage: editForm.monthly_mileage || '',
      fuel_level: editForm.fuel_level,
      oil_level: editForm.oil_level,
      battery_health: editForm.battery_health,
      next_service_date: editForm.next_service_date,
      metrics: [
        { label: 'CURRENT KM', value: `${Number(editForm.current_km || 0).toLocaleString()} KM` },
        { label: 'SERVICE LEFT', value: `${Number(editForm.balance_service_km || 0).toLocaleString()} KM` },
        { label: 'SERVICE KM', value: `${Number(editForm.service_km || 0).toLocaleString()} KM` },
        { label: 'MODEL YEAR', value: editForm.model_year || 'N/A' },
      ],
      technicalSpecs: [
        { label: 'Vehicle Type', value: editForm.vehicle_type || 'N/A' },
        { label: 'Plate Number', value: editForm.plate_number || 'N/A' },
        { label: 'Vehicle Using By', value: editForm.vehicle_using_by || 'Unassigned' },
        { label: 'Model', value: editForm.model_year || 'N/A' },
        { label: 'ARDS Status', value: editForm.ards_status || 'N/A' },
        { label: 'Insurance Up-To', value: editForm.insurance_upto || 'N/A' },
        { label: 'Registration Up-To', value: editForm.registration_upto || 'N/A' },
        { label: 'Company', value: editForm.company || 'N/A' },
        { label: 'Remarks', value: editForm.remarks || 'No remarks' },
      ],
    };

    setFleetAssets((prev) => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
    setSelectedVehicle(updated);
    setIsEditModalOpen(false);
  };

  const getVehicleImage = (vehicleType) => {
    if (!vehicleType) return MitsubishiL200;
    const normalized = String(vehicleType).toLowerCase().trim();
    return typeImageMap[normalized] || MitsubishiL200;
  };

  const resetAddForm = () => {
    setAddForm({
      vehicle_code: '',
      vehicle_name: '',
      vehicle_type: '',
      plate_number: '',
      vehicle_using_by: '',
      service_km: '',
      current_km: '',
      model_year: '',
      ards_status: 'READY',
      insurance_upto: '',
      registration_upto: '',
      company: '',
      vehicle_image_url: '',
      remarks: '',
      next_service_date: '',
    });
  };

  const openAddModal = () => {
    resetAddForm();
    setImagePreview(null);
    setSaveError(null);
    setIsAddModalOpen(true);
  };

  const saveNewVehicle = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);

    const balanceServiceKm = Math.max(0, Number(addForm.service_km) - Number(addForm.current_km));
    const payload = {
      vehicle_name: addForm.vehicle_name,
      vehicle_type: addForm.vehicle_type,
      plate_number: addForm.plate_number,
      vehicle_using_by: addForm.vehicle_using_by,
      service_km: Number(addForm.service_km) || 0,
      current_km: Number(addForm.current_km) || 0,
      balance_service_km: balanceServiceKm,
      model_year: addForm.model_year,
      ards_status: addForm.ards_status,
      insurance_upto: addForm.insurance_upto || null,
      registration_upto: addForm.registration_upto || null,
      remarks: addForm.remarks,
      next_service_date: addForm.next_service_date || null,
    };

    try {
      console.log('Saving vehicle payload', payload);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorText = await response.text().catch(() => null);
        throw new Error(
          errorData?.detail || errorData?.message || errorText || `Create failed with status ${response.status}`
        );
      }

      let createdVehicle;
      try {
        createdVehicle = await response.json();
      } catch (jsonError) {
        console.warn('POST succeeded but response body is not JSON', jsonError);
        createdVehicle = { ...payload, id: `NEW-${Date.now()}` };
      }
      console.log('Created vehicle', createdVehicle);

      const refreshResponse = await fetch(API_BASE_URL);
      if (refreshResponse.ok) {
        const listData = await refreshResponse.json().catch(() => null);
        setFleetAssets(Array.isArray(listData) ? listData.map(mapVehicleResponse) : [mapVehicleResponse(createdVehicle)]);
      } else {
        setFleetAssets((prev) => [mapVehicleResponse(createdVehicle), ...prev]);
      }

      setIsAddModalOpen(false);
      setImagePreview(null);
      resetAddForm();
    } catch (createError) {
      console.error('Unable to create vehicle:', createError);
      setSaveError(createError.message || 'Unable to create vehicle.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatKmValue = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return 'N/A';
    return `${numericValue.toLocaleString()} KM`;
  };

  const mapVehicleResponse = (vehicle) => {
    const currentKm = Number(vehicle.current_km ?? vehicle.monthly_end_mileage ?? 0);
    const serviceKm = Number(vehicle.service_km ?? vehicle.monthly_start_mileage ?? 0);
    const balanceServiceKm = Number(vehicle.balance_service_km ?? vehicle.service_km_left ?? vehicle.balance_service_km ?? 0);
    const status = (vehicle.ards_status || vehicle.status || 'UNKNOWN').toUpperCase();
    const vehicleName = vehicle.vehicle_name || vehicle.vehicle || vehicle.type || `Vehicle ${vehicle.id}`;
    const vehicleType = vehicle.vehicle_type || vehicle.type || 'Unknown Type';
    const imageUrl = vehicle.vehicle_image_url || vehicle.vehicle_image || getVehicleImage(vehicleType);
    const driverName = vehicle.vehicle_using_by || vehicle.assigned_driver || 'Unassigned';
    const insuranceUntil = vehicle.insurance_upto || vehicle.insurance_until || 'N/A';
    const companyName = vehicle.company || 'N/A';
    const remarks = vehicle.remarks || vehicle.remark || 'No remarks';

    return {
      id: vehicle.vehicle_code || String(vehicle.id),
      type: vehicleName,
      subtext: vehicle.plate_number ? `Plate ${vehicle.plate_number}` : vehicleType,
      status,
      image: imageUrl,
      metrics: [
        { label: 'CURRENT KM', value: formatKmValue(currentKm) },
        { label: 'SERVICE LEFT', value: formatKmValue(balanceServiceKm) },
        { label: 'SERVICE KM', value: formatKmValue(serviceKm) },
        { label: 'MODEL', value: vehicle.model_year || vehicle.model || 'N/A' },
      ],
      repairHistory: [],
      partsRemoved: [],
      technicalSpecs: [
        { label: 'Vehicle Type', value: vehicleType },
        { label: 'Plate Number', value: vehicle.plate_number || 'N/A' },
        { label: 'Vehicle Using By', value: driverName },
        { label: 'Model', value: vehicle.model_year || vehicle.model || 'N/A' },
        { label: 'ARDS Status', value: status || 'N/A' },
        { label: 'Insurance Up-To', value: insuranceUntil },
        { label: 'Registration Up-To', value: vehicle.registration_upto || 'N/A' },
        { label: 'Company', value: companyName },
        { label: 'Remarks', value: remarks },
      ],
      footerLeft: { label: 'SERVICE BALANCE', value: formatKmValue(balanceServiceKm) },
      footerRight: status === 'READY' ? 'actions' : status === 'IN REPAIR' ? 'history' : 'book_now',
      iconBg: status === 'READY' ? 'bg-blue-50 text-blue-600' : status === 'IN REPAIR' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-500',
      plate_number: vehicle.plate_number,
      vehicle_using_by: driverName,
      assigned_driver: driverName,
      service_km: serviceKm,
      current_km: currentKm,
      balance_service_km: balanceServiceKm,
      monthly_start_mileage: vehicle.monthly_start_mileage,
      monthly_end_mileage: vehicle.monthly_end_mileage,
      monthly_mileage: vehicle.monthly_mileage,
      fuel_level: vehicle.fuel_level,
      oil_level: vehicle.oil_level,
      battery_health: vehicle.battery_health,
      next_service_date: vehicle.next_service_date,
      vehicle_name: vehicleName,
      vehicle_type: vehicleType,
      insurance_upto: insuranceUntil,
      company: companyName,
      remarks,
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const filterTabs = [
    { label: 'ALL', value: 'ALL', count: null },
    { label: 'READY', value: 'READY', icon: '✔' },
    { label: 'IN REPAIR', value: 'IN REPAIR', icon: '🔧' },
    { label: 'OVERDUE', value: 'OVERDUE', icon: '⚠' },
  ];

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (vehiclesData?.length) {
          setFleetAssets(vehiclesData.map(mapVehicleResponse));
          return;
        }

        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        setFleetAssets(Array.isArray(data) ? data.map(mapVehicleResponse) : []);
      } catch (err) {
        setError(err.message || 'Unable to load vehicle data');
        setFleetAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [vehiclesData]);

  const filteredAssets = fleetAssets.filter(asset => {
    const matchesFilter = activeFilter === 'ALL' || asset.status === activeFilter;
    const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.subtext.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (initialVehicleId && fleetAssets.length > 0) {
      const autoSelected = fleetAssets.find(a =>
        a.type === initialVehicleId ||
        a.id === initialVehicleId ||
        a.vehicleName === initialVehicleId
      );
      if (autoSelected) setSelectedVehicle(autoSelected);
    }
  }, [initialVehicleId, fleetAssets]);

  if (!selectedVehicle && loading) {
    return (
      <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 w-full min-h-screen">
        <div className="max-w-4xl mx-auto rounded-[3rem] border border-slate-200 bg-white dark:bg-slate-950 p-10 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3">Loading vehicle inventory…</h1>
          <p className="text-slate-500 dark:text-slate-400">Fetching from nventro-backend-c532.onrender.com/api/vehicles/</p>
        </div>
      </div>
    );
  }

  // Render Detail View
  if (selectedVehicle) {
    return (
      <div className="p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 w-full min-h-screen animate-in fade-in duration-500">
        {/* Detail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedVehicle.type}</h1>
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
            <button onClick={() => openEditFor(selectedVehicle)} className="bg-white dark:bg-slate-800 border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
              Edit Details
            </button>
            <button className="bg-slate-950 text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition active:scale-95">
              Schedule Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Primary Info Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Hero Image & Metrics */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
              <div className="h-80 relative bg-slate-100 dark:bg-slate-800 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img src={selectedVehicle.image} alt={selectedVehicle.type} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="p-10 -mt-16 relative grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-4xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-blue-600">
                    <Gauge size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Driven</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{selectedVehicle.metrics[0].value}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-4xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-emerald-600">
                    <Calendar size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Next Service</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{selectedVehicle.footerLeft.value}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-4xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-orange-600">
                    <Package size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Load Capacity</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{selectedVehicle.technicalSpecs?.find(s => s.label === 'Payload')?.value || 'N/A'}</span>
                </div>
              </div>
            </div>

            {isImageModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="relative max-w-6xl w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
                  <button
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-3 text-white hover:bg-slate-800"
                  >
                    <X size={20} />
                  </button>
                  <img src={selectedVehicle.image} alt={selectedVehicle.type} className="w-full h-[80vh] object-contain bg-black" />
                </div>
              </div>
            )}

            {isEditModalOpen && editForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsEditModalOpen(false)}>
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <div className="p-8 lg:p-10">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Edit Vehicle Details</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Editing {editForm.vehicle_name}</p>
                      </div>
                      <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-xl transition text-slate-400 cursor-pointer">
                        <X size={20} />
                      </button>
                    </div>

                    <form className="space-y-5" onSubmit={saveEdit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle</label>
                          <input value={editForm.vehicle_name} onChange={(e) => setEditForm(f => ({ ...f, vehicle_name: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Type</label>
                          <input value={editForm.vehicle_type} onChange={(e) => setEditForm(f => ({ ...f, vehicle_type: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plate Number</label>
                          <input value={editForm.plate_number} onChange={(e) => setEditForm(f => ({ ...f, plate_number: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Using By</label>
                          <input value={editForm.vehicle_using_by} onChange={(e) => setEditForm(f => ({ ...f, vehicle_using_by: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
                          <input value={editForm.company} onChange={(e) => setEditForm(f => ({ ...f, company: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ARDS Status</label>
                          <input value={editForm.ards_status} onChange={(e) => setEditForm(f => ({ ...f, ards_status: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model</label>
                          <input value={editForm.model_year} onChange={(e) => setEditForm(f => ({ ...f, model_year: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Image URL</label>
                          <input value={editForm.vehicle_image_url} onChange={(e) => setEditForm(f => ({ ...f, vehicle_image_url: e.target.value }))} type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Insurance Up-To</label>
                          <input value={editForm.insurance_upto} onChange={(e) => setEditForm(f => ({ ...f, insurance_upto: e.target.value }))} type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registration Up-To</label>
                          <input value={editForm.registration_upto} onChange={(e) => setEditForm(f => ({ ...f, registration_upto: e.target.value }))} type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current (K-M)</label>
                          <input value={editForm.current_km} onChange={(e) => setEditForm(f => ({ ...f, current_km: e.target.value }))} type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">(K-M) for Service</label>
                          <input value={editForm.service_km} onChange={(e) => setEditForm(f => ({ ...f, service_km: e.target.value }))} type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Balance (K-M) for Service</label>
                          <input value={editForm.balance_service_km} onChange={(e) => setEditForm(f => ({ ...f, balance_service_km: e.target.value }))} type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Remarks</label>
                        <textarea value={editForm.remarks} onChange={(e) => setEditForm(f => ({ ...f, remarks: e.target.value }))} rows="3" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fuel (%)</label>
                          <input value={editForm.fuel_level} onChange={(e) => setEditForm(f => ({ ...f, fuel_level: e.target.value }))} type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Oil (%)</label>
                          <input value={editForm.oil_level} onChange={(e) => setEditForm(f => ({ ...f, oil_level: e.target.value }))} type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Battery (%)</label>
                          <input value={editForm.battery_health} onChange={(e) => setEditForm(f => ({ ...f, battery_health: e.target.value }))} type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                        </div>
                      </div>

                      <div className="pt-4 flex space-x-3">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="flex-1 bg-slate-950 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Repair History Table */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><History size={20} /></div>
                  <h3 className="text-xl font-black text-slate-900">Maintenance History</h3>
                </div>
                <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All Records</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-700">
                      <th className="pb-4 px-2 text-blue-600">Date</th>
                      <th className="pb-4 px-2">Operation Details</th>
                      <th className="pb-4 px-2">Cost (USD)</th>
                      <th className="pb-4 px-2">Technician</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {selectedVehicle.repairHistory?.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition">
                        <td className="py-5 px-2 font-bold text-slate-800 whitespace-nowrap">{entry.date}</td>
                        <td className="py-5 px-2 font-black text-slate-900">{entry.task}</td>
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
            <div className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <Package size={22} className="text-white opacity-80" />
                <h2 className="text-xl font-black text-white!">Components Replaced</h2>
              </div>
              <div className="space-y-6">
                {selectedVehicle.partsRemoved?.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500/30 pl-5 py-1">
                    <span className="text-[10px] font-black text-white! uppercase tracking-[0.2em] block mb-1">{item.replacedDate}</span>
                    <h4 className="font-bold text-sm leading-tight text-white!">{item.part}</h4>
                    <p className="text-[10px] font-bold text-white! mt-1 uppercase tracking-widest">S/N: {item.sn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8">Technical Specs</h3>
              <div className="space-y-5">
                {selectedVehicle.technicalSpecs?.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-black text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parts Utilization Card */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8">Consumables Utilization</h3>
              <div className="space-y-4">
                {selectedVehicle.partsRemoved?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900">{item.part}</span>
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
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 w-full select-none">
      
      {/* Title & Core Top Action Control Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Total {fleetAssets.length} vehicles loaded</p>
        </div>
        
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button 
            onClick={openAddModal}
            className="bg-blue-950 hover:bg-blue-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
          </button>
          <button className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center transition cursor-pointer">
            <Download className="mr-1.5 h-4 w-4 text-slate-400" /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm font-semibold">
          Unable to load vehicles: {error}
        </div>
      )}
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
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800'
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
          <div key={index} onClick={() => setSelectedVehicle(asset)} className="bg-white dark:bg-slate-950 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-55 cursor-pointer group">
            {/* Upper Frame Block Segment Info Header */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3.5">
                  <div className={`p-3 rounded-xl ${asset.iconBg} shrink-0`}>
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">{asset.type}</h3>
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
            <div className="w-full h-28 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-4">
              <img src={asset.image} alt={asset.type} className="w-full h-full object-cover" />
            </div>

            {/* Core Card Parameters Metric List Bars Area */}
            <div className="my-5 grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-700 py-3.5">
              {asset.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider block">{metric.label}</span>
                  <span className="text-xs font-extrabold text-slate-800 block">{metric.value || '\u00A0'}</span>
                  {metric.progress !== undefined && (
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
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
                  <button className="hover:text-slate-600 p-1 border border-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 cursor-pointer"><RotateCcw className="h-3.5 w-3.5 text-blue-600" /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3" onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }}>
          <div className="bg-white dark:bg-slate-950 rounded-3xl w-full max-w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-slate-900/20 relative animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-5 lg:p-7 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Vehicle</h2>
                  <p className="text-slate-500 text-[11px] uppercase tracking-[0.25em] mt-1">Enter the vehicle details below</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-xl transition text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={saveNewVehicle}>
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
                    <div className={`h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 transition group-hover/upload:bg-slate-100 group-hover/upload:border-blue-400 overflow-hidden shadow-inner`}>
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Image URL (optional)</label>
                  <input value={addForm.vehicle_image_url} onChange={(e) => setAddForm(f => ({ ...f, vehicle_image_url: e.target.value }))} type="text" placeholder="https://example.com/vehicle.jpg" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  <p className="text-[10px] text-slate-400">Upload a photo above or provide a public image URL.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle</label>
                    <input value={addForm.vehicle_name} onChange={(e) => setAddForm(f => ({ ...f, vehicle_name: e.target.value }))} type="text" placeholder="e.g. Heavy Duty Tanker" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Type</label>
                    <input value={addForm.vehicle_type} onChange={(e) => setAddForm(f => ({ ...f, vehicle_type: e.target.value }))} type="text" placeholder="e.g. Tanker" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plate Number</label>
                    <input value={addForm.plate_number} onChange={(e) => setAddForm(f => ({ ...f, plate_number: e.target.value }))} type="text" placeholder="e.g. KWT-56888" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Using By</label>
                    <input value={addForm.vehicle_using_by} onChange={(e) => setAddForm(f => ({ ...f, vehicle_using_by: e.target.value }))} type="text" placeholder="e.g. Driver Name" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
                    <input value={addForm.company} onChange={(e) => setAddForm(f => ({ ...f, company: e.target.value }))} type="text" placeholder="e.g. FleetOps" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model</label>
                    <input value={addForm.model_year} onChange={(e) => setAddForm(f => ({ ...f, model_year: e.target.value }))} type="text" placeholder="e.g. 2024" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ARDS Status</label>
                    <select value={addForm.ards_status} onChange={(e) => setAddForm(f => ({ ...f, ards_status: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                      <option value="READY">READY</option>
                      <option value="REPAIR">REPAIR</option>
                      <option value="IN REPAIR">IN REPAIR</option>
                      <option value="OVERDUE">OVERDUE</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Image URL</label>
                    <input value={addForm.vehicle_image_url} onChange={(e) => setAddForm(f => ({ ...f, vehicle_image_url: e.target.value }))} type="text" placeholder="Image URL" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CURRENT (K-M)</label>
                    <input value={addForm.current_km} onChange={(e) => setAddForm(f => ({ ...f, current_km: e.target.value }))} type="number" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">(K-M) FOR SERVICE</label>
                    <input value={addForm.service_km} onChange={(e) => setAddForm(f => ({ ...f, service_km: e.target.value }))} type="number" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Insurance Up-To</label>
                    <input value={addForm.insurance_upto} onChange={(e) => setAddForm(f => ({ ...f, insurance_upto: e.target.value }))} type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registration Up-To</label>
                    <input value={addForm.registration_upto} onChange={(e) => setAddForm(f => ({ ...f, registration_upto: e.target.value }))} type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition appearance-none cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Remarks</label>
                  <textarea value={addForm.remarks} onChange={(e) => setAddForm(f => ({ ...f, remarks: e.target.value }))} rows="3" placeholder="Additional notes" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition" />
                </div>

                {saveError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm font-semibold">
                    {saveError}
                  </div>
                )}

                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddModalOpen(false); setImagePreview(null); }} 
                    className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`flex-1 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-900/10 transition active:scale-95 cursor-pointer ${isSaving ? 'bg-slate-500 cursor-not-allowed hover:translate-y-0' : 'bg-slate-950 hover:-translate-y-1'}`}
                  >
                    {isSaving ? 'Saving...' : 'Save Asset'}
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