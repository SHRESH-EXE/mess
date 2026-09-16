import React, { useState, useEffect } from 'react';
import { useMess } from '../context/MessContext';
import { soundEffects } from '../utils/soundEffects';
import ChromeButton from './ui/chrome-button';
import {
  X,
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  AlertTriangle,
  Check,
  Sparkles,
  Camera
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_ALLERGENS = [
  'Peanuts',
  'Dairy / Milk',
  'Gluten / Wheat',
  'Soy',
  'Mustard',
  'Tree Nuts',
  'Sesame'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, updateStudentProfile } = useMess();

  const [name, setName] = useState(currentStudent.name);
  const [phone, setPhone] = useState(currentStudent.phone);
  const [email, setEmail] = useState(currentStudent.email);
  const [hostel, setHostel] = useState(currentStudent.hostel);
  const [roomNo, setRoomNo] = useState(currentStudent.roomNo);
  const [department, setDepartment] = useState(currentStudent.department);
  const [semester, setSemester] = useState(currentStudent.semester);
  const [allergies, setAllergies] = useState<string[]>(currentStudent.allergies || []);
  const [photoUrl, setPhotoUrl] = useState(currentStudent.photoUrl);
  const [customAllergy, setCustomAllergy] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentStudent.name);
      setPhone(currentStudent.phone);
      setEmail(currentStudent.email);
      setHostel(currentStudent.hostel);
      setRoomNo(currentStudent.roomNo);
      setDepartment(currentStudent.department);
      setSemester(currentStudent.semester);
      setAllergies(currentStudent.allergies || []);
      setPhotoUrl(currentStudent.photoUrl);
      setIsSaved(false);
    }
  }, [isOpen, currentStudent]);

  if (!isOpen) return null;

  const toggleAllergy = (allergen: string) => {
    soundEffects.playTap();
    setAllergies((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleAddCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAllergy.trim()) return;
    const clean = customAllergy.trim();
    if (!allergies.includes(clean)) {
      setAllergies((prev) => [...prev, clean]);
    }
    setCustomAllergy('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      ...currentStudent,
      name: name.trim() || currentStudent.name,
      phone: phone.trim() || currentStudent.phone,
      email: email.trim() || currentStudent.email,
      hostel: hostel.trim() || currentStudent.hostel,
      roomNo: roomNo.trim() || currentStudent.roomNo,
      department: department.trim() || currentStudent.department,
      semester: semester.trim() || currentStudent.semester,
      allergies,
      photoUrl: photoUrl.trim() || currentStudent.photoUrl
    });

    soundEffects.playSuccess();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-orange-200/80 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b border-orange-200/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={photoUrl}
                alt={name}
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-400 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 bg-orange-500 rounded-full text-white shadow-xs">
                <Camera className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight font-serif">
                Edit Student Profile
              </h3>
              <p className="text-[11px] text-slate-500 font-mono font-bold">
                Roll No: {currentStudent.rollNo} • {currentStudent.hostel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 block">
              Personal Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Mobile Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-mono font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. aarav.sharma@lpu.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-medium transition-all"
              />
            </div>
          </div>

          {/* Section 2: Hostel & Academic Information */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 block">
              Hostel &amp; Academic Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-orange-500" />
                  <span>Hostel Block</span>
                </label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  placeholder="e.g. Boys Hostel 4 (BH-4)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-orange-500" />
                  <span>Room Number</span>
                </label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="e.g. B-312"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-mono font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                  <span>Department</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                  <span>Semester</span>
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 5th Semester"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-xs text-slate-900 font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dietary Allergies Tracking */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Dietary Allergies &amp; Restrictions</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {allergies.length} Selected
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              The menu will automatically alert or hide dishes containing these allergens for your health and safety.
            </p>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_ALLERGENS.map((a) => {
                const selected = allergies.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergy(a)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      selected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{a}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Allergen */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Add other allergen (e.g. Mushroom, Corn)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:bg-white focus:border-orange-400"
              />
              <button
                type="button"
                onClick={handleAddCustomAllergy}
                className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <ChromeButton
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Save Profile</span>
                </>
              )}
            </ChromeButton>
          </div>
        </form>
      </div>
    </div>
  );
};
