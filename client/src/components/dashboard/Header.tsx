import React from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '@/components/ui/Button';
import { Search, Bell, Plus, Building2, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { openCommandPalette, openNewContractModal, notificationCount } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input triggering Command Palette */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-400 text-sm transition-all shadow-xs cursor-pointer group text-left"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-slate-500 font-normal">Search contracts, accounts, metrics...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Org Switcher */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Acme Global Corp</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 rounded font-bold">Enterprise</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 bg-white shadow-2xs transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs leading-none">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* New Contract Button */}
        <Button
          onClick={openNewContractModal}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="font-semibold shadow-xs"
        >
          New Contract
        </Button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Sarah Chen"
            className="w-8 h-8 rounded-full ring-2 ring-slate-100 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
