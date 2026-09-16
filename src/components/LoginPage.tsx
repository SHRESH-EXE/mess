import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { DeviceSpecBadge } from './DeviceSpecBadge';
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
  X
} from 'lucide-react';

export type LoginPortalRole = 'student' | 'admin' | 'vendor' | 'restaurant';

export interface LoginErrorDetails {
  title: string;
  message: string;
  type: 'not_found' | 'wrong_password' | 'invalid_credentials';
  field?: 'id' | 'password' | 'both';
}

/**
 * LoginPage with Dedicated 4-Way Portal Selector:
 * 1. Student Hosteler Portal
 * 2. Mess Authority & Warden Portal
 * 3. Campus Food Court Franchise Portal
 * 4. Nearby Restaurant & Dhaba Partner Portal
 */
export const LoginPage: React.FC = () => {
  const { loginStudent, loginAdmin, loginVendor, loginRestaurant } = useMess();

  // Selected Portal Type
  const [selectedRole, setSelectedRole] = useState<LoginPortalRole>('student');

  // Form State
  const [registrationId, setRegistrationId] = useState<string>('22CS0142');
  const [password, setPassword] = useState<string>('B-312');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Status & Error state (Professional Structured Error)
  const [loginError, setLoginError] = useState<LoginErrorDetails | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const triggerShake = (rawError: string) => {
    const lower = rawError.toLowerCase();
    let details: LoginErrorDetails;

    if (
      lower.includes('user not found') ||
      lower.includes('no registered') ||
      lower.includes('not recognized') ||
      lower.includes('unrecognized') ||
      lower.includes('student registration id') ||
      lower.includes('admin email') ||
      lower.includes('stall id') ||
      lower.includes('restaurant id')
    ) {
      details = {
        title: 'User Not Found',
        message:
          rawError.replace(/^user not found\.?\s*/i, '') ||
          'No account found matching this ID. Please check your credentials or register.',
        type: 'not_found',
        field: 'id'
      };
    } else if (
      lower.includes('wrong password') ||
      lower.includes('incorrect password') ||
      lower.includes('password entered') ||
      lower.includes('enter your password')
    ) {
      details = {
        title: 'Wrong Password',
        message:
          rawError.replace(/^wrong password\.?\s*/i, '') ||
          'The password you entered is incorrect. Please check your credentials and try again.',
        type: 'wrong_password',
        field: 'password'
      };
    } else {
      details = {
        title: 'Invalid Credentials',
        message:
          rawError.replace(/^invalid credentials\.?\s*/i, '') ||
          'The credentials provided do not match our records. Please try again.',
        type: 'invalid_credentials',
        field: 'both'
      };
    }

    setLoginError(details);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Switch role tab and update pre-filled values
  const handleRoleChange = (role: LoginPortalRole) => {
    soundEffects.playClick();
    setSelectedRole(role);
    setLoginError(null);

    if (role === 'student') {
      setRegistrationId('22CS0142');
      setPassword('B-312');
    } else if (role === 'admin') {
      setRegistrationId('admin@campus.edu');
      setPassword('admin123');
    } else if (role === 'vendor') {
      setRegistrationId('stall-rolls');
      setPassword('vendor123');
    } else {
      // Restaurant Partner
      setRegistrationId('resto-dominos');
      setPassword('restro123');
    }
  };

  // Immediate Login Execution
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputVal = registrationId.trim();
    const passVal = password.trim();

    if (!inputVal) {
      triggerShake(
        selectedRole === 'restaurant'
          ? 'Please enter your Restaurant ID (e.g. resto-dominos)'
          : selectedRole === 'vendor'
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

    setLoginError(null);
    setIsLoading(true);

    try {
      soundEffects.playClick();

      if (selectedRole === 'restaurant') {
        const res = await (loginRestaurant ? loginRestaurant(inputVal, passVal) : loginVendor(inputVal, passVal));
        if (!res.success) {
          triggerShake(res.error || 'Invalid Restaurant Partner credentials');
        }
        setIsLoading(false);
        return;
      }

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
    setLoginError(null);
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

      {/* Top Header Bar with Brand & Adaptive Device Spec Badge */}
      <header className="relative z-20 w-full px-4 sm:px-8 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-xs">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-['Outfit'] font-black text-sm sm:text-base text-slate-900 tracking-wider">
            LPU CAMPUS DINING
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DeviceSpecBadge />
        </div>
      </header>

      {/* =========================================================
          2. CENTRAL 3D NEUMORPHIC DISC LOGIN CARD (PHONE & TABLET ADAPTIVE)
          ========================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-auto max-w-full">
        <div className="neumorphic-circle-wrapper w-full max-w-[460px] sm:max-w-[500px]">
          {/* THE 3D CONVEX CIRCULAR NEUMORPHIC DISC CARD */}
          <div
            id="login-card"
            className={`neumorphic-circle-card w-full rounded-[32px] sm:rounded-[48px] md:rounded-full p-5 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {/* Ambient specular highlight on circular face */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[32px] sm:rounded-[48px] md:rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)'
              }}
            />

            <div className="relative z-10 w-full max-w-[370px] mx-auto space-y-3.5 sm:space-y-4">
              {/* Header */}
              <div className="space-y-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] mx-auto flex items-center justify-center mb-1.5 sm:mb-2 shadow-md shadow-orange-500/25 border border-white/60 text-white">
                  {selectedRole === 'restaurant' ? (
                    <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                  ) : selectedRole === 'vendor' ? (
                    <Store className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                  ) : selectedRole === 'admin' ? (
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                  ) : (
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-sans">
                  {selectedRole === 'restaurant'
                    ? 'Restro Partner'
                    : selectedRole === 'vendor'
                    ? 'Food Court Owner'
                    : selectedRole === 'admin'
                    ? 'Mess Warden'
                    : 'Student Login'}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {selectedRole === 'restaurant'
                    ? 'Sign in to manage delivery & menu'
                    : selectedRole === 'vendor'
                    ? 'Sign in to manage food court stall'
                    : selectedRole === 'admin'
                    ? 'Sign in to manage hostel mess'
                    : 'Sign in to your student account'}
                </p>
              </div>

              {/* 4-Way Role Selector Tabs (Neumorphic Inset Capsule) */}
              <div className="neumorphic-inset-container grid grid-cols-4 gap-0.5 sm:gap-1 p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`py-1.5 sm:py-2 px-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3 h-3 shrink-0" />
                  <span className="truncate">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-1.5 sm:py-2 px-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span className="truncate">Warden</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('vendor')}
                  className={`py-1.5 sm:py-2 px-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'vendor'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3 h-3 shrink-0" />
                  <span className="truncate">Stalls</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('restaurant')}
                  className={`py-1.5 sm:py-2 px-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    selectedRole === 'restaurant'
                      ? 'neumorphic-active-pill text-[#ea580c] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UtensilsCrossed className="w-3 h-3 shrink-0" />
                  <span className="truncate">Restros</span>
                </button>
              </div>

              {/* Professional Enterprise-Grade Error Banner */}
              {loginError && (
                <div
                  role="alert"
                  className={`w-full p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md text-left transition-all duration-300 shadow-md ${
                    loginError.type === 'not_found'
                      ? 'bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/5 border-amber-400/40 shadow-amber-500/5'
                      : loginError.type === 'wrong_password'
                      ? 'bg-gradient-to-r from-rose-500/10 via-red-500/10 to-rose-500/5 border-rose-400/40 shadow-rose-500/5'
                      : 'bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/5 border-red-400/40 shadow-red-500/5'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                        loginError.type === 'not_found'
                          ? 'bg-amber-100/90 border-amber-300 text-amber-700'
                          : loginError.type === 'wrong_password'
                          ? 'bg-rose-100/90 border-rose-300 text-rose-700'
                          : 'bg-red-100/90 border-red-300 text-red-700'
                      }`}
                    >
                      {loginError.type === 'wrong_password' ? (
                        <Lock className="w-4 h-4" strokeWidth={2.2} />
                      ) : loginError.type === 'not_found' ? (
                        <User className="w-4 h-4" strokeWidth={2.2} />
                      ) : (
                        <AlertCircle className="w-4 h-4" strokeWidth={2.2} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-black text-slate-900 tracking-tight">
                            {loginError.title}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              loginError.type === 'not_found'
                                ? 'bg-amber-500'
                                : loginError.type === 'wrong_password'
                                ? 'bg-rose-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setLoginError(null)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
                          aria-label="Dismiss error"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed mt-0.5">
                        {loginError.message}
                      </p>

                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Need demo login credentials?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginError(null);
                            setIsForgotModalOpen(true);
                          }}
                          className="font-bold text-[#ea580c] hover:underline cursor-pointer transition-colors"
                        >
                          View Demo Accounts &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
                {/* Field 1: Recessed Inset Username / ID Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    {selectedRole === 'restaurant' ? (
                      <UtensilsCrossed className="w-4 h-4 text-[#ea580c]" />
                    ) : selectedRole === 'vendor' ? (
                      <Store className="w-4 h-4 text-[#ea580c]" />
                    ) : selectedRole === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
                    ) : (
                      <User className="w-4 h-4 text-[#ea580c]" />
                    )}
                  </div>
                  <input
                    id="registration-id-field"
                    type="text"
                    value={registrationId}
                    onChange={(e) => {
                      setRegistrationId(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder={
                      selectedRole === 'restaurant'
                        ? 'Restro ID (e.g. resto-dominos, resto-subway)'
                        : selectedRole === 'vendor'
                        ? 'Food Court Stall ID (e.g. stall-rolls)'
                        : selectedRole === 'admin'
                        ? 'Admin Email / Staff ID'
                        : 'Registration ID (e.g. 22CS0142)'
                    }
                    required
                    className={`w-full neumorphic-inset-input pl-11 pr-4 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold ${
                      loginError && (loginError.field === 'id' || loginError.field === 'both')
                        ? 'ring-2 ring-red-400/50 border-red-400 bg-red-50/20'
                        : ''
                    }`}
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
                      if (loginError) setLoginError(null);
                    }}
                    placeholder={
                      selectedRole === 'student'
                        ? 'Hostel Room No (e.g. B-312)'
                        : selectedRole === 'restaurant'
                        ? 'Restro Password (e.g. restro123)'
                        : 'Password (e.g. vendor123)'
                    }
                    required
                    className={`w-full neumorphic-inset-input pl-11 pr-11 py-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold ${
                      loginError && (loginError.field === 'password' || loginError.field === 'both')
                        ? 'ring-2 ring-red-400/50 border-red-400 bg-red-50/20'
                        : ''
                    }`}
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
                          {selectedRole === 'restaurant'
                            ? 'SIGN IN AS RESTRO'
                            : selectedRole === 'vendor'
                            ? 'SIGN IN AS FOOD COURT'
                            : selectedRole === 'admin'
                            ? 'SIGN IN AS WARDEN'
                            : 'SIGN IN AS STUDENT'}
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
          onSelectDemoRestaurant={(restoId, pass) => {
            setSelectedRole('restaurant');
            handleAutofill(restoId, pass);
          }}
        />
      )}
    </div>
  );
};
