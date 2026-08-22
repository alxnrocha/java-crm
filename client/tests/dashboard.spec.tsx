import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/components/dashboard/Header';
import { KpiCardsSection } from '@/components/dashboard/KpiCardsSection';
import { ContractsTable } from '@/components/contracts/ContractsTable';
import { ContractDrawer } from '@/components/contracts/ContractDrawer';
import { useUIStore } from '@/stores/useUIStore';
import { useContractStore } from '@/stores/useContractStore';
import { INITIAL_CONTRACTS, EXECUTIVE_OVERVIEW_MOCK } from '@/services/mockData';

describe('Executive Dashboard UI & Integration Tests', () => {
  beforeEach(() => {
    useUIStore.setState({
      isSidebarCollapsed: false,
      isDrawerOpen: false,
      isNewContractModalOpen: false,
      isQuickRenewModalOpen: false,
      isCommandPaletteOpen: false,
      notificationCount: 12,
    });

    useContractStore.setState({
      contracts: [...INITIAL_CONTRACTS],
      selectedContract: INITIAL_CONTRACTS[0],
      totalElements: INITIAL_CONTRACTS.length,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10,
      searchQuery: '',
      statusFilter: 'ALL',
      billingFilter: 'ALL',
    });
  });

  it('renders Header with notifications badge and triggers command palette', () => {
    render(<Header />);

    expect(screen.getByText('Acme Global Corp')).toBeInTheDocument();
    expect(screen.getByText('Search contracts, accounts, metrics...')).toBeInTheDocument();
    expect(screen.getByText('9+')).toBeInTheDocument();

    const searchButton = screen.getByText('Search contracts, accounts, metrics...').closest('button');
    if (searchButton) {
      fireEvent.click(searchButton);
      expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
    }
  });

  it('renders KpiCardsSection with formatted financial values', () => {
    render(<KpiCardsSection kpis={EXECUTIVE_OVERVIEW_MOCK.kpis} />);

    expect(screen.getByText('Total ARR')).toBeInTheDocument();
    expect(screen.getByText('$4.85M')).toBeInTheDocument();
    expect(screen.getByText('+18.4%')).toBeInTheDocument();
    expect(screen.getByText('101% Goal')).toBeInTheDocument();
    expect(screen.getByText('14 Contracts')).toBeInTheDocument();
    expect(screen.getByText('114.8%')).toBeInTheDocument();
  });

  it('renders ContractsTable with columns, rows and status pills', () => {
    render(<ContractsTable />);

    expect(screen.getByText('Top Contracts')).toBeInTheDocument();
    expect(screen.getByText('Cloudflare Inc.')).toBeInTheDocument();
    expect(screen.getByText('CTR-2026-8941')).toBeInTheDocument();
    expect(screen.getByText('Stripe, Inc.')).toBeInTheDocument();
  });

  it('opens and renders ContractDrawer with stepper and financial cards', () => {
    useUIStore.setState({ isDrawerOpen: true });
    render(<ContractDrawer />);

    expect(screen.getByText('Master Services Agreement — Cloudflare Inc')).toBeInTheDocument();
    expect(screen.getByText('1. Draft')).toBeInTheDocument();
    expect(screen.getByText('2. Legal Review')).toBeInTheDocument();
    expect(screen.getByText('3. Active')).toBeInTheDocument();
    expect(screen.getByText('4. Renewal')).toBeInTheDocument();
    expect(screen.getByText('Total Contract Value (ARR)')).toBeInTheDocument();
    expect(screen.getByText('$240,000.00')).toBeInTheDocument();
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });
});
