import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/40 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <div>
        <p className="font-semibold">Offline Mode</p>
        <p className="text-[10px] text-amber-100 font-normal">Showing cached mess menus and offline data</p>
      </div>
    </div>
  );
};
