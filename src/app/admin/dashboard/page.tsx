"use client";

import { useState, useEffect } from "react";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import OrderStatusChart from "../../components/admin/dashboard/OrderStatusChart";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";
import { AdminDashboardStats } from "../../data/types/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Overview of your platform analytics
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <button 
            className="w-full xs:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
            aria-label="Export dashboard report"
          >
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="order-1">
          <RevenueChart />
        </div>
        <div className="order-2">
          <OrderStatusChart />
        </div>
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}