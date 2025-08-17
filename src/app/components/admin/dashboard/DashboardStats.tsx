"use client";

import { UsersIcon, BuildingStorefrontIcon, TruckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AdminDashboardStats } from "../../../data/types/api";

interface Props {
  stats: AdminDashboardStats | null;
}

export default function DashboardStats({ stats }: Props) {
  const mockStats: AdminDashboardStats = {
    totalUsers: 1250,
    totalVendors: 85,
    totalRiders: 120,
    totalOrders: 3460,
    pendingVendors: 8,
    activeOrders: 47,
    revenue: 125000,
    growthRate: 12.5
  };

  const data = stats || mockStats;

  const statItems = [
    {
      name: "Total Users",
      value: data.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      name: "Total Vendors",
      value: data.totalVendors.toLocaleString(),
      icon: BuildingStorefrontIcon,
      color: "bg-green-500",
      change: "+8%",
      badge: data.pendingVendors > 0 ? `${data.pendingVendors} pending` : undefined
    },
    {
      name: "Total Riders",
      value: data.totalRiders.toLocaleString(),
      icon: TruckIcon,
      color: "bg-purple-500",
      change: "+15%"
    },
    {
      name: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: "bg-orange-500",
      change: "+22%",
      badge: data.activeOrders > 0 ? `${data.activeOrders} active` : undefined
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {item.value}
                </p>
                {item.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mt-2">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className={`${item.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {item.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}