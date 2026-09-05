import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import {
  FoodCourtStall,
  FoodCourtItem,
  FoodCourtCartItem,
  FoodCourtRushLevel,
  FoodCourtCustomization,
  FoodCourtOrder as FoodCourtOrderData
} from '../types/mess';
import { soundEffects } from '../utils/audio';
import { formatTimeAmPm } from '../utils/time';
import {
  Store,
  Clock,
  Flame,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Utensils,
  UtensilsCrossed,
  Coffee,
  HeartPulse,
  Soup,
  Receipt,
  Phone,
  Timer,
  X,
  Star,
  Send
} from 'lucide-react';
import ChromeButton from './ui/chrome-button';

const DEFAULT_MESS_WHATSAPP_NUMBER = '+91 9335568951';

const getStallIcon = (stallId: string, className = 'w-4 h-4') => {
  switch (stallId) {
    case 'stall-rolls':
      return <UtensilsCrossed className={className} />;
    case 'stall-south':
      return <Utensils className={className} />;
    case 'stall-chai':
      return <Coffee className={className} />;
    case 'stall-pizza':
      return <Flame className={className} />;
    case 'stall-wok':
      return <Soup className={className} />;
    case 'stall-nutrifit':
      return <HeartPulse className={className} />;
    default:
      return <Store className={className} />;
  }
};

