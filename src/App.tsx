import React, { useState } from 'react';
import { MessProvider, useMess, NavigationTab } from './context/MessContext';
import { LoginPage } from './components/LoginPage';
import { MenuDisplay } from './components/MenuDisplay';
import { StudentPassView } from './components/StudentPassView';
import { AcademicBlockOrder } from './components/AcademicBlockOrder';
import { DayScholarOrder } from './components/DayScholarOrder';
import { FoodCourtOrder } from './components/FoodCourtOrder';
import { AnonymousFeedbackForm } from './components/AnonymousFeedbackForm';
import { SkeletonLoader } from './components/SkeletonLoader';

// Lazy loaded heavy components
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const FoodCourtOwnerDashboard = React.lazy(() => import('./components/FoodCourtOwnerDashboard').then(module => ({ default: module.FoodCourtOwnerDashboard })));
import { NearbyRestaurantsView } from './components/NearbyRestaurantsView';
import { QRScannerModal } from './components/QRScannerModal';
import { SwitchStudentModal } from './components/SwitchStudentModal';
import { EditProfileModal } from './components/EditProfileModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { translations } from './utils/translations';
import ChromeButton from './components/ui/chrome-button';
import { getActiveMealStatus } from './utils/time';
import {
  UtensilsCrossed,
  QrCode,
  Package,
  Store,
  MessageSquareHeart,
  LogOut,
  AlertTriangle,
  UserCheck,
  Phone,
  Building2,
  ChefHat,
  Sparkles,
  Mic
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
    currentStudent,
    foodCourtStalls,
    switchVendorStall,
    loginVendor,
    loginAdmin,
    loginStudent,
    currentLanguage,
    setLanguage,
    isVoiceSearchOpen,
    setIsVoiceSearchOpen
  } = useMess();

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isSwitchStudentOpen, setIsSwitchStudentOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);

  const t = translations[currentLanguage] || translations.en;
  const mealStatus = getActiveMealStatus();

  // If user is not logged in, render University Web Portal Login Page
  if (!currentSession) {
    return (
      <>
        <LoginPage />
        <OfflineIndicator />
      </>
    );
  }

  // =========================================================================
  // VIEW 1: FOOD COURT OWNER / VENDOR DASHBOARD (THIRD PAGE)
  // =========================================================================
  if (currentSession.role === 'vendor') {
    const isNearbyResto = currentSession.partnerType === 'nearby_resto' || Boolean(currentSession.restoId);
    const currentStall = foodCourtStalls.find(s => s.id === currentSession.stallId) || foodCourtStalls[0];

    return (
      <div className="min-h-screen liquid-glass-bg text-slate-900 flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
        <LiquidGlassBackdrop />

        {/* Top Navbar in Clean Light Liquid Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/90 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(249,115,22,0.06)]">
          {/* Brand & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-white/40">
              {isNearbyResto ? (
                <UtensilsCrossed className="w-5 h-5 text-white" />
              ) : (
                <Store className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Outfit'] font-black text-lg sm:text-xl text-slate-900 tracking-wider leading-none">
                  {isNearbyResto ? 'RESTAURANT PARTNER' : 'FOOD COURT OWNER'}
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                  Partner Portal
                </span>
              </div>
              <p className="text-[11px] text-[#ea580c] font-bold">
                {isNearbyResto 
                  ? `${currentSession.restoName || 'Partner Restaurant'} (Hostel Delivery Hub)`
                  : `${currentSession.stallName || currentStall?.name} (${currentStall?.stallNumber || 'Stall'})`}
              </p>
            </div>
          </div>

          {/* Controls: PWA & Helpline & Logout */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* PWA Install */}
            <PWAInstallButton compact />

            {/* Helpline */}
            <a
              href="tel:9335568951"
              title="Campus Food Court Supervisor Desk"
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 rounded-full text-xs font-bold font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>+91 9335568951</span>
            </a>

            {/* QR Scanner for Token Verification */}
            <ChromeButton
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-full shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95 border border-white/30"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Scan Token QR</span>
            </ChromeButton>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Logout vendor session"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/80 backdrop-blur-xl hover:bg-emerald-50/90 active:scale-95 text-slate-700 hover:text-emerald-800 text-xs font-bold rounded-full border border-orange-200/70 shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Food Court Owner Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto relative z-10">
          <React.Suspense fallback={<SkeletonLoader />}>
            <FoodCourtOwnerDashboard onOpenScanner={() => setIsScannerOpen(true)} />
          </React.Suspense>
        </main>

        {/* Modals */}
        {isScannerOpen && <QRScannerModal onClose={() => setIsScannerOpen(false)} />}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: MESS ADMIN / WARDEN DASHBOARD
  // =========================================================================
  if (currentSession.role === 'admin') {
    return (
      <div className="min-h-screen liquid-glass-bg text-slate-900 flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
        <LiquidGlassBackdrop />

        {/* Top Navbar in Clean Light Liquid Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-2xl border-b border-white/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_10px_30px_rgba(249,115,22,0.06)]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-white/40">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-['Outfit'] font-black text-xl sm:text-2xl text-slate-900 tracking-wider leading-none">
                CAMPUS MESS AND FOOD COURT
              </span>
              <span className="block text-[11px] font-bold text-[#ea580c]">
                Authority &amp; Warden Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* PWA Install */}
            <PWAInstallButton compact />

            {/* 24x7 Helpline Support */}
            <a
              href="tel:9335568951"
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 rounded-full text-xs font-bold font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>+91 9335568951</span>
            </a>

            <ChromeButton
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-full shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95 border border-white/30"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Launch QR Scanner</span>
            </ChromeButton>

            <button
              onClick={logout}
              title="Logout session"
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/75 backdrop-blur-xl hover:bg-emerald-50/90 active:scale-95 text-slate-700 hover:text-emerald-800 text-xs font-bold rounded-full border border-orange-200/70 shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto relative z-10">
          <React.Suspense fallback={<SkeletonLoader />}>
            <AdminDashboard onOpenScanner={() => setIsScannerOpen(true)} />
          </React.Suspense>
        </main>

        {/* Modals */}
        {isScannerOpen && <QRScannerModal onClose={() => setIsScannerOpen(false)} />}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STUDENT HOSTELER PORTAL
  // =========================================================================
  const studentNavTabs: { id: NavigationTab; label: string; icon: typeof UtensilsCrossed; badge?: string }[] = [
    { id: 'menu', label: t.navMenu, icon: UtensilsCrossed },
    { id: 'pass', label: t.navPass, icon: QrCode },
    { id: 'nearbyresto', label: t.navRestaurants, icon: Store },
    { id: 'foodcourt', label: t.navFoodCourt, icon: Store },
    { id: 'parcel', label: t.navParcel, icon: Package },
    { id: 'dayscholar', label: t.navDayScholar, icon: Store },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquareHeart }
  ];

  return (
    <div className="min-h-screen liquid-glass-bg text-slate-900 flex flex-col font-sans selection:bg-[#ff7a30] selection:text-white relative glass-theme-wrapper">
      <LiquidGlassBackdrop />

      {/* Top Header in Clean Light Liquid Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-2xl border-b border-white/80 px-4 sm:px-6 py-3 shadow-[0_10px_30px_rgba(249,115,22,0.06)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-white/40 shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-['Outfit'] font-black text-sm sm:text-xl md:text-2xl text-slate-900 tracking-wider leading-none block truncate">
                CAMPUS DINING
              </span>
            </div>
          </div>

          {/* Right: Controls, Voice & Interactive Tap Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* PWA Install */}
            <PWAInstallButton compact />

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(true)}
              title="Voice Search Dishes & Stalls"
              className="p-2 rounded-full bg-white/80 hover:bg-amber-50 text-slate-700 hover:text-amber-600 border border-orange-200/70 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-600" />
            </button>

            {/* Allergen Warning Pill if any */}
            {currentStudent.allergies && currentStudent.allergies.length > 0 && (
              <div
                title={`Allergens tracked: ${currentStudent.allergies.join(', ')}`}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/40 text-emerald-800 text-[11px] font-bold shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{currentStudent.allergies.length} Allergens</span>
              </div>
            )}

            {/* Tap Student Profile Pill to Edit Information */}
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              title="Tap to Edit Profile & Personal Details"
              className="flex items-center space-x-2 bg-white/90 hover:bg-orange-50/90 active:scale-95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-orange-200/90 shadow-xs transition cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={currentStudent.photoUrl}
                  alt={currentStudent.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-[#ff7a30]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#ff7a30] text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs">
                  ✎
                </span>
              </div>
              <div className="text-left pr-0.5">
                <div className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight truncate max-w-[110px] sm:max-w-[140px]">
                  {currentStudent.name}
                </div>
                <div className="text-[10px] text-orange-600 font-bold leading-none">
                  Edit Profile
                </div>
              </div>
            </button>

            {/* Switch Student (Demo Helper) */}
            <button
              type="button"
              onClick={() => setIsSwitchStudentOpen(true)}
              title="Switch Demo Student Profile"
              className="p-2 rounded-full bg-white/75 backdrop-blur-xl hover:bg-white text-slate-700 hover:text-slate-950 border border-orange-200/70 shadow-xs transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-full bg-white/75 backdrop-blur-xl hover:bg-emerald-50/90 text-slate-700 hover:text-emerald-800 border border-orange-200/70 shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Navigation Bar - Oval Pill Container */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-orange-200/50 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
          {studentNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/75 backdrop-blur-md'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto relative z-10">
        {activeTab === 'menu' && <MenuDisplay />}
        {activeTab === 'pass' && (
          <StudentPassView
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSwitchStudent={() => setIsSwitchStudentOpen(false)}
          />
        )}
        {activeTab === 'nearbyresto' && <NearbyRestaurantsView />}
        {activeTab === 'foodcourt' && <FoodCourtOrder />}
        {activeTab === 'parcel' && <AcademicBlockOrder />}
        {activeTab === 'dayscholar' && <DayScholarOrder />}
        {activeTab === 'feedback' && <AnonymousFeedbackForm />}
      </main>

      {/* Mobile Bottom Navigation Bar (Handheld Phone Safe-Area Navigation) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Modals & Overlays */}
      {isScannerOpen && <QRScannerModal onClose={() => setIsScannerOpen(false)} />}
      {isSwitchStudentOpen && <SwitchStudentModal onClose={() => setIsSwitchStudentOpen(false)} />}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearchResult={() => {
          setActiveTab('foodcourt');
        }}
      />
      <OfflineIndicator />
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
