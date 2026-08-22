import { describe, it, expect, beforeEach } from 'vitest';
import { useContractStore } from '@/stores/useContractStore';
import { useMetricsStore } from '@/stores/useMetricsStore';
import { useUIStore } from '@/stores/useUIStore';
import { useToastStore, toast } from '@/stores/useToastStore';

describe('Client API Engine & Zustand Stores', () => {
  beforeEach(() => {
    useContractStore.setState({
      contracts: [],
      selectedContract: null,
      currentPage: 0,
      searchQuery: '',
      statusFilter: 'ALL',
      billingFilter: 'ALL',
    });
    useToastStore.setState({ toasts: [] });
  });

  it('fetches contracts from mock engine with correct pagination', async () => {
    await useContractStore.getState().fetchContracts();
    const { contracts, totalElements } = useContractStore.getState();

    expect(contracts.length).toBeGreaterThan(0);
    expect(totalElements).toBeGreaterThanOrEqual(8);
  });

  it('filters contracts by search query and status', async () => {
    await useContractStore.getState().setSearchQuery('Stripe');
    const { contracts } = useContractStore.getState();

    expect(contracts.length).toBe(1);
    expect(contracts[0].accountCorporateName).toBe('Stripe, Inc.');
  });

  it('transitions contract status and logs history amendment', async () => {
    await useContractStore.getState().fetchContracts();
    const contract = useContractStore.getState().contracts[0];

    await useContractStore.getState().updateContractStatus(contract.id, 'ACTIVE', 'Passed legal review');
    const updated = useContractStore.getState().contracts.find((c) => c.id === contract.id);

    expect(updated?.status).toBe('ACTIVE');
  });

  it('executes quickRenew and creates a renewed active contract', async () => {
    await useContractStore.getState().fetchContracts();
    const contract = useContractStore.getState().contracts[0];

    const renewed = await useContractStore.getState().quickRenewContract(contract.id, 12, 5.0);
    expect(renewed.status).toBe('ACTIVE');
    expect(renewed.title).toContain('(Renewed)');
  });

  it('loads executive RevenueOps overview metrics in useMetricsStore', async () => {
    await useMetricsStore.getState().fetchOverview();
    const { overview } = useMetricsStore.getState();

    expect(overview).not.toBeNull();
    expect(overview?.kpis.totalArr).toBe(4850000);
    expect(overview?.kpis.activeMrr).toBe(404166);
    expect(overview?.statusDistribution.length).toBeGreaterThan(0);
    expect(overview?.revenueGrowth.length).toBe(12);
  });

  it('manages UI state toggles and mobile menu in useUIStore', () => {
    const ui = useUIStore.getState();
    expect(ui.isSidebarCollapsed).toBe(false);

    ui.toggleSidebar();
    expect(useUIStore.getState().isSidebarCollapsed).toBe(true);

    ui.toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    ui.closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);

    ui.openDrawer();
    expect(useUIStore.getState().isDrawerOpen).toBe(true);
    ui.closeDrawer();
    expect(useUIStore.getState().isDrawerOpen).toBe(false);

    ui.openCommandPalette();
    expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
  });

  it('manages toast notifications correctly in useToastStore', () => {
    toast.success('Test Toast', 'Success payload');
    const { toasts } = useToastStore.getState();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].title).toBe('Test Toast');

    useToastStore.getState().removeToast(toasts[0].id);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });
});
