import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { MealType } from '../types/mess';
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
    resetToDefaultData,
    todayDateStr
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const [editingDay, setEditingDay] = useState<string>(todayDay);
  const [editingMealType, setEditingMealType] = useState<MealType>('lunch');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
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
              CampusMess Operations & Headcount Console
            </h2>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Gate Scanner</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors border border-slate-700"
            title="Reset to default prototype state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Eaten Today */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Meals Eaten Today
            </span>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {totalHeadcountToday}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Normal dining volume
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* Total Active Hostelers */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Registered Hostelers
            </span>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {students.length * 410 + 12}
            </div>
            <div className="text-[11px] text-slate-400">Across 4 Hostel Blocks</div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Parcel Orders */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pending Parcels
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-amber-300 font-semibold">
              Academic Block Deliveries
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Rebates Processed */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rebates / Skips Today
            </span>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {rebatesToday}
            </div>
            <div className="text-[11px] text-blue-400">Outstation leaves approved</div>
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
              Auto-tallied via QR scans and turnstile gate sensors with manual increment controls
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Campus Central Mess Hall</span>
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

                {/* Adjuster Buttons */}
                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => incrementAdminHeadcount(slot.type, -1)}
                    className="p-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
                    title="Decrement 1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => incrementAdminHeadcount(slot.type, 1)}
                    className="flex-1 py-1 px-2 text-xs font-bold rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30 transition-colors text-center"
                  >
                    +1 Eaten
                  </button>
                  <button
                    onClick={() => incrementAdminHeadcount(slot.type, 5)}
                    className="py-1 px-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    +5
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Menu Item Updater Card */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Hostel Daily Menu Manager
            </h3>
            <p className="text-xs text-slate-400">
              Select any day and meal slot to add specials, edit dish names, or adjust timings
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={editingDay}
              onChange={(e) => setEditingDay(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-bold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-100">{d}</option>
              ))}
            </select>

            <select
              value={editingMealType}
              onChange={(e) => setEditingMealType(e.target.value as MealType)}
              className="text-xs p-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-bold capitalize focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <option value="breakfast" className="bg-slate-900 text-slate-100">Breakfast</option>
              <option value="lunch" className="bg-slate-900 text-slate-100">Lunch</option>
              <option value="snacks" className="bg-slate-900 text-slate-100">High Tea / Snacks</option>
              <option value="dinner" className="bg-slate-900 text-slate-100">Dinner</option>
            </select>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Menu Dishes</span>
            </button>
          </div>
        </div>

        {/* Current Selected Slot Preview */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-100">{editingDay} • {editingMealType.toUpperCase()}</span>
            <div className="text-slate-400 font-mono mt-0.5">
              {weeklyMenu[editingDay]?.meals[editingMealType]?.timing}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {weeklyMenu[editingDay]?.meals[editingMealType]?.dishes?.map((d) => (
                <span key={d.id} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-medium text-slate-300">
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditorOpen(true)}
            className="text-xs font-bold text-amber-400 hover:underline self-start md:self-auto"
          >
            Modify Dishes & Tags →
          </button>
        </div>
      </div>

      {/* Academic Block Delivery Dispatch Board */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Academic Block Delivery Dispatch Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Manage packing and dispatch states for students ordering via WhatsApp
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
              className="text-xs p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-hidden"
            >
              <option value="all" className="bg-slate-900 text-slate-100">All Statuses</option>
              <option value="Pending" className="bg-slate-900 text-slate-100">Pending</option>
              <option value="In Kitchen" className="bg-slate-900 text-slate-100">In Kitchen</option>
              <option value="Dispatched" className="bg-slate-900 text-slate-100">Dispatched</option>
              <option value="Delivered" className="bg-slate-900 text-slate-100">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
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
                      className={`text-xs font-bold p-1 rounded-lg border ${
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
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
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
              This will restore all default weekly menus, sample student attendance logs, and parcel orders.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg"
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
