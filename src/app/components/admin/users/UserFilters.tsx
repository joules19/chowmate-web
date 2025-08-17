"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SearchFilters } from "../../../data/types/api";

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function UserFilters({ filters, onFiltersChange }: Props) {
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

  const handleLimitChange = (limit: string) => {
    onFiltersChange({ ...filters, limit: parseInt(limit), page: 1 });
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search Users
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
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

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-text-tertiary" />
          <span className="text-sm text-text-tertiary">
            {Object.values(filters).filter(Boolean).length} filter(s) applied
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-text-tertiary">
              Show:
            </label>
            <select
              value={filters.limit || 10}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="border border-border-default rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            onClick={() => onFiltersChange({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}