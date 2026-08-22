import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Contract, ContractStatus } from '@/types/crm';
import { useContractStore } from '@/stores/useContractStore';
import { useUIStore } from '@/stores/useUIStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/stores/useToastStore';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';

const columnHelper = createColumnHelper<Contract>();

export const ContractsTable: React.FC = () => {
  const {
    contracts,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    billingFilter,
    isLoading,
    fetchContracts,
    setSelectedContract,
    setSearchQuery,
    setStatusFilter,
    setBillingFilter,
    setSorting,
    setPage,
  } = useContractStore();

  const { openDrawer } = useUIStore();

  const handleRowClick = (contract: Contract) => {
    setSelectedContract(contract);
    openDrawer();
  };

  const columns = useMemo(
    () => [
      // 1. Client / Account
      columnHelper.accessor('accountCorporateName', {
        header: 'Client / Account',
        cell: (info) => {
          const contract = info.row.original;
          return (
            <div className="flex items-center gap-3 min-w-[200px]">
              <img
                src={
                  contract.accountLogoUrl ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
                }
                alt={contract.accountCorporateName}
                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
              />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                    {contract.accountCorporateName}
                  </span>
                  {contract.accountTier === 'ENTERPRISE_PLUS' && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded">
                      PLUS
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{contract.accountDomain}</p>
              </div>
            </div>
          );
        },
      }),

      // 2. Contract Title & Number
      columnHelper.accessor('contractNumber', {
        header: 'Contract ID & Title',
        cell: (info) => {
          const contract = info.row.original;
          return (
            <div className="min-w-[220px]">
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {contract.contractNumber}
              </span>
              <p className="text-xs font-medium text-slate-700 mt-1 line-clamp-1">
                {contract.title}
              </p>
            </div>
          );
        },
      }),

      // 3. Total ARR
      columnHelper.accessor('totalValue', {
        header: () => (
          <button
            onClick={() => setSorting('totalValue')}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span>Total ARR</span>
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="text-right sm:text-left">
              <span className="font-bold text-slate-900 text-sm">
                ${val.toLocaleString('en-US')}
              </span>
              <span className="block text-[11px] text-slate-500">
                ${Math.round(info.row.original.monthlyValue).toLocaleString('en-US')}/mo
              </span>
            </div>
          );
        },
      }),

      // 4. Billing Term
      columnHelper.accessor('billingTerm', {
        header: 'Billing',
        cell: (info) => (
          <span className="text-xs font-medium text-slate-600 capitalize">
            {info.getValue().toLowerCase()}
          </span>
        ),
      }),

      // 5. Expiration Date
      columnHelper.accessor('endDate', {
        header: () => (
          <button
            onClick={() => setSorting('endDate')}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span>Expiration</span>
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          </button>
        ),
        cell: (info) => {
          const dateStr = info.getValue();
          const date = new Date(dateStr);
          const isExpiring = info.row.original.status === 'EXPIRING_SOON';

          return (
            <div className="text-xs">
              <span className={`font-medium ${isExpiring ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {info.row.original.autoRenew && (
                <span className="block text-[10px] text-emerald-600 font-semibold">Auto-renews</span>
              )}
            </div>
          );
        },
      }),

      // 6. Status
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const variantMap: Record<ContractStatus, 'active' | 'review' | 'expiring' | 'draft' | 'renewed' | 'danger'> = {
            ACTIVE: 'active',
            IN_REVIEW: 'review',
            EXPIRING_SOON: 'expiring',
            DRAFT: 'draft',
            RENEWED: 'renewed',
            CANCELLED: 'danger',
          };

          const labelMap: Record<ContractStatus, string> = {
            ACTIVE: 'Active',
            IN_REVIEW: 'In Review',
            EXPIRING_SOON: 'Expiring',
            DRAFT: 'Draft',
            RENEWED: 'Renewed',
            CANCELLED: 'Cancelled',
          };

          return (
            <Badge variant={variantMap[status]} withDot size="sm">
              {labelMap[status]}
            </Badge>
          );
        },
      }),

      // 7. Owner
      columnHelper.accessor('ownerName', {
        header: 'Owner',
        cell: (info) => {
          const contract = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <img
                src={
                  contract.ownerAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={contract.ownerName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-xs font-medium text-slate-700 truncate">{contract.ownerName}</span>
            </div>
          );
        },
      }),

      // 8. Actions
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className="flex items-center justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(info.row.original);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="View contract lifecycle details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: contracts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  const statusTabs: { id: ContractStatus | 'ALL'; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Contracts', count: 127 },
    { id: 'ACTIVE', label: 'Active', count: 68 },
    { id: 'IN_REVIEW', label: 'In Review', count: 28 },
    { id: 'EXPIRING_SOON', label: 'Expiring', count: 14 },
    { id: 'DRAFT', label: 'Draft', count: 9 },
    { id: 'RENEWED', label: 'Renewed', count: 8 },
  ];

  const exportToCSV = () => {
    const headers = ['Contract ID', 'Client', 'Title', 'Total ARR', 'Billing', 'End Date', 'Status', 'Owner'];
    const rows = contracts.map((c) => [
      c.contractNumber,
      `"${c.accountCorporateName}"`,
      `"${c.title}"`,
      c.totalValue,
      c.billingTerm,
      c.endDate,
      c.status,
      `"${c.ownerName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ContractPulse_Contracts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export Successful', `Exported ${contracts.length} contracts to CSV.`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-enterprise overflow-hidden">
      {/* Table Top Header / Filters */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top Contracts</h2>
            <p className="text-xs text-slate-500">
              Live enterprise portfolio contracts and lifecycle state pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={() => fetchContracts()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Billing Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Filter by account, ID, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Billing:</span>
            </div>
            <select
              value={billingFilter}
              onChange={(e) => setBillingFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Terms</option>
              <option value="ANNUAL">Annual</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* TanStack Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-3.5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length} className="px-5 py-4">
                    <div className="h-5 bg-slate-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-700">No contracts found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800">
            {totalElements > 0 ? currentPage * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min((currentPage + 1) * pageSize, totalElements)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{totalElements}</span> contracts
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(0)}
            disabled={currentPage === 0}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-semibold text-slate-700">
            Page {currentPage + 1} of {Math.max(totalPages, 1)}
          </span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
