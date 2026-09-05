import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Apple, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  if (isInstalled || !showBanner) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={install}
          title="Install LPU Dining App"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-100">Get LPU Dining App</p>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold">Offline Ready</span>
            </div>
            <p className="text-[11px] text-slate-400">Install to your home screen for 1-tap ordering & live meal tokens</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition active:scale-95 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-md transition"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-semibold text-xs transition"
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Apple className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-slate-100">Install on iPhone / iPad</p>
                <p className="text-[11px] text-slate-400">Add to Home Screen for the full app experience</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition"
            >
              How to Install
            </button>
          </div>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                    <Apple className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">Install on iOS Safari</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">1</span>
                  <p>Tap the <strong>Share</strong> button <span className="text-amber-400">(box with upward arrow)</span> at the bottom bar of Safari.</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">2</span>
                  <p>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">3</span>
                  <p>Tap <strong>Add</strong> at top right. The LPU Dining App will appear on your home screen!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition active:scale-95"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
