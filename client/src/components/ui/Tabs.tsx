import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center gap-1 border-b border-slate-200', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer select-none',
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-semibold',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
