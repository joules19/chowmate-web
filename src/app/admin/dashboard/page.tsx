"use client";

import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import OrderStatusChart from "../../components/admin/dashboard/OrderStatusChart";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";

export default function AdminDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of your platform analytics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

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