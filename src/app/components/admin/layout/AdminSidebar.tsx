"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChartBarIcon, 
  UsersIcon, 
  BuildingStorefrontIcon, 
  TruckIcon, 
  ShoppingBagIcon, 
  ChartPieIcon, 
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { PermissionService } from "../../../lib/auth/permissions";
import { Permission } from "../../../data/types/permissions";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: ChartBarIcon,
    permission: Permission.VIEW_DASHBOARD
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UsersIcon,
    permission: Permission.VIEW_USERS
  },
  {
    name: "Vendors",
    href: "/admin/vendors",
    icon: BuildingStorefrontIcon,
    permission: Permission.VIEW_VENDORS
  },
  {
    name: "Riders",
    href: "/admin/riders",
    icon: TruckIcon,
    permission: Permission.VIEW_RIDERS
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBagIcon,
    permission: Permission.VIEW_ORDERS
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: ChartPieIcon,
    permission: Permission.VIEW_ANALYTICS
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Cog6ToothIcon,
    permission: Permission.VIEW_SETTINGS
  }
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const filteredMenuItems = menuItems.filter(item => 
    PermissionService.hasPermission(item.permission)
  );

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/images/chowmate-logo.png" 
                alt="Chowmate" 
                className="h-8 w-auto"
              />
              <span className="font-semibold text-xl text-gray-900 dark:text-white">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  admin@chowmate.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}