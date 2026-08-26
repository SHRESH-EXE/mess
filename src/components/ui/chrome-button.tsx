import React from 'react';

export interface ChromeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'orange' | 'emerald' | 'dark' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export function ChromeButton({
  children,
  className = '',
  variant,
  size,
  type = 'button',
  disabled,
  ...props
}: ChromeButtonProps) {
  // If the caller provided full custom styling classes (e.g. `bg-gradient-to-r...`), preserve them exactly
  // and attach the animated glitter effect
  const hasCustomBg = className.includes('bg-') || className.includes('from-');

  let defaultVariantClass = '';
  if (!hasCustomBg) {
    switch (variant) {
      case 'emerald':
        defaultVariantClass = 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20';
        break;
      case 'dark':
        defaultVariantClass = 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20';
        break;
      case 'glass':
        defaultVariantClass = 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200 shadow-xs';
        break;
      case 'orange':
      default:
        defaultVariantClass = 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white shadow-md shadow-orange-500/20';
        break;
    }
  }

  const defaultSizeClass = !className.includes('px-') && !className.includes('py-')
    ? (size === 'sm' ? 'px-3.5 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs')
    : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`button-glitter-effect select-none transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${defaultSizeClass} ${defaultVariantClass} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center space-x-1.5">
        {children}
      </span>
    </button>
  );
}

export default ChromeButton;
