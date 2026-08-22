import { create } from 'zustand';
import { ExecutiveOverview } from '@/types/crm';
import { crmApi } from '@/services/api';

interface MetricsState {
  overview: ExecutiveOverview | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOverview: () => Promise<void>;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  overview: null,
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const overview = await crmApi.getOverview();
      set({ overview, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
