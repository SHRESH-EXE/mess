import React, { useState, useEffect, useMemo } from 'react';
import { useMess } from '../context/MessContext';
import {
  Send,
  Building,
  Phone,
  Clock,
  Package,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Utensils,
  CreditCard,
  History,
  ChefHat,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { ACADEMIC_BLOCKS, DEFAULT_MESS_WHATSAPP_NUMBER } from '../data/initialData';
import { generateWhatsAppLink, formatWhatsAppOrderMessage } from '../utils/whatsapp';
import { getActiveMealStatus, getCurrentDayOfWeek } from '../utils/time';
import { OrderItem, DayMenu, MealSlot } from '../types/mess';

export const AcademicBlockOrder: React.FC = () => {
  const {
    currentStudent,
    weeklyMenu,
    createAcademicOrder,
    orders
  } = useMess();

  const todayDay = getCurrentDayOfWeek();
  const mealStatus = getActiveMealStatus();
  const todayMenu = weeklyMenu[todayDay] || weeklyMenu['Monday'];

  // Form states
  const [studentName, setStudentName] = useState(currentStudent.name);
  const [phone, setPhone] = useState(currentStudent.phone);
  const [rollNo, setRollNo] = useState(currentStudent.rollNo);
  const [blockName, setBlockName] = useState(ACADEMIC_BLOCKS[0]);
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

  // Available dishes from active menu
  const availableDishes = [
    ...(todayMenu.meals[mealStatus.currentMeal]?.dishes || []),
    ...(todayMenu.meals.snacks?.dishes || [])
  ];

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
    blockName,
    roomFloor: roomFloor.trim(),
    items: selectedItems,
    packingType,
    notes: (hasAllergyConflict ? `[Allergen Advisory Acknowledged: ${currentStudent.allergies?.join(', ')}] ` : '') + (notes.trim() || ''),
    deliverySlot,
    useMessPass,
    targetWhatsAppNumber,
    totalAmount
  };

  const previewMessage = formatWhatsAppOrderMessage(currentOrderPayload);

  // Submit and open WhatsApp
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !roomFloor.trim() || selectedItems.length === 0) {
      return;
    }

    if (hasAllergyConflict && !acknowledgedAllergy) {
      alert('Please acknowledge the allergen advisory before submitting your order.');
      return;
    }

    // Save locally
    const savedOrder = createAcademicOrder({
      studentId: currentStudent.id,
      ...currentOrderPayload
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

  // Filter student's past parcel orders
  const myOrders = orders.filter(o => o.phone === phone || o.rollNo === rollNo || o.studentName === studentName);

  return (
    <section id="academic-block-order-section" className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider">
                Direct Kitchen Dispatch
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                WhatsApp Express Service
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
              Academic Block Meal & Snack Parcel Delivery
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Stuck in lectures, lab research, or library study sessions? Order fresh mess food packed into eco boxes and delivered directly to your department via WhatsApp.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-2xl border border-white/10 shrink-0">
            <Phone className="w-5 h-5 text-emerald-300 animate-pulse" />
            <div className="text-xs">
              <div className="text-emerald-200 text-[10px] uppercase font-bold">Kitchen WhatsApp Desk</div>
              <div className="font-mono font-bold text-white">+{targetWhatsAppNumber}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {lastSubmittedId && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Order <strong>#{lastSubmittedId}</strong> generated! WhatsApp opened with your formatted ticket. Mess kitchen is preparing your parcel.
            </span>
          </div>
          <button
            onClick={() => setLastSubmittedId(null)}
            className="text-[11px] font-bold text-emerald-300 hover:text-emerald-100 hover:underline ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Order Form (7 Cols) & WhatsApp Live Preview + Tracking (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Order Form Card (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                1. Delivery Location & Student Details
              </h3>
              <p className="text-xs text-slate-400">
                Fill delivery location in campus academic complex
              </p>
            </div>
          </div>

          <form onSubmit={handleWhatsAppOrder} className="space-y-5">
            
            {/* Student Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Student Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Academic Block Building & Room / Floor */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Building / Department *</span>
                </label>
                <select
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {ACADEMIC_BLOCKS.map((block) => (
                    <option key={block} value={block} className="bg-slate-900 text-slate-100">
                      {block}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Floor & Specific Room / Lab / Study Desk No *
                </label>
                <input
                  type="text"
                  required
                  value={roomFloor}
                  onChange={(e) => setRoomFloor(e.target.value)}
                  placeholder="e.g. 2nd Floor, AI Research Lab (Room 214) or Library Cubicle 12"
                  className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Meal Items Selection */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  2. Select Items to Pack
                </label>
                <span className="text-[11px] text-slate-400">
                  {selectedItems.length} items in box
                </span>
              </div>

              {/* Quick Add Chips from Today's Active Kitchen */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Add from Today's Kitchen Counter:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddItem(`Full ${todayMenu.meals[mealStatus.currentMeal]?.name || 'Meal'} Thali Pack`, 90, true)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/40 cursor-pointer"
                  >
                    + Standard Meal Thali (Mess Pass)
                  </button>
                  {availableDishes.slice(0, 4).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleAddItem(d.name, 40, false)}
                      className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700 cursor-pointer"
                    >
                      + {d.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddItem('Cutting Chai + Veg Samosa (2 pcs)', 35, false)}
                    className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700 cursor-pointer"
                  >
                    + Samosa & Chai Pack (₹35)
                  </button>
                </div>
              </div>

              {/* Selected Items List */}
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-100">{item.dishName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.isIncludedInMessPass && useMessPass
                          ? '✅ Included in Monthly Mess Pass'
                          : `₹${item.price} each`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, -1)}
                        className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold text-slate-100 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, 1)}
                        className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
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
                        className="p-1 text-slate-500 hover:text-red-400 rounded-md transition-colors cursor-pointer"
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
                  className="flex-1 text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* PRE-ORDER ALLERGY WARNING BANNER & MANDATORY CHECKBOX */}
            {hasAllergyConflict && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/60 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start space-x-3 text-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">
                      ⚠️ Allergy Advisory Notice
                    </h4>
                    <p className="text-xs text-red-200/90 leading-relaxed">
                      Your parcel order contains items with allergens matching your registered student profile:
                    </p>
                    <ul className="list-disc list-inside text-xs font-mono text-red-300 pt-1 space-y-0.5">
                      {detectedAllergenClashes.map((c, i) => (
                        <li key={i}>
                          <strong>{c.itemName}</strong> contains <span className="underline font-bold">{c.allergens.join(', ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-900/60">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledgedAllergy}
                      onChange={(e) => setAcknowledgedAllergy(e.target.checked)}
                      className="w-4 h-4 text-red-500 rounded border-red-600 bg-slate-950 focus:ring-red-500"
                    />
                    <span className="text-xs font-bold text-red-200">
                      I acknowledge the allergy advisory and wish to proceed with this order.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Packaging & Batch Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Packaging Type</label>
                <select
                  value={packingType}
                  onChange={(e) => setPackingType(e.target.value as typeof packingType)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="Eco Paper Box" className="bg-slate-900 text-slate-100">Eco Paper Box (Disposable)</option>
                  <option value="Steel Tiffin (Returnable)" className="bg-slate-900 text-slate-100">Steel Tiffin (Return by 6 PM)</option>
                  <option value="Disposable Tray" className="bg-slate-900 text-slate-100">Disposable Meal Tray</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Delivery Batch Window</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="Immediate Batch (Next 25 mins)" className="bg-slate-900 text-slate-100">Immediate Batch (Next 25 mins)</option>
                  <option value="1:15 PM Lunch Batch" className="bg-slate-900 text-slate-100">1:15 PM Lunch Batch</option>
                  <option value="2:00 PM Afternoon Batch" className="bg-slate-900 text-slate-100">2:00 PM Afternoon Batch</option>
                  <option value="5:15 PM High Tea Batch" className="bg-slate-900 text-slate-100">5:15 PM High Tea Batch</option>
                  <option value="8:15 PM Evening Batch" className="bg-slate-900 text-slate-100">8:15 PM Evening Batch</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Special Notes / Allergy Requests (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra pickle, mild spice, please call when delivery person reaches ground reception"
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Mess Pass Deduction Toggle & Total */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMessPass}
                  onChange={(e) => setUseMessPass(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-900 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    Deduct from Monthly Mess Pass
                  </span>
                  <span className="text-[10px] text-slate-400">
                    No cash required for standard thali items
                  </span>
                </div>
              </label>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Extra Due</div>
                <div className="text-base font-black text-amber-400 font-mono">
                  {totalAmount === 0 ? '₹0 (Free on Pass)' : `₹${totalAmount}`}
                </div>
              </div>
            </div>

            {/* Prominent Action Button: Order via WhatsApp */}
            <button
              id="submit-whatsapp-order-btn"
              type="submit"
              disabled={selectedItems.length === 0 || (hasAllergyConflict && !acknowledgedAllergy)}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Order via WhatsApp Direct</span>
            </button>

          </form>
        </div>

        {/* WhatsApp Real-Time Preview & Past Orders (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live WhatsApp Message Preview Phone Mock */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold">WhatsApp Ticket Live Preview</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Auto-Formatted</span>
            </div>

            {/* WhatsApp Chat Bubble */}
            <div className="bg-[#0b141a] p-3 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px] text-slate-200 overflow-hidden">
              <div className="bg-[#005c4b] p-3 rounded-xl text-slate-100 shadow-sm whitespace-pre-wrap leading-relaxed">
                {previewMessage}
              </div>
              <div className="text-right text-[9px] text-slate-400 font-sans">
                Opens directly in WhatsApp when you tap Order
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Mess kitchen delivery staff reads this structured ticket for swift packaging.
              </span>
            </div>
          </div>

          {/* Past Academic Block Orders Tracking */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Your Academic Parcel History
                  </h3>
                  <p className="text-xs text-slate-400">Live order status</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">{myOrders.length} orders</span>
            </div>

            <div className="space-y-3">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-100">
                      #{ord.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : ord.status === 'Dispatched'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : ord.status === 'In Kitchen'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-medium">
                    {ord.blockName} • {ord.roomFloor}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {ord.items.map(i => `${i.dishName} (x${i.quantity})`).join(', ')}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{ord.orderTime} • {ord.deliverySlot}</span>
                    <span className="font-bold text-amber-400">
                      {ord.useMessPass ? 'Pass Deducted' : `₹${ord.totalAmount}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
