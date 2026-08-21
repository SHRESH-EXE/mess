import React, { useState } from 'react';
import { useMess } from '../context/MessContext';
import { X, Plus, Trash2, Check, Utensils, AlertCircle } from 'lucide-react';
import { MealType, MealSlot, DishItem, DietaryTag } from '../types/mess';

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
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishTag, setNewDishTag] = useState<DietaryTag>('veg');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newDish: DishItem = {
      id: `dish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newDishName.trim(),
      category: 'main',
      tags: [newDishTag],
      calories: 180,
      description: newDishDesc.trim() || 'Prepared fresh by campus mess team'
    };

    setDishes([...dishes, newDish]);
    setNewDishName('');
    setNewDishDesc('');
  };

  const handleRemoveDish = (id: string) => {
    setDishes(dishes.filter(d => d.id !== id));
  };

  const handleToggleTag = (dishId: string, tag: DietaryTag) => {
    setDishes(dishes.map(d => {
      if (d.id !== dishId) return d;
      const exists = d.tags.includes(tag);
      return {
        ...d,
        tags: exists ? d.tags.filter(t => t !== tag) : [...d.tags, tag]
      };
    }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="menu-editor-modal"
        className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md font-bold">
              <Utensils className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Mess Staff Menu Editor
              </span>
              <h3 className="text-lg font-bold text-slate-100 leading-tight">
                Update {day} • {currentSlot.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSaved && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Menu updated successfully and synced with student view!</span>
            </div>
          )}

          {/* Timings & Special Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Meal Timings Window</label>
              <input
                type="text"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                placeholder="e.g. 12:30 PM - 02:30 PM"
                className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Chef Announcement / Special Note</label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Special Dum Biryani cooked on slow woodfire..."
                className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Existing Dishes List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Configured Dishes ({dishes.length})
              </label>
              <span className="text-[11px] text-slate-400">Tap dietary tags to toggle</span>
            </div>

            <div className="space-y-2">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-100">{dish.name}</div>
                    {dish.description && (
                      <div className="text-[11px] text-slate-400 truncate">{dish.description}</div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(['veg', 'non-veg', 'egg', 'high-protein', 'special', 'sweet'] as DietaryTag[]).map((tag) => {
                        const active = dish.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(dish.id, tag)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                              active
                                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDish(dish.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition-colors self-end sm:self-center"
                    title="Remove Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Dish Form */}
          <form onSubmit={handleAddDish} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Dish / Accompaniment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                placeholder="Dish Title (e.g. Paneer Butter Masala)"
                className="text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
              <select
                value={newDishTag}
                onChange={(e) => setNewDishTag(e.target.value as DietaryTag)}
                className="text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="veg" className="bg-slate-900 text-slate-100">Pure Veg 🟢</option>
                <option value="non-veg" className="bg-slate-900 text-slate-100">Non-Veg 🔴</option>
                <option value="egg" className="bg-slate-900 text-slate-100">Egg / High Protein 🟡</option>
                <option value="high-protein" className="bg-slate-900 text-slate-100">High Protein 💪</option>
                <option value="special" className="bg-slate-900 text-slate-100">Chef Special ⭐</option>
                <option value="sweet" className="bg-slate-900 text-slate-100">Sweet / Dessert 🍮</option>
              </select>
            </div>

            <input
              type="text"
              value={newDishDesc}
              onChange={(e) => setNewDishDesc(e.target.value)}
              placeholder="Short Description or ingredients (optional)..."
              className="w-full text-xs p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!newDishName.trim()}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md shadow-amber-500/20"
            >
              + Add to Menu
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Changes persist immediately in local storage</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md shadow-amber-500/20 transition-all"
            >
              Save Menu Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
