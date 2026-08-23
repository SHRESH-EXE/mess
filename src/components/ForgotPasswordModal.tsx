import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/25 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="forgot-password-modal"
        className="w-full max-w-lg glassmorphism-card text-[#2e170d] rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/40 backdrop-blur-lg border-b border-orange-200/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white font-bold shadow-md shadow-orange-500/20">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2e170d] leading-tight">
                Account Recovery & Credentials Help
              </h3>
              <p className="text-xs text-[#9a3412] font-semibold">
                CampusMess Hub Identity & Access Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9a3412] hover:text-[#2e170d] hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 border-b border-orange-200/60 flex space-x-4 bg-white/25">
          <button
            type="button"
            onClick={() => setRoleTab('student')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              roleTab === 'student'
                ? 'border-[#ff7a30] text-[#ea580c]'
                : 'border-transparent text-[#9a3412]/80 hover:text-[#ea580c]'
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
                : 'border-transparent text-[#9a3412]/80 hover:text-[#ea580c]'
            }`}
          >
            Mess Staff & Warden Help
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {roleTab === 'student' ? (
            <>
              <div className="p-3.5 bg-orange-500/10 border border-orange-400/30 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#ea580c] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#ff7a30]" />
                  <span>Hostel Default Credentials Policy</span>
                </div>
                <p className="text-[#6c2e11] leading-relaxed font-medium">
                  For this campus demo prototype, your default student password is configured as your <strong>Hostel Room Number</strong> (e.g. <code className="bg-white/60 px-1.5 py-0.5 rounded text-[#ea580c] border border-orange-200 font-bold">B-312</code>) or the universal test password <code className="bg-white/60 px-1.5 py-0.5 rounded text-[#ea580c] border border-orange-200 font-bold">student123</code>.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-[#2e170d] text-xs uppercase tracking-wider">
                  Available Student Demo Accounts
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'Aarav Sharma', roll: '22CS0142', room: 'B-312', dept: 'CS Dept, Aryabhatta' },
                    { name: 'Priya Patel', roll: '23EE0089', room: 'A-204', dept: 'EE Dept, Gargi Girls' },
                    { name: 'Rohan Verma', roll: '21ME0310', room: 'C-108', dept: 'Mech Dept, CV Raman' }
                  ].map((stu) => (
                    <div
                      key={stu.roll}
                      className="p-3 bg-white/50 rounded-2xl border border-white/80 flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <div className="font-bold text-[#2e170d]">{stu.name}</div>
                        <div className="text-[11px] text-[#9a3412] font-mono font-medium">
                          Roll: <strong className="text-[#ea580c]">{stu.roll}</strong> • Room: <strong className="text-[#2e170d]">{stu.room}</strong>
                        </div>
                        <div className="text-[10px] text-[#9a3412]/80">{stu.dept}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(stu.roll, stu.roll)}
                          className="px-2.5 py-1.5 bg-white/60 hover:bg-white/90 text-[#6c2e11] rounded-xl text-[11px] font-bold flex items-center gap-1 border border-orange-200 transition-colors cursor-pointer"
                        >
                          {copiedText === stu.roll ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>Copy</span>
                        </button>
                        {onSelectDemoStudent && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDemoStudent(stu.roll, stu.room);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold rounded-xl text-[11px] transition-all shadow-xs cursor-pointer"
                          >
                            Autofill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-orange-200/60">
                <div className="font-bold text-[#2e170d]">Physical In-Person Verification</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white/45 rounded-xl border border-white/70 flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-[#ea580c] mt-0.5" />
                    <div>
                      <div className="font-bold text-[#2e170d]">Hostel Caretaker Office</div>
                      <div className="text-[10px] text-[#9a3412]">Block-B Ground Floor, Room 102 (09:00 AM - 06:00 PM)</div>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white/45 rounded-xl border border-white/70 flex items-start space-x-2">
                    <PhoneCall className="w-4 h-4 text-[#ea580c] mt-0.5" />
                    <div>
                      <div className="font-bold text-[#2e170d]">Mess Council Helpline</div>
                      <div className="text-[10px] text-[#9a3412]">+91 98765 43210 / Ext 402</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 bg-orange-500/10 border border-orange-400/30 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#ea580c] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#ff7a30]" />
                  <span>Mess Management Authority Access</span>
                </div>
                <p className="text-[#6c2e11] leading-relaxed font-medium">
                  Mess Committee Wardens and Kitchen Operations Leads have provisioned institutional accounts. For demonstration purposes, use the credentials below.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-[#2e170d] text-xs uppercase tracking-wider">
                  Admin Demo Credentials
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      name: 'Dr. K. S. Rajan (Chief Warden)',
                      id: 'admin@campus.edu',
                      pass: 'admin123',
                      role: 'Chief Hostel Mess Warden'
                    },
                    {
                      name: 'Master Chef Suresh Nair',
                      id: 'chef@campus.edu',
                      pass: 'admin123',
                      role: 'Kitchen Operations Lead'
                    }
                  ].map((adm) => (
                    <div
                      key={adm.id}
                      className="p-3 bg-white/50 rounded-2xl border border-white/80 flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <div className="font-bold text-[#2e170d]">{adm.name}</div>
                        <div className="text-[11px] text-[#9a3412] font-mono font-medium">
                          ID: <strong className="text-[#ea580c]">{adm.id}</strong> • Pass: <strong className="text-[#2e170d]">{adm.pass}</strong>
                        </div>
                        <div className="text-[10px] text-[#9a3412]/80">{adm.role}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {onSelectDemoAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDemoAdmin(adm.id, adm.pass);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold rounded-xl text-[11px] transition-all shadow-xs cursor-pointer"
                          >
                            Autofill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/45 rounded-xl border border-white/70 text-[11px] text-[#6c2e11] flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>Need new staff permissions? Email <strong className="text-[#2e170d]">mess-council@campus.edu</strong> with department authorization letter.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/40 border-t border-orange-200/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-white/70 hover:bg-white text-[#2e170d] border border-orange-200 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
