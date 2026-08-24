import { TourStep } from '../types/mess';

export const CAMPUS_TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    tabId: 'menu',
    title: 'Welcome to CampusMess Hub',
    tagline: 'Hostel Dining & Food Court Portal',
    description: 'Explore daily vegetarian hostel meal menus, track allergen warnings, scan digital QR passes, order food from campus stalls with live rush times, and arrange classroom parcel deliveries.',
    tip: 'Use keyboard arrow keys or action buttons to navigate through features.',
    highlightText: 'Campus Dining Ecosystem',
    iconName: 'Sparkles'
  },
  {
    id: 'step-menu',
    tabId: 'menu',
    title: "Today's Menu & Allergen Safety",
    tagline: 'Breakfast • Lunch • Evening Snacks • Dinner',
    description: 'Switch between days of the week to inspect full hostel menus. Check nutritional calories, high-protein tags, and use the Allergen Highlight/Filter mode to automatically warn you of ingredients matching your medical profile.',
    tip: 'Rate any hostel dish out of 5 stars to provide instant feedback to the chief chef.',
    highlightText: 'Nutritional & Dietary Intelligence',
    iconName: 'UtensilsCrossed'
  },
  {
    id: 'step-pass',
    tabId: 'pass',
    title: 'Digital Meal Pass & 1-Tap QR Scanner',
    tagline: 'Paperless check-in and automated meal records',
    description: 'Your live student pass displays your unique QR barcode, monthly meal quota, and real-time meal window status. Tap "Open QR Scanner" at the mess entrance counter for fast camera check-in.',
    tip: 'Tap "Skip Meal & Credit Rebate" to get ₹50 credited back to your hostel account.',
    highlightText: 'Smart Digital Attendance & Rebates',
    iconName: 'QrCode'
  },
  {
    id: 'step-foodcourt',
    tabId: 'foodcourt',
    title: 'Campus Food Court & Live Rush Monitor',
    tagline: 'Order from 6+ Stalls with Real-Time Queue & Wait Predictions',
    description: 'Explore wraps, dosas, pizzas, tea lounge, and Asian bowls. Monitor live crowd rush levels (Low, Moderate, Peak) and real-time wait times before ordering. Place orders for instant token generation with WhatsApp status notifications to +91 9335568951.',
    tip: 'The wait-time engine calculates preparation times based on current stall queue load.',
    highlightText: 'Live Rush Radar & Express Pickup Tokens',
    iconName: 'Utensils'
  },
  {
    id: 'step-parcel',
    tabId: 'parcel',
    title: 'Academic Block Classroom Delivery',
    tagline: 'Hot meals delivered across 30+ lecture halls & labs',
    description: 'Select your Academic Block (Block 1 to 30), floor, and room number. The mess dispatch team packages your meal in eco-boxes or tiffins and sends live WhatsApp status updates.',
    tip: 'Hostel mess pass holders can redeem included meal passes directly with ₹0 extra charges.',
    highlightText: 'Direct-to-Classroom Meal Logistics',
    iconName: 'Package'
  },
  {
    id: 'step-dayscholar',
    tabId: 'dayscholar',
    title: 'Day Scholar Express Canteen',
    tagline: 'On-demand pay-per-meal dining for non-hostelites',
    description: 'Day scholars and campus visitors can order full thalis, mini-meals, and snacks on-demand via UPI, card, or counter cash with counter pickup or academic delivery.',
    tip: 'Track your live order status in real time with our color-coded progress tracker.',
    highlightText: 'Open Campus Dining for All',
    iconName: 'Store'
  },
  {
    id: 'step-feedback',
    tabId: 'feedback',
    title: 'Anonymous Mess Pulse & Reviews',
    tagline: 'Direct, honest feedback with zero student identity tracking',
    description: 'Help improve meal hygiene, taste, and temperature. All feedback submitted here is strictly decoupled from student identity at the data layer to ensure complete anonymity and transparent kitchen ratings.',
    tip: 'The mess committee reviews anonymous feedback daily at 16:00 for menu adjustments.',
    highlightText: 'Transparent Student Voice',
    iconName: 'MessageSquareHeart'
  },
  {
    id: 'step-support',
    tabId: 'menu',
    title: 'Helpdesk, Switch Demo Profile & Support',
    tagline: 'Instant assistance at +91 9335568951',
    description: 'Use the top-right profile button to switch between different demo student accounts (with various allergy profiles) or test admin privileges. For mess helpline or dietary concerns, call or WhatsApp +91 9335568951.',
    tip: 'Launch this interactive guide anytime by clicking "Guided Tour" in the navigation bar.',
    highlightText: 'Dedicated Support Hotline',
    iconName: 'HelpCircle'
  }
];

export const TOUR_CHEAT_SHEET = [
  {
    category: 'Mess Timings',
    items: [
      { title: 'Breakfast', detail: '07:30 AM - 09:30 AM', icon: 'Sunrise' },
      { title: 'Lunch', detail: '12:00 PM - 02:30 PM (Peak: 01:00 PM)', icon: 'Sun' },
      { title: 'Evening Snacks & Tea', detail: '05:00 PM - 06:30 PM', icon: 'Coffee' },
      { title: 'Dinner', detail: '07:30 PM - 10:00 PM (Peak: 08:30 PM)', icon: 'Moon' }
    ]
  },
  {
    category: 'Food Court & Live Rush',
    items: [
      { title: 'Low Rush', detail: '1-2 orders ahead • ~3-6 mins wait', icon: 'CheckCircle' },
      { title: 'Moderate Rush', detail: '3-5 orders ahead • ~8-12 mins wait', icon: 'Clock' },
      { title: 'Peak Rush', detail: '6+ orders ahead • ~14-22 mins wait', icon: 'Flame' },
      { title: '6 Active Outlets', detail: 'Rolls, South Hub, Chai Lounge, Pizza, Asian Wok, NutriFit', icon: 'Store' }
    ]
  },
  {
    category: 'Campus Hotline & WhatsApp',
    items: [
      { title: 'Official Helpline', detail: '+91 9335568951', icon: 'Phone' },
      { title: 'WhatsApp Orders', detail: '+91 9335568951', icon: 'MessageCircle' },
      { title: 'Rebate Credit Rate', detail: '₹50 credited per skipped meal', icon: 'DollarSign' }
    ]
  }
];
