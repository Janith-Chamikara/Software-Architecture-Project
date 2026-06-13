import React, { useEffect, useState } from 'react';
import { Wallet, MapPinned, Tags, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { DistrictChart } from '../components/dashboard/DistrictChart';
import { CategoryAnalytics } from '../components/dashboard/CategoryAnalytics';
import { StatusOverviewChart } from '../components/dashboard/StatusOverviewChart';
import { analyticsService } from '../services/analyticsService';
import type { DashboardStats } from '../models/analytics';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard analytics', err);
        setError('Unable to load dashboard analytics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalPending = stats?.overview.find((o) => o.status === 'PENDING')?.count ?? 0;

  return (
    <DashboardLayout title="Dashboard Overview">
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
          Loading dashboard analytics...
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-lg p-4 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {!isLoading && !error && stats && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Total Revenue Collected"
              value={formatCurrency(Number(stats.totalRevenue) || 0)}
              icon={Wallet}
              accent="bg-green-100 text-green-600"
            />
            <StatCard
              label="Districts Reporting"
              value={String(stats.districtCollections.length)}
              icon={MapPinned}
              accent="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Pending Fines"
              value={String(totalPending)}
              icon={Tags}
              accent="bg-amber-100 text-amber-600"
            />
          </div>

          {/* District-wise chart */}
          <DistrictChart data={stats.districtCollections} />

          {/* Category breakdown + status overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryAnalytics data={stats.categoryCollections} />
            </div>
            <StatusOverviewChart data={stats.overview} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
