import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
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
  AlertTriangle,
  HeartPulse,
  Settings,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { MealType, STANDARD_ALLERGENS } from '../types/mess';
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
    isMealTakenToday,
    updateStudentAllergies
  } = useMess();

  const mealStatus = getActiveMealStatus();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRebateModal, setShowRebateModal] = useState<MealType | null>(null);
  const [rebateReason, setRebateReason] = useState<string>('Outstation / Home Visit');
  const [showAllergyEditor, setShowAllergyEditor] = useState<boolean>(false);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(currentStudent.allergies || []);

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

  const handleToggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const handleSaveAllergies = () => {
    updateStudentAllergies(currentStudent.id, selectedAllergens);
    setShowAllergyEditor(false);
    setFeedbackMsg({
      type: 'success',
      text: `Allergy profile updated with ${selectedAllergens.length} allergen(s). Menu advisories are active.`
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
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
              : 'bg-emerald-950/90 text-emerald-100 border-emerald-500/60 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center space-x-3 text-xs font-semibold">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs text-white/80 hover:text-white font-bold ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Split: Digital Pass Flow & Monthly Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Digital Mess Pass ID Surface (Left 7 Cols) */}
        <div className="lg:col-span-7 rounded-[36px] bg-white/50 backdrop-blur-3xl p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] border border-white/80 relative overflow-hidden flex flex-col justify-between">
          
          {/* Holographic Security Background Glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-orange-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

          {/* Pass Top Header */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center text-white font-black text-lg border border-white/40">
                CM
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-black tracking-widest uppercase text-orange-600">
                    CAMPUS DINING PASS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-400/40 text-[10px] font-mono font-bold">
                    ACTIVE 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif tracking-tight">
                  Central Hostel Mess Authority
                </h3>
              </div>
            </div>

            <div className="text-[11px] px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-xl text-slate-700 border border-white/90 shrink-0 font-mono font-semibold shadow-xs">
              Verified ID
            </div>
          </div>

          {/* Student Profile Row */}
          <div className="my-6 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-[28px] bg-white/60 border border-white/90 backdrop-blur-xl shadow-xs">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] p-1 shrink-0 shadow-md shadow-orange-500/15">
              <img
                src={currentStudent.photoUrl}
                alt={currentStudent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[18px]"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4 className="text-lg font-black text-slate-900">{currentStudent.name}</h4>
                <span className="font-mono text-xs px-3 py-0.5 rounded-full bg-orange-500/15 text-orange-700 font-bold border border-orange-300/50 inline-block self-center sm:self-auto">
                  {currentStudent.rollNo}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5">
                <div>{currentStudent.department} ({currentStudent.semester})</div>
                <div className="text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1">
                  <Building className="w-3.5 h-3.5 text-orange-500" />
                  <span>{currentStudent.hostel} • Room {currentStudent.roomNo}</span>
                </div>
              </div>

              {/* Allergies Chip Summary on Pass - Light Green Glassmorphism */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-500">Dietary Allergies:</span>
                  {currentStudent.allergies && currentStudent.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {currentStudent.allergies.map(alg => (
                        <span key={alg} className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-400/40 font-bold text-[10px]">
                          {alg}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-emerald-700 font-semibold">None Registered</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedAllergens(currentStudent.allergies || []);
                    setShowAllergyEditor(true);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-white text-orange-600 text-[10px] font-bold border border-orange-200 shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Scanner Actions */}
          <div className="relative z-10 pt-3 border-t border-slate-200/60 flex items-center justify-end">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                id="open-camera-scanner-btn"
                onClick={onOpenScanner}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer border border-white/30"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Open QR Scanner</span>
              </button>

              <button
                onClick={() => handleMarkMeal(mealStatus.currentMeal)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-orange-600 to-[#ea580c] hover:from-orange-500 hover:to-orange-600 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer border border-white/30"
                title={`Mark ${mealStatus.currentMeal.toUpperCase()} for current student`}
              >
                <Check className="w-4 h-4" />
                <span>1-Tap Pass Tap</span>
              </button>
            </div>
          </div>

        </div>

        {/* Meal Counter & Plan Balance (Right 5 Cols) */}
        <div className="lg:col-span-5 rounded-[36px] bg-white/50 backdrop-blur-3xl p-6 sm:p-8 border border-white/80 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  Monthly Subscription
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Meal Counter & Balance
                </h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/70 text-slate-700 font-bold border border-white/90 shadow-xs">
                Current Month
              </span>
            </div>

            {/* Consumption Progress Bar & Number */}
            <div className="p-5 rounded-[28px] bg-white/60 border border-white/90 backdrop-blur-xl shadow-xs space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {currentStudent.mealsConsumedMonth}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    / {currentStudent.totalMealsOpted} Opted
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {mealsRemaining} Remaining
                  </span>
                  <div className="text-[10px] text-slate-500 font-medium">Valid until Month End</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-orange-100/80 rounded-full overflow-hidden p-0.5 border border-orange-200/60">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${consumptionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                <span>{consumptionPercentage}% Consumed</span>
                <span className="text-orange-600 font-semibold">Active Mess Card</span>
              </div>
            </div>

            {/* Registered Allergies Banner */}
            <div className="mt-4 p-4 sm:p-5 rounded-[26px] bg-white/60 border border-white/90 backdrop-blur-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center space-x-1.5 text-orange-700">
                  <HeartPulse className="w-4 h-4 text-orange-600" />
                  <span>Allergy Protection:</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedAllergens(currentStudent.allergies || []);
                    setShowAllergyEditor(true);
                  }}
                  className="text-[11px] text-orange-600 hover:text-orange-700 underline font-bold cursor-pointer"
                >
                  Manage Allergies
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentStudent.allergies && currentStudent.allergies.length > 0 ? (
                  currentStudent.allergies.map(alg => (
                    <span
                      key={alg}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-400/40 text-xs font-bold"
                    >
                      {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No allergens declared. Tap 'Manage Allergies' to configure.</span>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Today's 4-Meal Status Check-Off Grid */}
      <div className="rounded-[36px] bg-white/50 backdrop-blur-3xl p-6 sm:p-8 border border-white/80 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-orange-200/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Today's Meal Check-Off ({todayDateStr})
            </h3>
          </div>
          <div className="text-xs font-medium text-slate-700 bg-white/70 px-3.5 py-1.5 rounded-full border border-white/90 shadow-xs">
            Active Meal: <strong className="text-orange-600 capitalize">{mealStatus.currentMeal}</strong>
          </div>
        </div>

        {/* Meal Check-off cards - Horizontally scrollable carousel on mobile */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2.5 sm:pb-0 pt-1 px-1 -mx-1 sm:mx-0 snap-x snap-mandatory sm:snap-none scrollbar-none">
          {mealTypes.map((m) => {
            const check = isMealTakenToday(m.type, currentStudent.id);
            const Icon = m.icon;
            const isOngoing = mealStatus.currentMeal === m.type && mealStatus.status === 'ongoing';

            return (
              <div
                key={m.type}
                id={`checkoff-card-${m.type}`}
                className={`min-w-[240px] sm:min-w-0 shrink-0 sm:shrink p-5 rounded-[28px] border transition-all flex flex-col justify-between backdrop-blur-2xl snap-center ${
                  check.isTaken
                    ? check.status === 'rebate_applied'
                      ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                      : 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                    : isOngoing
                    ? 'bg-white/75 border-orange-400 ring-2 ring-orange-400/30 shadow-md'
                    : 'bg-white/55 border-white/90 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`p-2.5 rounded-2xl ${
                          check.isTaken
                            ? 'bg-emerald-600 text-white'
                            : isOngoing
                            ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-xs'
                            : 'bg-orange-500/10 text-orange-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{m.label}</h4>
                        <div className="text-[10px] text-slate-500 font-mono">{m.timing}</div>
                      </div>
                    </div>

                    {isOngoing && !check.isTaken && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-xs animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="my-2.5">
                    {check.isTaken ? (
                      check.status === 'rebate_applied' ? (
                        <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          <span>Rebate Applied (Skipped)</span>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Consumed ({check.record?.timestamp || 'Gate'})</span>
                        </div>
                      )
                    ) : (
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Pending Check-in</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3.5 border-t border-slate-200/60 flex items-center space-x-2 mt-2">
                  {!check.isTaken ? (
                    <>
                      <button
                        onClick={() => handleMarkMeal(m.type)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          isOngoing
                            ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/20'
                            : 'bg-white/80 hover:bg-white text-slate-800 border border-orange-200 shadow-xs'
                        }`}
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => setShowRebateModal(m.type)}
                        className="py-2 px-3 text-[11px] font-bold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-full border border-orange-200 transition-colors cursor-pointer bg-white/70"
                        title="Skip meal for rebate credit"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-1.5 text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100/80 rounded-full border border-emerald-300/80">
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
      <div className="rounded-[36px] bg-white/50 backdrop-blur-3xl p-6 sm:p-8 border border-white/80 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-orange-200/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/20 text-orange-600 flex items-center justify-center border border-orange-300/40">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Attendance & Verification Logs
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/70 text-slate-700 font-semibold border border-white/90 shadow-xs">{studentAttendance.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-orange-200/60 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Meal Session</th>
                <th className="pb-2.5">Check-in Time</th>
                <th className="pb-2.5">Verification Method</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-200/40">
              {studentAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 font-mono text-slate-700">{rec.date}</td>
                  <td className="py-3 font-bold uppercase text-slate-900">{rec.mealType}</td>
                  <td className="py-3 font-mono text-slate-500">{rec.timestamp}</td>
                  <td className="py-3 text-slate-700">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-orange-200 font-mono text-[10px] text-slate-700 font-medium">
                      {rec.method === 'qr_scanner' ? 'QR Camera' : rec.method === 'pass_tap' ? 'Pass Tap' : 'Staff Manual'}
                    </span>
                  </td>
                  <td className="py-3">
                    {rec.status === 'attended' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                        Eaten
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-300">
                        Rebate Applied
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allergy Setup Modal */}
      {showAllergyEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xl animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-[36px] bg-white/80 backdrop-blur-3xl shadow-[0_24px_60px_-15px_rgba(249,115,22,0.2)] border border-white p-6 sm:p-8 space-y-4 text-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-600 flex items-center justify-center border border-orange-200">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Configure Student Allergens</h3>
                <p className="text-xs text-slate-500">
                  Select known food allergies for automatic menu warnings
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When any selected allergen is present in hostel recipes, you will receive highlighted alert badges on the daily menu and pre-order confirmation steps.
            </p>

            {/* Allergen Checkboxes - Light Green Active State */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {STANDARD_ALLERGENS.map((alg) => {
                const isChecked = selectedAllergens.includes(alg);
                return (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => handleToggleAllergen(alg)}
                    className={`p-3 rounded-2xl text-left text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-900 shadow-xs'
                        : 'bg-white/60 border-orange-200/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span>{alg}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isChecked ? 'bg-emerald-600 text-white font-bold' : 'border border-slate-300'}`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedAllergens.length > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="text-emerald-700 font-semibold">{selectedAllergens.length} active allergens selected</span>
                <button
                  type="button"
                  onClick={() => setSelectedAllergens([])}
                  className="text-orange-600 hover:text-orange-700 hover:underline cursor-pointer font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-orange-200/50">
              <button
                type="button"
                onClick={() => setShowAllergyEditor(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-orange-100/50 rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllergies}
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white rounded-full transition shadow-lg shadow-orange-500/20 cursor-pointer border border-white/30"
              >
                Save Dietary Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rebate Confirmation Modal */}
      {showRebateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xl animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[36px] bg-white/85 backdrop-blur-3xl shadow-[0_24px_60px_-15px_rgba(249,115,22,0.2)] border border-white p-6 sm:p-8 space-y-4 text-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-600 flex items-center justify-center border border-orange-200">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply Meal Skip Rebate</h3>
                <p className="text-xs text-slate-500 capitalize">
                  {showRebateModal} • {todayDateStr}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Skipping this meal will mark you as absent for this session. A daily meal rebate will be credited back on your monthly hostel invoice.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Reason:</label>
              <select
                value={rebateReason}
                onChange={(e) => setRebateReason(e.target.value)}
                className="w-full text-xs p-3 rounded-2xl bg-white/90 border border-orange-200 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="Outstation / Home Visit">Outstation / Home Visit</option>
                <option value="Academic Lab Work / Exam">Academic Lab Work / Exam</option>
                <option value="Medical / Fasting">Medical / Fasting</option>
                <option value="Personal / Off Campus">Personal / Off Campus</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowRebateModal(null)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-orange-100/50 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyRebate(showRebateModal)}
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white rounded-full transition-colors shadow-lg shadow-orange-500/20 border border-white/30 cursor-pointer"
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
