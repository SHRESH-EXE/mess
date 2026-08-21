import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  DayMenu,
  MealType,
  StudentProfile,
  MealAttendanceRecord,
  AcademicBlockOrder,
  MessAnnouncement,
  DishRating,
  MealSlot
} from '../types/mess';
import {
  INITIAL_WEEKLY_MENU,
  INITIAL_STUDENTS,
  INITIAL_ORDERS,
  INITIAL_ANNOUNCEMENTS
} from '../data/initialData';
import { soundEffects } from '../utils/audio';
import { getCurrentDayOfWeek, getTodayDateString, formatTimeAmPm } from '../utils/time';

interface MessContextType {
  activeTab: 'menu' | 'pass' | 'parcel' | 'admin';
  setActiveTab: (tab: 'menu' | 'pass' | 'parcel' | 'admin') => void;
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  students: StudentProfile[];
  weeklyMenu: Record<string, DayMenu>;
  attendanceRecords: MealAttendanceRecord[];
  orders: AcademicBlockOrder[];
  announcements: MessAnnouncement[];
  dishRatings: DishRating[];
  todayCounts: Record<MealType, number>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  
  // Actions
  markMealAttendance: (mealType: MealType, studentId?: string, method?: 'qr_scanner' | 'manual_admin' | 'pass_tap') => { success: boolean; message: string };
  skipMealForRebate: (mealType: MealType, studentId?: string, reason?: string) => { success: boolean; message: string };
  createAcademicOrder: (order: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'>) => AcademicBlockOrder;
  updateOrderStatus: (orderId: string, status: AcademicBlockOrder['status']) => void;
  rateDish: (dishId: string, dishName: string, rating: number, comment?: string) => void;
  updateMenuSlot: (day: string, mealType: MealType, updatedSlot: MealSlot) => void;
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
  MENU: 'campusmess_weekly_menu_v2',
  STUDENTS: 'campusmess_students_v2',
  CURRENT_STUDENT_ID: 'campusmess_current_student_id_v2',
  ATTENDANCE: 'campusmess_attendance_v2',
  ORDERS: 'campusmess_orders_v2',
  ANNOUNCEMENTS: 'campusmess_announcements_v2',
  RATINGS: 'campusmess_ratings_v2',
  TODAY_COUNTS: 'campusmess_today_counts_v2'
};

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'pass' | 'parcel' | 'admin'>('menu');
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
    // Initial sample today records
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

  // 8. Headcount stats for today
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
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(dishRatings));
  }, [dishRatings]);

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

    // Check duplicate
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

    const timeString = formatTimeAmPm(new Date());
    const newRecord: MealAttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      hostel: student.hostel,
      roomNo: student.roomNo,
      date: todayDateStr,
      mealType,
      timestamp: timeString,
      method,
      status: 'attended'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Increment student's month consumed count
    setStudents(prev =>
      prev.map(s => s.id === student.id ? { ...s, mealsConsumedMonth: s.mealsConsumedMonth + 1 } : s)
    );

    // Increment head count
    setTodayCounts(prev => ({
      ...prev,
      [mealType]: prev[mealType] + 1
    }));

    // Sound and celebration
    soundEffects.playSuccessBeep();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#10B981', '#3B82F6', '#F59E0B']
    });

    return {
      success: true,
      message: `Verified! ${mealType.toUpperCase()} marked successfully for ${student.name} (${student.rollNo}) at ${timeString}.`
    };
  }, [attendanceRecords, currentStudent, students, todayDateStr]);

  // Skip Meal (Rebate)
  const skipMealForRebate = useCallback((
    mealType: MealType,
    studentId?: string,
    reason: string = 'Outstation / Academic Project'
  ) => {
    const targetId = studentId || currentStudent.id;
    const student = students.find(s => s.id === targetId) || currentStudent;

    const existing = attendanceRecords.find(
      r => r.studentId === targetId && r.date === todayDateStr && r.mealType === mealType
    );

    if (existing) {
      return {
        success: false,
        message: `Cannot apply rebate: ${mealType.toUpperCase()} is already recorded as ${existing.status}.`
      };
    }

    const newRecord: MealAttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      hostel: student.hostel,
      roomNo: student.roomNo,
      date: todayDateStr,
      mealType,
      timestamp: formatTimeAmPm(new Date()),
      method: 'manual_admin',
      status: 'rebate_applied',
      rebateReason: reason
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    return {
      success: true,
      message: `Rebate applied! ${mealType.toUpperCase()} skipped for ${student.name}. Rebate credit will reflect on the monthly mess bill.`
    };
  }, [attendanceRecords, currentStudent, students, todayDateStr]);

  // Create Academic Block Delivery Order
  const createAcademicOrder = useCallback((
    orderData: Omit<AcademicBlockOrder, 'id' | 'orderTime' | 'status'>
  ): AcademicBlockOrder => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: AcademicBlockOrder = {
      ...orderData,
      id: `ORD-${orderNumber}`,
      orderTime: formatTimeAmPm(new Date()),
      status: 'Pending'
    };

    setOrders(prev => [newOrder, ...prev]);

    // If using mess pass, automatically register attendance or record
    if (newOrder.useMessPass && newOrder.studentId) {
      // mark attendance for lunch/snacks if not already
      // keep record synced
    }

    return newOrder;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId: string, status: AcademicBlockOrder['status']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  }, []);

  // Rate dish
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
      mealsConsumedMonth: 0
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
    localStorage.removeItem(STORAGE_KEYS.RATINGS);
    localStorage.removeItem(STORAGE_KEYS.TODAY_COUNTS);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setStudents(INITIAL_STUDENTS);
    setCurrentStudentId('stu-1');
    setOrders(INITIAL_ORDERS);
    setAttendanceRecords([]);
    setDishRatings([]);
    setTodayCounts({ breakfast: 412, lunch: 485, snacks: 198, dinner: 0 });
  }, []);

  return (
    <MessContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentStudent,
        setCurrentStudent: updateStudentProfile,
        students,
        weeklyMenu,
        attendanceRecords,
        orders,
        announcements,
        dishRatings,
        todayCounts,
        selectedDay,
        setSelectedDay,
        markMealAttendance,
        skipMealForRebate,
        createAcademicOrder,
        updateOrderStatus,
        rateDish,
        updateMenuSlot,
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
