import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import ChromeButton from './ui/chrome-button';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Send,
  Building,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Receipt,
  User,
  Phone,
  GraduationCap,
  Store,
  Truck
} from 'lucide-react';
import {
  MealType,
  DayScholarOrder as DayScholarOrderType,
  DayScholarOrderItem,
  STANDARD_ALLERGENS,
  DishItem
} from '../types/mess';
import { getDishPrice } from '../data/initialData';
import { generateDayScholarWhatsAppLink } from '../utils/whatsapp';
import { getCurrentDayOfWeek, getActiveMealStatus } from '../utils/time';
import { soundEffects } from '../utils/audio';

const ACADEMIC_BLOCKS = Array.from({ length: 30 }, (_, i) => `Academic Block ${i + 1}`);
const DEFAULT_MESS_WHATSAPP_NUMBER = '+91 9335568951';

export const DayScholarOrder: React.FC = () => {
  const {
    weeklyMenu,
    selectedDay,
    createDayScholarOrder,
    dayScholarOrders
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const menuDayKey = weeklyMenu[selectedDay] ? selectedDay : todayDay;
  const currentDayMenu = weeklyMenu[menuDayKey] || weeklyMenu['Monday'];
  const currentTime = new Date();
  const mealStatus = getActiveMealStatus(currentTime);

  // Active Meal Slot for Day Scholar menu view (default to current ongoing/upcoming meal slot)
  const [selectedSlot, setSelectedSlot] = useState<MealType>(mealStatus.currentMeal || 'lunch');

  // Customer Profile State for Day Scholar
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Fulfillment preference: 'pickup' | 'delivery'
  const [preference, setPreference] = useState<'pickup' | 'delivery'>('pickup');
  const [blockName, setBlockName] = useState<string>('');
  const [roomFloor, setRoomFloor] = useState<string>('');

  // Inline Allergy Preferences for Day Scholars
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [acknowledgedAllergyWarning, setAcknowledgedAllergyWarning] = useState<boolean>(false);

  // Cart Items: Array of { dishName, quantity, price, allergens }
  const [cartItems, setCartItems] = useState<DayScholarOrderItem[]>([]);

  // Active / Submitted Order ID tracking
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'order' | 'tracking'>('order');

  // Meal Slots definitions
  const mealSlots: { type: MealType; label: string; time: string; icon: typeof Sun }[] = [
    { type: 'breakfast', label: 'Breakfast', time: '07:30 - 09:30 AM', icon: Coffee },
    { type: 'lunch', label: 'Lunch', time: '12:15 - 02:30 PM', icon: Sun },
    { type: 'snacks', label: 'High Tea & Snacks', time: '04:30 - 06:00 PM', icon: Cookie },
    { type: 'dinner', label: 'Dinner', time: '07:30 - 10:00 PM', icon: Moon }
  ];

  // Available dishes for selected meal slot
  const slotDishes: DishItem[] = useMemo(() => {
    const dishes = currentDayMenu?.meals?.[selectedSlot]?.dishes || [];
    return dishes;
  }, [currentDayMenu, selectedSlot]);

  // Cart Total Calculation
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalCartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Allergy Clash Detection for Cart Items
  const detectedAllergenClashes = useMemo(() => {
    if (selectedAllergens.length === 0) return [];
    const clashes: { itemName: string; allergens: string[] }[] = [];

    cartItems.forEach(item => {
      if (item.allergens && item.allergens.length > 0) {
        const matching = item.allergens.filter(a =>
          selectedAllergens.some(sa => sa.toLowerCase() === a.toLowerCase())
        );
        if (matching.length > 0) {
          clashes.push({ itemName: item.dishName, allergens: matching });
        }
      }
    });

    return clashes;
  }, [cartItems, selectedAllergens]);

  // Helper to check if a dish has allergens matching selectedAllergens
  const getDishAllergyWarnings = (dish: DishItem) => {
    if (selectedAllergens.length === 0 || !dish.allergens) return [];
    return dish.allergens.filter(a =>
      selectedAllergens.some(sa => sa.toLowerCase() === a.toLowerCase())
    );
  };

  // Cart operations
  const handleAddToCart = (dish: DishItem) => {
    const price = getDishPrice(dish);
    const existing = cartItems.find(item => item.dishName === dish.name);

    if (existing) {
      setCartItems(prev =>
        prev.map(item =>
          item.dishName === dish.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems(prev => [
        ...prev,
        {
          dishName: dish.name,
          quantity: 1,
          price,
          allergens: dish.allergens || []
        }
      ]);
    }
    soundEffects.playTap();
  };

  const handleUpdateQuantity = (dishName: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.dishName === dishName) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as DayScholarOrderItem[];
    });
    soundEffects.playTap();
  };

  const handleRemoveItem = (dishName: string) => {
    setCartItems(prev => prev.filter(item => item.dishName !== dishName));
    soundEffects.playTap();
  };

  const handleClearCart = () => {
    setCartItems([]);
    soundEffects.playTap();
  };

  // Toggle Allergen
  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
    setAcknowledgedAllergyWarning(false);
  };

  // Form Submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Please add at least one dish to your order cart.');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Please enter a valid phone number for order updates.');
      return;
    }

    if (preference === 'delivery' && !blockName) {
      alert('Please select an Academic Block for delivery.');
      return;
    }

    if (detectedAllergenClashes.length > 0 && !acknowledgedAllergyWarning) {
      alert('Please acknowledge the allergen advisory warning before submitting.');
      return;
    }

    // Create Order in context
    const newOrder = createDayScholarOrder({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      department: department.trim() || 'Day Scholar Student',
      mealSlot: selectedSlot,
      items: cartItems,
      preference,
      blockName: preference === 'delivery' ? blockName : undefined,
      roomFloor: preference === 'delivery' ? roomFloor.trim() : undefined,
      specialNotes: specialNotes.trim() || undefined,
      totalAmount: cartTotal,
      targetWhatsAppNumber: DEFAULT_MESS_WHATSAPP_NUMBER
    });

    setSubmittedOrderId(newOrder.id);
    setActiveViewTab('tracking');

    // Generate WhatsApp Link
    const waLink = generateDayScholarWhatsAppLink(DEFAULT_MESS_WHATSAPP_NUMBER, newOrder);
    
    // Automatically trigger WhatsApp in a new window/tab
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  // Find currently submitted order or active tracking order
  const activeTrackedOrder: DayScholarOrderType | undefined = useMemo(() => {
    if (submittedOrderId) {
      return dayScholarOrders.find(o => o.id === submittedOrderId);
    }
    // Otherwise show latest day scholar order if available
    return dayScholarOrders[0];
  }, [submittedOrderId, dayScholarOrders]);

  // Order Stepper Status mapping
  const getStatusStepIndex = (status: DayScholarOrderType['status']) => {
    switch (status) {
      case 'New': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Collected': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner / Hero Header */}
      <div className="rounded-[36px] bg-white/50 backdrop-blur-3xl border border-white/80 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
              Campus Dining Direct
            </span>
            <span className="text-xs text-orange-600 font-semibold font-mono">À La Carte Pay & Eat</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            Day Scholar Dining & Express Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Order fresh meals for counter pickup or fast delivery to any academic building.
          </p>
        </div>

        {/* View Switcher: Place Order vs Live Tracker */}
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white/90 self-start md:self-auto shadow-xs">
          <button
            onClick={() => setActiveViewTab('order')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewTab === 'order'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/20 border border-white/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Menu</span>
            {cartItems.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white text-orange-600 font-black">
                {totalCartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewTab('tracking')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewTab === 'tracking'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/20 border border-white/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Tracking</span>
            {dayScholarOrders.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800">
                {dayScholarOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: MENU & ORDERING INTERFACE */}
      {activeViewTab === 'order' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Menu Selection (8 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Meal Slot Tabs Bar */}
            <div className="bg-white/55 backdrop-blur-3xl rounded-[36px] p-5 sm:p-6 border border-white/90 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b border-orange-200/50 pb-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h2 className="text-sm font-bold text-slate-900 font-sans tracking-normal">
                    Select Meal Slot
                  </h2>
                </div>
                <span className="text-xs text-orange-600 font-semibold font-mono">100% Pure Veg</span>
              </div>

              {/* Slot Selector Grid - Horizontally scrollable on mobile */}
              <div className="flex sm:grid sm:grid-cols-4 gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-0 pt-1 px-1 -mx-1 sm:mx-0 snap-x snap-mandatory sm:snap-none scrollbar-none">
                {mealSlots.map((slot) => {
                  const Icon = slot.icon;
                  const isActive = selectedSlot === slot.type;
                  const isCurrent = mealStatus.currentMeal === slot.type;

                  return (
                    <button
                      key={slot.type}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot.type);
                        soundEffects.playTap();
                      }}
                      className={`min-w-[130px] sm:min-w-0 shrink-0 sm:shrink p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer snap-center ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-white/40 shadow-md shadow-orange-500/20 scale-[1.02]'
                          : 'bg-white/70 border-orange-200/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                        {isCurrent && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-800 border border-emerald-300'} animate-pulse`}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {slot.label}
                        </div>
                        <div className={`text-[10px] font-mono mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                          {slot.time}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dish Cards List for Selected Slot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Dishes • {mealSlots.find(s => s.type === selectedSlot)?.label}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {slotDishes.length} Items Listed
                </span>
              </div>

              {slotDishes.length === 0 ? (
                <div className="p-8 text-center bg-white/50 backdrop-blur-xl rounded-[32px] border border-dashed border-orange-200 text-slate-500 text-xs">
                  No dishes registered for this slot in today's menu. Check other meal slots!
                </div>
              ) : (
                <div className="space-y-3">
                  {slotDishes.map((dish) => {
                    const price = getDishPrice(dish);
                    const cartItem = cartItems.find(item => item.dishName === dish.name);
                    const dishClashes = getDishAllergyWarnings(dish);
                    const hasClash = dishClashes.length > 0;

                    return (
                      <div
                        key={dish.id || dish.name}
                        className={`p-4 sm:p-5 rounded-[28px] border transition-all duration-150 relative ${
                          cartItem
                            ? 'bg-white/85 border-orange-300 shadow-md shadow-orange-500/5'
                            : 'bg-white/60 hover:bg-white/80 border-white/90 backdrop-blur-xl shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Dish Info */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {dish.name}
                              </h4>
                            </div>

                            {dish.description && (
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {dish.description}
                              </p>
                            )}

                            {/* Nutrition & Allergens preview */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono pt-0.5">
                              {dish.calories && (
                                <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-slate-700">{dish.calories} kcal</span>
                              )}
                              {dish.allergens && dish.allergens.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-slate-500">Allergens:</span>
                                  {dish.allergens.map(alg => (
                                    <span key={alg} className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300 font-medium text-[10px]">
                                      {alg}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Allergy Conflict Alert */}
                            {hasClash && (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold mt-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Contains your flagged allergen: <strong>{dishClashes.join(', ')}</strong></span>
                              </div>
                            )}
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-200/50">
                            <div className="text-right">
                              <div className="text-base sm:text-lg font-black text-orange-600 font-mono">
                                ₹{price}
                              </div>
                              <span className="text-[10px] text-slate-500">per portion</span>
                            </div>

                            {cartItem ? (
                              <div className="flex items-center space-x-1 bg-white/90 p-1 rounded-2xl border border-orange-300 shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(dish.name, -1)}
                                  className="w-7 h-7 rounded-xl bg-orange-100/70 hover:bg-orange-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(dish.name, 1)}
                                  className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <ChromeButton
                                type="button"
                                onClick={() => handleAddToCart(dish)}
                                className="px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white shadow-md shadow-orange-500/20 border border-white/20"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Order</span>
                              </ChromeButton>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Running Cart & Checkout Form (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Running Cart Summary */}
            <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] p-5 sm:p-7 border border-white/90 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)] space-y-5">
              
              <div className="flex items-center justify-between border-b border-orange-200/50 pb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Your Day Scholar Order Cart
                  </h3>
                </div>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center space-x-1 transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-orange-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Your cart is currently empty.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.dishName}
                      className="p-3 rounded-2xl bg-white/80 border border-white flex items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{item.dishName}</div>
                        <div className="text-[11px] text-orange-600 font-mono">
                          ₹{item.price} × {item.quantity} = <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.dishName, -1)}
                          className="w-6 h-6 rounded-lg bg-orange-100/70 hover:bg-orange-200 text-slate-700 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.dishName, 1)}
                          className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white flex items-center justify-center font-bold shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.dishName)}
                          className="p-1 text-slate-400 hover:text-emerald-700 transition-colors ml-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              {cartItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/70 border border-orange-200/70 space-y-2 text-xs shadow-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal ({totalCartItemCount} portions)</span>
                    <span className="font-mono text-slate-900 font-bold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment Fee</span>
                    <span className="font-mono text-emerald-700 font-bold">FREE (Campus Mess Service)</span>
                  </div>
                  <div className="border-t border-orange-200/50 pt-2 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Amount Payable</span>
                    <span className="text-orange-600 font-mono text-base">₹{cartTotal}</span>
                  </div>
                </div>
              )}

              {/* Allergy Warning Notification if conflict detected in cart */}
              {detectedAllergenClashes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Allergen Warning Detected</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    You have selected dishes with allergens matching your preferences:
                  </p>
                  <ul className="text-[10px] text-emerald-800 font-mono list-disc list-inside space-y-0.5">
                    {detectedAllergenClashes.map((c, idx) => (
                      <li key={idx}>
                        <strong>{c.itemName}</strong>: {c.allergens.join(', ')}
                      </li>
                    ))}
                  </ul>
                  <label className="flex items-center space-x-2 text-[11px] text-emerald-950 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={acknowledgedAllergyWarning}
                      onChange={(e) => setAcknowledgedAllergyWarning(e.target.checked)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>I understand the ingredients and wish to proceed with this order.</span>
                  </label>
                </div>
              )}

              {/* Day Scholar Details & Dispatch Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4 pt-2 border-t border-orange-200/50">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contact & Dispatch Details
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sneha Kulkarni"
                    className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Phone Number (WhatsApp Active) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 9335568951"
                    className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs font-mono"
                  />
                </div>

                {/* Department / Course */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                    <span>Department / Branch (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. B.Tech CS Year 3 / Design"
                    className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                  />
                </div>

                {/* Fulfillment Preference Radio Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Fulfillment Preference *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreference('pickup')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        preference === 'pickup'
                          ? 'bg-orange-500/15 border-orange-400 text-orange-950 shadow-xs'
                          : 'bg-white/70 border-orange-200/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Store className="w-3.5 h-3.5 text-orange-600" />
                        <span>Self Pickup</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Mess Counter 3 Express
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreference('delivery')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        preference === 'delivery'
                          ? 'bg-orange-500/15 border-orange-400 text-orange-950 shadow-xs'
                          : 'bg-white/70 border-orange-200/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Truck className="w-3.5 h-3.5 text-orange-600" />
                        <span>Deliver to Block</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Academic Blocks 1–30
                      </span>
                    </button>
                  </div>
                </div>

                {/* Delivery Location Fields (Only if Delivery Selected) */}
                {preference === 'delivery' && (
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-orange-200 space-y-3 animate-in fade-in shadow-xs">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-orange-500" />
                        <span>Academic Block / Building Name *</span>
                      </label>
                      <select
                        required
                        value={blockName}
                        onChange={(e) => setBlockName(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl bg-white/90 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-xs"
                      >
                        <option value="" disabled className="text-slate-400">
                          -- Select Academic Block --
                        </option>
                        {ACADEMIC_BLOCKS.map((block) => (
                          <option key={block} value={block} className="text-slate-800">
                            {block}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Room / Floor / Lab Desk *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomFloor}
                        onChange={(e) => setRoomFloor(e.target.value)}
                        placeholder="e.g. Systems Lab 2, 3rd Floor"
                        className="w-full text-xs p-3 rounded-2xl bg-white/90 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Special Preparation Notes / Requests
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra green chutney, less oil, pack by 1:15 PM"
                    className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                  />
                </div>

                {/* Submit Button */}
                <ChromeButton
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 border border-white/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    Submit Order & Open WhatsApp {cartTotal > 0 ? `(₹${cartTotal})` : ''}
                  </span>
                </ChromeButton>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: LIVE ORDER TRACKING & RECENT DAY SCHOLAR ORDERS */}
      {activeViewTab === 'tracking' && (
        <div className="space-y-6">
          
          {/* Active Tracked Order Progress */}
          {activeTrackedOrder ? (
            <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] p-6 sm:p-8 border border-white/90 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)] space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-200/50 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-slate-900 font-mono">
                      #{activeTrackedOrder.id}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                      activeTrackedOrder.status === 'Collected'
                        ? 'bg-emerald-500/15 text-emerald-800 border-emerald-300'
                        : activeTrackedOrder.status === 'Ready'
                        ? 'bg-blue-500/15 text-blue-800 border-blue-300 animate-pulse'
                        : activeTrackedOrder.status === 'Preparing'
                        ? 'bg-orange-500/15 text-orange-800 border-orange-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {activeTrackedOrder.status === 'Ready'
                        ? (activeTrackedOrder.preference === 'delivery' ? 'Out for Delivery' : 'Ready for Counter Pickup')
                        : activeTrackedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed for <strong>{activeTrackedOrder.name}</strong> • {activeTrackedOrder.timestamp}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const waLink = generateDayScholarWhatsAppLink(
                        DEFAULT_MESS_WHATSAPP_NUMBER,
                        activeTrackedOrder
                      );
                      window.open(waLink, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Resend WhatsApp Ticket</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('order')}
                    className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-orange-200 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-500" />
                    <span>Order Again</span>
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 relative">
                  {[
                    { label: 'Order Placed', desc: 'Received in Kitchen', step: 0 },
                    { label: 'Preparing', desc: 'Fresh on Stove', step: 1 },
                    {
                      label: activeTrackedOrder.preference === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
                      desc: activeTrackedOrder.preference === 'delivery' ? 'Runner Dispatched' : 'At Counter 3',
                      step: 2
                    },
                    { label: 'Collected', desc: 'Handed Over', step: 3 }
                  ].map((s, idx) => {
                    const currentStep = getStatusStepIndex(activeTrackedOrder.status);
                    const isDone = currentStep >= s.step;
                    const isCurrent = currentStep === s.step;

                    return (
                      <div key={idx} className="text-center space-y-2 relative">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isDone
                            ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-orange-500/20'
                            : 'bg-white/80 text-slate-400 border border-orange-200'
                        } ${isCurrent ? 'ring-4 ring-orange-400/30 animate-pulse' : ''}`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {s.label}
                          </div>
                          <div className="text-[10px] text-slate-500 hidden sm:block">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Content Summary Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/70 border border-orange-200 space-y-2 text-xs shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Ordered Dishes & Quantities
                  </span>
                  <div className="space-y-1.5 pt-1">
                    {activeTrackedOrder.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-slate-800">
                        <span>{it.dishName} × {it.quantity}</span>
                        <span className="font-mono text-orange-600 font-bold">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-orange-200/50 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Bill</span>
                      <span className="font-mono text-orange-600">₹{activeTrackedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-orange-200 space-y-2 text-xs shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Dispatch & Contact Details
                  </span>
                  <div className="space-y-1 text-slate-700 pt-1">
                    <div><strong>Student:</strong> {activeTrackedOrder.name} ({activeTrackedOrder.phoneNumber})</div>
                    <div><strong>Department:</strong> {activeTrackedOrder.department}</div>
                    <div>
                      <strong>Fulfillment:</strong>{' '}
                      {activeTrackedOrder.preference === 'delivery'
                        ? `${activeTrackedOrder.blockName} (${activeTrackedOrder.roomFloor})`
                        : 'Self-Pickup from Counter 3 (Day Scholar Express)'}
                    </div>
                    {activeTrackedOrder.specialNotes && (
                      <div className="text-slate-500 italic">
                        "{activeTrackedOrder.specialNotes}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white/50 backdrop-blur-xl rounded-[32px] border border-orange-200 text-slate-600 space-y-3 shadow-xs">
              <p className="text-xs">No active day scholar orders yet.</p>
              <button
                onClick={() => setActiveViewTab('order')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs rounded-full shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Start New Order
              </button>
            </div>
          )}

          {/* All Day Scholar Orders History / Queue list */}
          <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] p-6 sm:p-7 border border-white/90 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)] space-y-4">
            <div className="flex items-center justify-between border-b border-orange-200/50 pb-3">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Day Scholar Orders Queue
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {dayScholarOrders.length} Total
              </span>
            </div>

            <div className="space-y-2.5">
              {dayScholarOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSubmittedOrderId(ord.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    activeTrackedOrder?.id === ord.id
                      ? 'bg-white border-orange-400 shadow-md shadow-orange-500/10'
                      : 'bg-white/70 hover:bg-white border-white/80 shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">#{ord.id}</span>
                      <span className="text-xs font-bold text-slate-800">{ord.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-orange-100 text-orange-800 font-mono">
                        {ord.mealSlot.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {ord.items.map(i => `${i.dishName} x${i.quantity}`).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {ord.preference === 'delivery' ? ord.blockName : 'Self-Pickup'} • {ord.timestamp}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-orange-600 text-sm">₹{ord.totalAmount}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border uppercase ${
                        ord.status === 'Collected'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'Ready'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : ord.status === 'Preparing'
                          ? 'bg-orange-50 text-orange-800 border-orange-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
