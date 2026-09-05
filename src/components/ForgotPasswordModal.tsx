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
  Check,
  Store,
  UtensilsCrossed,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface ForgotPasswordModalProps {
  initialRole?: 'student' | 'admin' | 'vendor' | 'restaurant';
  onClose: () => void;
  onSelectDemoStudent?: (rollNo: string, roomNo: string) => void;
  onSelectDemoAdmin?: (email: string, pass: string) => void;
  onSelectDemoVendor?: (stallIdOrEmail: string, pass: string) => void;
  onSelectDemoRestaurant?: (restoId: string, pass: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  initialRole = 'student',
  onClose,
  onSelectDemoStudent,
  onSelectDemoAdmin,
  onSelectDemoVendor,
  onSelectDemoRestaurant
}) => {
  const [roleTab, setRoleTab] = useState<'student' | 'admin' | 'vendor' | 'restaurant'>(initialRole);
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
        className="w-full max-w-xl glassmorphism-card text-slate-900 rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col max-h-[90vh]"
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
                Campus Mess, Food Court &amp; Restro Partner Identity Access
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
        <div className="px-4 pt-3 border-b border-orange-200/70 grid grid-cols-4 gap-1 bg-orange-50/50">
          <button
            type="button"
            onClick={() => setRoleTab('student')}
            className={`pb-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              roleTab === 'student'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="truncate">Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('admin')}
            className={`pb-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              roleTab === 'admin'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="truncate">Warden</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('vendor')}
            className={`pb-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              roleTab === 'vendor'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="truncate">Food Court</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('restaurant')}
            className={`pb-2.5 text-[11px] sm:text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              roleTab === 'restaurant'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="truncate">Restros</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {roleTab === 'student' ? (
            <>
              <div className="p-3.5 bg-orange-100/70 border border-orange-200 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#c2410c] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#ea580c]" />
                  <span>Student Hosteler Login Help</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Hostel students can sign in using their registered <strong>Registration / Roll Number</strong> and <strong>Hostel Room Number</strong> as password.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-black text-slate-900 text-xs block">
                  Quick Select Active Demo Students:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Aryan Sharma</div>
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
                        className="mt-2 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Aryan &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Sneha Patel</div>
                      <div className="text-[11px] text-slate-600 font-mono font-bold">Roll: 22EC0089</div>
                      <div className="text-[11px] text-slate-600">Room: G-104 (Girls Hostel 2)</div>
                    </div>
                    {onSelectDemoStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoStudent('22EC0089', 'G-104');
                          onClose();
                        }}
                        className="mt-2 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Sneha &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : roleTab === 'admin' ? (
            <>
              <div className="p-3.5 bg-orange-100/70 border border-orange-200 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#c2410c] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
                  <span>Mess Warden &amp; Admin Authority</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Authorised Wardens and Mess Managers have access to headcounts, attendance tracking, dietary analytics and announcements.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-orange-200/80 space-y-2.5">
                <div className="font-bold text-slate-900">Demo Admin Access:</div>
                <div className="text-[11px] font-mono text-slate-700 bg-orange-50/70 p-2.5 rounded-xl border border-orange-200/60">
                  Email: <strong>admin@campus.edu</strong> | Password: <strong>admin123</strong>
                </div>
                {onSelectDemoAdmin && (
                  <ChromeButton
                    type="button"
                    onClick={() => {
                      onSelectDemoAdmin('admin@campus.edu', 'admin123');
                      onClose();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                  >
                    Fill Admin Credentials
                  </ChromeButton>
                )}
              </div>
            </>
          ) : roleTab === 'vendor' ? (
            <>
              <div className="p-3.5 bg-orange-100/70 border border-orange-200 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#c2410c] flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#ea580c]" />
                  <span>Campus Food Court Franchise Portal</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Food court franchise operators inside campus UniMall can manage live tokens, items and rush levels.
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-black text-slate-900 text-xs block mb-1">
                  Campus Food Court Stalls (Password: <code className="text-[#ea580c] font-mono">vendor123</code>):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Rolls &amp; Frankie Hub</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">Stall #FC-01 • ID: stall-rolls</div>
                    </div>
                    {onSelectDemoVendor && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoVendor('stall-rolls', 'vendor123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Rolls Owner &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">South Hub Express</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">Stall #FC-02 • ID: stall-south</div>
                    </div>
                    {onSelectDemoVendor && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoVendor('stall-south', 'vendor123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as South Hub Owner &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Chai &amp; Snacks Point</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">Stall #FC-03 • ID: stall-chai</div>
                    </div>
                    {onSelectDemoVendor && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoVendor('stall-chai', 'vendor123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Chai Point Owner &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Woodfire Crust Pizza</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">Stall #FC-04 • ID: stall-pizza</div>
                    </div>
                    {onSelectDemoVendor && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDemoVendor('stall-pizza', 'vendor123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Pizza Stall Owner &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* RESTAURANTS & RESTROS SECTION */}
              <div className="p-3.5 bg-orange-100/70 border border-orange-200 rounded-2xl space-y-1.5 backdrop-blur-sm">
                <div className="font-bold text-[#c2410c] flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-[#ea580c]" />
                  <span>Nearby Restaurant &amp; Dhaba Partner Portal</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Partner restaurants and dhabas in Law Gate, GT Road &amp; Phagwara can log in to manage hostel deliveries, update live menus, discount promos and toggle opening status.
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-black text-slate-900 text-xs block mb-1">
                  1-Click Restaurant Sign-In (Password: <code className="text-[#ea580c] font-mono">restro123</code>):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Domino's Pizza</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-dominos • Law Gate</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-dominos', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-dominos', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Domino's Manager &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Subway Express</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-subway-lawgate • Law Gate</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-subway-lawgate', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-subway-lawgate', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Subway Manager &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Amritsari Kulcha Hub</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-lawgate-kulcha • Law Gate</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-lawgate-kulcha', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-lawgate-kulcha', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Kulcha Hub Manager &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">McDonald's</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-mcdonalds-gtroad • GT Road</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-mcdonalds-gtroad', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-mcdonalds-gtroad', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as McDonald's Manager &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Royal Spice Dhaba</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-royal-spice • GT Road</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-royal-spice', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-royal-spice', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Royal Spice Manager &rarr;
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/90 border border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="font-black text-slate-900">Midnight Cravers 24x7</div>
                      <div className="text-[10px] text-slate-600 font-mono font-bold">ID: resto-midnight-craver • Law Gate</div>
                    </div>
                    {(onSelectDemoRestaurant || onSelectDemoVendor) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectDemoRestaurant) onSelectDemoRestaurant('resto-midnight-craver', 'restro123');
                          else if (onSelectDemoVendor) onSelectDemoVendor('resto-midnight-craver', 'restro123');
                          onClose();
                        }}
                        className="mt-1.5 text-left text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        Sign in as Midnight Cravers &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
