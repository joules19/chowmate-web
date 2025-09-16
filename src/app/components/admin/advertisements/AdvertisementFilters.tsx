"use client";

import { AdvertisementFilters } from "@/app/data/types/advertisement";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';

interface Props {
  filters: AdvertisementFilters;
  onFiltersChange: (filters: AdvertisementFilters) => void;
}

export default function AdvertisementFiltersComponent({ filters, onFiltersChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, pageNumber: 1 });
  };

  const handleUserTypeChange = (userType: string) => {
    const validUserType = userType === '' ? undefined : userType as 'customer' | 'vendor' | 'rider';
    onFiltersChange({ ...filters, userType: validUserType, pageNumber: 1 });
  };

  const handleStatusChange = (isActive: string) => {
    const activeValue = isActive === '' ? undefined : isActive === 'true';
    onFiltersChange({ ...filters, isActive: activeValue, pageNumber: 1 });
  };

  const handleVendorIdChange = (vendorId: string) => {
    onFiltersChange({ ...filters, vendorId: vendorId || undefined, pageNumber: 1 });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getActiveFiltersCount = () => {
    const excludeKeys = ['pageNumber', 'pageSize', 'sortBy', 'sortOrder'];
    return Object.entries(filters).filter(([key, value]) => 
      !excludeKeys.includes(key) && value !== undefined && value !== ''
    ).length;
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 space-y-4">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
          </div>
          <input
            type="text"
            placeholder="Search advertisements..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* User Type Filter */}
        <select
          value={filters.userType || ''}
          onChange={(e) => handleUserTypeChange(e.target.value)}
          className="input-field"
        >
          <option value="">All Target Users</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="rider">Rider</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.isActive === undefined ? '' : filters.isActive.toString()}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="input-field"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-secondary flex items-center space-x-2 flex-1"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Advanced</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border-light pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Vendor ID Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Vendor ID
              </label>
              <input
                type="text"
                placeholder="Enter vendor ID"
                value={filters.vendorId || ''}
                onChange={(e) => handleVendorIdChange(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  sortBy: e.target.value, 
                  pageNumber: 1 
                })}
                className="input-field"
              >
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
                <option value="userType">Target User</option>
                <option value="isActive">Status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  sortOrder: e.target.value as 'asc' | 'desc', 
                  pageNumber: 1 
                })}
                className="input-field"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearAllFilters}
              className="btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}