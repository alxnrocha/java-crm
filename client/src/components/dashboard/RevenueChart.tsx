import React, { useState } from 'react';
import { RevenueGrowthPoint } from '@/types/crm';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueGrowthPoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'12M' | '6M' | '3M'>('12M');

  const filteredData =
    timeframe === '3M' ? data.slice(-3) : timeframe === '6M' ? data.slice(-6) : data;

  const formatYAxis = (tick: number) => {
    return `$${(tick / 1_000_000).toFixed(1)}M`;
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 pb-2">
        <CardHeader className="mb-2 pb-0 border-b-0">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Monthly Revenue Growth vs Target</CardTitle>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                On Track
              </span>
            </div>
            <CardDescription>
              Annualized run-rate pacing against corporate board targets ($5.8M forecast)
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['3M', '6M', '12M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </CardHeader>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-sm bg-blue-600" />
            <span>Actual ARR ($4.85M)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400" />
            <span>Target Plan ($4.40M)</span>
          </div>
        </div>
      </div>

      <CardContent className="h-64 pt-2 pr-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748B', fontSize: 11 }}
              domain={[2000000, 6000000]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const actual = payload[0].value as number;
                  const target = payload[1]?.value as number;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-slate-300 border-b border-slate-700 pb-1">{label} 2026</p>
                      <p className="text-blue-400 font-bold">
                        Actual ARR: ${(actual / 1_000_000).toFixed(2)}M
                      </p>
                      {target && (
                        <p className="text-slate-400">
                          Target ARR: ${(target / 1_000_000).toFixed(2)}M
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="actualArr"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
            <Line
              type="monotone"
              dataKey="targetArr"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
