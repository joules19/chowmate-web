"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SearchFilters } from "../../../data/types/api";
import { OrderStatus } from "../../../data/types/order";

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalActiveOrders?: number;
  totalPendingOrders?: number;
  completedToday?: number;
}

export default function OrderFilters({ filters, onFiltersChange, totalActiveOrders, totalPendingOrders, completedToday }: Props) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, page: 1 });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({ ...filters, dateFrom: dateFrom || undefined, page: 1 });
  };

  // const handleDateToChange = (dateTo: string) => {
  //   onFiltersChange({ ...filters, dateTo: dateTo || undefined, page: 1 });
  // };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search Orders
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or vendor..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="RiderAssigned">Rider Assigned</option>
            <option value="RiderArrived">Rider Arrived</option>
            <option value="OutForDelivery">Out for Delivery</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Date Range
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-text-tertiary" />
          <span className="text-sm text-text-tertiary">
            {Object.values(filters).filter(Boolean).length} filter(s) applied
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-2 py-1 text-xs sm:text-sm bg-orange-100 text-orange-800 rounded-full whitespace-nowrap">
              {totalActiveOrders ?? 0} Active
            </button>
            <button className="px-2 py-1 text-xs sm:text-sm bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
              {totalPendingOrders ?? 0} Pending
            </button>
            <button className="px-2 py-1 text-xs sm:text-sm bg-green-100 text-green-800 rounded-full whitespace-nowrap">
              {completedToday ?? 0} Today
            </button>
          </div>

          <button
            onClick={() => onFiltersChange({ page: 1, limit: 10, sortBy: 'orderDate', sortOrder: 'desc' })}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 self-start"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}