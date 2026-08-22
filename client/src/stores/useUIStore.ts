import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isDrawerOpen: boolean;
  isNewContractModalOpen: boolean;
  isQuickRenewModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  isAmendmentModalOpen: boolean;
  notificationCount: number;

  // Actions
  toggleSidebar: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openNewContractModal: () => void;
  closeNewContractModal: () => void;
  openQuickRenewModal: () => void;
  closeQuickRenewModal: () => void;
  openAmendmentModal: () => void;
  closeAmendmentModal: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isDrawerOpen: false,
  isNewContractModalOpen: false,
  isQuickRenewModalOpen: false,
  isCommandPaletteOpen: false,
  isAmendmentModalOpen: false,
  notificationCount: 12,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openNewContractModal: () => set({ isNewContractModalOpen: true }),
  closeNewContractModal: () => set({ isNewContractModalOpen: false }),
  openQuickRenewModal: () => set({ isQuickRenewModalOpen: true }),
  closeQuickRenewModal: () => set({ isQuickRenewModalOpen: false }),
  openAmendmentModal: () => set({ isAmendmentModalOpen: true }),
  closeAmendmentModal: () => set({ isAmendmentModalOpen: false }),
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));
