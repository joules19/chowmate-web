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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const filteredMenuItems = menuItems.filter(item => 
    PermissionService.hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <ChevronLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          transition-all duration-300 z-50
          ${collapsed ? 'w-16' : 'w-64'}
          lg:static lg:translate-x-0
          ${mobileMenuOpen 
            ? 'fixed inset-y-0 left-0 translate-x-0' 
            : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0'
          }
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <img 
                  src="/assets/images/chowmate-logo.png" 
                  alt="Chowmate Admin" 
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-xl text-gray-900 dark:text-white">
                  Admin
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close mobile menu"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav 
            className="flex-1 p-4 space-y-1 overflow-y-auto"
            role="menu"
            aria-label="Admin navigation"
          >
            {filteredMenuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${!collapsed ? 'space-x-3' : 'justify-center'}
                    ${isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon 
                    className="h-5 w-5 flex-shrink-0" 
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="font-medium truncate">{item.name}</span>
                  )}
                  {collapsed && (
                    <span className="sr-only">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div 
                className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0"
                role="img"
                aria-label="Admin user avatar"
              >
                <span className="text-white text-sm font-medium">A</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
      </aside>
    </>
  );
}