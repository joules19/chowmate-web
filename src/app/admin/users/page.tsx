"use client";

import { useState } from "react";
// import { PlusIcon } from "@heroicons/react/24/outline";
import { useCustomerStats } from "@/app/lib/hooks/api-hooks.ts/use-customer";
import CustomerFilters from "@/app/components/admin/customers/CustomerFilters";
import CustomerTable from "@/app/components/admin/customers/CustomerTable";
import UserRoleSwitcher from "@/app/components/admin/users/UserRoleSwitcher";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import { CustomerFilters as CustomerFiltersType } from "../../data/types/customer";
import { RoleSwitchResponse } from "../../data/types/vendor";
import { Permission } from "../../data/types/permissions";
import { formatCurrency } from "@/app/lib/utils/currency";


export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFiltersType>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: stats, isLoading: statsLoading } = useCustomerStats();
  const [lastSwitchResult, setLastSwitchResult] = useState<RoleSwitchResponse | null>(null);

  const handleRoleSwitchSuccess = (result: RoleSwitchResponse) => {
    setLastSwitchResult(result);
    // You can add toast notifications here
  };

  const handleRoleSwitchError = (error: string) => {
    // You can add error notifications here
    console.error('Role switch failed:', error);
  };

  return (
    <PermissionGuard permission={Permission.VIEW_USERS}>
      <div className="space-y-6 p-6 bg-background-primary min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Customer Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer accounts and monitor their activity
          </p>

          {/* Quick Stats */}
          {stats && !statsLoading && (
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{stats.totalCustomers.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">Total</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-600">{stats.activeCustomers.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">Active</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-yellow-600">{stats.suspendedCustomers.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">Suspended</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-primary-600">{stats.newCustomersThisMonth.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">New this month</span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <UserRoleSwitcher
          onSuccess={handleRoleSwitchSuccess}
          onError={handleRoleSwitchError}
        />
      </div>

      {/* Role Switch Success Notification */}
      {lastSwitchResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">Role Switch Successful</h3>
              <div className="mt-1 text-sm text-green-700">
                <p>User {lastSwitchResult.userId} switched from {lastSwitchResult.fromRole} to {lastSwitchResult.toRole}</p>
                <p className="text-xs text-green-600 mt-1">Switched at {new Date(lastSwitchResult.switchedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="ml-3 flex-shrink-0">
              <button
                onClick={() => setLastSwitchResult(null)}
                className="inline-flex text-green-400 hover:text-green-500 focus:outline-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-lg">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{stats.totalCustomers > 0 ? Math.round((stats.newCustomersThisMonth / stats.totalCustomers) * 100) : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📈</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Customer Table */}
      <CustomerTable
        filters={filters}
        onFiltersChange={setFilters}
      />
      </div>
    </PermissionGuard>
  );
}