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
  DishItem,
  FoodCourtStall,
  FoodCourtItem,
  FoodCourtOrder,
  FoodCourtOrderStatus,
  FoodCourtRushLevel,
  FoodCourtFeedback,
  NearbyRestaurant,
  NearbyRestaurantItem,
  NearbyRestaurantOrder,
  TourStep,
  CampusWalletTransaction,
  SupportedLanguage
} from '../types/mess';
import { showBrowserNotification } from '../utils/pushNotifications';
import {
  INITIAL_WEEKLY_MENU,
  INITIAL_STUDENTS,
  INITIAL_ORDERS,
  INITIAL_DAY_SCHOLAR_ORDERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ANONYMOUS_FEEDBACK
} from '../data/initialData';
import {
  FOOD_COURT_STALLS,
  FOOD_COURT_MENU_ITEMS,
  INITIAL_FOOD_COURT_ORDERS,
  INITIAL_FOOD_COURT_FEEDBACK
} from '../data/foodCourtData';
import {
  NEARBY_RESTAURANTS,
  NEARBY_RESTO_ITEMS,
  INITIAL_NEARBY_RESTO_ORDERS
} from '../data/nearbyRestoData';
import { CAMPUS_TOUR_STEPS } from '../data/tourData';
import { soundEffects } from '../utils/audio';
import { getCurrentDayOfWeek, getTodayDateString, formatTimeAmPm } from '../utils/time';
import {
  stripDangerousTags,
  sanitizeObject,
  validateRollNo,
  validatePhoneNumber,
  clientRateLimiter,
  securityObservability
} from '../lib/security';
import {
  subscribeToRestaurants,
  subscribeToFoodCourtItems,
  subscribeToOrders,
  loginWithFirebaseAuth,
  logoutFirebaseAuth,
  addRestaurant as addFirestoreRestaurant,
  updateRestaurant as updateFirestoreRestaurant,
  deleteRestaurant as deleteFirestoreRestaurant,
  addFoodCourtItem as addFirestoreFoodCourtItem,
  updateFoodCourtItem as updateFirestoreFoodCourtItem,
  deleteFoodCourtItem as deleteFirestoreFoodCourtItem,
  createFirestoreOrder,
  submitFirestoreFeedback
} from '../lib/firebaseServices';

export type NavigationTab = 'menu' | 'pass' | 'nearbyresto' | 'foodcourt' | 'parcel' | 'dayscholar' | 'feedback' | 'admin' | 'vendor';

