import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { MealType } from '../types/mess';
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle2
} from 'lucide-react';
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
      <div className="relative overflow-hidden rounded-[36px] bg-white/50 backdrop-blur-3xl border border-white/80 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)]">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Student Voice
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            Rate Today's Campus Meals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Help improve mess quality, hygiene, and portion balance. Your feedback directly guides daily menu adjustments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white/55 backdrop-blur-3xl rounded-[36px] border border-white/90 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)]">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Review Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for keeping our mess accountable. Your rating has been added to the public campus dashboard.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white text-xs font-bold transition shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    Rate Another Dish
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Meal Slot Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
                          className={`py-2.5 px-3 rounded-2xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white border-white/40 shadow-md shadow-orange-500/20 scale-[1.02]'
                              : 'bg-white/60 hover:bg-white text-slate-700 border-orange-200/70'
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Choose Dish / Item
                  </label>
                  <div className="space-y-2">
                    <select
                      value={selectedDish}
                      onChange={(e) => setSelectedDish(e.target.value)}
                      className="w-full bg-white/80 border border-orange-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
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
                        className="w-full bg-white/80 border border-orange-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-orange-500 shadow-xs"
                      />
                    )}
                  </div>
                </div>

                {/* 3. Star Rating */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
                          className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                          title={`Rate ${star} Stars`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                                : 'text-slate-300'
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
                    4. Comments & Suggestions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell the chef about taste, spice, oiliness, warmth, or portion sizes..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white/80 border border-orange-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 border border-white/20 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Review</span>
                </button>

              </form>
            )}
          </div>
        </div>

        {/* Live Campus Feed Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-orange-600" />
              <span>Campus Reviews Stream ({filteredFeedbacks.length})</span>
            </h3>

            {/* Filter */}
            <select
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
              className="bg-white/80 border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none shadow-xs"
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
              <div className="p-8 text-center bg-white/40 backdrop-blur-xl rounded-[28px] border border-dashed border-orange-200 text-slate-500 text-xs">
                No reviews yet for this filter. Be the first to rate!
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
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

                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
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
                    <span className="text-emerald-700 font-semibold">✓ Verified Dining Token</span>
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
