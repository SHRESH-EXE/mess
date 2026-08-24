import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  Star,
  CheckCircle2,
  Calendar,
  Info,
  Coffee,
  Sun,
  Moon,
  Cookie,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { MealType, DishItem, DayOfWeek } from '../types/mess';
import { getActiveMealStatus, getCurrentDayOfWeek } from '../utils/time';
import { RateDishModal } from './RateDishModal';

export const MenuDisplay: React.FC = () => {
  const {
    weeklyMenu,
    selectedDay,
    setSelectedDay,
    setActiveTab,
    isMealTakenToday,
    currentStudent
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const mealStatus = getActiveMealStatus();

  const [selectedMealTab, setSelectedMealTab] = useState<MealType>(mealStatus.currentMeal);
  const [expandedIngredientsDishId, setExpandedIngredientsDishId] = useState<string | null>(null);
  const [ratingModalDish, setRatingModalDish] = useState<{ dish: DishItem; mealName: string } | null>(null);
  const [allergenFilterMode, setAllergenFilterMode] = useState<'highlight' | 'hide'>('highlight');

  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = weeklyMenu[selectedDay] || weeklyMenu['Monday'];
  const currentSlot = dayMenu.meals[selectedMealTab];

  const mealTabConfig = [
    { type: 'breakfast' as MealType, label: 'Breakfast', icon: Coffee, timing: '07:30 - 09:30 AM' },
    { type: 'lunch' as MealType, label: 'Lunch', icon: Sun, timing: '12:30 - 02:30 PM' },
    { type: 'snacks' as MealType, label: 'High Tea & Snacks', icon: Cookie, timing: '05:00 - 06:30 PM' },
    { type: 'dinner' as MealType, label: 'Dinner', icon: Moon, timing: '07:30 - 10:00 PM' }
  ];

  const studentAllergies = currentStudent?.allergies || [];
  const dishes = currentSlot?.dishes || [];

  const displayedDishes = dishes.filter((dish) => {
    if (allergenFilterMode === 'hide' && studentAllergies.length > 0) {
      const clashingAllergens = (dish.allergens || []).filter(da =>
        studentAllergies.some(sa => sa.toLowerCase() === da.toLowerCase())
      );
      return clashingAllergens.length === 0;
    }
    return true;
  });

  const hiddenCount = dishes.length - displayedDishes.length;
  const checkStatus = isMealTakenToday(selectedMealTab, currentStudent.id);

  const toggleIngredients = (dishId: string) => {
    setExpandedIngredientsDishId(prev => prev === dishId ? null : dishId);
  };

  return (
    <section id="menu-display-section" className="space-y-7 animate-in fade-in duration-300">
      
      {/* Top Day Selector Bar - Floating Liquid Glass Carousel */}
      <div className="p-4 sm:p-5 rounded-[32px] bg-white/40 backdrop-blur-3xl border border-white/70 shadow-[0_16px_40px_-12px_rgba(249,115,22,0.08)] relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3.5 px-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-orange-600 flex items-center justify-center border border-orange-300/40">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                Weekly Schedule
              </h2>
            </div>
          </div>

          <span className="text-xs font-semibold text-orange-600/90 font-mono hidden sm:inline-block">
            {selectedDay}
          </span>
        </div>

        {/* Day Pills Flow - Horizontally scrollable on mobile, 7-col grid on sm+ */}
        <div className="flex sm:grid sm:grid-cols-7 gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-0 pt-1.5 px-1 -mx-1 sm:mx-0 snap-x snap-mandatory sm:snap-none scrollbar-none">
          {daysList.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = todayDay === day;

            return (
              <button
                key={day}
                id={`day-tab-${day.toLowerCase()}`}
                onClick={() => setSelectedDay(day)}
                className={`min-w-[80px] sm:min-w-0 shrink-0 sm:shrink py-3 px-2.5 rounded-2xl text-center transition-all relative font-bold cursor-pointer backdrop-blur-xl snap-center ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white shadow-lg shadow-orange-500/25 scale-[1.02] border border-white/40'
                    : isToday
                    ? 'bg-orange-500/15 text-orange-700 border border-orange-300/60 hover:bg-orange-500/25'
                    : 'bg-white/40 text-slate-700 border border-white/80 hover:bg-white/70 hover:text-slate-950'
                }`}
              >
                {isToday && (
                  <span
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.2 rounded-full font-extrabold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 shadow-xs'
                        : 'bg-orange-500 text-white shadow-xs'
                    }`}
                  >
                    Today
                  </span>
                )}
                <div className="text-xs tracking-wide">{day.slice(0, 3)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Slot Tabs (Breakfast, Lunch, Snacks, Dinner) - Horizontally scrollable on mobile, 4-col grid on md+ */}
      <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2.5 pt-1 px-1 -mx-1 md:mx-0 snap-x snap-mandatory md:snap-none scrollbar-none">
        {mealTabConfig.map((slot) => {
          const isCurrentActive = mealStatus.currentMeal === slot.type && selectedDay === todayDay;
          const isSelected = selectedMealTab === slot.type;
          const Icon = slot.icon;
          const slotStatus = isMealTakenToday(slot.type, currentStudent.id);

          return (
            <button
              key={slot.type}
              id={`meal-tab-${slot.type}`}
              onClick={() => setSelectedMealTab(slot.type)}
              className={`min-w-[175px] sm:min-w-[200px] md:min-w-0 shrink-0 md:shrink p-4 sm:p-5 rounded-[28px] text-left transition-all relative cursor-pointer backdrop-blur-2xl snap-center ${
                isSelected
                  ? 'bg-gradient-to-br from-[#ff7a30] via-[#ff8838] to-[#ff9b4e] text-white shadow-xl shadow-orange-500/20 scale-[1.02] border border-white/50'
                  : 'bg-white/45 text-slate-700 border border-white/80 hover:bg-white/70 hover:border-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.06)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-white/20 text-white shadow-inner border border-white/30'
                      : 'bg-orange-500/10 text-orange-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isCurrentActive && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-orange-500 text-white'
                  }`}>
                    Live
                  </span>
                )}
              </div>

              <div className="font-bold text-sm sm:text-base leading-tight mb-0.5">
                {slot.label}
              </div>
              <div className={`text-[11px] font-mono ${isSelected ? 'text-white/85 font-medium' : 'text-slate-500'}`}>
                {slot.timing}
              </div>

              {/* Status indicator */}
              <div className="mt-2.5 pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                {slotStatus.isTaken ? (
                  <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-white' : 'text-emerald-700'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Attended
                  </span>
                ) : (
                  <span className={isSelected ? 'text-white/75' : 'text-slate-400'}>
                    Pending
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Meal Flow - Cluster-less Liquid Glass Layout */}
      <div className="rounded-[36px] bg-white/50 backdrop-blur-3xl border border-white/80 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] overflow-hidden">
        
        {/* Banner Strip */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-white/60 via-orange-50/40 to-white/60 border-b border-orange-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-[11px] uppercase tracking-wider shadow-xs">
                  {selectedDay}'s {currentSlot.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentSlot.timing}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
                {currentSlot.name} Spread
              </h2>
            </div>

            {/* Quick Metrics in Airy Floating Glass Badges */}
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/90 text-xs text-slate-700 flex items-center gap-1.5 shadow-xs">
                <span className="text-slate-400 font-medium">Energy:</span>
                <span className="font-bold text-slate-900 font-mono">~{currentSlot.caloriesTotal} kcal</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/90 text-xs text-slate-700 flex items-center gap-1.5 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{currentSlot.ratingAvg || 4.7} / 5.0</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/90 text-xs text-slate-700 flex items-center gap-1.5 shadow-xs">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className={`font-bold ${checkStatus.isTaken ? 'text-emerald-700' : 'text-orange-600'}`}>
                  {checkStatus.isTaken ? 'Attended' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dish Items - Clean Uncluttered Flow */}
        <div className="p-6 sm:p-8">
          {/* Active Allergen Filter Notification Banner */}
          {hiddenCount > 0 && allergenFilterMode === 'hide' && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 backdrop-blur-xl border border-emerald-300/80 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{hiddenCount} dish{hiddenCount > 1 ? 'es' : ''}</strong> containing your saved allergens ({studentAllergies.join(', ')}) {hiddenCount > 1 ? 'have' : 'has'} been hidden.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAllergenFilterMode('highlight')}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-bold underline cursor-pointer self-end sm:self-auto"
              >
                Switch to Highlight Mode
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {displayedDishes.map((dish) => {
              // Allergen matching
              const clashingAllergens = (dish.allergens || []).filter(da =>
                studentAllergies.some(sa => sa.toLowerCase() === da.toLowerCase())
              );
              const isClashing = clashingAllergens.length > 0;
              const isExpanded = expandedIngredientsDishId === dish.id;

              return (
                <div
                  key={dish.id}
                  id={`dish-card-${dish.id}`}
                  className={`p-5 sm:p-6 rounded-[28px] transition-all flex flex-col justify-between relative backdrop-blur-2xl ${
                    isClashing
                      ? 'bg-emerald-50/60 border border-emerald-400/50 shadow-sm'
                      : dish.isChefSpecial
                      ? 'bg-gradient-to-br from-white/70 via-orange-50/50 to-amber-50/40 border border-orange-300/60 shadow-md shadow-orange-500/5'
                      : 'bg-white/55 border border-white/90 hover:bg-white/75 hover:border-white shadow-xs'
                  }`}
                >
                  {/* Dish details */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {dish.name}
                      </h4>
                      {dish.isChefSpecial && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[10px] tracking-wide shrink-0">
                          Special
                        </span>
                      )}
                    </div>

                    {dish.description && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {dish.description}
                      </p>
                    )}

                    {/* Allergens Listed - Light Green Glass Tag */}
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 mb-2.5 text-[10px]">
                        <span className="text-slate-500 font-medium">Allergens:</span>
                        {dish.allergens.map((alg) => {
                          return (
                            <span
                              key={alg}
                              className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-400/40 backdrop-blur-xs"
                            >
                              {alg}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Expandable Ingredients Dropdown */}
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() => toggleIngredients(dish.id)}
                        className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1 py-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Ingredients' : 'View Ingredients'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-200/60 text-xs space-y-1 animate-in fade-in duration-150">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Kitchen Ingredients:
                          </div>
                          <div className="text-slate-700 text-[11px] leading-relaxed">
                            {dish.ingredients && dish.ingredients.length > 0
                              ? dish.ingredients.join(', ')
                              : 'Standard fresh hostel kitchen ingredients (spices, salt, refined oil).'}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Flow Footer: Calories & Action Buttons */}
                  <div className="pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="text-slate-500 font-mono font-medium">
                      {dish.calories ? `~${dish.calories} kcal` : 'Hostel Spread'}
                    </div>

                    <button
                      onClick={() => setRatingModalDish({ dish, mealName: currentSlot.name })}
                      className="px-3.5 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] rounded-full border border-white/30 shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <Star className="w-3.5 h-3.5 text-white fill-white" />
                      <span>Rate Dish</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedDishes.length === 0 && (
            <div className="text-center py-12 bg-white/40 backdrop-blur-xl rounded-[28px] border border-dashed border-orange-200">
              <Info className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {hiddenCount > 0
                  ? `All ${hiddenCount} dishes in this meal slot contain allergens from your profile.`
                  : 'No dishes listed for this meal slot.'}
              </p>
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setAllergenFilterMode('highlight')}
                  className="mt-3.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  View All Items with Warnings
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Dish Rating Modal */}
      {ratingModalDish && (
        <RateDishModal
          dish={ratingModalDish.dish}
          mealName={ratingModalDish.mealName}
          onClose={() => setRatingModalDish(null)}
        />
      )}
    </section>
  );
};
