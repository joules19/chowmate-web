"use client";

import { DashboardStatsFilters } from "@/app/lib/api/repositories/dashboard-repository";
import { useDashboardStats } from "@/app/lib/hooks/api-hooks.ts/use-dashboard";
import { UsersIcon, BuildingStorefrontIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Bike } from 'lucide-react';

interface Props {
  filters?: DashboardStatsFilters;
}

export default function DashboardStats({ filters }: Props) {
  const { data: stats, isLoading, error, refetch } = useDashboardStats(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-red-600">Failed to load dashboard statistics: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4">
        <p className="text-yellow-600">No dashboard data available</p>
      </div>
    );
  }

  const statItems = [
    {
      name: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: UsersIcon,
      color: "bg-blue-500",
      change: "+12%",
      ariaLabel: `Total customers: ${stats.totalCustomers.toLocaleString()}, increased by 12% from last month`
    },
    {
      name: "Total Vendors",
      value: stats.totalVendors.toLocaleString(),
      icon: BuildingStorefrontIcon,
      color: "bg-green-500",
      change: "+8%",
      badge: stats.pendingVendors > 0 ? `${stats.pendingVendors} pending` : undefined,
      ariaLabel: `Total vendors: ${stats.totalVendors.toLocaleString()}, increased by 8% from last month${stats.pendingVendors > 0 ? `, ${stats.pendingVendors} pending approval` : ''}`
    },
    {
      name: "Total Riders",
      value: stats.totalRiders.toLocaleString(),
      icon: Bike,
      color: "bg-purple-500",
      change: "+15%",
      ariaLabel: `Total riders: ${stats.totalRiders.toLocaleString()}, increased by 15% from last month`
    },
    {
      name: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: "bg-orange-500",
      change: `+${stats.growthRate}%`,
      badge: stats.activeOrders > 0 ? `${stats.activeOrders} active` : undefined,
      ariaLabel: `Total orders: ${stats.totalOrders.toLocaleString()}, increased by ${stats.growthRate}% from last month${stats.activeOrders > 0 ? `, ${stats.activeOrders} currently active` : ''}`
    }
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      role="region"
      aria-label="Dashboard statistics overview"
    >
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500"
            role="article"
            aria-label={item.ariaLabel}
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  {item.name}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {item.value}
                </p>
                {item.badge && (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2"
                    role="status"
                    aria-label={`${item.badge} requiring attention`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div
                className={`${item.color} p-2.5 sm:p-3 rounded-lg flex-shrink-0 ml-3`}
                role="img"
                aria-label={`${item.name} icon`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span
                className="font-medium text-green-500"
                role="status"
                aria-label={`Growth: ${item.change}`}
              >
                {item.change}
              </span>
              <span className="text-gray-500 ml-1 truncate">
                from last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}