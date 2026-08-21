import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  UtensilsCrossed,
  GraduationCap,
  ShieldCheck,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  Building,
  QrCode
} from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { loginStudent, loginAdmin } = useMess();

  // Tab: 'student' | 'admin'
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'admin'>('student');

  // Student Form State
  const [rollNo, setRollNo] = useState<string>('22CS0142');
  const [studentPassword, setStudentPassword] = useState<string>('B-312');
  const [showStudentPassword, setShowStudentPassword] = useState<boolean>(false);
  const [studentRemember, setStudentRemember] = useState<boolean>(true);
  const [studentTouched, setStudentTouched] = useState<{ roll: boolean; pass: boolean }>({
    roll: false,
    pass: false
  });

  // Admin Form State
  const [adminId, setAdminId] = useState<string>('admin@campus.edu');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [adminRemember, setAdminRemember] = useState<boolean>(true);
  const [adminTouched, setAdminTouched] = useState<{ id: boolean; pass: boolean }>({
    id: false,
    pass: false
  });

  // Shared UX State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);

  // Trigger shake animation
  const triggerShake = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Student Validation
  const isStudentRollValid = rollNo.trim().length >= 3;
  const isStudentPassValid = studentPassword.trim().length >= 2;
  const isStudentFormValid = isStudentRollValid && isStudentPassValid;

  // Admin Validation
  const isAdminIdValid = adminId.trim().length >= 3;
  const isAdminPassValid = adminPassword.trim().length >= 3;
  const isAdminFormValid = isAdminIdValid && isAdminPassValid;

  // Handle Student Submit
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStudentFormValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginStudent(rollNo, studentPassword);
    setIsLoading(false);

    if (!result.success && result.error) {
      triggerShake(result.error);
    }
  };

  // Handle Admin Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminFormValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginAdmin(adminId, adminPassword);
    setIsLoading(false);

    if (!result.success && result.error) {
      triggerShake(result.error);
    }
  };

  const handleAutofillStudent = (rNo: string, roomOrPass: string) => {
    setRollNo(rNo);
    setStudentPassword(roomOrPass);
    setErrorMessage(null);
    setStudentTouched({ roll: true, pass: true });
  };

  const handleAutofillAdmin = (email: string, pass: string) => {
    setAdminId(email);
    setAdminPassword(pass);
    setErrorMessage(null);
    setAdminTouched({ id: true, pass: true });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
      />

      {/* Top Simple Brand Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white font-serif">
                CampusMess<span className="text-amber-400">Hub</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-300 rounded-full border border-amber-500/30">
                Single Sign-On
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Hostel Dining Management & Smart QR Meal Passes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsForgotModalOpen(true)}
          className="text-xs font-semibold text-slate-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Need Login Help?</span>
        </button>
      </header>

      {/* Main Centered Login Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          
          {/* Main Card Container */}
          <div
            id="login-card-container"
            className={`bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden transition-all ${
              isShaking ? 'animate-shake ring-2 ring-red-500/50 border-red-500/50' : ''
            }`}
          >
            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800">
              <button
                type="button"
                id="tab-student-login"
                onClick={() => {
                  setActiveRoleTab('student');
                  setErrorMessage(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  activeRoleTab === 'student'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Login</span>
              </button>

              <button
                type="button"
                id="tab-admin-login"
                onClick={() => {
                  setActiveRoleTab('admin');
                  setErrorMessage(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  activeRoleTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Mess Admin</span>
              </button>
            </div>

            {/* Error Banner (if error occurred) */}
            {errorMessage && (
              <div className="mx-6 mt-5 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block font-bold text-red-300">Authentication Failed</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Tab 1: Student Login Form */}
            {activeRoleTab === 'student' && (
              <form onSubmit={handleStudentSubmit} className="p-6 sm:p-7 space-y-4">
                
                {/* Header intro */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-serif">
                    <span>Hostel Student Sign In</span>
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Meal Pass & Orders
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Access your daily menu, dynamic QR token pass & academic parcel dispatch.
                  </p>
                </div>

                {/* Roll Number Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Roll Number / Student ID <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">e.g. 22CS0142</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="student-roll-input"
                      value={rollNo}
                      onChange={(e) => {
                        setRollNo(e.target.value.toUpperCase());
                        setErrorMessage(null);
                      }}
                      onBlur={() => setStudentTouched((p) => ({ ...p, roll: true }))}
                      placeholder="e.g. 22CS0142"
                      required
                      className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 font-mono focus:outline-hidden transition-all ${
                        studentTouched.roll && !isStudentRollValid
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                  {studentTouched.roll && !isStudentRollValid && (
                    <p className="text-[11px] text-red-400 font-medium">
                      Please enter a valid student roll number.
                    </p>
                  )}
                </div>

                {/* Password / Room Number Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Password or Room No. <span className="text-amber-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      id="student-password-input"
                      value={studentPassword}
                      onChange={(e) => {
                        setStudentPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      onBlur={() => setStudentTouched((p) => ({ ...p, pass: true }))}
                      placeholder="e.g. B-312 or student123"
                      required
                      className={`w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-hidden transition-all ${
                        studentTouched.pass && !isStudentPassValid
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showStudentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {studentTouched.pass && !isStudentPassValid && (
                    <p className="text-[11px] text-red-400 font-medium">
                      Password or room number cannot be blank.
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={studentRemember}
                      onChange={(e) => setStudentRemember(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Session Secure</span>
                </div>

                {/* Submit Button with Loading State */}
                <button
                  type="submit"
                  id="student-login-submit-btn"
                  disabled={!isStudentFormValid || isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Student Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Demo Credentials Quick Chips */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Demo Student Profiles (Click to fill):
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {[
                      { name: 'Aarav (CS)', roll: '22CS0142', room: 'B-312' },
                      { name: 'Priya (EE)', roll: '23EE0089', room: 'A-204' },
                      { name: 'Rohan (ME)', roll: '21ME0310', room: 'C-108' }
                    ].map((stu) => (
                      <button
                        key={stu.roll}
                        type="button"
                        onClick={() => handleAutofillStudent(stu.roll, stu.room)}
                        className={`p-2 rounded-lg text-left text-[11px] border transition-all ${
                          rollNo === stu.roll
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="font-bold truncate">{stu.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{stu.roll} • {stu.room}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </form>
            )}

            {/* Tab 2: Admin Login Form */}
            {activeRoleTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="p-6 sm:p-7 space-y-4">
                
                {/* Header intro */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-serif">
                    <span>Mess Authority & Staff Sign In</span>
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Warden & Chef Ops
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live meal headcount audits, scanner validation, and weekly menu curation.
                  </p>
                </div>

                {/* Staff ID / Email Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Staff ID or Official Email <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">e.g. admin@campus.edu</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="admin-id-input"
                      value={adminId}
                      onChange={(e) => {
                        setAdminId(e.target.value);
                        setErrorMessage(null);
                      }}
                      onBlur={() => setAdminTouched((p) => ({ ...p, id: true }))}
                      placeholder="admin@campus.edu or STAFF-101"
                      required
                      className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-hidden transition-all ${
                        adminTouched.id && !isAdminIdValid
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                  </div>
                  {adminTouched.id && !isAdminIdValid && (
                    <p className="text-[11px] text-red-400 font-medium">
                      Please enter a registered Staff ID or email address.
                    </p>
                  )}
                </div>

                {/* Admin Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Security Password <span className="text-amber-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      Need help?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      id="admin-password-input"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      onBlur={() => setAdminTouched((p) => ({ ...p, pass: true }))}
                      placeholder="Enter security password"
                      required
                      className={`w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-hidden transition-all ${
                        adminTouched.pass && !isAdminPassValid
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showAdminPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {adminTouched.pass && !isAdminPassValid && (
                    <p className="text-[11px] text-red-400 font-medium">
                      Admin password cannot be blank.
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminRemember}
                      onChange={(e) => setAdminRemember(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0"
                    />
                    <span>Keep admin terminal authenticated</span>
                  </label>
                  <span className="text-[11px] text-slate-500">256-bit Encrypted</span>
                </div>

                {/* Submit Button with Loading State */}
                <button
                  type="submit"
                  id="admin-login-submit-btn"
                  disabled={!isAdminFormValid || isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Staff Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Provider Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Demo Admin Credentials Quick Chips */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Demo Staff Credentials:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutofillAdmin('admin@campus.edu', 'admin123')}
                      className={`p-2.5 rounded-lg text-left text-[11px] border transition-all ${
                        adminId === 'admin@campus.edu'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="font-bold">Chief Warden</div>
                      <div className="font-mono text-[10px] text-slate-500">admin@campus.edu / admin123</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutofillAdmin('chef@campus.edu', 'admin123')}
                      className={`p-2.5 rounded-lg text-left text-[11px] border transition-all ${
                        adminId === 'chef@campus.edu'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="font-bold">Head Chef Ops</div>
                      <div className="font-mono text-[10px] text-slate-500">chef@campus.edu / admin123</div>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>

          {/* Key Value Proposition highlights below card */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-center text-slate-400 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <QrCode className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <div className="font-bold text-slate-200">Zero Wait QR</div>
              <div className="text-[10px] text-slate-500">Scan at mess door</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <UtensilsCrossed className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <div className="font-bold text-slate-200">Daily Live Menu</div>
              <div className="text-[10px] text-slate-500">Nutrition & ratings</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Building className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <div className="font-bold text-slate-200">Parcel Dispatch</div>
              <div className="text-[10px] text-slate-500">To academic blocks</div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-4 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Campus Hostel Dining Logistics & Smart Mess Pass Authority System</span>
          <span>Helpline: <strong className="text-slate-400">+91 98765 43210</strong> (Ext 402)</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <ForgotPasswordModal
          initialRole={activeRoleTab}
          onClose={() => setIsForgotModalOpen(false)}
          onSelectDemoStudent={handleAutofillStudent}
          onSelectDemoAdmin={handleAutofillAdmin}
        />
      )}

    </div>
  );
};
