import { DayMenu, StudentProfile, MessAnnouncement, AcademicBlockOrder } from '../types/mess';

export const INITIAL_ANNOUNCEMENTS: MessAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Sunday Grand Feast: Dum Biryani & Gulab Jamun',
    date: 'Upcoming Sunday',
    priority: 'high',
    message: 'Special dinner served between 7:30 PM - 10:00 PM with Paneer Dum Biryani, Chicken Dum Biryani, Raita & Hot Gulab Jamun.',
    tag: 'Feast Menu'
  },
  {
    id: 'ann-2',
    title: 'Academic Block Lunch Parcel Timings',
    date: 'Active Daily',
    priority: 'normal',
    message: 'Place parcel orders before 12:15 PM for 1:00 PM batch delivery to CS Block, Library, and Tech Shed.',
    tag: 'Delivery Update'
  },
  {
    id: 'ann-3',
    title: 'Monthly Mess Rebate Cutoff Date',
    date: '25th of every month',
    priority: 'normal',
    message: 'Submit weekend outstation leave on portal at least 12 hours in advance for daily rebate credit.',
    tag: 'Rebate Info'
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
    semester: '6th Semester'
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
    semester: '4th Semester'
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
    semester: '8th Semester'
  }
];

export const ACADEMIC_BLOCKS = [
  'Dr. APJ Abdul Kalam Computer Science Block',
  'Vivekananda Central Library & Study Hub',
  'Sir MV Mechanical Innovation Shed',
  'Tesla Electrical & Electronics Block',
  'Ramanujan Mathematics & Data Science Complex',
  'Bio-Tech & Chemical Labs Tower',
  'Arya Hall & Management Dept',
  'Student Activity Centre (SAC) & Innovation Cell'
];

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
          { id: 'm-bf-1', name: 'Steamed Idli & Medu Vada (2 pcs)', category: 'main', tags: ['veg', 'high-protein'], calories: 240, protein: '9g', description: 'Fluffy fermented rice-lentil steamed cakes with crisp lentil fritters.' },
          { id: 'm-bf-2', name: 'Madras Sambar & Fresh Coconut Chutney', category: 'side', tags: ['veg'], calories: 120, protein: '4g', description: 'Aromatic drumstick tamarind stew and freshly ground coconut-chilli chutney.' },
          { id: 'm-bf-3', name: 'Boiled Eggs (2 pcs) / Peanut Poha', category: 'main', tags: ['egg', 'high-protein'], calories: 155, protein: '12g', description: 'Protein option: farm fresh boiled eggs or flattened rice tempered with mustard and peanuts.' },
          { id: 'm-bf-4', name: 'Masala Chai / Filter Coffee / Bournvita Milk', category: 'beverage', tags: ['veg'], calories: 85, description: 'Fresh hot beverage served with whole milk or black.' }
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
          { id: 'm-lu-1', name: 'Shahi Paneer Butter Masala', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 280, protein: '14g', description: 'Cottage cheese simmered in rich cashew-tomato velvet gravy.', isChefSpecial: true },
          { id: 'm-lu-2', name: 'Dal Tadka (Arhar/Toor Dal)', category: 'side', tags: ['veg', 'high-protein'], calories: 160, protein: '8g', description: 'Slow-cooked yellow lentils tempered with cumin, garlic, and desi ghee.' },
          { id: 'm-lu-3', name: 'Steamed Basmati Rice & Jeera Pulao', category: 'main', tags: ['veg'], calories: 200, protein: '4g', description: 'Fragrant long-grain basmati rice tempered with roasted cumin.' },
          { id: 'm-lu-4', name: 'Phulka / Butter Tawa Roti (Unlimited)', category: 'bread', tags: ['veg'], calories: 140, protein: '5g', description: 'Whole wheat flatbreads brushed with fresh butter.' },
          { id: 'm-lu-5', name: 'Boondi Raita & Fresh Green Salad', category: 'side', tags: ['veg'], calories: 75, protein: '3g', description: 'Spiced chilled curd with crispy chickpea pearls and seasonal cucumber-carrot slices.' },
          { id: 'm-lu-6', name: 'Hot Gulab Jamun (1 pc)', category: 'dessert', tags: ['sweet', 'special'], calories: 150, description: 'Traditional milk-solid dumplings soaked in rose cardamom sugar syrup.' }
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
          { id: 'm-sn-1', name: 'Crispy Veg Samosa with Mint & Imli Chutney', category: 'snack', tags: ['veg', 'special'], calories: 220, description: 'Golden flaky pastry stuffed with spiced potato and peas.' },
          { id: 'm-sn-2', name: 'Adrak Elaichi Special Chai / Cold Coffee', category: 'beverage', tags: ['veg'], calories: 95, description: 'Fresh crushed ginger and cardamom brewed tea.' }
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
          { id: 'm-di-1', name: 'Aloo Gobi Matar Masala', category: 'main', tags: ['veg'], calories: 190, protein: '5g', description: 'Homestyle cauliflower, potato and green peas in light onion-tomato masala.' },
          { id: 'm-di-2', name: 'Egg Curry (2 Eggs) / Kadai Paneer', category: 'main', tags: ['egg', 'high-protein', 'special'], calories: 260, protein: '16g', description: 'Rich spiced onion-tomato curry with boiled eggs or cottage cheese cubes.' },
          { id: 'm-di-3', name: 'Dal Palak (Spinach Lentils)', category: 'side', tags: ['veg', 'high-protein'], calories: 140, protein: '7g', description: 'Nutritious yellow dal infused with fresh chopped spinach leaves.' },
          { id: 'm-di-4', name: 'Hot Rotis & Steamed Rice', category: 'bread', tags: ['veg'], calories: 220, protein: '6g', description: 'Freshly puffed whole wheat rotis.' },
          { id: 'm-di-5', name: 'Rice Kheer with Pistachios', category: 'dessert', tags: ['sweet'], calories: 160, description: 'Slow-simmered basmati rice pudding in thickened cardamom milk.' }
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
          { id: 't-bf-1', name: 'Punjabi Aloo Paratha with Amul Butter & Curd', category: 'main', tags: ['veg', 'high-protein'], calories: 340, protein: '8g', description: 'Whole wheat griddle bread stuffed with spiced mashed potatoes.' },
          { id: 't-bf-2', name: 'Sprouts Salad & Lemon Wedges', category: 'side', tags: ['veg', 'high-protein'], calories: 90, protein: '6g', description: 'Moong and chickpea sprouts with onions, tomatoes and coriander.' },
          { id: 't-bf-3', name: 'Hot Masala Tea / Hot Milk', category: 'beverage', tags: ['veg'], calories: 80, description: 'Freshly brewed campus morning tea.' }
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
          { id: 't-lu-1', name: 'Amritsari Chole Kulche / Bhature', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 360, protein: '12g', description: 'Robust spiced dark chickpeas with fluffy fermented bread.' },
          { id: 't-lu-2', name: 'Jeera Rice & Boondi Raita', category: 'side', tags: ['veg'], calories: 190, protein: '4g', description: 'Cumin flavored rice with cool spiced curd.' },
          { id: 't-lu-3', name: 'Tawa Roti & Pickled Onions', category: 'bread', tags: ['veg'], calories: 140, protein: '4g', description: 'Hot wheat rotis with vinegar onion rings.' },
          { id: 't-lu-4', name: 'Pineapple Halwa', category: 'dessert', tags: ['sweet'], calories: 180, description: 'Rich semolina pudding cooked with real pineapple chunks and ghee.' }
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
          { id: 't-sn-1', name: 'Mumbai Style Bhel Puri / Sev Puri', category: 'snack', tags: ['veg'], calories: 210, description: 'Crisp puffed rice, papdi, veggies and sweet-tangy chutneys.' },
          { id: 't-sn-2', name: 'Special Cutting Chai', category: 'beverage', tags: ['veg'], calories: 85, description: 'Cardamom strong tea.' }
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
          { id: 't-di-1', name: 'Matar Paneer', category: 'main', tags: ['veg', 'high-protein'], calories: 240, protein: '12g', description: 'Tender cottage cheese and sweet green peas in spiced onion gravy.' },
          { id: 't-di-2', name: 'Chicken Curry / Soya Chaap Masala', category: 'main', tags: ['non-veg', 'high-protein', 'special'], calories: 290, protein: '22g', description: 'Desi style chicken curry or protein-packed soya chaap chunks.' },
          { id: 't-di-3', name: 'Dal Makhani', category: 'side', tags: ['veg', 'high-protein'], calories: 190, protein: '8g', description: 'Black lentils slow cooked overnight with butter and cream.' },
          { id: 't-di-4', name: 'Butter Phulka & Steamed Rice', category: 'bread', tags: ['veg'], calories: 210, protein: '5g', description: 'Unlimited hot flatbreads.' },
          { id: 't-di-5', name: 'Ice Cream Cup (Vanilla / Butterscotch)', category: 'dessert', tags: ['sweet'], calories: 130, description: 'Chilled dessert cup.' }
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
          { id: 'w-bf-1', name: 'Crispy Masala Dosa with Potato Roast Filling', category: 'main', tags: ['veg', 'special'], calories: 280, protein: '7g', description: 'Crisp golden rice crepe with savory spiced mashed potatoes.' },
          { id: 'w-bf-2', name: 'Tomato Chutney & Coconut Chutney', category: 'side', tags: ['veg'], calories: 95, description: 'Dual south-Indian chutney combo.' },
          { id: 'w-bf-3', name: 'Boiled Eggs / Vegetable Upma', category: 'main', tags: ['egg', 'high-protein'], calories: 140, protein: '10g', description: 'Protein boost for morning workouts and lectures.' },
          { id: 'w-bf-4', name: 'Filter Coffee / Tea', category: 'beverage', tags: ['veg'], calories: 80, description: 'Authentic south style frothy filter coffee.' }
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
          { id: 'w-lu-1', name: 'Rajma Masala (Kashmiri Kidney Beans)', category: 'main', tags: ['veg', 'high-protein'], calories: 260, protein: '13g', description: 'Plump kidney beans slow simmered with whole spices.' },
          { id: 'w-lu-2', name: 'Mix Veg Korma (Carrots, Beans, Corn)', category: 'side', tags: ['veg'], calories: 170, protein: '4g', description: 'Garden vegetables in mildly spiced coconut gravy.' },
          { id: 'w-lu-3', name: 'Steamed Rice & Phulka', category: 'main', tags: ['veg'], calories: 210, protein: '5g', description: 'Hot comforting rice and flatbread.' },
          { id: 'w-lu-4', name: 'Curd / Buttermilk & Roasted Papad', category: 'side', tags: ['veg'], calories: 70, description: 'Probiotic plain yogurt and crisp lentil papad.' },
          { id: 'w-lu-5', name: 'Moong Dal Halwa', category: 'dessert', tags: ['sweet', 'special'], calories: 190, description: 'Rich roasted yellow lentil pudding with saffron.' }
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
          { id: 'w-sn-1', name: 'Mumbai Pav Bhaji with Butter Toasted Pav', category: 'snack', tags: ['veg', 'special'], calories: 260, description: 'Mashed spicy vegetables topped with melted butter and lemon.' },
          { id: 'w-sn-2', name: 'Masala Chai', category: 'beverage', tags: ['veg'], calories: 80, description: 'Fresh boiled tea.' }
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
          { id: 'w-di-1', name: 'Paneer Do Pyaza', category: 'main', tags: ['veg', 'high-protein'], calories: 250, protein: '13g', description: 'Cottage cheese chunks cooked with two textures of onions.' },
          { id: 'w-di-2', name: 'Egg Bhurji / Veg Kolhapuri', category: 'main', tags: ['egg', 'high-protein'], calories: 220, protein: '14g', description: 'Spiced scrambled eggs with green chillies or fiery mixed vegetables.' },
          { id: 'w-di-3', name: 'Yellow Moong Dal Fry', category: 'side', tags: ['veg', 'high-protein'], calories: 130, protein: '7g', description: 'Light comforting yellow dal.' },
          { id: 'w-di-4', name: 'Tandoori Roti & Veg Pulao', category: 'bread', tags: ['veg'], calories: 220, protein: '6g', description: 'Freshly baked tandoori bread and aromatic spiced rice.' },
          { id: 'w-di-5', name: 'Sweet Rasgulla (2 pcs)', category: 'dessert', tags: ['sweet'], calories: 140, description: 'Spongy cottage cheese balls soaked in light sugar syrup.' }
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
          { id: 'th-bf-1', name: 'Indori Poha with Sev & Jeeravan Masala', category: 'main', tags: ['veg'], calories: 220, protein: '5g', description: 'Steamed flattened rice with peanuts, crunchy sev, pomegranate and special spices.' },
          { id: 'th-bf-2', name: 'Warm Boiled Eggs / Bread Toast with Jam & Butter', category: 'main', tags: ['egg', 'high-protein'], calories: 170, protein: '12g', description: 'High protein morning essentials.' },
          { id: 'th-bf-3', name: 'Hot Bournvita Milk / Masala Chai', category: 'beverage', tags: ['veg'], calories: 90, description: 'Energizing malt beverage or tea.' }
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
          { id: 'th-lu-1', name: 'Kadhi Pakora (Punjabi Gram Flour Dumpling Curry)', category: 'main', tags: ['veg', 'high-protein'], calories: 240, protein: '9g', description: 'Crisp onion fritters simmered in velvety spiced yogurt kadhi.' },
          { id: 'th-lu-2', name: 'Aloo Methi / Bhindi Fry', category: 'side', tags: ['veg'], calories: 150, description: 'Crisp spiced okra or potatoes with fenugreek.' },
          { id: 'th-lu-3', name: 'Jeera Basmati Rice & Phulkas', category: 'main', tags: ['veg'], calories: 220, protein: '5g', description: 'Perfect pair for warm Kadhi.' },
          { id: 'th-lu-4', name: 'Cucumber Salad & Roasted Papad', category: 'side', tags: ['veg'], calories: 50, description: 'Crunchy accompaniments.' },
          { id: 'th-lu-5', name: 'Fruit Custard with Jelly', category: 'dessert', tags: ['sweet'], calories: 140, description: 'Chilled vanilla custard with apples, bananas, and pomegranate.' }
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
          { id: 'th-sn-1', name: 'Bread Pakora with Green Chutney', category: 'snack', tags: ['veg'], calories: 230, description: 'Spiced potato sandwich batter-fried to golden perfection.' },
          { id: 'th-sn-2', name: 'Hot Ginger Tea', category: 'beverage', tags: ['veg'], calories: 75, description: 'Fresh brew.' }
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
          { id: 'th-di-1', name: 'Malai Kofta in Cashew Cream Gravy', category: 'main', tags: ['veg', 'special'], calories: 290, protein: '8g', description: 'Paneer and potato dumplings in royal creamy gravy.' },
          { id: 'th-di-2', name: 'Egg Masala Curry / Chana Dal Tadka', category: 'main', tags: ['egg', 'high-protein'], calories: 230, protein: '14g', description: 'Boiled egg masala or hearty yellow chana lentils.' },
          { id: 'th-di-3', name: 'Steamed Rice & Butter Roti', category: 'bread', tags: ['veg'], calories: 210, protein: '6g', description: 'Freshly served.' },
          { id: 'th-di-4', name: 'Gajar ka Halwa (Warm Carrot Pudding)', category: 'dessert', tags: ['sweet', 'special'], calories: 190, description: 'Grated red carrots simmered with full cream milk, ghee, and roasted cashews.' }
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
          { id: 'f-bf-1', name: 'Puri Bhaji with Halwa (Poori Chana)', category: 'main', tags: ['veg', 'special'], calories: 360, protein: '7g', description: 'Crisp puffed whole wheat puris with spicy potato curry and sooji halwa.' },
          { id: 'f-bf-2', name: 'Boiled Eggs / Sprouts', category: 'side', tags: ['egg', 'high-protein'], calories: 140, protein: '12g', description: 'Morning protein option.' },
          { id: 'f-bf-3', name: 'Filter Coffee / Masala Tea', category: 'beverage', tags: ['veg'], calories: 85, description: 'Hot brew.' }
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
          { id: 'f-lu-1', name: 'Hyderabadi Veg Dum Biryani & Mirchi Ka Salan', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 340, protein: '11g', description: 'Layered aromatic basmati rice cooked on slow dum with veggies and fried onions.' },
          { id: 'f-lu-2', name: 'Egg Dum Biryani / Paneer Tikka Masala', category: 'main', tags: ['egg', 'high-protein', 'special'], calories: 360, protein: '18g', description: 'Special Friday Biryani with spiced boiled eggs.' },
          { id: 'f-lu-3', name: 'Burani Garlic Raita & Kachumber', category: 'side', tags: ['veg'], calories: 80, description: 'Garlic infused yogurt with diced cucumber and mint.' },
          { id: 'f-lu-4', name: 'Fresh Phulka & Dal Fry', category: 'bread', tags: ['veg'], calories: 180, protein: '6g', description: 'Homestyle lentils and bread.' },
          { id: 'f-lu-5', name: 'Shahi Tukda with Rabri', category: 'dessert', tags: ['sweet', 'special'], calories: 180, description: 'Crisp ghee-fried bread dipped in saffron syrup topped with thick rabri.' }
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
          { id: 'f-sn-1', name: 'Paneer Bread Rolls & Ketchup', category: 'snack', tags: ['veg', 'high-protein'], calories: 240, protein: '8g', description: 'Crispy rolls stuffed with spiced paneer and herbs.' },
          { id: 'f-sn-2', name: 'Lemon Ice Tea / Hot Chai', category: 'beverage', tags: ['veg'], calories: 90, description: 'Refreshing cooler or traditional tea.' }
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
          { id: 'f-di-1', name: 'Dal Panchmel (Five Lentil Royal Tadka)', category: 'side', tags: ['veg', 'high-protein'], calories: 160, protein: '9g', description: 'Nutrient-rich blend of toor, moong, chana, urad and masoor dal.' },
          { id: 'f-di-2', name: 'Paneer Bhurji / Chicken Korma', category: 'main', tags: ['non-veg', 'high-protein', 'special'], calories: 280, protein: '20g', description: 'Minced paneer with bell peppers or mild aromatic chicken curry.' },
          { id: 'f-di-3', name: 'Tawa Paratha & Steamed Basmati Rice', category: 'bread', tags: ['veg'], calories: 220, protein: '5g', description: 'Flaky layered bread and rice.' },
          { id: 'f-di-4', name: 'Sev Tamatar Ki Sabzi', category: 'main', tags: ['veg'], calories: 150, description: 'Sweet-sour tomato curry topped with crunchy ratlami sev.' },
          { id: 'f-di-5', name: 'Creamy Mango Kulfi', category: 'dessert', tags: ['sweet'], calories: 130, description: 'Traditional Indian ice candy.' }
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
          { id: 'sa-bf-1', name: 'Uttapam with Onion & Tomato Topping', category: 'main', tags: ['veg'], calories: 250, protein: '6g', description: 'Thick fermented rice pancake topped with fresh vegetables.' },
          { id: 'sa-bf-2', name: 'Coconut Chutney & Vegetable Sambar', category: 'side', tags: ['veg'], calories: 110, description: 'Authentic south sambar.' },
          { id: 'sa-bf-3', name: 'Boiled Eggs / Cornflakes with Cold Milk', category: 'main', tags: ['egg', 'high-protein'], calories: 150, protein: '11g', description: 'Protein or light cereal choice.' },
          { id: 'sa-bf-4', name: 'Coffee / Tea', category: 'beverage', tags: ['veg'], calories: 80, description: 'Fresh beverages.' }
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
          { id: 'sa-lu-1', name: 'Kashmiri Dum Aloo with Coriander', category: 'main', tags: ['veg'], calories: 230, protein: '5g', description: 'Baby potatoes simmered in curd and fennel gravy.' },
          { id: 'sa-lu-2', name: 'Dal Panchratan (Creamy Tadka)', category: 'side', tags: ['veg', 'high-protein'], calories: 160, protein: '8g', description: 'High protein tempered lentils.' },
          { id: 'sa-lu-3', name: 'Veg Fried Rice & Chili Paneer Gravy', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 310, protein: '12g', description: 'Indo-Chinese weekend treat with wok tossed rice and paneer.' },
          { id: 'sa-lu-4', name: 'Roti & Salad', category: 'bread', tags: ['veg'], calories: 140, protein: '4g', description: 'Whole wheat flatbreads.' },
          { id: 'sa-lu-5', name: 'Jalebi with Rabri', category: 'dessert', tags: ['sweet', 'special'], calories: 180, description: 'Crisp spiral jalebis soaked in saffron syrup.' }
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
          { id: 'sa-sn-1', name: 'Aloo Tikki Chaat with Dahi & Chutneys', category: 'snack', tags: ['veg', 'special'], calories: 220, description: 'Griddle fried potato patties with seasoned curd and pomegranate.' },
          { id: 'sa-sn-2', name: 'Kullad Special Chai', category: 'beverage', tags: ['veg'], calories: 85, description: 'Clay cup tea with cardamom aroma.' }
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
          { id: 'sa-di-1', name: 'Paneer Butter Masala (Rich Cashew Base)', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 270, protein: '14g', description: 'Creamy tomato-butter gravy.' },
          { id: 'sa-di-2', name: 'Egg Curry / Soya Malai Chaap', category: 'main', tags: ['egg', 'high-protein'], calories: 240, protein: '15g', description: 'Nutritious curry.' },
          { id: 'sa-di-3', name: 'Dal Tadka & Steamed Rice', category: 'side', tags: ['veg'], calories: 200, protein: '6g', description: 'Desi ghee tempered lentils and rice.' },
          { id: 'sa-di-4', name: 'Butter Tandoori Naan / Roti', category: 'bread', tags: ['veg'], calories: 180, protein: '5g', description: 'Soft leavened bread.' },
          { id: 'sa-di-5', name: 'Hot Moong Dal Halwa', category: 'dessert', tags: ['sweet'], calories: 170, description: 'Desi ghee sweet.' }
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
          { id: 'su-bf-1', name: 'Chole Bhature with Pickled Green Chillies', category: 'main', tags: ['veg', 'high-protein', 'special'], calories: 380, protein: '11g', description: 'Golden puffed bhaturas with tangy Amritsari chana.' },
          { id: 'su-bf-2', name: 'Boiled Eggs / Omelette Counter', category: 'main', tags: ['egg', 'high-protein'], calories: 160, protein: '13g', description: 'Live omelette or boiled eggs station.' },
          { id: 'su-bf-3', name: 'Sweet Lassi / Masala Buttermilk / Chai', category: 'beverage', tags: ['veg', 'sweet'], calories: 120, description: 'Creamy thick sweet lassi with malai.' }
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
          { id: 'su-lu-1', name: 'Kolkata Style Chicken Biryani / Paneer Dum Biryani', category: 'main', tags: ['non-veg', 'high-protein', 'special'], calories: 390, protein: '24g', description: 'Fragrant saffron basmati rice slow dum cooked with spices and roasted potato.', isChefSpecial: true },
          { id: 'su-lu-2', name: 'Paneer Butter Masala & Shahi Korma', category: 'main', tags: ['veg', 'high-protein'], calories: 260, protein: '13g', description: 'Rich vegetarian main dish.' },
          { id: 'su-lu-3', name: 'Mirchi Ka Salan & Onion-Mint Raita', category: 'side', tags: ['veg'], calories: 95, description: 'Sesame-peanut curry and spiced curd.' },
          { id: 'su-lu-4', name: 'Tandoori Butter Roti (Unlimited)', category: 'bread', tags: ['veg'], calories: 150, protein: '4g', description: 'Fresh from the clay oven.' },
          { id: 'su-lu-5', name: 'Warm Gulab Jamun with Ice Cream', category: 'dessert', tags: ['sweet', 'special'], calories: 210, description: 'Deluxe Sunday dessert pairing.' }
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
          { id: 'su-sn-1', name: 'Corn Cheese Sandwich / Maggi Noodles', category: 'snack', tags: ['veg'], calories: 210, description: 'Hot grilled sandwich with melted cheese.' },
          { id: 'su-sn-2', name: 'Cold Coffee with Ice Cream / Hot Tea', category: 'beverage', tags: ['veg'], calories: 110, description: 'Chilled blended cold coffee.' }
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
          { id: 'su-di-1', name: 'Dal Khichdi with Pure Desi Ghee & Papad', category: 'main', tags: ['veg', 'high-protein'], calories: 270, protein: '10g', description: 'Wholesome rice and yellow lentil comfort porridge.' },
          { id: 'su-di-2', name: 'Kadai Veg / Egg Bhurji', category: 'main', tags: ['egg', 'high-protein'], calories: 210, protein: '12g', description: 'Wok tossed mixed veggies or spiced eggs.' },
          { id: 'su-di-3', name: 'Phulkas & Curd', category: 'bread', tags: ['veg'], calories: 140, protein: '5g', description: 'Light digestible Sunday dinner.' },
          { id: 'su-di-4', name: 'Sweet Jalebi / Fruit Custard', category: 'dessert', tags: ['sweet'], calories: 130, description: 'Evening dessert.' }
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
    blockName: 'Dr. APJ Abdul Kalam Computer Science Block',
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
    blockName: 'Vivekananda Central Library & Study Hub',
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
