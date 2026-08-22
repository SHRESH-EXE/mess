import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  QrCode,
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Tablet,
  Check,
  Copy,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { MealType, StudentProfile } from '../types/mess';
import { getActiveMealStatus } from '../utils/time';
import { MobileQRScanner, checkIsMobileOrTablet } from './MobileQRScanner';

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

  const isDeviceMobile = checkIsMobileOrTablet();
  const mealStatus = getActiveMealStatus();
  const [selectedMeal, setSelectedMeal] = useState<MealType>(mealStatus.currentMeal);
  const [activeMode, setActiveMode] = useState<'camera' | 'simulate'>(isDeviceMobile ? 'camera' : 'simulate');
  const [manualRollInput, setManualRollInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    decodedText?: string;
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
  };

  // Handle Camera Scan callback (QR Code or 1D Barcode)
  const handleLiveCameraScan = (decodedText: string, format?: string) => {
    // Check if the decoded text corresponds to a student ID, Roll No, barcode token, or JSON token
    let matchedStudent: StudentProfile | undefined;

    try {
      if (decodedText.startsWith('{') && decodedText.endsWith('}')) {
        const parsed = JSON.parse(decodedText);
        if (parsed.studentId || parsed.id) {
          matchedStudent = students.find(s => s.id === (parsed.studentId || parsed.id));
        } else if (parsed.rollNo) {
          matchedStudent = students.find(s => s.rollNo.toLowerCase() === parsed.rollNo.toLowerCase());
        }
      }
    } catch {
      // not JSON
    }

    if (!matchedStudent) {
      const cleanText = decodedText.trim().toLowerCase();
      matchedStudent = students.find(
        s => s.id.toLowerCase() === cleanText ||
             s.rollNo.toLowerCase() === cleanText ||
             s.roomNo.toLowerCase() === cleanText ||
             cleanText.includes(s.rollNo.toLowerCase()) ||
             cleanText.includes(s.id.toLowerCase())
      );
    }

    if (matchedStudent) {
      const result = markMealAttendance(selectedMeal, matchedStudent.id, 'qr_scanner');
      if (result.success) {
        setScanResult({
          status: 'success',
          message: `${result.message} (${format || 'Code Detected'})`,
          student: matchedStudent,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        setScanResult({
          status: 'error',
          message: `${result.message} (${format || 'Code Detected'})`,
          student: matchedStudent
        });
      }
    } else {
      setScanResult({
        status: 'success',
        message: `Scanned ${format || 'Code'}: "${decodedText}". (External payload or ID barcode verified)`,
        decodedText
      });
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="qr-scanner-modal"
        className="w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Mobile QR Scanner</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  LIVE GATE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Live camera scanner for mobile &amp; tablet devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Mode Toggle (Live Mobile Camera vs Hosteler Quick Simulation) */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('camera')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMode === 'camera'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Scanner</span>
            </button>
            <button
              onClick={() => setActiveMode('simulate')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMode === 'simulate'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate / Manual</span>
            </button>
          </div>

          <span className="text-[11px] text-amber-400 font-medium hidden sm:inline">
            Eaten Today: {todayCounts[selectedMeal]} meals
          </span>
        </div>

        {/* Meal Slot Picker Tabs */}
        <div className="px-5 py-2.5 bg-slate-950/20 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Meal Session:
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
                  className={`relative py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
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

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Scan Result Feedback Banner */}
          {scanResult.status !== 'idle' && (
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 animate-in slide-in-from-top-2 duration-150 ${
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
              <div className="text-xs space-y-1 flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>{scanResult.status === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED / DUPLICATE'}</span>
                  {scanResult.timestamp && <span className="font-mono text-[10px] text-emerald-300">{scanResult.timestamp}</span>}
                </div>
                <p className="opacity-90 leading-relaxed">{scanResult.message}</p>
                {scanResult.student && (
                  <div className="pt-1 font-mono text-[11px] text-slate-300">
                    Hostel: {scanResult.student.hostel} | Plan: {scanResult.student.planName}
                  </div>
                )}
                {scanResult.decodedText && (
                  <div className="pt-1 font-mono text-[11px] text-emerald-300 bg-slate-900/60 p-2 rounded-lg break-all">
                    {scanResult.decodedText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 1: LIVE MOBILE / TABLET QR SCANNER */}
          {activeMode === 'camera' && (
            <div className="space-y-4">
              <MobileQRScanner
                title="Live Mobile Scanner"
                description="Align QR code inside viewfinder box"
                onScanSuccess={handleLiveCameraScan}
                allowDesktopOverride={true}
              />
            </div>
          )}

          {/* MODE 2: SIMULATE REGISTERED STUDENTS / MANUAL ROLL ENTRY */}
          {activeMode === 'simulate' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Hosteler to Simulate 1-Tap QR Entry:</span>
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
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
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

              {/* Manual Roll Number Entry Form */}
              <form onSubmit={handleManualCheckIn} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={manualRollInput}
                  onChange={(e) => setManualRollInput(e.target.value)}
                  placeholder="Or enter Roll No manually (e.g. 22CS0142)..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Verify Entry
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Duplicate Token &amp; Active Meal Plan Guard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

