import { DayMenu, StudentProfile, MessAnnouncement, AcademicBlockOrder, AnonymousFeedback, DayScholarOrder, DishItem } from '../types/mess';

export const INITIAL_ANNOUNCEMENTS: MessAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Sunday Grand Feast: Pure Veg Dum Biryani & Gulab Jamun',
    date: 'Upcoming Sunday',
    priority: 'high',
    message: 'Special dinner served between 7:30 PM - 10:00 PM with Royal Paneer Dum Biryani, Mirchi Ka Salan, Burani Raita & Hot Gulab Jamun.',
    tag: 'Feast Menu'
  },
  {
    id: 'ann-2',
    title: 'Allergen Information & Kitchen Transparency',
    date: 'Active Policy',
    priority: 'normal',
    message: 'All kitchen ingredients and potential allergens (Dairy, Gluten, Nuts, Eggs) are now tracked. Check dish tags before dining.',
    tag: 'Safety'
  },
  {
    id: 'ann-3',
    title: 'Academic Block Lunch Parcel Timings',
    date: 'Active Daily',
    priority: 'normal',
    message: 'Place parcel orders before 12:15 PM for 1:00 PM batch delivery to CS Block, Library, and Tech Shed.',
    tag: 'Delivery Update'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'stu-1',
    name: 'Aarav Sharma',
    rollNo: '22CS0142',
    hostel: 'Aryabhatta Hostel (Block-B)',
    roomNo: 'B-312',
    email: 'aarav.sharma@campus.edu',
    phone: '+91 98765 43210',
    planName: 'Full Mess Pass (4 Meals/Day)',
    planType: 'full',
    totalMealsOpted: 120,
    mealsConsumedMonth: 78,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    barcode: 'CMH-22CS0142-2026',
    active: true,
    department: 'Computer Science & Engg',
    semester: '6th Semester',
    allergies: ['Dairy', 'Tree Nuts']
  },
  {
    id: 'stu-2',
    name: 'Priya Patel',
    rollNo: '23EE0089',
    hostel: 'Gargi Girls Hostel (Block-A)',
    roomNo: 'A-204',
    email: 'priya.patel@campus.edu',
    phone: '+91 98451 23456',
    planName: 'Flexi Pass (Lunch + Dinner)',
    planType: 'lunch_dinner',
    totalMealsOpted: 60,
    mealsConsumedMonth: 41,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    barcode: 'CMH-23EE0089-2026',
    active: true,
    department: 'Electrical Engineering',
    semester: '4th Semester',
    allergies: ['Gluten']
  },
  {
    id: 'stu-3',
    name: 'Rohan Verma',
    rollNo: '21ME0310',
    hostel: 'CV Raman Hostel (Block-C)',
    roomNo: 'C-108',
    email: 'rohan.verma@campus.edu',
    phone: '+91 97112 34890',
    planName: 'Full Mess Pass (4 Meals/Day)',
    planType: 'full',
    totalMealsOpted: 120,
    mealsConsumedMonth: 82,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    barcode: 'CMH-21ME0310-2026',
    active: true,
    department: 'Mechanical Engineering',
    semester: '8th Semester',
    allergies: ['Peanuts', 'Eggs']
  },
  {
    id: 'stu-4',
    name: 'Ananya Deshmukh',
    rollNo: '23BT0045',
    hostel: 'Sarojini Hostel (Block-D)',
    roomNo: 'D-118',
    email: 'ananya.d@campus.edu',
    phone: '+91 98220 54321',
    planName: 'Full Mess Pass (4 Meals/Day)',
    planType: 'full',
    totalMealsOpted: 120,
    mealsConsumedMonth: 65,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    barcode: 'CMH-23BT0045-2026',
    active: true,
    department: 'Bio-Technology',
    semester: '4th Semester',
    allergies: ['Soy', 'Dairy']
  },
  {
    id: 'stu-5',
    name: 'Vikramaditya Rao',
    rollNo: '22CE0199',
    hostel: 'Aryabhatta Hostel (Block-B)',
    roomNo: 'B-105',
    email: 'vikram.rao@campus.edu',
    phone: '+91 99001 88776',
    planName: 'Full Mess Pass (4 Meals/Day)',
    planType: 'full',
    totalMealsOpted: 120,
    mealsConsumedMonth: 90,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    barcode: 'CMH-22CE0199-2026',
    active: true,
    department: 'Civil Engineering',
    semester: '6th Semester',
    allergies: ['Shellfish', 'Fish']
  }
];

export const ACADEMIC_BLOCKS: string[] = Array.from(
  { length: 30 },
  (_, i) => `Academic Block ${i + 1}`
);

export const DEFAULT_MESS_WHATSAPP_NUMBER = '919876543210';

