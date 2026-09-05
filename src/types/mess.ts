export type UserRole = 'student' | 'admin' | 'vendor';

export interface AllergenCategory {
  category: string;
  description: string;
  items: string[];
}

export const VEGETARIAN_ALLERGEN_CATEGORIES: AllergenCategory[] = [
  {
    category: 'Nuts & Legumes',
    description: 'Groundnuts, tree nuts, pulses & legumes',
    items: [
      'Peanuts',
      'Tree Nuts',
      'Almonds',
      'Cashews',
      'Walnuts',
      'Pistachios',
      'Hazelnuts',
      'Pecans',
      'Brazil Nuts',
      'Soy / Soya',
      'Tofu',
      'Soya Chunks',
      'Chickpeas / Besan',
      'Lentils / Dal',
      'Green Peas',
      'Kidney Beans / Rajma',
      'Black Gram / Urad Dal',
      'Mung Bean',
      'Lupin'
    ]
  },
  {
    category: 'Dairy & Milk Derivatives',
    description: 'Milk proteins (casein, whey), lactose & dairy products',
    items: [
      'Dairy / Cow Milk',
      'Dairy',
      'Buffalo Milk',
      'Lactose',
      'Casein / Whey Protein',
      'Paneer / Cottage Cheese',
      'Cheese',
      'Butter & Ghee',
      'Yogurt / Curd / Dahi',
      'Cream / Malai',
      'Buttermilk / Chaas'
    ]
  },
  {
    category: 'Grains & Cereals',
    description: 'Gluten-bearing and non-gluten grains, starches & flours',
    items: [
      'Gluten',
      'Wheat / Atta / Maida',
      'Semolina / Suji / Rava',
      'Barley',
      'Rye',
      'Oats',
      'Corn / Maize',
      'Cornstarch',
      'Rice',
      'Millet / Ragi / Bajra',
      'Buckwheat / Kuttu',
      'Quinoa'
    ]
  },
  {
    category: 'Seeds & Cooking Oils',
    description: 'Oilseeds, seed pastes & plant oils',
    items: [
      'Sesame Seeds / Til',
      'Mustard Seeds & Oil',
      'Sunflower Seeds & Oil',
      'Pumpkin Seeds',
      'Flaxseeds / Alsi',
      'Chia Seeds',
      'Poppy Seeds / Khus Khus',
      'Nigella Seeds / Kalonji'
    ]
  },
  {
    category: 'Vegetables & Nightshades',
    description: 'Alliums, solanaceae, root vegetables & fungi',
    items: [
      'Tomatoes',
      'Eggplant / Brinjal',
      'Bell Peppers / Capsicum',
      'Potatoes',
      'Chilli / Hot Peppers',
      'Garlic',
      'Onions',
      'Ginger',
      'Celery / Celeriac',
      'Spinach / Palak',
      'Mushrooms / Edible Fungi',
      'Cabbage & Cauliflower',
      'Okra / Bhindi',
      'Carrots',
      'Beetroot'
    ]
  },
  {
    category: 'Spices & Seasonings',
    description: 'Aromatic spices, culinary seeds & herbal extracts',
    items: [
      'Coriander / Dhania',
      'Cumin / Jeera',
      'Fennel / Saunf',
      'Fenugreek / Methi',
      'Cinnamon / Dalchini',
      'Cardamom / Elaichi',
      'Cloves / Laung',
      'Nutmeg / Jaiphal',
      'Turmeric / Haldi',
      'Black Pepper',
      'Asafoetida / Hing',
      'Star Anise',
      'Mint / Pudina',
      'Saffron / Kesar'
    ]
  },
  {
    category: 'Fruits & Berries',
    description: 'Fresh fruits, citrus, stone fruits & tropical fruits',
    items: [
      'Citrus Fruits (Lemon/Orange)',
      'Strawberries & Berries',
      'Bananas',
      'Mangoes',
      'Apples',
      'Pineapples',
      'Kiwifruit',
      'Papaya',
      'Peaches & Apricots',
      'Grapes & Raisins',
      'Melons & Watermelon',
      'Coconut & Coconut Milk',
      'Avocado'
    ]
  },
  {
    category: 'Yeast, Additives & Preservatives',
    description: 'Fermentation agents, flavour enhancers & food additives',
    items: [
      'Baker’s & Brewer’s Yeast',
      'Cocoa / Chocolate',
      'Sulphites / Sulfites',
      'Monosodium Glutamate (MSG)',
      'Food Colorants (Tartrazine)',
      'Artificial Sweeteners (Aspartame)',
      'Benzoates & Sorbates'
    ]
  }
];

export const STANDARD_ALLERGENS: string[] = Array.from(
  new Set(VEGETARIAN_ALLERGEN_CATEGORIES.flatMap(cat => cat.items))
);

export type StandardAllergen = string;

export interface UserSession {
  role: UserRole;
  partnerType?: 'food_court' | 'nearby_resto';
  name: string;
  id: string;
  email?: string;
  rollNo?: string;
  hostel?: string;
  roomNo?: string;
  avatarUrl?: string;
  designation?: string;
  stallId?: string;
  stallName?: string;
  restoId?: string;
  restoName?: string;
  allergies?: string[];
  loginTime: string;
}

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DietaryTag = 'veg' | 'high-protein' | 'jain' | 'special' | 'sweet';

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
  price?: number;
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

export type DayScholarOrderStatus = 'New' | 'Preparing' | 'Ready' | 'Collected' | 'Cancelled';

