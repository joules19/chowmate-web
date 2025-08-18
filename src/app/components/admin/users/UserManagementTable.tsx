"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CustomerTable from "../../../components/admin/customers/CustomerTable";
import CustomerFilters from "../../../components/admin/customers/CustomerFilters";
import { CustomerFilters as CustomerFiltersType } from "../../../data/types/customer";
import { useCustomerStats } from "@/app/lib/hooks/api-hooks.ts/use-customer";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFiltersType>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { data: stats, isLoading: statsLoading } = useCustomerStats();

  return (
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

        {/* Action Button */}
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
          aria-label="Add new customer"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Add Customer</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">${stats.averageOrderValue.toFixed(2)}</p>
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
  );
}