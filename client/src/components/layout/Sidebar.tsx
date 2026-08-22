import React from 'react';
import { useUIStore } from '@/stores/useUIStore';
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Layers,
  RefreshCw,
  BarChart3,
  TrendingUp,
  CheckSquare,
  ShieldAlert,
  Sliders,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    closeMobileMenu,
    openNewContractModal,
  } = useUIStore();

  const mainNav = [
    { label: 'Home', icon: <Home className="w-4 h-4" />, active: true },
    { label: 'Accounts', icon: <Users className="w-4 h-4" />, badge: '8' },
    { label: 'Contracts', icon: <FileText className="w-4 h-4" />, badge: '127' },
    { label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Pipeline', icon: <Layers className="w-4 h-4" /> },
    { label: 'Renewals', icon: <RefreshCw className="w-4 h-4 text-amber-500" />, badge: '14' },
    { label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Forecasting', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const bottomNav = [
    { label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Approvals', icon: <ShieldAlert className="w-4 h-4 text-purple-600" />, badge: '3' },
    { label: 'Integrations', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      {/* Brand Logo & Switcher */}
      <div>
        <div className="h-16 flex items-center px-5 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="truncate">
                <span className="font-extrabold text-slate-900 tracking-tight text-base block leading-none">
                  ContractPulse
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5 block">
                  RevenueOps
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {isMobileMenuOpen && (
            <button
              onClick={closeMobileMenu}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Items */}
        <div className="p-3 space-y-1">
          {(!isSidebarCollapsed || isMobileMenuOpen) && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Platform
            </div>
          )}
          {mainNav.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (isMobileMenuOpen) closeMobileMenu();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                item.active
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3">
                <span className={`${item.active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {(!isSidebarCollapsed || isMobileMenuOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>
              {(!isSidebarCollapsed || isMobileMenuOpen) && item.badge && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    item.active
                      ? 'bg-blue-200/70 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Nav & Collapse Trigger */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {(!isSidebarCollapsed || isMobileMenuOpen) && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
        )}
        {bottomNav.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (isMobileMenuOpen) closeMobileMenu();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title={item.label}
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-400">{item.icon}</span>
              {(!isSidebarCollapsed || isMobileMenuOpen) && (
                <span className="truncate">{item.label}</span>
              )}
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && item.badge && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full font-bold bg-purple-100 text-purple-700">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        {/* Quick CTA when expanded */}
        {(!isSidebarCollapsed || isMobileMenuOpen) && (
          <div className="pt-2">
            <button
              onClick={() => {
                if (isMobileMenuOpen) closeMobileMenu();
                openNewContractModal();
              }}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>New Contract</span>
            </button>
          </div>
        )}

        {/* Desktop Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer mt-1"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex bg-white border-r border-slate-200/90 h-screen sticky top-0 flex-col justify-between transition-all duration-200 z-40 select-none shadow-xs shrink-0 ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
          />
          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
