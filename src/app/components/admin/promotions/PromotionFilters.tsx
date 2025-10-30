"use client";

import { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { PromotionFilters as IPromotionFilters, Vendor, Category } from '@/app/data/types/promotion';
import { useVendors, useCategories } from '@/app/lib/hooks/api-hooks/use-promotions';

interface Props {
  filters: IPromotionFilters;
  onFiltersChange: (filters: IPromotionFilters) => void;
}

export default function PromotionFilters({ filters, onFiltersChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const { data: vendors } = useVendors();
  const { data: categories } = useCategories();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof IPromotionFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value, pageNumber: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: IPromotionFilters = {
      pageNumber: 1,
      pageSize: filters.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      filters.vendorId ||
      filters.categoryId ||
      filters.isActive !== undefined ||
      filters.startDateFrom ||
      filters.startDateTo ||
      filters.endDateFrom ||
      filters.endDateTo ||
      filters.search
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.vendorId) count++;
    if (filters.categoryId) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.startDateFrom) count++;
    if (filters.startDateTo) count++;
    if (filters.endDateFrom) count++;
    if (filters.endDateTo) count++;
    if (filters.search) count++;
    return count;
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
      {/* Filter Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">Filters</h3>
            {hasActiveFilters() && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <button
                onClick={handleReset}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isExpanded ? 'Hide filters' : 'Show filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vendor Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <BuildingStorefrontIcon className="h-4 w-4 inline mr-1" />
                Vendor
              </label>
              <select
                value={localFilters.vendorId || ''}
                onChange={(e) => handleFilterChange('vendorId', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All Vendors</option>
                {vendors?.map((vendor: Vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.businessName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <TagIcon className="h-4 w-4 inline mr-1" />
                Category
              </label>
              <select
                value={localFilters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={localFilters.isActive === undefined ? '' : localFilters.isActive.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('isActive', value === '' ? undefined : value === 'true');
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sort By
              </label>
              <select
                value={`${localFilters.sortBy || 'createdAt'}-${localFilters.sortOrder || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="productName-asc">Product Name A-Z</option>
                <option value="productName-desc">Product Name Z-A</option>
                <option value="discountedPrice-asc">Price Low to High</option>
                <option value="discountedPrice-desc">Price High to Low</option>
                <option value="startDate-desc">Start Date (Latest)</option>
                <option value="endDate-asc">End Date (Soonest)</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date From */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Start Date From
              </label>
              <input
                type="date"
                value={localFilters.startDateFrom || ''}
                onChange={(e) => handleFilterChange('startDateFrom', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* Start Date To */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Start Date To
              </label>
              <input
                type="date"
                value={localFilters.startDateTo || ''}
                onChange={(e) => handleFilterChange('startDateTo', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* End Date From */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                End Date From
              </label>
              <input
                type="date"
                value={localFilters.endDateFrom || ''}
                onChange={(e) => handleFilterChange('endDateFrom', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* End Date To */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                End Date To
              </label>
              <input
                type="date"
                value={localFilters.endDateTo || ''}
                onChange={(e) => handleFilterChange('endDateTo', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-light">
              <span className="text-sm text-text-secondary">Active filters:</span>
              
              {filters.vendorId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Vendor: {vendors?.find(v => v.id === filters.vendorId)?.businessName}
                  <button
                    onClick={() => handleFilterChange('vendorId', undefined)}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-blue-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.categoryId && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {categories?.find(c => c.id === filters.categoryId)?.categoryName}
                  <button
                    onClick={() => handleFilterChange('categoryId', undefined)}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-green-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.isActive !== undefined && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Status: {filters.isActive ? 'Active' : 'Inactive'}
                  <button
                    onClick={() => handleFilterChange('isActive', undefined)}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-purple-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}