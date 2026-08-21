import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  DayMenu,
  MealType,
  StudentProfile,
  MealAttendanceRecord,
  AcademicBlockOrder,
  DayScholarOrder,
  DayScholarOrderStatus,
  MessAnnouncement,
  DishRating,
  MealSlot,
  UserSession,
  AnonymousFeedback,
  DishItem
} from '../types/mess';
import {
  INITIAL_WEEKLY_MENU,
  INITIAL_STUDENTS,
  INITIAL_ORDERS,
  INITIAL_DAY_SCHOLAR_ORDERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ANONYMOUS_FEEDBACK
} from '../data/initialData';
import { soundEffects } from '../utils/audio';
import { getCurrentDayOfWeek, getTodayDateString, formatTimeAmPm } from '../utils/time';

export type NavigationTab = 'menu' | 'pass' | 'parcel' | 'dayscholar' | 'feedback' | 'admin';

interface MessContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentSession: UserSession | null;
  loginStudent: (rollNo: string, roomNoOrPass: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (emailOrId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  students: StudentProfile[];
  weeklyMenu: Record<string, DayMenu>;
  attendanceRecords: MealAttendanceRecord[];
  orders: AcademicBlockOrder[];
  dayScholarOrders: DayScholarOrder[];
  announcements: MessAnnouncement[];
  dishRatings: DishRating[];
  anonymousFeedbacks: AnonymousFeedback[];
  todayCounts: Record<MealType, number>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  
  // Actions
  markMealAttendance: (mealType: MealType, studentId?: string, method?: 'qr_scanner' | 'manual_admin' | 'pass_tap') => { success: boolean; message: string };
  skipMealForRebate: (mealType: MealType, studentId?: string, reason?: string) => { success: boolean; message: string };
  createAcademicOrder: (order: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'>) => AcademicBlockOrder;
  updateOrderStatus: (orderId: string, status: AcademicBlockOrder['status']) => void;
  createDayScholarOrder: (order: Omit<DayScholarOrder, 'id' | 'timestamp' | 'status'>) => DayScholarOrder;
  updateDayScholarOrderStatus: (orderId: string, status: DayScholarOrderStatus) => void;
  rateDish: (dishId: string, dishName: string, rating: number, comment?: string) => void;
  submitAnonymousFeedback: (feedback: { mealSlot: MealType; dishName: string; rating: number; comment?: string }) => void;
  updateStudentAllergies: (studentId: string, allergies: string[]) => void;
  updateMenuSlot: (day: string, mealType: MealType, updatedSlot: MealSlot) => void;
  updateDishInSlot: (day: string, mealType: MealType, updatedDish: DishItem) => void;
  addDishToSlot: (day: string, mealType: MealType, newDish: Omit<DishItem, 'id'>) => void;
  deleteDishFromSlot: (day: string, mealType: MealType, dishId: string) => void;
  incrementAdminHeadcount: (mealType: MealType, delta: number) => void;
  switchStudentById: (studentId: string) => void;
  addNewStudent: (profile: Omit<StudentProfile, 'id' | 'barcode' | 'mealsConsumedMonth'>) => void;
  updateStudentProfile: (profile: StudentProfile) => void;
  resetToDefaultData: () => void;
  todayDateStr: string;
  isMealTakenToday: (mealType: MealType, studentId?: string) => { isTaken: boolean; status?: 'attended' | 'skipped' | 'rebate_applied'; record?: MealAttendanceRecord };
}

const MessContext = createContext<MessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'campusmess_weekly_menu_v3',
  STUDENTS: 'campusmess_students_v3',
  CURRENT_STUDENT_ID: 'campusmess_current_student_id_v3',
  ATTENDANCE: 'campusmess_attendance_v3',
  ORDERS: 'campusmess_orders_v3',
  DAY_SCHOLAR_ORDERS: 'campusmess_dayscholar_orders_v3',
  ANNOUNCEMENTS: 'campusmess_announcements_v3',
  RATINGS: 'campusmess_ratings_v3',
  FEEDBACK: 'campusmess_anonymous_feedback_v3',
  TODAY_COUNTS: 'campusmess_today_counts_v3'
};

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('menu');
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const todayDayName = getCurrentDayOfWeek();
  const [selectedDay, setSelectedDay] = useState<string>(todayDayName);
  const todayDateStr = getTodayDateString();

  // 1. Weekly Menu
  const [weeklyMenu, setWeeklyMenu] = useState<Record<string, DayMenu>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_WEEKLY_MENU;
  });

  // 2. Students List
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_STUDENTS;
  });

  // 3. Current Student
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    return saved || 'stu-1';
  });

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0] || INITIAL_STUDENTS[0];

  // 4. Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<MealAttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'att-init-1',
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        rollNo: '22CS0142',
        hostel: 'Aryabhatta Hostel (Block-B)',
        roomNo: 'B-312',
        date: todayDateStr,
        mealType: 'breakfast',
        timestamp: '08:24 AM',
        method: 'qr_scanner',
        status: 'attended'
      },
      {
        id: 'att-init-2',
        studentId: 'stu-3',
        studentName: 'Rohan Verma',
        rollNo: '21ME0310',
        hostel: 'CV Raman Hostel (Block-C)',
        roomNo: 'C-108',
        date: todayDateStr,
        mealType: 'breakfast',
        timestamp: '08:45 AM',
        method: 'pass_tap',
        status: 'attended'
      }
    ];
  });

  // 5. Orders
  const [orders, setOrders] = useState<AcademicBlockOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  // 5b. Day Scholar Orders
  const [dayScholarOrders, setDayScholarOrders] = useState<DayScholarOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAY_SCHOLAR_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_DAY_SCHOLAR_ORDERS;
  });

  // 6. Announcements
  const [announcements] = useState<MessAnnouncement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // 7. Dish Ratings
  const [dishRatings, setDishRatings] = useState<DishRating[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // 8. Anonymous Feedbacks (strictly no student identities)
  const [anonymousFeedbacks, setAnonymousFeedbacks] = useState<AnonymousFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ANONYMOUS_FEEDBACK;
  });

  // 9. Headcount stats for today
  const [todayCounts, setTodayCounts] = useState<Record<MealType, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TODAY_COUNTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      breakfast: 412,
      lunch: 485,
      snacks: 198,
      dinner: 0
    };
  });

  // LocalStorage sync effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(weeklyMenu));
  }, [weeklyMenu]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAY_SCHOLAR_ORDERS, JSON.stringify(dayScholarOrders));
  }, [dayScholarOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(dishRatings));
  }, [dishRatings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(anonymousFeedbacks));
  }, [anonymousFeedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODAY_COUNTS, JSON.stringify(todayCounts));
  }, [todayCounts]);

  // Check if meal already taken today by a student
  const isMealTakenToday = useCallback((mealType: MealType, studentId?: string) => {
    const targetId = studentId || currentStudent.id;
    const match = attendanceRecords.find(
      r => r.studentId === targetId && r.date === todayDateStr && r.mealType === mealType
    );
    if (match) {
      return { isTaken: true, status: match.status, record: match };
    }
    return { isTaken: false };
  }, [attendanceRecords, currentStudent.id, todayDateStr]);

  // Mark Meal Attendance
  const markMealAttendance = useCallback((
    mealType: MealType,
    studentId?: string,
    method: 'qr_scanner' | 'manual_admin' | 'pass_tap' = 'qr_scanner'
  ) => {
    const targetId = studentId || currentStudent.id;
    const student = students.find(s => s.id === targetId) || currentStudent;

    const existing = attendanceRecords.find(
      r => r.studentId === targetId && r.date === todayDateStr && r.mealType === mealType
    );

    if (existing) {
      soundEffects.playErrorBeep();
      if (existing.status === 'attended') {
        return {
          success: false,
          message: `Already marked! ${student.name} consumed ${mealType.toUpperCase()} at ${existing.timestamp}.`
        };
      } else if (existing.status === 'skipped' || existing.status === 'rebate_applied') {
        return {
          success: false,
          message: `Meal marked as skipped/rebate for ${mealType.toUpperCase()}. Please contact mess warden to revert.`
        };
      }
    }

    const newRecord: MealAttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      hostel: student.hostel,
      roomNo: student.roomNo,
      date: todayDateStr,
      mealType,
      timestamp: formatTimeAmPm(new Date()),
      method,
      status: 'attended'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, mealsConsumedMonth: s.mealsConsumedMonth + 1 } : s))
    );

    setTodayCounts(prev => ({
      ...prev,
      [mealType]: (prev[mealType] || 0) + 1
    }));

    soundEffects.playSuccessBeep();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0d9488', '#14b8a6', '#0f766e']
    });

    return {
      success: true,
      message: `Verified! Pass scanned for ${student.name} (${mealType.toUpperCase()}). Bon Appétit!`
    };
  }, [attendanceRecords, currentStudent, students, todayDateStr]);

  // Skip Meal For Rebate
  const skipMealForRebate = useCallback((
    mealType: MealType,
    studentId?: string,
    reason: string = 'Personal leave / outing'
  ) => {
    const targetId = studentId || currentStudent.id;
    const student = students.find(s => s.id === targetId) || currentStudent;

    const existing = attendanceRecords.find(
      r => r.studentId === targetId && r.date === todayDateStr && r.mealType === mealType
    );

    if (existing) {
      soundEffects.playError();
      return {
        success: false,
        message: `Cannot request rebate: meal slot was already recorded as ${existing.status}.`
      };
    }

    const newRecord: MealAttendanceRecord = {
      id: `rebate-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      hostel: student.hostel,
      roomNo: student.roomNo,
      date: todayDateStr,
      mealType,
      timestamp: formatTimeAmPm(new Date()),
      method: 'pass_tap',
      status: 'rebate_applied'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    soundEffects.playSuccess();

    return {
      success: true,
      message: `Rebate saved for ${mealType.toUpperCase()} (${reason}). ₹45 credited to month-end mess adjustment.`
    };
  }, [attendanceRecords, currentStudent, students, todayDateStr]);

  // Create Academic Block Order
  const createAcademicOrder = useCallback((orderData: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'>): AcademicBlockOrder => {
    const newOrder: AcademicBlockOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderTime: formatTimeAmPm(new Date()),
      status: 'Pending'
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId: string, status: AcademicBlockOrder['status']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  }, []);

  // Create Day Scholar Order
  const createDayScholarOrder = useCallback((orderData: Omit<DayScholarOrder, 'id' | 'timestamp' | 'status'>): DayScholarOrder => {
    const newOrder: DayScholarOrder = {
      ...orderData,
      id: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `Today, ${formatTimeAmPm(new Date())}`,
      status: 'New'
    };

    setDayScholarOrders(prev => [newOrder, ...prev]);
    soundEffects.playSuccess();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#06b6d4']
    });
    return newOrder;
  }, []);

  // Update Day Scholar Order Status
  const updateDayScholarOrderStatus = useCallback((orderId: string, status: DayScholarOrderStatus) => {
    setDayScholarOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  }, []);

  // Rate dish (Legacy helper)
  const rateDish = useCallback((dishId: string, dishName: string, rating: number, comment?: string) => {
    const newRating: DishRating = {
      dishId,
      dishName,
      studentId: currentStudent.id,
      rating,
      comment,
      date: todayDateStr
    };
    setDishRatings(prev => [newRating, ...prev]);
  }, [currentStudent.id, todayDateStr]);

  // Submit Anonymous Feedback (Enforced Anonymity: No student identity recorded)
  const submitAnonymousFeedback = useCallback((feedback: {
    mealSlot: MealType;
    dishName: string;
    rating: number;
    comment?: string;
  }) => {
    const newFeedback: AnonymousFeedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      mealSlot: feedback.mealSlot,
      dishName: feedback.dishName,
      rating: Math.max(1, Math.min(5, feedback.rating)),
      comment: feedback.comment?.trim() || undefined,
      timestamp: `Today, ${formatTimeAmPm(new Date())}`,
      date: todayDateStr
    };

    setAnonymousFeedbacks(prev => [newFeedback, ...prev]);
    soundEffects.playSuccess();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#0d9488', '#38bdf8', '#fbbf24']
    });
  }, [todayDateStr]);

  // Update Student Allergies
  const updateStudentAllergies = useCallback((studentId: string, allergies: string[]) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, allergies };
        }
        return s;
      })
    );

    // Keep active session in sync if current student
    setCurrentSession(prev => {
      if (prev && prev.id === studentId) {
        return { ...prev, allergies };
      }
      return prev;
    });

    soundEffects.playSuccess();
  }, []);

  // Update Menu Slot
  const updateMenuSlot = useCallback((day: string, mealType: MealType, updatedSlot: MealSlot) => {
    setWeeklyMenu(prev => {
      const dayData = prev[day];
      if (!dayData) return prev;
      return {
        ...prev,
        [day]: {
          ...dayData,
          meals: {
            ...dayData.meals,
            [mealType]: updatedSlot
          }
        }
      };
    });
  }, []);

  // Update a specific dish inside a day's slot
  const updateDishInSlot = useCallback((day: string, mealType: MealType, updatedDish: DishItem) => {
    setWeeklyMenu(prev => {
      const dayData = prev[day];
      if (!dayData) return prev;
      const slot = dayData.meals[mealType];
      if (!slot) return prev;
      const updatedDishes = slot.dishes.map(d => d.id === updatedDish.id ? updatedDish : d);
      return {
        ...prev,
        [day]: {
          ...dayData,
          meals: {
            ...dayData.meals,
            [mealType]: {
              ...slot,
              dishes: updatedDishes
            }
          }
        }
      };
    });
  }, []);

  // Add a new dish to a meal slot
  const addDishToSlot = useCallback((day: string, mealType: MealType, newDishData: Omit<DishItem, 'id'>) => {
    const newDish: DishItem = {
      ...newDishData,
      id: `dish-${Date.now()}`
    };
    setWeeklyMenu(prev => {
      const dayData = prev[day];
      if (!dayData) return prev;
      const slot = dayData.meals[mealType];
      if (!slot) return prev;
      return {
        ...prev,
        [day]: {
          ...dayData,
          meals: {
            ...dayData.meals,
            [mealType]: {
              ...slot,
              dishes: [...slot.dishes, newDish]
            }
          }
        }
      };
    });
  }, []);

  // Delete dish from a slot
  const deleteDishFromSlot = useCallback((day: string, mealType: MealType, dishId: string) => {
    setWeeklyMenu(prev => {
      const dayData = prev[day];
      if (!dayData) return prev;
      const slot = dayData.meals[mealType];
      if (!slot) return prev;
      return {
        ...prev,
        [day]: {
          ...dayData,
          meals: {
            ...dayData.meals,
            [mealType]: {
              ...slot,
              dishes: slot.dishes.filter(d => d.id !== dishId)
            }
          }
        }
      };
    });
  }, []);

  // Increment Headcount
  const incrementAdminHeadcount = useCallback((mealType: MealType, delta: number) => {
    setTodayCounts(prev => ({
      ...prev,
      [mealType]: Math.max(0, prev[mealType] + delta)
    }));
  }, []);

  // Switch Student
  const switchStudentById = useCallback((studentId: string) => {
    setCurrentStudentId(studentId);
  }, []);

  // Add Student
  const addNewStudent = useCallback((profile: Omit<StudentProfile, 'id' | 'barcode' | 'mealsConsumedMonth'>) => {
    const id = `stu-${Date.now()}`;
    const newProfile: StudentProfile = {
      ...profile,
      id,
      barcode: `CMH-${profile.rollNo}-2026`,
      mealsConsumedMonth: 0,
      allergies: profile.allergies || []
    };
    setStudents(prev => [...prev, newProfile]);
    setCurrentStudentId(id);
  }, []);

  // Update Student Profile
  const updateStudentProfile = useCallback((updated: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  // Reset to default
  const resetToDefaultData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.DAY_SCHOLAR_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.RATINGS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.TODAY_COUNTS);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setStudents(INITIAL_STUDENTS);
    setCurrentStudentId('stu-1');
    setOrders(INITIAL_ORDERS);
    setDayScholarOrders(INITIAL_DAY_SCHOLAR_ORDERS);
    setAttendanceRecords([]);
    setDishRatings([]);
    setAnonymousFeedbacks(INITIAL_ANONYMOUS_FEEDBACK);
    setTodayCounts({ breakfast: 412, lunch: 485, snacks: 198, dinner: 0 });
    setCurrentSession(null);
  }, []);

  // Authentication: Student Login
  const loginStudent = useCallback(async (rollNoInput: string, passOrRoomInput: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanRoll = rollNoInput.trim().toUpperCase();
    const cleanPass = passOrRoomInput.trim().toUpperCase();

    const foundStudent = students.find((s) => s.rollNo.toUpperCase() === cleanRoll);

    if (!foundStudent) {
      soundEffects.playError();
      return {
        success: false,
        error: `No registered student found with Roll Number "${rollNoInput}". Please check demo credentials or register.`
      };
    }

    const validRoom = foundStudent.roomNo.toUpperCase().replace(/\s+/g, '');
    const enteredRoom = cleanPass.replace(/\s+/g, '');
    const validPasswords = ['STUDENT123', 'PASS123', 'CAMPUS2026', '123456', validRoom];

    const isPasswordValid = validPasswords.includes(cleanPass) || enteredRoom === validRoom;

    if (!isPasswordValid) {
      soundEffects.playError();
      return {
        success: false,
        error: `Incorrect password or room number for ${foundStudent.name} (${foundStudent.rollNo}). Use room "${foundStudent.roomNo}" or "student123".`
      };
    }

    setCurrentStudentId(foundStudent.id);
    const newSession: UserSession = {
      role: 'student',
      name: foundStudent.name,
      id: foundStudent.id,
      email: foundStudent.email,
      rollNo: foundStudent.rollNo,
      hostel: foundStudent.hostel,
      roomNo: foundStudent.roomNo,
      avatarUrl: foundStudent.photoUrl,
      loginTime: formatTimeAmPm(new Date()),
      allergies: foundStudent.allergies || []
    };

    setCurrentSession(newSession);
    setActiveTab('menu');
    soundEffects.playSuccess();
    return { success: true };
  }, [students]);

  // Authentication: Admin Login
  const loginAdmin = useCallback(async (emailOrIdInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanId = emailOrIdInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const validAdminIds = ['admin@campus.edu', 'staff-101', 'admin', 'warden@campus.edu', 'chef@campus.edu', 'staff-202'];
    const validAdminPasswords = ['admin123', 'warden2026', 'chef123', 'admin', 'campus2026'];

    if (!validAdminIds.includes(cleanId) && !cleanId.includes('admin') && !cleanId.includes('staff')) {
      soundEffects.playError();
      return {
        success: false,
        error: `Staff ID / Email "${emailOrIdInput}" is not recognized as a registered Mess Authority.`
      };
    }

    if (!validAdminPasswords.includes(cleanPass) && cleanPass !== 'admin123') {
      soundEffects.playError();
      return {
        success: false,
        error: 'Invalid Admin security password. Try demo password "admin123".'
      };
    }

    const isChef = cleanId.includes('chef') || cleanId === 'staff-202';
    const newSession: UserSession = {
      role: 'admin',
      name: isChef ? 'Master Chef Suresh Nair' : 'Dr. K. S. Rajan (Chief Warden)',
      id: isChef ? 'STAFF-202' : 'STAFF-101',
      email: cleanId.includes('@') ? cleanId : `${cleanId}@campus.edu`,
      designation: isChef ? 'Kitchen Operations Head Chef' : 'Chief Hostel Mess Warden',
      loginTime: formatTimeAmPm(new Date())
    };

    setCurrentSession(newSession);
    setActiveTab('admin');
    soundEffects.playSuccess();
    return { success: true };
  }, []);

  // Authentication: Logout
  const logout = useCallback(() => {
    setCurrentSession(null);
    setActiveTab('menu');
    soundEffects.playTap();
  }, []);

  return (
    <MessContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentSession,
        loginStudent,
        loginAdmin,
        logout,
        currentStudent,
        setCurrentStudent: updateStudentProfile,
        students,
        weeklyMenu,
        attendanceRecords,
        orders,
        dayScholarOrders,
        announcements,
        dishRatings,
        anonymousFeedbacks,
        todayCounts,
        selectedDay,
        setSelectedDay,
        markMealAttendance,
        skipMealForRebate,
        createAcademicOrder,
        updateOrderStatus,
        createDayScholarOrder,
        updateDayScholarOrderStatus,
        rateDish,
        submitAnonymousFeedback,
        updateStudentAllergies,
        updateMenuSlot,
        updateDishInSlot,
        addDishToSlot,
        deleteDishFromSlot,
        incrementAdminHeadcount,
        switchStudentById,
        addNewStudent,
        updateStudentProfile,
        resetToDefaultData,
        todayDateStr,
        isMealTakenToday
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
