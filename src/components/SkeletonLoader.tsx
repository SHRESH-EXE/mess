import React from 'react';
import { Loader2 } from 'lucide-react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 space-y-4">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading interface...</p>
    </div>
  );
};
