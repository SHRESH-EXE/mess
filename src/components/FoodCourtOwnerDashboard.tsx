import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import {
  FoodCourtStall,
  FoodCourtItem,
  FoodCourtOrderStatus,
  FoodCourtRushLevel,
  FoodCourtFeedback,
  FoodCourtFeedbackCategory,
  NearbyRestaurant,
  NearbyRestaurantItem,
  NearbyRestaurantOrder
} from '../types/mess';
import ChromeButton from './ui/chrome-button';
import { soundEffects } from '../utils/audio';
import {
  Store,
  UtensilsCrossed,
  Clock,
  Users,
  Flame,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Sliders,
  MessageSquareHeart,
  Star,
  Sparkles,
  RefreshCw,
  Phone,
  Power,
  ChevronRight,
  Filter,
  Check,
  X,
  MessageCircle,
  Layers,
  Sparkle,
  TrendingUp,
  Tag,
  ShieldCheck,
  ShieldAlert,
  Send,
  HelpCircle,
  Eye,
  EyeOff,
  BarChart3,
  QrCode,
  Receipt,
  IndianRupee,
  Volume2,
  Download,
  MapPin,
  Building,
  Navigation
} from 'lucide-react';

interface FoodCourtOwnerDashboardProps {
  onOpenScanner?: () => void;
}

