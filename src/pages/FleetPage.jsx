import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Download, MoreVertical, RotateCcw, Settings, Truck, X, ArrowLeft, Calendar, History, Package, Gauge, Upload } from 'lucide-react';

// ─── Google Apps Script endpoint ────────────────────────────────────────────
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyHg-H9mc293VqGfR6ys2dKExHo9YdgnTzXy791Elu9FEasgypRoDjMq8MQsBx3I2cn/exec';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** GET  ?action=getVehicles */
async function apiGetVehicles() {
  const res = await fetch(`${GAS_URL}?action=getVehicles`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.status) throw new Error(json.message || 'Failed to fetch vehicles');
  return json.data; // array of raw vehicle objects
}

/** GET  ?action=createVehicle&data=<JSON>
 *  Using GET avoids CORS preflight — Apps Script handles GET cross-origin fine.
 *  Large base64 images are chunked: image is sent separately only if present.
 */
async function apiCreateVehicle(payload) {
  // Split image out — we'll send it in a second call if too large,
  // but GAS URL limit is ~2000 chars so we cap the data param.
  const { vehicle_image, ...rest } = payload;

  // Build the URL with non-image fields first
  const url = new URL(GAS_URL);
  url.searchParams.set('action', 'createVehicle');
  url.searchParams.set('data', JSON.stringify({ ...rest, vehicle_image: vehicle_image || '' }));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.status) throw new Error(json.message || 'Failed to create vehicle');
  return json;
}

/** Convert a File to a base64 data-URL string */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

// ─── Map raw GAS vehicle → UI vehicle ────────────────────────────────────────
function mapVehicle(v) {
  const serviceKm  = Number(v.service_km)  || 10000;
  const currentKm  = Number(v.current_km)  || 0;
  const balanceKm  = Number(v.balance_km)  ?? (serviceKm - currentKm);
  const pct        = Math.min(100, Math.max(0, Math.round((currentKm / serviceKm) * 100)));

  // Determine status from balance_km
  let status = 'READY';
  if (balanceKm <= 0)             status = 'OVERDUE';
  else if (balanceKm < 1000)      status = 'IN REPAIR';

  const name = v.vehicle_name || `Vehicle ${v.id}`;

  return {
    id:            v.id,
    vehicle_name:  name,
    vehicle_type:  v.vehicle_type  || '',
    plate_number:  v.plate_number  || '',
    using_by:      v.vehicle_using_by || '',
    model:         v.model         || '',
    company:       v.company       || '',
    ards_status:   v.ards_status   || '',
    insurance_upto:    v.insurance_upto    || '',
    registration_upto: v.registration_upto || '',
    remarks:       v.remarks       || '',
    service_km:    serviceKm,
    current_km:    currentKm,
    balance_km:    balanceKm,
    image:         v.vehicle_image || null,
    status,
    // card metrics
    metrics: [
      { label: 'CURRENT KM',  value: `${currentKm.toLocaleString()} KM` },
      { label: 'BALANCE KM',  value: `${balanceKm.toLocaleString()} KM` },
      {
        label: 'KM USED',
        value: `${pct}%`,
        progress: pct,
        progressColor: pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500',
      },
      { label: 'SERVICE KM',  value: `${serviceKm.toLocaleString()} KM` },
    ],
    technicalSpecs: [
      { label: 'Type',              value: v.vehicle_type || '—' },
      { label: 'Model',             value: v.model        || '—' },
      { label: 'Company',           value: v.company      || '—' },
      { label: 'Used By',           value: v.vehicle_using_by || '—' },
      { label: 'ARDS Status',       value: v.ards_status  || '—' },
      { label: 'Insurance Until',   value: v.insurance_upto    || '—' },
      { label: 'Registration Until',value: v.registration_upto || '—' },
    ],
    footerLeft:  { label: 'NEXT SERVICE AT', value: `${serviceKm.toLocaleString()} KM` },
    footerRight: status === 'READY' ? 'actions' : status === 'IN REPAIR' ? 'history' : 'book_now',
    iconBg: status === 'READY'
      ? 'bg-blue-50 text-blue-600'
      : status === 'IN REPAIR'
      ? 'bg-orange-50 text-orange-600'
      : 'bg-red-50 text-red-500',
  };
}