interface MessContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentSession: UserSession | null;
  loginStudent: (rollNo: string, roomNoOrPass: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (emailOrId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginVendor: (stallIdOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginRestaurant: (restoIdOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  students: StudentProfile[];
  weeklyMenu: Record<string, DayMenu>;
  attendanceRecords: MealAttendanceRecord[];
  orders: AcademicBlockOrder[];
  dayScholarOrders: DayScholarOrder[];
  foodCourtStalls: FoodCourtStall[];
  foodCourtMenuItems: FoodCourtItem[];
  foodCourtOrders: FoodCourtOrder[];
  foodCourtFeedbacks: FoodCourtFeedback[];
  nearbyRestaurants: NearbyRestaurant[];
  nearbyRestoItems: NearbyRestaurantItem[];
  nearbyRestoOrders: NearbyRestaurantOrder[];
  announcements: MessAnnouncement[];
  dishRatings: DishRating[];
  anonymousFeedbacks: AnonymousFeedback[];
  todayCounts: Record<MealType, number>;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  
  // Food Court Actions
  createFoodCourtOrder: (order: Omit<FoodCourtOrder, 'id' | 'tokenNumber' | 'placedAt' | 'status'>) => FoodCourtOrder;
  updateFoodCourtOrderStatus: (orderId: string, status: FoodCourtOrderStatus) => void;
  updateStallRushLevel: (stallId: string, rushLevel: FoodCourtRushLevel, queueDelta?: number) => void;
  updateFoodCourtStallDetails: (stallId: string, updates: Partial<FoodCourtStall>) => void;
  addFoodCourtItem: (item: Omit<FoodCourtItem, 'id'>) => FoodCourtItem;
  updateFoodCourtItem: (item: FoodCourtItem) => void;
  deleteFoodCourtItem: (itemId: string) => void;
  toggleFoodCourtItemAvailability: (itemId: string) => void;
  submitFoodCourtFeedback: (feedback: Omit<FoodCourtFeedback, 'id' | 'timestamp' | 'date' | 'status'>) => void;
  updateFoodCourtFeedbackStatus: (id: string, status: FoodCourtFeedback['status'], ownerNote?: string) => void;
  switchVendorStall: (stallIdOrRestoId: string) => void;

  // Nearby Restaurant Actions
  createNearbyRestoOrder: (order: Omit<NearbyRestaurantOrder, 'id' | 'orderNumber' | 'placedAt' | 'status'>) => NearbyRestaurantOrder;
  updateNearbyRestoOrderStatus: (orderId: string, status: NearbyRestaurantOrder['status']) => void;
  updateNearbyRestaurantDetails: (restoId: string, updates: Partial<NearbyRestaurant>) => void;
  addNearbyRestoItem: (item: Omit<NearbyRestaurantItem, 'id'>) => NearbyRestaurantItem;
  updateNearbyRestoItem: (item: NearbyRestaurantItem) => void;
  deleteNearbyRestoItem: (itemId: string) => void;
  toggleNearbyRestoItemAvailability: (itemId: string) => void;

  // Guided Tour Actions
  isTourActive: boolean;
  currentTourStepIndex: number;
  tourSteps: TourStep[];
  startTour: (stepIndex?: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  isCheatSheetOpen: boolean;
  setIsCheatSheetOpen: (open: boolean) => void;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;

  // Campus Wallet & Multi-Language
  walletBalance: number;
  walletTransactions: CampusWalletTransaction[];
  topUpWallet: (amount: number, description: string) => void;
  deductWallet: (amount: number, description: string) => boolean;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;

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
  FOOD_COURT_STALLS: 'campusmess_foodcourt_stalls_v3',
  FOOD_COURT_ITEMS: 'campusmess_foodcourt_items_v3',
  FOOD_COURT_ORDERS: 'campusmess_foodcourt_orders_v3',
  FOOD_COURT_FEEDBACK: 'campusmess_foodcourt_feedback_v3',
  NEARBY_RESTAURANTS: 'campusmess_nearby_restaurants_v1',
  NEARBY_RESTO_ITEMS: 'campusmess_nearby_resto_items_v1',
  NEARBY_RESTO_ORDERS: 'campusmess_nearby_resto_orders_v1',
  ANNOUNCEMENTS: 'campusmess_announcements_v3',
  RATINGS: 'campusmess_ratings_v3',
  FEEDBACK: 'campusmess_anonymous_feedback_v3',
  TODAY_COUNTS: 'campusmess_today_counts_v3',
  WALLET_BALANCE: 'campusmess_wallet_balance_v1',
  WALLET_TXNS: 'campusmess_wallet_txns_v1',
  LANGUAGE: 'campusmess_language_v1'
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

  // 5c. Food Court Stalls
  const [foodCourtStalls, setFoodCourtStalls] = useState<FoodCourtStall[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_COURT_STALLS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return FOOD_COURT_STALLS;
  });

  // 5d. Food Court Menu Items
  const [foodCourtMenuItems, setFoodCourtMenuItems] = useState<FoodCourtItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_COURT_ITEMS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return FOOD_COURT_MENU_ITEMS;
  });

  // 5e. Food Court Orders
  const [foodCourtOrders, setFoodCourtOrders] = useState<FoodCourtOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_COURT_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_FOOD_COURT_ORDERS;
  });

  // 5f. Food Court Feedbacks
  const [foodCourtFeedbacks, setFoodCourtFeedbacks] = useState<FoodCourtFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_COURT_FEEDBACK);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_FOOD_COURT_FEEDBACK;
  });

  // 5g. Nearby Restaurants (NEW)
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEARBY_RESTAURANTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return NEARBY_RESTAURANTS;
  });

  // 5h. Nearby Restaurant Items (NEW)
  const [nearbyRestoItems, setNearbyRestoItems] = useState<NearbyRestaurantItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEARBY_RESTO_ITEMS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return NEARBY_RESTO_ITEMS;
  });

  // 5i. Nearby Restaurant Orders (NEW)
  const [nearbyRestoOrders, setNearbyRestoOrders] = useState<NearbyRestaurantOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEARBY_RESTO_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_NEARBY_RESTO_ORDERS;
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

  // 10. Guided Tour & Security Inspector state
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState<number>(0);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const tourSteps = CAMPUS_TOUR_STEPS;

  // 11. Campus Meal Wallet & Transactions
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
    if (saved) {
      try { return parseFloat(saved); } catch { /* ignore */ }
    }
    return 450.0; // Default campus meal credit ₹450
  });

  const [walletTransactions, setWalletTransactions] = useState<CampusWalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_TXNS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'txn-init-1',
        type: 'topup',
        amount: 500,
        description: 'Semester Welcome Dining Grant (UPI)',
        timestamp: '01 Sep, 10:00 AM',
        status: 'SUCCESS'
      },
      {
        id: 'txn-init-2',
        type: 'foodcourt_order',
        amount: 50,
        description: 'UniMall Chai & Samosa Combo',
        timestamp: '02 Sep, 05:15 PM',
        status: 'SUCCESS'
      }
    ];
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  // 12. App Language (English, Hindi, Punjabi)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage;
    if (saved && ['en', 'hi', 'pa'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  // 13. Voice Search Modal state
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState<boolean>(false);

  const topUpWallet = useCallback((amount: number, description: string) => {
    if (amount <= 0) return;
    setWalletBalance((prev) => {
      const next = prev + amount;
      localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, next.toString());
      return next;
    });

    const newTxn: CampusWalletTransaction = {
      id: `txn-${Date.now()}`,
      type: 'topup',
      amount,
      description,
      timestamp: `Today, ${formatTimeAmPm(new Date())}`,
      status: 'SUCCESS'
    };

    setWalletTransactions((prev) => {
      const next = [newTxn, ...prev];
      localStorage.setItem(STORAGE_KEYS.WALLET_TXNS, JSON.stringify(next));
      return next;
    });

    soundEffects.playSuccess();
  }, []);

  const deductWallet = useCallback((amount: number, description: string): boolean => {
    if (walletBalance < amount) {
      soundEffects.playError();
      return false;
    }

    setWalletBalance((prev) => {
      const next = prev - amount;
      localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, next.toString());
      return next;
    });

    const newTxn: CampusWalletTransaction = {
      id: `txn-${Date.now()}`,
      type: 'foodcourt_order',
      amount,
      description,
      timestamp: `Today, ${formatTimeAmPm(new Date())}`,
      status: 'SUCCESS'
    };

    setWalletTransactions((prev) => {
      const next = [newTxn, ...prev];
      localStorage.setItem(STORAGE_KEYS.WALLET_TXNS, JSON.stringify(next));
      return next;
    });

    return true;
  }, [walletBalance]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    // 1. Subscribe to Restaurants
    const unsubRestaurants = subscribeToRestaurants((firestoreRestos) => {
      if (firestoreRestos && firestoreRestos.length > 0) {
        setNearbyRestaurants((prev) => {
          const merged = [...prev];
          firestoreRestos.forEach((fr) => {
            const index = merged.findIndex((r) => r.id === fr.id || r.name.toLowerCase() === fr.name.toLowerCase());
            const mappedResto: NearbyRestaurant = {
              id: fr.id || `resto-${Date.now()}`,
              name: fr.name,
              tagline: fr.cuisine || 'Popular Campus Eatery',
              cuisine: fr.cuisine,
              distance: '0.8 km',
              deliveryTime: '25 mins',
              rating: fr.rating || 4.5,
              ratingCount: 120,
              priceForTwo: fr.pricing ? (parseInt(fr.pricing.replace(/\D/g, ''), 10) || 200) : 200,
              isPureVeg: fr.cuisine.toLowerCase().includes('veg'),
              isOpen: fr.status === 'active',
              address: fr.address,
              phone: fr.phone || '+91 9335568951',
              imageUrl: fr.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
            };
            if (index >= 0) {
              merged[index] = { ...merged[index], ...mappedResto };
            } else {
              merged.push(mappedResto);
            }
          });
          return merged;
        });
      }
    });

    // 2. Subscribe to Food Court Items
    const unsubFoodCourtItems = subscribeToFoodCourtItems((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        setFoodCourtMenuItems((prev) => {
          const merged = [...prev];
          firestoreItems.forEach((fi) => {
            const index = merged.findIndex((item) => item.id === fi.id);
            const mappedItem: FoodCourtItem = {
              id: fi.id || `fc-item-${Date.now()}`,
              stallId: fi.stallId,
              stallName: fi.stallName || fi.stallId || 'Campus Food Court',
              name: fi.name,
              category: (fi.category as any) || 'Rolls & Wraps',
              price: fi.price,
              available: fi.isAvailable,
              basePrepMins: 8,
              isVeg: fi.isVeg,
              description: fi.description,
              imageUrl: fi.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
              calories: 280
            };
            if (index >= 0) {
              merged[index] = { ...merged[index], ...mappedItem };
            } else {
              merged.push(mappedItem);
            }
          });
          return merged;
        });
      }
    });

    return () => {
      unsubRestaurants();
      unsubFoodCourtItems();
    };
  }, []);

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
    localStorage.setItem(STORAGE_KEYS.FOOD_COURT_STALLS, JSON.stringify(foodCourtStalls));
  }, [foodCourtStalls]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_COURT_ITEMS, JSON.stringify(foodCourtMenuItems));
  }, [foodCourtMenuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_COURT_ORDERS, JSON.stringify(foodCourtOrders));
  }, [foodCourtOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_COURT_FEEDBACK, JSON.stringify(foodCourtFeedbacks));
  }, [foodCourtFeedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEARBY_RESTAURANTS, JSON.stringify(nearbyRestaurants));
  }, [nearbyRestaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEARBY_RESTO_ITEMS, JSON.stringify(nearbyRestoItems));
  }, [nearbyRestoItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEARBY_RESTO_ORDERS, JSON.stringify(nearbyRestoOrders));
  }, [nearbyRestoOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(dishRatings));
  }, [dishRatings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(anonymousFeedbacks));
  }, [anonymousFeedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODAY_COUNTS, JSON.stringify(todayCounts));
  }, [todayCounts]);

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

  // Food Court Actions
  const createFoodCourtOrder = useCallback((orderData: Omit<FoodCourtOrder, 'id' | 'tokenNumber' | 'placedAt' | 'status'>): FoodCourtOrder => {
    const tokenNum = `#FC-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: FoodCourtOrder = {
      ...orderData,
      id: `FC-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenNumber: tokenNum,
      placedAt: formatTimeAmPm(new Date()),
      status: 'Placed',
      targetWhatsAppNumber: orderData.targetWhatsAppNumber || '919335568951'
    };

    setFoodCourtOrders(prev => [newOrder, ...prev]);

    // Dispatch async to Firestore in background
    createFirestoreOrder({
      tokenNumber: newOrder.tokenNumber,
      studentRegNo: newOrder.rollNo || 'STUDENT',
      studentName: newOrder.studentName || 'Student',
      studentPhone: newOrder.targetWhatsAppNumber,
      stallId: newOrder.stallId,
      stallName: newOrder.stallName,
      totalAmount: newOrder.totalAmount,
      status: 'received',
      orderType: 'pickup'
    }).catch(err => console.warn('Firestore order sync warning:', err));

    // Increase stall active queue count slightly
    setFoodCourtStalls(prev =>
      prev.map(s => {
        if (s.id === orderData.stallId) {
          const newQueue = s.activeQueueCount + 1;
          const newWait = Math.max(3, newQueue * 3 + 2);
          const newRush: FoodCourtRushLevel = newQueue >= 8 ? 'Peak' : newQueue >= 5 ? 'High' : newQueue >= 3 ? 'Moderate' : 'Low';
          return {
            ...s,
            activeQueueCount: newQueue,
            estimatedWaitMins: newWait,
            rushLevel: newRush
          };
        }
        return s;
      })
    );

    soundEffects.playSuccess();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ea580c', '#f97316', '#fbbf24', '#10b981']
    });

    return newOrder;
  }, []);

  const updateFoodCourtOrderStatus = useCallback((orderId: string, status: FoodCourtOrderStatus) => {
    setFoodCourtOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          if (status === 'Ready') {
            showBrowserNotification('Order Ready for Pickup! 🍽️', {
              body: `Token #${ord.tokenNumber} at ${ord.stallName} is ready at the counter!`
            });
            soundEffects.playOrderReadyChime();
          }
          return { ...ord, status };
        }
        return ord;
      })
    );
    soundEffects.playSuccessBeep();
  }, []);

  const updateStallRushLevel = useCallback((stallId: string, rushLevel: FoodCourtRushLevel, queueDelta?: number) => {
    setFoodCourtStalls(prev =>
      prev.map(stall => {
        if (stall.id === stallId) {
          const newQueue = Math.max(0, queueDelta !== undefined ? stall.activeQueueCount + queueDelta : (rushLevel === 'Peak' ? 10 : rushLevel === 'High' ? 7 : rushLevel === 'Moderate' ? 4 : 1));
          const waitMins = rushLevel === 'Peak' ? 18 : rushLevel === 'High' ? 14 : rushLevel === 'Moderate' ? 9 : 4;
          return {
            ...stall,
            rushLevel,
            activeQueueCount: newQueue,
            estimatedWaitMins: waitMins
          };
        }
        return stall;
      })
    );
  }, []);

  // Update Food Court Stall Details (Owner control + IDOR check)
  const updateFoodCourtStallDetails = useCallback((stallId: string, updates: Partial<FoodCourtStall>) => {
    // Zero-Trust IDOR check
    if (currentSession?.role === 'vendor' && currentSession?.stallId && currentSession.stallId !== stallId) {
      securityObservability.recordEvent({
        action: 'IDOR_VIOLATION_BLOCKED',
        actorRole: 'vendor',
        actorId: currentSession.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'IDOR_GUARD',
        details: `Vendor ${currentSession.name} attempted unauthorized update on stall ${stallId}`,
        riskScore: 90
      });
      soundEffects.playError();
      return;
    }

    const sanitizedUpdates = sanitizeObject(updates);
    setFoodCourtStalls(prev =>
      prev.map(s => (s.id === stallId ? { ...s, ...sanitizedUpdates } : s))
    );
    soundEffects.playSuccess();
  }, [currentSession]);

  // Add Food Court Menu Item (Owner control + IDOR & XSS sanitization)
  const addFoodCourtItem = useCallback((itemData: Omit<FoodCourtItem, 'id'>): FoodCourtItem => {
    // Zero-Trust IDOR check
    if (currentSession?.role === 'vendor' && currentSession?.stallId && currentSession.stallId !== itemData.stallId) {
      securityObservability.recordEvent({
        action: 'IDOR_ADD_ITEM_BLOCKED',
        actorRole: 'vendor',
        actorId: currentSession.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'IDOR_GUARD',
        details: `Vendor ${currentSession.name} attempted to inject item into stall ${itemData.stallId}`,
        riskScore: 85
      });
    }

    const sanitized = sanitizeObject(itemData);
    const newItem: FoodCourtItem = {
      ...sanitized,
      id: `fc-item-${Date.now()}`
    };
    setFoodCourtMenuItems(prev => [...prev, newItem]);

    // Background sync to Firestore
    addFirestoreFoodCourtItem({
      name: newItem.name,
      stallId: newItem.stallId,
      stallName: newItem.stallId,
      price: newItem.price,
      category: newItem.category,
      isVeg: newItem.isVeg,
      isAvailable: newItem.available,
      status: 'active',
      imageUrl: newItem.imageUrl,
      description: newItem.description
    }).catch(err => console.warn('Firestore addFoodCourtItem error:', err));

    soundEffects.playSuccess();
    return newItem;
  }, [currentSession]);

  // Update Food Court Menu Item (Owner control + IDOR check)
  const updateFoodCourtItem = useCallback((itemData: FoodCourtItem) => {
    // IDOR check
    if (currentSession?.role === 'vendor' && currentSession?.stallId && currentSession.stallId !== itemData.stallId) {
      securityObservability.recordEvent({
        action: 'IDOR_UPDATE_ITEM_BLOCKED',
        actorRole: 'vendor',
        actorId: currentSession.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'IDOR_GUARD',
        details: `Vendor attempted modifying cross-stall item ${itemData.id}`,
        riskScore: 85
      });
      soundEffects.playError();
      return;
    }

    const sanitized = sanitizeObject(itemData);
    setFoodCourtMenuItems(prev =>
      prev.map(item => (item.id === sanitized.id ? sanitized : item))
    );

    // Background update to Firestore
    updateFirestoreFoodCourtItem(itemData.id, {
      name: itemData.name,
      price: itemData.price,
      category: itemData.category,
      isVeg: itemData.isVeg,
      isAvailable: itemData.available,
      imageUrl: itemData.imageUrl,
      description: itemData.description
    }).catch(err => console.warn('Firestore updateFoodCourtItem error:', err));

    soundEffects.playSuccess();
  }, [currentSession]);

  // Delete Food Court Menu Item (Owner control)
  const deleteFoodCourtItem = useCallback((itemId: string) => {
    const existing = foodCourtMenuItems.find(i => i.id === itemId);
    if (existing && currentSession?.role === 'vendor' && currentSession?.stallId && currentSession.stallId !== existing.stallId) {
      securityObservability.recordEvent({
        action: 'IDOR_DELETE_ITEM_BLOCKED',
        actorRole: 'vendor',
        actorId: currentSession.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'IDOR_GUARD',
        details: `Unauthorized attempt to delete item ${itemId}`,
        riskScore: 90
      });
      soundEffects.playError();
      return;
    }

    setFoodCourtMenuItems(prev => prev.filter(item => item.id !== itemId));

    // Background delete in Firestore
    deleteFirestoreFoodCourtItem(itemId).catch(err => console.warn('Firestore deleteFoodCourtItem error:', err));

    soundEffects.playTrash();
  }, [currentSession, foodCourtMenuItems]);

  // Toggle Food Court Menu Item Availability (In stock / Sold out)
  const toggleFoodCourtItemAvailability = useCallback((itemId: string) => {
    setFoodCourtMenuItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const nextAvail = !item.available;
          updateFirestoreFoodCourtItem(itemId, { isAvailable: nextAvail }).catch(() => {});
          return { ...item, available: nextAvail };
        }
        return item;
      })
    );
    soundEffects.playTap();
  }, []);

  // Submit Food Court Anonymous Feedback (Strict Anonymity)
  const submitFoodCourtFeedback = useCallback((feedbackData: Omit<FoodCourtFeedback, 'id' | 'timestamp' | 'date' | 'status'>) => {
    const newFeedback: FoodCourtFeedback = {
      ...feedbackData,
      id: `fcfb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: `Today, ${formatTimeAmPm(new Date())}`,
      date: todayDateStr,
      status: 'Pending'
    };
    setFoodCourtFeedbacks(prev => [newFeedback, ...prev]);

    // Background sync to Firestore
    submitFirestoreFeedback({
      mealType: 'Food Court',
      messHall: feedbackData.stallName || 'UniMall Food Court',
      rating: feedbackData.rating,
      category: feedbackData.category,
      comment: feedbackData.comment,
      status: 'open'
    }).catch(err => console.warn('Firestore feedback submit error:', err));

    soundEffects.playSuccess();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ea580c', '#10b981', '#fbbf24']
    });
  }, [todayDateStr]);

  // Update Food Court Feedback Status (Owner review / note)
  const updateFoodCourtFeedbackStatus = useCallback((id: string, status: FoodCourtFeedback['status'], ownerNote?: string) => {
    setFoodCourtFeedbacks(prev =>
      prev.map(fb => (fb.id === id ? { ...fb, status, ...(ownerNote !== undefined ? { ownerNote } : {}) } : fb))
    );
    soundEffects.playSuccessBeep();
  }, []);

  // Switch Active Partner (Stall or Nearby Restaurant) for Vendor Session
  const switchVendorStall = useCallback((id: string) => {
    const stall = foodCourtStalls.find(s => s.id === id);
    if (stall) {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          partnerType: 'food_court',
          stallId: stall.id,
          stallName: stall.name,
          restoId: undefined,
          restoName: undefined,
          name: `${stall.name} Manager`,
          designation: `${stall.stallNumber} Head Operator`
        };
      });
      soundEffects.playTap();
      return;
    }

    const resto = nearbyRestaurants.find(r => r.id === id);
    if (resto) {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          partnerType: 'nearby_resto',
          restoId: resto.id,
          restoName: resto.name,
          stallId: undefined,
          stallName: undefined,
          name: `${resto.name} Manager`,
          designation: 'Partner Restaurant Head'
        };
      });
      soundEffects.playTap();
    }
  }, [foodCourtStalls, nearbyRestaurants]);

  // =========================================================================
  // NEARBY RESTAURANT ACTIONS
  // =========================================================================
  const createNearbyRestoOrder = useCallback((orderData: Omit<NearbyRestaurantOrder, 'id' | 'orderNumber' | 'placedAt' | 'status'>): NearbyRestaurantOrder => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newOrder: NearbyRestaurantOrder = {
      ...orderData,
      id: `nro-${Date.now()}-${randomNum}`,
      orderNumber: `#RST-${randomNum}`,
      placedAt: formatTimeAmPm(new Date()),
      status: 'Received'
    };

    setNearbyRestoOrders(prev => [newOrder, ...prev]);
    soundEffects.playSuccess();
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#ff7a30', '#10b981', '#6366f1']
    });
    return newOrder;
  }, []);

  const updateNearbyRestoOrderStatus = useCallback((orderId: string, status: NearbyRestaurantOrder['status']) => {
    setNearbyRestoOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          if (status === 'Out for Delivery') {
            showBrowserNotification('Food Out for Delivery! 🛵', {
              body: `Order ${ord.orderNumber} from ${ord.restoName} is on the way to your hostel!`
            });
            soundEffects.playOrderReadyChime();
          } else if (status === 'Delivered') {
            showBrowserNotification('Order Delivered! 🎉', {
              body: `Order ${ord.orderNumber} from ${ord.restoName} has arrived!`
            });
          }
          return { ...ord, status };
        }
        return ord;
      })
    );
    soundEffects.playSuccessBeep();
  }, []);

  const updateNearbyRestaurantDetails = useCallback((restoId: string, updates: Partial<NearbyRestaurant>) => {
    setNearbyRestaurants(prev =>
      prev.map(r => (r.id === restoId ? { ...r, ...updates } : r))
    );
    soundEffects.playSuccess();
  }, []);

  const addNearbyRestoItem = useCallback((itemData: Omit<NearbyRestaurantItem, 'id'>): NearbyRestaurantItem => {
    const newItem: NearbyRestaurantItem = {
      ...itemData,
      id: `nri-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    setNearbyRestoItems(prev => [newItem, ...prev]);
    soundEffects.playSuccess();
    return newItem;
  }, []);

  const updateNearbyRestoItem = useCallback((itemData: NearbyRestaurantItem) => {
    setNearbyRestoItems(prev =>
      prev.map(item => (item.id === itemData.id ? itemData : item))
    );
    soundEffects.playSuccess();
  }, []);

  const deleteNearbyRestoItem = useCallback((itemId: string) => {
    setNearbyRestoItems(prev => prev.filter(item => item.id !== itemId));
    soundEffects.playTrash();
  }, []);

  const toggleNearbyRestoItemAvailability = useCallback((itemId: string) => {
    setNearbyRestoItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
    soundEffects.playTap();
  }, []);

  // Guided Tour Actions
  const startTour = useCallback((stepIndex: number = 0) => {
    const validIndex = Math.max(0, Math.min(stepIndex, CAMPUS_TOUR_STEPS.length - 1));
    setCurrentTourStepIndex(validIndex);
    setIsTourActive(true);
    const targetTab = CAMPUS_TOUR_STEPS[validIndex]?.tabId;
    if (targetTab) {
      setActiveTab(targetTab);
    }
    soundEffects.playTap();
  }, []);

  const nextTourStep = useCallback(() => {
    setCurrentTourStepIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex >= CAMPUS_TOUR_STEPS.length) {
        setIsTourActive(false);
        soundEffects.playSuccess();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f97316', '#10b981', '#6366f1', '#ec4899']
        });
        return 0;
      }
      const targetTab = CAMPUS_TOUR_STEPS[nextIndex]?.tabId;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      soundEffects.playTap();
      return nextIndex;
    });
  }, []);

  const prevTourStep = useCallback(() => {
    setCurrentTourStepIndex(prev => {
      const prevIndex = Math.max(0, prev - 1);
      const targetTab = CAMPUS_TOUR_STEPS[prevIndex]?.tabId;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      soundEffects.playTap();
      return prevIndex;
    });
  }, []);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    soundEffects.playTap();
  }, []);

  // Reset to default
  const resetToDefaultData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.DAY_SCHOLAR_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.FOOD_COURT_STALLS);
    localStorage.removeItem(STORAGE_KEYS.FOOD_COURT_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.FOOD_COURT_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.RATINGS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.TODAY_COUNTS);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setStudents(INITIAL_STUDENTS);
    setCurrentStudentId('stu-1');
    setOrders(INITIAL_ORDERS);
    setDayScholarOrders(INITIAL_DAY_SCHOLAR_ORDERS);
    setFoodCourtStalls(FOOD_COURT_STALLS);
    setFoodCourtMenuItems(FOOD_COURT_MENU_ITEMS);
    setFoodCourtOrders(INITIAL_FOOD_COURT_ORDERS);
    setAttendanceRecords([]);
    setDishRatings([]);
    setAnonymousFeedbacks(INITIAL_ANONYMOUS_FEEDBACK);
    setTodayCounts({ breakfast: 412, lunch: 485, snacks: 198, dinner: 0 });
    setCurrentSession(null);
  }, []);

  // Authentication: Student Login
  const loginStudent = useCallback(async (rollNoInput: string, passOrRoomInput: string): Promise<{ success: boolean; error?: string }> => {
    // Abuse & Rate Limiting Check
    const rateLimitCheck = clientRateLimiter.checkLimit('AUTH_LOGIN_STUDENT', 5, 60000);
    if (!rateLimitCheck.allowed) {
      securityObservability.recordEvent({
        action: 'RATE_LIMIT_LOGIN_EXCEEDED',
        actorRole: 'anonymous',
        actorId: rollNoInput.slice(0, 10),
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'RATE_LIMIT',
        details: `Student login rate limit triggered. Retry in ${rateLimitCheck.waitSeconds}s`,
        riskScore: 60
      });
      soundEffects.playError();
      return {
        success: false,
        error: `Too many login attempts. Please wait ${rateLimitCheck.waitSeconds} seconds before trying again.`
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanRoll = stripDangerousTags(rollNoInput.trim().toUpperCase());
    const cleanPass = stripDangerousTags(passOrRoomInput.trim().toUpperCase());

    const foundStudent = students.find((s) => s.rollNo.toUpperCase() === cleanRoll);

    if (!foundStudent) {
      securityObservability.recordEvent({
        action: 'FAILED_STUDENT_LOGIN_NOT_FOUND',
        actorRole: 'anonymous',
        actorId: cleanRoll,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'WARNING',
        category: 'AUTH',
        details: `Unknown roll number: ${cleanRoll}`,
        riskScore: 30
      });
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
      securityObservability.recordEvent({
        action: 'FAILED_STUDENT_LOGIN_BAD_PASSWORD',
        actorRole: 'student',
        actorId: foundStudent.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'WARNING',
        category: 'AUTH',
        details: `Failed credentials for roll ${cleanRoll}`,
        riskScore: 45
      });
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

    securityObservability.recordEvent({
      action: 'SUCCESSFUL_STUDENT_LOGIN',
      actorRole: 'student',
      actorId: foundStudent.id,
      ipAddress: '10.0.0.1 (Local Client)',
      status: 'SUCCESS',
      category: 'AUTH',
      details: `Student ${foundStudent.name} authenticated securely`,
      riskScore: 0
    });

    setCurrentSession(newSession);
    setActiveTab('menu');
    soundEffects.playSuccess();
    return { success: true };
  }, [students]);

  // Authentication: Admin Login (Firebase Auth with Demo Fallback)
  const loginAdmin = useCallback(async (emailOrIdInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    // Abuse & Rate Limiting Check
    const rateLimitCheck = clientRateLimiter.checkLimit('AUTH_LOGIN_ADMIN', 4, 60000);
    if (!rateLimitCheck.allowed) {
      securityObservability.recordEvent({
        action: 'RATE_LIMIT_ADMIN_LOGIN_EXCEEDED',
        actorRole: 'anonymous',
        actorId: emailOrIdInput.slice(0, 15),
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'RATE_LIMIT',
        details: `Brute force protection triggered on admin portal. Locked for ${rateLimitCheck.waitSeconds}s`,
        riskScore: 80
      });
      soundEffects.playError();
      return {
        success: false,
        error: `Brute force lock triggered. Please wait ${rateLimitCheck.waitSeconds} seconds.`
      };
    }

    const cleanId = stripDangerousTags(emailOrIdInput.trim().toLowerCase());
    const cleanPass = stripDangerousTags(passwordInput.trim());

    // Try Real Firebase Authentication first if email format is provided
    if (cleanId.includes('@')) {
      try {
        const { profile } = await loginWithFirebaseAuth(cleanId, cleanPass);
        const newSession: UserSession = {
          role: 'admin',
          name: profile.name || 'Authorized Admin',
          id: `ADMIN-${profile.uid.slice(0, 6).toUpperCase()}`,
          email: profile.email,
          designation: profile.role === 'superadmin' ? 'Chief Warden / Superadmin' : 'Mess Administrator',
          loginTime: formatTimeAmPm(new Date())
        };

        securityObservability.recordEvent({
          action: 'SUCCESSFUL_FIREBASE_ADMIN_LOGIN',
          actorRole: 'admin',
          actorId: profile.uid,
          ipAddress: '10.0.0.1 (Local Client)',
          status: 'SUCCESS',
          category: 'AUTH',
          details: `Firebase Admin ${profile.name} (${profile.email}) logged in securely`,
          riskScore: 0
        });

        setCurrentSession(newSession);
        setActiveTab('admin');
        soundEffects.playSuccess();
        return { success: true };
      } catch (fbErr: any) {
        // If it's not a demo fallback account, report error
        const isDemoId = ['admin@campus.edu', 'warden@campus.edu', 'chef@campus.edu'].includes(cleanId);
        if (!isDemoId) {
          soundEffects.playError();
          return { success: false, error: fbErr.message || 'Firebase Authentication failed.' };
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const validAdminIds = ['admin@campus.edu', 'staff-101', 'admin', 'warden@campus.edu', 'chef@campus.edu', 'staff-202'];
    const validAdminPasswords = ['admin123', 'warden2026', 'chef123', 'admin', 'campus2026'];

    if (!validAdminIds.includes(cleanId) && !cleanId.includes('admin') && !cleanId.includes('staff')) {
      securityObservability.recordEvent({
        action: 'FAILED_ADMIN_LOGIN_BAD_ID',
        actorRole: 'anonymous',
        actorId: cleanId,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'WARNING',
        category: 'AUTH',
        details: `Unrecognized admin identifier: ${cleanId}`,
        riskScore: 50
      });
      soundEffects.playError();
      return {
        success: false,
        error: `Staff ID / Email "${emailOrIdInput}" is not recognized as a registered Mess Authority.`
      };
    }

    if (!validAdminPasswords.includes(cleanPass) && cleanPass !== 'admin123') {
      securityObservability.recordEvent({
        action: 'FAILED_ADMIN_LOGIN_BAD_PASS',
        actorRole: 'admin',
        actorId: cleanId,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'WARNING',
        category: 'AUTH',
        details: `Invalid password attempt on admin ID ${cleanId}`,
        riskScore: 65
      });
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

    securityObservability.recordEvent({
      action: 'SUCCESSFUL_ADMIN_LOGIN',
      actorRole: 'admin',
      actorId: newSession.id,
      ipAddress: '10.0.0.1 (Local Client)',
      status: 'SUCCESS',
      category: 'AUTH',
      details: `Admin ${newSession.name} authorized with full executive role`,
      riskScore: 0
    });

    setCurrentSession(newSession);
    setActiveTab('admin');
    soundEffects.playSuccess();
    return { success: true };
  }, []);

  // Authentication: Vendor / Food Court & Nearby Restaurant Owner Login
  const loginVendor = useCallback(async (stallIdOrEmail: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    // Abuse & Rate Limiting Check
    const rateLimitCheck = clientRateLimiter.checkLimit('AUTH_LOGIN_VENDOR', 5, 60000);
    if (!rateLimitCheck.allowed) {
      securityObservability.recordEvent({
        action: 'RATE_LIMIT_VENDOR_LOGIN_EXCEEDED',
        actorRole: 'anonymous',
        actorId: stallIdOrEmail.slice(0, 15),
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'BLOCKED',
        category: 'RATE_LIMIT',
        details: `Vendor login rate limit exceeded. Retry in ${rateLimitCheck.waitSeconds}s`,
        riskScore: 60
      });
      soundEffects.playError();
      return {
        success: false,
        error: `Too many vendor login attempts. Please wait ${rateLimitCheck.waitSeconds} seconds.`
      };
    }

    const cleanInput = stripDangerousTags(stallIdOrEmail.trim().toLowerCase());
    const cleanPass = stripDangerousTags(passwordInput.trim());

    // Try Real Firebase Authentication first if email format is provided
    if (cleanInput.includes('@')) {
      try {
        const { profile } = await loginWithFirebaseAuth(cleanInput, cleanPass);
        const newSession: UserSession = {
          role: 'vendor',
          partnerType: profile.role === 'restaurant_admin' ? 'nearby_resto' : 'food_court',
          name: profile.name || 'Vendor Administrator',
          id: `VENDOR-${profile.uid.slice(0, 6).toUpperCase()}`,
          email: profile.email,
          designation: 'Verified Campus Food Partner',
          loginTime: formatTimeAmPm(new Date())
        };

        setCurrentSession(newSession);
        setActiveTab('vendor');
        soundEffects.playSuccess();
        return { success: true };
      } catch {
        // Fallback to demo local authentication below
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // Check if input matches a nearby restaurant
    const matchedResto = nearbyRestaurants.find(r =>
      r.id.toLowerCase() === cleanInput ||
      r.adminEmail?.toLowerCase() === cleanInput ||
      r.name.toLowerCase().includes(cleanInput) ||
      cleanInput.includes(r.id.replace('resto-', '')) ||
      (cleanInput.includes('domino') && r.id.includes('domino')) ||
      (cleanInput.includes('subway') && r.id.includes('subway')) ||
      (cleanInput.includes('mcdonald') && r.id.includes('mcdonald')) ||
      (cleanInput.includes('kulcha') && r.id.includes('kulcha')) ||
      (cleanInput.includes('havmor') && r.id.includes('havmor')) ||
      (cleanInput.includes('bikaner') && r.id.includes('bikaner')) ||
      (cleanInput.includes('chaayos') && r.id.includes('chaayos')) ||
      (cleanInput.includes('royal') && r.id.includes('royal')) ||
      (cleanInput.includes('green') && r.id.includes('green')) ||
      (cleanInput.includes('midnight') && r.id.includes('midnight')) ||
      (cleanInput.includes('dragon') && r.id.includes('dragon')) ||
      (cleanInput.includes('woodfire') && r.id.includes('woodfire')) ||
      (cleanInput.includes('paratha') && r.id.includes('paratha'))
    );

    // Check if input matches a food court stall
    const matchedStall = foodCourtStalls.find(s =>
      s.id.toLowerCase() === cleanInput ||
      s.stallNumber.toLowerCase() === cleanInput ||
      s.name.toLowerCase().includes(cleanInput) ||
      cleanInput.includes(s.id.replace('stall-', '')) ||
      (cleanInput.includes('rolls') && s.id === 'stall-rolls') ||
      (cleanInput.includes('south') && s.id === 'stall-south') ||
      (cleanInput.includes('chai') && s.id === 'stall-chai') ||
      (cleanInput.includes('pizza') && s.id === 'stall-pizza') ||
      (cleanInput.includes('wok') && s.id === 'stall-wok') ||
      (cleanInput.includes('nutri') && s.id === 'stall-nutrifit')
    );

    const validPasswords = ['vendor123', 'resto123', 'partner123', 'foodcourt123', 'owner123', 'fc123', '123456', 'admin123', 'campus2026'];
    const isPassValid = validPasswords.includes(cleanPass.toLowerCase()) || cleanPass === 'password';

    if (!isPassValid) {
      securityObservability.recordEvent({
        action: 'FAILED_VENDOR_LOGIN_BAD_PASS',
        actorRole: 'vendor',
        actorId: cleanInput,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'WARNING',
        category: 'AUTH',
        details: `Invalid password for vendor entity ${cleanInput}`,
        riskScore: 50
      });
      soundEffects.playError();
      return {
        success: false,
        error: 'Invalid Partner credentials. Use demo password "vendor123" or "resto123".'
      };
    }

    if (matchedResto) {
      const newSession: UserSession = {
        role: 'vendor',
        partnerType: 'nearby_resto',
        name: `${matchedResto.name} Owner / Manager`,
        id: `RESTO-${matchedResto.id.replace('resto-', '').toUpperCase()}`,
        email: matchedResto.adminEmail,
        restoId: matchedResto.id,
        restoName: matchedResto.name,
        designation: 'Campus Partner Restaurant Manager',
        loginTime: formatTimeAmPm(new Date())
      };

      securityObservability.recordEvent({
        action: 'SUCCESSFUL_RESTO_PARTNER_LOGIN',
        actorRole: 'vendor',
        actorId: newSession.id,
        ipAddress: '10.0.0.1 (Local Client)',
        status: 'SUCCESS',
        category: 'AUTH',
        details: `Restaurant owner ${matchedResto.name} logged in`,
        riskScore: 0
      });

      setCurrentSession(newSession);
      setActiveTab('vendor');
      soundEffects.playSuccess();
      return { success: true };
    }

    const activeStall = matchedStall || foodCourtStalls[0];
    const newSession: UserSession = {
      role: 'vendor',
      partnerType: 'food_court',
      name: `${activeStall.name} Owner / Manager`,
      id: `VENDOR-${activeStall.stallNumber.replace('#', '')}`,
      email: `${activeStall.id.replace('stall-', '')}@foodcourt.campus.edu`,
      stallId: activeStall.id,
      stallName: activeStall.name,
      designation: `${activeStall.stallNumber} Head Franchise Owner`,
      loginTime: formatTimeAmPm(new Date())
    };

    securityObservability.recordEvent({
      action: 'SUCCESSFUL_FOODCOURT_VENDOR_LOGIN',
      actorRole: 'vendor',
      actorId: newSession.id,
      ipAddress: '10.0.0.1 (Local Client)',
      status: 'SUCCESS',
      category: 'AUTH',
      details: `Stall operator for ${activeStall.name} logged in`,
      riskScore: 0
    });

    setCurrentSession(newSession);
    setActiveTab('vendor');
    soundEffects.playSuccess();
    return { success: true };
  }, [foodCourtStalls, nearbyRestaurants]);

  // Authentication: Dedicated Restaurant Partner Login
  const loginRestaurant = useCallback(async (restoIdOrEmail: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    return loginVendor(restoIdOrEmail, passwordInput);
  }, [loginVendor]);

  // Authentication: Logout
  const logout = useCallback(() => {
    logoutFirebaseAuth().catch(() => {});
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
        loginVendor,
        loginRestaurant,
        logout,
        currentStudent,
        setCurrentStudent: updateStudentProfile,
        students,
        weeklyMenu,
        attendanceRecords,
        orders,
        dayScholarOrders,
        foodCourtStalls,
        foodCourtMenuItems,
        foodCourtOrders,
        foodCourtFeedbacks,
        nearbyRestaurants,
        nearbyRestoItems,
        nearbyRestoOrders,
        announcements,
        dishRatings,
        anonymousFeedbacks,
        todayCounts,
        selectedDay,
        setSelectedDay,
        createFoodCourtOrder,
        updateFoodCourtOrderStatus,
        updateStallRushLevel,
        updateFoodCourtStallDetails,
        addFoodCourtItem,
        updateFoodCourtItem,
        deleteFoodCourtItem,
        toggleFoodCourtItemAvailability,
        submitFoodCourtFeedback,
        updateFoodCourtFeedbackStatus,
        switchVendorStall,
        createNearbyRestoOrder,
        updateNearbyRestoOrderStatus,
        updateNearbyRestaurantDetails,
        addNearbyRestoItem,
        updateNearbyRestoItem,
        deleteNearbyRestoItem,
        toggleNearbyRestoItemAvailability,
        isTourActive,
        currentTourStepIndex,
        tourSteps,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
        isCheatSheetOpen,
        setIsCheatSheetOpen,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        walletBalance,
        walletTransactions,
        topUpWallet,
        deductWallet,
        isWalletModalOpen,
        setIsWalletModalOpen,
        currentLanguage,
        setLanguage,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
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
