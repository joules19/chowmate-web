"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  LightBulbIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  TagIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { Bike } from 'lucide-react';
import { PermissionService } from "../../../lib/auth/permissions";
import { Permission } from "../../../data/types/permissions";
import { AuthService } from "../../../lib/auth/auth-service";
import Image from "next/image";
import ChowmateLogo from "../../../assets/images/chowmate-dark-mont.png";


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
    icon: Bike,
    permission: Permission.VIEW_RIDERS
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBagIcon,
    permission: Permission.VIEW_ORDERS
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCardIcon,
    permission: Permission.VIEW_PAYMENTS
  },
  {
    name: "Advertisements",
    href: "/admin/advertisements",
    icon: MegaphoneIcon,
    permission: Permission.VIEW_ADVERTISEMENTS
  },
  {
    name: "Product Promotions",
    href: "/admin/promotions",
    icon: TagIcon,
    permission: Permission.VIEW_PROMOTIONS
  },
  {
    name: "Feature Requests",
    href: "/admin/feature-requests",
    icon: LightBulbIcon,
    permission: Permission.VIEW_FEATURE_REQUESTS
  },
  {
    name: "Surveys",
    href: "/admin/surveys",
    icon: ClipboardDocumentListIcon,
    permission: Permission.VIEW_SURVEYS
  },
  // {
  //   name: "Analytics",
  //   href: "/admin/analytics",
  //   icon: ChartPieIcon,
  //   permission: Permission.VIEW_ANALYTICS
  // },
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const user = AuthService.getUser();
    setCurrentUser(user);
  }, []);

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-0 border border-border-default shadow-soft"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <ChevronLeftIcon className="h-6 w-6 text-text-secondary" />
        ) : (
          <ChevronRightIcon className="h-6 w-6 text-text-secondary" />
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
          bg-sidebar-bg border-r border-sidebar-border 
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
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!collapsed && (
              <div className="flex items-center">
                <Link href="/admin/dashboard">
                  <Image
                    src={ChowmateLogo}
                    alt="Chowmate Admin"
                    width={150}
                    height={150}
                    priority
                    className="cursor-pointer"
                  />
                </Link>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-lg hover:bg-sidebar-hover transition-colors focus:ring-2 focus:ring-primary-500"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5 text-text-tertiary" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5 text-text-tertiary" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
              aria-label="Close mobile menu"
            >
              <ChevronLeftIcon className="h-5 w-5 text-text-tertiary" />
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
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'
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
          <div className="p-4 border-t border-sidebar-border">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div
                className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"
                role="img"
                aria-label="Admin user avatar"
              >
                <span className="text-text-inverse text-sm font-medium">
                  {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {currentUser?.firstName && currentUser?.lastName 
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : 'Admin User'
                    }
                  </p>
                  <p className="text-xs text-text-tertiary truncate">
                    {currentUser?.email || 'admin@chowmate.app'}
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