import React from 'react';
import { StatusDistribution } from '@/types/crm';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface StatusDonutChartProps {
  distribution: StatusDistribution[];
  totalContracts: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  distribution,
  totalContracts,
}) => {
  return (
    <Card className="p-0 overflow-hidden flex flex-col justify-between">
      <div className="p-5 pb-0">
        <CardHeader className="mb-2 pb-0 border-b-0">
          <div>
            <CardTitle>Contract Status Distribution</CardTitle>
            <CardDescription>Breakdown across portfolio states</CardDescription>
          </div>
        </CardHeader>
      </div>

      <CardContent className="pt-0 px-5 pb-5">
        <div className="relative h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
              >
                {distribution.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StatusDistribution;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-0.5">
                        <p className="font-semibold">{data.label}</p>
                        <p className="text-slate-300">
                          {data.count} contracts ({data.percentage}%)
                        </p>
                        <p className="text-emerald-400 font-bold">
                          ${(data.totalArr / 1_000_000).toFixed(2)}M ARR
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 leading-none">
              {totalContracts}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Contracts
            </span>
          </div>
        </div>

        {/* Custom Legend List */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
          {distribution.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-semibold text-slate-900">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