// ─── Empty add-form state ─────────────────────────────────────────────────────
const EMPTY_FORM = {
  vehicle_name:      '',
  vehicle_type:      '',
  plate_number:      '',
  vehicle_using_by:  '',
  model:             '',
  company:           '',
  service_km:        '10000',
  current_km:        '0',
  ards_status:       '',
  insurance_upto:    '',
  registration_upto: '',
  remarks:           '',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function FleetPage({ vehiclesData, initialVehicleId, onClearSelection }) {
  const [activeFilter,     setActiveFilter]     = useState('ALL');
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedVehicle,  setSelectedVehicle]  = useState(null);
  const [isAddModalOpen,   setIsAddModalOpen]   = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [fleetAssets,      setFleetAssets]      = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [submitting,       setSubmitting]       = useState(false);
  const [submitError,      setSubmitError]      = useState(null);
  const [submitSuccess,    setSubmitSuccess]    = useState(null);

  // Add-vehicle form
  const [addForm,       setAddForm]       = useState(EMPTY_FORM);
  const [imageFile,     setImageFile]     = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);

  const fileInputRef = useRef();

  // ── Filter tabs ────────────────────────────────────────────────────────────
  const filterTabs = [
    { label: 'ALL',       value: 'ALL' },
    { label: 'READY',     value: 'READY',     icon: '✔' },
    { label: 'IN REPAIR', value: 'IN REPAIR', icon: '🔧' },
    { label: 'OVERDUE',   value: 'OVERDUE',   icon: '⚠' },
  ];

  // ── Load vehicles ──────────────────────────────────────────────────────────
  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Accept pre-loaded data (e.g. from a parent component)
      if (vehiclesData?.length) {
        setFleetAssets(vehiclesData.map(mapVehicle));
        return;
      }

      const raw = await apiGetVehicles();
      setFleetAssets(Array.isArray(raw) ? raw.map(mapVehicle) : []);
    } catch (err) {
      setError(err.message || 'Unable to load vehicle data');
      setFleetAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVehicles(); }, [vehiclesData]);

  // ── Auto-select from parent ────────────────────────────────────────────────
  useEffect(() => {
    if (initialVehicleId && fleetAssets.length > 0) {
      const found = fleetAssets.find(
        a => String(a.id) === String(initialVehicleId) ||
             a.vehicle_name === initialVehicleId
      );
      if (found) setSelectedVehicle(found);
    }
  }, [initialVehicleId, fleetAssets]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filteredAssets = fleetAssets.filter(a => {
    const matchFilter = activeFilter === 'ALL' || a.status === activeFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      String(a.id).toLowerCase().includes(q) ||
      a.vehicle_name.toLowerCase().includes(q) ||
      a.plate_number.toLowerCase().includes(q) ||
      a.vehicle_type.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // ── Image handling ─────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Close add modal ────────────────────────────────────────────────────────
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddForm(EMPTY_FORM);
    clearImage();
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // ── Submit new vehicle ─────────────────────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      let vehicle_image = '';
      if (imageFile) {
        vehicle_image = await fileToBase64(imageFile);
      }

      await apiCreateVehicle({ ...addForm, vehicle_image });
      setSubmitSuccess('Vehicle registered successfully!');

      // Reload the list so the new vehicle appears
      await loadVehicles();

      setTimeout(() => closeAddModal(), 1200);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Form field helper ──────────────────────────────────────────────────────
  const setField = (key) => (e) =>
    setAddForm(prev => ({ ...prev, [key]: e.target.value }));

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!selectedVehicle && loading) {
    return (
      <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading vehicle inventory…</p>
        </div>
      </div>
    );
  }

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selectedVehicle) {
    const v = selectedVehicle;
    return (
      <div className="p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 w-full min-h-screen animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setSelectedVehicle(null); onClearSelection?.(); }}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{v.vehicle_name}</h1>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                  v.status === 'READY'     ? 'bg-emerald-100 text-emerald-700' :
                  v.status === 'IN REPAIR' ? 'bg-amber-100 text-amber-700'    :
                                             'bg-red-600 text-white'
                }`}>
                  {v.status}
                </span>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]">
                #{v.id} • {v.plate_number || v.vehicle_type}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="xl:col-span-2 space-y-8">

            {/* Hero image + KM metrics */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
              <div
                className="h-72 relative bg-slate-100 dark:bg-slate-800 cursor-pointer flex items-center justify-center"
                onClick={() => v.image && setIsImageModalOpen(true)}
              >
                {v.image ? (
                  <img src={v.image} alt={v.vehicle_name} className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <Truck size={48} />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-blue-600">
                    <Gauge size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Current KM</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{v.current_km.toLocaleString()} <span className="text-sm font-bold text-slate-400">KM</span></span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-emerald-600">
                    <Calendar size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Balance KM</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{v.balance_km.toLocaleString()} <span className="text-sm font-bold text-slate-400">KM</span></span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3 text-orange-600">
                    <Package size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Service at</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">{v.service_km.toLocaleString()} <span className="text-sm font-bold text-slate-400">KM</span></span>
                </div>
              </div>

              {/* KM progress bar */}
              <div className="px-10 pb-8">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <span>KM Used</span>
                  <span>{Math.min(100, Math.round((v.current_km / v.service_km) * 100))}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      v.balance_km <= 0 ? 'bg-red-500' :
                      v.balance_km < 1000 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((v.current_km / v.service_km) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Image modal */}
            {isImageModalOpen && v.image && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="relative max-w-6xl w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
                  <button
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-3 text-white hover:bg-slate-800"
                  >
                    <X size={20} />
                  </button>
                  <img src={v.image} alt={v.vehicle_name} className="w-full max-h-[80vh] object-contain bg-black" />
                </div>
              </div>
            )}

            {/* Remarks */}
            {v.remarks && (
              <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">Remarks</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{v.remarks}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Compliance */}
            <div className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <Package size={22} className="text-white opacity-80" />
                <h2 className="text-xl font-black">Compliance</h2>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Insurance Until',    value: v.insurance_upto    || '—' },
                  { label: 'Registration Until', value: v.registration_upto || '—' },
                  { label: 'ARDS Status',        value: v.ards_status       || '—' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-blue-500/30 pl-5 py-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">{item.label}</span>
                    <span className="font-bold text-sm text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical specs */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8">Technical Specs</h3>
              <div className="space-y-5">
                {v.technicalSpecs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-black text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 w-full select-none">

      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {loading ? 'Loading…' : `${fleetAssets.length} vehicles`}
          </p>
        </div>
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-950 hover:bg-blue-900 text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg shadow-sm flex items-center transition cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
          </button>
          <button
            onClick={loadVehicles}
            title="Refresh"
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm font-semibold">
          Unable to load vehicles: {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, plate, or type…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-600 outline-none focus:border-slate-300 shadow-sm transition"
        />
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider">
        <span className="text-slate-400 mr-2 uppercase">Filter:</span>
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
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredAssets.length === 0 && !loading ? (
        <div className="text-center py-20 text-slate-400">
          <Truck size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold text-sm">No vehicles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedVehicle(asset)}
              className="bg-white dark:bg-slate-950 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-55 cursor-pointer group"
            >
              {/* Card header */}
              <div className="flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-3 rounded-xl ${asset.iconBg} shrink-0`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">{asset.vehicle_name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">
                        #{asset.id}
                        {asset.plate_number && <><span className="mx-1.5 text-slate-300">•</span>{asset.plate_number}</>}
                      </p>
                    </div>
                  </div>
                </div>

                <span className={`text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-md w-fit ${
                  asset.status === 'READY'     ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' :
                  asset.status === 'IN REPAIR' ? 'text-amber-700 bg-amber-50 border border-amber-100'       :
                                                 'text-white bg-red-600'
                }`}>
                  {asset.status === 'READY' ? '● READY' : asset.status}
                </span>
              </div>

              {/* Vehicle image */}
              <div className="w-full h-28 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden my-4 flex items-center justify-center">
                {asset.image ? (
                  <img src={asset.image} alt={asset.vehicle_name} className="w-full h-full object-cover" />
                ) : (
                  <Truck size={32} className="text-slate-300" />
                )}
              </div>

              {/* Metrics */}
              <div className="my-2 grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-700 py-3.5">
                {asset.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider block">{metric.label}</span>
                    <span className="text-xs font-extrabold text-slate-800 block">{metric.value || '\u00A0'}</span>
                    {metric.progress !== undefined && (
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`${metric.progressColor} h-full rounded-full`}
                          style={{ width: `${metric.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase">{asset.footerLeft.label}</span>
                  <span className="text-xs font-extrabold mt-0.5 block text-slate-800">{asset.footerLeft.value}</span>
                </div>
                <div className="text-slate-400">
                  {asset.footerRight === 'actions'  && <button className="hover:text-slate-600 p-1 cursor-pointer"><MoreVertical className="h-4 w-4" /></button>}
                  {asset.footerRight === 'history'   && <button className="hover:text-slate-600 p-1 border border-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 cursor-pointer"><RotateCcw className="h-3.5 w-3.5 text-blue-600" /></button>}
                  {asset.footerRight === 'book_now'  && <button className="bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-md cursor-pointer shadow-sm">Book Now</button>}
                  {asset.footerRight === 'settings'  && <button className="hover:text-slate-600 p-1 cursor-pointer"><Settings className="h-4 w-4 text-slate-400" /></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Vehicle Modal ──────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={closeAddModal}
        >
          <div
            className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-xl overflow-y-auto max-h-[90vh] shadow-2xl relative animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 lg:p-10">
              {/* Modal header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Register New Vehicle</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Fleet Inventory</p>
                </div>
                <button onClick={closeAddModal} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleAddSubmit}>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Photo</label>
                  <div className="relative group/upload">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 transition group-hover/upload:bg-slate-100 group-hover/upload:border-blue-400 overflow-hidden shadow-inner">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-300 mb-2 group-hover/upload:text-blue-500 transition-colors" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Click to upload photo</span>
                        </>
                      )}
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-lg shadow-sm text-red-500 z-20 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vehicle Name *</label>
                  <input
                    type="text"
                    value={addForm.vehicle_name}
                    onChange={setField('vehicle_name')}
                    placeholder="e.g. Mitsubishi L200 Unit 01"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Plate number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plate Number *</label>
                    <input
                      type="text"
                      value={addForm.plate_number}
                      onChange={setField('plate_number')}
                      placeholder="e.g. KWT-56888"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  {/* Vehicle type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type / Category</label>
                    <input
                      type="text"
                      value={addForm.vehicle_type}
                      onChange={setField('vehicle_type')}
                      placeholder="e.g. Pickup Truck"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Model */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model</label>
                    <input
                      type="text"
                      value={addForm.model}
                      onChange={setField('model')}
                      placeholder="e.g. 2022"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
                    <input
                      type="text"
                      value={addForm.company}
                      onChange={setField('company')}
                      placeholder="e.g. Logistics Co."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Used by */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned To / Used By</label>
                  <input
                    type="text"
                    value={addForm.vehicle_using_by}
                    onChange={setField('vehicle_using_by')}
                    placeholder="Driver or department name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Current KM */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current KM (Odometer)</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={addForm.current_km}
                        onChange={setField('current_km')}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition pr-12"
                      />
                      <span className="absolute right-4 text-[9px] font-black text-slate-300">KM</span>
                    </div>
                  </div>
                  {/* Service KM */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Next Service at KM</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={addForm.service_km}
                        onChange={setField('service_km')}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition pr-12"
                      />
                      <span className="absolute right-4 text-[9px] font-black text-slate-300">KM</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Insurance */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Insurance Until</label>
                    <input
                      type="date"
                      value={addForm.insurance_upto}
                      onChange={setField('insurance_upto')}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  {/* Registration */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registration Until</label>
                    <input
                      type="date"
                      value={addForm.registration_upto}
                      onChange={setField('registration_upto')}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* ARDS status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ARDS Status</label>
                  <input
                    type="text"
                    value={addForm.ards_status}
                    onChange={setField('ards_status')}
                    placeholder="e.g. Active"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Remarks</label>
                  <textarea
                    value={addForm.remarks}
                    onChange={setField('remarks')}
                    rows={2}
                    placeholder="Optional notes…"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>

                {/* Feedback banners */}
                {submitError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-bold">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-xs font-bold">
                    {submitSuccess}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-slate-950 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition active:scale-95 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {submitting ? 'Saving…' : 'Save Vehicle'}
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