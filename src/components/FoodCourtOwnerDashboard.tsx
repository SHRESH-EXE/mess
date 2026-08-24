import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import {
  FoodCourtStall,
  FoodCourtItem,
  FoodCourtOrderStatus,
  FoodCourtRushLevel,
  FoodCourtFeedback,
  FoodCourtFeedbackCategory,
  STANDARD_ALLERGENS
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
  Download
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
    updateFoodCourtOrderStatus,
    updateStallRushLevel,
    updateFoodCourtStallDetails,
    addFoodCourtItem,
    updateFoodCourtItem,
    deleteFoodCourtItem,
    toggleFoodCourtItemAvailability,
    updateFoodCourtFeedbackStatus,
    switchVendorStall
  } = useMess();

  // Active Stall determination
  const currentStallId = currentSession?.stallId || 'stall-rolls';
  const currentStall = foodCourtStalls.find(s => s.id === currentStallId) || foodCourtStalls[0];

  // Active Dashboard Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'operations' | 'orders' | 'feedback' | 'analytics'>('menu');

  // Fast Token Lookup in Orders Tab
  const [tokenSearchQuery, setTokenSearchQuery] = useState<string>('');
  const [calledTokenMessage, setCalledTokenMessage] = useState<string | null>(null);

  // Menu Search & Filter State
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodCourtItem | null>(null);

  // New / Edit Dish Form State
  const [dishName, setDishName] = useState<string>('');
  const [dishCategory, setDishCategory] = useState<FoodCourtItem['category']>('Rolls & Wraps');
  const [dishPrice, setDishPrice] = useState<number>(80);
  const [dishPrepMins, setDishPrepMins] = useState<number>(8);
  const [dishDescription, setDishDescription] = useState<string>('');
  const [dishIsVeg, setDishIsVeg] = useState<boolean>(true);
  const [dishCalories, setDishCalories] = useState<number>(350);
  const [dishAllergens, setDishAllergens] = useState<string[]>([]);
  const [dishIsBestSeller, setDishIsBestSeller] = useState<boolean>(false);
  const [dishAvailable, setDishAvailable] = useState<boolean>(true);

  // Operations Form State
  const [stallNotice, setStallNotice] = useState<string>(currentStall.tagline || '');
  const [stallOpeningHours, setStallOpeningHours] = useState<string>(currentStall.openingHours || '10:00 AM - 11:00 PM');
  const [isNoticeSaved, setIsNoticeSaved] = useState<boolean>(false);

  // Feedback Filter State
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [feedbackSentimentFilter, setFeedbackSentimentFilter] = useState<string>('all');
  const [replyingFeedbackId, setReplyingFeedbackId] = useState<string | null>(null);
  const [ownerReplyText, setOwnerReplyText] = useState<string>('');

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'active' | 'Ready' | 'Completed'>('active');

  // Items for this stall
  const stallMenuItems = useMemo(() => {
    return foodCourtMenuItems.filter(item => item.stallId === currentStall.id);
  }, [foodCourtMenuItems, currentStall.id]);

  // Categories present in this stall's menu
  const stallCategories = useMemo(() => {
    const cats = Array.from(new Set(stallMenuItems.map(i => i.category)));
    return ['all', ...cats];
  }, [stallMenuItems]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return stallMenuItems.filter(item => {
      const matchesCategory = selectedMenuCategory === 'all' || item.category === selectedMenuCategory;
      const matchesSearch =
        !menuSearchQuery ||
        item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stallMenuItems, selectedMenuCategory, menuSearchQuery]);

  // Orders for this stall
  const stallOrders = useMemo(() => {
    return foodCourtOrders.filter(o => o.stallId === currentStall.id);
  }, [foodCourtOrders, currentStall.id]);

  const filteredOrders = useMemo(() => {
    return stallOrders.filter(o => {
      const matchStatus =
        orderStatusFilter === 'all'
          ? true
          : orderStatusFilter === 'active'
          ? o.status === 'Placed' || o.status === 'Preparing'
          : orderStatusFilter === 'Ready'
          ? o.status === 'Ready'
          : orderStatusFilter === 'Completed'
          ? o.status === 'Completed'
          : true;

      const q = tokenSearchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        o.tokenNumber.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        o.phoneNumber.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q));

      return matchStatus && matchQuery;
    });
  }, [stallOrders, orderStatusFilter, tokenSearchQuery]);

  // Feedbacks for this stall
  const stallFeedbacks = useMemo(() => {
    return foodCourtFeedbacks.filter(f => f.stallId === currentStall.id);
  }, [foodCourtFeedbacks, currentStall.id]);

  // Sales & Analytics for this stall
  const salesMetrics = useMemo(() => {
    const totalOrders = stallOrders.length;
    const completedOrders = stallOrders.filter(o => o.status === 'Completed').length;
    const activeOrders = stallOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length;
    const readyOrders = stallOrders.filter(o => o.status === 'Ready').length;
    const totalGrossRevenue = stallOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalGrossRevenue / totalOrders) : 0;

    // Item popularity ranking
    const itemCounts: { [name: string]: { name: string; quantity: number; revenue: number; category: string } } = {};
    stallOrders.forEach(order => {
      order.items.forEach(it => {
        if (!itemCounts[it.name]) {
          const menuItem = foodCourtMenuItems.find(m => m.id === it.itemId || m.name === it.name);
          itemCounts[it.name] = { name: it.name, quantity: 0, revenue: 0, category: menuItem?.category || 'Special' };
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
      activeOrders,
      readyOrders,
      totalGrossRevenue,
      avgOrderValue,
      topSellingDishes
    };
  }, [stallOrders]);

  const filteredFeedbacks = useMemo(() => {
    return stallFeedbacks.filter(f => {
      const matchCat = feedbackCategoryFilter === 'all' || f.category === feedbackCategoryFilter;
      const matchSent = feedbackSentimentFilter === 'all' || f.sentiment === feedbackSentimentFilter;
      return matchCat && matchSent;
    });
  }, [stallFeedbacks, feedbackCategoryFilter, feedbackSentimentFilter]);

  // Feedback Metrics Calculation
  const feedbackMetrics = useMemo(() => {
    if (stallFeedbacks.length === 0) {
      return {
        avgRating: 4.8,
        avgHygiene: 4.7,
        avgSpeed: 4.5,
        total: 0,
        positivePct: 92,
        neutralPct: 6,
        criticalPct: 2
      };
    }
    const total = stallFeedbacks.length;
    const sumOverall = stallFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    const sumHygiene = stallFeedbacks.reduce((acc, f) => acc + (f.hygieneRating || f.rating), 0);
    const sumSpeed = stallFeedbacks.reduce((acc, f) => acc + (f.speedRating || f.rating), 0);
    const positiveCount = stallFeedbacks.filter(f => f.rating >= 4).length;
    const neutralCount = stallFeedbacks.filter(f => f.rating === 3).length;
    const criticalCount = stallFeedbacks.filter(f => f.rating <= 2).length;

    return {
      avgRating: (sumOverall / total).toFixed(1),
      avgHygiene: (sumHygiene / total).toFixed(1),
      avgSpeed: (sumSpeed / total).toFixed(1),
      total,
      positivePct: Math.round((positiveCount / total) * 100),
      neutralPct: Math.round((neutralCount / total) * 100),
      criticalPct: Math.round((criticalCount / total) * 100)
    };
  }, [stallFeedbacks]);

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    soundEffects.playTap();
    setEditingItem(null);
    setDishName('');
    setDishCategory('Rolls & Wraps');
    setDishPrice(90);
    setDishPrepMins(8);
    setDishDescription('');
    setDishIsVeg(true);
    setDishCalories(380);
    setDishAllergens([]);
    setDishIsBestSeller(false);
    setDishAvailable(true);
    setIsAddDishModalOpen(true);
  };

  const handleOpenEditModal = (item: FoodCourtItem) => {
    soundEffects.playTap();
    setEditingItem(item);
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
    setIsAddDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    if (editingItem) {
      updateFoodCourtItem({
        ...editingItem,
        name: dishName.trim(),
        category: dishCategory,
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
        category: dishCategory,
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

    setIsAddDishModalOpen(false);
  };

  const handleSaveStallNotice = (e: React.FormEvent) => {
    e.preventDefault();
    updateFoodCourtStallDetails(currentStall.id, {
      tagline: stallNotice.trim(),
      openingHours: stallOpeningHours.trim()
    });
    setIsNoticeSaved(true);
    setTimeout(() => setIsNoticeSaved(false), 2500);
  };

  const handleToggleAllergen = (allergen: string) => {
    setDishAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP STALL CONTROL BANNER (Liquid Glassmorphism) */}
      <section className="glassmorphism-card rounded-3xl p-5 sm:p-7 border border-white/90 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          {/* Left: Stall Identity & Stall Switcher */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-white/40 shrink-0">
              <Store className="w-7 h-7 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold">
                  {currentStall.stallNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#ea580c] text-[11px] font-extrabold border border-orange-300">
                  {currentStall.cuisine}
                </span>
                {currentStall.isOpen ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>OPEN FOR ORDERS</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-800 text-[11px] font-extrabold border border-red-300">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>CLOSED / ON BREAK</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentStall.name}
                </h1>
                
                {/* Stall Switcher Dropdown (for Multi-Stall Owners) */}
                <select
                  value={currentStall.id}
                  onChange={(e) => switchVendorStall(e.target.value)}
                  className="text-xs font-bold text-[#ea580c] bg-orange-50/80 hover:bg-orange-100/80 border border-orange-300 rounded-full px-3 py-1 cursor-pointer focus:outline-none transition-colors"
                  title="Switch Food Court Stall"
                >
                  {foodCourtStalls.map((stall) => (
                    <option key={stall.id} value={stall.id}>
                      Switch to: {stall.name} ({stall.stallNumber})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {currentStall.location} • Hours: <span className="font-semibold text-slate-800">{currentStall.openingHours}</span>
              </p>
            </div>
          </div>

          {/* Right: Live Stall Operations Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Open / Close Toggle Button */}
            <button
              type="button"
              onClick={() => {
                updateFoodCourtStallDetails(currentStall.id, { isOpen: !currentStall.isOpen });
              }}
              className={`px-4 py-2.5 rounded-full font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs border ${
                currentStall.isOpen
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{currentStall.isOpen ? 'Pause / Close Counter' : 'Open Stall Counter'}</span>
            </button>

            {/* Live Rush Level Quick Select */}
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-orange-200/80 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2">Rush:</span>
              {(['Low', 'Moderate', 'High', 'Peak'] as FoodCourtRushLevel[]).map((rush) => {
                const isSelected = currentStall.rushLevel === rush;
                return (
                  <button
                    key={rush}
                    type="button"
                    onClick={() => updateStallRushLevel(currentStall.id, rush)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? rush === 'Peak'
                          ? 'bg-red-600 text-white shadow-xs'
                          : rush === 'High'
                          ? 'bg-orange-500 text-white shadow-xs'
                          : rush === 'Moderate'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {rush}
                  </button>
                );
              })}
            </div>

            {/* Helpline Contact Info */}
            <a
              href="tel:9335568951"
              className="px-3.5 py-2 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500/25 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">+91 9335568951</span>
            </a>
          </div>
        </div>

        {/* Live Marquee Notice Pill */}
        {currentStall.tagline && (
          <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <Sparkle className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
              <span className="font-bold text-slate-900">Current Student Broadcast:</span>
              <span className="italic text-slate-600">"{currentStall.tagline}"</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('operations')}
              className="text-[#ea580c] font-bold text-[11px] hover:underline"
            >
              Edit Broadcast &rarr;
            </button>
          </div>
        )}
      </section>

      {/* 2. DASHBOARD NAVIGATION TABS (Pills Container) */}
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
            {stallMenuItems.length}
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
          <span>Live Token Orders</span>
          {stallOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] animate-pulse">
              {stallOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length} Active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            setActiveSubTab('feedback');
          }}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'feedback'
              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 border border-white/30 scale-[1.02]'
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:text-slate-950 border border-orange-200/60 hover:bg-white'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Anonymous Student Feedback</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
            {stallFeedbacks.length}
          </span>
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
          <span>Rush &amp; Stall Settings</span>
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
          SUB-TAB 1: MENU & DISH CATALOG (Full Owner CRUD)
          ========================================================================= */}
      {activeSubTab === 'menu' && (
        <div className="space-y-5">
          {/* Controls Bar: Search, Category Filters, Add Dish Button */}
          <div className="glassmorphism-card rounded-3xl p-4 sm:p-5 border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                placeholder="Search your dishes by name or ingredients..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-orange-200/80 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff7a30] transition-all shadow-xs"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMenuSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                <span>Add New Dish</span>
              </ChromeButton>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {stallCategories.map((cat) => (
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
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className={`glassmorphism-card rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  item.available
                    ? 'border-white/90 bg-white/80 shadow-sm hover:shadow-md'
                    : 'border-slate-200 bg-slate-100/70 opacity-75'
                }`}
              >
                <div>
                  {/* Item Header & Availability Switch */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center ${
                          item.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                        title={item.isVeg ? 'Pure Veg' : 'Contains Egg / Non-Veg'}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* In Stock / Sold Out Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleFoodCourtItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer border ${
                        item.available
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                      title={item.available ? 'Click to mark as Sold Out' : 'Click to mark as Available'}
                    >
                      {item.available ? (
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
                    <span className="font-black text-slate-900 font-mono text-base shrink-0">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#ea580c] font-mono text-[10px] font-bold border border-orange-200 flex items-center space-x-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>~{item.basePrepMins} mins</span>
                    </span>
                    {item.calories && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                        {item.calories} kcal
                      </span>
                    )}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
                        {item.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Quick Actions */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    ID: <span className="font-mono text-slate-700">{item.id}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-[#ea580c]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFoodCourtItem(item.id)}
                      className="p-1.5 rounded-full bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 shadow-xs cursor-pointer transition-colors"
                      title="Delete dish from menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="glassmorphism-card rounded-3xl p-10 text-center border border-white/90">
              <UtensilsCrossed className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-900 text-base">No dishes found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 mb-4">
                No items match your search "{menuSearchQuery}". Add your first dish or clear filters.
              </p>
              <ChromeButton
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-xs"
              >
                Add New Dish
              </ChromeButton>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: LIVE TOKEN ORDERS QUEUE
          ========================================================================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-5">
          {/* Order Search & Verification Bar */}
          <div className="glassmorphism-card rounded-3xl p-4 sm:p-5 border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                placeholder="Search token # (e.g. 9482) or student name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-orange-200/80 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff7a30] transition-all shadow-xs"
              />
              {tokenSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTokenSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {onOpenScanner && (
                <ChromeButton
                  onClick={onOpenScanner}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan Student QR</span>
                </ChromeButton>
              )}
            </div>
          </div>

          {/* Called Token Broadcast Alert if any */}
          {calledTokenMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>{calledTokenMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setCalledTokenMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-extrabold text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Order Filters Header */}
          <div className="glassmorphism-card rounded-3xl p-4 sm:p-5 border border-white/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Live Kitchen Order Tokens
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Incoming student tokens placed for {currentStall.name}
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-white/80 p-1 rounded-full border border-orange-200/80">
              {(['active', 'Ready', 'Completed', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setOrderStatusFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    orderStatusFilter === filter
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter === 'active'
                    ? 'Active Orders'
                    : filter === 'Ready'
                    ? 'Ready for Pickup'
                    : filter === 'Completed'
                    ? 'Completed'
                    : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Feed */}
          <div className="space-y-3.5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm bg-white/85 hover:bg-white transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Token Number, Customer info, Items */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#ea580c] text-white font-mono font-black text-sm shadow-xs">
                      {order.tokenNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                      {order.pickupMethod === 'counter_pickup'
                        ? 'Counter Pickup'
                        : order.pickupMethod === 'dine_in'
                        ? 'Dine-In'
                        : 'Express Takeaway'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Placed at {order.placedAt}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                        order.status === 'Ready'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : order.status === 'Preparing'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : order.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="text-xs text-slate-700 flex items-center space-x-3">
                    <span className="font-bold text-slate-900">{order.studentName}</span>
                    <span className="font-mono text-slate-600">{order.phoneNumber}</span>
                    <span className="font-semibold text-slate-500">Pay: {order.paymentMethod}</span>
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-1 pt-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="text-xs text-slate-800 flex items-center space-x-2">
                        <span className="font-bold font-mono text-[#ea580c]">{it.quantity}x</span>
                        <span className="font-semibold">{it.name}</span>
                        <span className="text-slate-500 font-mono">₹{it.price * it.quantity}</span>
                        {it.customization?.spiceLevel && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-[#ea580c] font-bold">
                            {it.customization.spiceLevel}
                          </span>
                        )}
                        {it.customization?.addCheese && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                            +Cheese
                          </span>
                        )}
                        {it.customization?.jainPrep && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold">
                            Jain
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="text-[11px] text-slate-600 italic bg-orange-50/70 p-2 rounded-xl border border-orange-200">
                      Note: "{order.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Right: Total Amount & Status Transitions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-500 font-semibold">Total Amount</div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'Placed' && (
                      <button
                        type="button"
                        onClick={() => updateFoodCourtOrderStatus(order.id, 'Preparing')}
                        className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        type="button"
                        onClick={() => updateFoodCourtOrderStatus(order.id, 'Ready')}
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'Ready' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playMealTap();
                            setCalledTokenMessage(`📢 Calling Token ${order.tokenNumber} (${order.studentName}) - Ready at counter!`);
                            setTimeout(() => setCalledTokenMessage(null), 7000);
                          }}
                          className="px-3.5 py-2 rounded-full bg-orange-100 text-[#ea580c] hover:bg-orange-200 border border-orange-300 font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                          title="Broadcast counter callout"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Call Token</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateFoodCourtOrderStatus(order.id, 'Completed')}
                          className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          Order Handed Over
                        </button>
                      </>
                    )}

                    {order.status !== 'Completed' && (
                      <a
                        href={`https://wa.me/${order.targetWhatsAppNumber || '919335568951'}?text=${encodeURIComponent(
                          `*Token Update from ${currentStall.name}*:\nToken: ${order.tokenNumber}\nCustomer: ${order.studentName}\nStatus: ${order.status}\nYour order is being processed.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Send WhatsApp update to counter / customer"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="glassmorphism-card rounded-3xl p-10 text-center border border-white/90">
                <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 text-base">No token orders</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  There are no orders matching the "{orderStatusFilter}" filter for {currentStall.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: ANONYMOUS STUDENT FEEDBACK (Vendor Portal)
          ========================================================================= */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-5">
          {/* Header & Anonymity Guarantee Banner */}
          <div className="glassmorphism-card rounded-3xl p-5 sm:p-6 border border-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-900">
                    Anonymous Student Feedback for {currentStall.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Enforced student privacy: No roll numbers, names, or student IDs are ever attached or visible.
                </p>
              </div>

              {/* Overall Star Badge */}
              <div className="flex items-center space-x-4 bg-white/80 px-4 py-2 rounded-2xl border border-orange-200/80 shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900 font-mono flex items-center justify-center space-x-1">
                    <span>{feedbackMetrics.avgRating}</span>
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">
                    Stall Rating
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-left text-xs font-semibold text-slate-700">
                  <div>Hygiene: <span className="font-bold text-slate-900 font-mono">{feedbackMetrics.avgHygiene}★</span></div>
                  <div>Speed: <span className="font-bold text-slate-900 font-mono">{feedbackMetrics.avgSpeed}★</span></div>
                </div>
              </div>
            </div>

            {/* Sentiment Breakdown Bar */}
            <div className="mt-5 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-lg font-black text-emerald-900 font-mono">
                  {feedbackMetrics.positivePct}%
                </div>
                <div className="text-[11px] font-extrabold text-emerald-700">Positive (4-5★)</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-lg font-black text-amber-900 font-mono">
                  {feedbackMetrics.neutralPct}%
                </div>
                <div className="text-[11px] font-extrabold text-amber-700">Neutral (3★)</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="text-lg font-black text-rose-900 font-mono">
                  {feedbackMetrics.criticalPct}%
                </div>
                <div className="text-[11px] font-extrabold text-rose-700">Needs Attention (1-2★)</div>
              </div>
            </div>
          </div>

          {/* Feedback Category & Sentiment Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'Taste & Quality', 'Hygiene & Cleanliness', 'Speed & Waiting Time', 'Portion & Pricing', 'General Suggestion'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFeedbackCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    feedbackCategoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Feedback' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 bg-white/80 p-1 rounded-full border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Sentiment:</span>
              {(['all', 'positive', 'neutral', 'negative'] as const).map((sent) => (
                <button
                  key={sent}
                  type="button"
                  onClick={() => setFeedbackSentimentFilter(sent)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    feedbackSentimentFilter === sent
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sent === 'all' ? 'All' : sent}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Items List */}
          <div className="space-y-3.5">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm bg-white/85 hover:bg-white transition-all space-y-3"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* Stars */}
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= fb.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-extrabold">
                      {fb.category}
                    </span>

                    {fb.dishName && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] text-[11px] font-bold border border-orange-200">
                        Dish: {fb.dishName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                    <span>{fb.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        fb.status === 'Action Taken'
                          ? 'bg-emerald-100 text-emerald-900'
                          : fb.status === 'Reviewed'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  "{fb.comment}"
                </p>

                {/* Sub-ratings if present */}
                {(fb.hygieneRating || fb.speedRating) && (
                  <div className="flex items-center space-x-4 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                    {fb.hygieneRating && (
                      <span>Hygiene: <strong className="text-slate-900 font-mono">{fb.hygieneRating}★</strong></span>
                    )}
                    {fb.speedRating && (
                      <span>Speed: <strong className="text-slate-900 font-mono">{fb.speedRating}★</strong></span>
                    )}
                  </div>
                )}

                {/* Owner Resolution Note if already added */}
                {fb.ownerNote && (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-extrabold flex items-center space-x-1.5 text-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Owner Resolution &amp; Action Note:</span>
                    </div>
                    <p className="font-medium text-emerald-900 italic">"{fb.ownerNote}"</p>
                  </div>
                )}

                {/* Review Action Controls */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-bold">
                    Anonymous Reviewer #{fb.id.slice(-4)}
                  </div>

                  <div className="flex items-center space-x-2">
                    {fb.status !== 'Reviewed' && fb.status !== 'Action Taken' && (
                      <button
                        type="button"
                        onClick={() => updateFoodCourtFeedbackStatus(fb.id, 'Reviewed')}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Mark as Reviewed
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingFeedbackId(replyingFeedbackId === fb.id ? null : fb.id);
                        setOwnerReplyText(fb.ownerNote || '');
                      }}
                      className="px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ea580c] text-xs font-bold border border-orange-200 cursor-pointer transition-colors"
                    >
                      {replyingFeedbackId === fb.id ? 'Close' : fb.ownerNote ? 'Edit Action Note' : 'Add Action Note'}
                    </button>
                  </div>
                </div>

                {/* Action Note Input Dropdown */}
                {replyingFeedbackId === fb.id && (
                  <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2 mt-2">
                    <label className="block text-xs font-black text-slate-900">
                      Add Kitchen Action / Resolution Note:
                    </label>
                    <textarea
                      rows={2}
                      value={ownerReplyText}
                      onChange={(e) => setOwnerReplyText(e.target.value)}
                      placeholder="e.g. Instructed evening chef to prep double chutney batches; adjusted grill heat."
                      className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-xs text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setReplyingFeedbackId(null)}
                        className="px-3 py-1 rounded-full text-xs text-slate-600 font-bold hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateFoodCourtFeedbackStatus(fb.id, 'Action Taken', ownerReplyText.trim());
                          setReplyingFeedbackId(null);
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Save &amp; Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredFeedbacks.length === 0 && (
              <div className="glassmorphism-card rounded-3xl p-10 text-center border border-white/90">
                <MessageSquareHeart className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 text-base">No feedback found</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  No student reviews match the selected category or sentiment filter for {currentStall.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: RUSH & STALL OPERATIONS CONTROLLER
          ========================================================================= */}
      {activeSubTab === 'operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Panel 1: Live Rush & Queue Controller */}
          <div className="glassmorphism-card rounded-3xl p-6 border border-white/90 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Live Rush &amp; Queue Controller
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Adjust wait times and queue counters seen by students on the campus portal.
              </p>
            </div>

            {/* Current Rush Level Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900">
                Set Current Stall Rush Level:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Low', 'Moderate', 'High', 'Peak'] as FoodCourtRushLevel[]).map((rush) => (
                  <button
                    key={rush}
                    type="button"
                    onClick={() => updateStallRushLevel(currentStall.id, rush)}
                    className={`p-3 rounded-2xl font-extrabold text-xs border transition-all cursor-pointer text-left ${
                      currentStall.rushLevel === rush
                        ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-black text-sm">{rush}</div>
                    <div className="text-[11px] opacity-85 font-medium mt-0.5">
                      {rush === 'Low'
                        ? '0-2 in queue • ~5 min wait'
                        : rush === 'Moderate'
                        ? '3-5 in queue • ~10 min wait'
                        : rush === 'High'
                        ? '6-8 in queue • ~15 min wait'
                        : '8+ in queue • ~20+ min wait'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Queue Counter */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <label className="block text-xs font-black text-slate-900">
                Active Orders in Queue:
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => updateStallRushLevel(currentStall.id, currentStall.rushLevel, -1)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-300 font-black text-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-xs"
                >
                  -
                </button>
                <div className="px-6 py-2 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                  <span className="text-xl font-black font-mono text-slate-900">
                    {currentStall.activeQueueCount}
                  </span>
                  <span className="text-[10px] block font-bold text-slate-500">Orders</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateStallRushLevel(currentStall.id, currentStall.rushLevel, 1)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-300 font-black text-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Estimated Wait Time */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-slate-900">
                  Estimated Average Prep Time:
                </label>
                <span className="font-black text-[#ea580c] font-mono text-sm">
                  {currentStall.estimatedWaitMins} Mins
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="35"
                value={currentStall.estimatedWaitMins}
                onChange={(e) =>
                  updateFoodCourtStallDetails(currentStall.id, {
                    estimatedWaitMins: Number(e.target.value)
                  })
                }
                className="w-full accent-[#ff7a30] cursor-pointer"
              />
            </div>
          </div>

          {/* Panel 2: Live Marquee & Operating Hours Broadcast */}
          <div className="glassmorphism-card rounded-3xl p-6 border border-white/90 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Live Broadcast &amp; Operating Hours
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Publish announcements and update opening timings.
              </p>
            </div>

            <form onSubmit={handleSaveStallNotice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-900">
                  Live Marquee Banner for Students:
                </label>
                <input
                  type="text"
                  value={stallNotice}
                  onChange={(e) => setStallNotice(e.target.value)}
                  placeholder="e.g. Fresh batch of Paneer Kathi Rolls ready! 10% combo discount today."
                  className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#ff7a30] shadow-xs"
                />
                <span className="text-[11px] text-slate-500 font-medium">
                  This text appears on your stall header across the student web application.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-900">
                  Operating Hours:
                </label>
                <input
                  type="text"
                  value={stallOpeningHours}
                  onChange={(e) => setStallOpeningHours(e.target.value)}
                  placeholder="e.g. 10:30 AM - 11:30 PM"
                  className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#ff7a30] shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isNoticeSaved && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Updated successfully!</span>
                  </span>
                )}
                {!isNoticeSaved && <div />}

                <ChromeButton
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  Save Stall Info
                </ChromeButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: FINANCIALS & SALES ANALYTICS (Vendor Insights)
          ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Sales Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                <IndianRupee className="w-4 h-4 text-[#ea580c]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                ₹{salesMetrics.totalGrossRevenue}
              </div>
              <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Today's counter revenue</span>
              </p>
            </div>

            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Orders Served</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {salesMetrics.completedOrders}
              </div>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">
                out of {salesMetrics.totalOrders} total tokens
              </p>
            </div>

            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg. Ticket Value</span>
                <Receipt className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                ₹{salesMetrics.avgOrderValue}
              </div>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">
                Per student transaction
              </p>
            </div>

            <div className="glassmorphism-card rounded-3xl p-5 border border-white/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg. Prep Speed</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {currentStall.estimatedWaitMins}m
              </div>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">
                Target: &lt;10 mins
              </p>
            </div>
          </div>

          {/* Two-Column Analytics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Best-Selling Dishes Ranking */}
            <div className="glassmorphism-card rounded-3xl p-6 border border-white/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-[#ea580c]" />
                  <span>Top-Selling Menu Items</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-500">By Quantity Sold</span>
              </div>

              <div className="space-y-3 pt-1">
                {salesMetrics.topSellingDishes.map((dish, idx) => (
                  <div key={idx} className="space-y-1.5 bg-white/70 p-3 rounded-2xl border border-orange-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-orange-500/15 text-[#ea580c] flex items-center justify-center font-mono text-[10px] font-black">
                          #{idx + 1}
                        </span>
                        <span>{dish.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({dish.category})</span>
                      </div>
                      <div className="font-mono font-bold text-slate-800">
                        {dish.quantity} sold • <span className="text-[#ea580c]">₹{dish.revenue}</span>
                      </div>
                    </div>
                    {/* Progress visual */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248]"
                        style={{
                          width: `${Math.min(100, Math.max(15, (dish.quantity / (salesMetrics.topSellingDishes[0]?.quantity || 1)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                ))}

                {salesMetrics.topSellingDishes.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-6">
                    No dish sales recorded yet for today.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Stall Operational Performance & Health */}
            <div className="glassmorphism-card rounded-3xl p-6 border border-white/90 shadow-sm space-y-5">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Stall Performance &amp; Campus Rating</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Student Satisfaction</div>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1 flex items-center space-x-1">
                    <span>{feedbackMetrics.avgRating}</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    {feedbackMetrics.positivePct}% Positive feedback
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Hygiene &amp; Cleanliness</div>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1 flex items-center space-x-1">
                    <span>{feedbackMetrics.avgHygiene}</span>
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                    Verified Campus Standard
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 space-y-2">
                <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                  <span>Daily Summary Export</span>
                  <span className="font-mono text-[11px] text-[#ea580c]">{currentStall.stallNumber}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Export token logs, total receipts, item volume, and customer reviews in CSV format for counter ledger.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playTap();
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "Stall,Token,Customer,Phone,Items,Total,Status\n"
                      + stallOrders.map(o => `"${o.stallName}","${o.tokenNumber}","${o.studentName}","${o.phoneNumber}","${o.items.map(i => `${i.quantity}x ${i.name}`).join('; ')}",${o.totalAmount},"${o.status}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `${currentStall.id}_daily_report.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs border border-orange-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Download Daily Sales CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT DISH
          ========================================================================= */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg glassmorphism-card text-slate-900 rounded-3xl shadow-2xl border border-white/95 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-orange-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white font-bold shadow-md shadow-orange-500/25">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {editingItem ? 'Edit Menu Dish' : 'Add New Dish to Stall'}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {currentStall.name} ({currentStall.stallNumber})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveDish} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Dish Name */}
              <div className="space-y-1">
                <label className="block font-black text-slate-900">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Schezwan Paneer Kathi Roll"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-black text-slate-900">Category</label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                  >
                    <option value="Rolls & Wraps">Rolls &amp; Wraps</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Chai & Snacks">Chai &amp; Snacks</option>
                    <option value="Pizza & Burgers">Pizza &amp; Burgers</option>
                    <option value="Chinese & Noodles">Chinese &amp; Noodles</option>
                    <option value="Beverages & Shakes">Beverages &amp; Shakes</option>
                    <option value="Healthy Bowls">Healthy Bowls</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-black text-slate-900">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="999"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              </div>

              {/* Prep Mins & Calories */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-black text-slate-900">Prep Time (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={dishPrepMins}
                    onChange={(e) => setDishPrepMins(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-black text-slate-900">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={dishCalories}
                    onChange={(e) => setDishCalories(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-black text-slate-900">Description &amp; Ingredients</label>
                <textarea
                  rows={3}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  placeholder="Describe ingredients, cooking style, chutneys or dips included..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#ff7a30]"
                />
              </div>

              {/* Dietary Flags */}
              <div className="flex flex-wrap items-center gap-4 py-1">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsVeg}
                    onChange={(e) => setDishIsVeg(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Pure Vegetarian (Veg)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsBestSeller}
                    onChange={(e) => setDishIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                  />
                  <span>Mark as Best Seller</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishAvailable}
                    onChange={(e) => setDishAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Available in Stock</span>
                </label>
              </div>

              {/* Allergen Checkboxes */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-black text-slate-900">Tracked Allergens:</label>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_ALLERGENS.map((allergen) => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => handleToggleAllergen(allergen)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                        dishAllergens.includes(allergen)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <ChromeButton
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-extrabold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add to Stall Menu'}
                </ChromeButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
