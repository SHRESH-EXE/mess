import React, { useState, useEffect } from 'react';
import { useMess } from '../context/MessContext';
import { soundEffects } from '../utils/soundEffects';
import ChromeButton from './ui/chrome-button';
import {
  X,
  KeyRound,
  ShieldAlert,
  Phone,
  Check,
  Store,
  UtensilsCrossed,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  MessageSquareCode
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
  const { students, resetStudentPassword } = useMess();

  const [activeTab, setActiveTab] = useState<'otp' | 'demo'>('otp');
  const [roleTab, setRoleTab] = useState<'student' | 'admin' | 'vendor' | 'restaurant'>(initialRole);

  // OTP Reset Flow State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<typeof students[0] | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [simulatedSmsBanner, setSimulatedSmsBanner] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Step 1: Send OTP to Mobile Number
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = identifier.trim().toUpperCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = students.find((s) => {
      const sRoll = (s.rollNo || '').toUpperCase();
      const sPhone = (s.phone || '').replace(/\D/g, '');
      return (
        sRoll === clean ||
        (cleanDigits.length >= 8 && sPhone.endsWith(cleanDigits)) ||
        (clean === '22CS0142' && s.id === 'stu-1') ||
        (clean === '22EC0089' && s.id === 'stu-2')
      );
    });

    if (!found) {
      soundEffects.playError();
      setErrorMessage(`No student account found with "${identifier}". Please check your Roll Number or Mobile Number.`);
      return;
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setMatchedStudent(found);
    setGeneratedOtp(otp);
    setCountdown(60);
    setStep(2);
    soundEffects.playSuccess();

    // Display simulated SMS notification toast
    setSimulatedSmsBanner(`OTP: ${otp} (LPU-DINING security code for ${found.name})`);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      soundEffects.playError();
      setErrorMessage('Invalid OTP code. Please enter the 6-digit code sent to your mobile number.');
      return;
    }

    soundEffects.playSuccess();
    setStep(3);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (countdown > 0) return;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setCountdown(60);
    setEnteredOtp('');
    setErrorMessage(null);
    soundEffects.playTap();
    setSimulatedSmsBanner(`New OTP: ${otp} (Sent to registered mobile)`);
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please retype carefully.');
      return;
    }

    if (!matchedStudent) return;

    const res = await resetStudentPassword(matchedStudent.rollNo, newPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update password. Please try again.');
      return;
    }

    soundEffects.playSuccess();
    setStep(4);
  };

  const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6) return phone;
    return `+91 ******${digits.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="forgot-password-modal"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-orange-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight font-serif">
                Account Recovery &amp; Password Reset
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Reset password instantly via OTP on your registered mobile number
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar: Mobile OTP vs Demo Credentials */}
        <div className="px-6 pt-3 border-b border-orange-100 bg-orange-50/40 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setActiveTab('otp')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'otp'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Reset via Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'demo'
                ? 'border-[#ff7a30] text-[#ea580c] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Demo Accounts Reference</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {activeTab === 'otp' ? (
            <div className="space-y-4">
              
              {/* Simulated Incoming SMS Banner */}
              {simulatedSmsBanner && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start space-x-2.5">
                    <MessageSquareCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Incoming SMS Simulation (Mobile Alert)
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-900 mt-0.5">
                        {simulatedSmsBanner}
                      </div>
                    </div>
                  </div>
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Auto-Fill OTP
                    </button>
                  )}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-medium flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: Enter Roll No or Mobile */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span>Enter Registration / Roll No or Mobile</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      We will verify your student record and send a 6-digit OTP to your registered phone number.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Roll Number or Registered Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        placeholder="e.g. 22CS0142 or 9876543210"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold font-mono text-slate-900 transition-all"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Quick test roll: <strong className="font-mono text-slate-800">22CS0142</strong> or <strong className="font-mono text-slate-800">22EC0089</strong></span>
                    </div>
                  </div>

                  <ChromeButton
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </ChromeButton>
                </form>
              )}

              {/* STEP 2: Enter OTP */}
              {step === 2 && matchedStudent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1">
                    <div className="font-bold text-slate-900">
                      OTP Sent to {maskPhone(matchedStudent.phone)}
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Student: <strong>{matchedStudent.name}</strong> ({matchedStudent.rollNo})
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      placeholder="• • • • • •"
                      className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl font-mono font-black rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-slate-900 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                      className={`font-bold flex items-center gap-1 cursor-pointer ${
                        countdown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-orange-600 hover:underline'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resend OTP {countdown > 0 ? `(${countdown}s)` : ''}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  <ChromeButton
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify OTP</span>
                  </ChromeButton>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {step === 3 && matchedStudent && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Check className="w-4 h-4" />
                      <span>OTP Verified Successfully</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Create a new password for student <strong>{matchedStudent.name}</strong> ({matchedStudent.rollNo}).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          placeholder="Enter new password..."
                          className="w-full pl-4 pr-11 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 text-xs font-semibold text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-type new password..."
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <ChromeButton
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Save New Password</span>
                  </ChromeButton>
                </form>
              )}

              {/* STEP 4: Success Confirmation */}
              {step === 4 && matchedStudent && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      Password Reset Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Your new password has been saved for <strong>{matchedStudent.name}</strong> ({matchedStudent.rollNo}). You can now log in immediately.
                    </p>
                  </div>

                  {onSelectDemoStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDemoStudent(matchedStudent.rollNo, newPassword);
                        onClose();
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold rounded-2xl text-xs shadow-md shadow-orange-500/25 cursor-pointer"
                    >
                      Log in as {matchedStudent.name} &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Demo Credentials Reference */
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl space-y-1">
                <span className="font-bold text-orange-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span>Default Demo Logins</span>
                </span>
                <p className="text-slate-600 text-[11px]">
                  Click on any demo profile below to auto-fill credentials on the login screen.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Aryan Sharma (Student)</div>
                    <div className="text-[11px] text-slate-500 font-mono">Roll: 22CS0142 • Room: B-312</div>
                  </div>
                  {onSelectDemoStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDemoStudent('22CS0142', 'B-312');
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-orange-100 text-orange-800 font-bold rounded-xl text-xs hover:bg-orange-200 transition cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Sneha Patel (Student)</div>
                    <div className="text-[11px] text-slate-500 font-mono">Roll: 22EC0089 • Room: G-104</div>
                  </div>
                  {onSelectDemoStudent && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDemoStudent('22EC0089', 'G-104');
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-orange-100 text-orange-800 font-bold rounded-xl text-xs hover:bg-orange-200 transition cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Chief Warden / Admin</div>
                    <div className="text-[11px] text-slate-500 font-mono">admin@campus.edu • admin123</div>
                  </div>
                  {onSelectDemoAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDemoAdmin('admin@campus.edu', 'admin123');
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-orange-100 text-orange-800 font-bold rounded-xl text-xs hover:bg-orange-200 transition cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
