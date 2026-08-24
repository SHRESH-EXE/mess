import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import ChromeButton from './ui/chrome-button';
import { X, Plus, Trash2, Check, Utensils, AlertCircle, ShieldAlert } from 'lucide-react';
import { MealType, MealSlot, DishItem, STANDARD_ALLERGENS } from '../types/mess';

interface MenuEditorModalProps {
  day: string;
  mealType: MealType;
  onClose: () => void;
}

export const MenuEditorModal: React.FC<MenuEditorModalProps> = ({ day, mealType, onClose }) => {
  const { weeklyMenu, updateMenuSlot } = useMess();
  const currentSlot: MealSlot = weeklyMenu[day]?.meals[mealType] || {
    id: `${day.toLowerCase()}-${mealType}`,
    type: mealType,
    name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
    timing: '12:30 PM - 02:30 PM',
    startHour: 12,
    startMin: 30,
    endHour: 14,
    endMin: 30,
    caloriesTotal: 650,
    dishes: []
  };

  const [timing, setTiming] = useState<string>(currentSlot.timing);
  const [specialNote, setSpecialNote] = useState<string>(currentSlot.specialNote || '');
  const [dishes, setDishes] = useState<DishItem[]>(currentSlot.dishes || []);
  
  // New Dish Inputs
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishCalories, setNewDishCalories] = useState<number>(220);
  const [newDishAllergens, setNewDishAllergens] = useState<string[]>([]);
  const [newDishIngredients, setNewDishIngredients] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleNewDishAllergen = (alg: string) => {
    if (newDishAllergens.includes(alg)) {
      setNewDishAllergens(newDishAllergens.filter(a => a !== alg));
    } else {
      setNewDishAllergens([...newDishAllergens, alg]);
    }
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const ingArray = newDishIngredients.trim()
      ? newDishIngredients.split(',').map(s => s.trim()).filter(Boolean)
      : ['Fresh campus kitchen ingredients'];

    const newDish: DishItem = {
      id: `dish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newDishName.trim(),
      category: 'main',
      tags: [],
      calories: newDishCalories || 200,
      description: newDishDesc.trim() || 'Prepared fresh by campus mess team',
      allergens: newDishAllergens,
      ingredients: ingArray
    };

    setDishes([...dishes, newDish]);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishIngredients('');
    setNewDishAllergens([]);
  };

  const handleRemoveDish = (id: string) => {
    setDishes(dishes.filter(d => d.id !== id));
  };

  const handleSave = () => {
    const updatedSlot: MealSlot = {
      ...currentSlot,
      timing,
      specialNote: specialNote.trim() || undefined,
      dishes
    };
    updateMenuSlot(day, mealType, updatedSlot);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="menu-editor-modal"
        className="w-full max-w-2xl glassmorphism-card rounded-3xl shadow-2xl border border-white/95 text-slate-900 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#ff7a30] to-[#ff9248] text-white shadow-xs">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wider">
                Mess Staff &amp; Nutritionist Editor
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                Update {day} • {currentSlot.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white/90">
          {isSaved && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Menu and allergen tags updated successfully and synced with student dashboard!</span>
            </div>
          )}

          {/* Timings & Special Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black text-slate-900">Meal Timings Window</label>
              <input
                type="text"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                placeholder="e.g. 12:30 PM - 02:30 PM"
                className="w-full text-xs p-2.5 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black text-slate-900">Chef Announcement / Special Note</label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Special Dum Biryani cooked on slow woodfire..."
                className="w-full text-xs p-2.5 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* Existing Dishes List */}
          <div className="space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Configured Dishes ({dishes.length})
              </label>
            </div>

            <div className="space-y-2">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-2xl border border-orange-200/80 bg-white/95 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xs text-slate-900">{dish.name}</span>
                    </div>

                    {dish.description && (
                      <div className="text-[11px] text-slate-700 font-medium">{dish.description}</div>
                    )}

                    {/* Allergens on Dish */}
                    <div className="flex flex-wrap gap-1 items-center text-[10px]">
                      <span className="text-slate-600 font-bold">Allergens:</span>
                      {dish.allergens && dish.allergens.length > 0 ? (
                        dish.allergens.map(a => (
                          <span key={a} className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-800 font-bold border border-emerald-300">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">None listed</span>
                      )}
                    </div>

                    {/* Ingredients */}
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div className="text-[10px] text-slate-700">
                        <strong className="text-slate-900">Ingredients:</strong> {dish.ingredients.join(', ')}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDish(dish.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors self-end sm:self-start cursor-pointer"
                    title="Remove Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Dish Form */}
          <form onSubmit={handleAddDish} className="p-4 bg-white rounded-2xl border border-orange-200/90 space-y-3 shadow-xs text-left">
            <div className="text-xs font-black text-[#ea580c] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#ea580c]" />
              <span>Add New Dish &amp; Nutrition Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                placeholder="Dish Title (e.g. Malai Kofta)"
                className="text-xs p-2.5 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
              />
              <input
                type="number"
                value={newDishCalories}
                onChange={(e) => setNewDishCalories(Number(e.target.value))}
                placeholder="Calories (e.g. 240 kcal)"
                className="text-xs p-2.5 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-semibold"
              />
            </div>

            <input
              type="text"
              value={newDishDesc}
              onChange={(e) => setNewDishDesc(e.target.value)}
              placeholder="Short Description..."
              className="w-full text-xs p-2 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
            />

            <input
              type="text"
              value={newDishIngredients}
              onChange={(e) => setNewDishIngredients(e.target.value)}
              placeholder="Comma separated ingredients (e.g. Paneer, Cream, Tomato, Cashew Gravy, Butter)..."
              className="w-full text-xs p-2 rounded-xl glassmorphism-input text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
            />

            {/* Allergen Checkbox Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Select Contained Allergens for Student Warning System:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STANDARD_ALLERGENS.map(alg => {
                  const isChecked = newDishAllergens.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleNewDishAllergen(alg)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer inline-flex items-center space-x-1 ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-800 border-emerald-400'
                          : 'bg-white text-slate-700 border-orange-200 hover:border-orange-400'
                      }`}
                    >
                      {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{alg}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <ChromeButton
              type="submit"
              disabled={!newDishName.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/25 cursor-pointer"
            >
              + Add to Menu Spread
            </ChromeButton>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-orange-50/60 border-t border-orange-200/80 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#ea580c]" />
            <span>Changes persist immediately</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <ChromeButton
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] text-white rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              Save Menu Changes
            </ChromeButton>
          </div>
        </div>

      </div>
    </div>
  );
};
