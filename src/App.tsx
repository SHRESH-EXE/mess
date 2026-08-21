/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessProvider, useMess } from './context/MessContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MenuDisplay } from './components/MenuDisplay';
import { StudentPassView } from './components/StudentPassView';
import { AcademicBlockOrder } from './components/AcademicBlockOrder';
import { DayScholarOrder } from './components/DayScholarOrder';
import { AdminDashboard } from './components/AdminDashboard';
import { AnonymousFeedbackForm } from './components/AnonymousFeedbackForm';
import { QRScannerModal } from './components/QRScannerModal';
import { SwitchStudentModal } from './components/SwitchStudentModal';
import {
  UtensilsCrossed,
  QrCode,
  Send,
  Store,
  ShieldCheck,
  MessageSquareHeart
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, currentSession } = useMess();
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isSwitchStudentOpen, setIsSwitchStudentOpen] = useState<boolean>(false);

  // If no active session, show Login Page
  if (!currentSession) {
    return (
      <div className="animate-in fade-in duration-300">
        <LoginPage />
      </div>
    );
  }

  const isAdmin = currentSession.role === 'admin';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Top Application Header */}
      <Header
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSwitchStudent={() => setIsSwitchStudentOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'menu' && <MenuDisplay />}
        {activeTab === 'pass' && (
          <StudentPassView
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSwitchStudent={() => setIsSwitchStudentOpen(true)}
          />
        )}
        {activeTab === 'parcel' && <AcademicBlockOrder />}
        {activeTab === 'dayscholar' && <DayScholarOrder />}
        {activeTab === 'feedback' && <AnonymousFeedbackForm />}
        {activeTab === 'admin' && (
          <AdminDashboard onOpenScanner={() => setIsScannerOpen(true)} />
        )}
      </main>

      {/* Modals */}
      {isScannerOpen && (
        <QRScannerModal onClose={() => setIsScannerOpen(false)} />
      )}
      {isSwitchStudentOpen && (
        <SwitchStudentModal onClose={() => setIsSwitchStudentOpen(false)} />
      )}

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        {[
          { id: 'menu' as const, label: 'Menu', icon: UtensilsCrossed },
          { id: 'pass' as const, label: 'Pass', icon: QrCode },
          { id: 'parcel' as const, label: 'Parcel', icon: Send },
          { id: 'dayscholar' as const, label: 'Day Scholar', icon: Store },
          { id: 'feedback' as const, label: 'Rate', icon: MessageSquareHeart },
          { id: 'admin' as const, label: 'Admin', icon: ShieldCheck }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[9px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Campus Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/20">
              CM
            </div>
            <div>
              <span className="font-bold text-slate-100">CampusMess Hub</span>
              <p className="text-[11px] text-slate-400">
                Allergen-Safe Hostel Dining Logistics & Anonymous Student Pulse
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>Mess Helpline: <strong className="text-slate-200">+91 98765 43210</strong></span>
            <span className="text-slate-600">•</span>
            <span>Kitchen Timings: <strong className="text-slate-200">07:30 AM - 10:00 PM</strong></span>
            <span className="text-slate-600">•</span>
            <span>Hostel Committee Room 102</span>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 Campus Hostel Council
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <MessProvider>
      <MainApp />
    </MessProvider>
  );
}
