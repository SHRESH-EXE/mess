export type UserRole = 'student' | 'admin';

export const STANDARD_ALLERGENS = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Eggs',
  'Gluten',
  'Soy',
  'Shellfish',
  'Fish'
] as const;

export type StandardAllergen = typeof STANDARD_ALLERGENS[number];

export interface UserSession {
  role: UserRole;
  name: string;
  id: string;
  email?: string;
  rollNo?: string;
  hostel?: string;
  roomNo?: string;
  avatarUrl?: string;
  designation?: string;
  allergies?: string[];
  loginTime: string;
}

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DietaryTag = 'veg' | 'non-veg' | 'egg' | 'high-protein' | 'jain' | 'special' | 'sweet';

export interface DishItem {
  id: string;
  name: string;
  category: 'main' | 'bread' | 'side' | 'dessert' | 'beverage' | 'snack';
  tags: DietaryTag[];
  calories?: number;
  protein?: string;
  description?: string;
  allergens?: string[];
  ingredients?: string[];
  isChefSpecial?: boolean;
}

export interface MealSlot {
  id: string;
  type: MealType;
  name: string;
  timing: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  dishes: DishItem[];
  caloriesTotal: number;
  specialNote?: string;
  ratingAvg?: number;
  ratingsCount?: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayMenu {
  day: DayOfWeek;
  dateStr?: string;
  theme?: string;
  meals: Record<MealType, MealSlot>;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  hostel: string;
  roomNo: string;
  email: string;
  phone: string;
  planName: string;
  planType: 'full' | 'lunch_dinner' | 'custom';
  totalMealsOpted: number;
  mealsConsumedMonth: number;
  photoUrl: string;
  barcode: string;
  active: boolean;
  department: string;
  semester: string;
  allergies: string[];
}

export interface MealAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  hostel: string;
  roomNo: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  timestamp: string; // e.g. "08:24 AM"
  method: 'qr_scanner' | 'manual_admin' | 'pass_tap';
  status: 'attended' | 'skipped' | 'rebate_applied';
  rebateReason?: string;
}

export interface OrderItem {
  dishName: string;
  quantity: number;
  price: number;
  isIncludedInMessPass: boolean;
}

export interface AcademicBlockOrder {
  id: string;
  studentId?: string;
  studentName: string;
  phone: string;
  rollNo?: string;
  blockName: string;
  roomFloor: string;
  items: OrderItem[];
  packingType: 'Eco Paper Box' | 'Steel Tiffin (Returnable)' | 'Disposable Tray';
  notes?: string;
  deliverySlot: string;
  orderTime: string;
  status: 'Pending' | 'In Kitchen' | 'Dispatched' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  useMessPass: boolean;
  targetWhatsAppNumber: string;
}

export interface MessAnnouncement {
  id: string;
  title: string;
  date: string;
  priority: 'normal' | 'high' | 'urgent';
  message: string;
  tag: string;
}

export interface DishRating {
  dishId: string;
  dishName: string;
  studentId: string;
  rating: number; // 1-5
  comment?: string;
  date: string;
}

/**
 * Anonymous Feedback Structure
 * Structurally strictly lacks studentId, studentName, rollNo, or session token
 * to guarantee anonymity at the data layer.
 */
export interface AnonymousFeedback {
  id: string;
  mealSlot: MealType;
  dishName: string;
  rating: number; // 1 to 5
  comment?: string;
  timestamp: string;
  date: string;
}

