import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, ShieldCheck, Cpu, Battery, Wifi, Signal, Volume2, Home, ExternalLink } from 'lucide-react';

interface AndroidEmulatorProps {
  children: React.ReactNode;
}

export default function AndroidEmulator({ children }: AndroidEmulatorProps) {
  const [useEmulator, setUseEmulator] = useState(true);
  const [timeStr, setTimeStr] = useState('12:00');
  const [logs, setLogs] = useState<string[]>(['[System] Android Subsystem Init: OK']);

  useEffect(() => {
    // Live update of Android Status Bar Time
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      setTimeStr(`${hrs}:${mins}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 5)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased select-none font-sans">
      
      {/* Sidebar Control Panel on Large Screens */}
      <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Card */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                TRC Emulation Engine
              </h2>
              <p className="text-xs text-slate-500 font-medium">Android virtual container</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">View Configuration</h3>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                id="btn-emulator-on"
                onClick={() => {
                  setUseEmulator(true);
                  addLog('Switched to Android Simulated Phone view');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  useEmulator 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile Frame
              </button>
              <button
                id="btn-emulator-off"
                onClick={() => {
                  setUseEmulator(false);
                  addLog('Switched to Full Responsive Web view');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  !useEmulator 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Full Web
              </button>
            </div>
          </div>

          {/* Native Specifications */}
          <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl mb-6 space-y-3">
            <h3 className="text-xs font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" /> App Context
            </h3>
            <div className="space-y-2 text-xs text-sky-900/80">
              <div className="flex justify-between border-b border-sky-100/60 pb-1">
                <span className="text-sky-600">App Name</span>
                <span className="font-semibold">The Right Choice (TRC)</span>
              </div>
              <div className="flex justify-between border-b border-sky-100/60 pb-1">
                <span className="text-sky-600">Target API</span>
                <span className="font-semibold font-mono">Android 14 (Level 34)</span>
              </div>
              <div className="flex justify-between border-b border-sky-100/60 pb-1">
                <span className="text-sky-600">Storage Scope</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  ● Offline-Only (Locally Scoped)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sky-600">Status</span>
                <span className="font-bold text-sky-600 font-mono">APK BUILD SUPPORTED</span>
              </div>
            </div>
          </div>

          {/* Device Controls (Simulated Physical Hardware Actions) */}
          {useEmulator && (
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Physical Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="ctrl-volume-up"
                  onClick={() => addLog('Volume increased (+10%)')}
                  className="flex items-center gap-2 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  <Volume2 className="w-4 h-4 text-slate-500" />
                  Volume Up
                </button>
                <button
                  id="ctrl-haptic"
                  onClick={() => addLog('Simulated haptic touch feedback')}
                  className="flex items-center gap-2 py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  <Cpu className="w-4 h-4 text-slate-500" />
                  Test Haptics
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Operating System Console Logs (Simulated) */}
        <div className="hidden md:block bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase font-mono">Device Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px] leading-relaxed text-slate-400 h-28 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="truncate select-text">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Simulator Workspace Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-slate-100 overflow-y-auto">
        {useEmulator ? (
          /* Phone Shell Device Emulator Container */
          <div className="relative w-full max-w-[410px] h-[840px] flex flex-col rounded-[55px] bg-slate-900/95 ring-[14px] ring-slate-850 shadow-2xl overflow-hidden transition-all duration-300 border-[4px] border-slate-800">
            {/* Top Ear Speaker/Notch Detail */}
            <div className="absolute top-0 inset-x-0 h-9 bg-slate-900/95 flex items-center justify-center z-50">
              <div className="w-32 h-4.5 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
                {/* Selfie Camera Hole */}
                <div className="w-3 h-3 rounded-full bg-slate-900/80 border border-slate-800"></div>
                {/* Earphone Speaker Slot */}
                <div className="w-14 h-1 bg-zinc-800 rounded-full"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-sky-950/20"></div>
              </div>
            </div>

            {/* Simulated Android Screen Content View */}
            <div className="flex-1 flex flex-col bg-slate-50 mt-9 overflow-hidden rounded-b-[40px] relative">
              {/* Virtual Android Status Bar */}
              <div className="flex items-center justify-between px-6 pt-1.5 pb-1 bg-sky-650 text-white select-none z-30 shadow-sm shrink-0">
                <span className="text-xs font-bold font-mono tracking-tight">{timeStr} <span className="text-[10px] font-semibold text-sky-200">UTC</span></span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  <Signal className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  <span className="text-[10px] font-bold font-mono tracking-tighter">LTE</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Battery className="w-4 h-4 text-white rotate-270" strokeWidth={2.5} />
                    <span className="text-[9px] font-bold font-mono">100%</span>
                  </div>
                </div>
              </div>

              {/* The encapsulated React Application Component tree goes here */}
              <div className="flex-1 flex flex-col overflow-y-auto relative bg-sky-50/20">
                {children}
              </div>

              {/* Virtual Android Navigation Bar Pill */}
              <div className="h-8 bg-white border-t border-slate-100 flex items-center justify-center pb-1 shrink-0 z-20">
                <div className="w-28 h-1 rounded-full bg-slate-350 hover:bg-slate-500 transition-colors cursor-pointer"></div>
              </div>
            </div>

            {/* Sleek shadow effect overlays inside the phone glass */}
            <div className="pointer-events-none absolute inset-0 rounded-[55px] border border-white/10 z-40"></div>
          </div>
        ) : (
          /* Pure Responsive Fullscreen Web Preview container */
          <div className="w-full h-full max-w-6xl bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden flex flex-col min-h-[750px]">
            {/* Browser Header address bar mockup */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-3 select-none">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex-1 bg-white border border-slate-200 text-slate-400 text-xs py-1.5 px-4 rounded-xl flex items-center justify-between font-medium max-w-xl mx-auto shadow-sm">
                <span className="truncate flex items-center gap-1.5 text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  https://trc-guesthouse.android-emulation.local/registrations
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            
            {/* The actual application tree inside the responsive viewport */}
            <div className="flex-1 overflow-y-auto bg-slate-50 relative">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
