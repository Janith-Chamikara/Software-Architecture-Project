import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DistrictCollection } from '../../models/analytics';

interface DistrictChartProps {
  data: DistrictCollection[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value);

export const DistrictChart: React.FC<DistrictChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    district: d.district,
    amount: Number(d.totalAmount) || 0,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">District-Wise Fine Collections</h2>
      <p className="text-sm text-gray-500 mb-4">Total revenue collected from paid fines, grouped by district</p>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">No district data available yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="district"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              angle={-30}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="amount" name="Collected Amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
