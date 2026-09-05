import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Search,
  Star,
  Clock,
  MapPin,
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  X,
  CreditCard,
  Building,
  Info,
  BadgePercent,
  Timer,
  Navigation,
  CheckCircle2,
  Heart,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { NearbyRestaurant, NearbyRestaurantItem, NearbyRestaurantOrder } from '../types/mess';
import ChromeButton from './ui/chrome-button';
import { soundEffects } from '../utils/audio';

// Visual Category Avatars for "What's on your mind?" (Swiggy / Zomato Signature Carousel)
const FOOD_CATEGORY_AVATARS = [
  { id: 'all', label: 'All Cuisines', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80' },
  { id: 'Amritsari', label: 'Amritsari Kulchas', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80' },
  { id: 'Rolls', label: 'Kathi Rolls', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80' },
  { id: 'Pizza', label: 'Pizzas & Breads', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80' },
  { id: 'Momos', label: 'Dimsums & Momos', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=80' },
  { id: 'Burgers', label: 'Burgers & Shakes', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80' },
  { id: 'North Indian', label: 'Dhabas & Thalis', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80' },
  { id: 'Mughlai', label: 'Paneer & Handi', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80' },
  { id: 'Middle Eastern', label: 'Falafel & Wraps', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80' },
  { id: 'Sweets', label: 'Chaat & Sweets', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&auto=format&fit=crop&q=80' }
];

export const NearbyRestaurantsView: React.FC = () => {
  const {
    nearbyRestaurants,
    nearbyRestoItems,
    nearbyRestoOrders,
    createNearbyRestoOrder,
    currentStudent,
    setActiveTab: setGlobalAppTab,
    loginVendor
  } = useMess();

  // Navigation & Filter States
  const [selectedRestoId, setSelectedRestoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-orders'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [fastDeliveryFilter, setFastDeliveryFilter] = useState(false);
  const [topRatedFilter, setTopRatedFilter] = useState(false);
  const [offersOnlyFilter, setOffersOnlyFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'deliveryTime' | 'costLow' | 'costHigh'>('rating');

  // LPU Hostels List for direct gate delivery
  const LPU_HOSTELS = [
    'BH-1 (Tagore House)',
    'BH-2 (Kalam House)',
    'BH-3 (Raman House)',
    'BH-4 (Bhabha House)',
    'BH-5 (Aryabhatta House)',
    'BH-6 (Chanakya House)',
    'BH-7 (Vivekananda House)',
    'BH-8 (Subhash House)',
    'GH-1 (Kalpana House)',
    'GH-2 (Mother Teresa House)',
    'GH-3 (Kiran Bedi House)',
    'GH-4 (Rani Laxmibai House)',
    'GH-5 (Sarojini House)',
    'GH-6 (Indira House)',
    'UniLiving Student Apartments',
    'UniGuest Studios'
  ];

  // Cart State: { itemId: quantity }
  const [cart, setCart] = useState<Record<string, { item: NearbyRestaurantItem; quantity: number }>>({});
  const [cartRestoId, setCartRestoId] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Active Live Order Tracker Modal State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<NearbyRestaurantOrder | null>(null);

  // Checkout Form State
  const [deliveryHostel, setDeliveryHostel] = useState(currentStudent?.hostel || 'BH-4 (Bhabha House)');
  const [deliveryRoom, setDeliveryRoom] = useState(currentStudent?.roomNo || 'B-312');
  const [contactPhone, setContactPhone] = useState('9335568951');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedDeliveryInstruction, setSelectedDeliveryInstruction] = useState<'gate' | 'call' | 'silent'>('gate');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('VERTO15');
  const [couponError, setCouponError] = useState('');
  const [studentTip, setStudentTip] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'GPay' | 'PhonePe' | 'Paytm' | 'Cash on Delivery'>('UPI');
  const [orderSuccessModal, setOrderSuccessModal] = useState<NearbyRestaurantOrder | null>(null);

  // Distance Zone Options for LPU
  const zoneOptions = [
    { id: 'all', label: 'All 10 KM Radius', count: '14 Spots' },
    { id: 'lawgate', label: 'Law Gate Market (< 500m)', count: '6 Spots' },
    { id: 'maheru', label: 'Maheru Gate (< 1.5 km)', count: '2 Spots' },
    { id: 'gtroad', label: 'GT Road Phagwara (< 6.5 km)', count: '4 Spots' },
    { id: 'city', label: 'Model Town & Cantt (< 10 km)', count: '2 Spots' }
  ];

  // Selected Restaurant
  const activeRestaurant = useMemo(() => {
    return nearbyRestaurants.find(r => r.id === selectedRestoId) || null;
  }, [nearbyRestaurants, selectedRestoId]);

  // Filtered Restaurants
  const filteredRestaurants = useMemo(() => {
    return nearbyRestaurants
      .filter(resto => {
        const matchesSearch =
          resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resto.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (resto.tagline && resto.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (resto.specialty && resto.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (resto.address && resto.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (resto.popularDishes && resto.popularDishes.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesCuisine =
          selectedCuisine === 'all' ||
          (selectedCuisine === 'Pure Veg'
            ? resto.isPureVeg
            : resto.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()));

        let matchesZone = true;
        const distMeters = resto.distanceMeters || 1000;
        if (selectedZone === 'lawgate') {
          matchesZone = distMeters <= 600;
        } else if (selectedZone === 'maheru') {
          matchesZone = distMeters > 600 && distMeters <= 2000;
        } else if (selectedZone === 'gtroad') {
          matchesZone = distMeters > 2000 && distMeters <= 6500;
        } else if (selectedZone === 'city') {
          matchesZone = distMeters > 6500;
        }

        const matchesVeg = !vegOnlyFilter || resto.isPureVeg;
        const matchesFast = !fastDeliveryFilter || parseInt(resto.deliveryTime) <= 25;
        const matchesTopRated = !topRatedFilter || resto.rating >= 4.5;
        const matchesOffers = !offersOnlyFilter || Boolean(resto.studentDiscount);

        return matchesSearch && matchesCuisine && matchesZone && matchesVeg && matchesFast && matchesTopRated && matchesOffers;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'distance') {
          const distA = a.distanceMeters || parseFloat(a.distance) * 1000;
          const distB = b.distanceMeters || parseFloat(b.distance) * 1000;
          return distA - distB;
        }
        if (sortBy === 'deliveryTime') {
          const timeA = parseInt(a.deliveryTime);
          const timeB = parseInt(b.deliveryTime);
          return timeA - timeB;
        }
        if (sortBy === 'costLow') return a.priceForTwo - b.priceForTwo;
        if (sortBy === 'costHigh') return b.priceForTwo - a.priceForTwo;
        return 0;
      });
  }, [nearbyRestaurants, searchQuery, selectedCuisine, selectedZone, vegOnlyFilter, fastDeliveryFilter, topRatedFilter, offersOnlyFilter, sortBy]);

  // Active Restaurant Menu Items (Strictly vegetarian selections)
  const activeMenuItems = useMemo(() => {
    if (!selectedRestoId) return [];
    return nearbyRestoItems.filter(item => item.restoId === selectedRestoId && item.isVeg);
  }, [nearbyRestoItems, selectedRestoId]);

  // Menu Items by Category
  const menuCategories = useMemo(() => {
    const cats: Record<string, NearbyRestaurantItem[]> = {};
    activeMenuItems.forEach(item => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, [activeMenuItems]);

  // Cart Management
  const addToCart = (item: NearbyRestaurantItem) => {
    soundEffects.playTap();
    if (cartRestoId && cartRestoId !== item.restoId) {
      if (confirm(`You have items from another restaurant in your cart. Clear cart and start fresh with ${item.restoName}?`)) {
        setCart({ [item.id]: { item, quantity: 1 } });
        setCartRestoId(item.restoId);
      }
      return;
    }

    setCart(prev => {
      const currentQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { item, quantity: currentQty + 1 }
      };
    });
    setCartRestoId(item.restoId);
  };

  const removeFromCart = (itemId: string) => {
    soundEffects.playClick();
    setCart(prev => {
      const currentQty = prev[itemId]?.quantity || 0;
      if (currentQty <= 1) {
        const next = { ...prev };
        delete next[itemId];
        if (Object.keys(next).length === 0) {
          setCartRestoId(null);
        }
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...prev[itemId], quantity: currentQty - 1 }
      };
    });
  };

  const clearCart = () => {
    setCart({});
    setCartRestoId(null);
  };

  // Cart Calculations
  const cartItemCount = Object.values(cart).reduce((sum, entry) => sum + entry.quantity, 0);
  const cartSubtotal = Object.values(cart).reduce((sum, entry) => sum + ((entry.item.discountedPrice || entry.item.price) * entry.quantity), 0);
  const rawSubtotal = Object.values(cart).reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);
  const menuDiscount = Math.max(0, rawSubtotal - cartSubtotal);
  const deliveryFee = cartSubtotal >= 250 ? 0 : 25;
  const packagingFee = 15;
  
  let couponDiscountAmount = 0;
  if (appliedCoupon === 'VERTO15') {
    couponDiscountAmount = Math.min(60, Math.round(cartSubtotal * 0.15));
  } else if (appliedCoupon === 'LAWGATE') {
    couponDiscountAmount = 30;
  } else if (appliedCoupon === 'CAMPUS20') {
    couponDiscountAmount = Math.round(cartSubtotal * 0.20);
  } else if (appliedCoupon === 'FREEDEL') {
    couponDiscountAmount = deliveryFee;
  } else if (appliedCoupon === 'NIGHTOWL' && cartSubtotal >= 250) {
    couponDiscountAmount = 50;
  }

  const totalDiscount = menuDiscount + couponDiscountAmount;
  const cartTotal = Math.max(0, cartSubtotal + deliveryFee + packagingFee + studentTip - couponDiscountAmount);

  // Apply Coupon Code
  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VERTO15') {
      setAppliedCoupon('VERTO15');
      setCouponError('');
      soundEffects.playSuccess();
    } else if (cleanCode === 'LAWGATE') {
      setAppliedCoupon('LAWGATE');
      setCouponError('');
      soundEffects.playSuccess();
    } else if (cleanCode === 'CAMPUS20') {
      setAppliedCoupon('CAMPUS20');
      setCouponError('');
      soundEffects.playSuccess();
    } else if (cleanCode === 'FREEDEL') {
      setAppliedCoupon('FREEDEL');
      setCouponError('');
      soundEffects.playSuccess();
    } else if (cleanCode === 'NIGHTOWL') {
      if (cartSubtotal >= 250) {
        setAppliedCoupon('NIGHTOWL');
        setCouponError('');
        soundEffects.playSuccess();
      } else {
        setCouponError('Minimum order of ₹250 required for NIGHTOWL');
      }
    } else {
      setCouponError('Invalid coupon code. Try VERTO15, LAWGATE, CAMPUS20, or FREEDEL');
    }
  };

  // Handle Submit Order
  const handlePlaceOrder = () => {
    if (!cartRestoId || Object.keys(cart).length === 0) return;
    const resto = nearbyRestaurants.find(r => r.id === cartRestoId);
    if (!resto) return;

    soundEffects.playSuccess();
    const orderItems = Object.values(cart).map(entry => ({
      itemId: entry.item.id,
      name: entry.item.name,
      price: entry.item.discountedPrice || entry.item.price,
      quantity: entry.quantity,
      isVeg: true
    }));

    const newOrder = createNearbyRestoOrder({
      restoId: resto.id,
      restoName: resto.name,
      studentId: currentStudent?.id || 'std-01',
      studentName: currentStudent?.name || 'Aarav Sharma',
      studentRollNo: currentStudent?.rollNo || '12204567',
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      discount: totalDiscount,
      totalAmount: cartTotal,
      deliveryHostel,
      deliveryRoom,
      contactPhone,
      specialInstructions: `${deliveryNotes ? deliveryNotes + ' | ' : ''}Instruction: ${
        selectedDeliveryInstruction === 'gate'
          ? 'Leave at Hostel Security Desk'
          : selectedDeliveryInstruction === 'call'
          ? 'Call when arriving at Gate 4'
          : 'Silent drop - studying'
      }`,
      paymentMethod: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'UPI',
      estimatedDeliveryTime: resto.deliveryTime || '20-25 mins'
    });

    setOrderSuccessModal(newOrder);
    clearCart();
    setShowCheckoutModal(false);
  };

  // Student's Orders
  const myRestoOrders = useMemo(() => {
    return nearbyRestoOrders.filter(
      ord => ord.studentId === currentStudent?.id || ord.studentRollNo === currentStudent?.rollNo
    );
  }, [nearbyRestoOrders, currentStudent]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & View Switcher in Seamless Light Liquid Glass Theme */}
      <div className="bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_15px_35px_rgba(255,122,48,0.06)] rounded-3xl p-5 sm:p-7 relative overflow-hidden">
        {/* Subtle Warm Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff7a30]/15 to-[#ff9248]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center text-white shrink-0 border border-white/40">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                  LPU Off-Campus Partner Eateries
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 text-[11px] font-bold">
                  100% Veg Menus Displayed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Verified student favorites in Law Gate, Maheru &amp; GT Road Phagwara with direct delivery to BH-1 to BH-8 and GH-1 to GH-6.
              </p>
            </div>
          </div>

          {/* Switch Views & Cart Trigger */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex bg-orange-100/60 p-1 rounded-2xl border border-orange-200/80">
              <button
                id="tab-nearby-explore"
                onClick={() => { setActiveTab('explore'); setSelectedRestoId(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Explore Restaurants
              </button>
              <button
                id="tab-nearby-orders"
                onClick={() => setActiveTab('my-orders')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'my-orders'
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>My Orders</span>
                {myRestoOrders.length > 0 && (
                  <span className="w-5 h-5 bg-white text-orange-600 text-[11px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {myRestoOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Button & Resto Owner Portal */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGlobalAppTab('vendor');
                  soundEffects.playTap();
                }}
                className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-800 border border-orange-200/80 font-bold text-xs sm:text-sm rounded-2xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Restaurant Owner / Partner Control Portal"
              >
                <Store className="w-4 h-4 text-orange-600" />
                <span className="hidden sm:inline">Partner Dashboard</span>
              </button>

              {cartItemCount > 0 && (
                <button
                  id="btn-open-cart-header"
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{cartItemCount} Items</span>
                  <span className="border-l border-white/30 pl-2">₹{cartTotal}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MY RESTAURANT ORDERS (SWIGGY/ZOMATO STYLE ORDER HISTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'my-orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Active &amp; Past Hostel Deliveries
            </h2>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              ← Back to Restaurants
            </button>
          </div>

          {myRestoOrders.length === 0 ? (
            <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-12 text-center shadow-sm">
              <ShoppingBag className="w-16 h-16 mx-auto text-orange-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Restaurant Orders Yet</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mt-1 mb-6">
                Craving crispy Amritsari Kulcha, Paneer Kathi Rolls, Cheese Burst Pizza or Falafel Wraps? Explore nearby partner eateries with fast LPU hostel delivery!
              </p>
              <ChromeButton
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs rounded-full shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Explore Menus &amp; Order
              </ChromeButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRestoOrders.map(order => {
                const statusStyles: Record<string, string> = {
                  Received: 'bg-blue-50 text-blue-700 border-blue-200',
                  Confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
                  Cooking: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse',
                  'Out for Delivery': 'bg-emerald-50 text-emerald-700 border-emerald-200 font-black',
                  Delivered: 'bg-emerald-100/70 text-emerald-800 border-emerald-300',
                  Cancelled: 'bg-red-50 text-red-700 border-red-200'
                };

                return (
                  <div
                    key={order.id}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/95 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-orange-600">{order.orderNumber}</span>
                        <h3 className="text-base font-bold text-slate-900">{order.restoName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Placed at {order.placedAt}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status] || 'bg-slate-100 text-slate-700'}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100/70 space-y-1.5 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-800">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border border-emerald-600 p-0.5 rounded-xs flex items-center justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                            <span className="font-medium">{it.quantity}x {it.name}</span>
                          </span>
                          <span className="font-mono font-bold text-slate-700">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Live Tracker Trigger */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="font-medium">{order.deliveryHostel}, Room {order.deliveryRoom}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTrackingOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-800 hover:bg-orange-500/25 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-orange-600" />
                          <span>Track Live</span>
                        </button>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 font-mono text-sm">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: RESTAURANT EXPLORER & SWIGGY/ZOMATO POLISHED BROWSING */}
      {/* ========================================================================= */}
      {activeTab === 'explore' && !selectedRestoId && (
        <div className="space-y-6">

          {/* 1. "What's on your mind?" - Swiggy/Zomato Signature Visual Carousel */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-5 shadow-[0_10px_30px_rgba(255,122,48,0.04)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-['Outfit'] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  What&apos;s on your mind, Verto?
                </h3>
                <p className="text-xs text-slate-500">Tap any cuisine to filter popular dishes across 10 km campus radius</p>
              </div>
              <span className="text-xs font-bold text-orange-600 cursor-pointer hidden sm:block">
                {selectedCuisine !== 'all' && (
                  <button onClick={() => setSelectedCuisine('all')} className="underline">
                    Reset Filter
                  </button>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
              {FOOD_CATEGORY_AVATARS.map(cat => {
                const isSelected = selectedCuisine === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCuisine(isSelected ? 'all' : cat.id);
                      soundEffects.playClick();
                    }}
                    className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 transition-all overflow-hidden relative shadow-sm ${
                        isSelected
                          ? 'ring-3 ring-[#ff7a30] scale-105 shadow-md shadow-orange-500/25'
                          : 'group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover rounded-full group-hover:brightness-105 transition-all"
                      />
                      
                    </div>
                    <span
                      className={`text-[11px] font-bold text-center max-w-[76px] leading-tight transition-colors ${
                        isSelected ? 'text-orange-600 font-black' : 'text-slate-700 group-hover:text-slate-950'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Swiggy/Zomato Search & Quick Filters Bar */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-5 shadow-[0_10px_30px_rgba(255,122,48,0.04)] space-y-4">
            
            {/* Top Search & Sort Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input with live suggestion look */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="search-nearby-resto"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, dishes (e.g. Kulcha, Kathi Roll, Pizza, Momos)..."
                  className="w-full bg-orange-50/40 border border-orange-200/70 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-medium transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort by Dropdown */}
              <div className="md:col-span-4">
                <select
                  id="sort-nearby-resto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-orange-50/40 border border-orange-200/70 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated (4.5+)</option>
                  <option value="distance">Nearest to LPU Campus</option>
                  <option value="deliveryTime">Fastest Delivery (&lt; 25 mins)</option>
                  <option value="costLow">Budget Friendly (Low to High)</option>
                  <option value="costHigh">Premium Dining (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Pills (Swiggy / Zomato Filter Chips) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Pure Veg Toggle Chip */}
              <button
                id="filter-veg-only"
                onClick={() => {
                  setVegOnlyFilter(!vegOnlyFilter);
                  soundEffects.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  vegOnlyFilter
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 border ${vegOnlyFilter ? 'border-white' : 'border-emerald-600'} p-0.5 rounded-xs flex items-center justify-center`}>
                  <span className={`w-2 h-2 rounded-full ${vegOnlyFilter ? 'bg-white' : 'bg-emerald-600'}`} />
                </span>
                <span>100% Pure Veg Outlets</span>
              </button>

              {/* Fast Delivery Chip */}
              <button
                onClick={() => {
                  setFastDeliveryFilter(!fastDeliveryFilter);
                  soundEffects.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  fastDeliveryFilter
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-orange-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Fast Delivery (&lt; 25 mins)</span>
              </button>

              {/* Top Rated 4.5+ */}
              <button
                onClick={() => {
                  setTopRatedFilter(!topRatedFilter);
                  soundEffects.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  topRatedFilter
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Rating 4.5+</span>
              </button>

              {/* Verified Offers Chip */}
              <button
                onClick={() => {
                  setOffersOnlyFilter(!offersOnlyFilter);
                  soundEffects.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  offersOnlyFilter
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BadgePercent className="w-3.5 h-3.5" />
                <span>Student Discounts</span>
              </button>
            </div>

            {/* Distance Zone Pills (LPU 10 KM Radius) */}
            <div className="space-y-1.5 pt-2 border-t border-orange-100/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  Campus Delivery Locality
                </span>
                <span className="text-[11px] text-orange-600 font-mono font-bold">10 KM Coverage</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {zoneOptions.map(z => (
                  <button
                    key={z.id}
                    onClick={() => {
                      setSelectedZone(z.id);
                      soundEffects.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedZone === z.id
                        ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-sm shadow-orange-500/20'
                        : 'bg-orange-50/50 border border-orange-200/60 text-slate-700 hover:bg-orange-100/60'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Verto Special Promo Coupons Strip */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-300/60 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">LPU Verto Exclusive Delivery Coupons</h4>
                <p className="text-xs text-slate-600">
                  Use code <span className="font-mono font-bold text-orange-600">VERTO15</span> for 15% OFF, <span className="font-mono font-bold text-orange-600">LAWGATE</span> for flat ₹30 OFF or <span className="font-mono font-bold text-orange-600">FREEDEL</span> on orders above ₹250!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                handleApplyCoupon('VERTO15');
                alert('Coupon code VERTO15 copied and applied to cart!');
              }}
              className="px-3.5 py-1.5 rounded-full bg-white text-orange-600 border border-orange-200 font-bold text-xs shadow-xs hover:bg-orange-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Apply VERTO15
            </button>
          </div>

          {/* 4. Restaurant Cards Grid (Signature Swiggy / Zomato Anatomy) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 font-['Outfit']">
                Restaurants near LPU ({filteredRestaurants.length} verified spots)
              </h2>
              <span className="text-xs text-slate-500 font-medium">Hostel drop: Gate 4 / Main Arch</span>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-10 text-center">
                <Store className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <h4 className="font-bold text-slate-800">No restaurants match your filters</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your filters or changing your search keywords.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCuisine('all');
                    setSelectedZone('all');
                    setVegOnlyFilter(false);
                    setFastDeliveryFilter(false);
                    setTopRatedFilter(false);
                    setOffersOnlyFilter(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map(resto => {
                  return (
                    <motion.div
                      key={resto.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setSelectedRestoId(resto.id);
                        soundEffects.playClick();
                      }}
                      className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/95 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(255,122,48,0.12)] transition-all overflow-hidden flex flex-col cursor-pointer group"
                    >
                      {/* Top Photo & Overlaid Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={resto.bannerImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80'}
                          alt={resto.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient Shadow overlay at bottom for readable offer ribbon */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                        {/* Top-Left: Distance & ETA Tag */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 border border-white/80">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span>{resto.deliveryTime}</span>
                          <span className="text-slate-300">•</span>
                          <span>{resto.distance}</span>
                        </div>

                        {/* Top-Right: Veg Status Badge */}
                        {resto.isPureVeg ? (
                          <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-md text-white font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 border border-emerald-400/40">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            100% PURE VEG
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 border border-emerald-500/40">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            PORTAL VEG MENU
                          </div>
                        )}

                        {/* Bottom-Left Overlaid Offer Banner (Classic Swiggy/Zomato Signature) */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                          <div className="flex items-center gap-1 font-black text-xs drop-shadow-md text-amber-300">
                            <Tag className="w-3.5 h-3.5 fill-current" />
                            <span>{resto.studentDiscount || 'Flat 15% Off with VERTO15'}</span>
                          </div>
                          <span className="text-[11px] text-white/90 font-medium">
                            ₹{resto.priceForTwo} for two
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                              {resto.name}
                            </h3>
                            {/* Star Rating Badge (Swiggy / Zomato green block) */}
                            <div className="bg-emerald-600 text-white font-black text-xs px-2 py-0.5 rounded-lg flex items-center gap-0.5 shrink-0 shadow-xs">
                              <Star className="w-3 h-3 fill-current inline-block" />
                              <span>{resto.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                            {resto.cuisine}
                          </p>

                          {/* Famous For Specialty Spotlight */}
                          <div className="mt-2 p-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/70 text-[11px] text-amber-950 font-semibold flex items-start gap-1.5 shadow-xs">
                            <span className="shrink-0 text-amber-600 font-bold">Famous For:</span>
                            <span className="line-clamp-2 text-slate-800 font-medium">
                              {resto.famousFor || resto.specialty}
                            </span>
                          </div>

                          {/* Veg selection confirmation tag for non-veg physical outlets */}
                          {!resto.isPureVeg && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              
                              <span>Strictly Veg Dishes Listed on Portal</span>
                            </div>
                          )}
                        </div>

                        {/* Footer Info & Action */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="line-clamp-1 max-w-[140px]">{resto.address.split(',')[0]}</span>
                          </span>
                          <span className="font-bold text-orange-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                            View Veg Menu <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ACTIVE RESTAURANT MENU (SWIGGY/ZOMATO RESTAURANT DETAIL VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'explore' && activeRestaurant && (
        <div className="space-y-6">

          {/* Restaurant Header Card */}
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-5 sm:p-7 shadow-[0_15px_35px_rgba(255,122,48,0.06)] space-y-4">
            <button
              id="btn-back-to-restaurants"
              onClick={() => {
                setSelectedRestoId(null);
                soundEffects.playClick();
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Restaurants
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={activeRestaurant.bannerImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80'}
                  alt={activeRestaurant.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-orange-200/80 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">{activeRestaurant.name}</h2>
                    {activeRestaurant.isPureVeg ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> 100% Pure Veg Kitchen
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> Veg-Only Campus Portal Menu
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{activeRestaurant.cuisine} • {activeRestaurant.distance}</p>
                  <p className="text-xs text-slate-500 max-w-xl">{activeRestaurant.address}</p>
                </div>
              </div>

              {/* Rating & ETA block */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="bg-emerald-600 text-white font-black text-sm px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current inline-block" />
                  <span>{activeRestaurant.rating}</span>
                  <span className="text-[10px] font-normal text-white/80">({activeRestaurant.ratingCount}+)</span>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" /> {activeRestaurant.deliveryTime}
                  </span>
                  <span>₹{activeRestaurant.priceForTwo} for two</span>
                </div>
              </div>
            </div>

            {/* Exclusive Vegetarian Assurance Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold"><CheckCircle2 className="w-4 h-4 text-white" /></div>
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-950">
                  {activeRestaurant.isPureVeg
                    ? '100% Pure Vegetarian Kitchen Certified'
                    : '100% Vegetarian Campus Portal Selection'}
                </p>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {activeRestaurant.isPureVeg
                    ? 'This restaurant operates an exclusively pure vegetarian kitchen with no meat or poultry prepared on premises.'
                    : 'Although this off-campus outlet offers non-vegetarian items at its physical dine-in counter, this portal exclusively curates and delivers only their certified vegetarian recipes, fresh paneer items, soya chaap, and breads.'}
                </p>
              </div>
            </div>

            {/* Signature Famous For Specialty Spotlight */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-950">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold shadow-xs"><Star className="w-4 h-4 text-white fill-current" /></div>
              <div className="space-y-0.5 flex-1">
                <p className="font-extrabold text-slate-900 text-xs">
                  What {activeRestaurant.name} is Famous For:
                </p>
                <p className="text-slate-700 text-xs font-medium leading-relaxed">
                  {activeRestaurant.famousFor || activeRestaurant.specialty}
                </p>
              </div>
            </div>

            {/* Available Coupon Vouchers Carousel (Swiggy / Zomato Style) */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Available Student Offers for {activeRestaurant.name}
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                <div
                  onClick={() => handleApplyCoupon('VERTO15')}
                  className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs min-w-[210px] shrink-0 cursor-pointer hover:bg-orange-100/60 transition-all"
                >
                  <div className="flex items-center justify-between font-bold text-orange-950">
                    <span className="flex items-center gap-1 font-mono text-orange-600">
                      <Tag className="w-3 h-3" /> VERTO15
                    </span>
                    <span className="text-[10px] bg-orange-200/60 text-orange-800 px-1.5 py-0.5 rounded-md">TAP TO APPLY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">15% OFF up to ₹60 on all orders</p>
                </div>

                <div
                  onClick={() => handleApplyCoupon('LAWGATE')}
                  className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs min-w-[210px] shrink-0 cursor-pointer hover:bg-amber-100/60 transition-all"
                >
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1 font-mono text-amber-700">
                      <Tag className="w-3 h-3" /> LAWGATE
                    </span>
                    <span className="text-[10px] bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded-md">TAP TO APPLY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">Flat ₹30 OFF on student orders</p>
                </div>

                <div
                  onClick={() => handleApplyCoupon('FREEDEL')}
                  className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs min-w-[210px] shrink-0 cursor-pointer hover:bg-emerald-100/60 transition-all"
                >
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1 font-mono text-emerald-700">
                      <Tag className="w-3 h-3" /> FREEDEL
                    </span>
                    <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded-md">TAP TO APPLY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">Free Hostel Gate Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Sections by Category */}
          <div className="space-y-6">
            {Object.keys(menuCategories).map(category => {
              const items = menuCategories[category];
              return (
                <div key={category} className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(255,122,48,0.04)] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                      <span>{category}</span>
                      <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full font-mono">
                        {items.length} dishes
                      </span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => {
                      const inCart = cart[item.id]?.quantity || 0;
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all flex justify-between gap-4 relative group"
                        >
                          {/* Dish Information */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              {/* Classic Green Veg Dot Icon (Swiggy / Zomato standard) */}
                              <span className="w-3.5 h-3.5 border-2 border-emerald-600 p-0.5 rounded-xs flex items-center justify-center shrink-0" title="100% Pure Vegetarian">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              </span>

                              {item.isBestseller && (
                                <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  Bestseller
                                </span>
                              )}
                              {item.isChefSpecial && (
                                <span className="px-2 py-0.2 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold">
                                  Must Try
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.name}</h4>

                            {/* Pricing */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-slate-900 font-mono text-sm">
                                ₹{item.discountedPrice || item.price}
                              </span>
                              {item.discountedPrice && (
                                <span className="text-slate-400 line-through font-mono">₹{item.price}</span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 pr-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Image & Floating ADD / Quantity Pill (Swiggy/Zomato Signature Pattern) */}
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex flex-col items-center">
                            <img
                              src={item.imageUrl || activeRestaurant.bannerImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80'}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-2xl border border-slate-100 shadow-xs"
                            />

                            {/* Floating ADD button on photo bottom */}
                            <div className="absolute -bottom-2.5">
                              {inCart === 0 ? (
                                <button
                                  onClick={() => addToCart(item)}
                                  className="px-5 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xs rounded-xl shadow-md border border-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1"
                                >
                                  ADD <Plus className="w-3 h-3 text-emerald-600 font-bold" />
                                </button>
                              ) : (
                                <div className="flex items-center bg-emerald-600 text-white rounded-xl shadow-md font-bold text-xs border border-emerald-600 overflow-hidden">
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="px-2.5 py-1 hover:bg-emerald-700 active:scale-90 transition-all cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 font-mono">{inCart}</span>
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="px-2.5 py-1 hover:bg-emerald-700 active:scale-90 transition-all cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SWIGGY / ZOMATO SIGNATURE STICKY BOTTOM FLOATING CART BAR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {cartItemCount > 0 && !showCheckoutModal && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-auto"
          >
            <div
              onClick={() => {
                setShowCheckoutModal(true);
                soundEffects.playClick();
              }}
              className="bg-gradient-to-r from-[#ff7a30] via-[#ff883e] to-[#ff9248] text-white p-3.5 sm:p-4 rounded-3xl shadow-[0_15px_35px_rgba(255,122,48,0.45)] border border-white/40 flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block text-white/90">
                    {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} Added
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg font-mono leading-none">₹{cartTotal}</span>
                    {totalDiscount > 0 && (
                      <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-md font-bold">
                        Save ₹{totalDiscount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm bg-white text-orange-600 px-3.5 py-2 rounded-2xl shadow-sm">
                <span>View Cart</span>
                <ChevronRight className="w-4 h-4 font-bold" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. SWIGGY / ZOMATO STYLE CHECKOUT MODAL & LPU HOSTEL GATE DELIVERY */}
      {/* ========================================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 font-['Outfit']">Hostel Delivery Checkout</h3>
                  <p className="text-xs text-slate-500 font-medium">Direct drop-off to LPU Hostel Gate</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Order Items</span>
              <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100 divide-y divide-orange-100/70">
                {Object.values(cart).map(({ item, quantity }) => (
                  <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 flex-1 pr-2">
                      <span className="w-3 h-3 border border-emerald-600 p-0.5 rounded-xs flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-orange-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-orange-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-bold">{quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-orange-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono font-bold text-slate-900 w-12 text-right">
                        ₹{(item.discountedPrice || item.price) * quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Form (LPU Hostels) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Delivery Location (LPU Campus)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Select LPU Hostel</label>
                  <select
                    value={deliveryHostel}
                    onChange={(e) => setDeliveryHostel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                  >
                    {LPU_HOSTELS.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Room / Flat Number</label>
                  <input
                    type="text"
                    value={deliveryRoom}
                    onChange={(e) => setDeliveryRoom(e.target.value)}
                    placeholder="e.g. B-312"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-semibold">Contact Mobile Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {/* Delivery Instructions (Swiggy / Zomato Style) */}
              <div>
                <label className="text-xs text-slate-600 block mb-1.5 font-semibold">Delivery Instructions</label>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedDeliveryInstruction('gate')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      selectedDeliveryInstruction === 'gate'
                        ? 'bg-orange-50 border-orange-500 text-orange-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Security Desk Drop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDeliveryInstruction('call')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      selectedDeliveryInstruction === 'call'
                        ? 'bg-orange-50 border-orange-500 text-orange-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Call at Gate 4
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDeliveryInstruction('silent')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      selectedDeliveryInstruction === 'silent'
                        ? 'bg-orange-50 border-orange-500 text-orange-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Late Study Drop
                  </button>
                </div>
              </div>
            </div>

            {/* Coupons Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Apply Promo Coupon</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={appliedCoupon}
                  onChange={(e) => setAppliedCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter coupon (e.g. VERTO15)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon(appliedCoupon)}
                  className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-700 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
              {couponDiscountAmount > 0 && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Coupon &apos;{appliedCoupon}&apos; applied! You saved ₹{couponDiscountAmount}
                </p>
              )}
            </div>

            {/* Student Rider Tip (Swiggy / Zomato feature) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Tip your Student Runner</span>
                <span className="text-slate-400 font-mono text-[11px]">₹{studentTip}</span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 10, 20, 30].map(tip => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => setStudentTip(tip)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      studentTip === tip
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tip === 0 ? 'No Tip' : `₹${tip}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="space-y-1.5 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">Bill Details</span>
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span className="font-mono">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hostel Gate Delivery Fee</span>
                <span className="font-mono">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Restaurant Packaging</span>
                <span className="font-mono">₹{packagingFee}</span>
              </div>
              {studentTip > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Student Runner Tip</span>
                  <span className="font-mono">₹{studentTip}</span>
                </div>
              )}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Total Savings &amp; Coupon</span>
                  <span className="font-mono">-₹{totalDiscount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>To Pay</span>
                <span className="font-mono text-base text-orange-600">₹{cartTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Payment Option</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> UPI / QR Scan
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  Cash at Gate
                </button>
              </div>
            </div>

            {/* Submit Order Button */}
            <ChromeButton
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Place Order • ₹{cartTotal}</span>
              <ChevronRight className="w-4 h-4" />
            </ChromeButton>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ORDER SUCCESS & LIVE TRACKER POPUP (SWIGGY/ZOMATO TRACKING SCREEN) */}
      {/* ========================================================================= */}
      {(orderSuccessModal || activeTrackingOrder) && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
          >
            {/* Header with success icon */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                {orderSuccessModal ? 'Order Placed Successfully!' : 'Live Order Tracker'}
              </h3>
              <p className="text-xs text-slate-500 font-medium font-mono">
                Order ID: {(orderSuccessModal || activeTrackingOrder)?.orderNumber}
              </p>
            </div>

            {/* Live Progress Stages (Swiggy / Zomato Animated Stepper) */}
            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1 text-orange-600">
                  <Timer className="w-4 h-4 animate-spin" /> ETA: {(orderSuccessModal || activeTrackingOrder)?.estimatedDeliveryTime || '20-25 mins'}
                </span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  ON SCHEDULE
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full w-3/4 animate-pulse rounded-full" />
              </div>

              {/* Steps */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order Confirmed with {(orderSuccessModal || activeTrackingOrder)?.restoName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Kitchen is Preparing Fresh Vegetarian Meal</span>
                </div>
                <div className="flex items-center gap-2.5 text-orange-700 font-bold animate-pulse">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Delivery Partner Assigned &amp; On Way to Gate 4</span>
                </div>
              </div>
            </div>

            {/* Rider Information Card (Swiggy / Zomato feature) */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-800 text-sm"><Truck className="w-5 h-5 text-orange-800" /></div>
                <div>
                  <span className="font-bold text-slate-900 block">Gurpreet Singh (Rider)</span>
                  <span className="text-slate-500 text-[11px]">Hero Splendor • PB-08-AU-4921</span>
                </div>
              </div>
              <a
                href="tel:9335568951"
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                title="Call Delivery Partner"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Delivery Location & Security OTP */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs">
              <div className="text-emerald-950">
                <span className="block font-bold">Delivery to:</span>
                <span className="text-[11px] text-emerald-800">
                  {(orderSuccessModal || activeTrackingOrder)?.deliveryHostel}, Room {(orderSuccessModal || activeTrackingOrder)?.deliveryRoom}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-emerald-700 font-bold uppercase">Delivery OTP</span>
                <span className="font-mono font-black text-sm text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                  4921
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccessModal(null);
                setActiveTrackingOrder(null);
                setActiveTab('my-orders');
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              View Order in History
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};
