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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/25 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="switch-student-modal"
        className="w-full max-w-md glassmorphism-card text-[#2e170d] rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/40 border-b border-orange-200/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2e170d] leading-tight">
              Student Profile Switcher
            </h3>
            <p className="text-xs text-[#9a3412] font-medium">
              Enter Roll Number in the text box below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9a3412] hover:text-[#2e170d] hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Active Info */}
          <div className="p-3.5 rounded-2xl bg-white/55 border border-white/80 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#9a3412] text-[10px] block font-semibold">Current Active Roll:</span>
                <span className="font-mono font-bold text-[#2e170d]">{currentStudent.rollNo}</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
              Active
            </span>
          </div>

          {/* Text Box Input Form */}
          <form onSubmit={handleSearchAndSwitch} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2e170d]">
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
                  className="w-full glassmorphism-input rounded-xl px-4 py-3 text-xs text-[#2e170d] placeholder-[#c2410c]/50 font-mono focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/40 text-red-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl shadow-[0_4px_16px_rgba(255,122,48,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Switch Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Demo Roll Numbers */}
          <div className="space-y-2 pt-2 border-t border-orange-200/60">
            <span className="text-[11px] font-bold text-[#9a3412] uppercase tracking-wider block">
              Quick Pick Demo Students
            </span>
            <div className="grid grid-cols-2 gap-2">
              {students.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    switchStudentById(s.id);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                    currentStudent.id === s.id
                      ? 'bg-orange-500/15 border-orange-400 text-[#ea580c]'
                      : 'bg-white/45 hover:bg-white/70 border-white/80 text-[#2e170d]'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{s.name}</div>
                  <div className="text-[10px] font-mono text-[#9a3412] font-semibold">{s.rollNo}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