export const FoodCourtOwnerDashboard: React.FC<FoodCourtOwnerDashboardProps> = ({ onOpenScanner }) => {
  const {
    currentSession,
    foodCourtStalls,
    foodCourtMenuItems,
    foodCourtOrders,
    foodCourtFeedbacks,
    nearbyRestaurants,
    nearbyRestoItems,
    nearbyRestoOrders,
    updateFoodCourtOrderStatus,
    updateStallRushLevel,
    updateFoodCourtStallDetails,
    addFoodCourtItem,
    updateFoodCourtItem,
    deleteFoodCourtItem,
    toggleFoodCourtItemAvailability,
    updateFoodCourtFeedbackStatus,
    switchVendorStall,
    updateNearbyRestoOrderStatus,
    updateNearbyRestaurantDetails,
    addNearbyRestoItem,
    updateNearbyRestoItem,
    deleteNearbyRestoItem,
    toggleNearbyRestoItemAvailability
  } = useMess();

  const isNearbyRestoPartner = currentSession?.partnerType === 'nearby_resto' || Boolean(currentSession?.restoId);

  // Active Partner determination
  const currentResto = nearbyRestaurants.find(r => r.id === currentSession?.restoId) || nearbyRestaurants[0];
  const currentStallId = currentSession?.stallId || 'stall-rolls';
  const currentStall = foodCourtStalls.find(s => s.id === currentStallId) || foodCourtStalls[0];

  // Active Dashboard Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'operations' | 'orders' | 'feedback' | 'analytics'>('menu');

  // Fast Token Lookup in Orders Tab
  const [tokenSearchQuery, setTokenSearchQuery] = useState<string>('');

  // Menu Search & Filter State
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodCourtItem | null>(null);
  const [editingRestoItem, setEditingRestoItem] = useState<NearbyRestaurantItem | null>(null);

  // New / Edit Dish Form State
  const [dishName, setDishName] = useState<string>('');
  const [dishCategory, setDishCategory] = useState<string>('Rolls & Wraps');
  const [dishPrice, setDishPrice] = useState<number>(80);
  const [dishDiscountedPrice, setDishDiscountedPrice] = useState<number | undefined>(undefined);
  const [dishPrepMins, setDishPrepMins] = useState<number>(8);
  const [dishDescription, setDishDescription] = useState<string>('');
  const [dishIsVeg, setDishIsVeg] = useState<boolean>(true);
  const [dishCalories, setDishCalories] = useState<number>(350);
  const [dishAllergens, setDishAllergens] = useState<string[]>([]);
  const [dishIsBestSeller, setDishIsBestSeller] = useState<boolean>(false);
  const [dishIsMustTry, setDishIsMustTry] = useState<boolean>(false);
  const [dishAvailable, setDishAvailable] = useState<boolean>(true);
  const [dishImageUrl, setDishImageUrl] = useState<string>('');

  // Operations Form State for Stalls
  const [stallNotice, setStallNotice] = useState<string>(currentStall.tagline || '');
  const [stallOpeningHours, setStallOpeningHours] = useState<string>(currentStall.openingHours || '10:00 AM - 11:00 PM');
  const [isNoticeSaved, setIsNoticeSaved] = useState<boolean>(false);

  // Operations Form State for Restaurants
  const [restoDeliveryTime, setRestoDeliveryTime] = useState<string>(currentResto.deliveryTime || '20-30 mins');
  const [restoDiscountOffer, setRestoDiscountOffer] = useState<string>(currentResto.studentDiscount || '');
  const [restoTagline, setRestoTagline] = useState<string>(currentResto.tagline || '');
  const [restoSpecialty, setRestoSpecialty] = useState<string>(currentResto.famousFor || currentResto.specialty || '');
  const [restoPhone, setRestoPhone] = useState<string>(currentResto.phone || '');
  const [restoAddress, setRestoAddress] = useState<string>(currentResto.address || '');

  // Feedback Filter State
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [feedbackSentimentFilter, setFeedbackSentimentFilter] = useState<string>('all');

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'active' | 'Ready' | 'Completed'>('active');

  // ==========================================
  // ITEMS FOR ACTIVE PARTNER
  // ==========================================
  const activeMenuItems = useMemo(() => {
    if (isNearbyRestoPartner) {
      return nearbyRestoItems.filter(item => item.restoId === currentResto.id);
    }
    return foodCourtMenuItems.filter(item => item.stallId === currentStall.id);
  }, [isNearbyRestoPartner, nearbyRestoItems, currentResto.id, foodCourtMenuItems, currentStall.id]);

  // Categories present in this partner's menu
  const activeCategories = useMemo(() => {
    const cats = Array.from(new Set(activeMenuItems.map(i => i.category)));
    return ['all', ...cats];
  }, [activeMenuItems]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return activeMenuItems.filter(item => {
      const matchesCategory = selectedMenuCategory === 'all' || item.category === selectedMenuCategory;
      const matchesSearch =
        !menuSearchQuery ||
        item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeMenuItems, selectedMenuCategory, menuSearchQuery]);

  // ==========================================
  // ORDERS FOR ACTIVE PARTNER
  // ==========================================
  const activeOrders = useMemo(() => {
    if (isNearbyRestoPartner) {
      return nearbyRestoOrders.filter(o => o.restoId === currentResto.id);
    }
    return foodCourtOrders.filter(o => o.stallId === currentStall.id);
  }, [isNearbyRestoPartner, nearbyRestoOrders, currentResto.id, foodCourtOrders, currentStall.id]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter((o: any) => {
      const status = o.status;
      const matchStatus =
        orderStatusFilter === 'all'
          ? true
          : orderStatusFilter === 'active'
          ? status === 'Placed' || status === 'Preparing' || status === 'Received' || status === 'Confirmed' || status === 'Cooking' || status === 'Out for Delivery'
          : orderStatusFilter === 'Ready'
          ? status === 'Ready' || status === 'Out for Delivery'
          : orderStatusFilter === 'Completed'
          ? status === 'Completed' || status === 'Delivered'
          : true;

      const q = tokenSearchQuery.trim().toLowerCase();
      const orderIdentifier = o.tokenNumber || o.orderNumber || '';
      const student = o.studentName || '';
      const phone = o.phoneNumber || o.contactPhone || '';

      const matchQuery =
        !q ||
        orderIdentifier.toLowerCase().includes(q) ||
        student.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q) ||
        o.items.some((i: any) => i.name.toLowerCase().includes(q));

      return matchStatus && matchQuery;
    });
  }, [activeOrders, orderStatusFilter, tokenSearchQuery]);

  // Feedbacks for stall
  const stallFeedbacks = useMemo(() => {
    return foodCourtFeedbacks.filter(f => f.stallId === currentStall.id);
  }, [foodCourtFeedbacks, currentStall.id]);

  // Sales & Analytics
  const salesMetrics = useMemo(() => {
    const totalOrders = activeOrders.length;
    const completedOrders = activeOrders.filter((o: any) => o.status === 'Completed' || o.status === 'Delivered').length;
    const activeOrdersCount = activeOrders.filter((o: any) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Received' || o.status === 'Confirmed' || o.status === 'Cooking' || o.status === 'Out for Delivery').length;
    const totalGrossRevenue = activeOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalGrossRevenue / totalOrders) : 0;

    const itemCounts: { [name: string]: { name: string; quantity: number; revenue: number; category: string } } = {};
    activeOrders.forEach((order: any) => {
      order.items.forEach((it: any) => {
        if (!itemCounts[it.name]) {
          itemCounts[it.name] = { name: it.name, quantity: 0, revenue: 0, category: 'Dish' };
        }
        itemCounts[it.name].quantity += it.quantity;
        itemCounts[it.name].revenue += it.quantity * it.price;
      });
    });

    const topSellingDishes = Object.values(itemCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

    return {
      totalOrders,
      completedOrders,
      activeOrdersCount,
      totalGrossRevenue,
      avgOrderValue,
      topSellingDishes
    };
  }, [activeOrders]);

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    soundEffects.playTap();
    setEditingItem(null);
    setEditingRestoItem(null);
    setDishName('');
    setDishCategory(isNearbyRestoPartner ? (currentResto.cuisine.split(',')[0] || 'Main Course') : 'Rolls & Wraps');
    setDishPrice(120);
    setDishDiscountedPrice(undefined);
    setDishPrepMins(12);
    setDishDescription('');
    setDishIsVeg(true);
    setDishCalories(380);
    setDishAllergens([]);
    setDishIsBestSeller(false);
    setDishIsMustTry(false);
    setDishAvailable(true);
    setDishImageUrl('');
    setIsAddDishModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    soundEffects.playTap();
    if (isNearbyRestoPartner) {
      setEditingRestoItem(item as NearbyRestaurantItem);
      setEditingItem(null);
      setDishName(item.name);
      setDishCategory(item.category);
      setDishPrice(item.price);
      setDishDiscountedPrice(item.discountedPrice);
      setDishDescription(item.description);
      setDishIsVeg(true); // Always strictly veg for portal
      setDishIsBestSeller(item.isBestseller || false);
      setDishIsMustTry(item.isMustTry || false);
      setDishAvailable(item.available !== false);
      setDishImageUrl(item.imageUrl || '');
    } else {
      setEditingItem(item as FoodCourtItem);
      setEditingRestoItem(null);
      setDishName(item.name);
      setDishCategory(item.category);
      setDishPrice(item.price);
      setDishPrepMins(item.basePrepMins);
      setDishDescription(item.description);
      setDishIsVeg(item.isVeg);
      setDishCalories(item.calories || 350);
      setDishAllergens(item.allergens || []);
      setDishIsBestSeller(item.isBestSeller || false);
      setDishAvailable(item.available);
      setDishImageUrl('');
    }
    setIsAddDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    if (isNearbyRestoPartner) {
      if (editingRestoItem) {
        updateNearbyRestoItem({
          ...editingRestoItem,
          name: dishName.trim(),
          category: dishCategory,
          price: Number(dishPrice) || 50,
          discountedPrice: dishDiscountedPrice ? Number(dishDiscountedPrice) : undefined,
          description: dishDescription.trim(),
          isVeg: true, // Strictly veg
          isBestseller: dishIsBestSeller,
          isMustTry: dishIsMustTry,
          available: dishAvailable,
          imageUrl: dishImageUrl.trim() || undefined
        });
      } else {
        addNearbyRestoItem({
          restoId: currentResto.id,
          restoName: currentResto.name,
          name: dishName.trim(),
          category: dishCategory,
          price: Number(dishPrice) || 50,
          discountedPrice: dishDiscountedPrice ? Number(dishDiscountedPrice) : undefined,
          description: dishDescription.trim(),
          isVeg: true, // Strictly veg
          isBestseller: dishIsBestSeller,
          isMustTry: dishIsMustTry,
          available: dishAvailable,
          imageUrl: dishImageUrl.trim() || undefined
        });
      }
    } else {
      if (editingItem) {
        updateFoodCourtItem({
          ...editingItem,
          name: dishName.trim(),
          category: dishCategory as FoodCourtItem['category'],
          price: Number(dishPrice) || 50,
          basePrepMins: Number(dishPrepMins) || 5,
          description: dishDescription.trim(),
          isVeg: dishIsVeg,
          calories: Number(dishCalories) || 300,
          allergens: dishAllergens,
          isBestSeller: dishIsBestSeller,
          available: dishAvailable
        });
      } else {
        addFoodCourtItem({
          stallId: currentStall.id,
          stallName: currentStall.name,
          name: dishName.trim(),
          category: dishCategory as FoodCourtItem['category'],
          price: Number(dishPrice) || 50,
          basePrepMins: Number(dishPrepMins) || 5,
          description: dishDescription.trim(),
          isVeg: dishIsVeg,
          calories: Number(dishCalories) || 300,
          allergens: dishAllergens,
          isBestSeller: dishIsBestSeller,
          available: dishAvailable
        });
      }
    }

    setIsAddDishModalOpen(false);
  };

  const handleSaveOperations = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNearbyRestoPartner) {
      updateNearbyRestaurantDetails(currentResto.id, {
        deliveryTime: restoDeliveryTime.trim(),
        studentDiscount: restoDiscountOffer.trim(),
        tagline: restoTagline.trim(),
        famousFor: restoSpecialty.trim(),
        phone: restoPhone.trim(),
        address: restoAddress.trim()
      });
    } else {
      updateFoodCourtStallDetails(currentStall.id, {
        tagline: stallNotice.trim(),
        openingHours: stallOpeningHours.trim()
      });
    }
    setIsNoticeSaved(true);
    setTimeout(() => setIsNoticeSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP PARTNER CONTROL BANNER */}
      <section className="glassmorphism-card rounded-3xl p-5 sm:p-7 border border-white/90 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          {/* Left: Outlet Identity & Universal Switcher */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-white/40 shrink-0">
              {isNearbyRestoPartner ? (
                <Store className="w-7 h-7 text-white" />
              ) : (
                <Store className="w-7 h-7 text-white" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold">
                  {isNearbyRestoPartner ? 'PARTNER RESTAURANT' : currentStall.stallNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#ea580c] text-[11px] font-extrabold border border-orange-300">
                  {isNearbyRestoPartner ? currentResto.cuisine.split(',')[0] : currentStall.cuisine}
                </span>
                {isNearbyRestoPartner ? (
                  currentResto.isOpen ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>OPEN FOR DELIVERY</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-800 text-[11px] font-extrabold border border-red-300">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>CLOSED / BREAK</span>
                    </span>
                  )
                ) : (
                  currentStall.isOpen ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>OPEN FOR ORDERS</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-800 text-[11px] font-extrabold border border-red-300">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>CLOSED / ON BREAK</span>
                    </span>
                  )
                )}

                {/* Pure Veg or Portal Veg Tag */}
                {isNearbyRestoPartner && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    currentResto.isPureVeg
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}>
                    {currentResto.isPureVeg ? '100% Pure Veg Kitchen' : 'Strict Veg-Only Portal Menu'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isNearbyRestoPartner ? currentResto.name : currentStall.name}
                </h1>
                
                {/* Switcher Dropdown */}
                <select
                  value={isNearbyRestoPartner ? currentResto.id : currentStall.id}
                  onChange={(e) => switchVendorStall(e.target.value)}
                  className="text-xs font-bold text-[#ea580c] bg-orange-50/90 hover:bg-orange-100/90 border border-orange-300 rounded-full px-3 py-1 cursor-pointer focus:outline-none transition-colors shadow-xs"
                  title="Switch Vendor / Restaurant Outlet"
                >
                  <optgroup label="Famous Nearby Restaurants & Franchises">
                    {nearbyRestaurants.map((resto) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Campus Food Court Stalls">
                    {foodCourtStalls.map((stall) => (
                      <option key={stall.id} value={stall.id}>
                        {stall.stallNumber}: {stall.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{isNearbyRestoPartner ? currentResto.address : currentStall.location}</span>
                {isNearbyRestoPartner && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-800">ETA: {currentResto.deliveryTime}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Open / Close Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (isNearbyRestoPartner) {
                  updateNearbyRestaurantDetails(currentResto.id, { isOpen: !currentResto.isOpen });
                } else {
                  updateFoodCourtStallDetails(currentStall.id, { isOpen: !currentStall.isOpen });
                }
              }}
              className={`px-4 py-2.5 rounded-full font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs border ${
                (isNearbyRestoPartner ? currentResto.isOpen : currentStall.isOpen)
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>
                {(isNearbyRestoPartner ? currentResto.isOpen : currentStall.isOpen)
                  ? 'Pause / Close Counter'
                  : 'Open Counter for Orders'}
              </span>
            </button>

            {/* Helpline Contact Info */}
            <a
              href={`tel:${isNearbyRestoPartner ? currentResto.phone.replace(/[^0-9]/g, '') : '9335568951'}`}
              className="px-3.5 py-2 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500/25 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">{isNearbyRestoPartner ? currentResto.phone : '+91 9335568951'}</span>
            </a>
          </div>
        </div>

        {/* Live Broadcast / Famous For Highlight */}
        <div className="mt-4 pt-3 border-t border-orange-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <Sparkle className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
            <span className="font-bold text-slate-900">
              {isNearbyRestoPartner ? 'Famous For Specialty:' : 'Current Student Broadcast:'}
            </span>
            <span className="italic text-slate-700 font-medium">
              "{isNearbyRestoPartner ? (currentResto.famousFor || currentResto.specialty) : currentStall.tagline}"
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubTab('operations')}
            className="text-[#ea580c] font-bold text-[11px] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Edit Settings &rarr;
          </button>
        </div>
      </section>

      {/* 2. DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setActiveSubTab('menu');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'menu'
              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 border border-orange-200/60 hover:bg-white'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu &amp; Dish Catalog</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
            {activeMenuItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setActiveSubTab('orders');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'orders'
              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 border border-orange-200/60 hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Live Orders Tracker</span>
          {activeOrders.filter((o: any) => o.status !== 'Completed' && o.status !== 'Delivered' && o.status !== 'Cancelled').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] animate-pulse">
              {activeOrders.filter((o: any) => o.status !== 'Completed' && o.status !== 'Delivered' && o.status !== 'Cancelled').length} Active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setActiveSubTab('operations');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'operations'
              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 border border-orange-200/60 hover:bg-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Operations &amp; Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setActiveSubTab('analytics');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'analytics'
              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 border border-orange-200/60 hover:bg-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sales &amp; Analytics</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: MENU & DISH CATALOG
          ========================================================================= */}
      {activeSubTab === 'menu' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="glassmorphism-card rounded-3xl p-4 sm:p-5 border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                placeholder={`Search dishes in ${isNearbyRestoPartner ? currentResto.name : currentStall.name}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-orange-200/80 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff7a30] transition-all shadow-xs"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMenuSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action: Add New Dish Button */}
            <div className="flex items-center space-x-2.5">
              <ChromeButton
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-extrabold text-xs shadow-md shadow-orange-500/25 border border-white/30 flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add New Veg Dish</span>
              </ChromeButton>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedMenuCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMenuCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200/80'
                }`}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item: any) => (
              <div
                key={item.id}
                className={`glassmorphism-card rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  item.available !== false
                    ? 'border-white/90 bg-white/80 shadow-sm hover:shadow-md'
                    : 'border-slate-200 bg-slate-100/70 opacity-75'
                }`}
              >
                <div>
                  {/* Item Header & Availability Switch */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-600 flex items-center justify-center"
                        title="100% Pure Vegetarian Dish"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* In Stock / Sold Out Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isNearbyRestoPartner) {
                          toggleNearbyRestoItemAvailability(item.id);
                        } else {
                          toggleFoodCourtItemAvailability(item.id);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer border ${
                        item.available !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                      title={item.available !== false ? 'Click to mark as Sold Out' : 'Click to mark as In Stock'}
                    >
                      {item.available !== false ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-rose-600" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Dish Name & Price */}
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {item.name}
                    </h3>
                    <div className="text-right shrink-0">
                      {item.discountedPrice ? (
                        <div>
                          <span className="font-black text-emerald-700 font-mono text-base">
                            ₹{item.discountedPrice}
                          </span>
                          <span className="text-xs text-slate-400 line-through ml-1.5 font-mono">
                            ₹{item.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-black text-slate-900 font-mono text-base">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {item.isBestseller && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] font-bold border border-amber-200 flex items-center space-x-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Bestseller</span>
                      </span>
                    )}
                    {item.isMustTry && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 font-mono text-[10px] font-bold border border-orange-200">
                        Must Try
                      </span>
                    )}
                    {item.basePrepMins && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        ~{item.basePrepMins} mins
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Edit / Delete */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-500 font-mono">
                    {item.id}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-[#ea580c] text-slate-600 transition-colors cursor-pointer"
                      title="Edit Dish Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${item.name}" from your menu?`)) {
                          if (isNearbyRestoPartner) {
                            deleteNearbyRestoItem(item.id);
                          } else {
                            deleteFoodCourtItem(item.id);
                          }
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: LIVE ORDERS TRACKER
          ========================================================================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="glassmorphism-card rounded-3xl p-4 sm:p-5 border border-white/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                placeholder="Search by Order #, Student Name, Room..."
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30] w-full sm:w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              {(['all', 'active', 'Ready', 'Completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOrderStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    orderStatusFilter === filter
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'All Orders' : filter}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="glassmorphism-card rounded-3xl p-10 text-center border border-white/90">
              <Receipt className="w-12 h-12 mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-slate-800">No Orders Found</h3>
              <p className="text-xs text-slate-500 mt-1">There are currently no orders matching your status filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order: any) => {
                const orderId = order.id;
                const status = order.status;
                return (
                  <div
                    key={orderId}
                    className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm space-y-3 bg-white/90"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-orange-600">
                          {order.tokenNumber || order.orderNumber}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {order.studentName} ({order.studentRollNo || order.studentId})
                        </h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.deliveryHostel ? `${order.deliveryHostel}, Room ${order.deliveryRoom}` : 'Counter Pickup'}</span>
                          <span>•</span>
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.contactPhone || order.phoneNumber}</span>
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        status === 'Completed' || status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {status}
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100/70 space-y-1.5 text-xs">
                      {order.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-slate-800">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                            <span className="font-semibold">{it.quantity}x {it.name}</span>
                          </span>
                          <span className="font-mono font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-orange-200/60 flex justify-between font-bold text-slate-900">
                        <span>Total ({order.paymentMethod || 'UPI'})</span>
                        <span className="font-mono text-sm text-emerald-700">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Status Updaters */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Update Status:</span>
                      {isNearbyRestoPartner ? (
                        (['Received', 'Confirmed', 'Cooking', 'Out for Delivery', 'Delivered'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateNearbyRestoOrderStatus(orderId, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              status === st
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))
                      ) : (
                        (['Placed', 'Preparing', 'Ready', 'Completed'] as FoodCourtOrderStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateFoodCourtOrderStatus(orderId, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              status === st
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: OPERATIONS & SETTINGS
          ========================================================================= */}
      {activeSubTab === 'operations' && (
        <div className="glassmorphism-card rounded-3xl p-6 border border-white/90 shadow-sm max-w-2xl mx-auto space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {isNearbyRestoPartner ? 'Restaurant Profile & Operating Settings' : 'Stall Profile & Operating Settings'}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Update delivery timings, student discounts, signature specialty, and contact details.
            </p>
          </div>

          <form onSubmit={handleSaveOperations} className="space-y-4">
            {isNearbyRestoPartner ? (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    World-Famous Specialty / What You're Famous For:
                  </label>
                  <input
                    type="text"
                    value={restoSpecialty}
                    onChange={(e) => setRestoSpecialty(e.target.value)}
                    placeholder="e.g. McSpicy Paneer Burger, Veg Maharaja Mac & Peri-Peri Fries"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Hostel Delivery Time:
                  </label>
                  <input
                    type="text"
                    value={restoDeliveryTime}
                    onChange={(e) => setRestoDeliveryTime(e.target.value)}
                    placeholder="e.g. 20-30 mins"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Student Discount Offer Banner:
                  </label>
                  <input
                    type="text"
                    value={restoDiscountOffer}
                    onChange={(e) => setRestoDiscountOffer(e.target.value)}
                    placeholder="e.g. Flat 15% Off with VERTO15 / Free item on ₹299+"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Tagline / Description:
                  </label>
                  <input
                    type="text"
                    value={restoTagline}
                    onChange={(e) => setRestoTagline(e.target.value)}
                    placeholder="Short appetizing description"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Contact Phone Number:
                  </label>
                  <input
                    type="text"
                    value={restoPhone}
                    onChange={(e) => setRestoPhone(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Store Address / Locality:
                  </label>
                  <input
                    type="text"
                    value={restoAddress}
                    onChange={(e) => setRestoAddress(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Live Broadcast Banner:
                  </label>
                  <input
                    type="text"
                    value={stallNotice}
                    onChange={(e) => setStallNotice(e.target.value)}
                    placeholder="e.g. Fresh Kathi Rolls ready!"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">
                    Operating Hours:
                  </label>
                  <input
                    type="text"
                    value={stallOpeningHours}
                    onChange={(e) => setStallOpeningHours(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:00 PM"
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              </>
            )}

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs shadow-md shadow-orange-500/25 hover:from-[#ea671e] hover:to-[#ff8130] transition-all cursor-pointer"
              >
                {isNoticeSaved ? 'Settings Saved Successfully!' : 'Save Operational Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: SALES & ANALYTICS
          ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 bg-white/80">
              <span className="text-xs text-slate-500 font-bold block">Gross Revenue</span>
              <span className="text-2xl font-black font-mono text-emerald-700 mt-1 block">
                ₹{salesMetrics.totalGrossRevenue}
              </span>
            </div>
            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 bg-white/80">
              <span className="text-xs text-slate-500 font-bold block">Total Orders</span>
              <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
                {salesMetrics.totalOrders}
              </span>
            </div>
            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 bg-white/80">
              <span className="text-xs text-slate-500 font-bold block">Completed</span>
              <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                {salesMetrics.completedOrders}
              </span>
            </div>
            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 bg-white/80">
              <span className="text-xs text-slate-500 font-bold block">Avg Order Value</span>
              <span className="text-2xl font-black font-mono text-orange-600 mt-1 block">
                ₹{salesMetrics.avgOrderValue}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT DISH
          ========================================================================= */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg glassmorphism-card bg-white rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-orange-200/80 flex items-center justify-between bg-orange-50/50">
              <h3 className="text-base font-black text-slate-900">
                {editingItem || editingRestoItem ? 'Edit Dish Details' : 'Add New Vegetarian Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="p-6 overflow-y-auto space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. McSpicy Paneer Burger / Paneer Tikka Sub"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">Category *</label>
                  <input
                    type="text"
                    required
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    placeholder="e.g. Burgers, Subs, Kulchas"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              </div>

              {isNearbyRestoPartner && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900">Discounted Student Price (₹ Optional)</label>
                  <input
                    type="number"
                    value={dishDiscountedPrice || ''}
                    onChange={(e) => setDishDiscountedPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 99"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900">Description</label>
                <textarea
                  rows={3}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  placeholder="Ingredients, flavors and presentation description..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900">Image URL (Optional)</label>
                <input
                  type="url"
                  value={dishImageUrl}
                  onChange={(e) => setDishImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ff7a30]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={dishIsBestSeller}
                    onChange={(e) => setDishIsBestSeller(e.target.checked)}
                    className="accent-orange-500 rounded-sm"
                  />
                  <span>Mark as Bestseller ⭐</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={dishAvailable}
                    onChange={(e) => setDishAvailable(e.target.checked)}
                    className="accent-emerald-500 rounded-sm"
                  />
                  <span>Available in Stock</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FoodCourtOwnerDashboard;
