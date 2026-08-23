import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { soundEffects } from '../utils/soundEffects';
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

/**
 * LoginPage with White & Orange Liquid Glassmorphism UI
 * - Harmonious warm palette (White, Soft Peach, Warm Orange, Amber, Deep Espresso)
 * - Removed cold gray colors in favor of warm terracotta and amber tones
 * - 3 large blurred floating liquid blobs (blur 60-80px, 8-12s loops)
 * - Frosted white glass card (rgba(255,255,255,0.48), blur(20px), border-white/75, orange-tinted shadow)
 * - Specular light-catching gradient overlay
 * - High-contrast deep espresso (#2e170d) text for clear readability
 */
export const LoginPage: React.FC = () => {
  const { loginStudent, loginAdmin } = useMess();

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

  // Pre-fill helper
  const handleAutofill = (id: string, pass: string) => {
    soundEffects.playClick();
    setRegistrationId(id);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-hidden font-sans text-[#2e170d] select-none liquid-glass-bg">
      {/* =========================================================
          1. LIQUID FLOWING ORANGE & WHITE BACKDROP
          ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Blob 1: Deep Vibrant Orange Drifting Blob */}
        <div
          className="absolute -top-16 -left-20 w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full blob-animation-1 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 122, 48, 0.45) 0%, rgba(255, 146, 72, 0.25) 45%, rgba(255, 247, 240, 0) 70%)',
            filter: 'blur(70px)'
          }}
        />

        {/* Blob 2: Warm Peachy Golden Orange Drifting Blob */}
        <div
          className="absolute -bottom-24 -right-20 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full blob-animation-2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 176, 102, 0.55) 0%, rgba(255, 122, 48, 0.3) 50%, rgba(255, 237, 213, 0) 75%)',
            filter: 'blur(75px)'
          }}
        />

        {/* Blob 3: Light Peachy-White Luminous Center-Floating Blob */}
        <div
          className="absolute top-1/4 right-1/4 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full blob-animation-3 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(255, 237, 213, 0.4) 45%, rgba(255, 176, 102, 0) 70%)',
            filter: 'blur(65px)'
          }}
        />

        {/* Subtle Ambient Warm Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-orange-950/[0.015] to-orange-950/[0.04] pointer-events-none" />
      </div>

      {/* =========================================================
          TOP UNIVERSITY BRANDING HEADER (GLASSMORPHISM)
          ========================================================= */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 py-5 sm:py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 bg-white/45 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/70 shadow-[0_4px_20px_rgba(255,122,48,0.1)]">
          {/* Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] p-0.5 flex items-center justify-center shadow-sm shadow-orange-500/20">
            <div className="w-full h-full bg-[#2e170d] rounded-[10px] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-[#ffb066]" strokeWidth={2.2} />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#2e170d] uppercase leading-tight">
              Lovely Professional University
            </span>
            <span className="text-[10px] text-[#ea580c] font-bold tracking-wider uppercase">
              Hostel Mess &amp; Dining Portal
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-[#2e170d] bg-white/45 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-white/70 shadow-[0_4px_20px_rgba(255,122,48,0.1)]">
          <ShieldCheck className="w-4 h-4 text-[#ff7a30]" />
          <span>Secure University Portal</span>
        </div>
      </header>

      {/* =========================================================
          2. CENTRAL GLASS LOGIN CARD
          ========================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px] relative">
          
          {/* THE GLASSMORPHISM CARD */}
          <div
            id="login-card"
            className={`relative glassmorphism-card rounded-[24px] p-7 sm:p-9 text-center overflow-hidden transition-all duration-200 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {/* Top-left to bottom-right light-catching glass sheen overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[24px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 60%)'
              }}
            />

            {/* Card Header */}
            <div className="relative z-10 mb-6">
              {/* Glass Icon Badge */}
              <div className="w-13 h-13 rounded-2xl bg-white/60 border border-white/85 mx-auto flex items-center justify-center mb-3 shadow-[0_4px_16px_rgba(255,122,48,0.15)]">
                <UtensilsCrossed className="w-6 h-6 text-[#ff7a30]" strokeWidth={2.2} />
              </div>

              <h1 className="text-2xl sm:text-[26px] font-bold text-[#2e170d] tracking-tight font-sans">
                Hello!
              </h1>
              
              <p className="text-xs text-[#9a3412] mt-1.5 font-medium">
                Please enter your credentials to access your mess dashboard
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="relative z-10 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/40 text-red-900 text-xs flex items-center space-x-2 text-left backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-4 text-left">
              
              {/* Field 1: Registration ID */}
              <div className="space-y-1.5">
                <label
                  htmlFor="registration-id-field"
                  className="block text-xs font-bold text-[#2e170d]"
                >
                  Registration ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ea580c]/70">
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
                    className="w-full glassmorphism-input rounded-xl pl-10 pr-3.5 py-2.5 text-sm placeholder-[#c2410c]/50 focus:outline-none transition-all font-sans font-medium"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password-field"
                    className="block text-xs font-bold text-[#2e170d]"
                  >
                    Password / Room No
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-[#ea580c] hover:text-[#c2410c] font-bold transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ea580c]/70">
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
                    placeholder="••••••••"
                    required
                    className="w-full glassmorphism-input rounded-xl pl-10 pr-10 py-2.5 text-sm placeholder-[#c2410c]/50 focus:outline-none transition-all font-sans font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#ea580c]/70 hover:text-[#ea580c] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-orange-200 bg-white/50 text-[#ff7a30] focus:ring-[#ff7a30] cursor-pointer accent-[#ff7a30]"
                  />
                  <span className="text-xs text-[#2e170d] font-semibold">Remember credentials</span>
                </label>
              </div>

              {/* Solid Orange Gradient Login Button */}
              <button
                id="login-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#ff7a30] via-[#ff883d] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold py-2.5 px-4 rounded-xl shadow-[0_6px_20px_rgba(255,122,48,0.32)] hover:shadow-[0_8px_25px_rgba(255,122,48,0.45)] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Autofill Links (Warm Glass Pills) */}
            <div className="relative z-10 mt-5 pt-4 border-t border-orange-200/60">
              <span className="text-[11px] uppercase tracking-wider text-[#9a3412] font-bold block mb-2.5 text-left flex items-center justify-between">
                <span>Quick Demo Accounts</span>
                <Sparkles className="w-3.5 h-3.5 text-[#ff7a30]" />
              </span>
              
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAutofill('22CS0142', 'B-312')}
                  className="p-2.5 rounded-xl bg-white/40 hover:bg-white/65 border border-white/70 hover:border-orange-300 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="font-bold text-[#2e170d] group-hover:text-[#ea580c] flex items-center justify-between">
                    <span>Aarav Sharma</span>
                    <span className="text-[9px] bg-orange-500/15 text-[#ea580c] font-bold px-1.5 py-0.5 rounded-md border border-orange-400/30">
                      Student
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9a3412] mt-0.5 font-mono font-medium">22CS0142 • B-312</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofill('admin@campus.edu', 'admin123')}
                  className="p-2.5 rounded-xl bg-white/40 hover:bg-white/65 border border-white/70 hover:border-orange-300 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="font-bold text-[#2e170d] group-hover:text-[#ea580c] flex items-center justify-between">
                    <span>Mess Manager</span>
                    <span className="text-[9px] bg-amber-500/15 text-[#d97706] font-bold px-1.5 py-0.5 rounded-md border border-amber-400/30">
                      Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9a3412] mt-0.5 font-mono font-medium">admin@campus.edu</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-[#9a3412] font-semibold">
        <p>© 2026 Lovely Professional University • Hostel Mess Management System</p>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <ForgotPasswordModal
          initialRole={registrationId.includes('@') ? 'admin' : 'student'}
          onClose={() => setIsForgotModalOpen(false)}
          onSelectDemoStudent={(rNo, room) => {
            handleAutofill(rNo, room);
            setIsForgotModalOpen(false);
          }}
          onSelectDemoAdmin={(admEmail, admPass) => {
            handleAutofill(admEmail, admPass);
            setIsForgotModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
