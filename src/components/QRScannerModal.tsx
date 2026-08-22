import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  QrCode,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { MealType, StudentProfile } from '../types/mess';
import { getActiveMealStatus } from '../utils/time';
import { MobileQRScanner } from './MobileQRScanner';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const {
    students,
    markMealAttendance
  } = useMess();

  const mealStatus = getActiveMealStatus();
  const [selectedMeal, setSelectedMeal] = useState<MealType>(mealStatus.currentMeal);
  const [manualInput, setManualInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    decodedText?: string;
    student?: StudentProfile;
    timestamp?: string;
  }>({ status: 'idle', message: '' });

  // Handle Meal change
  const handleMealChange = (meal: MealType) => {
    setSelectedMeal(meal);
    setScanResult({ status: 'idle', message: '' });
  };

  // Perform Scan on a matched student or raw token
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

  // Handle Camera Scan callback
  const handleLiveCameraScan = (decodedText: string) => {
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
      // not json
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
      handleExecuteScan(matchedStudent);
    } else {
      setScanResult({
        status: 'success',
        message: `Verified code: "${decodedText}"`,
        decodedText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  // Handle Manual Text Box Form Submission
  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    handleLiveCameraScan(manualInput.trim());
    setManualInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div
        id="qr-scanner-modal"
        className="w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                QR Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Scan pass QR or enter token below
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

        {/* Meal Session Selector */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Meal:
          </span>
          <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-xs">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((meal) => {
              const isCurrent = selectedMeal === meal;
              return (
                <button
                  key={meal}
                  onClick={() => handleMealChange(meal)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer text-center ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {meal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Result Banner */}
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
                  <span>{scanResult.status === 'success' ? 'ACCESS GRANTED' : 'ENTRY BLOCKED'}</span>
                  {scanResult.timestamp && (
                    <span className="font-mono text-[10px] text-emerald-300">{scanResult.timestamp}</span>
                  )}
                </div>
                <p className="opacity-90 leading-relaxed">{scanResult.message}</p>
                {scanResult.decodedText && (
                  <div className="pt-1 font-mono text-[11px] text-emerald-300 bg-slate-900/60 p-2 rounded-lg break-all">
                    {scanResult.decodedText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Camera & Text Box Scanner */}
          <MobileQRScanner
            title="Scan QR Code"
            description="Align QR code inside box or type code below"
            onScanSuccess={handleLiveCameraScan}
            allowDesktopOverride={true}
          />

          {/* Direct Text Box for Manual Roll / Code Entry */}
          <form onSubmit={handleManualCheckIn} className="space-y-1.5 pt-1">
            <label className="text-[11px] font-semibold text-slate-300 block">
              Quick Text Box:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Type Roll No or Pass Token..."
                className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Duplicate QR Token Check</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
