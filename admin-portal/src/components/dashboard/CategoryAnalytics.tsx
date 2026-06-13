import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CategoryCollection } from '../../models/analytics';

interface CategoryAnalyticsProps {
  data: CategoryCollection[];
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value);

export const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({ data }) => {
  const chartData = data.map((c) => ({
    category: c.category,
    amount: Number(c.totalAmount) || 0,
  }));

  const total = chartData.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Category-Wise Fine Breakdown</h2>
      <p className="text-sm text-gray-500 mb-4">Distribution of paid fine revenue across violation categories</p>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-12 text-center">No category data available yet.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium text-right">Amount</th>
                  <th className="py-2 font-medium text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((c, index) => (
                  <tr key={c.category} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {c.category}
                    </td>
                    <td className="py-2 text-right text-gray-700">{formatCurrency(c.amount)}</td>
                    <td className="py-2 text-right text-gray-500">
                      {total > 0 ? `${((c.amount / total) * 100).toFixed(1)}%` : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