export const FoodCourtOrder: React.FC = () => {
  const {
    foodCourtStalls,
    foodCourtMenuItems,
    foodCourtOrders,
    createFoodCourtOrder,
    currentStudent,
    updateFoodCourtOrderStatus,
    submitFoodCourtFeedback
  } = useMess();

  // Filter & Search State
  const [selectedStallId, setSelectedStallId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);
  const [activeTabSubView, setActiveTabSubView] = useState<'menu' | 'my-orders' | 'rush-radar'>('menu');

  // Cart State
  const [cart, setCart] = useState<FoodCourtCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Customization Modal State
  const [itemToCustomize, setItemToCustomize] = useState<FoodCourtItem | null>(null);
  const [customSpice, setCustomSpice] = useState<'Mild' | 'Medium' | 'Extra Spicy'>('Medium');
  const [customAddCheese, setCustomAddCheese] = useState<boolean>(false);
  const [customJain, setCustomJain] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Checkout Form State
  const [studentName, setStudentName] = useState<string>(currentStudent.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentStudent.phone || DEFAULT_MESS_WHATSAPP_NUMBER);
  const [pickupMethod, setPickupMethod] = useState<'counter_pickup' | 'dine_in' | 'express_takeaway'>('counter_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / Hostel Pay' | 'Mess Wallet' | 'Cash at Counter'>('UPI / Hostel Pay');
  const [checkoutNotes, setCheckoutNotes] = useState<string>('');

  // Active Token Modal State
  const [activeReceiptOrderId, setActiveReceiptOrderId] = useState<string | null>(null);

  // Rate Food from Order Modal State
  const [orderToRate, setOrderToRate] = useState<FoodCourtOrderData | null>(null);
  const [ratedDishName, setRatedDishName] = useState<string>('');
  const [rateTasteStars, setRateTasteStars] = useState<number>(5);
  const [rateHygieneStars, setRateHygieneStars] = useState<number>(5);
  const [rateSpeedStars, setRateSpeedStars] = useState<number>(5);
  const [rateReviewText, setRateReviewText] = useState<string>('');
  const [rateSubmittedSuccess, setRateSubmittedSuccess] = useState<boolean>(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    foodCourtMenuItems.forEach(item => set.add(item.category));
    return ['all', ...Array.from(set)];
  }, [foodCourtMenuItems]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return foodCourtMenuItems.filter(item => {
      if (selectedStallId !== 'all' && item.stallId !== selectedStallId) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (onlyVeg && !item.isVeg) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchStall = item.stallName.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchStall && !matchCategory) return false;
      }
      return true;
    });
  }, [foodCourtMenuItems, selectedStallId, selectedCategory, onlyVeg, searchQuery]);

  // Selected stall details
  const currentStallObj = useMemo(() => {
    if (selectedStallId === 'all') return null;
    return foodCourtStalls.find(s => s.id === selectedStallId) || null;
  }, [foodCourtStalls, selectedStallId]);

  // Cart summary calculations
  const cartTotalAmount = useMemo(() => {
    return cart.reduce((sum, ci) => sum + ci.itemTotal, 0);
  }, [cart]);

  const cartTotalItemsCount = useMemo(() => {
    return cart.reduce((sum, ci) => sum + ci.quantity, 0);
  }, [cart]);

  // Estimated dynamic wait time calculation for the current cart
  const dynamicEstimatedWait = useMemo(() => {
    if (cart.length === 0) return 0;
    // Base stall load
    const primaryStallId = cart[0].item.stallId;
    const stall = foodCourtStalls.find(s => s.id === primaryStallId);
    const queueMultiplier = stall ? stall.activeQueueCount * 2.5 : 4;
    const basePrep = Math.max(...cart.map(c => c.item.basePrepMins));
    const itemsExtra = Math.min(10, (cartTotalItemsCount - 1) * 2);
    return Math.round(basePrep + queueMultiplier + itemsExtra);
  }, [cart, foodCourtStalls, cartTotalItemsCount]);

  // Ready time prediction string
  const estimatedReadyTimeStr = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + (dynamicEstimatedWait || 10));
    return formatTimeAmPm(d);
  }, [dynamicEstimatedWait]);

  // Student active orders
  const myActiveOrders = useMemo(() => {
    return foodCourtOrders.filter(
      o => (o.studentId === currentStudent.id || o.phoneNumber === currentStudent.phone || o.phoneNumber.includes('9335568951')) &&
        (o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready')
    );
  }, [foodCourtOrders, currentStudent]);

  // Selected Order for Receipt
  const receiptOrder = useMemo(() => {
    if (!activeReceiptOrderId) return null;
    return foodCourtOrders.find(o => o.id === activeReceiptOrderId) || null;
  }, [foodCourtOrders, activeReceiptOrderId]);

  // Add Item to Cart
  const handleOpenCustomization = (item: FoodCourtItem) => {
    // Check if cart has items from another stall
    if (cart.length > 0 && cart[0].item.stallId !== item.stallId) {
      const confirmSwitch = window.confirm(
        `Your cart already has items from "${cart[0].item.stallName}". Adding this item will start a new order for "${item.stallName}". Do you want to continue?`
      );
      if (!confirmSwitch) return;
      setCart([]);
    }

    setItemToCustomize(item);
    setCustomSpice('Medium');
    setCustomAddCheese(false);
    setCustomJain(false);
    setCustomNotes('');
    soundEffects.playTap();
  };

  const handleConfirmAddToCart = () => {
    if (!itemToCustomize) return;

    const cheesePrice = customAddCheese ? 20 : 0;
    const singleUnitPrice = itemToCustomize.price + cheesePrice;

    const customization: FoodCourtCustomization = {
      spiceLevel: customSpice,
      addCheese: customAddCheese,
      jainPrep: customJain,
      specialNotes: customNotes.trim() || undefined
    };

    setCart(prev => {
      // Check if exact same customized item exists
      const existingIndex = prev.findIndex(
        ci => ci.item.id === itemToCustomize.id &&
          ci.customization?.spiceLevel === customSpice &&
          ci.customization?.addCheese === customAddCheese &&
          ci.customization?.jainPrep === customJain &&
          ci.customization?.specialNotes === customization.specialNotes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * singleUnitPrice
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            item: itemToCustomize,
            quantity: 1,
            customization,
            itemTotal: singleUnitPrice
          }
        ];
      }
    });

    soundEffects.playTap();
    setItemToCustomize(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const target = updated[index];
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        const singlePrice = target.itemTotal / target.quantity;
        updated[index] = {
          ...target,
          quantity: newQty,
          itemTotal: newQty * singlePrice
        };
      }
      return updated;
    });
    soundEffects.playTap();
  };

  // Place Food Court Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const primaryStall = foodCourtStalls.find(s => s.id === cart[0].item.stallId);
    const stallName = primaryStall ? primaryStall.name : cart[0].item.stallName;
    const stallId = cart[0].item.stallId;

    const orderItems = cart.map(ci => ({
      itemId: ci.item.id,
      name: ci.item.name,
      quantity: ci.quantity,
      price: ci.item.price + (ci.customization?.addCheese ? 20 : 0),
      customization: ci.customization
    }));

    const newOrder = createFoodCourtOrder({
      studentId: currentStudent.id,
      studentName: studentName.trim() || currentStudent.name,
      phoneNumber: phoneNumber.trim() || DEFAULT_MESS_WHATSAPP_NUMBER,
      rollNo: currentStudent.rollNo,
      stallId,
      stallName,
      items: orderItems,
      totalAmount: cartTotalAmount,
      pickupMethod,
      rushLevelAtOrder: primaryStall ? primaryStall.rushLevel : 'Moderate',
      queuePosition: primaryStall ? primaryStall.activeQueueCount + 1 : 1,
      estimatedPrepMins: dynamicEstimatedWait || 12,
      estimatedReadyTime: estimatedReadyTimeStr,
      paymentMethod,
      targetWhatsAppNumber: '919335568951',
      specialInstructions: checkoutNotes.trim() || undefined
    });

    // Clear cart and show receipt
    setCart([]);
    setIsCartOpen(false);
    setActiveReceiptOrderId(newOrder.id);
  };

  // WhatsApp Message Generator
  const generateWhatsAppLink = (order: typeof foodCourtOrders[0]) => {
    const itemsList = order.items
      .map(
        i =>
          `• ${i.quantity}x ${i.name} (₹${i.price * i.quantity})${i.customization?.addCheese ? ' [+Extra Cheese]' : ''}${i.customization?.spiceLevel ? ` [${i.customization.spiceLevel}]` : ''}`
      )
      .join('\n');

    const msg = `*CAMPUS MESS FOOD COURT ORDER TOKEN*\n` +
      `*Token #:* ${order.tokenNumber}\n` +
      `*Order ID:* ${order.id}\n` +
      `*Stall:* ${order.stallName}\n` +
      `*Customer:* ${order.studentName} (${order.rollNo || 'Day Scholar'})\n` +
      `*Phone:* ${order.phoneNumber}\n` +
      `*Pickup Mode:* ${order.pickupMethod.toUpperCase()}\n` +
      `*Est. Ready Time:* ${order.estimatedReadyTime} (~${order.estimatedPrepMins} mins)\n` +
      `---------------------------\n` +
      `*Items Ordered:*\n${itemsList}\n` +
      `---------------------------\n` +
      `*Total Amount:* ₹${order.totalAmount}\n` +
      `*Payment:* ${order.paymentMethod}\n` +
      (order.specialInstructions ? `*Note:* ${order.specialInstructions}\n` : '') +
      `\n_Please alert when token is ready for counter pickup!_`;

    return `https://wa.me/919335568951?text=${encodeURIComponent(msg)}`;
  };

  // Helper badge for stall rush level
  const getRushBadge = (rush: FoodCourtRushLevel, queue: number, wait: number) => {
    switch (rush) {
      case 'Low':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Low Rush</span>
            <span className="opacity-80">({queue} in queue • ~{wait}m)</span>
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate Rush</span>
            <span className="opacity-80">({queue} in queue • ~{wait}m)</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-800 border border-orange-500/30">
            <Flame className="w-3 h-3 text-orange-600" />
            <span>High Rush</span>
            <span className="opacity-80">({queue} in queue • ~{wait}m)</span>
          </span>
        );
      case 'Peak':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-800 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            <span>Peak Rush</span>
            <span className="opacity-80">({queue} in queue • ~{wait}m)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Food Court Live Radar & Occupancy Header */}
      <div className="rounded-3xl p-5 sm:p-7 relative overflow-hidden bg-gradient-to-br from-white/90 via-orange-50/70 to-amber-50/60 backdrop-blur-xl border border-white/90 shadow-xl shadow-orange-500/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-800 text-xs font-bold shadow-xs">
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <span>Campus Food Court & Live Rush Monitor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight">
              Order from 6+ Stalls with Real-Time Queue & Wait Predictions
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Check live counter queues, order food before leaving your hostel room or classroom, and receive instant pickup tokens directly on WhatsApp (+91 9335568951).
            </p>
          </div>

          {/* Live Rush Summary Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-orange-200/70 shadow-sm shrink-0">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-700 flex items-center justify-center">
              <Timer className="w-6 h-6 text-orange-600 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Live Average Wait
              </div>
              <div className="text-lg font-black text-slate-900 font-mono">
                ~8 - 14 Mins
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All 6 Outlets Open</span>
              </div>
            </div>

            {myActiveOrders.length > 0 && (
              <ChromeButton
                onClick={() => setActiveTabSubView('my-orders')}
                className="ml-auto sm:ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{myActiveOrders.length} Active Token{myActiveOrders.length > 1 ? 's' : ''}</span>
              </ChromeButton>
            )}
          </div>
        </div>

        {/* Food Court Universal Search Bar & Quick Food Finder */}
        <div className="mt-5 pt-4 border-t border-orange-200/60 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="foodcourt-search-input" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-orange-600" />
              <span>Search Dishes, Snacks, Beverages &amp; Food Outlets:</span>
            </label>
            {searchQuery && (
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-200">
                {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} found
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Prominent Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="foodcourt-search-input"
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (activeTabSubView !== 'menu') {
                    setActiveTabSubView('menu');
                  }
                }}
                placeholder="Search food items (e.g. Paneer Kathi Roll, Cold Coffee, Mysore Dosa, Pizza, Hakka Noodles, Burger, Shakes...)"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/95 border border-orange-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg Only Toggle in Top Search Bar */}
            <button
              type="button"
              onClick={() => {
                setOnlyVeg(!onlyVeg);
                if (activeTabSubView !== 'menu') setActiveTabSubView('menu');
              }}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 shadow-2xs ${
                onlyVeg
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white/90 text-slate-700 border-orange-200 hover:bg-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>100% Pure Veg</span>
            </button>
          </div>

          {/* Quick Trending Food Search Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center mr-1">
              <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
              Popular:
            </span>
            {[
              { label: 'Rolls', query: 'Roll' },
              { label: 'Idli', query: 'Dosa' },
              { label: 'Coffee', query: 'Coffee' },
              { label: 'Pizzas', query: 'Pizza' },
              { label: 'Noodles', query: 'Noodles' },
              { label: 'Smoothies', query: 'Shake' },
              { label: 'Sandwiches', query: 'Sandwich' },
              { label: 'Bites', query: 'Momo' }
            ].map(tag => (
              <button
                key={tag.query}
                type="button"
                onClick={() => {
                  setSearchQuery(searchQuery === tag.query ? '' : tag.query);
                  setActiveTabSubView('menu');
                  soundEffects.playTap();
                }}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border text-[11px] ${
                  searchQuery === tag.query
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-[#ff7a30] shadow-xs'
                    : 'bg-white/80 text-slate-700 border-orange-200/80 hover:bg-white hover:border-orange-300'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-view Navigation: Menu Browsing vs Active Orders vs Rush Radar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center space-x-2 bg-white/75 backdrop-blur-xl p-1.5 rounded-full border border-orange-200/70 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTabSubView('menu')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabSubView === 'menu'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Court Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubView('rush-radar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabSubView === 'rush-radar'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Rush Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubView('my-orders')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer relative ${
              activeTabSubView === 'my-orders'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Live Tokens & History</span>
            {myActiveOrders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {myActiveOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* View Cart Pill */}
        {cart.length > 0 && (
          <ChromeButton
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white rounded-full text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{cartTotalItemsCount} Item{cartTotalItemsCount > 1 ? 's' : ''} (₹{cartTotalAmount})</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
              ~{dynamicEstimatedWait}m wait
            </span>
          </ChromeButton>
        )}
      </div>

      {/* VIEW 1: LIVE RUSH RADAR VIEW */}
      {activeTabSubView === 'rush-radar' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-['Outfit'] text-slate-900">
                  Live Counter Queue & Rush Meters
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time occupancy sensors updated every 60 seconds across all food court outlets.
                </p>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin-slow" />
                <span>Live Feed Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodCourtStalls.map(stall => (
                <div
                  key={stall.id}
                  className="p-4 rounded-2xl bg-gradient-to-b from-white to-orange-50/30 border border-orange-200/80 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-2.5 rounded-xl bg-orange-100/70 text-orange-700">
                        {getStallIcon(stall.id, 'w-5 h-5')}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{stall.name}</div>
                        <div className="text-[11px] text-slate-500">{stall.location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 border border-orange-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Crowd Rush Status:</span>
                      {getRushBadge(stall.rushLevel, stall.activeQueueCount, stall.estimatedWaitMins)}
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          stall.rushLevel === 'Low'
                            ? 'w-1/4 bg-emerald-500'
                            : stall.rushLevel === 'Moderate'
                            ? 'w-1/2 bg-amber-500'
                            : stall.rushLevel === 'High'
                            ? 'w-3/4 bg-orange-500'
                            : 'w-full bg-rose-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Orders Ahead: {stall.activeQueueCount}</span>
                      <span>Avg Prep: {stall.estimatedWaitMins} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-slate-600 font-medium font-mono">
                      Rating: {stall.rating} ({stall.ratingCount} reviews)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        setActiveTabSubView('menu');
                        soundEffects.playTap();
                      }}
                      className="px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>Browse Menu</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE TOKENS & ORDER HISTORY */}
      {activeTabSubView === 'my-orders' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-['Outfit'] text-slate-900">
                  Active Food Court Tokens & History
                </h2>
                <p className="text-xs text-slate-500">
                  Show your token number at the stall counter for fast collection.
                </p>
              </div>
            </div>

            {foodCourtOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Store className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-medium">No Food Court orders placed yet.</p>
                <ChromeButton
                  onClick={() => setActiveTabSubView('menu')}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Explore Menu
                </ChromeButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foodCourtOrders.map(order => {
                  const isReady = order.status === 'Ready';
                  const isPreparing = order.status === 'Preparing';
                  const isPlaced = order.status === 'Placed';

                  return (
                    <div
                      key={order.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isReady
                          ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-300 shadow-md ring-2 ring-emerald-400/20'
                          : isPreparing
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-300 shadow-xs'
                          : 'bg-white/90 border-orange-200/70 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-black text-slate-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                              {order.tokenNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                order.status === 'Ready'
                                  ? 'bg-emerald-500 text-white animate-pulse'
                                  : order.status === 'Preparing'
                                  ? 'bg-amber-500 text-white'
                                  : order.status === 'Placed'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {order.status === 'Ready' ? 'READY FOR PICKUP' : order.status}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800 mt-1.5">
                            {order.stallName}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900 font-mono">
                            ₹{order.totalAmount}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {order.placedAt}
                          </div>
                        </div>
                      </div>

                      {/* Items summary */}
                      <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100 text-xs space-y-1 mb-3">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-700">
                            <span>
                              {it.quantity}x {it.name}
                              {it.customization?.addCheese && <span className="text-orange-600 text-[10px]"> (+Cheese)</span>}
                            </span>
                            <span className="font-mono text-slate-900">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Time and Queue position */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 mb-3 bg-orange-50/60 p-2 rounded-lg border border-orange-100">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          <span>Est. Ready: <strong>{order.estimatedReadyTime}</strong></span>
                        </div>
                        <div className="font-mono font-semibold text-slate-700">
                          Mode: {order.pickupMethod.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveReceiptOrderId(order.id)}
                            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-orange-200/80 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-2xs"
                          >
                            <QrCode className="w-3.5 h-3.5 text-orange-600" />
                            <span>Token</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOrderToRate(order);
                              setRatedDishName(order.items[0]?.name || '');
                              setRateTasteStars(5);
                              setRateHygieneStars(5);
                              setRateSpeedStars(5);
                              setRateReviewText('');
                              setRateSubmittedSuccess(false);
                            }}
                            className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Rate Food</span>
                          </button>
                        </div>

                        <a
                          href={generateWhatsAppLink(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: MAIN FOOD COURT MENU */}
      {activeTabSubView === 'menu' && (
        <div className="space-y-5">
          {/* Category & Outlet Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/90 shadow-sm space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Category:
              </span>
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white/70 text-slate-600 hover:bg-white border border-orange-200/60'
                    }`}
                  >
                    {cat === 'all' ? 'All Dishes' : cat}
                  </button>
                );
              })}
            </div>

            {/* Active search or filter badge */}
            {(searchQuery || selectedCategory !== 'all' || selectedStallId !== 'all' || onlyVeg) && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-orange-100 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                  <span className="font-semibold text-slate-700">Filters Active:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-medium">
                      Search: &ldquo;{searchQuery}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="ml-1 text-orange-600 hover:text-orange-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                      Category: {selectedCategory}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className="ml-1 text-amber-600 hover:text-amber-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedStallId !== 'all' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-medium">
                      Outlet: {currentStallObj?.name}
                      <button
                        type="button"
                        onClick={() => setSelectedStallId('all')}
                        className="ml-1 text-orange-600 hover:text-orange-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {onlyVeg && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                      100% Veg
                      <button
                        type="button"
                        onClick={() => setOnlyVeg(false)}
                        className="ml-1 text-emerald-600 hover:text-emerald-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <span className="text-slate-500 font-mono text-[11px]">
                    ({filteredItems.length} items found)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStallId('all');
                    setOnlyVeg(false);
                  }}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-800 underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Active Stall Spotlight Banner if a single stall is selected */}
          {currentStallObj && (
            <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent backdrop-blur-md border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="p-3 rounded-2xl bg-white shadow-xs border border-orange-100 text-orange-600">
                  {getStallIcon(currentStallObj.id, 'w-6 h-6')}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                      {currentStallObj.name}
                    </h2>
                    <span className="text-[11px] font-mono text-slate-500">{currentStallObj.stallNumber}</span>
                  </div>
                  <p className="text-xs text-slate-600">{currentStallObj.tagline}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getRushBadge(
                  currentStallObj.rushLevel,
                  currentStallObj.activeQueueCount,
                  currentStallObj.estimatedWaitMins
                )}
                <button
                  type="button"
                  onClick={() => setSelectedStallId('all')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                >
                  Show All Stalls
                </button>
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItems.map(item => {
              const matchingAllergen = currentStudent.allergies?.find(a =>
                item.allergens?.includes(a)
              );

              return (
                <div
                  key={item.id}
                  className="rounded-[28px] p-5 sm:p-6 bg-white/60 hover:bg-white/80 backdrop-blur-2xl border border-white/90 hover:border-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    {/* Dish Name & 100% Pure Veg Indicator */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="w-4 h-4 rounded-md border-2 border-emerald-600 flex items-center justify-center p-0.5 shrink-0 mt-0.5" title="100% Pure Veg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Allergens Listed / Matching Warning */}
                    {matchingAllergen ? (
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-[11px] font-bold flex items-center space-x-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Contains {matchingAllergen} (Allergy Match)</span>
                      </div>
                    ) : item.allergens && item.allergens.length > 0 ? (
                      <div className="flex items-center flex-wrap gap-1 text-[10px] pt-0.5">
                        <span className="text-slate-400 font-medium">Allergens:</span>
                        {item.allergens.map(alg => (
                          <span
                            key={alg}
                            className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-400/30"
                          >
                            {alg}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Price, Prep Time & Add button */}
                  <div className="pt-3.5 border-t border-orange-100/80 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{item.price}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Prep ~{item.basePrepMins} mins</span>
                      </div>
                    </div>

                    <ChromeButton
                      onClick={() => handleOpenCustomization(item)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer border border-white/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add & Customize</span>
                    </ChromeButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CUSTOMIZE ITEM MODAL */}
      {itemToCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 border border-white shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                  {itemToCustomize.stallName}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  {itemToCustomize.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">₹{itemToCustomize.price} • Prep ~{itemToCustomize.basePrepMins}m</p>
              </div>
              <button
                type="button"
                onClick={() => setItemToCustomize(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              {/* Spice Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose Spice Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mild', 'Medium', 'Extra Spicy'] as const).map(spice => (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setCustomSpice(spice)}
                      className={`py-2 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        customSpice === spice
                          ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-orange-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {spice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Extra Cheese Option */}
              <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Add Melted Mozzarella Cheese</div>
                  <div className="text-[10px] text-slate-500">+₹20 per item</div>
                </div>
                <input
                  type="checkbox"
                  checked={customAddCheese}
                  onChange={e => setCustomAddCheese(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 cursor-pointer"
                />
              </div>

              {/* Jain Prep Option */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Jain Cooking (No Onion / Garlic)</div>
                  <div className="text-[10px] text-slate-500">Prepared in sanitized separate cookware</div>
                </div>
                <input
                  type="checkbox"
                  checked={customJain}
                  onChange={e => setCustomJain(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Special Cooking Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g. Extra mint chutney, less oil, crispy crust"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">Total Price</div>
                <div className="text-base font-black text-slate-900 font-mono">
                  ₹{itemToCustomize.price + (customAddCheese ? 20 : 0)}
                </div>
              </div>

              <ChromeButton
                onClick={handleConfirmAddToCart}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                Add to Tray
              </ChromeButton>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART / CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 border border-white shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Food Court Checkout Tray
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {cart.map((ci, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-orange-50/40 border border-orange-100 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="text-xs font-bold text-slate-900">{ci.item.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {ci.customization?.spiceLevel && `[${ci.customization.spiceLevel}]`}
                      {ci.customization?.addCheese && ' • Extra Cheese'}
                      {ci.customization?.jainPrep && ' • Jain'}
                      {ci.customization?.specialNotes && ` • "${ci.customization.specialNotes}"`}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-800">₹{ci.itemTotal}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateCartQty(idx, -1)}
                      className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold w-4 text-center">{ci.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCartQty(idx, 1)}
                      className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Prep Time & Wait Preview */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Estimated Wait Time:</span>
                </span>
                <span className="font-mono font-bold text-orange-700">~{dynamicEstimatedWait} mins</span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center justify-between">
                <span>Order will be ready by:</span>
                <span className="font-mono font-bold text-slate-900">{estimatedReadyTimeStr}</span>
              </div>
            </div>

            {/* Checkout Details Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Pickup Mode */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pickup Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'counter_pickup', label: 'Counter Pickup' },
                    { id: 'dine_in', label: 'Dine-In Plaza' },
                    { id: 'express_takeaway', label: 'Express Pack' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPickupMethod(m.id as any)}
                      className={`py-2 px-2 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                        pickupMethod === m.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI / Hostel Pay', 'Mess Wallet', 'Cash at Counter'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPaymentMethod(p as any)}
                      className={`py-2 px-2 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                        paymentMethod === p
                          ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-orange-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-500">Bill Total</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    ₹{cartTotalAmount}
                  </div>
                </div>

                <ChromeButton
                  type="submit"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 border border-white/20 flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Generate Token & Place Order</span>
                </ChromeButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL TOKEN / RECEIPT MODAL */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-white shadow-2xl space-y-5 animate-scale-up relative overflow-hidden">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                CAMPUS MESS FOOD COURT PASS
              </span>
              <h3 className="text-3xl font-black text-slate-900 font-mono">
                {receiptOrder.tokenNumber}
              </h3>
              <p className="text-xs text-slate-500">{receiptOrder.stallName}</p>
            </div>

            {/* Token details receipt card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Order ID:</span>
                <span className="font-bold text-slate-900">{receiptOrder.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Student:</span>
                <span className="font-bold text-slate-900">{receiptOrder.studentName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Queue Position:</span>
                <span className="font-bold text-orange-600">#{receiptOrder.queuePosition} in queue</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Est. Ready Time:</span>
                <span className="font-bold text-emerald-700">{receiptOrder.estimatedReadyTime} (~{receiptOrder.estimatedPrepMins}m)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-bold text-sm">
                <span>Total Paid:</span>
                <span>₹{receiptOrder.totalAmount}</span>
              </div>
            </div>

            {/* WhatsApp notification CTA */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrderToRate(receiptOrder);
                    setRatedDishName(receiptOrder.items[0]?.name || '');
                    setRateTasteStars(5);
                    setRateHygieneStars(5);
                    setRateSpeedStars(5);
                    setRateReviewText('');
                    setRateSubmittedSuccess(false);
                    setActiveReceiptOrderId(null);
                  }}
                  className="flex-1 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Rate Food &amp; Stall</span>
                </button>

                <a
                  href={generateWhatsAppLink(receiptOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setActiveReceiptOrderId(null)}
                className="w-full py-2.5 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all shadow-xs"
              >
                Done / Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK RATE FOOD FROM ORDER MODAL */}
      {orderToRate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono font-bold text-orange-600 uppercase">
                  {orderToRate.tokenNumber} • {orderToRate.stallName}
                </div>
                <h3 className="text-base font-black text-slate-900">Rate Food Bought from Stall</h3>
              </div>
              <button
                type="button"
                onClick={() => setOrderToRate(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rateSubmittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Food Rating Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Your feedback and food rating has been routed directly to <strong>{orderToRate.stallName}</strong>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitFoodCourtFeedback({
                    stallId: orderToRate.stallId,
                    stallName: orderToRate.stallName,
                    dishName: ratedDishName || orderToRate.items[0]?.name || 'Food Order',
                    rating: rateTasteStars,
                    hygieneRating: rateHygieneStars,
                    speedRating: rateSpeedStars,
                    comment: rateReviewText.trim() || `Rated ${rateTasteStars} stars for ${ratedDishName || orderToRate.items[0]?.name}`,
                    category: 'Taste & Quality',
                    sentiment: rateTasteStars >= 4 ? 'positive' : rateTasteStars === 3 ? 'neutral' : 'negative'
                  });
                  setRateSubmittedSuccess(true);
                  setTimeout(() => {
                    setOrderToRate(null);
                    setRateSubmittedSuccess(false);
                  }, 1500);
                }}
                className="space-y-4"
              >
                {/* Select which purchased dish to rate */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                    Select Item Bought:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {orderToRate.items.map((it, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRatedDishName(it.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          ratedDishName === it.name
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {it.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Rating Aspects */}
                <div className="space-y-2.5 p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Taste &amp; Food Quality:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRateTasteStars(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              s <= rateTasteStars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Cleanliness &amp; Hygiene:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRateHygieneStars(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              s <= rateHygieneStars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Preparation Speed:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRateSpeedStars(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              s <= rateSpeedStars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment box */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Food Review &amp; Stall Feedback (Optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`Tell ${orderToRate.stallName} how delicious the food was...`}
                    value={rateReviewText}
                    onChange={(e) => setRateReviewText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Food Rating to {orderToRate.stallName}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
