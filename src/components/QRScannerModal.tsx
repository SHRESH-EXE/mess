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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div
        id="qr-scanner-modal"
        className="w-full max-w-md glassmorphism-card text-slate-900 rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-orange-200/80 flex items-center justify-between bg-white/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white shadow-xs">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                QR Scanner
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                Scan pass QR or enter token below
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Session Selector */}
        <div className="px-5 py-2.5 bg-orange-50/60 border-b border-orange-200/80 flex items-center justify-between gap-1.5">
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
            Meal:
          </span>
          <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-xs">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((meal) => {
              const isCurrent = selectedMeal === meal;
              return (
                <button
                  key={meal}
                  onClick={() => handleMealChange(meal)}
                  className={`py-1.5 px-2 rounded-xl text-xs capitalize transition-all cursor-pointer text-center font-black ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-xs'
                      : 'bg-white/90 text-slate-700 hover:bg-white border border-orange-200/70'
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
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              }`}
            >
              {scanResult.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1 flex-1">
                <div className="font-black flex items-center justify-between">
                  <span>{scanResult.status === 'success' ? 'ACCESS GRANTED' : 'ENTRY BLOCKED'}</span>
                  {scanResult.timestamp && (
                    <span className="font-mono text-[10px] text-emerald-800 font-bold">{scanResult.timestamp}</span>
                  )}
                </div>
                <p className="font-bold leading-relaxed">{scanResult.message}</p>
                {scanResult.decodedText && (
                  <div className="pt-1 font-mono text-[11px] text-emerald-900 bg-white p-2 rounded-lg break-all font-bold border border-emerald-200">
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
            <label className="text-[11px] font-black text-slate-900 block">
              Quick Text Box:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Type Roll No or Pass Token..."
                className="flex-1 glassmorphism-input text-xs px-3.5 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Verify</span>
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-orange-200/80 bg-orange-50/50 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800">Anti-Duplicate QR Token Check</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl border border-orange-200 shadow-xs transition-all cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
