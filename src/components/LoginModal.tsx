import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export interface LoginModalSuccessData {
  identifier: string;
  role: 'student' | 'admin';
  timestamp: string;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (data: LoginModalSuccessData) => void;
  title?: string;
  subtitle?: string;
  initialIdentifier?: string;
  initialPassword?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Hostel Mess Portal',
  subtitle = 'Sign in to access your mess dashboard',
  initialIdentifier = '',
  initialPassword = ''
}) => {
  // Form input states
  const [identifier, setIdentifier] = useState<string>(initialIdentifier);
  const [password, setPassword] = useState<string>(initialPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger immediate login
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Registration ID or Username');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    soundEffects.playClick();
    const isAdmin =
      identifier.toLowerCase().includes('admin') ||
      identifier.toLowerCase() === 'admin@campus.edu' ||
      password === 'admin123';

    onSuccess({
      identifier: identifier.trim() || '22CS0142',
      role: isAdmin ? 'admin' : 'student',
      timestamp: new Date().toISOString()
    });
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Background with blurred orange blobs */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-12 -left-12 w-[380px] h-[380px] rounded-full blob-animation-1 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 122, 48, 0.35) 0%, rgba(255, 146, 72, 0.18) 45%, transparent 70%)',
            filter: 'blur(65px)'
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-[420px] h-[420px] rounded-full blob-animation-2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 176, 102, 0.4) 0%, rgba(255, 122, 48, 0.2) 50%, transparent 75%)',
            filter: 'blur(70px)'
          }}
        />
      </div>

      {/* Centered Glass Modal Card */}
      <div className="w-full max-w-[420px] relative z-10">
        <div
          id="modal-login-card"
          className="relative glassmorphism-card text-slate-900 rounded-[24px] p-7 sm:p-8 text-center overflow-hidden border border-white/95 shadow-2xl"
        >
          {/* Specular sheen reflection */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[24px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 60%)'
            }}
          />

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close login dialog"
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Modal Header */}
          <div className="relative z-10 mb-5">
            <div className="w-13 h-13 rounded-2xl bg-orange-500/10 border border-orange-200 mx-auto flex items-center justify-center mb-3 shadow-xs">
              <UtensilsCrossed className="w-6 h-6 text-[#ea580c]" strokeWidth={2.2} />
            </div>

            <h2 id="modal-title" className="text-xl font-black text-slate-900 tracking-tight font-sans">
              {title}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-semibold">{subtitle}</p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="relative z-10 mb-4 p-2.5 rounded-xl bg-emerald-50/90 backdrop-blur-md border border-emerald-300 text-emerald-950 text-xs flex items-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-3.5 text-left">
            {/* Username / Reg ID */}
            <div className="space-y-1">
              <label htmlFor="reg-field" className="block text-xs font-black text-slate-900">
                Email / Registration ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ea580c]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-field"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 22CS0142 or admin"
                  required
                  className="w-full glassmorphism-input text-slate-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="pwd-field" className="block text-xs font-black text-slate-900">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ea580c]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="pwd-field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full glassmorphism-input text-slate-900 rounded-xl pl-10 pr-10 py-2.5 text-sm placeholder-slate-400 focus:outline-none transition-all font-sans font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-left">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-orange-300 bg-white text-[#ff7a30] focus:ring-[#ff7a30] cursor-pointer accent-[#ff7a30]"
                />
                <span className="text-xs text-slate-800 font-semibold">Remember credentials</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff7a30] via-[#ff883d] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="text-white">Signing in...</span>
              ) : (
                <>
                  <span className="text-white">Login</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
