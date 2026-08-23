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
        background: 'radial-gradient(circle, rgba(255, 122, 48, 0.35) 0%, rgba(255, 146, 72, 0.18) 45%, rgba(255, 122, 48, 0) 70%)',
        filter: 'blur(75px)'
      }}
    />

    {/* Blob 2: Warm Peachy Golden Orange Drifting Blob */}
    <div
      className="absolute top-1/2 -right-24 w-[480px] sm:w-[650px] h-[480px] sm:h-[650px] rounded-full blob-animation-2 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 150, 60, 0.3) 0%, rgba(255, 122, 48, 0.18) 50%, rgba(255, 122, 48, 0) 75%)',
        filter: 'blur(80px)'
      }}
    />

    {/* Blob 3: Luminous Center-Floating Blob */}
    <div
      className="absolute bottom-10 left-1/3 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full blob-animation-3 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 200, 120, 0.3) 0%, rgba(255, 122, 48, 0.15) 45%, rgba(255, 122, 48, 0) 70%)',
        filter: 'blur(70px)'
      }}
    />
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
      <div className="min-h-screen liquid-glass-bg text-slate-900 flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
        <LiquidGlassBackdrop />

        {/* Top Navbar in Clean Light Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-orange-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-['Outfit'] font-black text-xl sm:text-2xl text-slate-900 tracking-wider leading-none">
                MESS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Launch QR Scanner</span>
            </button>

            <button
              onClick={logout}
              title="Logout session"
              className="flex items-center space-x-1.5 px-3 py-2 bg-white/80 hover:bg-rose-50 active:scale-95 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl border border-orange-200/80 shadow-xs transition-all cursor-pointer"
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
    <div className="min-h-screen liquid-glass-bg text-slate-900 flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
      <LiquidGlassBackdrop />

      {/* Top Header in Clean Light Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-orange-200/80 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-['Outfit'] font-black text-xl sm:text-2xl text-slate-900 tracking-wider leading-none">
                MESS
              </span>
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
            <div className="flex items-center space-x-2.5 bg-white/90 px-3 py-1.5 rounded-2xl border border-orange-200/80 shadow-xs">
              <img
                src={currentStudent.photoUrl}
                alt={currentStudent.name}
                className="w-7 h-7 rounded-full object-cover border border-[#ff7a30]"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentStudent.name}
                </div>
              </div>
            </div>

            {/* Switch Student (Demo Helper) */}
            <button
              type="button"
              onClick={() => setIsSwitchStudentOpen(true)}
              title="Switch Demo Student Profile"
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-orange-200/80 shadow-xs transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-orange-200/80 shadow-xs transition-all cursor-pointer"
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
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
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
