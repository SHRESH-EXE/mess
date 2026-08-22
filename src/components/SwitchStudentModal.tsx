import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { X, Search, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

interface SwitchStudentModalProps {
  onClose: () => void;
}

export const SwitchStudentModal: React.FC<SwitchStudentModalProps> = ({ onClose }) => {
  const { students, currentStudent, switchStudentById } = useMess();
  const [rollInput, setRollInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearchAndSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) return;

    const query = rollInput.trim().toLowerCase();
    const matched = students.find(
      (s) =>
        s.rollNo.toLowerCase() === query ||
        s.id.toLowerCase() === query ||
        s.roomNo.toLowerCase() === query
    );

    if (matched) {
      switchStudentById(matched.id);
      onClose();
    } else {
      setErrorMsg(`No student profile found with Roll No / ID "${rollInput}". Please check the text box.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="switch-student-modal"
        className="w-full max-w-md bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 leading-tight">
              Student Profile Switcher
            </h3>
            <p className="text-xs text-slate-400">
              Enter Roll Number in the text box below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Active Info */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Current Active Roll:</span>
                <span className="font-mono font-bold text-slate-100">{currentStudent.rollNo}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              Active
            </span>
          </div>

          {/* Text Box Input Form */}
          <form onSubmit={handleSearchAndSwitch} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Enter Roll Number / Student ID:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rollInput}
                  onChange={(e) => {
                    setRollInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="e.g. 22CS0142, 23ME0088..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-hidden"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Switch Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
