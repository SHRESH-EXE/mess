import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import ChromeButton from './ui/chrome-button';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="switch-student-modal"
        className="w-full max-w-md glassmorphism-card text-slate-900 rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-orange-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              Student Profile Switcher
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              Enter Roll Number in the text box below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Active Info */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-orange-200/80 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-slate-600 text-[10px] block font-bold">Current Active Roll:</span>
                <span className="font-mono font-black text-slate-900">{currentStudent.rollNo}</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
              Active
            </span>
          </div>

          {/* Text Box Input Form */}
          <form onSubmit={handleSearchAndSwitch} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900">
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
                  className="w-full glassmorphism-input rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-emerald-50/90 backdrop-blur-md border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <ChromeButton
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Switch Active Student</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </ChromeButton>
          </form>

          {/* Quick List of Demo Students */}
          <div className="space-y-2 pt-2 border-t border-orange-200/80">
            <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Or Select From Available Profiles:
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {students.map((student) => {
                const isSelected = student.id === currentStudent.id;
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      switchStudentById(student.id);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-100 border-orange-400 text-slate-900'
                        : 'bg-white/80 hover:bg-white border-orange-200/80 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-7 h-7 rounded-full object-cover border border-orange-300"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900 leading-tight">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          {student.rollNo} • {student.hostel} ({student.roomNo})
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#ea580c]">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
