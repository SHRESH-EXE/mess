import React, { useState } from 'react';
import { useDeviceSpecs } from '../hooks/useDeviceSpecs';
import { PerformanceMode } from '../utils/deviceAdapter';
import {
  Zap,
  BatteryCharging,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Cpu,
  Activity,
  Layers,
  Check,
  X
} from 'lucide-react';

export const DeviceSpecBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { specs, setPerformanceMode } = useDeviceSpecs();
  const [isOpen, setIsOpen] = useState(false);

  const getTierIcon = () => {
    if (specs.activeMode === 'battery_saver' || specs.effectiveTier === 'low') {
      return <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />;
    }
    if (specs.activeMode === 'ultra') {
      return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
    return <Zap className="w-3.5 h-3.5 text-orange-500" />;
  };

  const getDeviceIcon = () => {
    if (specs.screenType === 'phone') return <Smartphone className="w-3.5 h-3.5 text-slate-600" />;
    if (specs.screenType === 'tablet') return <Tablet className="w-3.5 h-3.5 text-slate-600" />;
    return <Monitor className="w-3.5 h-3.5 text-slate-600" />;
  };

  const getModeLabel = () => {
    if (specs.activeMode === 'battery_saver') return 'Eco Mode';
    if (specs.activeMode === 'ultra') return 'Ultra Visuals';
    return specs.effectiveTier === 'low' ? 'Low-Spec Mode' : '60 FPS Adaptive';
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="View Device Hardware Specs & Performance Tuning"
        className={`flex items-center space-x-1.5 rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
          specs.effectiveTier === 'low'
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800'
            : 'bg-white/80 backdrop-blur-md border-orange-200/80 text-slate-700 hover:text-slate-950'
        } ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px]'} font-bold shadow-xs`}
      >
        {getTierIcon()}
        <span className="hidden xs:inline-block capitalize font-mono text-[10px] sm:text-[11px]">
          {getModeLabel()}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop dismissal */}
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal / Popover */}
          <div className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-2 z-50 w-[90vw] max-w-[340px] sm:w-80 rounded-3xl bg-white/95 backdrop-blur-2xl border border-orange-200/90 shadow-2xl p-4 sm:p-5 text-left animate-[fadeIn_0.15s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    Device Portability &amp; Specs
                  </h4>
                  <p className="text-[10px] text-slate-500">Hardware &amp; Performance Tuning</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hardware Telemetry Grid */}
            <div className="my-3 p-3 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  {getDeviceIcon()}
                  <span>Device Form Factor:</span>
                </span>
                <span className="font-bold text-slate-900 capitalize">
                  {specs.screenType} ({specs.screenWidth}×{specs.screenHeight})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-600" />
                  <span>CPU Cores:</span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {specs.cpuCores} Cores
                </span>
              </div>

              {specs.deviceMemoryGb && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    <span>Device RAM:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    ~{specs.deviceMemoryGb} GB
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-slate-600" />
                  <span>Hardware Tier:</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono ${
                  specs.effectiveTier === 'low'
                    ? 'bg-emerald-100 text-emerald-800'
                    : specs.effectiveTier === 'high'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {specs.effectiveTier} Spec
                </span>
              </div>
            </div>

            {/* Performance Mode Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">Performance Profile:</span>
              
              <button
                type="button"
                onClick={() => setPerformanceMode('auto')}
                className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  specs.activeMode === 'auto'
                    ? 'bg-orange-50 border-orange-400 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      ⚡ Smart Adaptive (Default)
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Auto-tunes animations &amp; blurs for your screen
                    </div>
                  </div>
                </div>
                {specs.activeMode === 'auto' && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setPerformanceMode('battery_saver')}
                className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  specs.activeMode === 'battery_saver'
                    ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      🔋 Eco / Low-Spec Mode
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Smooth 60fps on potato phones &amp; save battery
                    </div>
                  </div>
                </div>
                {specs.activeMode === 'battery_saver' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setPerformanceMode('ultra')}
                className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  specs.activeMode === 'ultra'
                    ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      ✨ Ultra Visuals
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Full glassmorphism &amp; drifting ambient liquid
                    </div>
                  </div>
                </div>
                {specs.activeMode === 'ultra' && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
