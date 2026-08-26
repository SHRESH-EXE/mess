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
          2. CENTRAL 3D NEUMORPHIC CIRCULAR DISC LOGIN CARD
          ========================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-auto">
        <div className="neumorphic-circle-wrapper w-full max-w-[500px] sm:max-w-[520px]">
          {/* THE 3D CONVEX CIRCULAR NEUMORPHIC DISC CARD */}
          <div
            id="login-card"
            className={`neumorphic-circle-card w-full aspect-auto sm:aspect-square rounded-[42px] sm:rounded-full p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {/* Ambient specular highlight on circular face */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[42px] sm:rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)'
              }}
            />

            <div className="relative z-10 w-full max-w-[360px] mx-auto space-y-4">
              {/* Header */}
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] mx-auto flex items-center justify-center mb-2 shadow-md shadow-orange-500/25 border border-white/60 text-white">
                  {selectedRole === 'vendor' ? (
                    <Store className="w-6 h-6" strokeWidth={2.2} />
                  ) : selectedRole === 'admin' ? (
                    <ShieldCheck className="w-6 h-6" strokeWidth={2.2} />
                  ) : (
                    <UtensilsCrossed className="w-6 h-6" strokeWidth={2.2} />
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                  {selectedRole === 'vendor'
                    ? 'Food Court Owner'
                    : selectedRole === 'admin'
                    ? 'Mess Warden'
                    : 'Login'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Sign in to your account
                </p>
              </div>

              {/* 3-Way Role Selector Tabs (Neumorphic Inset Capsule) */}
              <div className="neumorphic-inset-container grid grid-cols-3 gap-1 p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  <span className="truncate">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span className="truncate">Warden</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('vendor')}
                  className={`py-1.5 px-2 rounded-full text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'vendor'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span className="truncate">Food Court</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2 text-left shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
                {/* Field 1: Recessed Inset Username / ID Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
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
                        ? 'Food Court Stall ID'
                        : selectedRole === 'admin'
                        ? 'Admin Email / Staff ID'
                        : 'Username / Registration ID'
                    }
                    required
                    className="w-full neumorphic-inset-input pl-11 pr-4 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold"
                  />
                </div>

                {/* Field 2: Recessed Inset Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
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
                    placeholder={selectedRole === 'student' ? 'Room No / PIN' : 'Password'}
                    required
                    className="w-full neumorphic-inset-input pl-11 pr-11 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember Me Toggle & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs py-0.5 px-1">
                  <label className="flex items-center space-x-2 text-slate-600 cursor-pointer font-medium select-none">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setRememberMe(!rememberMe);
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        rememberMe ? 'bg-[#ff7a30]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform ${
                          rememberMe ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-bold text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer"
                  >
                    Quick Demo Logins &rarr;
                  </button>
                </div>

                {/* Raised Pill Sign In Button */}
                <div className="pt-1">
                  <ChromeButton
                    id="login-submit-button"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#ff7a30] via-[#ff843a] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border border-white/40 uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-white font-bold">
                          {selectedRole === 'vendor'
                            ? 'SIGN IN'
                            : selectedRole === 'admin'
                            ? 'SIGN IN'
                            : 'SIGN IN'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white ml-1" />
                      </>
                    )}
                  </ChromeButton>
                </div>

                {/* Don't have an account / Portal info text */}
                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-500">
                    Campus Dining Portal •{' '}
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="font-bold text-[#ea580c] hover:underline cursor-pointer"
                    >
                      Demo Passwords
                    </button>
                  </p>
                </div>
              </form>
            </div>
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
