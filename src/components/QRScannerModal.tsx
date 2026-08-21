import React, { useState, useEffect } from 'react';
import { useMess } from '../context/MessContext';
import {
  QrCode,
  X,
  Camera,
  Flashlight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MealType, StudentProfile } from '../types/mess';
import { getActiveMealStatus } from '../utils/time';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const {
    students,
    currentStudent,
    markMealAttendance,
    isMealTakenToday,
    todayCounts
  } = useMess();

  const mealStatus = getActiveMealStatus();
  const [selectedMeal, setSelectedMeal] = useState<MealType>(mealStatus.currentMeal);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [manualRollInput, setManualRollInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    student?: StudentProfile;
    timestamp?: string;
  }>({ status: 'idle', message: '' });

  // Reset scan state on meal change
  const handleMealChange = (meal: MealType) => {
    setSelectedMeal(meal);
    setScanResult({ status: 'idle', message: '' });
  };

  // Perform Scan on a given student
  const handleExecuteScan = (targetStudent: StudentProfile) => {
    setIsScanning(false);
    const result = markMealAttendance(selectedMeal, targetStudent.id, 'qr_scanner');

    if (result.success) {
      setScanResult({
        status: 'success',
        message: result.message,
        student: targetStudent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      setScanResult({
        status: 'error',
        message: result.message,
        student: targetStudent
      });
    }

    // Auto resume scanner after 3.5 seconds
    setTimeout(() => {
      setIsScanning(true);
    }, 3500);
  };

  // Handle Manual Roll Search & Check-in
  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRollInput.trim()) return;

    const matched = students.find(
      s => s.rollNo.toLowerCase() === manualRollInput.trim().toLowerCase() ||
           s.name.toLowerCase().includes(manualRollInput.trim().toLowerCase())
    );

    if (matched) {
      handleExecuteScan(matched);
      setManualRollInput('');
    } else {
      setScanResult({
        status: 'error',
        message: `No active student found matching "${manualRollInput}". Please check roll number.`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="qr-scanner-modal"
        className="w-full max-w-lg bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Mess Entry QR Scanner</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  LIVE GATE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Point student token or tap to simulate mess dining check-in
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Slot Picker Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/30 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Meal Session to Mark:
            </span>
            <span className="text-[11px] text-amber-400 font-medium">
              Eaten Today: {todayCounts[selectedMeal]} meals
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((meal) => {
              const isCurrent = selectedMeal === meal;
              const isOngoing = mealStatus.currentMeal === meal && mealStatus.status === 'ongoing';
              return (
                <button
                  key={meal}
                  onClick={() => handleMealChange(meal)}
                  className={`relative py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isOngoing && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  <span>{meal}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewfinder Camera Simulation */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="relative aspect-4/3 w-full max-w-sm mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner flex items-center justify-center">
            
            {/* Camera Viewfinder Corners */}
            <div className="absolute inset-4 pointer-events-none border-2 border-transparent">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
            </div>

            {/* Laser Line Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce duration-1000" />
            )}

            {/* Viewfinder Center Overlay */}
            <div className="text-center p-4 z-10 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300">
                <Camera className={`w-8 h-8 ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              </div>
              <div className="text-xs font-mono text-slate-400">
                {isScanning ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 animate-spin" /> Scanner Ready • Detecting Digital ID
                  </span>
                ) : (
                  <span className="text-slate-300">Processing verification...</span>
                )}
              </div>
            </div>

            {/* Flashlight Overlay Simulation */}
            {flashlightOn && (
              <div className="absolute inset-0 bg-white/10 pointer-events-none backdrop-brightness-125" />
            )}

            {/* Scanner Controls Floating */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1.5 z-20">
              <button
                type="button"
                onClick={() => setFlashlightOn(!flashlightOn)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  flashlightOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle Torch"
              >
                <Flashlight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scan Result Feedback Banner */}
          {scanResult.status !== 'idle' && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-3 animate-in slide-in-from-top-2 duration-150 ${
                scanResult.status === 'success'
                  ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200'
                  : 'bg-red-950/80 border-red-700/80 text-red-200'
              }`}
            >
              {scanResult.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-0.5 flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>{scanResult.status === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED / DUPLICATE'}</span>
                  {scanResult.timestamp && <span className="font-mono text-[10px] text-emerald-300">{scanResult.timestamp}</span>}
                </div>
                <p className="opacity-90">{scanResult.message}</p>
                {scanResult.student && (
                  <div className="pt-1 font-mono text-[11px] text-slate-300">
                    Hostel: {scanResult.student.hostel} | Plan: {scanResult.student.planName}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Simulation Buttons: Scan Current Active Student or Pick Registered Student */}
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Scan for Registered Hosteler:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-Tap Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {students.map((stu) => {
                const check = isMealTakenToday(selectedMeal, stu.id);
                const isSelectedStudent = currentStudent.id === stu.id;
                return (
                  <button
                    key={stu.id}
                    onClick={() => handleExecuteScan(stu)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      check.isTaken
                        ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-70'
                        : isSelectedStudent
                        ? 'bg-amber-500/10 border-amber-500/40 text-slate-200 hover:bg-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold truncate text-white">{stu.name}</span>
                      {check.isTaken ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          EATEN
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          READY
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {stu.rollNo} • {stu.roomNo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Roll Number Entry Form for Mess Staff */}
          <form onSubmit={handleManualCheckIn} className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={manualRollInput}
              onChange={(e) => setManualRollInput(e.target.value)}
              placeholder="Or enter Roll Number / Name manually (e.g. 22CS0142)..."
              className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              Verify Entry
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Duplicate Token & Active Meal Plan Guard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
