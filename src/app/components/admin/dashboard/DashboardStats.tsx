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
      color: "bg-info-500",
      change: "+12%",
      ariaLabel: `Total users: ${data.totalUsers.toLocaleString()}, increased by 12% from last month`
    },
    {
      name: "Total Vendors",
      value: data.totalVendors.toLocaleString(),
      icon: BuildingStorefrontIcon,
      color: "bg-success-500",
      change: "+8%",
      badge: data.pendingVendors > 0 ? `${data.pendingVendors} pending` : undefined,
      ariaLabel: `Total vendors: ${data.totalVendors.toLocaleString()}, increased by 8% from last month${data.pendingVendors > 0 ? `, ${data.pendingVendors} pending approval` : ''}`
    },
    {
      name: "Total Riders",
      value: data.totalRiders.toLocaleString(),
      icon: TruckIcon,
      color: "bg-primary-500",
      change: "+15%",
      ariaLabel: `Total riders: ${data.totalRiders.toLocaleString()}, increased by 15% from last month`
    },
    {
      name: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: "bg-warning-500",
      change: "+22%",
      badge: data.activeOrders > 0 ? `${data.activeOrders} active` : undefined,
      ariaLabel: `Total orders: ${data.totalOrders.toLocaleString()}, increased by 22% from last month${data.activeOrders > 0 ? `, ${data.activeOrders} currently active` : ''}`
    }
  ];

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      role="region"
      aria-label="Dashboard statistics overview"
    >
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={item.name} 
            className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6 transition-all duration-200 hover:shadow-soft-md focus-within:ring-2 focus-within:ring-primary-500"
            role="article"
            aria-label={item.ariaLabel}
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-tertiary mb-1 uppercase tracking-wider">
                  {item.name}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-text-primary truncate">
                  {item.value}
                </p>
                {item.badge && (
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800 mt-2"
                    role="status"
                    aria-label={`${item.badge} requiring attention`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div 
                className={`${item.color} p-2.5 sm:p-3 rounded-soft flex-shrink-0 ml-3`}
                role="img"
                aria-label={`${item.name} icon`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-text-inverse" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span 
                className="font-medium text-success-500"
                role="status"
                aria-label={`Growth: ${item.change}`}
              >
                {item.change}
              </span>
              <span className="text-text-tertiary ml-1 truncate">
                from last month
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}