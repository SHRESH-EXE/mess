import React from 'react';
import { NavigationTab } from '../context/MessContext';
import { soundEffects } from '../utils/soundEffects';
import {
  UtensilsCrossed,
  QrCode,
  Store,
  Wallet,
  ShoppingBag
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  walletBalance: number;
  onOpenWallet: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  walletBalance,
  onOpenWallet
}) => {
  const handleTabClick = (tab: NavigationTab) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  const navItems = [
    { id: 'menu' as NavigationTab, label: 'Menu', icon: UtensilsCrossed },
    { id: 'pass' as NavigationTab, label: 'My Pass', icon: QrCode },
    { id: 'foodcourt' as NavigationTab, label: 'Food Court', icon: Store },
    { id: 'nearbyresto' as NavigationTab, label: 'Restros', icon: ShoppingBag }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-orange-200/70 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
                isActive
                  ? 'text-[#ea580c] font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-[#ff7a30] to-[#ff9248] text-white shadow-md shadow-orange-500/25 scale-105'
                    : 'bg-transparent text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 5th Button: Quick Wallet Pill */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            onOpenWallet();
          }}
          className="flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer select-none active:scale-90 text-slate-500 hover:text-slate-800"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-700 flex items-center justify-center shadow-xs">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold font-mono text-amber-800 truncate">
            ₹{walletBalance.toFixed(0)}
          </span>
        </button>
      </div>
    </nav>
  );
};
