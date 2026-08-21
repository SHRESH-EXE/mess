import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { X, UserPlus, Check, Sparkles, Building, Phone, CreditCard } from 'lucide-react';
import { StudentProfile } from '../types/mess';

interface SwitchStudentModalProps {
  onClose: () => void;
}

export const SwitchStudentModal: React.FC<SwitchStudentModalProps> = ({ onClose }) => {
  const { students, currentStudent, switchStudentById, addNewStudent } = useMess();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Student Form state
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [hostel, setHostel] = useState('Aryabhatta Hostel (Block-B)');
  const [roomNo, setRoomNo] = useState('');
  const [phone, setPhone] = useState('');
  const [planType, setPlanType] = useState<'full' | 'lunch_dinner' | 'custom'>('full');
  const [department, setDepartment] = useState('Computer Science & Engg');
  const [semester, setSemester] = useState('6th Semester');

  const handleSelectStudent = (id: string) => {
    switchStudentById(id);
    onClose();
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim() || !roomNo.trim()) return;

    const planName =
      planType === 'full'
        ? 'Full Mess Pass (4 Meals/Day)'
        : planType === 'lunch_dinner'
        ? 'Flexi Pass (Lunch + Dinner)'
        : 'Custom 30-Day Pass';

    const totalMeals = planType === 'full' ? 120 : planType === 'lunch_dinner' ? 60 : 45;

    addNewStudent({
      name: name.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      hostel,
      roomNo: roomNo.trim().toUpperCase(),
      email: `${rollNo.toLowerCase()}@campus.edu`,
      phone: phone.trim() || '+91 98000 00000',
      planName,
      planType,
      totalMealsOpted: totalMeals,
      active: true,
      department,
      semester,
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    });

    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="switch-student-modal"
        className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <CreditCard className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 leading-tight">
                Switch Student Meal Pass
              </h3>
              <p className="text-xs text-slate-400">
                Select a registered hosteler or create a custom profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {!showAddForm ? (
            <>
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Registered Students ({students.length})
                </label>
                {students.map((stu) => {
                  const isCurrent = stu.id === currentStudent.id;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => handleSelectStudent(stu.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{stu.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {stu.rollNo} • {stu.hostel} ({stu.roomNo})
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {stu.planName} • {stu.mealsConsumedMonth}/{stu.totalMealsOpted} Consumed
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <div className="p-1 rounded-full bg-amber-500 text-slate-950">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <button className="text-xs font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Select
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register New Student Profile</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100">New Student Registration</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Back to List
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanmay Bhat"
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 23CS0411"
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Hostel Building</label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="Aryabhatta Hostel (Block-B)" className="bg-slate-900 text-slate-100">Aryabhatta Hostel (Block-B)</option>
                    <option value="Gargi Girls Hostel (Block-A)" className="bg-slate-900 text-slate-100">Gargi Girls Hostel (Block-A)</option>
                    <option value="CV Raman Hostel (Block-C)" className="bg-slate-900 text-slate-100">CV Raman Hostel (Block-C)</option>
                    <option value="Homi Bhabha PG Block" className="bg-slate-900 text-slate-100">Homi Bhabha PG Block</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="e.g. B-205"
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Phone (for WhatsApp)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Meal Plan</label>
                  <select
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value as 'full' | 'lunch_dinner' | 'custom')}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                  >
                    <option value="full" className="bg-slate-900 text-slate-100">Full Mess: 4 Meals/Day (120/mo)</option>
                    <option value="lunch_dinner" className="bg-slate-900 text-slate-100">Flexi: Lunch + Dinner (60/mo)</option>
                    <option value="custom" className="bg-slate-900 text-slate-100">Custom 30-Day Pass (45 meals)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md shadow-amber-500/20 transition-all"
                >
                  Save & Switch Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
