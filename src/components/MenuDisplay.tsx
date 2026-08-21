import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import {
  Clock,
  Flame,
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  Filter,
  ChevronRight,
  ShieldAlert,
  Info,
  Edit3,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Award,
  Leaf
} from 'lucide-react';
import { MealType, DishItem, DietaryTag, DayOfWeek } from '../types/mess';
import { getActiveMealStatus, getCurrentDayOfWeek } from '../utils/time';
import { RateDishModal } from './RateDishModal';
import { MenuEditorModal } from './MenuEditorModal';

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
  const [dietFilter, setDietFilter] = useState<string>('all');
  const [ratingModalDish, setRatingModalDish] = useState<{ dish: DishItem; mealName: string } | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ day: string; mealType: MealType } | null>(null);

  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = weeklyMenu[selectedDay] || weeklyMenu['Monday'];
  const currentSlot = dayMenu.meals[selectedMealTab];

  const mealTabConfig = [
    { type: 'breakfast' as MealType, label: 'Breakfast', icon: Coffee, timing: '07:30 - 09:30 AM' },
    { type: 'lunch' as MealType, label: 'Lunch', icon: Sun, timing: '12:30 - 02:30 PM' },
    { type: 'snacks' as MealType, label: 'High Tea & Snacks', icon: Cookie, timing: '05:00 - 06:30 PM' },
    { type: 'dinner' as MealType, label: 'Dinner', icon: Moon, timing: '07:30 - 10:00 PM' }
  ];

  // Filter dishes based on selected tag
  const filteredDishes = (currentSlot?.dishes || []).filter((dish) => {
    if (dietFilter === 'all') return true;
    if (dietFilter === 'veg') return dish.tags.includes('veg');
    if (dietFilter === 'high-protein') return dish.tags.includes('high-protein');
    if (dietFilter === 'non-veg') return dish.tags.includes('non-veg') || dish.tags.includes('egg');
    if (dietFilter === 'special') return dish.tags.includes('special') || dish.isChefSpecial;
    return true;
  });

  const checkStatus = isMealTakenToday(selectedMealTab, currentStudent.id);

  return (
    <section id="menu-display-section" className="space-y-6 animate-in fade-in duration-200">
      
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
              <p className="text-xs text-slate-400">
                {selectedDay === todayDay ? "Viewing Today's Live Menu" : `Viewing ${selectedDay} Schedule`}
              </p>
            </div>
          </div>

          {selectedDay !== todayDay && (
            <button
              onClick={() => setSelectedDay(todayDay)}
              className="self-start sm:self-auto px-3 py-1 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Jump to Today ({todayDay})</span>
            </button>
          )}
        </div>

        {/* Days Pill List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {daysList.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === todayDay;
            return (
              <button
                key={day}
                id={`day-btn-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`py-2.5 px-3 rounded-xl text-center transition-all relative ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {isToday && (
                  <span
                    className={`absolute -top-1.5 right-2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isSelected ? 'bg-slate-950 text-amber-400 border border-slate-800' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Today
                  </span>
                )}
                <div className="text-xs">{day.slice(0, 3)}</div>
                <div className="text-[11px] opacity-75 truncate">{weeklyMenu[day]?.theme || 'Standard'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Slots Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {mealTabConfig.map((slot) => {
          const Icon = slot.icon;
          const isSelected = selectedMealTab === slot.type;
          const isOngoing = selectedDay === todayDay && mealStatus.currentMeal === slot.type && mealStatus.status === 'ongoing';
          const isUpcoming = selectedDay === todayDay && mealStatus.currentMeal === slot.type && mealStatus.status === 'upcoming';
          const isTaken = selectedDay === todayDay && isMealTakenToday(slot.type, currentStudent.id).isTaken;

          return (
            <button
              key={slot.type}
              id={`meal-tab-${slot.type}`}
              onClick={() => setSelectedMealTab(slot.type)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {/* Ongoing / Live Ribbon */}
              {isOngoing && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Live Now
                </div>
              )}
              {isUpcoming && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">
                  Upcoming
                </div>
              )}

              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-slate-100' : 'text-slate-200'}`}>
                    {slot.label}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{slot.timing}</span>
                  </div>
                </div>
              </div>

              {/* Status footer inside tab */}
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">
                  {dayMenu.meals[slot.type]?.dishes?.length || 0} Dishes
                </span>
                {selectedDay === todayDay && isTaken && (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Taken
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              {currentSlot.specialNote && (
                <p className="text-xs text-amber-300 mt-1 flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{currentSlot.specialNote}</span>
                </p>
              )}
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEditingSlot({ day: selectedDay, mealType: selectedMealTab })}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-1.5"
                title="Edit this meal slot (Admin/Staff)"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Items</span>
              </button>

              <button
                onClick={() => setActiveTab('parcel')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <span>Pack for Academic Block</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Calories</span>
              <span className="text-base font-bold text-slate-100 font-mono">~{currentSlot.caloriesTotal} kcal</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg Rating</span>
              <span className="text-base font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {currentSlot.ratingAvg || 4.7} / 5.0
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Meal Status</span>
              <span className={`text-xs font-bold ${checkStatus.isTaken ? 'text-emerald-400' : 'text-amber-400'}`}>
                {checkStatus.isTaken ? '✅ Marked Attended' : '⏳ Pending Check-in'}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mess Dining Hall</span>
              <span className="text-xs font-semibold text-slate-200">Main Ground Hall</span>
            </div>
          </div>
        </div>

        {/* Dietary Filters & Dietary Badges Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'veg', label: 'Pure Veg 🟢' },
              { id: 'high-protein', label: 'High Protein 💪' },
              { id: 'non-veg', label: 'Non-Veg / Egg 🔴' },
              { id: 'special', label: 'Chef Specials ⭐' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                  dietFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-200">{filteredDishes.length}</strong> items
          </div>
        </div>

        {/* Dish Items Grid */}
        <div className="p-5 sm:p-6 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                id={`dish-card-${dish.id}`}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  dish.isChefSpecial
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      {dish.tags.includes('veg') ? (
                        <span className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-500 flex items-center justify-center p-0.5" title="Pure Veg">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                      ) : dish.tags.includes('egg') ? (
                        <span className="w-3.5 h-3.5 rounded-xs border-2 border-amber-500 flex items-center justify-center p-0.5" title="Contains Egg">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-xs border-2 border-rose-500 flex items-center justify-center p-0.5" title="Non-Veg">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        </span>
                      )}
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

                  {/* Dietary Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
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
                        {tag === 'high-protein' && '💪 '}
                        {tag}
                      </span>
                    ))}
                    {dish.protein && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {dish.protein} Protein
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Calories & Rating Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-mono">
                    {dish.calories ? `~${dish.calories} kcal` : 'Unlimited Portions'}
                  </div>

                  <button
                    onClick={() => setRatingModalDish({ dish, mealName: currentSlot.name })}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-amber-300 bg-slate-850 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors flex items-center space-x-1"
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Rate Quality</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDishes.length === 0 && (
            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
              <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No dishes match the selected filter.</p>
              <button
                onClick={() => setDietFilter('all')}
                className="mt-2 text-xs font-bold text-amber-400 hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Dietary & Kitchen Quality Assurance Note */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              100% RO Filtered Water used in cooking. Separate Jain/Sattvic cookware maintained.
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Mess Head: Chef Rajendra Kumar & Student Committee
          </div>
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

      {/* Admin Menu Editor Modal */}
      {editingSlot && (
        <MenuEditorModal
          day={editingSlot.day}
          mealType={editingSlot.mealType}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </section>
  );
};
