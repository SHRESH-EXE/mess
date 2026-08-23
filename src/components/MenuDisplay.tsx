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
  ChevronUp
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

  const checkStatus = isMealTakenToday(selectedMealTab, currentStudent.id);

  const toggleIngredients = (dishId: string) => {
    setExpandedIngredientsDishId(prev => prev === dishId ? null : dishId);
  };

  return (
    <section id="menu-display-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Student Allergy Advisory Bar */}
      {studentAllergies.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 flex items-center gap-2">
                <span>Active Dietary Profile for {currentStudent.name}:</span>
                <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                  {studentAllergies.join(', ')}
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Dishes containing these allergens are highlighted with prominent warning banners below.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('pass')}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Top Day Selector Bar */}
      <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all self-start sm:self-auto cursor-pointer shadow-sm"
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
                className={`py-2.5 px-2 rounded-xl text-center transition-all relative font-bold cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : isToday
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 hover:bg-slate-750'
                    : 'bg-slate-950/70 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {isToday && (
                  <span
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.01]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isCurrentActive && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
              <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between text-[10px]">
                {slotStatus.isTaken ? (
                  <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Attended
                  </span>
                ) : (
                  <span className={isSelected ? 'text-slate-800' : 'text-slate-500'}>
                    Not Attended
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Meal Content Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Banner Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider">
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
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Calories</span>
              <span className="text-base font-bold text-slate-100 font-mono">~{currentSlot.caloriesTotal} kcal</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg Slot Rating</span>
              <span className="text-base font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {currentSlot.ratingAvg || 4.7} / 5.0
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Meal Status</span>
              <span className={`text-xs font-bold ${checkStatus.isTaken ? 'text-emerald-400' : 'text-amber-400'}`}>
                {checkStatus.isTaken ? 'Marked Attended' : 'Pending Check-in'}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dining Hall Facility</span>
              <span className="text-xs font-semibold text-slate-200">Main Ground Hall</span>
            </div>
          </div>
        </div>

        {/* Dish Items Grid */}
        <div className="p-5 sm:p-6 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishes.map((dish) => {
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
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                    isClashing
                      ? 'bg-red-950/20 border-red-500/60 shadow-lg'
                      : dish.isChefSpecial
                      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Clashing Allergy Banner on Card */}
                  {isClashing && (
                    <div className="mb-3 p-2 rounded-xl bg-red-950/80 border border-red-600/70 text-red-200 text-xs font-bold flex items-center space-x-2 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        ALLERGEN WARNING: Contains {clashingAllergens.join(', ')} (Matches your profile)
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-500 flex items-center justify-center p-0.5" title="100% Pure Vegetarian">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 leading-snug">
                          {dish.name}
                        </h4>
                      </div>

                      {dish.isChefSpecial && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full shrink-0 shadow-xs">
                          Chef's Special
                        </span>
                      )}
                    </div>

                    {dish.description && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {dish.description}
                      </p>
                    )}

                    {/* Dietary Badges & Allergen Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {dish.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {dish.protein} Protein
                        </span>
                      )}
                    </div>

                    {/* Allergens Listed */}
                    {dish.allergens && dish.allergens.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1 mb-2 text-[10px]">
                        <span className="text-slate-400 font-medium">Allergens:</span>
                        {dish.allergens.map((alg) => {
                          const isStudentAllergic = studentAllergies.some(sa => sa.toLowerCase() === alg.toLowerCase());
                          return (
                            <span
                              key={alg}
                              className={`px-1.5 py-0.2 rounded font-semibold ${
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
                        <div className="mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-in fade-in duration-150">
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
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="text-slate-400 font-mono">
                      {dish.calories ? `~${dish.calories} kcal` : 'Unlimited Portions'}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setRatingModalDish({ dish, mealName: currentSlot.name })}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-amber-300 bg-slate-850 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Rate</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {dishes.length === 0 && (
            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
              <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No dishes listed for this meal slot.</p>
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
