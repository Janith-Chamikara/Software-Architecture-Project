import React, { useEffect, useState } from 'react';
import { DollarSign, MapPin, Tag, ListChecks } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { DistrictChart } from '../components/dashboard/DistrictChart';
import { StatusOverviewChart } from '../components/dashboard/StatusOverviewChart';
import { CategoryAnalytics } from '../components/dashboard/CategoryAnalytics';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalFines =
    stats?.overview.reduce((sum, s) => sum + s.count, 0) ?? 0;
  const paidCount =
    stats?.overview.find((s) => s.status === 'PAID')?.count ?? 0;
  const districtsCount = stats?.districtCollections.length ?? 0;
  const categoriesCount = stats?.categoryCollections.length ?? 0;

  return (
    <DashboardLayout title="Dashboard">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500 text-sm">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              icon={DollarSign}
              accent="bg-green-100 text-green-600"
            />
            <StatCard
              label="Total Fines"
              value={String(totalFines)}
              icon={ListChecks}
              accent="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Paid Fines"
              value={String(paidCount)}
              icon={Tag}
              accent="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Districts Reporting"
              value={String(districtsCount)}
              icon={MapPin}
              accent="bg-purple-100 text-purple-600"
            />
          </div>

          {/* District + status charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DistrictChart data={stats?.districtCollections ?? []} />
            </div>
            <div>
              <StatusOverviewChart data={stats?.overview ?? []} />
            </div>
          </div>

          {/* Category analytics */}
          {categoriesCount > 0 || !isLoading ? (
            <CategoryAnalytics data={stats?.categoryCollections ?? []} />
          ) : null}
        </div>
      )}
    </DashboardLayout>
  );
};
