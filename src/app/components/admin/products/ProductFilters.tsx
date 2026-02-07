"use client";

import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import { useVendors } from "@/app/lib/hooks/api-hooks.ts/use-vendor";

interface ProductFilters {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  vendorId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface Props {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export default function ProductFiltersComponent({ filters, onFiltersChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch vendors for dropdown
  const { data: vendorsData } = useVendors({
    pageNumber: 1,
    pageSize: 1000, // Get all vendors for dropdown
    sortBy: 'businessName',
    sortOrder: 'asc'
  });
  // Filter out vendors with empty business names
  const vendors = (vendorsData?.items || []).filter(vendor =>
    vendor.businessName && vendor.businessName.trim() !== ''
  );

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, pageNumber: 1 });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, pageNumber: 1 });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({ ...filters, dateFrom: dateFrom ? new Date(dateFrom) : undefined, pageNumber: 1 });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({ ...filters, dateTo: dateTo ? new Date(dateTo) : undefined, pageNumber: 1 });
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
    return Object.entries(filters).filter(
      ([key, value]) => !excludeKeys.includes(key) && value !== undefined && value !== ''
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-surface-50"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-surface-50"
          >
            <option value="">All Statuses</option>
            <option value="PendingApproval">Pending Approval</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
            <option value="OutOfStock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-button hover:bg-surface-100 transition-colors text-sm font-medium bg-surface-0"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-500 text-text-inverse text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border-light">
          {/* Vendor Filter */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Vendor
            </label>
            <select
              value={filters.vendorId || ''}
              onChange={(e) => onFiltersChange({ ...filters, vendorId: e.target.value || undefined, pageNumber: 1 })}
              className="w-full px-3 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-surface-50"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-surface-50"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-surface-50"
            />
          </div>

          {/* Clear All Button */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border-default rounded-button hover:bg-surface-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
