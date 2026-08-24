import React, { useEffect } from 'react';
import { useMess } from '../context/MessContext';
import {
  Sparkles,
  UtensilsCrossed,
  QrCode,
  Utensils,
  Package,
  Store,
  MessageSquareHeart,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import ChromeButton from './ui/chrome-button';

export const InteractiveTourModal: React.FC = () => {
  const {
    isTourActive,
    currentTourStepIndex,
    tourSteps,
    nextTourStep,
    prevTourStep,
    skipTour,
    startTour,
    setIsCheatSheetOpen
  } = useMess();

  const currentStep = tourSteps[currentTourStepIndex];
  const isFirstStep = currentTourStepIndex === 0;
  const isLastStep = currentTourStepIndex === tourSteps.length - 1;

  // Keyboard navigation: Left/Right arrow keys & Escape
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextTourStep();
      } else if (e.key === 'ArrowLeft') {
        prevTourStep();
      } else if (e.key === 'Escape') {
        skipTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, nextTourStep, prevTourStep, skipTour]);

  if (!isTourActive || !currentStep) return null;

  // Icon mapping
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-6 h-6 text-orange-500" />;
      case 'QrCode':
        return <QrCode className="w-6 h-6 text-emerald-500" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-orange-500" />;
      case 'Package':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'Store':
        return <Store className="w-6 h-6 text-teal-500" />;
      case 'MessageSquareHeart':
        return <MessageSquareHeart className="w-6 h-6 text-rose-500" />;
      default:
        return <HelpCircle className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-end sm:items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] space-y-4 animate-scale-up">
        {/* Header Strip with Step Count & Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <Compass className="w-4 h-4 text-orange-600 animate-spin-slow" />
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['Outfit']">
                Interactive Website Tour
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Step {currentTourStepIndex + 1} of {tourSteps.length}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsCheatSheetOpen(true);
              }}
              title="Open Quick Guide & Timings Cheat Sheet"
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>

            <button
              type="button"
              onClick={skipTour}
              title="Close tour"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentTourStepIndex + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Step Main Content */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0 shadow-xs">
              {getStepIcon(currentStep.iconName)}
            </div>
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                {currentStep.tagline}
              </span>
              <h2 className="text-xl font-black font-['Outfit'] text-slate-900 leading-tight">
                {currentStep.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed pl-0.5">
            {currentStep.description}
          </p>

          {/* Pro Tip Box */}
          {currentStep.tip && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/80 to-emerald-50/60 border border-orange-200/70 text-xs text-slate-700 font-medium leading-relaxed">
              {currentStep.tip}
            </div>
          )}
        </div>

        {/* Footer Controls: Dots, Previous, Next / Finish */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Step Dots indicator */}
          <div className="flex items-center space-x-1.5">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  startTour(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentTourStepIndex
                    ? 'w-6 bg-orange-500'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={prevTourStep}
                className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={nextTourStep}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isLastStep ? 'Complete Tour' : 'Next Feature'}</span>
              {!isLastStep && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
