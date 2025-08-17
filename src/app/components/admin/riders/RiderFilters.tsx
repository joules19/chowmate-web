"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SearchFilters } from "../../../data/types/api";
import { RiderStatus } from "../../../data/types/entities";

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function RiderFilters({ filters, onFiltersChange }: Props) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, page: 1 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Riders
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value={RiderStatus.PendingVerification}>Pending Verification</option>
            <option value={RiderStatus.Active}>Active</option>
            <option value={RiderStatus.Suspended}>Suspended</option>
            <option value={RiderStatus.Inactive}>Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Object.values(filters).filter(Boolean).length} filter(s) applied
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              {45} Online Now
            </button>
            <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
              {12} Pending Verification
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