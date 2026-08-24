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
  ArrowRight
} from 'lucide-react';

/**
 * LoginPage with Black Text on Frosted White Glass & Flowing Vibrant Orange UI
 */
export const LoginPage: React.FC = () => {
  const { loginStudent, loginAdmin } = useMess();

  // Form State
  const [registrationId, setRegistrationId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

  // Immediate Login Execution
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputVal = registrationId.trim();
    const passVal = password.trim();

    if (!inputVal) {
      triggerShake('Please enter your Registration ID or Email');
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
      const isAdminInput =
        inputVal.toLowerCase().includes('admin') ||
        inputVal.toLowerCase() === 'admin@campus.edu' ||
        passVal === 'admin123';

      if (isAdminInput) {
        const res = await loginAdmin(inputVal, passVal);
        if (!res.success) {
          triggerShake(res.error || 'Invalid Admin credentials');
        }
        setIsLoading(false);
        return;
      }

      const studentResult = await loginStudent(inputVal.toUpperCase(), passVal);
      if (!studentResult.success) {
        const adminFallback = await loginAdmin(inputVal, passVal);
        if (!adminFallback.success) {
          triggerShake(studentResult.error || 'Invalid Registration ID or Password');
        }
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
            background: 'radial-gradient(circle, rgba(255, 122, 48, 0.4) 0%, rgba(255, 146, 72, 0.2) 45%, rgba(255, 122, 48, 0) 70%)',
            filter: 'blur(70px)'
          }}
        />

        {/* Blob 2: Warm Peachy Golden Orange Drifting Blob */}
        <div
          className="absolute -bottom-24 -right-20 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full blob-animation-2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 150, 60, 0.35) 0%, rgba(255, 122, 48, 0.2) 50%, rgba(255, 122, 48, 0) 75%)',
            filter: 'blur(75px)'
          }}
        />

        {/* Blob 3: Luminous Center-Floating Blob */}
        <div
          className="absolute top-1/4 right-1/4 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full blob-animation-3 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 120, 0.3) 0%, rgba(255, 122, 48, 0.15) 45%, rgba(255, 122, 48, 0) 70%)',
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
        <div className="w-full max-w-[420px] relative">
          
          {/* THE LIQUID GLASSMORPHISM OVAL CARD */}
          <div
            id="login-card"
            className={`relative glassmorphism-card rounded-[36px] p-7 sm:p-9 text-center overflow-hidden transition-all duration-300 shadow-[0_25px_50px_-12px_rgba(249,115,22,0.15)] border-[1.5px] border-white/90 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {/* Top-left to bottom-right specular light-catching liquid glass sheen overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[36px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 65%)'
              }}
            />

            {/* Card Header */}
            <div className="relative z-10 mb-6">
              {/* Glass Icon Oval Badge */}
              <div className="w-16 h-16 rounded-[22px] bg-orange-500/10 border border-orange-200/80 mx-auto flex items-center justify-center mb-3.5 shadow-sm">
                <UtensilsCrossed className="w-8 h-8 text-[#ea580c]" strokeWidth={2.2} />
              </div>

              <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight font-sans">
                Hello!
              </h1>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-emerald-50/90 backdrop-blur-md border border-emerald-300 text-emerald-950 text-xs flex items-center space-x-2 text-left shadow-xs">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-4 text-left">
              
              {/* Field 1: Registration ID */}
              <div className="space-y-1.5">
                <label
                  htmlFor="registration-id-field"
                  className="block text-xs font-black text-slate-900 ml-1"
                >
                  Registration ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ea580c]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="registration-id-field"
                    type="text"
                    value={registrationId}
                    onChange={(e) => {
                      setRegistrationId(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. 22CS0142 or admin"
                    required
                    className="w-full glassmorphism-input rounded-[18px] pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold shadow-xs"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label
                    htmlFor="password-field"
                    className="block text-xs font-black text-slate-900"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer"
                  >
                    Forgot / Help?
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
                    className="w-full glassmorphism-input rounded-[18px] pl-11 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold shadow-xs"
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
              <div className="flex items-center justify-between text-xs py-1 px-1">
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
                    <span className="text-white font-bold">Enter Mess Portal</span>
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
          onClose={() => setIsForgotModalOpen(false)}
          onSelectDemoStudent={(roll, room) => handleAutofill(roll, room)}
          onSelectDemoAdmin={(email, pass) => handleAutofill(email, pass)}
        />
      )}
    </div>
  );
};
