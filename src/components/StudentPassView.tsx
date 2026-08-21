import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Building,
  User,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Award,
  CreditCard,
  RefreshCw,
  FileText,
  Check,
  XCircle,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { MealType } from '../types/mess';
import { getActiveMealStatus, formatTimeAmPm } from '../utils/time';

interface StudentPassViewProps {
  onOpenScanner: () => void;
  onOpenSwitchStudent: () => void;
}

export const StudentPassView: React.FC<StudentPassViewProps> = ({
  onOpenScanner,
  onOpenSwitchStudent
}) => {
  const {
    currentStudent,
    markMealAttendance,
    skipMealForRebate,
    attendanceRecords,
    todayCounts,
    todayDateStr,
    isMealTakenToday
  } = useMess();

  const mealStatus = getActiveMealStatus();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRebateModal, setShowRebateModal] = useState<MealType | null>(null);
  const [rebateReason, setRebateReason] = useState<string>('Outstation / Home Visit');

  const mealTypes: { type: MealType; label: string; timing: string; icon: typeof Coffee }[] = [
    { type: 'breakfast', label: 'Breakfast', timing: '07:30 - 09:30 AM', icon: Coffee },
    { type: 'lunch', label: 'Lunch', timing: '12:30 - 02:30 PM', icon: Sun },
    { type: 'snacks', label: 'High Tea', timing: '05:00 - 06:30 PM', icon: Cookie },
    { type: 'dinner', label: 'Dinner', timing: '07:30 - 10:00 PM', icon: Moon }
  ];

  const handleMarkMeal = (type: MealType) => {
    const res = markMealAttendance(type, currentStudent.id, 'pass_tap');
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const handleApplyRebate = (type: MealType) => {
    const res = skipMealForRebate(type, currentStudent.id, rebateReason);
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    setShowRebateModal(null);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // Student specific records
  const studentAttendance = attendanceRecords.filter(r => r.studentId === currentStudent.id);
  const mealsRemaining = Math.max(0, currentStudent.totalMealsOpted - currentStudent.mealsConsumedMonth);
  const consumptionPercentage = Math.min(100, Math.round((currentStudent.mealsConsumedMonth / currentStudent.totalMealsOpted) * 100));

  return (
    <section id="student-pass-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-150 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-600'
              : 'bg-red-900 text-white border-red-600'
          }`}
        >
          <div className="flex items-center space-x-3 text-xs font-semibold">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs text-white/80 hover:text-white font-bold ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Split: Digital Pass Card & Monthly Subscription Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Digital Mess Pass ID Card (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          
          {/* Holographic Security Background Glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Pass Top Banner */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-lg flex items-center justify-center font-serif text-slate-950 font-black text-xl">
                CM
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black tracking-widest uppercase text-amber-400">
                    CAMPUS DINING PASS
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                    ACTIVE 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-serif tracking-tight">
                  Central Hostel Mess Authority
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenSwitchStudent}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
              title="Switch to another student pass"
            >
              Switch ID
            </button>
          </div>

          {/* Student Profile Row */}
          <div className="my-6 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-1 shrink-0 shadow-lg">
              <img
                src={currentStudent.photoUrl}
                alt={currentStudent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4 className="text-lg font-black text-white">{currentStudent.name}</h4>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 inline-block self-center sm:self-auto">
                  {currentStudent.rollNo}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-0.5">
                <div>{currentStudent.department} ({currentStudent.semester})</div>
                <div className="text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentStudent.hostel} • Room {currentStudent.roomNo}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px]">
                <span className="text-amber-300 font-semibold">{currentStudent.planName}</span>
                <span className="text-slate-400 font-mono">{currentStudent.phone}</span>
              </div>
            </div>
          </div>

          {/* Simulated QR Code & Live Scanner Actions */}
          <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Dynamic Simulated QR Block */}
            <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
              <div className="font-mono text-[10px] text-slate-400 leading-tight">
                <div className="text-slate-100 font-bold">{currentStudent.barcode}</div>
                <div className="text-emerald-400">Dynamic Gate Token</div>
                <div className="text-slate-500">Tap scanner to verify</div>
              </div>
            </div>

            {/* Direct Scan Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                id="open-camera-scanner-btn"
                onClick={onOpenScanner}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Open QR Scanner</span>
              </button>

              <button
                onClick={() => handleMarkMeal(mealStatus.currentMeal)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                title={`Mark ${mealStatus.currentMeal.toUpperCase()} for current student`}
              >
                <Check className="w-4 h-4" />
                <span>1-Tap Pass Tap</span>
              </button>
            </div>

          </div>

        </div>

        {/* Meal Counter & Plan Balance (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Monthly Subscription
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  Meal Counter & Balance
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700">
                Current Month
              </span>
            </div>

            {/* Consumption Progress Bar & Number */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-100 font-mono">
                    {currentStudent.mealsConsumedMonth}
                  </span>
                  <span className="text-xs text-slate-400 font-medium ml-1">
                    / {currentStudent.totalMealsOpted} Opted
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {mealsRemaining} Remaining
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">Valid until Month End</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${consumptionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{consumptionPercentage}% Consumed</span>
                <span className="text-amber-400">Active Mess Card</span>
              </div>
            </div>

            {/* Campus Headcount Indicator */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Today's Total Headcount Eaten:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {todayCounts.breakfast + todayCounts.lunch + todayCounts.snacks + todayCounts.dinner} meals
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live attendance across all 4 dining halls synced with hostel turnstiles.
              </p>
            </div>
          </div>

          {/* Quick Outstation Rebate Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-800/80 text-xs text-blue-200 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-blue-100">Automated Mess Rebate System</div>
              <p className="text-[11px] text-blue-300">
                Planning outstation trip? Tap "Skip / Rebate" on any upcoming meal to credit ₹65/meal back into your account.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Today's 4-Meal Status Check-Off Grid */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Today's Meal Check-Off Status ({todayDateStr})
            </h3>
            <p className="text-xs text-slate-400">
              Instant meal attendance validation for {currentStudent.name}
            </p>
          </div>
          <div className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            Active Meal: <strong className="text-amber-400 capitalize">{mealStatus.currentMeal}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealTypes.map((m) => {
            const check = isMealTakenToday(m.type, currentStudent.id);
            const Icon = m.icon;
            const isOngoing = mealStatus.currentMeal === m.type && mealStatus.status === 'ongoing';

            return (
              <div
                key={m.type}
                id={`checkoff-card-${m.type}`}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  check.isTaken
                    ? check.status === 'rebate_applied'
                      ? 'bg-blue-950/40 border-blue-800/80'
                      : 'bg-emerald-950/40 border-emerald-800/80'
                    : isOngoing
                    ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-xl ${
                          check.isTaken
                            ? 'bg-emerald-600 text-white'
                            : isOngoing
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{m.label}</h4>
                        <div className="text-[10px] text-slate-400 font-mono">{m.timing}</div>
                      </div>
                    </div>

                    {isOngoing && !check.isTaken && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="my-2">
                    {check.isTaken ? (
                      check.status === 'rebate_applied' ? (
                        <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          <span>Rebate Applied (Skipped)</span>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Consumed at {check.record?.timestamp || 'Gate'}</span>
                        </div>
                      )
                    ) : (
                      <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Pending Check-in</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-1.5 mt-2">
                  {!check.isTaken ? (
                    <>
                      <button
                        onClick={() => handleMarkMeal(m.type)}
                        className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                          isOngoing
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => setShowRebateModal(m.type)}
                        className="py-1.5 px-2 text-[11px] font-semibold text-slate-300 hover:text-blue-300 hover:bg-blue-950/60 rounded-lg border border-slate-700 transition-colors"
                        title="Skip meal for rebate credit"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 rounded-lg border border-emerald-800">
                      Token Verified #{check.record?.id.slice(-4) || 'OK'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Attendance Logs History */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Recent Attendance & Gate Verification Logs
              </h3>
              <p className="text-xs text-slate-400">
                Audit trail for {currentStudent.name} ({currentStudent.rollNo})
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">{studentAttendance.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-2">Date</th>
                <th className="pb-2">Meal Session</th>
                <th className="pb-2">Check-in Time</th>
                <th className="pb-2">Verification Method</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {studentAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-mono text-slate-200">{rec.date}</td>
                  <td className="py-2.5 font-bold uppercase text-slate-100">{rec.mealType}</td>
                  <td className="py-2.5 font-mono text-slate-400">{rec.timestamp}</td>
                  <td className="py-2.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                      {rec.method === 'qr_scanner' ? '📸 QR Camera' : rec.method === 'pass_tap' ? '💳 Pass Tap' : '✍️ Staff Manual'}
                    </span>
                  </td>
                  <td className="py-2.5">
                    {rec.status === 'attended' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold text-[10px] border border-emerald-800">
                        ✅ Eaten
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-semibold text-[10px] border border-blue-800">
                        ℹ️ Rebate Applied
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebate Confirmation Modal */}
      {showRebateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 space-y-4 text-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-950 text-blue-300 border border-blue-800">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Apply Meal Skip Rebate</h3>
                <p className="text-xs text-slate-400 capitalize">
                  {showRebateModal} • {todayDateStr}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Skipping this meal will mark you as absent for this session. A daily meal rebate will be credited back on your monthly hostel invoice.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Reason:</label>
              <select
                value={rebateReason}
                onChange={(e) => setRebateReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Outstation / Home Visit">Outstation / Home Visit</option>
                <option value="Academic Lab Work / Exam">Academic Lab Work / Exam</option>
                <option value="Medical / Fasting">Medical / Fasting</option>
                <option value="Personal / Off Campus">Personal / Off Campus</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRebateModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyRebate(showRebateModal)}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
              >
                Confirm Skip & Credit Rebate
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
