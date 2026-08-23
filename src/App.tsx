import React, { useState } from 'react';
import { MessProvider, useMess, NavigationTab } from './context/MessContext';
import { LoginPage } from './components/LoginPage';
import { MenuDisplay } from './components/MenuDisplay';
import { StudentPassView } from './components/StudentPassView';
import { AcademicBlockOrder } from './components/AcademicBlockOrder';
import { DayScholarOrder } from './components/DayScholarOrder';
import { AnonymousFeedbackForm } from './components/AnonymousFeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { QRScannerModal } from './components/QRScannerModal';
import { SwitchStudentModal } from './components/SwitchStudentModal';
import { getActiveMealStatus } from './utils/time';
import {
  UtensilsCrossed,
  QrCode,
  Package,
  Store,
  MessageSquareHeart,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

const LiquidGlassBackdrop: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Blob 1: Deep Vibrant Orange Drifting Blob */}
    <div
      className="absolute -top-20 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full blob-animation-1 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 122, 48, 0.38) 0%, rgba(255, 146, 72, 0.2) 45%, rgba(255, 247, 240, 0) 70%)',
        filter: 'blur(75px)'
      }}
    />

    {/* Blob 2: Warm Peachy Golden Orange Drifting Blob */}
    <div
      className="absolute top-1/2 -right-24 w-[480px] sm:w-[650px] h-[480px] sm:h-[650px] rounded-full blob-animation-2 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 176, 102, 0.45) 0%, rgba(255, 122, 48, 0.25) 50%, rgba(255, 237, 213, 0) 75%)',
        filter: 'blur(80px)'
      }}
    />

    {/* Blob 3: Light Peachy-White Luminous Center-Floating Blob */}
    <div
      className="absolute bottom-10 left-1/3 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full blob-animation-3 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(255, 237, 213, 0.35) 45%, rgba(255, 176, 102, 0) 70%)',
        filter: 'blur(70px)'
      }}
    />

    {/* Soft subtle ambient warm vignette */}
    <div className="absolute inset-0 bg-radial from-transparent via-orange-950/[0.015] to-orange-950/[0.04] pointer-events-none" />
  </div>
);

