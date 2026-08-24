import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import ChromeButton from './ui/chrome-button';
import { Star, X, Check } from 'lucide-react';
import { DishItem } from '../types/mess';

interface RateDishModalProps {
  dish: DishItem | null;
  mealName: string;
  onClose: () => void;
}

export const RateDishModal: React.FC<RateDishModalProps> = ({ dish, mealName, onClose }) => {
  const { rateDish, currentStudent } = useMess();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!dish) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateDish(dish.id, dish.name, rating, comment);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="rate-dish-modal"
        className="w-full max-w-md glassmorphism-card rounded-3xl shadow-2xl border border-white/95 text-slate-900 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-orange-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wider">
              {mealName} Feedback
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug">{dish.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3 bg-white/80">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shadow-xs">
              <Check className="w-8 h-8 text-emerald-700" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Feedback Submitted!</h4>
            <p className="text-sm text-slate-700 font-semibold">
              Thank you {currentStudent.name}! Your rating helps the mess committee audit quality and manage kitchen procurement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white/90">
            {/* Star Picker */}
            <div className="text-center space-y-2">
              <label className="text-xs font-black text-slate-900">
                How was the taste, freshness &amp; temperature today?
              </label>
              <div className="flex items-center justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-[#ff7a30] hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#ff7a30] text-[#ff7a30]'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-black text-[#ea580c]">
                {rating === 5 && 'Outstanding Taste & Quality (5/5)'}
                {rating === 4 && 'Good & Satisfying (4/5)'}
                {rating === 3 && 'Average / Needs Spice Adjustment (3/5)'}
                {rating === 2 && 'Below Standard / Cold Dish (2/5)'}
                {rating === 1 && 'Poor Quality / Salt Issue (1/5)'}
              </div>
            </div>

            {/* Comment Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black text-slate-900 flex items-center justify-between">
                <span>Specific remarks / suggestion (optional):</span>
                <span className="text-[10px] text-slate-600 font-bold">Audited by Warden</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g., Dal was perfectly spiced, Paneer was fresh, rotis were soft..."
                rows={3}
                className="w-full glassmorphism-input rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <ChromeButton
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                Submit Rating
              </ChromeButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
