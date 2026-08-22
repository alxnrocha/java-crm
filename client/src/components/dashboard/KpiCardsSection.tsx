import React from 'react';
import { KpiMetrics } from '@/types/crm';
import { DollarSign, CreditCard, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface KpiCardsSectionProps {
  kpis: KpiMetrics | null;
  isLoading?: boolean;
}

export const KpiCardsSection: React.FC<KpiCardsSectionProps> = ({ kpis, isLoading }) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-enterprise">
            <Skeleton className="w-24 h-4 mb-3" />
            <Skeleton className="w-36 h-8 mb-2" />
            <Skeleton className="w-28 h-4" />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(2)}M`;
    }
    return `$${val.toLocaleString('en-US')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total ARR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-enterprise hover:shadow-enterprise-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total ARR</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.totalArr)}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            +{kpis.arrGrowthPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">vs. last year ($4.1M)</p>
      </div>

      {/* 2. Active MRR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-enterprise hover:shadow-enterprise-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active MRR</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.activeMrr)}
          </span>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {kpis.mrrAttainmentPercent}% Goal
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(kpis.mrrAttainmentPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Expiring in 90 Days */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-enterprise hover:shadow-enterprise-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring in 90 Days</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.expiringContractsCount} Contracts
          </span>
          <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
            Action Req.
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          <span className="font-semibold text-slate-700">{formatCurrency(kpis.expiringArrAtRisk)}</span> ARR at risk
        </p>
      </div>

      {/* 4. Net Retention Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-enterprise hover:shadow-enterprise-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Retention Rate</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.netRetentionRate}%
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            +{kpis.nrrDeltaPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Industry benchmark: 108%</p>
      </div>
    </div>
  );
};
