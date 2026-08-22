import { useEffect } from 'react';
import { useContractStore } from '@/stores/useContractStore';
import { useMetricsStore } from '@/stores/useMetricsStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { KpiCardsSection } from '@/components/dashboard/KpiCardsSection';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatusDonutChart } from '@/components/dashboard/StatusDonutChart';
import { ContractsTable } from '@/components/contracts/ContractsTable';
import { ContractDrawer } from '@/components/contracts/ContractDrawer';
import { NewContractModal } from '@/components/modals/NewContractModal';
import { QuickRenewModal } from '@/components/modals/QuickRenewModal';
import { AddAmendmentModal } from '@/components/modals/AddAmendmentModal';
import { CommandPalette } from '@/components/modals/CommandPalette';

export default function App() {
  const { fetchContracts } = useContractStore();
  const { overview, isLoading: isOverviewLoading, fetchOverview } = useMetricsStore();

  useEffect(() => {
    fetchContracts();
    fetchOverview();
  }, [fetchContracts, fetchOverview]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Dashboard Main Content Container */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Executive Page Title & Live Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Revenue Operations & B2B Contracts
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Executive portfolio overview, ARR run-rate pacing, and active contract lifecycle pipeline
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 shadow-2xs self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Engine Connected</span>
            </div>
          </div>

          {/* 4 KPI Cards Section */}
          <KpiCardsSection
            kpis={overview?.kpis || null}
            isLoading={isOverviewLoading && !overview}
          />

          {/* Analytics Row: Spline Chart + Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={overview?.revenueGrowth || []} />
            </div>
            <div className="lg:col-span-1">
              <StatusDonutChart
                distribution={overview?.statusDistribution || []}
                totalContracts={overview?.totalContractsCount || 127}
              />
            </div>
          </div>

          {/* Contracts TanStack DataTable */}
          <ContractsTable />
        </main>
      </div>

      {/* 3. Interactive Drawers and Modals */}
      <ContractDrawer />
      <NewContractModal />
      <QuickRenewModal />
      <AddAmendmentModal />
      <CommandPalette />
    </div>
  );
}
