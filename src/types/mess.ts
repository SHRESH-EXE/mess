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
