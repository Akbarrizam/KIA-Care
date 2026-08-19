import React from 'react';
import { Home, Activity } from 'lucide-react';

export type PatientTab = 'home' | 'status';

interface BottomNavProps {
  activeTab: PatientTab;
  onTabChange: (tab: PatientTab) => void;
  hasActiveTicket?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveTicket,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-around z-30 shadow-lg">
      <button
        onClick={() => onTabChange('home')}
        className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-teal-700 font-bold bg-teal-50/70' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs">Beranda</span>
      </button>

      <button
        onClick={() => onTabChange('status')}
        className={`flex-1 relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-colors cursor-pointer ${
          activeTab === 'status' ? 'text-teal-700 font-bold bg-teal-50/70' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <Activity className="w-5 h-5" />
          {hasActiveTicket && (
            <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
          )}
        </div>
        <span className="text-xs">Status Antrian</span>
      </button>
    </div>
  );
};