export const INITIAL_WEEKLY_MENU: Record<string, DayMenu> = {
  Monday: {
    day: 'Monday',
    theme: 'Energy Start Mon',
    meals: {
      breakfast: {
        id: 'mon-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 09:30 AM',
        startHour: 7,
        startMin: 30,
        endHour: 9,
        endMin: 30,
        caloriesTotal: 480,
        ratingAvg: 4.6,
        ratingsCount: 142,
        specialNote: 'Fresh filter coffee and warm sprouts available at the live counter.',
        dishes: [
          {
            id: 'm-bf-1',
            name: 'Steamed Idli & Medu Vada (2 pcs)',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 240,
            protein: '9g',
            description: 'Fluffy fermented rice-lentil steamed cakes with crisp lentil fritters.',
            allergens: [],
            ingredients: ['Idli Rice', 'Urad Dal (Black Gram)', 'Fenugreek Seeds', 'Curry Leaves', 'Black Pepper', 'Refined Sunflower Oil', 'Rock Salt']
          },
          {
            id: 'm-bf-2',
            name: 'Madras Sambar & Fresh Coconut Chutney',
            category: 'side',
            tags: ['veg'],
            calories: 120,
            protein: '4g',
            description: 'Aromatic drumstick tamarind stew and freshly ground coconut-chilli chutney.',
            allergens: [],
            ingredients: ['Toor Dal', 'Fresh Grated Coconut', 'Drumstick', 'Shallots', 'Tamarind Pulp', 'Mustard Seeds', 'Green Chillies', 'Curry Leaves', 'Hing (Asafoetida)']
          },
          {
            id: 'm-bf-3',
            name: 'Sprouted Moong & Peanut Poha (High Protein)',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 195,
            protein: '10g',
            description: 'Flattened rice tempered with mustard, curry leaves, roasted peanuts and steamed sprouted moong.',
            allergens: ['Peanuts'],
            ingredients: ['Flattened Rice (Poha)', 'Sprouted Moong Beans', 'Roasted Peanuts', 'Mustard Seeds', 'Turmeric Powder', 'Green Chillies', 'Fresh Coriander', 'Lemon Juice']
          },
          {
            id: 'm-bf-4',
            name: 'Masala Chai / Filter Coffee / Bournvita Milk',
            category: 'beverage',
            tags: ['veg'],
            calories: 85,
            description: 'Fresh hot beverage served with whole milk or black.',
            allergens: ['Dairy'],
            ingredients: ['Full Cream Cow Milk', 'Assam Black Tea Leaves', 'Roasted Coffee Chicory Blend', 'Crushed Fresh Ginger', 'Cardamom Pods', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'mon-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 720,
        ratingAvg: 4.7,
        ratingsCount: 198,
        specialNote: 'Chef Special: Shahi Paneer with Fresh Butter Tandoori Roti.',
        dishes: [
          {
            id: 'm-lu-1',
            name: 'Shahi Paneer Butter Masala',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 280,
            protein: '14g',
            description: 'Cottage cheese simmered in rich cashew-tomato velvet gravy.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Fresh Paneer (Cottage Cheese)', 'Amul Table Butter', 'Fresh Milk Cream', 'Cashew Nut Paste', 'Tomato Puree', 'Kashmiri Red Chilli', 'Kasuri Methi', 'Garam Masala'],
            isChefSpecial: true
          },
          {
            id: 'm-lu-2',
            name: 'Dal Tadka (Arhar/Toor Dal)',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 160,
            protein: '8g',
            description: 'Slow-cooked yellow lentils tempered with cumin, garlic, and desi ghee.',
            allergens: ['Dairy'],
            ingredients: ['Toor Dal (Yellow Pigeon Peas)', 'Desi Ghee (Clarified Butter)', 'Cumin Seeds', 'Chopped Garlic', 'Ripe Tomatoes', 'Green Chillies', 'Coriander']
          },
          {
            id: 'm-lu-3',
            name: 'Steamed Basmati Rice & Jeera Pulao',
            category: 'main',
            tags: ['veg'],
            calories: 200,
            protein: '4g',
            description: 'Fragrant long-grain basmati rice tempered with roasted cumin.',
            allergens: [],
            ingredients: ['Aged Basmati Rice', 'Roasted Cumin Seeds', 'Refined Sunflower Oil', 'Bay Leaf', 'Cloves', 'Pinch of Salt']
          },
          {
            id: 'm-lu-4',
            name: 'Phulka / Butter Tawa Roti (Unlimited)',
            category: 'bread',
            tags: ['veg'],
            calories: 140,
            protein: '5g',
            description: 'Whole wheat flatbreads brushed with fresh butter.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Table Butter', 'Water', 'Salt']
          },
          {
            id: 'm-lu-5',
            name: 'Boondi Raita & Fresh Green Salad',
            category: 'side',
            tags: ['veg'],
            calories: 75,
            protein: '3g',
            description: 'Spiced chilled curd with crispy chickpea pearls and seasonal cucumber-carrot slices.',
            allergens: ['Dairy'],
            ingredients: ['Fresh Pasteurized Dahi (Curd)', 'Chickpea Flour (Besan Boondi)', 'Roasted Cumin Powder', 'Black Salt', 'Cucumber', 'Carrot', 'Mint']
          },
          {
            id: 'm-lu-6',
            name: 'Hot Gulab Jamun (1 pc)',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 150,
            description: 'Traditional milk-solid dumplings soaked in rose cardamom sugar syrup.',
            allergens: ['Dairy', 'Gluten'],
            ingredients: ['Mawa / Khoya (Concentrated Milk Solids)', 'Refined Wheat Flour (Maida)', 'Pure Desi Ghee', 'Cardamom Sugar Syrup', 'Rose Water']
          }
        ]
      },
      snacks: {
        id: 'mon-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 340,
        ratingAvg: 4.8,
        ratingsCount: 165,
        dishes: [
          {
            id: 'm-sn-1',
            name: 'Crispy Veg Samosa with Mint & Imli Chutney',
            category: 'snack',
            tags: ['veg', 'special'],
            calories: 220,
            description: 'Golden flaky pastry stuffed with spiced potato and peas.',
            allergens: ['Gluten', 'Peanuts'],
            ingredients: ['Refined Wheat Flour (Maida)', 'Mashed Potatoes', 'Green Peas', 'Crushed Peanuts', 'Coriander Seeds', 'Garam Masala', 'Tamarind Pulp', 'Mint Leaves', 'Vegetable Oil']
          },
          {
            id: 'm-sn-2',
            name: 'Adrak Elaichi Special Chai / Cold Coffee',
            category: 'beverage',
            tags: ['veg'],
            calories: 95,
            description: 'Fresh crushed ginger and cardamom brewed tea.',
            allergens: ['Dairy'],
            ingredients: ['Whole Milk', 'Assam CTC Tea', 'Crushed Ginger Root', 'Green Cardamom', 'Instant Coffee Powder', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'mon-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 680,
        ratingAvg: 4.5,
        ratingsCount: 180,
        dishes: [
          {
            id: 'm-di-1',
            name: 'Aloo Gobi Matar Masala',
            category: 'main',
            tags: ['veg'],
            calories: 190,
            protein: '5g',
            description: 'Homestyle cauliflower, potato and green peas in light onion-tomato masala.',
            allergens: [],
            ingredients: ['Fresh Cauliflower Florets', 'Potatoes', 'Green Peas', 'Onion', 'Tomato Gravy', 'Turmeric', 'Coriander Powder', 'Cumin']
          },
          {
            id: 'm-di-2',
            name: 'Kadai Paneer & Soya Chaap Gravy',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 270,
            protein: '16g',
            description: 'Rich spiced onion-tomato curry with fresh cottage cheese cubes and bell peppers.',
            allergens: ['Dairy', 'Soy'],
            ingredients: ['Fresh Paneer (Cottage Cheese)', 'Soya Chunks', 'Bell Peppers (Capsicum)', 'Butter', 'Onions', 'Tomatoes', 'Kadai Masala Spices', 'Kasuri Methi']
          },
          {
            id: 'm-di-3',
            name: 'Dal Palak (Spinach Lentils)',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 140,
            protein: '7g',
            description: 'Nutritious yellow dal infused with fresh chopped spinach leaves.',
            allergens: [],
            ingredients: ['Yellow Moong Dal', 'Fresh Farm Spinach (Palak)', 'Garlic', 'Cumin Seeds', 'Mustard Oil', 'Green Chillies']
          },
          {
            id: 'm-di-4',
            name: 'Hot Rotis & Steamed Rice',
            category: 'bread',
            tags: ['veg'],
            calories: 220,
            protein: '6g',
            description: 'Freshly puffed whole wheat rotis.',
            allergens: ['Gluten'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Basmati Steamed Rice', 'Water']
          },
          {
            id: 'm-di-5',
            name: 'Rice Kheer with Pistachios',
            category: 'dessert',
            tags: ['sweet'],
            calories: 160,
            description: 'Slow-simmered basmati rice pudding in thickened cardamom milk.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Full Cream Milk', 'Basmati Rice', 'Pistachio Slivers', 'Almonds', 'Cardamom', 'Sugar']
          }
        ]
      }
    }
  },
  Tuesday: {
    day: 'Tuesday',
    theme: 'North-South Fusion',
    meals: {
      breakfast: {
        id: 'tue-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 09:30 AM',
        startHour: 7,
        startMin: 30,
        endHour: 9,
        endMin: 30,
        caloriesTotal: 510,
        ratingAvg: 4.7,
        ratingsCount: 155,
        dishes: [
          {
            id: 't-bf-1',
            name: 'Punjabi Aloo Paratha with Amul Butter & Curd',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 340,
            protein: '8g',
            description: 'Whole wheat griddle bread stuffed with spiced mashed potatoes.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Boiled Potatoes', 'Table Butter', 'Fresh Dahi (Curd)', 'Ajwain (Carom Seeds)', 'Green Chillies', 'Amchur']
          },
          {
            id: 't-bf-2',
            name: 'Sprouts Salad & Lemon Wedges',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 90,
            protein: '6g',
            description: 'Moong and chickpea sprouts with onions, tomatoes and coriander.',
            allergens: [],
            ingredients: ['Sprouted Green Moong', 'Sprouted Kala Chana', 'Finely Diced Onion', 'Tomatoes', 'Chaat Masala', 'Lemon Juice']
          },
          {
            id: 't-bf-3',
            name: 'Hot Masala Tea / Hot Milk',
            category: 'beverage',
            tags: ['veg'],
            calories: 80,
            description: 'Freshly brewed campus morning tea.',
            allergens: ['Dairy'],
            ingredients: ['Cow Milk', 'Black Tea Leaves', 'Spices (Ginger, Cardamom, Clove)', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'tue-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 740,
        ratingAvg: 4.6,
        ratingsCount: 210,
        dishes: [
          {
            id: 't-lu-1',
            name: 'Amritsari Chole Kulche / Bhature',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 360,
            protein: '12g',
            description: 'Robust spiced dark chickpeas with fluffy fermented bread.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Kabuli Chana (Chickpeas)', 'Refined Wheat Flour (Maida)', 'Butter', 'Anardana (Dried Pomegranate)', 'Amchur', 'Black Tea Bag (for color)', 'Ginger Juliennes']
          },
          {
            id: 't-lu-2',
            name: 'Jeera Rice & Boondi Raita',
            category: 'side',
            tags: ['veg'],
            calories: 190,
            protein: '4g',
            description: 'Cumin flavored rice with cool spiced curd.',
            allergens: ['Dairy'],
            ingredients: ['Basmati Rice', 'Cumin Seeds', 'Dahi (Yogurt)', 'Besan Boondi', 'Black Salt', 'Mint']
          },
          {
            id: 't-lu-3',
            name: 'Tawa Roti & Pickled Onions',
            category: 'bread',
            tags: ['veg'],
            calories: 140,
            protein: '4g',
            description: 'Hot wheat rotis with vinegar onion rings.',
            allergens: ['Gluten'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Shallots / Baby Onions', 'Beetroot Juice Vinegar', 'Salt']
          },
          {
            id: 't-lu-4',
            name: 'Pineapple Halwa',
            category: 'dessert',
            tags: ['sweet'],
            calories: 180,
            description: 'Rich semolina pudding cooked with real pineapple chunks and ghee.',
            allergens: ['Gluten', 'Dairy', 'Tree Nuts'],
            ingredients: ['Semolina (Sooji)', 'Fresh Pineapple Chunks', 'Pure Desi Ghee', 'Cashews', 'Cardamom', 'Sugar']
          }
        ]
      },
      snacks: {
        id: 'tue-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 310,
        ratingAvg: 4.5,
        ratingsCount: 140,
        dishes: [
          {
            id: 't-sn-1',
            name: 'Mumbai Style Bhel Puri / Sev Puri',
            category: 'snack',
            tags: ['veg'],
            calories: 210,
            description: 'Crisp puffed rice, papdi, veggies and sweet-tangy chutneys.',
            allergens: ['Gluten', 'Peanuts'],
            ingredients: ['Puffed Rice (Kurmura)', 'Crispy Wheat Papdi', 'Roasted Peanuts', 'Sev (Gram Flour Vermicelli)', 'Tamarind Dates Chutney', 'Spicy Green Chutney', 'Raw Mango Pieces']
          },
          {
            id: 't-sn-2',
            name: 'Special Cutting Chai',
            category: 'beverage',
            tags: ['veg'],
            calories: 85,
            description: 'Cardamom strong tea.',
            allergens: ['Dairy'],
            ingredients: ['Milk', 'Assam Tea', 'Crushed Cardamom Pods', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'tue-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 690,
        ratingAvg: 4.8,
        ratingsCount: 175,
        dishes: [
          {
            id: 't-di-1',
            name: 'Matar Paneer',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 240,
            protein: '12g',
            description: 'Tender cottage cheese and sweet green peas in spiced onion gravy.',
            allergens: ['Dairy'],
            ingredients: ['Paneer (Cottage Cheese)', 'Green Peas (Matar)', 'Onion Tomato Gravy', 'Ghee', 'Garam Masala', 'Fresh Cream']
          },
          {
            id: 't-di-2',
            name: 'Soya Chaap Tikka Masala & Mushroom Do Pyaza',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 280,
            protein: '18g',
            description: 'Tender protein-packed soya chaap chunks and button mushrooms in rich Punjabi gravy.',
            allergens: ['Soy', 'Gluten', 'Dairy'],
            ingredients: ['Soya Flour Sticks (Chaap)', 'Fresh Button Mushrooms', 'Wheat Gluten', 'Whole Spices', 'Fried Onion Gravy', 'Ginger Garlic Paste', 'Desi Ghee', 'Fresh Cream']
          },
          {
            id: 't-di-3',
            name: 'Dal Makhani',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 190,
            protein: '8g',
            description: 'Black lentils slow cooked overnight with butter and cream.',
            allergens: ['Dairy'],
            ingredients: ['Black Urad Dal', 'Rajma (Kidney Beans)', 'White Butter (Makhan)', 'Heavy Cream', 'Kashmiri Red Chilli', 'Tomato Puree', 'Kasuri Methi']
          },
          {
            id: 't-di-4',
            name: 'Butter Phulka & Steamed Rice',
            category: 'bread',
            tags: ['veg'],
            calories: 210,
            protein: '5g',
            description: 'Unlimited hot flatbreads.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Butter', 'Basmati Steamed Rice']
          },
          {
            id: 't-di-5',
            name: 'Ice Cream Cup (Vanilla / Butterscotch)',
            category: 'dessert',
            tags: ['sweet'],
            calories: 130,
            description: 'Chilled dessert cup.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Milk Solids', 'Sugar', 'Butterscotch Crunch (Cashew/Sugar)', 'Natural Vanilla Flavor']
          }
        ]
      }
    }
  },
  Wednesday: {
    day: 'Wednesday',
    theme: 'Flavors of Deccan',
    meals: {
      breakfast: {
        id: 'wed-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 09:30 AM',
        startHour: 7,
        startMin: 30,
        endHour: 9,
        endMin: 30,
        caloriesTotal: 490,
        ratingAvg: 4.9,
        ratingsCount: 220,
        dishes: [
          {
            id: 'w-bf-1',
            name: 'Crispy Masala Dosa with Potato Roast Filling',
            category: 'main',
            tags: ['veg', 'special'],
            calories: 280,
            protein: '7g',
            description: 'Crisp golden rice crepe with savory spiced mashed potatoes.',
            allergens: ['Dairy'],
            ingredients: ['Fermented Rice & Lentil Batter', 'Potatoes', 'Mustard Seeds', 'Butter / Ghee', 'Curry Leaves', 'Turmeric', 'Onions']
          },
          {
            id: 'w-bf-2',
            name: 'Tomato Chutney & Coconut Chutney',
            category: 'side',
            tags: ['veg'],
            calories: 95,
            description: 'Dual south-Indian chutney combo.',
            allergens: [],
            ingredients: ['Roasted Tomatoes', 'Fresh Grated Coconut', 'Urad Dal', 'Red Chillies', 'Curry Leaves', 'Asafoetida']
          },
          {
            id: 'w-bf-3',
            name: 'Sprouted Moong & Vegetable Rava Upma',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 190,
            protein: '8g',
            description: 'Roasted semolina upma loaded with fresh farm vegetables, steamed moong sprouts, and cashews.',
            allergens: ['Gluten', 'Tree Nuts'],
            ingredients: ['Roasted Semolina (Rava)', 'Sprouted Moong Beans', 'Carrots', 'Beans', 'Ginger', 'Curry Leaves', 'Mustard Seeds', 'Roasted Cashews', 'Ghee']
          },
          {
            id: 'w-bf-4',
            name: 'Filter Coffee / Tea',
            category: 'beverage',
            tags: ['veg'],
            calories: 80,
            description: 'Authentic south style frothy filter coffee.',
            allergens: ['Dairy'],
            ingredients: ['Brewed Coffee Decoction', 'Whole Milk', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'wed-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 710,
        ratingAvg: 4.6,
        ratingsCount: 185,
        dishes: [
          {
            id: 'w-lu-1',
            name: 'Rajma Masala (Kashmiri Kidney Beans)',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 260,
            protein: '13g',
            description: 'Plump kidney beans slow simmered with whole spices.',
            allergens: [],
            ingredients: ['Red Kashmiri Kidney Beans (Rajma)', 'Onion Tomato Masala', 'Ginger Garlic', 'Cumin', 'Coriander', 'Bay Leaves']
          },
          {
            id: 'w-lu-2',
            name: 'Mix Veg Korma (Carrots, Beans, Corn)',
            category: 'side',
            tags: ['veg'],
            calories: 170,
            protein: '4g',
            description: 'Garden vegetables in mildly spiced coconut gravy.',
            allergens: ['Tree Nuts'],
            ingredients: ['Carrots', 'French Beans', 'Sweet Corn', 'Coconut Paste', 'Cashew Paste', 'Green Chillies', 'Fennel Seeds']
          },
          {
            id: 'w-lu-3',
            name: 'Steamed Rice & Phulka',
            category: 'main',
            tags: ['veg'],
            calories: 210,
            protein: '5g',
            description: 'Hot comforting rice and flatbread.',
            allergens: ['Gluten'],
            ingredients: ['Aged Steamed Basmati Rice', 'Whole Wheat Flour (Atta)']
          },
          {
            id: 'w-lu-4',
            name: 'Curd / Buttermilk & Roasted Papad',
            category: 'side',
            tags: ['veg'],
            calories: 70,
            description: 'Probiotic plain yogurt and crisp lentil papad.',
            allergens: ['Dairy'],
            ingredients: ['Fresh Dahi (Curd)', 'Lentil Papad (Urad/Moong)', 'Roasted Cumin', 'Mint']
          },
          {
            id: 'w-lu-5',
            name: 'Moong Dal Halwa',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 190,
            description: 'Rich roasted yellow lentil pudding with saffron.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Yellow Moong Dal (Lentil Paste)', 'Desi Ghee', 'Saffron Strands (Kesar)', 'Cardamom', 'Cashews', 'Almonds', 'Sugar']
          }
        ]
      },
      snacks: {
        id: 'wed-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 320,
        ratingAvg: 4.6,
        ratingsCount: 150,
        dishes: [
          {
            id: 'w-sn-1',
            name: 'Mumbai Pav Bhaji with Butter Toasted Pav',
            category: 'snack',
            tags: ['veg', 'special'],
            calories: 260,
            description: 'Mashed spicy vegetables topped with melted butter and lemon.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Potatoes', 'Green Peas', 'Cauliflower', 'Tomatoes', 'Capsicum', 'Pav Bhaji Masala', 'Butter', 'Bakery Wheat Pav (Buns)', 'Onions', 'Lemon']
          },
          {
            id: 'w-sn-2',
            name: 'Masala Chai',
            category: 'beverage',
            tags: ['veg'],
            calories: 80,
            description: 'Fresh boiled tea.',
            allergens: ['Dairy'],
            ingredients: ['Cow Milk', 'CTC Tea Leaves', 'Ginger', 'Cardamom', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'wed-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 700,
        ratingAvg: 4.7,
        ratingsCount: 190,
        dishes: [
          {
            id: 'w-di-1',
            name: 'Paneer Do Pyaza',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 250,
            protein: '13g',
            description: 'Cottage cheese chunks cooked with two textures of onions.',
            allergens: ['Dairy'],
            ingredients: ['Paneer (Cottage Cheese)', 'Caramelized Onion Gravy', 'Crunchy Diced Onions', 'Desi Ghee', 'Tomatoes', 'Whole Spices']
          },
          {
            id: 'w-di-2',
            name: 'Amritsari Paneer Bhurji & Veg Kolhapuri',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 240,
            protein: '14g',
            description: 'Spiced crumbled cottage cheese with bell peppers and fiery Kolhapuri mixed vegetables.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Crumbled Fresh Paneer', 'Bell Peppers', 'Onions', 'Tomatoes', 'Green Chillies', 'White Butter', 'Kolhapuri Spices (Sesame, Poppy Seeds, Coconut, Red Chillies)']
          },
          {
            id: 'w-di-3',
            name: 'Yellow Moong Dal Fry',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 130,
            protein: '7g',
            description: 'Light comforting yellow dal.',
            allergens: ['Dairy'],
            ingredients: ['Yellow Moong Dal', 'Desi Ghee', 'Cumin Seeds', 'Garlic', 'Turmeric', 'Coriander']
          },
          {
            id: 'w-di-4',
            name: 'Tandoori Roti & Veg Pulao',
            category: 'bread',
            tags: ['veg'],
            calories: 220,
            protein: '6g',
            description: 'Freshly baked tandoori bread and aromatic spiced rice.',
            allergens: ['Gluten'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Basmati Rice', 'Carrots', 'Green Beans', 'Cardamom', 'Cumin']
          },
          {
            id: 'w-di-5',
            name: 'Sweet Rasgulla (2 pcs)',
            category: 'dessert',
            tags: ['sweet'],
            calories: 140,
            description: 'Spongy cottage cheese balls soaked in light sugar syrup.',
            allergens: ['Dairy'],
            ingredients: ['Chenna (Fresh Curd Cheese)', 'Semolina Pinch', 'Sugar Syrup', 'Rose Water']
          }
        ]
      }
    }
  },
  Thursday: {
    day: 'Thursday',
    theme: 'Desi Comfort Feast',
    meals: {
      breakfast: {
        id: 'thu-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 09:30 AM',
        startHour: 7,
        startMin: 30,
        endHour: 9,
        endMin: 30,
        caloriesTotal: 470,
        ratingAvg: 4.5,
        ratingsCount: 130,
        dishes: [
          {
            id: 'th-bf-1',
            name: 'Indori Poha with Sev & Jeeravan Masala',
            category: 'main',
            tags: ['veg'],
            calories: 220,
            protein: '5g',
            description: 'Steamed flattened rice with peanuts, crunchy sev, pomegranate and special spices.',
            allergens: ['Peanuts'],
            ingredients: ['Flattened Rice (Poha)', 'Roasted Peanuts', 'Mustard Seeds', 'Fennel Seeds (Saunf)', 'Jeeravan Masala', 'Ratlami Sev (Besan)', 'Pomegranate Pearls', 'Lemon']
          },
          {
            id: 'th-bf-2',
            name: 'Sprouted Moong Salad & Bread Toast with Jam & Butter',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 210,
            protein: '9g',
            description: 'Toasted whole wheat bread with butter and jam paired with zesty sprouted moong salad.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['White & Wheat Bread Slices', 'Amul Table Butter', 'Mixed Fruit Jam', 'Sprouted Green Moong', 'Chaat Masala', 'Lemon']
          },
          {
            id: 'th-bf-3',
            name: 'Hot Bournvita Milk / Masala Chai',
            category: 'beverage',
            tags: ['veg'],
            calories: 90,
            description: 'Energizing malt beverage or tea.',
            allergens: ['Dairy', 'Gluten'],
            ingredients: ['Milk', 'Malted Barley / Bournvita Blend', 'Tea Leaves', 'Cardamom', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'thu-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 730,
        ratingAvg: 4.6,
        ratingsCount: 170,
        dishes: [
          {
            id: 'th-lu-1',
            name: 'Kadhi Pakora (Punjabi Gram Flour Dumpling Curry)',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 240,
            protein: '9g',
            description: 'Crisp onion fritters simmered in velvety spiced yogurt kadhi.',
            allergens: ['Dairy'],
            ingredients: ['Sour Curd / Dahi', 'Besan (Gram Flour)', 'Crisp Onion Pakoras', 'Fenugreek Seeds (Methi Dana)', 'Mustard Oil', 'Whole Red Chillies', 'Curry Leaves']
          },
          {
            id: 'th-lu-2',
            name: 'Aloo Methi / Bhindi Fry',
            category: 'side',
            tags: ['veg'],
            calories: 150,
            description: 'Crisp spiced okra or potatoes with fenugreek.',
            allergens: [],
            ingredients: ['Fresh Okra (Bhindi)', 'Potatoes', 'Fresh Fenugreek Leaves (Methi)', 'Amchur', 'Cumin', 'Mustard Oil']
          },
          {
            id: 'th-lu-3',
            name: 'Jeera Basmati Rice & Phulkas',
            category: 'main',
            tags: ['veg'],
            calories: 220,
            protein: '5g',
            description: 'Perfect pair for warm Kadhi.',
            allergens: ['Gluten'],
            ingredients: ['Basmati Rice', 'Roasted Cumin', 'Whole Wheat Flour (Atta)']
          },
          {
            id: 'th-lu-4',
            name: 'Cucumber Salad & Roasted Papad',
            category: 'side',
            tags: ['veg'],
            calories: 50,
            description: 'Crunchy accompaniments.',
            allergens: [],
            ingredients: ['Crisp Cucumbers', 'Carrot Slices', 'Urad Dal Papad', 'Chaat Masala', 'Lemon']
          },
          {
            id: 'th-lu-5',
            name: 'Fruit Custard with Jelly',
            category: 'dessert',
            tags: ['sweet'],
            calories: 140,
            description: 'Chilled vanilla custard with apples, bananas, and pomegranate.',
            allergens: ['Dairy'],
            ingredients: ['Full Cream Milk', 'Vanilla Custard Powder', 'Fresh Apple Cubes', 'Banana Slices', 'Pomegranate Pearls', 'Sugar']
          }
        ]
      },
      snacks: {
        id: 'thu-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 300,
        ratingAvg: 4.4,
        ratingsCount: 120,
        dishes: [
          {
            id: 'th-sn-1',
            name: 'Bread Pakora with Green Chutney',
            category: 'snack',
            tags: ['veg'],
            calories: 230,
            description: 'Spiced potato sandwich batter-fried to golden perfection.',
            allergens: ['Gluten'],
            ingredients: ['Bread Slices', 'Besan (Gram Flour Batter)', 'Mashed Spiced Potatoes', 'Green Coriander Mint Chutney', 'Ajwain', 'Refined Sunflower Oil']
          },
          {
            id: 'th-sn-2',
            name: 'Hot Ginger Tea',
            category: 'beverage',
            tags: ['veg'],
            calories: 75,
            description: 'Fresh brew.',
            allergens: ['Dairy'],
            ingredients: ['Milk', 'Tea Leaves', 'Fresh Crushed Ginger', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'thu-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 690,
        ratingAvg: 4.7,
        ratingsCount: 180,
        dishes: [
          {
            id: 'th-di-1',
            name: 'Malai Kofta in Cashew Cream Gravy',
            category: 'main',
            tags: ['veg', 'special'],
            calories: 290,
            protein: '8g',
            description: 'Paneer and potato dumplings in royal creamy gravy.',
            allergens: ['Dairy', 'Tree Nuts', 'Gluten'],
            ingredients: ['Paneer (Cottage Cheese)', 'Mashed Potatoes', 'Khoya', 'Cashew Nut Gravy', 'Fresh Cream', 'Butter', 'Refined Flour (Maida for coating)', 'Cardamom', 'Mace']
          },
          {
            id: 'th-di-2',
            name: 'Mushroom Matar Masala / Chana Dal Tadka',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 220,
            protein: '11g',
            description: 'Tender button mushrooms and green peas in spiced gravy alongside hearty tempered chana dal.',
            allergens: ['Dairy'],
            ingredients: ['Fresh Button Mushrooms', 'Green Peas', 'Bengal Gram (Chana Dal)', 'Desi Ghee', 'Onion Tomato Gravy', 'Garam Masala', 'Ginger Garlic']
          },
          {
            id: 'th-di-3',
            name: 'Steamed Rice & Butter Roti',
            category: 'bread',
            tags: ['veg'],
            calories: 210,
            protein: '6g',
            description: 'Freshly served.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Butter', 'Steamed Rice']
          },
          {
            id: 'th-di-4',
            name: 'Gajar ka Halwa (Warm Carrot Pudding)',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 190,
            description: 'Grated red carrots simmered with full cream milk, ghee, and roasted cashews.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Fresh Red Carrots', 'Full Fat Cow Milk', 'Khoya / Mawa', 'Pure Desi Ghee', 'Cashew Nuts', 'Golden Raisins', 'Cardamom', 'Sugar']
          }
        ]
      }
    }
  },
  Friday: {
    day: 'Friday',
    theme: 'Weekend Warm-up & Biryani Special',
    meals: {
      breakfast: {
        id: 'fri-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 09:30 AM',
        startHour: 7,
        startMin: 30,
        endHour: 9,
        endMin: 30,
        caloriesTotal: 520,
        ratingAvg: 4.8,
        ratingsCount: 205,
        dishes: [
          {
            id: 'f-bf-1',
            name: 'Puri Bhaji with Halwa (Poori Chana)',
            category: 'main',
            tags: ['veg', 'special'],
            calories: 360,
            protein: '7g',
            description: 'Crisp puffed whole wheat puris with spicy potato curry and sooji halwa.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta Puris)', 'Spiced Potato Curry (Aloo Bhaji)', 'Semolina (Sooji)', 'Desi Ghee', 'Cardamom', 'Sunflower Oil for Frying']
          },
          {
            id: 'f-bf-2',
            name: 'High-Protein Sprouted Moong & Kala Chana Chaat',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 150,
            protein: '9g',
            description: 'Fresh sprouted lentils tossed with diced cucumber, tomatoes, lemon and rock salt.',
            allergens: [],
            ingredients: ['Sprouted Green Moong Beans', 'Sprouted Kala Chana', 'Cucumber', 'Tomatoes', 'Black Pepper', 'Rock Salt', 'Fresh Lemon Juice', 'Coriander']
          },
          {
            id: 'f-bf-3',
            name: 'Filter Coffee / Masala Tea',
            category: 'beverage',
            tags: ['veg'],
            calories: 85,
            description: 'Hot brew.',
            allergens: ['Dairy'],
            ingredients: ['Milk', 'Coffee Chicory Powder / Tea Leaves', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'fri-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 750,
        ratingAvg: 4.7,
        ratingsCount: 215,
        dishes: [
          {
            id: 'f-lu-1',
            name: 'Hyderabadi Veg Dum Biryani & Mirchi Ka Salan',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 340,
            protein: '11g',
            description: 'Layered aromatic basmati rice cooked on slow dum with veggies and fried onions.',
            allergens: ['Dairy', 'Peanuts'],
            ingredients: ['Aged Long Grain Basmati Rice', 'Paneer', 'French Beans', 'Carrots', 'Fried Crisp Onions (Birista)', 'Desi Ghee', 'Saffron Milk', 'Peanut Sesame Salan Paste', 'Green Chillies'],
            isChefSpecial: true
          },
          {
            id: 'f-lu-2',
            name: 'Soya Chaap Dum Biryani & Paneer Tikka Masala',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 350,
            protein: '16g',
            description: 'Special Friday aromatic Biryani with marinated soya chaap chunks and paneer tikka masala.',
            allergens: ['Soy', 'Gluten', 'Dairy'],
            ingredients: ['Soya Chaap Chunks', 'Paneer Tikka Chunks', 'Basmati Rice', 'Yogurt Marinade', 'Tandoori Masala', 'Mint Leaves', 'Desi Ghee', 'Saffron Milk']
          },
          {
            id: 'f-lu-3',
            name: 'Burani Garlic Raita & Kachumber',
            category: 'side',
            tags: ['veg'],
            calories: 80,
            description: 'Garlic infused yogurt with diced cucumber and mint.',
            allergens: ['Dairy'],
            ingredients: ['Fresh Dahi (Curd)', 'Roasted Garlic Paste', 'Cucumber', 'Onion', 'Mint', 'Black Salt']
          },
          {
            id: 'f-lu-4',
            name: 'Fresh Phulka & Dal Fry',
            category: 'bread',
            tags: ['veg'],
            calories: 180,
            protein: '6g',
            description: 'Homestyle lentils and bread.',
            allergens: ['Gluten'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Toor Dal', 'Tomatoes', 'Cumin', 'Green Chillies']
          },
          {
            id: 'f-lu-5',
            name: 'Shahi Tukda with Rabri',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 180,
            description: 'Crisp ghee-fried bread dipped in saffron syrup topped with thick rabri.',
            allergens: ['Gluten', 'Dairy', 'Tree Nuts'],
            ingredients: ['White Bread Triangles', 'Pure Desi Ghee', 'Reduced Thick Milk (Rabri)', 'Saffron Sugar Syrup', 'Pistachios', 'Almonds', 'Silver Vark']
          }
        ]
      },
      snacks: {
        id: 'fri-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 330,
        ratingAvg: 4.6,
        ratingsCount: 160,
        dishes: [
          {
            id: 'f-sn-1',
            name: 'Paneer Bread Rolls & Ketchup',
            category: 'snack',
            tags: ['veg', 'high-protein'],
            calories: 240,
            protein: '8g',
            description: 'Crispy rolls stuffed with spiced paneer and herbs.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['White / Brown Bread', 'Grated Paneer (Cottage Cheese)', 'Green Chillies', 'Coriander', 'Chaat Masala', 'Sunflower Oil for Crisp Frying']
          },
          {
            id: 'f-sn-2',
            name: 'Lemon Ice Tea / Hot Chai',
            category: 'beverage',
            tags: ['veg'],
            calories: 90,
            description: 'Refreshing cooler or traditional tea.',
            allergens: ['Dairy'],
            ingredients: ['Brewed Black Tea', 'Fresh Lemon Juice', 'Mint Leaves', 'Milk Option', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'fri-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 680,
        ratingAvg: 4.6,
        ratingsCount: 175,
        dishes: [
          {
            id: 'f-di-1',
            name: 'Dal Panchmel (Five Lentil Royal Tadka)',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 160,
            protein: '9g',
            description: 'Nutrient-rich blend of toor, moong, chana, urad and masoor dal.',
            allergens: ['Dairy'],
            ingredients: ['Toor Dal', 'Moong Dal', 'Chana Dal', 'Urad Dal', 'Masoor Dal', 'Desi Ghee', 'Hing', 'Cumin', 'Garlic']
          },
          {
            id: 'f-di-2',
            name: 'Shahi Paneer Bhurji & Navratan Korma',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 270,
            protein: '15g',
            description: 'Minced spiced cottage cheese with bell peppers and royal mild aromatic mixed vegetable & nut korma.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Crumbled Fresh Paneer', 'Mixed Seasonal Veggies', 'Cashew Yogurt Korma Paste', 'Bell Peppers (Capsicum)', 'Butter', 'Kashmiri Spices', 'Saffron Touch']
          },
          {
            id: 'f-di-3',
            name: 'Tawa Paratha & Steamed Basmati Rice',
            category: 'bread',
            tags: ['veg'],
            calories: 220,
            protein: '5g',
            description: 'Flaky layered bread and rice.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Butter', 'Basmati Rice']
          },
          {
            id: 'f-di-4',
            name: 'Sev Tamatar Ki Sabzi',
            category: 'main',
            tags: ['veg'],
            calories: 150,
            description: 'Sweet-sour tomato curry topped with crunchy ratlami sev.',
            allergens: [],
            ingredients: ['Fresh Juicy Tomatoes', 'Gram Flour Sev (Besan)', 'Mustard Oil', 'Jaggery Touch', 'Cumin', 'Green Chillies']
          },
          {
            id: 'f-di-5',
            name: 'Creamy Mango Kulfi',
            category: 'dessert',
            tags: ['sweet'],
            calories: 130,
            description: 'Traditional Indian ice candy.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Condensed Full Cream Milk', 'Alphonso Mango Pulp', 'Pistachio Crumbs', 'Cardamom Powder', 'Sugar']
          }
        ]
      }
    }
  },
  Saturday: {
    day: 'Saturday',
    theme: 'Weekend Street Special',
    meals: {
      breakfast: {
        id: 'sat-bf',
        type: 'breakfast',
        name: 'Breakfast',
        timing: '07:30 AM - 10:00 AM (Weekend Timing)',
        startHour: 7,
        startMin: 30,
        endHour: 10,
        endMin: 0,
        caloriesTotal: 490,
        ratingAvg: 4.7,
        ratingsCount: 160,
        dishes: [
          {
            id: 'sa-bf-1',
            name: 'Uttapam with Onion & Tomato Topping',
            category: 'main',
            tags: ['veg'],
            calories: 250,
            protein: '6g',
            description: 'Thick fermented rice pancake topped with fresh vegetables.',
            allergens: [],
            ingredients: ['Fermented Rice Urad Dal Batter', 'Finely Diced Red Onions', 'Tomatoes', 'Curry Leaves', 'Green Chillies', 'Sunflower Oil']
          },
          {
            id: 'sa-bf-2',
            name: 'Coconut Chutney & Vegetable Sambar',
            category: 'side',
            tags: ['veg'],
            calories: 110,
            description: 'Authentic south sambar.',
            allergens: [],
            ingredients: ['Fresh Grated Coconut', 'Toor Dal', 'Pumpkin', 'Drumstick', 'Tamarind', 'Curry Leaves', 'Mustard Seeds']
          },
          {
            id: 'sa-bf-3',
            name: 'Sprouted Moong Bowl / Cornflakes with Cold Milk',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 170,
            protein: '9g',
            description: 'Nutritious morning cereal with chilled milk or crunchy spiced sprouted pulses.',
            allergens: ['Dairy'],
            ingredients: ['Crispy Corn Flakes', 'Pasteurized Cold Cow Milk', 'Sprouted Moong', 'Sugar', 'Almond Flakes']
          },
          {
            id: 'sa-bf-4',
            name: 'Coffee / Tea',
            category: 'beverage',
            tags: ['veg'],
            calories: 80,
            description: 'Fresh beverages.',
            allergens: ['Dairy'],
            ingredients: ['Milk', 'Coffee / Tea Decoction', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'sat-lu',
        type: 'lunch',
        name: 'Lunch',
        timing: '12:30 PM - 02:30 PM',
        startHour: 12,
        startMin: 30,
        endHour: 14,
        endMin: 30,
        caloriesTotal: 720,
        ratingAvg: 4.6,
        ratingsCount: 165,
        dishes: [
          {
            id: 'sa-lu-1',
            name: 'Kashmiri Dum Aloo with Coriander',
            category: 'main',
            tags: ['veg'],
            calories: 230,
            protein: '5g',
            description: 'Baby potatoes simmered in curd and fennel gravy.',
            allergens: ['Dairy'],
            ingredients: ['Pricked Baby Potatoes', 'Fresh Dahi (Curd)', 'Fennel Powder (Saunf)', 'Dry Ginger Powder (Sonth)', 'Mustard Oil', 'Kashmiri Mirch']
          },
          {
            id: 'sa-lu-2',
            name: 'Dal Panchratan (Creamy Tadka)',
            category: 'side',
            tags: ['veg', 'high-protein'],
            calories: 160,
            protein: '8g',
            description: 'High protein tempered lentils.',
            allergens: ['Dairy'],
            ingredients: ['Mixed Five Lentils', 'Butter Tadka', 'Garlic', 'Cumin', 'Tomatoes']
          },
          {
            id: 'sa-lu-3',
            name: 'Veg Fried Rice & Chili Paneer Gravy',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 310,
            protein: '12g',
            description: 'Indo-Chinese weekend treat with wok tossed rice and paneer.',
            allergens: ['Soy', 'Dairy', 'Gluten'],
            ingredients: ['Steamed Rice', 'Paneer Cubes', 'Dark Soy Sauce', 'Cornflour Batter', 'Spring Onions', 'Bell Peppers', 'Garlic', 'Green Chilli Sauce']
          },
          {
            id: 'sa-lu-4',
            name: 'Roti & Salad',
            category: 'bread',
            tags: ['veg'],
            calories: 140,
            protein: '4g',
            description: 'Whole wheat flatbreads.',
            allergens: ['Gluten'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Cucumber & Tomato Salad']
          },
          {
            id: 'sa-lu-5',
            name: 'Jalebi with Rabri',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 180,
            description: 'Crisp spiral jalebis soaked in saffron syrup.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Refined Flour (Maida Fermented Batter)', 'Pure Desi Ghee', 'Saffron Sugar Syrup', 'Thick Milk Rabri', 'Cardamom']
          }
        ]
      },
      snacks: {
        id: 'sat-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 310,
        ratingAvg: 4.5,
        ratingsCount: 130,
        dishes: [
          {
            id: 'sa-sn-1',
            name: 'Aloo Tikki Chaat with Dahi & Chutneys',
            category: 'snack',
            tags: ['veg', 'special'],
            calories: 220,
            description: 'Griddle fried potato patties with seasoned curd and pomegranate.',
            allergens: ['Dairy'],
            ingredients: ['Boiled Potatoes', 'Cornflour Starch', 'Sweet Dahi (Yogurt)', 'Tamarind Imli Chutney', 'Spicy Mint Chutney', 'Pomegranate Pearls', 'Chaat Spices']
          },
          {
            id: 'sa-sn-2',
            name: 'Kullad Special Chai',
            category: 'beverage',
            tags: ['veg'],
            calories: 85,
            description: 'Clay cup tea with cardamom aroma.',
            allergens: ['Dairy'],
            ingredients: ['Whole Milk', 'Assam Tea', 'Crushed Green Cardamom', 'Sugar']
          }
        ]
      },
      dinner: {
        id: 'sat-di',
        type: 'dinner',
        name: 'Dinner',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 690,
        ratingAvg: 4.7,
        ratingsCount: 185,
        dishes: [
          {
            id: 'sa-di-1',
            name: 'Paneer Butter Masala (Rich Cashew Base)',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 270,
            protein: '14g',
            description: 'Creamy tomato-butter gravy.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Paneer (Cottage Cheese)', 'Cashew Nut Paste', 'Butter', 'Fresh Cream', 'Tomato Puree', 'Kasuri Methi', 'Garam Masala']
          },
          {
            id: 'sa-di-2',
            name: 'Soya Malai Chaap Gravy & Mushroom Masala',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 250,
            protein: '15g',
            description: 'Tender soya chaap sticks in velvety cream gravy with spiced button mushrooms.',
            allergens: ['Soy', 'Dairy', 'Gluten'],
            ingredients: ['Soya Chaap Sticks', 'Fresh Button Mushrooms', 'Wheat Gluten', 'Fresh Cream', 'Cardamom Garlic Gravy', 'Desi Ghee', 'Kasuri Methi']
          },
          {
            id: 'sa-di-3',
            name: 'Dal Tadka & Steamed Rice',
            category: 'side',
            tags: ['veg'],
            calories: 200,
            protein: '6g',
            description: 'Desi ghee tempered lentils and rice.',
            allergens: ['Dairy'],
            ingredients: ['Toor Dal', 'Desi Ghee', 'Cumin', 'Garlic', 'Steamed Rice']
          },
          {
            id: 'sa-di-4',
            name: 'Butter Tandoori Naan / Roti',
            category: 'bread',
            tags: ['veg'],
            calories: 180,
            protein: '5g',
            description: 'Soft leavened bread.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Refined Flour (Maida) / Whole Wheat Flour (Atta)', 'Yogurt', 'Baking Soda', 'Butter']
          },
          {
            id: 'sa-di-5',
            name: 'Hot Moong Dal Halwa',
            category: 'dessert',
            tags: ['sweet'],
            calories: 170,
            description: 'Desi ghee sweet.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Moong Dal Paste', 'Pure Desi Ghee', 'Cashew Crumbs', 'Cardamom', 'Sugar']
          }
        ]
      }
    }
  },
  Sunday: {
    day: 'Sunday',
    theme: 'Sunday Grand Banquet',
    meals: {
      breakfast: {
        id: 'sun-bf',
        type: 'breakfast',
        name: 'Breakfast (Lazy Sunday Special)',
        timing: '08:00 AM - 10:30 AM',
        startHour: 8,
        startMin: 0,
        endHour: 10,
        endMin: 30,
        caloriesTotal: 540,
        ratingAvg: 4.9,
        ratingsCount: 240,
        specialNote: 'Extended Sunday timings for all hostel students.',
        dishes: [
          {
            id: 'su-bf-1',
            name: 'Chole Bhature with Pickled Green Chillies',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 380,
            protein: '11g',
            description: 'Golden puffed bhaturas with tangy Amritsari chana.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Kabuli Chana (Chickpeas)', 'Fermented Refined Flour (Maida Bhature)', 'Dahi', 'Amchur', 'Anardana', 'Ginger Juliennes', 'Sunflower Oil for Frying']
          },
          {
            id: 'su-bf-2',
            name: 'Live Moong Dal Chilla & Paneer Stuffed Wrap Station',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 220,
            protein: '12g',
            description: 'Live griddle station serving hot yellow lentil crepes stuffed with grated paneer and herbs.',
            allergens: ['Dairy'],
            ingredients: ['Yellow Moong Dal Batter', 'Grated Fresh Paneer', 'Chopped Onions', 'Green Chillies', 'Butter', 'Black Pepper', 'Mint Chutney', 'Rock Salt']
          },
          {
            id: 'su-bf-3',
            name: 'Sweet Lassi / Masala Buttermilk / Chai',
            category: 'beverage',
            tags: ['veg', 'sweet'],
            calories: 120,
            description: 'Creamy thick sweet lassi with malai.',
            allergens: ['Dairy'],
            ingredients: ['Thick Dahi (Yogurt)', 'Clotted Malai (Cream)', 'Rose Syrup / Cumin Spice', 'Sugar']
          }
        ]
      },
      lunch: {
        id: 'sun-lu',
        type: 'lunch',
        name: 'Lunch (Sunday Special Feast)',
        timing: '12:30 PM - 03:00 PM',
        startHour: 12,
        startMin: 30,
        endHour: 15,
        endMin: 0,
        caloriesTotal: 780,
        ratingAvg: 4.9,
        ratingsCount: 265,
        specialNote: 'Grand feast featuring Dum Biryani and Gulab Jamun.',
        dishes: [
          {
            id: 'su-lu-1',
            name: 'Royal Nawabi Paneer Dum Biryani (with Saffron & Roasted Potatoes)',
            category: 'main',
            tags: ['veg', 'high-protein', 'special'],
            calories: 370,
            protein: '16g',
            description: 'Fragrant saffron basmati rice slow dum cooked with marinated paneer cubes, roasted spiced potato halves, and caramelized onions.',
            allergens: ['Dairy'],
            ingredients: ['Aged Long Grain Basmati Rice', 'Fresh Paneer Chunks', 'Boiled & Roasted Potato Halves', 'Desi Ghee', 'Saffron Milk', 'Kewra & Rose Water', 'Meetha Ittar Essence', 'Biryani Spices', 'Fried Onions (Birista)'],
            isChefSpecial: true
          },
          {
            id: 'su-lu-2',
            name: 'Paneer Butter Masala & Shahi Korma',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 260,
            protein: '13g',
            description: 'Rich vegetarian main dish.',
            allergens: ['Dairy', 'Tree Nuts'],
            ingredients: ['Paneer (Cottage Cheese)', 'Cashew Nut Paste', 'Butter', 'Fresh Cream', 'Tomato Gravy', 'Cardamom Spices']
          },
          {
            id: 'su-lu-3',
            name: 'Mirchi Ka Salan & Onion-Mint Raita',
            category: 'side',
            tags: ['veg'],
            calories: 95,
            description: 'Sesame-peanut curry and spiced curd.',
            allergens: ['Peanuts', 'Dairy'],
            ingredients: ['Large Bhavnagri Green Chillies', 'Roasted Peanuts', 'White Sesame Seeds', 'Coconut Paste', 'Tamarind Pulp', 'Dahi (Yogurt)', 'Mint']
          },
          {
            id: 'su-lu-4',
            name: 'Tandoori Butter Roti (Unlimited)',
            category: 'bread',
            tags: ['veg'],
            calories: 150,
            protein: '4g',
            description: 'Fresh from the clay oven.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Butter', 'Salt']
          },
          {
            id: 'su-lu-5',
            name: 'Warm Gulab Jamun with Ice Cream',
            category: 'dessert',
            tags: ['sweet', 'special'],
            calories: 210,
            description: 'Deluxe Sunday dessert pairing.',
            allergens: ['Dairy', 'Gluten'],
            ingredients: ['Khoya / Mawa Balls', 'Refined Wheat Flour (Maida)', 'Pure Desi Ghee', 'Rose Cardamom Sugar Syrup', 'Vanilla Dairy Ice Cream']
          }
        ]
      },
      snacks: {
        id: 'sun-sn',
        type: 'snacks',
        name: 'Evening Snacks & High Tea',
        timing: '05:00 PM - 06:30 PM',
        startHour: 17,
        startMin: 0,
        endHour: 18,
        endMin: 30,
        caloriesTotal: 290,
        ratingAvg: 4.5,
        ratingsCount: 140,
        dishes: [
          {
            id: 'su-sn-1',
            name: 'Corn Cheese Sandwich / Maggi Noodles',
            category: 'snack',
            tags: ['veg'],
            calories: 210,
            description: 'Hot grilled sandwich with melted cheese.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Wheat Bread', 'Sweet Golden Corn', 'Processed Cheddar & Mozzarella Cheese', 'Bell Peppers', 'Oregano', 'Chilli Flakes', 'Butter']
          },
          {
            id: 'su-sn-2',
            name: 'Cold Coffee with Ice Cream / Hot Tea',
            category: 'beverage',
            tags: ['veg'],
            calories: 110,
            description: 'Chilled blended cold coffee.',
            allergens: ['Dairy'],
            ingredients: ['Chilled Cow Milk', 'Instant Coffee Powder', 'Vanilla Ice Cream Scoop', 'Sugar', 'Cocoa Powder Dust']
          }
        ]
      },
      dinner: {
        id: 'sun-di',
        type: 'dinner',
        name: 'Dinner (Light & Wholesome)',
        timing: '07:30 PM - 10:00 PM',
        startHour: 19,
        startMin: 30,
        endHour: 22,
        endMin: 0,
        caloriesTotal: 650,
        ratingAvg: 4.6,
        ratingsCount: 170,
        dishes: [
          {
            id: 'su-di-1',
            name: 'Dal Khichdi with Pure Desi Ghee & Papad',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 270,
            protein: '10g',
            description: 'Wholesome rice and yellow lentil comfort porridge.',
            allergens: ['Dairy'],
            ingredients: ['Govindobhog Short Grain Rice', 'Yellow Moong Dal', 'Pure Desi Ghee', 'Cumin Seeds', 'Hing (Asafoetida)', 'Turmeric', 'Urad Papad']
          },
          {
            id: 'su-di-2',
            name: 'Kadai Veg & Soya Paneer Toss',
            category: 'main',
            tags: ['veg', 'high-protein'],
            calories: 220,
            protein: '13g',
            description: 'Wok tossed seasonal mixed vegetables with paneer and soya chunks in crushed coriander and kadai spice blend.',
            allergens: ['Dairy', 'Soy'],
            ingredients: ['Fresh Paneer Cubes', 'Nutri Soya Chunks', 'Cauliflower', 'Beans', 'Carrots', 'Capsicum', 'Kadai Spices', 'Mustard Oil']
          },
          {
            id: 'su-di-3',
            name: 'Phulkas & Curd',
            category: 'bread',
            tags: ['veg'],
            calories: 140,
            protein: '5g',
            description: 'Light digestible Sunday dinner.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Whole Wheat Flour (Atta)', 'Fresh Set Dahi (Curd)']
          },
          {
            id: 'su-di-4',
            name: 'Sweet Jalebi / Fruit Custard',
            category: 'dessert',
            tags: ['sweet'],
            calories: 130,
            description: 'Evening dessert.',
            allergens: ['Gluten', 'Dairy'],
            ingredients: ['Maida Jalebi', 'Desi Ghee', 'Saffron Sugar Syrup', 'Custard Milk']
          }
        ]
      }
    }
  }
};

export const INITIAL_ORDERS: AcademicBlockOrder[] = [
  {
    id: 'ORD-9821',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    phone: '+91 98765 43210',
    rollNo: '22CS0142',
    blockName: 'Academic Block 3',
    roomFloor: 'Lab 3, 2nd Floor (Systems Lab)',
    items: [
      { dishName: 'Shahi Paneer Butter Masala Thali + 3 Rotis + Jeera Rice', quantity: 1, price: 90, isIncludedInMessPass: true },
      { dishName: 'Gulab Jamun (1 pc)', quantity: 2, price: 30, isIncludedInMessPass: false }
    ],
    packingType: 'Eco Paper Box',
    notes: 'Please pack extra green chutney. In middle of coding lab test.',
    deliverySlot: '1:15 PM - 1:30 PM Batch',
    orderTime: '12:14 PM',
    status: 'In Kitchen',
    totalAmount: 120,
    useMessPass: true,
    targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
  },
  {
    id: 'ORD-9819',
    studentId: 'stu-2',
    studentName: 'Priya Patel',
    phone: '+91 98451 23456',
    rollNo: '23EE0089',
    blockName: 'Academic Block 12',
    roomFloor: 'Discussion Room 4 (1st Floor)',
    items: [
      { dishName: 'Crispy Veg Samosa (2 pcs) + Cutting Chai', quantity: 1, price: 40, isIncludedInMessPass: false }
    ],
    packingType: 'Disposable Tray',
    notes: 'Please deliver to front security desk of Library.',
    deliverySlot: '05:15 PM Batch',
    orderTime: '04:45 PM',
    status: 'Pending',
    totalAmount: 40,
    useMessPass: false,
    targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
  }
];

export const INITIAL_ANONYMOUS_FEEDBACK: AnonymousFeedback[] = [
  {
    id: 'fb-1',
    mealSlot: 'lunch',
    dishName: 'Shahi Paneer Butter Masala',
    rating: 5,
    comment: 'The cashew gravy was incredibly rich and creamy today! Huge improvement over last week.',
    timestamp: 'Today, 01:15 PM',
    date: '2026-08-21'
  },
  {
    id: 'fb-2',
    mealSlot: 'lunch',
    dishName: 'Phulka / Butter Tawa Roti (Unlimited)',
    rating: 4,
    comment: 'Rotis were hot and soft at Counter 2. Service speed was super fast.',
    timestamp: 'Today, 01:42 PM',
    date: '2026-08-21'
  },
  {
    id: 'fb-3',
    mealSlot: 'breakfast',
    dishName: 'Steamed Idli & Medu Vada (2 pcs)',
    rating: 5,
    comment: 'Vadas were wonderfully crisp on the outside. Coconut chutney was fresh and cool.',
    timestamp: 'Today, 08:30 AM',
    date: '2026-08-21'
  },
  {
    id: 'fb-4',
    mealSlot: 'breakfast',
    dishName: 'Sprouted Moong & Peanut Poha (High Protein)',
    rating: 3,
    comment: 'Poha was a bit dry today, could use slightly more lemon and roasted peanuts.',
    timestamp: 'Today, 09:10 AM',
    date: '2026-08-21'
  },
  {
    id: 'fb-5',
    mealSlot: 'dinner',
    dishName: 'Kadai Paneer & Soya Chaap Gravy',
    rating: 4,
    comment: 'Great spice balance in the kadai gravy. Please keep this weekly rotation.',
    timestamp: 'Yesterday, 08:45 PM',
    date: '2026-08-20'
  },
  {
    id: 'fb-6',
    mealSlot: 'snacks',
    dishName: 'Crispy Veg Samosa with Mint & Imli Chutney',
    rating: 5,
    comment: 'Chutney combo was fantastic. High tea queue was well managed by staff.',
    timestamp: 'Yesterday, 05:40 PM',
    date: '2026-08-20'
  }
];

export function getDishPrice(dish: Partial<DishItem>): number {
  if (dish.price && dish.price > 0) return dish.price;
  const name = (dish.name || '').toLowerCase();
  const category = dish.category;

  if (name.includes('thali') || name.includes('biryani') || name.includes('platter')) return 95;
  if (name.includes('paneer') || name.includes('chaap') || name.includes('kofta') || name.includes('chole bhature')) return 85;
  if (category === 'main') return 75;
  if (category === 'bread') return 15;
  if (category === 'side') return 40;
  if (category === 'snack') return 45;
  if (category === 'dessert') return 35;
  if (category === 'beverage') return 20;
  return 60;
}

export const INITIAL_DAY_SCHOLAR_ORDERS: DayScholarOrder[] = [
  {
    id: 'DS-4091',
    name: 'Kavya Sundaram',
    phoneNumber: '+91 98765 11223',
    department: 'B.Tech AI & Data Science (Year 3)',
    mealSlot: 'lunch',
    items: [
      { dishName: 'Shahi Paneer Butter Masala Thali + 3 Rotis + Jeera Rice', quantity: 1, price: 95 },
      { dishName: 'Gulab Jamun (1 pc)', quantity: 2, price: 35 }
    ],
    preference: 'pickup',
    specialNotes: 'Will collect around 1:30 PM from Counter 3. Extra spicy dal please.',
    status: 'Preparing',
    timestamp: 'Today, 12:40 PM',
    totalAmount: 165,
    targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
  },
  {
    id: 'DS-4088',
    name: 'Vikramaditya Roy',
    phoneNumber: '+91 98450 77889',
    department: 'M.Tech Robotics & Automation',
    mealSlot: 'lunch',
    items: [
      { dishName: 'Royal Nawabi Paneer Dum Biryani + Mirchi Ka Salan + Raita', quantity: 1, price: 95 },
      { dishName: 'Masala Chaas (Spiced Buttermilk)', quantity: 1, price: 20 }
    ],
    preference: 'delivery',
    blockName: 'Academic Block 7',
    roomFloor: 'Robotics Lab 2, 3rd Floor',
    specialNotes: 'Please call once arrived at Block 7 lift lobby.',
    status: 'New',
    timestamp: 'Today, 12:55 PM',
    totalAmount: 115,
    targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
  },
  {
    id: 'DS-4075',
    name: 'Sneha Kulkarni',
    phoneNumber: '+91 97654 33445',
    department: 'B.Des Industrial Design',
    mealSlot: 'snacks',
    items: [
      { dishName: 'Crispy Veg Samosa with Mint & Imli Chutney (2 pcs)', quantity: 2, price: 45 },
      { dishName: 'Masala Chai / Filter Coffee', quantity: 2, price: 20 }
    ],
    preference: 'pickup',
    specialNotes: 'Less sugar in tea.',
    status: 'Ready',
    timestamp: 'Today, 04:30 PM',
    totalAmount: 130,
    targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
  }
];

