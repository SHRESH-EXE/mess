import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { Star, X, Check, MessageSquare, ThumbsUp } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="rate-dish-modal"
        className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              {mealName} Feedback
            </span>
            <h3 className="text-lg font-bold text-slate-100 leading-snug">{dish.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Feedback Submitted!</h4>
            <p className="text-sm text-slate-400">
              Thank you {currentStudent.name}! Your rating helps the mess committee audit quality and manage kitchen procurement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Star Picker */}
            <div className="text-center space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                How was the taste, freshness & temperature today?
              </label>
              <div className="flex items-center justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-amber-400">
                {rating === 5 && 'Outstanding Taste & Quality (5/5)'}
                {rating === 4 && 'Good & Satisfying (4/5)'}
                {rating === 3 && 'Average / Needs Spice Adjustment (3/5)'}
                {rating === 2 && 'Below Standard / Cold Dish (2/5)'}
                {rating === 1 && 'Poor Quality / Salt Issue (1/5)'}
              </div>
            </div>

            {/* Comment Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Comments / Suggestions for Kitchen Staff (Optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Gravy was nice and fresh, but roti could be a bit softer..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-100 placeholder-slate-500 resize-none"
              />
            </div>

            {/* Student Info Footer */}
            <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>Rating as <strong className="text-slate-200">{currentStudent.name}</strong> ({currentStudent.rollNo})</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> Anonymous to cooks
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md shadow-amber-500/20 transition-all"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
