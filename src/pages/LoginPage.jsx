import React, { useState } from 'react';
import { Truck, Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated authorization delay for UX feedback
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 antialiased selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-md w-full">
        {/* System Branding Area */}
        <div className="text-center mb-10 transform transition-all duration-700 hover:scale-105">
          <div className="inline-flex items-center justify-center bg-blue-600 text-white p-4 rounded-3xl shadow-2xl shadow-blue-600/30 mb-6 border border-blue-500/50">
            <Truck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            FleetOps <span className="text-blue-600 uppercase">Pro</span>
          </h1>
          <p className="text-slate-400 mt-2.5 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Logistics & Asset Intelligence</p>
        </div>

        {/* Security Authorization Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200/70 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(8,47,73,0.08)] relative overflow-hidden group">
          {/* Interactive header accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out"></div>
          
         
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operator Identifier Input */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Email ID</label>
              <div className="relative group/field">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ops.center@fleetops.pro"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300 placeholder:font-medium tracking-tight"
                  required
                />
                <Mail className="absolute left-4.5 top-4.5 h-4 w-4 text-slate-400 group-focus-within/field:text-blue-600 transition-colors duration-300" />
              </div>
            </div>

            {/* Security Access Key Input */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Security Key</label>
                <button type="button" className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">Forgot Key?</button>
              </div>
              <div className="relative group/field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300 placeholder:font-medium tracking-tight"
                  required
                />
                <Lock className="absolute left-4.5 top-4.5 h-4 w-4 text-slate-400 group-focus-within/field:text-blue-600 transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4.5 top-4.5 text-slate-400 hover:text-blue-600 transition-colors duration-300 outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Authorization CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="uppercase tracking-[0.2em] text-xs">Verify & Initialize</span>
              )}
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center space-x-3">
            <ShieldAlert className="h-4 w-4 text-blue-600/40" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">Secure Endpoint Authorization v4.2</span>
          </div>
        </div>

        {/* System Metadata */}
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-loose opacity-60">
            Proprietary Dashboard Interface <br />
            © 2024 FleetOps Pro Global <span className="mx-2 text-slate-200">|</span> Node: AMER-EAST-01 <br />
            Powered by <span className="text-blue-600 font-black">Careergize</span>
          </p>
        </div>
      </div>
    </div>
  );
}