"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SearchFilters } from "../../../data/types/api";
import { VendorStatus } from "../../../data/types/entities";

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function VendorFilters({ filters, onFiltersChange }: Props) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, page: 1 });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({ ...filters, dateFrom: dateFrom || undefined, page: 1 });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({ ...filters, dateTo: dateTo || undefined, page: 1 });
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search Vendors
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by business name, email, or address..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
            />
          </div>
        </div>

        {/* Status Filter */}
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
            <option value={VendorStatus.PendingApproval}>Pending Approval</option>
            <option value={VendorStatus.Approved}>Approved</option>
            <option value={VendorStatus.UnderReview}>Under Review</option>
            <option value={VendorStatus.Suspended}>Suspended</option>
            <option value={VendorStatus.Rejected}>Rejected</option>
            <option value={VendorStatus.RequiresManualReview}>Manual Review</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-text-tertiary" />
          <span className="text-sm text-text-tertiary">
            Showing vendors with {Object.values(filters).filter(Boolean).length} filter(s) applied
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
              {8} Pending Approval
            </button>
            <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
              {3} Require Attention
            </button>
          </div>

          <button
            onClick={() => onFiltersChange({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}