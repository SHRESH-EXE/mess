import React from 'react';
import { useMess } from '../context/MessContext';
import {
  BookOpen,
  X,
  Clock,
  Flame,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Utensils,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import ChromeButton from './ui/chrome-button';

const HELPLINE_NUMBER = '9335568951';
const WHATSAPP_LINK = 'https://wa.me/919335568951?text=Hello%20Campus%20Mess%20Helpdesk%2C%20I%20need%20assistance%20with%20dining%2Forders.';

export const TourCheatSheetModal: React.FC = () => {
  const { isCheatSheetOpen, setIsCheatSheetOpen, startTour, setActiveTab } = useMess();

  if (!isCheatSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600 border border-orange-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black font-['Outfit'] text-slate-900">
                Campus Dining & Website Guide
              </h2>
              <p className="text-xs text-slate-500">
                Quick cheat sheet for timings, rush hours, rebates, food court, and 24x7 helpdesk.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheatSheetOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 24x7 Helpline Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-orange-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Student Support & Mess Helpline</span>
            </div>
            <div className="text-base font-black text-slate-900 font-mono">
              +91 {HELPLINE_NUMBER}
            </div>
            <div className="text-[11px] text-slate-600">
              Direct line to Food Court counter, Academic block delivery boy, & Mess warden.
            </div>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 cursor-pointer shrink-0 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* 1. Meal Timings & Rush Hours */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            1. Official Dining Hall Timings & Rush Hours
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Breakfast</span>
                <span className="font-mono text-[11px] text-orange-700">07:30 AM - 09:45 AM</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Peak Rush: <strong>08:30 AM - 09:15 AM</strong> (before morning lectures).
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Lunch</span>
                <span className="font-mono text-[11px] text-amber-700">12:15 PM - 02:30 PM</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Peak Rush: <strong>01:00 PM - 01:45 PM</strong>. Academic Block Delivery available.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-200/60 space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>High Tea & Snacks</span>
                <span className="font-mono text-[11px] text-teal-700">05:00 PM - 06:30 PM</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Served fresh with herbal tea, savories, and filter coffee.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-200/60 space-y-1 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Dinner</span>
                <span className="font-mono text-[11px] text-indigo-700">07:45 PM - 10:00 PM</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Peak Rush: <strong>08:30 PM - 09:15 PM</strong>. Pure vegetarian special menu on Friday.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Key Features Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            2. How To Use Each Feature
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <span className="p-1.5 rounded-xl bg-orange-100 text-orange-700 font-bold">1</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">Weekly Menu with Allergen Radar</div>
                <div className="text-slate-600 text-[11px]">
                  Browse day-by-day breakfast, lunch, snacks, and dinner. Dishes containing ingredients matching your medical allergy profile are highlighted automatically.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 font-bold">2</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">QR Scanner & Fast Pass Tap</div>
                <div className="text-slate-600 text-[11px]">
                  Show your dynamic barcode at the mess door or tap "Mark Present" to log meal entry instantly without signing messy physical registers.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <span className="p-1.5 rounded-xl bg-teal-100 text-teal-700 font-bold">3</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">Food Court & Live Wait Predictions</div>
                <div className="text-slate-600 text-[11px]">
                  Order from 6 campus stalls (Rolls, South Indian, Pizza, Chai, Wok, NutriFit). See live queues and exact wait time countdowns before you reach the counter.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <span className="p-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold">4</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">Academic Block Room Delivery</div>
                <div className="text-slate-600 text-[11px]">
                  Stuck in labs or seminar halls? Get packed mess thali delivered right to your classroom desk or project laboratory.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <span className="p-1.5 rounded-xl bg-rose-100 text-rose-700 font-bold">5</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">100% Anonymous Kitchen Reviews</div>
                <div className="text-slate-600 text-[11px]">
                  Share honest ratings on food taste, hygiene, and spice levels. Your name, roll number, and room are strictly withheld for privacy.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setIsCheatSheetOpen(false);
              startTour(0);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Step-by-Step Interactive Tour</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCheatSheetOpen(false)}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
