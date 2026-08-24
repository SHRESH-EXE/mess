import React, { useState } from 'react';
import ChromeButton from './ui/chrome-button';
import {
  X,
  KeyRound,
  ShieldAlert,
  PhoneCall,
  Mail,
  Building2,
  Copy,
  Check
} from 'lucide-react';

interface ForgotPasswordModalProps {
  initialRole?: 'student' | 'admin';
  onClose: () => void;
  onSelectDemoStudent?: (rollNo: string, roomNo: string) => void;
  onSelectDemoAdmin?: (email: string, pass: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  initialRole = 'student',
  onClose,
  onSelectDemoStudent,
  onSelectDemoAdmin
}) => {
  const [roleTab, setRoleTab] = useState<'student' | 'admin'>(initialRole);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="forgot-password-modal"
        className="w-full max-w-lg glassmorphism-card text-slate-900 rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white font-bold shadow-md shadow-orange-500/25">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Account Recovery &amp; Credentials Help
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                CampusMess Hub Identity &amp; Access Service
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

        {/* Tab Toggle */}
        <div className="px-6 pt-3 border-b border-orange-200/70 flex space-x-4 bg-orange-50/50">
          <button
            type="button"
            onClick={() => setRoleTab('student')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              roleTab === 'student'
                ? 'border-[#ff7a30] text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Hosteler Help
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('admin')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              roleTab === 'admin'
                ? 'border-[#ff7a30] text-[#ea580c]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Mess Staff &amp; Warden Help
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {roleTab === 'student' ? (
            <>
              <div className="p-3.5 bg-orange-100/70 border border-orange-200 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#c2410c] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#ea580c]" />
                  <span>Hostel Default Credentials Policy</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  For this campus demo prototype, your default student password is configured as your <strong>Hostel Room Number</strong> (e.g. <code className="bg-white px-1.5 py-0.5 rounded text-[#ea580c] border border-orange-300 font-bold">B-312</code>) or the universal test password <code className="bg-white px-1.5 py-0.5 rounded text-[#ea580c] border border-orange-300 font-bold">student123</code>.
                </p>
              </div>

              {/* Sample student cards to autofill */}
              <div className="space-y-2">
                <span className="font-black text-slate-900 text-xs block">
                  Quick Select Active Demo Students:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Aarav Sharma</div>
                      <div className="text-[11px] text-slate-600 font-mono font-bold">Roll: 22CS0142</div>
                      <div className="text-[11px] text-slate-600">Room: B-312 (Boys Hostel 4)</div>
                    </div>
                    {onSelectDemoStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoStudent('22CS0142', 'B-312');
                          onClose();
                        }}
                        className="mt-2 text-left text-[11px] font-bold text-[#ea580c] hover:underline"
                      >
                        Use this account &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Priya Patel</div>
                      <div className="text-[11px] text-slate-600 font-mono font-bold">Roll: 23ME0088</div>
                      <div className="text-[11px] text-slate-600">Room: G-104 (Girls Hostel 2)</div>
                    </div>
                    {onSelectDemoStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoStudent('23ME0088', 'G-104');
                          onClose();
                        }}
                        className="mt-2 text-left text-[11px] font-bold text-[#ea580c] hover:underline"
                      >
                        Use this account &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-orange-200 space-y-2">
                <span className="font-bold text-slate-900 block">Hostel Helpdesk Contact:</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="w-4 h-4 text-[#ea580c]" />
                    <span className="font-mono text-slate-800 font-bold">+91 9335568951</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('+91 9335568951', 'phone')}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    {copiedText === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 bg-amber-100/70 border border-amber-300 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Mess Authority Staff Portal Access</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Mess Wardens and Catering Officers can sign in with their administrative email or the quick demo manager credentials.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-orange-200 space-y-2">
                <div className="font-black text-slate-900">Quick Admin Demo Credentials:</div>
                <div className="font-mono text-[11px] text-slate-700 space-y-1 bg-orange-50/70 p-2.5 rounded-xl border border-orange-200">
                  <div><strong>Email:</strong> admin@campus.edu</div>
                  <div><strong>Password:</strong> admin123</div>
                </div>
                {onSelectDemoAdmin && (
                  <ChromeButton
                    type="button"
                    onClick={() => {
                      onSelectDemoAdmin('admin@campus.edu', 'admin123');
                      onClose();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    Fill Admin Credentials
                  </ChromeButton>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
