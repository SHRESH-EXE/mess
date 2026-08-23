import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { MealType, STANDARD_ALLERGENS } from '../types/mess';
import {
  MessageSquareHeart,
  Star,
  ShieldCheck,
  Send,
  Sparkles,
  Utensils,
  Clock,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { formatTimeAmPm } from '../utils/time';

const RATING_DESCRIPTIONS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Needs Big Improvement', color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/50' },
  2: { label: 'Below Average / Bland', color: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-800/50' },
  3: { label: 'Decent / Standard Taste', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/50' },
  4: { label: 'Very Tasty & Fresh', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/50' },
  5: { label: 'Outstanding Chef Perfection!', color: 'text-teal-300', bg: 'bg-teal-950/40 border-teal-800/50' }
};

interface AnonymousFeedbackFormProps {
  initialSlot?: MealType;
  initialDish?: string;
  onSuccess?: () => void;
}

export const AnonymousFeedbackForm: React.FC<AnonymousFeedbackFormProps> = ({
  initialSlot = 'lunch',
  initialDish = '',
  onSuccess
}) => {
  const { weeklyMenu, selectedDay, anonymousFeedbacks, submitAnonymousFeedback } = useMess();

  const [selectedSlot, setSelectedSlot] = useState<MealType>(initialSlot);
  const [selectedDish, setSelectedDish] = useState<string>(initialDish);
  const [customDish, setCustomDish] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [filterSlot, setFilterSlot] = useState<string>('all');

  const dayMenu = weeklyMenu[selectedDay] || weeklyMenu['Monday'];
  const currentSlotDishes = dayMenu?.meals[selectedSlot]?.dishes || [];

  const handleSlotChange = (slot: MealType) => {
    setSelectedSlot(slot);
    setSelectedDish('');
    setCustomDish('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDishName = selectedDish === '__other__' ? customDish.trim() : (selectedDish || currentSlotDishes[0]?.name || 'Meal General');
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

  const resetForm = () => {
    setSubmitted(false);
    setComment('');
    setSelectedDish('');
    setCustomDish('');
    setRating(5);
  };

  const filteredFeedbacks = anonymousFeedbacks.filter(f => {
    if (filterSlot === 'all') return true;
    return f.mealSlot === filterSlot;
  });

  return (
    <div id="anonymous-feedback-section" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-700/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Anonymous & Identity-Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rate Today's Campus Meals
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Review Submitted Anonymously!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for keeping our mess accountable. Your rating has been added to the public campus dashboard.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-lg"
                  >
                    Rate Another Dish
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Meal Slot Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    1. Select Meal Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotChange(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                            isSelected
                              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dish Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    2. Choose Dish / Item
                  </label>
                  <div className="space-y-2">
                    <select
                      value={selectedDish}
                      onChange={(e) => setSelectedDish(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">-- Choose from today's {selectedSlot} menu --</option>
                      {currentSlotDishes.map((dish) => (
                        <option key={dish.id} value={dish.name}>
                          {dish.name}
                        </option>
                      ))}
                      <option value="__other__">Other (Type custom item)</option>
                    </select>

                    {selectedDish === '__other__' && (
                      <input
                        type="text"
                        placeholder="Enter dish or item name..."
                        value={customDish}
                        onChange={(e) => setCustomDish(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    )}
                  </div>
                </div>

                {/* 3. Star Rating */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    3. Star Rating & Experience
                  </label>
                  <div className="flex items-center space-x-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                          title={`Rate ${star} Stars`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Rating Label badge */}
                  {RATING_DESCRIPTIONS[hoverRating || rating] && (
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${RATING_DESCRIPTIONS[hoverRating || rating].bg} ${RATING_DESCRIPTIONS[hoverRating || rating].color}`}>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>{RATING_DESCRIPTIONS[hoverRating || rating].label}</span>
                    </div>
                  )}
                </div>

                {/* 4. Constructive Comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    4. Comments & Suggestions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell the chef about taste, spice, oiliness, warmth, or portion sizes..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/20 active:scale-98 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Anonymous Review</span>
                </button>

              </form>
            )}
          </div>
        </div>

        {/* Live Campus Feed Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-teal-400" />
              <span>Campus Reviews Stream ({filteredFeedbacks.length})</span>
            </h3>

            {/* Filter */}
            <select
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No reviews yet for this filter. Be the first to rate!
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 transition-all space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {fb.mealSlot}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {fb.dishName}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < fb.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {fb.comment && (
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                      "{fb.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>{fb.timestamp}</span>
                    <span className="text-teal-400/80">✓ Verified Dining Token</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
