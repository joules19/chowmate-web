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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Export Report
          </button>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      <RecentActivities />
    </div>
  );
}