import React, { useState, useEffect, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import ChromeButton from './ui/chrome-button';
import {
  Send,
  Building,
  Phone,
  Clock,
  Package,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Trash2,
  Utensils
} from 'lucide-react';
import { ACADEMIC_BLOCKS, DEFAULT_MESS_WHATSAPP_NUMBER } from '../data/initialData';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { getActiveMealStatus, getCurrentDayOfWeek } from '../utils/time';
import { OrderItem, DayMenu, MealSlot } from '../types/mess';

export const AcademicBlockOrder: React.FC = () => {
  const {
    currentStudent,
    weeklyMenu,
    createAcademicOrder
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const mealStatus = getActiveMealStatus();
  const todayMenu = weeklyMenu[todayDay] || weeklyMenu['Monday'];

  // Form states
  const [studentName, setStudentName] = useState(currentStudent.name);
  const [phone, setPhone] = useState(currentStudent.phone);
  const [rollNo, setRollNo] = useState(currentStudent.rollNo);
  const [blockName, setBlockName] = useState('');
  const [roomFloor, setRoomFloor] = useState('2nd Floor, Room / Desk 204');
  const [packingType, setPackingType] = useState<'Eco Paper Box' | 'Steel Tiffin (Returnable)' | 'Disposable Tray'>('Eco Paper Box');
  const [notes, setNotes] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Immediate Batch (Next 25 mins)');
  const [useMessPass, setUseMessPass] = useState(true);
  const [targetWhatsAppNumber, setTargetWhatsAppNumber] = useState(DEFAULT_MESS_WHATSAPP_NUMBER);
  const [acknowledgedAllergy, setAcknowledgedAllergy] = useState(false);

  // Sync with current student when changed
  useEffect(() => {
    setStudentName(currentStudent.name);
    setPhone(currentStudent.phone);
    setRollNo(currentStudent.rollNo);
    setAcknowledgedAllergy(false);
  }, [currentStudent]);

  // Selected Order Items
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([
    {
      dishName: `Full ${todayMenu.meals[mealStatus.currentMeal]?.name || 'Lunch'} Thali Pack (Rotis + Rice + Dal + Sabzi)`,
      quantity: 1,
      price: 90,
      isIncludedInMessPass: true
    }
  ]);

  // Custom item adding
  const [customItemName, setCustomItemName] = useState('');

  // Helper to find dish allergens in current weekly menu
  const allDishesInMenu = useMemo(() => {
    const list: { name: string; allergens: string[] }[] = [];
    Object.values(weeklyMenu).forEach((day: DayMenu) => {
      Object.values(day.meals).forEach((slot: MealSlot) => {
        slot.dishes.forEach((d) => {
          if (d.allergens && d.allergens.length > 0) {
            list.push({ name: d.name.toLowerCase(), allergens: d.allergens });
          }
        });
      });
    });
    return list;
  }, [weeklyMenu]);

  // Pre-order Allergy Conflict Check
  const detectedAllergenClashes = useMemo(() => {
    const clashes: { itemName: string; allergens: string[] }[] = [];
    const studentAllergens = (currentStudent.allergies || []).map(a => a.toLowerCase());
    if (studentAllergens.length === 0) return clashes;

    selectedItems.forEach(item => {
      const itemLower = item.dishName.toLowerCase();
      // Match with known dishes
      const matched = allDishesInMenu.find(d => itemLower.includes(d.name) || d.name.includes(itemLower));
      if (matched) {
        const matchingAllergens = matched.allergens.filter(alg => studentAllergens.includes(alg.toLowerCase()));
        if (matchingAllergens.length > 0) {
          clashes.push({ itemName: item.dishName, allergens: matchingAllergens });
        }
      } else if (itemLower.includes('thali') || itemLower.includes('paneer') || itemLower.includes('roti')) {
        // Fallback detection for common thali items if student has Dairy/Gluten
        const common: string[] = [];
        if (studentAllergens.includes('dairy') && (itemLower.includes('paneer') || itemLower.includes('thali') || itemLower.includes('curd'))) {
          common.push('Dairy');
        }
        if (studentAllergens.includes('gluten') && (itemLower.includes('roti') || itemLower.includes('thali') || itemLower.includes('samosa'))) {
          common.push('Gluten');
        }
        if (common.length > 0) {
          clashes.push({ itemName: item.dishName, allergens: common });
        }
      }
    });

    return clashes;
  }, [selectedItems, currentStudent.allergies, allDishesInMenu]);

  const hasAllergyConflict = detectedAllergenClashes.length > 0;

  const handleAddItem = (dishName: string, price: number = 40, isIncluded: boolean = false) => {
    const existing = selectedItems.find(i => i.dishName === dishName);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.dishName === dishName ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { dishName, quantity: 1, price, isIncludedInMessPass: isIncluded }]);
    }
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const next = [...selectedItems];
    next[index].quantity += delta;
    if (next[index].quantity <= 0) {
      next.splice(index, 1);
    }
    setSelectedItems(next);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    handleAddItem(customItemName.trim(), 50, false);
    setCustomItemName('');
  };

  const totalAmount = selectedItems.reduce((sum, item) => {
    if (useMessPass && item.isIncludedInMessPass) {
      return sum;
    }
    return sum + item.price * item.quantity;
  }, 0);

  // Formatted Message Preview payload
  const currentOrderPayload = {
    studentName: studentName.trim(),
    phone: phone.trim(),
    rollNo: rollNo.trim(),
    blockName: blockName || 'Academic Block (Not Selected)',
    roomFloor: roomFloor.trim(),
    items: selectedItems,
    packingType,
    notes: (hasAllergyConflict ? `[Allergen Advisory Acknowledged: ${currentStudent.allergies?.join(', ')}] ` : '') + (notes.trim() || ''),
    deliverySlot,
    useMessPass,
    targetWhatsAppNumber,
    totalAmount
  };

  // Submit and open WhatsApp
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !blockName.trim() || !roomFloor.trim() || selectedItems.length === 0) {
      return;
    }

    if (hasAllergyConflict && !acknowledgedAllergy) {
      alert('Please acknowledge the allergen advisory before submitting your order.');
      return;
    }

    // Save locally
    const savedOrder = createAcademicOrder({
      studentId: currentStudent.id,
      ...currentOrderPayload,
      blockName: blockName.trim()
    });

    setLastSubmittedId(savedOrder.id);

    // Generate WhatsApp URI
    const waUrl = generateWhatsAppLink(targetWhatsAppNumber, {
      ...currentOrderPayload,
      orderId: savedOrder.id
    });

    // Open WhatsApp in new tab / app
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="academic-block-order-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Hero Banner - Liquid Glass Surface */}
      <div className="rounded-[36px] bg-white/50 backdrop-blur-3xl border border-white/80 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.1)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff7a30] to-[#ff9248] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                Direct Kitchen Dispatch
              </span>
              <span className="text-xs text-orange-600 font-mono font-semibold">
                WhatsApp Express Delivery
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
              Academic Block Meal & Snack Delivery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Hot meals and refreshments delivered straight to your lab, department, or study cubicle.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xl p-3.5 rounded-2xl border border-white/90 shrink-0 shadow-xs">
            <Phone className="w-5 h-5 text-orange-600" />
            <div className="text-xs">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Kitchen WhatsApp Desk</div>
              <div className="font-mono font-bold text-slate-900">+{targetWhatsAppNumber}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {lastSubmittedId && (
        <div className="p-4 bg-emerald-50/80 backdrop-blur-xl border border-emerald-300 rounded-2xl text-emerald-950 text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Order <strong>#{lastSubmittedId}</strong> generated! WhatsApp opened with your formatted ticket. Mess kitchen is preparing your parcel.
            </span>
          </div>
          <button
            onClick={() => setLastSubmittedId(null)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Order Form Surface - Liquid Glass */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/55 backdrop-blur-3xl rounded-[36px] p-6 sm:p-8 border border-white/90 shadow-[0_24px_60px_-15px_rgba(249,115,22,0.08)] space-y-6">
          <div className="flex items-center space-x-2.5 pb-3.5 border-b border-orange-200/50">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/15 text-orange-600 flex items-center justify-center border border-orange-200">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Delivery Location & Student Details
              </h3>
            </div>
          </div>

          <form onSubmit={handleWhatsAppOrder} className="space-y-5">
            
            {/* Student Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden font-mono shadow-xs"
                />
              </div>
            </div>

            {/* Academic Block Building & Room / Floor */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-orange-500" />
                  <span>Academic Block / Building Name *</span>
                </label>
                <select
                  required
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden cursor-pointer shadow-xs"
                >
                  <option value="" disabled className="text-slate-400">
                    -- Select Academic Block --
                  </option>
                  {ACADEMIC_BLOCKS.map((block) => (
                    <option key={block} value={block} className="text-slate-800">
                      {block}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Floor & Specific Room / Lab / Study Desk No *
                </label>
                <input
                  type="text"
                  required
                  value={roomFloor}
                  onChange={(e) => setRoomFloor(e.target.value)}
                  placeholder="e.g. 2nd Floor, AI Research Lab (Room 214) or Library Cubicle 12"
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden shadow-xs"
                />
              </div>
            </div>

            {/* Meal Items Selection */}
            <div className="space-y-3 pt-3 border-t border-orange-200/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Select Items to Pack
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedItems.length} items in parcel
                </span>
              </div>

              {/* Selected Items List */}
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-white/90 bg-white/70 backdrop-blur-md flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">{item.dishName}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {item.isIncludedInMessPass && useMessPass
                          ? 'Covered by Monthly Pass'
                          : `₹${item.price} each`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, -1)}
                        className="w-6 h-6 rounded-lg bg-orange-100/70 hover:bg-orange-200 text-slate-700 flex items-center justify-center transition-colors border border-orange-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold text-slate-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-orange-100/70 hover:bg-orange-200 text-slate-700 flex items-center justify-center transition-colors border border-orange-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...selectedItems];
                          next.splice(idx, 1);
                          setSelectedItems(next);
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded-md transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Item field */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Add custom item (e.g. 2 extra rotis, curd bowl)..."
                  className="flex-1 text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="px-4 py-3 bg-white/80 hover:bg-white text-orange-600 font-bold text-xs rounded-2xl border border-orange-200 shadow-xs transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* PRE-ORDER ALLERGY WARNING BANNER & MANDATORY CHECKBOX */}
            {hasAllergyConflict && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-3 animate-in fade-in duration-200 shadow-xs">
                <div className="flex items-start space-x-3 text-emerald-950">
                  <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Allergy Advisory Notice
                    </h4>
                    <p className="text-xs text-emerald-900/90 leading-relaxed">
                      Your parcel order contains items with allergens matching your registered student profile:
                    </p>
                    <ul className="list-disc list-inside text-xs font-mono text-emerald-800 pt-1 space-y-0.5">
                      {detectedAllergenClashes.map((c, i) => (
                        <li key={i}>
                          <strong>{c.itemName}</strong> contains <span className="underline font-bold">{c.allergens.join(', ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledgedAllergy}
                      onChange={(e) => setAcknowledgedAllergy(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-900">
                      I acknowledge the allergy advisory and wish to proceed with this order.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Packaging & Batch Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-orange-200/50">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Packaging Type</label>
                <select
                  value={packingType}
                  onChange={(e) => setPackingType(e.target.value as typeof packingType)}
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden shadow-xs"
                >
                  <option value="Eco Paper Box">Eco Paper Box (Disposable)</option>
                  <option value="Steel Tiffin (Returnable)">Steel Tiffin (Return by 6 PM)</option>
                  <option value="Disposable Tray">Disposable Meal Tray</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Delivery Batch Window</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden shadow-xs"
                >
                  <option value="Immediate Batch (Next 25 mins)">Immediate Batch (Next 25 mins)</option>
                  <option value="1:15 PM Lunch Batch">1:15 PM Lunch Batch</option>
                  <option value="2:00 PM Afternoon Batch">2:00 PM Afternoon Batch</option>
                  <option value="5:15 PM High Tea Batch">5:15 PM High Tea Batch</option>
                  <option value="8:15 PM Evening Batch">8:15 PM Evening Batch</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Special Notes / Allergy Requests (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra pickle, mild spice, please call when delivery person reaches ground reception"
                className="w-full text-xs p-3 rounded-2xl bg-white/80 border border-orange-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-hidden shadow-xs"
              />
            </div>

            {/* Mess Pass Deduction Toggle & Total */}
            <div className="p-4 rounded-2xl bg-white/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMessPass}
                  onChange={(e) => setUseMessPass(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Deduct from Monthly Mess Pass
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Included with active hostel subscription
                  </span>
                </div>
              </label>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Extra Due</div>
                <div className="text-base font-black text-orange-600 font-mono">
                  {totalAmount === 0 ? '₹0 (Included)' : `₹${totalAmount}`}
                </div>
              </div>
            </div>

            {/* Prominent Action Button: Order via WhatsApp */}
            <ChromeButton
              id="submit-whatsapp-order-btn"
              type="submit"
              disabled={selectedItems.length === 0 || (hasAllergyConflict && !acknowledgedAllergy)}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff7a30] to-[#ff9248] hover:from-[#ea671e] hover:to-[#ff8130] disabled:opacity-50 text-white font-extrabold text-sm rounded-full shadow-lg shadow-orange-500/25 border border-white/20 flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Order via WhatsApp Direct</span>
            </ChromeButton>

          </form>
        </div>
      </div>
    </section>
  );
};
