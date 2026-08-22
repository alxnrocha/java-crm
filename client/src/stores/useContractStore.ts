import { create } from 'zustand';
import { Contract, ContractCreateInput, ContractStatus } from '@/types/crm';
import { crmApi } from '@/services/api';

interface ContractState {
  contracts: Contract[];
  selectedContract: Contract | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  statusFilter: ContractStatus | 'ALL';
  billingFilter: string;
  sortKey: keyof Contract;
  sortDir: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchContracts: () => Promise<void>;
  setSelectedContract: (contract: Contract | null) => void;
  setSearchQuery: (query: string) => Promise<void>;
  setStatusFilter: (status: ContractStatus | 'ALL') => Promise<void>;
  setBillingFilter: (billing: string) => Promise<void>;
  setSorting: (key: keyof Contract) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  updateContractStatus: (id: string, status: ContractStatus, reason?: string) => Promise<void>;
  quickRenewContract: (id: string, durationMonths?: number, rateAdjustmentPercent?: number) => Promise<Contract>;
  createContract: (input: ContractCreateInput) => Promise<Contract>;
  addAmendment: (
    contractId: string,
    amendment: {
      amendmentTitle: string;
      valueDelta: number;
      effectiveDate: string;
      authorName: string;
      description?: string;
    }
  ) => Promise<void>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  selectedContract: null,
  totalElements: 0,
  totalPages: 1,
  currentPage: 0,
  pageSize: 5,
  searchQuery: '',
  statusFilter: 'ALL',
  billingFilter: 'ALL',
  sortKey: 'totalValue',
  sortDir: 'desc',
  isLoading: false,
  error: null,

  fetchContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, statusFilter, billingFilter, currentPage, pageSize, sortKey, sortDir } = get();
      const res = await crmApi.getContracts({
        search: searchQuery,
        status: statusFilter,
        billingTerm: billingFilter,
        page: currentPage,
        size: pageSize,
        sortKey,
        sortDir,
      });

      set({
        contracts: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        isLoading: false,
      });

      // Update selected contract if currently open
      const currentSelected = get().selectedContract;
      if (currentSelected) {
        const fresh = res.content.find((c) => c.id === currentSelected.id);
        if (fresh) set({ selectedContract: fresh });
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  setSelectedContract: (contract) => {
    set({ selectedContract: contract });
  },

  setSearchQuery: async (query) => {
    set({ searchQuery: query, currentPage: 0 });
    await get().fetchContracts();
  },

  setStatusFilter: async (status) => {
    set({ statusFilter: status, currentPage: 0 });
    await get().fetchContracts();
  },

  setBillingFilter: async (billing) => {
    set({ billingFilter: billing, currentPage: 0 });
    await get().fetchContracts();
  },

  setSorting: async (key) => {
    const { sortKey, sortDir } = get();
    if (sortKey === key) {
      set({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortKey: key, sortDir: 'desc' });
    }
    await get().fetchContracts();
  },

  setPage: async (page) => {
    set({ currentPage: page });
    await get().fetchContracts();
  },

  updateContractStatus: async (id, status, reason) => {
    set({ isLoading: true });
    try {
      const updated = await crmApi.updateContractStatus(id, status, reason);
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id ? updated : c)),
        selectedContract: state.selectedContract?.id === id ? updated : state.selectedContract,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  quickRenewContract: async (id, durationMonths = 12, rateAdjustmentPercent = 5.0) => {
    set({ isLoading: true });
    try {
      const renewed = await crmApi.quickRenew(id, durationMonths, rateAdjustmentPercent);
      await get().fetchContracts();
      set({ selectedContract: renewed, isLoading: false });
      return renewed;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  createContract: async (input) => {
    set({ isLoading: true });
    try {
      const created = await crmApi.createContract(input);
      await get().fetchContracts();
      set({ selectedContract: created, isLoading: false });
      return created;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  addAmendment: async (contractId, amendment) => {
    set({ isLoading: true });
    try {
      await crmApi.addAmendment(contractId, amendment);
      await get().fetchContracts();
      const updated = await crmApi.getContractById(contractId);
      if (updated) set({ selectedContract: updated });
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
