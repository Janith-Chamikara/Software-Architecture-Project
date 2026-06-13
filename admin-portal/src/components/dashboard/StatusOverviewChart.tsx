import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { StatusOverview } from '../../models/analytics';

interface StatusOverviewChartProps {
  data: StatusOverview[];
}

const STATUS_COLORS: Record<string, string> = {
  PAID: '#16a34a',
  PENDING: '#f59e0b',
  OVERDUE: '#dc2626',
  CANCELLED: '#9ca3af',
};

export const StatusOverviewChart: React.FC<StatusOverviewChartProps> = ({ data }) => {
  const chartData = data.map((s) => ({ status: s.status, count: s.count }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Fine Status Overview</h2>
      <p className="text-sm text-gray-500 mb-4">Count of fines by current status, nationwide</p>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">No status data available yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={STATUS_COLORS[entry.status] ?? '#2563eb'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
