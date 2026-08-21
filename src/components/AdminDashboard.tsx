import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import {
  ShieldCheck,
  Users,
  UtensilsCrossed,
  PackageCheck,
  TrendingUp,
  Plus,
  Minus,
  Edit3,
  QrCode,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
  Search,
  Filter,
  MessageSquareHeart,
  Star,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  ChefHat,
  Sparkles,
  BarChart3,
  Check
} from 'lucide-react';
import { MealType, STANDARD_ALLERGENS } from '../types/mess';
import { MenuEditorModal } from './MenuEditorModal';
import { getCurrentDayOfWeek, formatTimeAmPm } from '../utils/time';

interface AdminDashboardProps {
  onOpenScanner: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenScanner }) => {
  const {
    todayCounts,
    incrementAdminHeadcount,
    weeklyMenu,
    orders,
    updateOrderStatus,
    attendanceRecords,
    students,
    anonymousFeedbacks,
    resetToDefaultData,
    todayDateStr
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<'headcount' | 'feedback' | 'allergies' | 'menu' | 'parcels'>('headcount');
  
  const [editingDay, setEditingDay] = useState<string>(todayDay);
  const [editingMealType, setEditingMealType] = useState<MealType>('lunch');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<number | 'all'>('all');
  const [feedbackMealFilter, setFeedbackMealFilter] = useState<MealType | 'all'>('all');
  const [feedbackSearch, setFeedbackSearch] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const totalHeadcountToday = todayCounts.breakfast + todayCounts.lunch + todayCounts.snacks + todayCounts.dinner;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'In Kitchen');
  const rebatesToday = attendanceRecords.filter(r => r.date === todayDateStr && r.status === 'rebate_applied').length;

  const mealSlotsList: { type: MealType; label: string; icon: typeof Coffee; color: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-amber-400 bg-amber-500/20 border border-amber-500/30' },
    { type: 'lunch', label: 'Lunch', icon: Sun, color: 'text-amber-300 bg-amber-500/20 border border-amber-500/30' },
    { type: 'snacks', label: 'High Tea', icon: Cookie, color: 'text-rose-400 bg-rose-500/20 border border-rose-500/30' },
    { type: 'dinner', label: 'Dinner', icon: Moon, color: 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30' }
  ];

  // Feedback Aggregations
  const feedbackStats = useMemo(() => {
    if (anonymousFeedbacks.length === 0) {
      return { avgRating: 0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = anonymousFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    anonymousFeedbacks.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        breakdown[f.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });
    return {
      avgRating: (sum / anonymousFeedbacks.length).toFixed(1),
      count: anonymousFeedbacks.length,
      breakdown
    };
  }, [anonymousFeedbacks]);

  // Filtered Anonymous Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return anonymousFeedbacks.filter(f => {
      if (feedbackRatingFilter !== 'all' && f.rating !== feedbackRatingFilter) return false;
      if (feedbackMealFilter !== 'all' && f.mealSlot !== feedbackMealFilter) return false;
      if (feedbackSearch.trim()) {
        const q = feedbackSearch.toLowerCase();
        const matchesDish = f.dishName.toLowerCase().includes(q);
        const matchesComment = f.comment?.toLowerCase().includes(q) || false;
        if (!matchesDish && !matchesComment) return false;
      }
      return true;
    });
  }, [anonymousFeedbacks, feedbackRatingFilter, feedbackMealFilter, feedbackSearch]);

  // Allergy Analytics
  const allergyDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    STANDARD_ALLERGENS.forEach(a => counts[a] = 0);
    students.forEach(s => {
      (s.allergies || []).forEach(a => {
        counts[a] = (counts[a] || 0) + 1;
      });
    });
    return counts;
  }, [students]);

  // Potential Clashes in today's menu
  const todayMenuClashes = useMemo(() => {
    const dayData = weeklyMenu[todayDay] || weeklyMenu['Monday'];
    const clashes: { mealSlot: MealType; dishName: string; allergens: string[]; affectedStudents: number }[] = [];
    if (!dayData) return clashes;

    (Object.keys(dayData.meals) as MealType[]).forEach(slotKey => {
      const slot = dayData.meals[slotKey];
      slot.dishes.forEach(dish => {
        if (dish.allergens && dish.allergens.length > 0) {
          const matchedStudents = students.filter(s =>
            (s.allergies || []).some(sa => dish.allergens?.some(da => da.toLowerCase() === sa.toLowerCase()))
          );
          if (matchedStudents.length > 0) {
            clashes.push({
              mealSlot: slotKey,
              dishName: dish.name,
              allergens: dish.allergens,
              affectedStudents: matchedStudents.length
            });
          }
        }
      });
    });
    return clashes;
  }, [weeklyMenu, todayDay, students]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Record ID,Student Name,Roll Number,Hostel,Room,Date,Meal,Timestamp,Method,Status\n'];
    const rows = attendanceRecords.map(r =>
      `"${r.id}","${r.studentName}","${r.rollNo}","${r.hostel}","${r.roomNo}","${r.date}","${r.mealType}","${r.timestamp}","${r.method}","${r.status}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusMess_Attendance_${todayDateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (!searchTerm) return true;
    return (
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section id="admin-dashboard-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Mess Staff & Warden Control
              </span>
              <span className="text-xs text-slate-400 font-mono">Realtime Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
              CampusMess Operations Console
            </h2>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Gate Scanner</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
            title="Reset to default prototype state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'headcount', label: 'Live Headcount & Attendance', icon: Users, badge: `${totalHeadcountToday}` },
          { id: 'feedback', label: 'Anonymous Student Feedback', icon: MessageSquareHeart, badge: `${anonymousFeedbacks.length}` },
          { id: 'allergies', label: 'Allergens & Food Safety', icon: HeartPulse, badge: `${Object.values(allergyDistribution).reduce((a: number, b: number) => a + b, 0)} Profiles` },
          { id: 'menu', label: 'Menu & Recipe Manager', icon: UtensilsCrossed },
          { id: 'parcels', label: 'Academic Parcel Deliveries', icon: PackageCheck, badge: `${pendingOrders.length} Pending` }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminActiveSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminActiveSubTab(tab.id as typeof adminActiveSubTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: HEADCOUNT & ATTENDANCE */}
      {adminActiveSubTab === 'headcount' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Meals Eaten Today
                </span>
                <div className="text-2xl font-black text-slate-100 font-mono">
                  {totalHeadcountToday}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Live headcount
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Registered Students
                </span>
                <div className="text-2xl font-black text-slate-100 font-mono">
                  {students.length} Demo Profiles
                </div>
                <div className="text-[11px] text-slate-400">All Blocks Active</div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Avg Meal Rating
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  {feedbackStats.avgRating || '4.5'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {anonymousFeedbacks.length} Anonymous ratings
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Rebates / Skips Today
                </span>
                <div className="text-2xl font-black text-slate-100 font-mono">
                  {rebatesToday}
                </div>
                <div className="text-[11px] text-blue-400">₹45 credit/meal logged</div>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Headcount Breakdown by Meal Slot with Manual Staff Adjusters */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Live Headcount Log by Meal Session ({todayDateStr})
                </h3>
                <p className="text-xs text-slate-400">
                  Tallied via QR camera scans with quick manual staff increment controls
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Central Dining Complex</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mealSlotsList.map((slot) => {
                const Icon = slot.icon;
                const count = todayCounts[slot.type];
                return (
                  <div
                    key={slot.type}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-xl ${slot.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-100">{slot.label}</span>
                      </div>
                      <span className="text-xl font-black text-slate-100 font-mono">
                        {count}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => incrementAdminHeadcount(slot.type, -1)}
                        className="p-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Decrement 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => incrementAdminHeadcount(slot.type, 1)}
                        className="flex-1 py-1 px-2 text-xs font-bold rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30 transition-colors text-center cursor-pointer"
                      >
                        +1 Headcount
                      </button>
                      <button
                        onClick={() => incrementAdminHeadcount(slot.type, 5)}
                        className="py-1 px-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ANONYMOUS STUDENT FEEDBACK ANALYTICS */}
      {adminActiveSubTab === 'feedback' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Overall Mess Satisfaction
                </span>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-black text-white font-mono">
                    {feedbackStats.avgRating}
                  </span>
                  <span className="text-sm text-slate-400 font-bold">/ 5.0</span>
                </div>
                <div className="flex items-center space-x-1 mt-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(Number(feedbackStats.avgRating) || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-800">
                Calculated from <strong className="text-slate-200">{feedbackStats.count}</strong> anonymous student reviews
              </div>
            </div>

            {/* Rating Distribution Bar Breakdown */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl md:col-span-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Star Rating Breakdown
              </span>
              <div className="space-y-1.5 pt-1">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = feedbackStats.breakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
                  const pct = feedbackStats.count > 0 ? Math.round((count / feedbackStats.count) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center space-x-2 text-xs">
                      <span className="w-12 font-mono text-slate-300 font-bold flex items-center gap-1">
                        {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stars >= 4 ? 'bg-emerald-500' : stars === 3 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-slate-400">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Filter Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  placeholder="Search dish or student comment..."
                  className="text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <select
                value={feedbackMealFilter}
                onChange={(e) => setFeedbackMealFilter(e.target.value as MealType | 'all')}
                className="text-xs p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-hidden capitalize"
              >
                <option value="all">All Meal Slots</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">High Tea / Snacks</option>
                <option value="dinner">Dinner</option>
              </select>

              <select
                value={feedbackRatingFilter}
                onChange={(e) => setFeedbackRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="text-xs p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-hidden"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                <option value="4">4 Stars ⭐⭐⭐⭐</option>
                <option value="3">3 Stars ⭐⭐⭐</option>
                <option value="2">2 Stars ⭐⭐</option>
                <option value="1">1 Star ⭐</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong className="text-slate-200">{filteredFeedbacks.length}</strong> anonymous reviews
            </div>
          </div>

          {/* Feedback Feed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 uppercase tracking-wider border border-slate-700">
                        {fb.mealSlot}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">
                        {fb.dishName}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-mono font-bold text-xs text-white">{fb.rating}.0</span>
                    </div>
                  </div>

                  {fb.comment && (
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      "{fb.comment}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{fb.timestamp}</span>
                  <span className="text-teal-400 font-bold">🔒 Anonymous Verified Student</span>
                </div>
              </div>
            ))}
          </div>

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-10 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
              <p className="text-sm text-slate-400">No anonymous feedback matches your current filter.</p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: ALLERGENS & CAMPUS FOOD SAFETY */}
      {adminActiveSubTab === 'allergies' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Allergen Distribution Summary */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Campus-Wide Student Allergy Registry
                </h3>
                <p className="text-xs text-slate-400">
                  Aggregated statistics of declared allergens across registered hostel resident students
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STANDARD_ALLERGENS.map((alg) => {
                const count = allergyDistribution[alg] || 0;
                return (
                  <div
                    key={alg}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-100">{alg}</div>
                      <div className="text-[10px] text-slate-400">Declared Students</div>
                    </div>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Menu Allergen Cross-Reference Clashes */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Today's Menu Food Safety Matrix ({todayDay})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Dishes served today containing allergens flagged by student dietary profiles
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {todayMenuClashes.length} Dishes with declared allergens
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Meal Slot</th>
                    <th className="pb-2.5">Dish Name</th>
                    <th className="pb-2.5">Contained Allergens</th>
                    <th className="pb-2.5">Affected Registered Students</th>
                    <th className="pb-2.5 text-right">Kitchen Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {todayMenuClashes.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold uppercase text-slate-200">{c.mealSlot}</td>
                      <td className="py-3 font-bold text-slate-100">{c.dishName}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.allergens.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-amber-400 font-bold">
                        ~{c.affectedStudents} Students at risk
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[11px] px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                          Clear Labeling Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 4: MENU & RECIPE MANAGER */}
      {adminActiveSubTab === 'menu' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Hostel Daily Menu & Recipe Manager
              </h3>
              <p className="text-xs text-slate-400">
                Select any day and meal slot to configure ingredients, declared allergens, and specials
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={editingDay}
                onChange={(e) => setEditingDay(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-100">{d}</option>
                ))}
              </select>

              <select
                value={editingMealType}
                onChange={(e) => setEditingMealType(e.target.value as MealType)}
                className="text-xs p-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-bold capitalize focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="breakfast" className="bg-slate-900 text-slate-100">Breakfast</option>
                <option value="lunch" className="bg-slate-900 text-slate-100">Lunch</option>
                <option value="snacks" className="bg-slate-900 text-slate-100">High Tea / Snacks</option>
                <option value="dinner" className="bg-slate-900 text-slate-100">Dinner</option>
              </select>

              <button
                onClick={() => setIsEditorOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Slot Items</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-100">{editingDay} • {editingMealType.toUpperCase()}</span>
              <div className="text-slate-400 font-mono mt-0.5">
                {weeklyMenu[editingDay]?.meals[editingMealType]?.timing}
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {weeklyMenu[editingDay]?.meals[editingMealType]?.dishes?.map((d) => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-slate-100">{d.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Allergens: {d.allergens?.join(', ') || 'None listed'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-xs font-bold text-amber-400 hover:underline self-start md:self-auto cursor-pointer"
            >
              Modify Dishes & Allergens →
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: ACADEMIC PARCEL DELIVERIES */}
      {adminActiveSubTab === 'parcels' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Academic Block Parcel Delivery Dispatch Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Manage packing and dispatch states for students ordering meals to academic departments
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search roll, name, block..."
                  className="text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="text-xs p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-100">All Statuses</option>
                <option value="Pending" className="bg-slate-900 text-slate-100">Pending</option>
                <option value="In Kitchen" className="bg-slate-900 text-slate-100">In Kitchen</option>
                <option value="Dispatched" className="bg-slate-900 text-slate-100">Dispatched</option>
                <option value="Delivered" className="bg-slate-900 text-slate-100">Delivered</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Student / Contact</th>
                  <th className="pb-2.5">Academic Building & Room</th>
                  <th className="pb-2.5">Items & Packaging</th>
                  <th className="pb-2.5">Slot / Time</th>
                  <th className="pb-2.5">Current Status</th>
                  <th className="pb-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-100">{ord.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-100">{ord.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.phone} {ord.rollNo ? `(${ord.rollNo})` : ''}</div>
                    </td>
                    <td className="py-3 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">{ord.blockName}</div>
                      <div className="text-[10px] text-slate-400">{ord.roomFloor}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-200">
                        {ord.items.map(i => `${i.dishName} x${i.quantity}`).join(', ')}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {ord.packingType}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      <div>{ord.orderTime}</div>
                      <div className="text-[10px] text-slate-500">{ord.deliverySlot}</div>
                    </td>
                    <td className="py-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as typeof ord.status)}
                        className={`text-xs font-bold p-1 rounded-lg border cursor-pointer ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : ord.status === 'Dispatched'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : ord.status === 'In Kitchen'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900 text-slate-100">Pending</option>
                        <option value="In Kitchen" className="bg-slate-900 text-slate-100">In Kitchen</option>
                        <option value="Dispatched" className="bg-slate-900 text-slate-100">Dispatched</option>
                        <option value="Delivered" className="bg-slate-900 text-slate-100">Delivered</option>
                        <option value="Cancelled" className="bg-slate-900 text-slate-100">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      {ord.status !== 'Delivered' ? (
                        <button
                          onClick={() => {
                            const nextStatus =
                              ord.status === 'Pending'
                                ? 'In Kitchen'
                                : ord.status === 'In Kitchen'
                                ? 'Dispatched'
                                : 'Delivered';
                            updateOrderStatus(ord.id, nextStatus);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700 cursor-pointer"
                        >
                          Advance →
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Editor Modal */}
      {isEditorOpen && (
        <MenuEditorModal
          day={editingDay}
          mealType={editingMealType}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-100">Reset Demo Data?</h4>
            <p className="text-xs text-slate-300">
              This will restore all default weekly menus, sample student attendance logs, feedback, and parcel orders.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