export interface DayScholarOrderItem {
  dishName: string;
  quantity: number;
  price: number;
  allergens?: string[];
}

export interface DayScholarOrder {
  id: string;
  name: string;
  phoneNumber: string;
  department: string;
  mealSlot: MealType;
  items: DayScholarOrderItem[];
  preference: 'pickup' | 'delivery';
  blockName?: string;
  roomFloor?: string;
  specialNotes?: string;
  status: DayScholarOrderStatus;
  timestamp: string;
  totalAmount: number;
  targetWhatsAppNumber?: string;
}

// Food Court Types
export type FoodCourtRushLevel = 'Low' | 'Moderate' | 'High' | 'Peak';

export interface FoodCourtCustomization {
  spiceLevel?: 'Mild' | 'Medium' | 'Extra Spicy';
  addCheese?: boolean;
  jainPrep?: boolean;
  specialNotes?: string;
}

export interface FoodCourtItem {
  id: string;
  stallId: string;
  stallName: string;
  name: string;
  category: 'Rolls & Wraps' | 'South Indian' | 'Chai & Snacks' | 'Pizza & Burgers' | 'Chinese & Noodles' | 'Beverages & Shakes' | 'Healthy Bowls' | 'Desserts';
  price: number;
  basePrepMins: number;
  description: string;
  isVeg: boolean;
  isChefSpecial?: boolean;
  isBestSeller?: boolean;
  calories?: number;
  allergens?: string[];
  imageUrl?: string;
  available: boolean;
}

export interface FoodCourtStall {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  location: string;
  stallNumber: string;
  rating: number;
  ratingCount: number;
  isOpen: boolean;
  rushLevel: FoodCourtRushLevel;
  activeQueueCount: number;
  estimatedWaitMins: number;
  iconEmoji: string;
  accentColor: string;
  bannerImage: string;
  popularItems: string[];
  openingHours: string;
}

export type FoodCourtOrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface FoodCourtCartItem {
  item: FoodCourtItem;
  quantity: number;
  customization?: FoodCourtCustomization;
  itemTotal: number;
}

export interface FoodCourtOrder {
  id: string;
  tokenNumber: string;
  studentId?: string;
  studentName: string;
  phoneNumber: string;
  rollNo?: string;
  stallId: string;
  stallName: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    customization?: FoodCourtCustomization;
  }[];
  totalAmount: number;
  pickupMethod: 'counter_pickup' | 'dine_in' | 'express_takeaway';
  status: FoodCourtOrderStatus;
  rushLevelAtOrder: FoodCourtRushLevel;
  queuePosition: number;
  estimatedPrepMins: number;
  estimatedReadyTime: string;
  placedAt: string;
  paymentMethod: 'UPI / Hostel Pay' | 'Mess Wallet' | 'Cash at Counter';
  targetWhatsAppNumber: string;
  specialInstructions?: string;
}

// Food Court Anonymous Feedback Structure
export type FoodCourtFeedbackCategory =
  | 'Taste & Quality'
  | 'Hygiene & Cleanliness'
  | 'Speed & Waiting Time'
  | 'Portion & Pricing'
  | 'General Suggestion';

export interface FoodCourtFeedback {
  id: string;
  stallId: string;
  stallName: string;
  dishName?: string;
  rating: number; // 1 to 5
  hygieneRating?: number; // 1 to 5
  speedRating?: number; // 1 to 5
  comment: string;
  category: FoodCourtFeedbackCategory;
  timestamp: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'Reviewed' | 'Pending' | 'Action Taken';
  ownerNote?: string;
}

// =========================================================================
// NEARBY RESTAURANT TYPES (NEW SECTION)
// =========================================================================
export interface NearbyRestaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  distance: string;
  distanceMeters?: number;
  deliveryTime: string;
  rating: number;
  ratingCount: number;
  priceForTwo: number;
  studentDiscount?: string;
  isOpen: boolean;
  isPureVeg: boolean;
  address: string;
  phone: string;
  bannerImage?: string;
  imageUrl?: string;
  logoEmoji?: string;
  popularDishes?: string[];
  features?: string[];
  openingHours?: string;
  adminEmail?: string;
  specialty?: string;
  famousFor?: string;
  discountOffer?: string;
  minOrder?: number;
}

export interface NearbyRestaurantItem {
  id: string;
  restoId: string;
  restoName: string;
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  description: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isMustTry?: boolean;
  imageUrl?: string;
  available: boolean;
}

export interface NearbyRestaurantOrder {
  id: string;
  orderNumber: string;
  studentId?: string;
  studentName: string;
  studentRollNo?: string;
  phoneNumber?: string;
  contactPhone?: string;
  hostelRoom?: string;
  deliveryHostel?: string;
  deliveryRoom?: string;
  restoId: string;
  restoName: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    isVeg?: boolean;
  }[];
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  totalAmount: number;
  deliveryType?: 'hostel_gate_delivery' | 'dine_in_table' | 'takeaway';
  status: 'Received' | 'Confirmed' | 'Cooking' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'UPI / GPay' | 'Cash on Delivery' | 'Campus Pay' | 'UPI';
  specialInstructions?: string;
  placedAt: string;
  estimatedDeliveryTime: string;
}

// Guided Tour Types
export interface TourStep {
  id: string;
  tabId?: 'menu' | 'pass' | 'nearbyresto' | 'foodcourt' | 'parcel' | 'dayscholar' | 'feedback';
  title: string;
  tagline: string;
  description: string;
  elementId?: string;
  highlightText?: string;
  tip?: string;
  iconName: string;
}


