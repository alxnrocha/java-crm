import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/useUIStore';
import { useContractStore } from '@/stores/useContractStore';
import {
  Search,
  Plus,
  FileText,
  Download,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ReactNode;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, openNewContractModal, toggleSidebar, openDrawer } =
    useUIStore();
  const { contracts, setSelectedContract } = useContractStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const actions: PaletteItem[] = [
    {
      id: 'new-contract',
      title: 'Create New Contract',
      category: 'Actions',
      icon: <Plus className="w-4 h-4 text-blue-600" />,
      perform: () => {
        closeCommandPalette();
        openNewContractModal();
      },
    },
    {
      id: 'export-csv',
      title: 'Export Portfolio CSV Data',
      category: 'Actions',
      icon: <Download className="w-4 h-4 text-slate-600" />,
      perform: () => {
        closeCommandPalette();
      },
    },
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar Navigation',
      category: 'Workspace',
      icon: <Sliders className="w-4 h-4 text-purple-600" />,
      perform: () => {
        toggleSidebar();
        closeCommandPalette();
      },
    },
  ];

  // Search filtered items (contracts + actions)
  const matchingContracts: PaletteItem[] = contracts
    .filter(
      (c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.contractNumber.toLowerCase().includes(query.toLowerCase()) ||
        c.accountCorporateName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((c) => ({
      id: `contract-${c.id}`,
      title: `${c.contractNumber} — ${c.accountCorporateName}`,
      subtitle: `$${c.totalValue.toLocaleString('en-US')} ARR • ${c.status}`,
      category: 'Contracts',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      perform: () => {
        setSelectedContract(c);
        closeCommandPalette();
        openDrawer();
      },
    }));

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const allItems: PaletteItem[] = [...filteredActions, ...matchingContracts];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeCommandPalette}
      />

      {/* Command Box */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search contracts, accounts..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or contracts found.
            </div>
          ) : (
            allItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.perform}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedIndex === idx ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                    {item.icon}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-bold block">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-[11px] text-slate-500 block truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 pl-2">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>ContractPulse Global Command Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
