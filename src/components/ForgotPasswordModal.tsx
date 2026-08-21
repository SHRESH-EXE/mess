import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldAlert,
  PhoneCall,
  Mail,
  Building2,
  CheckCircle2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="forgot-password-modal"
        className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <KeyRound className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 leading-tight">
                Account Recovery & Credentials Help
              </h3>
              <p className="text-xs text-slate-400">
                CampusMess Hub Identity & Access Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-4 border-b border-slate-800 flex space-x-4">
          <button
            type="button"
            onClick={() => setRoleTab('student')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              roleTab === 'student'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Hosteler Help
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('admin')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              roleTab === 'admin'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mess Staff & Warden Help
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {roleTab === 'student' ? (
            <>
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Hostel Default Credentials Policy</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  For this campus demo prototype, your default student password is configured as your <strong>Hostel Room Number</strong> (e.g. <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700">B-312</code>) or the universal test password <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700">student123</code>.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">
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
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-100">{stu.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Roll: <strong className="text-amber-400">{stu.roll}</strong> • Room: <strong className="text-slate-200">{stu.room}</strong>
                        </div>
                        <div className="text-[10px] text-slate-500">{stu.dept}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(stu.roll, stu.roll)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                        >
                          {copiedText === stu.roll ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors shadow-xs"
                          >
                            Autofill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="font-bold text-slate-200">Physical In-Person Verification</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-200">Hostel Caretaker Office</div>
                      <div className="text-[10px] text-slate-400">Block-B Ground Floor, Room 102 (09:00 AM - 06:00 PM)</div>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2">
                    <PhoneCall className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-200">Mess Council Helpline</div>
                      <div className="text-[10px] text-slate-400">+91 98765 43210 / Ext 402</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Mess Management Authority Access</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mess Committee Wardens and Kitchen Operations Leads have provisioned institutional accounts. For demonstration purposes, use the credentials below.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">
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
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-100">{adm.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: <strong className="text-amber-400">{adm.id}</strong> • Pass: <strong className="text-slate-200">{adm.pass}</strong>
                        </div>
                        <div className="text-[10px] text-slate-500">{adm.role}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {onSelectDemoAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDemoAdmin(adm.id, adm.pass);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors shadow-xs"
                          >
                            Autofill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Need new staff permissions? Email <strong>mess-council@campus.edu</strong> with department authorization letter.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
