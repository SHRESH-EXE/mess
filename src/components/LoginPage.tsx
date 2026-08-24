import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { soundEffects } from '../utils/soundEffects';
import ChromeButton from './ui/chrome-button';
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Store,
  GraduationCap,
  Sparkles,
  Building2,
  KeyRound
} from 'lucide-react';

type LoginPortalRole = 'student' | 'admin' | 'vendor';

/**
 * LoginPage with Dedicated 3-Way Portal Selector:
 * 1. Student Hosteler Portal
 * 2. Mess Authority & Warden Portal
 * 3. Food Court Stall Owner Portal (NEW Dedicated Section)
 */
export const LoginPage: React.FC = () => {
  const { loginStudent, loginAdmin, loginVendor } = useMess();

  // Selected Portal Type
  const [selectedRole, setSelectedRole] = useState<LoginPortalRole>('student');

  // Form State
  const [registrationId, setRegistrationId] = useState<string>('22CS0142');
  const [password, setPassword] = useState<string>('B-312');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Status & Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const triggerShake = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Switch role tab and update pre-filled values
  const handleRoleChange = (role: LoginPortalRole) => {
    soundEffects.playClick();
    setSelectedRole(role);
    setErrorMessage(null);

    if (role === 'student') {
      setRegistrationId('22CS0142');
      setPassword('B-312');
    } else if (role === 'admin') {
      setRegistrationId('admin@campus.edu');
      setPassword('admin123');
    } else {
      setRegistrationId('stall-rolls');
      setPassword('vendor123');
    }
  };

  // Immediate Login Execution
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputVal = registrationId.trim();
    const passVal = password.trim();

    if (!inputVal) {
      triggerShake(
        selectedRole === 'vendor'
          ? 'Please enter your Stall ID or Vendor Code'
          : selectedRole === 'admin'
          ? 'Please enter your Admin Email'
          : 'Please enter your Student Registration ID'
      );
      return;
    }
    if (!passVal) {
      triggerShake('Please enter your Password');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      soundEffects.playClick();

      if (selectedRole === 'vendor') {
        const res = await loginVendor(inputVal, passVal);
        if (!res.success) {
          triggerShake(res.error || 'Invalid Food Court Stall Owner credentials');
        }
        setIsLoading(false);
        return;
      }

      if (selectedRole === 'admin') {
        const res = await loginAdmin(inputVal, passVal);
        if (!res.success) {
          triggerShake(res.error || 'Invalid Mess Authority credentials');
        }
        setIsLoading(false);
        return;
      }

      // Default to Student login
      const studentResult = await loginStudent(inputVal.toUpperCase(), passVal);
      if (!studentResult.success) {
        triggerShake(studentResult.error || 'Invalid Student ID or Room No.');
      }
    } catch {
      triggerShake('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill helper for modal
  const handleAutofill = (id: string, pass: string) => {
    soundEffects.playClick();
    setRegistrationId(id);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-hidden font-sans text-slate-900 select-none liquid-glass-bg glass-theme-wrapper">
      {/* =========================================================
          1. LIQUID FLOWING ORANGE & WHITE BACKDROP
          ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Blob 1: Deep Vibrant Orange Drifting Blob */}
        <div
          className="absolute -top-16 -left-20 w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full blob-animation-1 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 122, 48, 0.4) 0%, rgba(255, 146, 72, 0.2) 45%, rgba(255, 122, 48, 0) 70%)',
            filter: 'blur(70px)'
          }}
        />

        {/* Blob 2: Warm Peachy Golden Orange Drifting Blob */}
        <div
          className="absolute -bottom-24 -right-20 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full blob-animation-2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 150, 60, 0.35) 0%, rgba(255, 122, 48, 0.2) 50%, rgba(255, 122, 48, 0) 75%)',
            filter: 'blur(75px)'
          }}
        />

        {/* Blob 3: Luminous Center-Floating Blob */}
        <div
          className="absolute top-1/4 right-1/4 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full blob-animation-3 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 200, 120, 0.3) 0%, rgba(255, 122, 48, 0.15) 45%, rgba(255, 122, 48, 0) 70%)',
            filter: 'blur(65px)'
          }}
        />
      </div>

      {/* Spacer for top padding */}
      <div className="py-4" />

      {/* =========================================================
          2. CENTRAL GLASS LOGIN CARD (BLACK TEXT ON WHITE GLASS)
          ========================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[460px] relative">
          {/* THE LIQUID GLASSMORPHISM OVAL CARD */}
          <div
            id="login-card"
            className={`relative glassmorphism-card rounded-[36px] p-6 sm:p-8 text-center overflow-hidden transition-all duration-300 shadow-[0_25px_50px_-12px_rgba(249,115,22,0.15)] border-[1.5px] border-white/90 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {/* Top specular light sheen overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[36px]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 65%)'
              }}
            />

            {/* Card Header */}
            <div className="relative z-10 mb-4">
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#ff7a30] to-[#ff9248] mx-auto flex items-center justify-center mb-2.5 shadow-md shadow-orange-500/25 border border-white/40 text-white">
                {selectedRole === 'vendor' ? (
                  <Store className="w-7 h-7" strokeWidth={2.2} />
                ) : selectedRole === 'admin' ? (
                  <ShieldCheck className="w-7 h-7" strokeWidth={2.2} />
                ) : (
                  <UtensilsCrossed className="w-7 h-7" strokeWidth={2.2} />
                )}
              </div>

              <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight font-sans">
                {selectedRole === 'vendor'
                  ? 'Food Court Owner Portal'
                  : selectedRole === 'admin'
                  ? 'Mess Authority & Warden'
                  : 'Campus Dining Portal'}
              </h1>
            </div>

            {/* 3-Way Role Selector Tabs (Clear Separation of Sections) */}
            <div className="relative z-10 grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-orange-100/60 border border-orange-200/80 mb-5">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-white text-[#ea580c] shadow-sm font-extrabold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="leading-tight">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white text-[#ea580c] shadow-sm font-extrabold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="leading-tight">Mess Warden</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('vendor')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                  selectedRole === 'vendor'
                    ? 'bg-white text-[#ea580c] shadow-sm font-extrabold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="leading-tight">Food Court</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="relative z-10 mb-4 p-3 rounded-2xl bg-emerald-50/90 backdrop-blur-md border border-emerald-300 text-emerald-950 text-xs flex items-center space-x-2 text-left shadow-xs">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-3.5 text-left">
              {/* Field 1: User / Stall ID */}
              <div className="space-y-1">
                <label
                  htmlFor="registration-id-field"
                  className="block text-xs font-black text-slate-900 ml-1"
                >
                  {selectedRole === 'vendor'
                    ? 'Food Court Stall ID'
                    : selectedRole === 'admin'
                    ? 'Admin Email / Staff ID'
                    : 'Student Registration ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ea580c]">
                    {selectedRole === 'vendor' ? (
                      <Store className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    id="registration-id-field"
                    type="text"
                    value={registrationId}
                    onChange={(e) => {
                      setRegistrationId(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder={
                      selectedRole === 'vendor'
                        ? 'e.g. stall-rolls or stall-south'
                        : selectedRole === 'admin'
                        ? 'admin@campus.edu'
                        : 'e.g. 22CS0142'
                    }
                    required
                    className="w-full glassmorphism-input rounded-[18px] pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold shadow-xs"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <label
                    htmlFor="password-field"
                    className="block text-xs font-black text-slate-900"
                  >
                    {selectedRole === 'student' ? 'Room No / PIN' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer"
                  >
                    Quick Demo Logins &rarr;
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ea580c]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-field"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Enter password..."
                    required
                    className="w-full glassmorphism-input rounded-[18px] pl-11 pr-11 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs py-0.5 px-1">
                <label className="flex items-center space-x-2 text-slate-800 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff7a30] focus:ring-[#ff7a30] bg-white border-orange-300 accent-[#ff7a30]"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              {/* Submit Button - Oval Capsule */}
              <ChromeButton
                id="login-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#ff7a30] via-[#ff843a] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border border-white/30"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-white font-bold">
                      {selectedRole === 'vendor'
                        ? 'Open Food Court Dashboard'
                        : selectedRole === 'admin'
                        ? 'Enter Mess Authority Portal'
                        : 'Enter Student Dining Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </ChromeButton>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password / Credentials Modal */}
      {isForgotModalOpen && (
        <ForgotPasswordModal
          initialRole={selectedRole}
          onClose={() => setIsForgotModalOpen(false)}
          onSelectDemoStudent={(roll, room) => {
            setSelectedRole('student');
            handleAutofill(roll, room);
          }}
          onSelectDemoAdmin={(email, pass) => {
            setSelectedRole('admin');
            handleAutofill(email, pass);
          }}
          onSelectDemoVendor={(stallId, pass) => {
            setSelectedRole('vendor');
            handleAutofill(stallId, pass);
          }}
        />
      )}
    </div>
  );
};
