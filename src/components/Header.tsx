import React, { useState, useEffect } from 'react';
import { useMess, NavigationTab } from '../context/MessContext';
import {
  UtensilsCrossed,
  QrCode,
  Send,
  ShieldCheck,
  Clock,
  Calendar,
  Bell,
  MessageSquareHeart,
  ChevronDown,
  Sparkles,
  Flame,
  UserCheck,
  LogOut,
  AlertTriangle,
  HeartHandshake,
  Store
} from 'lucide-react';
import { getActiveMealStatus, formatTimeAmPm, formatDateFull } from '../utils/time';

interface HeaderProps {
  onOpenSwitchStudent: () => void;
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSwitchStudent, onOpenScanner }) => {
  const {
    activeTab,
    setActiveTab,
    currentStudent,
    currentSession,
    logout,
    announcements,
    todayCounts,
    dayScholarOrders,
    anonymousFeedbacks
  } = useMess();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showAnnouncements, setShowAnnouncements] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mealStatus = getActiveMealStatus(currentTime);
  const isAdmin = currentSession?.role === 'admin';

  // Navigation Items
  const studentNavItems = [
    {
      id: 'menu' as NavigationTab,
      label: "Today's Menu",
      icon: UtensilsCrossed,
      badge: mealStatus.status === 'ongoing' ? 'LIVE' : undefined
    },
    {
      id: 'pass' as NavigationTab,
      label: 'Meal Pass & Allergies',
      icon: QrCode,
      badge: currentStudent.allergies?.length > 0 ? `${currentStudent.allergies.length} Allergens` : undefined
    },
    {
      id: 'parcel' as NavigationTab,
      label: 'Parcel (Academic Block)',
      icon: Send,
      badge: 'WhatsApp'
    },
    {
      id: 'dayscholar' as NavigationTab,
      label: 'Day Scholar Order',
      icon: Store,
      badge: 'À La Carte'
    },
    {
      id: 'feedback' as NavigationTab,
      label: 'Rate Meals (Anonymous)',
      icon: MessageSquareHeart,
      badge: 'Protected'
    }
  ];

  const adminNavItems = [
    {
      id: 'admin' as NavigationTab,
      label: 'Admin Operations Hub',
      icon: ShieldCheck,
      badge: `${todayCounts.breakfast + todayCounts.lunch + todayCounts.snacks + todayCounts.dinner} Eaten`
    },
    {
      id: 'dayscholar' as NavigationTab,
      label: 'Day Scholar Orders',
      icon: Store,
      badge: `${dayScholarOrders.length} Orders`
    },
    {
      id: 'menu' as NavigationTab,
      label: 'Public Menu View',
      icon: UtensilsCrossed
    },
    {
      id: 'feedback' as NavigationTab,
      label: 'Student Feedback Stream',
      icon: MessageSquareHeart,
      badge: `${anonymousFeedbacks.length} Reviews`
    }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <header id="campusmess-header" className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Notification Bar / Live Ticker */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 text-amber-200 text-xs px-3 py-1.5 font-medium border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wide uppercase border border-amber-500/30">
              <Flame className="w-3 h-3 mr-1 text-amber-400 inline animate-pulse" />
              Live Mess Status
            </span>
            <span className="font-medium text-slate-200">
              {mealStatus.label} ({mealStatus.timeWindow}) • <span className="text-amber-400">{mealStatus.countdownText}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatDateFull(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-0.5 rounded-full font-mono text-amber-300 border border-slate-700/80 shadow-xs">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{formatTimeAmPm(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Brand Logo & Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'menu')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                  CampusMess<span className="text-amber-400">Hub</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>100% Pure Veg</span>
                </span>
                {isAdmin ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 uppercase">
                    Admin Portal
                  </span>
                ) : (
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
                    Hostel Dining v2.5
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                100% Pure Veg Allergen-Safe Hostel Dining, QR Tokens & Anonymous Student Pulse
              </p>
            </div>
          </div>

          {/* Quick Actions & Profile Header */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick QR Scan Entry Trigger */}
            <button
              id="quick-scan-button"
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow transition-all duration-150 active:scale-95 cursor-pointer"
              title="Open QR Scanner"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden md:inline">Scan Entry</span>
            </button>

            {/* Announcements Dropdown */}
            <div className="relative">
              <button
                id="announcements-toggle-btn"
                onClick={() => setShowAnnouncements(!showAnnouncements)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Mess Notices"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-950"></span>
                )}
              </button>

              {/* Announcements Popover */}
              {showAnnouncements && (
                <div
                  id="announcements-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-200 font-semibold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Mess Committee Notices</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{announcements.length} active</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto px-3 py-2 space-y-2">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-100">{ann.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                            {ann.tag}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{ann.message}</p>
                        <div className="mt-1.5 text-[10px] text-slate-500 font-mono">{ann.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Profile Badge / Switcher Pill */}
            {isAdmin ? (
              <div
                id="admin-session-pill"
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-left shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-amber-300 leading-tight flex items-center gap-1">
                    <span>{currentSession?.name || 'Mess Admin'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentSession?.designation || 'Mess Authority'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="student-switcher-btn"
                onClick={onOpenSwitchStudent}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-amber-500/40 border border-slate-800 transition-all text-left group shadow-xs cursor-pointer"
                title="Switch Student Profile"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-100 leading-tight group-hover:text-amber-300 flex items-center gap-1">
                    <span>{currentStudent.name}</span>
                    <UserCheck className="w-3 h-3 text-emerald-400 inline" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentStudent.rollNo} • {currentStudent.roomNo}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
              </button>
            )}

            {/* Persistent Logout Button */}
            <button
              id="header-logout-btn"
              onClick={logout}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-red-950/70 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800/80 transition-all duration-150 active:scale-95 text-xs font-semibold shadow-xs cursor-pointer"
              title="End Session & Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav id="main-navigation-tabs" className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none border-t border-slate-850">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : item.id === 'parcel'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.id === 'feedback'
                        ? 'bg-teal-950 text-teal-300 border border-teal-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Toggle for Role Switch Preview if in Student Mode */}
          {!isAdmin && (
            <button
              id="switch-to-admin-view-tab"
              onClick={() => setActiveTab('admin')}
              className="ml-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-slate-800/80 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Admin Mode</span>
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
