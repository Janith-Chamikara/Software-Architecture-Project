import axiosClient from '../api/axiosClient';
import type { DashboardStats } from '../models/analytics';

export const analyticsService = {
  /**
   * Fetches the aggregated nationwide dashboard statistics.
   * GET /admin/analytics/dashboard
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get<DashboardStats>('/admin/analytics/dashboard');
    return response.data;
  },
};
