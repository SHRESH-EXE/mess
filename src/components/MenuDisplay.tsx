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
    <section id="menu-display-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Student Allergy Advisory Bar with Highlight/Hide Toggle */}
      {studentAllergies.length > 0 && (
        <div className="bg-amber-950/40 backdrop-blur-xl border border-amber-500/40 rounded-[28px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 flex flex-wrap items-center gap-2">
                <span>Active Dietary Profile for {currentStudent.name}:</span>
                <span className="font-mono text-[11px] bg-amber-500/20 px-3 py-1 rounded-full text-amber-300 border border-amber-500/30">
                  {studentAllergies.join(', ')}
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-1">
                {allergenFilterMode === 'hide'
                  ? 'Filtering menu to hide dishes containing your allergens.'
                  : 'Dishes containing these allergens are highlighted with warning banners.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Highlight vs Hide Allergen Toggle - Smooth Oval Pill */}
            <div className="flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-800 p-1.5 rounded-full shadow-inner">
              <button
                type="button"
                id="allergen-toggle-highlight"
                onClick={() => setAllergenFilterMode('highlight')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  allergenFilterMode === 'highlight'
                    ? 'bg-amber-500 text-slate-950 shadow-sm scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Highlight</span>
              </button>
              <button
                type="button"
                id="allergen-toggle-hide"
                onClick={() => setAllergenFilterMode('hide')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  allergenFilterMode === 'hide'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Allergens</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('pass')}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer px-2"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Top Day Selector Bar */}
      <div className="dark-glass-card p-4 sm:p-5 border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                Weekly Hostel Mess Schedule
              </h2>
            </div>
          </div>

          {/* Quick jump to Today */}
          {selectedDay !== todayDay && (
            <button
              onClick={() => setSelectedDay(todayDay)}
              className="text-xs px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all self-start sm:self-auto cursor-pointer shadow-md shadow-amber-500/20"
            >
              Jump to Today ({todayDay})
            </button>
          )}
        </div>

        {/* Day Pills Carousel */}
        <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-7 gap-2">
          {daysList.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = todayDay === day;

            return (
              <button
                key={day}
                id={`day-tab-${day.toLowerCase()}`}
                onClick={() => setSelectedDay(day)}
                className={`py-3 px-2 rounded-2xl text-center transition-all relative font-bold cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.03]'
                    : isToday
                    ? 'bg-slate-800/90 text-amber-400 border border-amber-500/40 hover:bg-slate-755'
                    : 'bg-slate-950/60 backdrop-blur-md text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {isToday && (
                  <span
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    Today
                  </span>
                )}
                <div className="text-xs">{day.slice(0, 3)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Slot Tabs (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              className={`p-4 rounded-[24px] border text-left transition-all relative cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-xl shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 backdrop-blur-xl text-slate-300 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isCurrentActive && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    Live
                  </span>
                )}
              </div>

              <div className="font-black text-sm leading-tight mb-0.5">
                {slot.label}
              </div>
              <div className={`text-[11px] font-mono ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {slot.timing}
              </div>

              {/* Check-in badge indicator */}
              <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[10px]">
                {slotStatus.isTaken ? (
                  <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-slate-950 font-bold' : 'text-emerald-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Attended
                  </span>
                ) : (
                  <span className={isSelected ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                    Not Attended
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Main Meal Content Card */}
      <div className="bg-slate-900/85 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Banner Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-xs">
                {selectedDay}'s {currentSlot.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentSlot.timing}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-serif tracking-tight">
              {currentSlot.name} Spread & Nutrition
            </h2>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Calories</span>
              <span className="text-base font-bold text-slate-100 font-mono">~{currentSlot.caloriesTotal} kcal</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg Slot Rating</span>
              <span className="text-base font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {currentSlot.ratingAvg || 4.7} / 5.0
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Meal Status</span>
              <span className={`text-xs font-bold ${checkStatus.isTaken ? 'text-emerald-400' : 'text-amber-400'}`}>
                {checkStatus.isTaken ? 'Marked Attended' : 'Pending Check-in'}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dining Hall Facility</span>
              <span className="text-xs font-semibold text-slate-200">Main Ground Hall</span>
            </div>
          </div>
        </div>

        {/* Dish Items Grid */}
        <div className="p-6 sm:p-7 bg-slate-900/60">
          {/* Active Allergen Filter Notification Banner */}
          {hiddenCount > 0 && allergenFilterMode === 'hide' && (
            <div className="mb-5 p-4 rounded-[20px] bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>{hiddenCount} dish{hiddenCount > 1 ? 'es' : ''}</strong> containing your saved allergens ({studentAllergies.join(', ')}) {hiddenCount > 1 ? 'have' : 'has'} been hidden.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAllergenFilterMode('highlight')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer self-end sm:self-auto"
              >
                Switch to Highlight Mode
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`p-5 rounded-[26px] border transition-all flex flex-col justify-between relative ${
                    isClashing
                      ? 'bg-red-950/25 border-red-500/60 shadow-lg'
                      : dish.isChefSpecial
                      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-lg'
                      : 'bg-slate-950/75 backdrop-blur-md border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Clashing Allergy Banner on Card */}
                  {isClashing && (
                    <div className="mb-3 p-3 rounded-2xl bg-red-950/80 border border-red-600/70 text-red-200 text-xs font-bold flex items-center space-x-2 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        ALLERGEN WARNING: Contains {clashingAllergens.join(', ')} (Matches your profile)
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-500 flex items-center justify-center p-0.5" title="100% Pure Vegetarian">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 leading-snug">
                          {dish.name}
                        </h4>
                      </div>

                      {dish.isChefSpecial && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-slate-950" /> Special
                        </span>
                      )}
                    </div>

                    {dish.description && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {dish.description}
                      </p>
                    )}

                    {/* Dietary Badges & Allergen Pills - Smooth Oval Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {dish.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                            tag === 'high-protein'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                              : tag === 'special'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                              : tag === 'sweet'
                              ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {dish.protein && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {dish.protein} Protein
                        </span>
                      )}
                    </div>

                    {/* Allergens Listed */}
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 mb-2 text-[10px]">
                        <span className="text-slate-400 font-medium">Allergens:</span>
                        {dish.allergens.map((alg) => {
                          const isStudentAllergic = studentAllergies.some(sa => sa.toLowerCase() === alg.toLowerCase());
                          return (
                            <span
                              key={alg}
                              className={`px-2.5 py-0.5 rounded-full font-semibold ${
                                isStudentAllergic
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
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
                        className="text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center space-x-1 py-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Ingredients' : 'View Ingredients'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-in fade-in duration-150">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Full Kitchen Ingredients:
                          </div>
                          <div className="text-slate-300 text-[11px] leading-relaxed">
                            {dish.ingredients && dish.ingredients.length > 0
                              ? dish.ingredients.join(', ')
                              : 'Standard fresh hostel kitchen ingredients (spices, salt, refined oil).'}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Footer: Calories & Action Buttons */}
                  <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="text-slate-400 font-mono">
                      {dish.calories ? `~${dish.calories} kcal` : 'Unlimited Portions'}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setRatingModalDish({ dish, mealName: currentSlot.name })}
                        className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-slate-950 bg-slate-800 hover:bg-amber-400 rounded-full border border-slate-700/80 transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:text-slate-950" />
                        <span>Rate</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedDishes.length === 0 && (
            <div className="text-center py-12 bg-slate-950/60 rounded-[28px] border border-dashed border-slate-800">
              <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">
                {hiddenCount > 0
                  ? `All ${hiddenCount} dishes in this meal slot contain allergens from your profile.`
                  : 'No dishes listed for this meal slot.'}
              </p>
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setAllergenFilterMode('highlight')}
                  className="mt-3.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
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
