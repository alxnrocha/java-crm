import {
  Account,
  Contract,
  ContractAmendment,
  ContractCreateInput,
  ContractStatus,
  ExecutiveOverview,
  PageResponse,
} from '@/types/crm';
import { EXECUTIVE_OVERVIEW_MOCK, INITIAL_ACCOUNTS, INITIAL_CONTRACTS } from './mockData';

// Mutable in-memory store for standalone/offline preview & GitHub Pages
let inMemoryContracts: Contract[] = [...INITIAL_CONTRACTS];
const inMemoryAccounts: Account[] = [...INITIAL_ACCOUNTS];
let inMemoryOverview: ExecutiveOverview = { ...EXECUTIVE_OVERVIEW_MOCK };

const API_BASE = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:8080/api/v1';

async function tryFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null; // Fallback to mock mode
  }
}

export const crmApi = {
  async getOverview(): Promise<ExecutiveOverview> {
    const remote = await tryFetch<ExecutiveOverview>('/metrics/overview');
    if (remote) return remote;
    return { ...inMemoryOverview };
  },

  async getContracts(params?: {
    search?: string;
    status?: ContractStatus | 'ALL';
    billingTerm?: string;
    page?: number;
    size?: number;
    sortKey?: keyof Contract;
    sortDir?: 'asc' | 'desc';
  }): Promise<PageResponse<Contract>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.billingTerm && params.billingTerm !== 'ALL') query.set('billingTerm', params.billingTerm);
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.size !== undefined) query.set('size', String(params.size));

    const remote = await tryFetch<PageResponse<Contract>>(`/contracts?${query.toString()}`);
    if (remote) return remote;

    // Fallback: Local In-Memory filtering & sorting
    let filtered = [...inMemoryContracts];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.contractNumber.toLowerCase().includes(q) ||
          c.accountCorporateName.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((c) => c.status === params.status);
    }

    if (params?.billingTerm && params.billingTerm !== 'ALL') {
      filtered = filtered.filter((c) => c.billingTerm === params.billingTerm);
    }

    if (params?.sortKey) {
      const key = params.sortKey;
      const dir = params.sortDir === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    const page = params?.page || 0;
    const size = params?.size || 10;
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const content = filtered.slice(page * size, (page + 1) * size);

    return {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };
  },

  async getContractById(id: string): Promise<Contract | null> {
    const remote = await tryFetch<Contract>(`/contracts/${id}`);
    if (remote) return remote;
    const contract = inMemoryContracts.find((c) => c.id === id);
    return contract ? { ...contract } : null;
  },

  async getAccounts(): Promise<Account[]> {
    const remote = await tryFetch<PageResponse<Account>>('/accounts?size=100');
    if (remote) return remote.content;
    return [...inMemoryAccounts];
  },

  async createContract(input: ContractCreateInput): Promise<Contract> {
    const remote = await tryFetch<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (remote) {
      inMemoryContracts.unshift(remote);
      return remote;
    }

    const account = inMemoryAccounts.find((a) => a.id === input.accountId) || inMemoryAccounts[0];
    const newId = `b0000000-0000-0000-0000-${Date.now().toString(16).padStart(12, '0')}`;
    const monthlyValue =
      input.billingTerm === 'ANNUAL'
        ? input.totalValue / 12
        : input.billingTerm === 'QUARTERLY'
          ? input.totalValue / 3
          : input.totalValue;

    const newContract: Contract = {
      id: newId,
      accountId: account.id,
      accountCorporateName: account.corporateName,
      accountDomain: account.domain,
      accountLogoUrl: account.logoUrl,
      accountTier: account.tier,
      contractNumber: `CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: input.title,
      totalValue: input.totalValue,
      monthlyValue,
      billingTerm: input.billingTerm,
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'DRAFT',
      autoRenew: input.autoRenew,
      ownerName: input.ownerName,
      ownerAvatar:
        input.ownerAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amendments: [
        {
          id: `d-${Date.now()}`,
          contractId: newId,
          amendmentTitle: 'Contract Drafted',
          valueDelta: 0,
          effectiveDate: input.startDate,
          authorName: input.ownerName,
          description: 'Initial contract created in system.',
          createdAt: new Date().toISOString(),
        },
      ],
      contacts: account.contacts || [],
    };

    inMemoryContracts.unshift(newContract);
    inMemoryOverview = {
      ...inMemoryOverview,
      totalContractsCount: inMemoryOverview.totalContractsCount + 1,
    };

    return newContract;
  },

  async updateContractStatus(id: string, status: ContractStatus, reason?: string): Promise<Contract> {
    const remote = await tryFetch<Contract>(`/contracts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
    if (remote) {
      inMemoryContracts = inMemoryContracts.map((c) => (c.id === id ? remote : c));
      return remote;
    }

    const index = inMemoryContracts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Contract not found');

    const contract = inMemoryContracts[index];
    const updated: Contract = {
      ...contract,
      status,
      updatedAt: new Date().toISOString(),
      amendments: [
        {
          id: `d-${Date.now()}`,
          contractId: id,
          amendmentTitle: `Status Changed to ${status}`,
          valueDelta: 0,
          effectiveDate: new Date().toISOString().split('T')[0],
          authorName: contract.ownerName,
          description: reason || `Contract state transition to ${status}.`,
          createdAt: new Date().toISOString(),
        },
        ...(contract.amendments || []),
      ],
    };

    inMemoryContracts[index] = updated;
    return updated;
  },

  async addAmendment(
    contractId: string,
    input: {
      amendmentTitle: string;
      valueDelta: number;
      effectiveDate: string;
      authorName: string;
      description?: string;
    }
  ): Promise<ContractAmendment> {
    const remote = await tryFetch<ContractAmendment>(`/contracts/${contractId}/amendments`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (remote) return remote;

    const contract = inMemoryContracts.find((c) => c.id === contractId);
    if (!contract) throw new Error('Contract not found');

    const newAmendment: ContractAmendment = {
      id: `d-${Date.now()}`,
      contractId,
      ...input,
      createdAt: new Date().toISOString(),
    };

    contract.totalValue += input.valueDelta;
    contract.monthlyValue =
      contract.billingTerm === 'ANNUAL' ? contract.totalValue / 12 : contract.totalValue;
    contract.amendments = [newAmendment, ...(contract.amendments || [])];

    return newAmendment;
  },

  async quickRenew(
    contractId: string,
    durationMonths: number = 12,
    rateAdjustmentPercent: number = 5.0
  ): Promise<Contract> {
    const remote = await tryFetch<Contract>(
      `/contracts/${contractId}/quick-renew?durationMonths=${durationMonths}&rateAdjustmentPercent=${rateAdjustmentPercent}`,
      { method: 'POST' }
    );
    if (remote) {
      inMemoryContracts.unshift(remote);
      return remote;
    }

    const current = inMemoryContracts.find((c) => c.id === contractId);
    if (!current) throw new Error('Contract not found');

    current.status = 'RENEWED';

    const multiplier = 1 + rateAdjustmentPercent / 100;
    const newTotal = Math.round(current.totalValue * multiplier);
    const newStartDate = new Date(current.endDate);
    newStartDate.setDate(newStartDate.getDate() + 1);
    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

    const renewedContract: Contract = {
      ...current,
      id: `b0000000-0000-0000-0000-${Date.now().toString(16).padStart(12, '0')}`,
      contractNumber: `CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${current.title} (Renewed)`,
      totalValue: newTotal,
      monthlyValue: current.billingTerm === 'ANNUAL' ? newTotal / 12 : newTotal,
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amendments: [
        {
          id: `d-${Date.now()}`,
          contractId: current.id,
          amendmentTitle: 'Contract Auto-Renewal Executed',
          valueDelta: newTotal - current.totalValue,
          effectiveDate: new Date().toISOString().split('T')[0],
          authorName: current.ownerName,
          description: `Contract successfully renewed with ${rateAdjustmentPercent}% adjustment.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    inMemoryContracts.unshift(renewedContract);
    return renewedContract;
  },
};
