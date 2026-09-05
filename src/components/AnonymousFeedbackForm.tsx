import React, { useState, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import { MealType, FoodCourtFeedbackCategory } from '../types/mess';
import ChromeButton from './ui/chrome-button';
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle2,
  Store,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
  Clock,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';

interface AnonymousFeedbackFormProps {
  initialSlot?: MealType;
  initialDish?: string;
  initialStallId?: string;
  initialFoodCourtDish?: string;
  onSuccess?: () => void;
}

export const AnonymousFeedbackForm: React.FC<AnonymousFeedbackFormProps> = ({
  initialSlot = 'lunch',
  initialDish = '',
  initialStallId,
  initialFoodCourtDish = '',
  onSuccess
}) => {
  const {
    currentSession,
    currentStudent,
    weeklyMenu,
    selectedDay,
    anonymousFeedbacks,
    submitAnonymousFeedback,
    foodCourtStalls,
    foodCourtMenuItems,
    foodCourtOrders,
    foodCourtFeedbacks,
    submitFoodCourtFeedback
  } = useMess();

  // Top Mode: Mess Feedback vs Food Court Feedback
  const [feedbackMode, setFeedbackMode] = useState<'mess' | 'foodcourt'>(
    initialStallId || initialFoodCourtDish ? 'foodcourt' : 'mess'
  );

  // Mess Form State
  const [selectedSlot, setSelectedSlot] = useState<MealType>(initialSlot);
  const [selectedDish, setSelectedDish] = useState<string>(initialDish);
  const [customDish, setCustomDish] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [filterSlot, setFilterSlot] = useState<string>('all');

  // Food Court Feedback Form State
  const [fcStallId, setFcStallId] = useState<string>(
    initialStallId || (foodCourtStalls.length > 0 ? foodCourtStalls[0].id : 'stall-rolls')
  );
  const [fcDishName, setFcDishName] = useState<string>(initialFoodCourtDish || '');
  const [fcCustomDish, setFcCustomDish] = useState<string>('');
  const [fcOverallRating, setFcOverallRating] = useState<number>(5);
  const [fcHygieneRating, setFcHygieneRating] = useState<number>(5);
  const [fcSpeedRating, setFcSpeedRating] = useState<number>(5);
  const [fcCategory, setFcCategory] = useState<FoodCourtFeedbackCategory>('Taste & Quality');
  const [fcComment, setFcComment] = useState<string>('');
  const [fcSubmitted, setFcSubmitted] = useState<boolean>(false);
  const [fcFilterStall, setFcFilterStall] = useState<string>(
    currentSession?.role === 'vendor' && currentSession?.stallId ? currentSession.stallId : 'all'
  );

  const dayMenu = weeklyMenu[selectedDay] || weeklyMenu['Monday'];
  const currentSlotDishes = dayMenu?.meals[selectedSlot]?.dishes || [];

  // Menu items for the selected food court stall
  const selectedStallMenuItems = useMemo(() => {
    return foodCourtMenuItems.filter(item => item.stallId === fcStallId);
  }, [foodCourtMenuItems, fcStallId]);

  // Selected stall object
  const selectedStallObj = useMemo(() => {
    return foodCourtStalls.find(s => s.id === fcStallId) || foodCourtStalls[0];
  }, [foodCourtStalls, fcStallId]);

  // Recent food court purchases by this student
  const recentPurchasedItems = useMemo(() => {
    const studentOrders = foodCourtOrders.filter(
      o => o.studentId === currentStudent.id || o.phoneNumber === currentStudent.phone
    );
    const items: { stallId: string; stallName: string; itemName: string; price: number }[] = [];
    studentOrders.slice(0, 5).forEach(ord => {
      ord.items.forEach(it => {
        if (!items.some(existing => existing.stallId === ord.stallId && existing.itemName === it.name)) {
          items.push({
            stallId: ord.stallId,
            stallName: ord.stallName,
            itemName: it.name,
            price: it.price
          });
        }
      });
    });
    return items;
  }, [foodCourtOrders, currentStudent]);

  const handleSlotChange = (slot: MealType) => {
    setSelectedSlot(slot);
    setSelectedDish('');
    setCustomDish('');
  };

  const handleMessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDishName =
      selectedDish === '__other__'
        ? customDish.trim()
        : selectedDish || currentSlotDishes[0]?.name || 'Meal General';
    if (!finalDishName) return;

    submitAnonymousFeedback({
      mealSlot: selectedSlot,
      dishName: finalDishName,
      rating,
      comment: comment.trim() || undefined
    });

    setSubmitted(true);
    if (onSuccess) {
      setTimeout(onSuccess, 1500);
    }
  };

  const handleFoodCourtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedStall = foodCourtStalls.find(s => s.id === fcStallId) || foodCourtStalls[0];
    if (!matchedStall) return;

    const finalDish =
      fcDishName === '__other__'
        ? fcCustomDish.trim()
        : fcDishName || (selectedStallMenuItems[0]?.name || 'Food from Stall');

    submitFoodCourtFeedback({
      stallId: matchedStall.id,
      stallName: matchedStall.name,
      dishName: finalDish.trim() || undefined,
      rating: fcOverallRating,
      hygieneRating: fcHygieneRating,
      speedRating: fcSpeedRating,
      comment: fcComment.trim(),
      category: fcCategory,
      sentiment: fcOverallRating >= 4 ? 'positive' : fcOverallRating === 3 ? 'neutral' : 'negative'
    });

    setFcSubmitted(true);
    if (onSuccess) {
      setTimeout(onSuccess, 1500);
    }
  };

  const resetMessForm = () => {
    setSubmitted(false);
    setComment('');
    setSelectedDish('');
    setCustomDish('');
    setRating(5);
  };

  const resetFcForm = () => {
    setFcSubmitted(false);
    setFcComment('');
    setFcDishName('');
    setFcCustomDish('');
    setFcOverallRating(5);
    setFcHygieneRating(5);
    setFcSpeedRating(5);
  };

  const filteredMessFeedbacks = anonymousFeedbacks.filter(f => {
    if (filterSlot === 'all') return true;
    return f.mealSlot === filterSlot;
  });

  // Food court feedback visible stream
  const filteredFcFeedbacks = foodCourtFeedbacks.filter(f => {
    // If logged in as vendor, restrict strictly to their stall
    if (currentSession?.role === 'vendor' && currentSession?.stallId) {
      return f.stallId === currentSession.stallId;
    }
    if (fcFilterStall === 'all') return true;
    return f.stallId === fcFilterStall;
  });

  return (
    <div id="anonymous-feedback-section" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-white/60 backdrop-blur-3xl border border-white/80 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)]">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Student Anonymous Voice
            </span>
            <span className="flex items-center space-x-1 text-xs text-emerald-800 font-bold bg-emerald-500/15 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Identity Protected</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            Rate Campus Dining &amp; Food Court
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Provide honest, anonymous reviews for hostel mess meals and food court stalls. Stalls and mess authorities act on suggestions daily.
          </p>
        </div>

        {/* Tab Selector: Mess vs Food Court */}
        <div className="relative z-10 mt-6 pt-4 border-t border-orange-200/60 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setFeedbackMode('mess')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              feedbackMode === 'mess'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-orange-200/70'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Hostel Mess Meals</span>
          </button>

          <button
            type="button"
            onClick={() => setFeedbackMode('foodcourt')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              feedbackMode === 'foodcourt'
                ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-orange-200/70'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Food Court Stalls</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          VIEW A: HOSTEL MESS FEEDBACK FORM & FEED
          ========================================================= */}
      {feedbackMode === 'mess' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] border border-white/90 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)]">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Thank You!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your anonymous review has been recorded. It helps the catering warden and chef fine-tune today's meal preparations.
                  </p>
                  <button
                    type="button"
                    onClick={resetMessForm}
                    className="px-5 py-2 rounded-full bg-[#ff7a30] hover:bg-[#ea671e] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Rate Another Dish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMessSubmit} className="space-y-6">
                  {/* 1. Meal Slot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      1. Select Meal Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotChange(slot)}
                          className={`py-2.5 px-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer text-center border ${
                            selectedSlot === slot
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Select Dish */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      2. Select Dish to Review
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentSlotDishes.map((dish) => (
                        <button
                          key={dish.id}
                          type="button"
                          onClick={() => {
                            setSelectedDish(dish.name);
                            setCustomDish('');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            selectedDish === dish.name
                              ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                              : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                          }`}
                        >
                          {dish.name}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedDish('__other__')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          selectedDish === '__other__'
                            ? 'bg-[#ea580c] text-white border-[#ea580c]'
                            : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                        }`}
                      >
                        + Other / General
                      </button>
                    </div>

                    {selectedDish === '__other__' && (
                      <input
                        type="text"
                        placeholder="Type dish or meal aspect..."
                        value={customDish}
                        onChange={(e) => setCustomDish(e.target.value)}
                        className="w-full mt-2 p-3 rounded-2xl bg-white border border-orange-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#ff7a30]"
                      />
                    )}
                  </div>

                  {/* 3. Star Rating */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      3. Overall Rating: <span className="text-[#ea580c] font-black">{rating} Stars</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating ?? rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                isFilled
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Constructive Comment */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      4. Constructive Comments (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell the chef about taste, spice, oiliness, warmth, or portion sizes..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white/80 border border-orange-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
                    />
                  </div>

                  {/* Submit CTA */}
                  <ChromeButton
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 border border-white/20 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Anonymous Mess Review</span>
                  </ChromeButton>
                </form>
              )}
            </div>
          </div>

          {/* Live Campus Feed Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquareHeart className="w-4 h-4 text-orange-600" />
                <span>Mess Reviews Stream ({filteredMessFeedbacks.length})</span>
              </h3>

              <select
                value={filterSlot}
                onChange={(e) => setFilterSlot(e.target.value)}
                className="bg-white/80 border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none shadow-xs cursor-pointer"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">Snacks</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredMessFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white/60 hover:bg-white/80 border border-white/90 backdrop-blur-xl rounded-[26px] p-5 transition-all space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-orange-500/15 text-orange-700 border border-orange-200">
                        {fb.mealSlot}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                        {fb.dishName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < fb.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {fb.comment && (
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-orange-50/40 p-3 rounded-2xl border border-orange-100">
                      "{fb.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>{fb.timestamp}</span>
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Dining Token</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW B: FOOD COURT STALLS FEEDBACK FORM & FEED
          ========================================================= */}
      {feedbackMode === 'foodcourt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] border border-white/90 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)]">
              {fcSubmitted ? (
                <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Food Rating Sent to {selectedStallObj?.name || 'Stall Owner'}!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your rating and review has been linked to the food item and routed directly to the food court stall owner console.
                  </p>
                  <button
                    type="button"
                    onClick={resetFcForm}
                    className="px-5 py-2 rounded-full bg-[#ff7a30] hover:bg-[#ea671e] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Rate Another Food Item
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFoodCourtSubmit} className="space-y-5">
                  {/* Quick Pill for Recently Purchased Food */}
                  {recentPurchasedItems.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/80 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-black text-slate-900">
                        <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                        <span>Quick Rate Your Recent Food Court Purchases:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentPurchasedItems.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFcStallId(item.stallId);
                              setFcDishName(item.itemName);
                              setFcCustomDish('');
                            }}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                              fcStallId === item.stallId && fcDishName === item.itemName
                                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                                : 'bg-white/90 text-slate-800 border-orange-200 hover:bg-white'
                            }`}
                          >
                            <span>{item.itemName}</span>
                            <span className="opacity-75 font-mono text-[10px]">({item.stallName})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1. Pick Food Court Stall */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      1. Select Food Court Stall *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {foodCourtStalls.map((stall) => (
                        <button
                          key={stall.id}
                          type="button"
                          onClick={() => {
                            setFcStallId(stall.id);
                            setFcDishName('');
                            setFcCustomDish('');
                          }}
                          className={`p-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer text-left border ${
                            fcStallId === stall.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                          }`}
                        >
                          <div className="font-mono text-[10px] opacity-75">{stall.stallNumber}</div>
                          <div className="truncate font-black">{stall.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Select Dish From Selected Stall */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      2. Food / Dish Bought from {selectedStallObj?.name || 'this Stall'} *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedStallMenuItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setFcDishName(item.name);
                            setFcCustomDish('');
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            fcDishName === item.name
                              ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                              : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                          }`}
                        >
                          <span>{item.name}</span>
                          <span className="ml-1 opacity-80 font-mono text-[10px]">₹{item.price}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFcDishName('__other__')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          fcDishName === '__other__'
                            ? 'bg-[#ea580c] text-white border-[#ea580c]'
                            : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                        }`}
                      >
                        + Other Dish / Item
                      </button>
                    </div>

                    {fcDishName === '__other__' && (
                      <input
                        type="text"
                        placeholder="Type food item name bought from this stall..."
                        value={fcCustomDish}
                        onChange={(e) => setFcCustomDish(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-2xl bg-white border border-orange-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#ff7a30] shadow-xs"
                      />
                    )}
                  </div>

                  {/* 3. Feedback Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      3. Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          'Taste & Quality',
                          'Hygiene & Cleanliness',
                          'Speed & Waiting Time',
                          'Portion & Pricing',
                          'General Suggestion'
                        ] as FoodCourtFeedbackCategory[]
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFcCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            fcCategory === cat
                              ? 'bg-[#ea580c] text-white border-[#ea580c]'
                              : 'bg-white/80 text-slate-700 hover:bg-white border-orange-200/80'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Three-Aspect Rating System */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80">
                    <div>
                      <div className="text-[11px] font-bold text-slate-700 mb-1">
                        Food Taste &amp; Quality: <strong className="text-[#ea580c]">{fcOverallRating} / 5</strong>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFcOverallRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= fcOverallRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-700 mb-1">
                        Hygiene &amp; Cleanliness: <strong className="text-[#ea580c]">{fcHygieneRating} / 5</strong>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFcHygieneRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= fcHygieneRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-700 mb-1">
                        Speed &amp; Service: <strong className="text-[#ea580c]">{fcSpeedRating} / 5</strong>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFcSpeedRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= fcSpeedRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5. Detailed Comment */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>5. Your Review &amp; Food Feedback *</span>
                      <span className="text-[10px] text-orange-700 font-semibold">Routed directly to {selectedStallObj?.name || 'Stall Owner'}</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={`Share your experience with the food from ${selectedStallObj?.name || 'this stall'}: freshness, taste, packing, prep time...`}
                      value={fcComment}
                      onChange={(e) => setFcComment(e.target.value)}
                      className="w-full bg-white/80 border border-orange-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
                    />
                  </div>

                  {/* Submit CTA */}
                  <ChromeButton
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 border border-white/20 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Food Rating to {selectedStallObj?.name || 'Stall Owner'}</span>
                  </ChromeButton>
                </form>
              )}
            </div>
          </div>

          {/* Live Food Court Feed Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-orange-600" />
                <span>Food Court Reviews ({filteredFcFeedbacks.length})</span>
              </h3>

              {currentSession?.role !== 'vendor' ? (
                <select
                  value={fcFilterStall}
                  onChange={(e) => setFcFilterStall(e.target.value)}
                  className="bg-white/80 border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="all">All Stalls</option>
                  {foodCourtStalls.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono">
                  {selectedStallObj?.name}
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredFcFeedbacks.length === 0 ? (
                <div className="p-8 text-center bg-white/40 rounded-3xl border border-dashed border-orange-200 text-slate-500 text-xs">
                  No food court reviews recorded for this stall yet.
                </div>
              ) : (
                filteredFcFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white/60 hover:bg-white/80 border border-white/90 backdrop-blur-xl rounded-[26px] p-5 transition-all space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-900 text-white font-mono">
                          {fb.stallName}
                        </span>
                        {fb.dishName && (
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                            {fb.dishName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < fb.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-orange-50/40 p-3 rounded-2xl border border-orange-100">
                      "{fb.comment}"
                    </p>

                    {fb.ownerNote && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 text-[11px] border border-emerald-200 space-y-0.5">
                        <div className="font-bold flex items-center space-x-1 text-emerald-900">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Owner Action:</span>
                        </div>
                        <p className="italic">"{fb.ownerNote}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>{fb.timestamp}</span>
                      <span className="text-[#ea580c] font-semibold">{fb.category}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
