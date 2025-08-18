"use client";

import DashboardStats from "@/app/components/admin/dashboard/DashboardStats";
import OrderStatusChart from "@/app/components/admin/dashboard/OrderStatusChart";
import RevenueChart from "@/app/components/admin/dashboard/RevenueChart";
import { DashboardStatsFilters } from "@/app/lib/api/repositories/dashboard-repository";
import { useState } from "react";


export default function AdminDashboard() {
  const [dateFilters, setDateFilters] = useState<DashboardStatsFilters>({});

  const handleExport = async () => {
    try {
      // TODO: Implement export functionality
      console.log('Export dashboard report', dateFilters);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500"
          >
            Export Report
          </button>
        </div>
      </div>

      <DashboardStats filters={dateFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart filters={dateFilters} />
        <OrderStatusChart filters={dateFilters} />
      </div>
    </div>
  );
}