const MainAppContent: React.FC = () => {
  const {
    currentSession,
    logout,
    activeTab,
    setActiveTab,
    currentStudent
  } = useMess();

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isSwitchStudentOpen, setIsSwitchStudentOpen] = useState<boolean>(false);

  const mealStatus = getActiveMealStatus();

  // If user is not logged in, render University Web Portal Login Page
  if (!currentSession) {
    return <LoginPage />;
  }

  // Admin View
  if (currentSession.role === 'admin') {
    return (
      <div className="min-h-screen liquid-glass-bg text-[#2e170d] flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
        <LiquidGlassBackdrop />

        {/* Top Navbar in Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-xl border-b border-white/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_4px_24px_rgba(255,122,48,0.1)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/70 border border-white/90 flex items-center justify-center text-[#ff7a30] shadow-[0_4px_16px_rgba(255,122,48,0.15)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-[#2e170d] tracking-tight">
                  Lovely Professional University Mess Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  100% Pure Veg
                </span>
              </div>
              <p className="text-xs text-[#9a3412] font-semibold">
                Logged in as <strong className="text-[#2e170d]">{currentSession.name}</strong> ({currentSession.designation || 'Staff'})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl shadow-[0_4px_16px_rgba(255,122,48,0.3)] transition-all cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Launch QR Scanner</span>
            </button>

            <button
              onClick={logout}
              title="Logout session"
              className="flex items-center space-x-1.5 px-3 py-2 bg-white/55 hover:bg-white/85 active:scale-95 text-[#6c2e11] hover:text-[#2e170d] text-xs font-bold rounded-xl border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto relative z-10">
          <AdminDashboard onOpenScanner={() => setIsScannerOpen(true)} />
        </main>

        {/* Modals */}
        {isScannerOpen && <QRScannerModal onClose={() => setIsScannerOpen(false)} />}
      </div>
    );
  }

  // Student Navigation Tabs
  const studentNavTabs: { id: NavigationTab; label: string; icon: typeof UtensilsCrossed; badge?: string }[] = [
    { id: 'menu', label: "Today's Menu", icon: UtensilsCrossed },
    { id: 'pass', label: 'Digital Meal Pass', icon: QrCode },
    { id: 'parcel', label: 'Academic Block Delivery', icon: Package },
    { id: 'dayscholar', label: 'Day Scholar Canteen', icon: Store },
    { id: 'feedback', label: 'Mess Feedback', icon: MessageSquareHeart }
  ];

  return (
    <div className="min-h-screen liquid-glass-bg text-[#2e170d] flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
      <LiquidGlassBackdrop />

      {/* Top Header in Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-xl border-b border-white/80 px-4 sm:px-6 py-3 shadow-[0_4px_24px_rgba(255,122,48,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Active Meal Indicator */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/70 border border-white/90 flex items-center justify-center text-[#ff7a30] shadow-[0_4px_16px_rgba(255,122,48,0.15)]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-[#2e170d] tracking-tight">
                  LPU CampusMess Hub
                </span>
                <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  100% Pure Veg
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#9a3412] font-semibold">
                <span className="capitalize font-bold text-[#ff7a30] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a30] animate-pulse" />
                  {mealStatus.currentMeal} Slot Active
                </span>
                <span>•</span>
                <span>{currentStudent.hostel}</span>
              </div>
            </div>
          </div>

          {/* Right: Student Profile & Controls */}
          <div className="flex items-center space-x-3">
            {/* Allergen Warning Pill if any */}
            {currentStudent.allergies && currentStudent.allergies.length > 0 && (
              <div
                title={`Allergens tracked: ${currentStudent.allergies.join(', ')}`}
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-[11px] font-bold shadow-xs"
              >
                <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                <span>{currentStudent.allergies.length} Allergens</span>
              </div>
            )}

            {/* Student Info Pill */}
            <div className="flex items-center space-x-2.5 bg-white/55 px-3 py-1.5 rounded-2xl border border-white/80 shadow-xs">
              <img
                src={currentStudent.photoUrl}
                alt={currentStudent.name}
                className="w-7 h-7 rounded-full object-cover border border-[#ff7a30]/50"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#2e170d] leading-tight">
                  {currentStudent.name}
                </div>
                <div className="text-[10px] text-[#9a3412] font-mono font-bold">
                  {currentStudent.rollNo} • {currentStudent.roomNo}
                </div>
              </div>
            </div>

            {/* Switch Student (Demo Helper) */}
            <button
              type="button"
              onClick={() => setIsSwitchStudentOpen(true)}
              title="Switch Demo Student Profile"
              className="p-2 rounded-xl bg-white/55 hover:bg-white/85 text-[#6c2e11] hover:text-[#2e170d] border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl bg-white/55 hover:bg-rose-100 text-[#6c2e11] hover:text-rose-800 border border-white/80 hover:border-rose-300 shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-orange-200/60 flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
          {studentNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-[0_4px_16px_rgba(255,122,48,0.28)]'
                    : 'text-[#6c2e11] hover:text-[#2e170d] hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto relative z-10">
        {activeTab === 'menu' && <MenuDisplay />}
        {activeTab === 'pass' && (
          <StudentPassView
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSwitchStudent={() => setIsSwitchStudentOpen(false)}
          />
        )}
        {activeTab === 'parcel' && <AcademicBlockOrder />}
        {activeTab === 'dayscholar' && <DayScholarOrder />}
        {activeTab === 'feedback' && <AnonymousFeedbackForm />}
      </main>

      {/* Modals */}
      {isScannerOpen && <QRScannerModal onClose={() => setIsScannerOpen(false)} />}
      {isSwitchStudentOpen && <SwitchStudentModal onClose={() => setIsSwitchStudentOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <MessProvider>
      <MainAppContent />
    </MessProvider>
  );
}
