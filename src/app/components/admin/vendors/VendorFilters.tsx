"use client";

import { DeliveryType, VendorFilters, VendorStatus } from "@/app/data/types/vendor";
import { useVendorStats } from "@/app/lib/hooks/api-hooks.ts/use-vendor";
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

import { useState } from 'react';

interface Props {
  filters: VendorFilters;
  onFiltersChange: (filters: VendorFilters) => void;
}

export default function VendorFiltersComponent({ filters, onFiltersChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { data: stats } = useVendorStats();

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search, pageNumber: 1 });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, pageNumber: 1 });
  };

  const handleDeliveryTypeChange = (deliveryType: string) => {
    onFiltersChange({ ...filters, deliveryType: deliveryType as DeliveryType || undefined, pageNumber: 1 });
  };

  const handleCityChange = (city: string) => {
    onFiltersChange({ ...filters, city: city || undefined, pageNumber: 1 });
  };

  const handleStateChange = (state: string) => {
    onFiltersChange({ ...filters, state: state || undefined, pageNumber: 1 });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({ ...filters, dateFrom: dateFrom || undefined, pageNumber: 1 });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({ ...filters, dateTo: dateTo || undefined, pageNumber: 1 });
  };

  const handleZoneAssignedChange = (isZoneAssigned: boolean | undefined) => {
    onFiltersChange({ ...filters, isZoneAssigned, pageNumber: 1 });
  };

  const handleVerifiedChange = (isVerified: boolean | undefined) => {
    onFiltersChange({ ...filters, isVerified, pageNumber: 1 });
  };

  const handleCurrentlyOpenChange = (isCurrentlyOpen: boolean | undefined) => {
    onFiltersChange({ ...filters, isCurrentlyOpen, pageNumber: 1 });
  };

  const handleMinRatingChange = (minRating: string) => {
    onFiltersChange({ ...filters, minRating: minRating ? parseFloat(minRating) : undefined, pageNumber: 1 });
  };

  const handleMaxRatingChange = (maxRating: string) => {
    onFiltersChange({ ...filters, maxRating: maxRating ? parseFloat(maxRating) : undefined, pageNumber: 1 });
  };

  const handleBusinessTypeChange = (businessType: string) => {
    onFiltersChange({ ...filters, businessType: businessType || undefined, pageNumber: 1 });
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
      !excludeKeys.includes(key) && value !== undefined && value !== null && value !== ''
    ).length;
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
      {/* Basic Filters */}
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
              placeholder="Search by business name, email, location..."
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
            <option value={VendorStatus.Inactive}>Inactive</option>
          </select>
        </div>

        {/* Delivery Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Delivery Type
          </label>
          <select
            value={filters.deliveryType || ''}
            onChange={(e) => handleDeliveryTypeChange(e.target.value)}
            className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          >
            <option value="">All Types</option>
            <option value={DeliveryType.DeliveryOnly}>Delivery Only</option>
            <option value={DeliveryType.PickupOnly}>Pickup Only</option>
            <option value={DeliveryType.Both}>Both</option>
            <option value={DeliveryType.None}>None</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
        </button>

        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-text-tertiary" />
          <span className="text-sm text-text-tertiary">
            {getActiveFiltersCount()} filter(s) applied
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Location Filters */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city || ''}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                value={filters.state || ''}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              />
            </div>

            {/* Date Range */}
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

            {/* Rating Range */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Min Rating
              </label>
              <select
                value={filters.minRating?.toString() || ''}
                onChange={(e) => handleMinRatingChange(e.target.value)}
                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              >
                <option value="">Any</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Max Rating
              </label>
              <select
                value={filters.maxRating?.toString() || ''}
                onChange={(e) => handleMaxRatingChange(e.target.value)}
                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              >
                <option value="">Any</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Business Type
              </label>
              <select
                value={filters.businessType || ''}
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              >
                <option value="">All Types</option>
                <option value="Restaurant">Restaurant</option>
                <option value="FastFood">Fast Food</option>
                <option value="Cafe">Cafe</option>
                <option value="Bakery">Bakery</option>
                <option value="FoodTruck">Food Truck</option>
                <option value="Catering">Catering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Boolean Filters - Full width row */}
            <div className="xl:col-span-4 lg:col-span-3 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="zoneAssigned"
                    checked={filters.isZoneAssigned === true}
                    onChange={(e) => handleZoneAssignedChange(e.target.checked ? true : undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                  />
                  <label htmlFor="zoneAssigned" className="text-sm text-text-primary">
                    Zone Assigned Only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={filters.isVerified === true}
                    onChange={(e) => handleVerifiedChange(e.target.checked ? true : undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                  />
                  <label htmlFor="verified" className="text-sm text-text-primary">
                    Verified Only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="currentlyOpen"
                    checked={filters.isCurrentlyOpen === true}
                    onChange={(e) => handleCurrentlyOpenChange(e.target.checked ? true : undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                  />
                  <label htmlFor="currentlyOpen" className="text-sm text-text-primary">
                    Currently Open Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Summary and Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Quick Stats from Filters */}
          {stats && (
            <div className="flex space-x-2 text-xs">
              <button
                onClick={() => handleStatusChange(VendorStatus.PendingApproval)}
                className={`px-3 py-1 rounded-full transition-colors ${filters.status === VendorStatus.PendingApproval
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
              >
                {stats.pendingApproval} Pending
              </button>
              <button
                onClick={() => handleStatusChange(VendorStatus.RequiresManualReview)}
                className={`px-3 py-1 rounded-full transition-colors ${filters.status === VendorStatus.RequiresManualReview
                  ? 'bg-purple-200 text-purple-800'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
              >
                {stats.requiresManualReview} Need Review
              </button>
              <button
                onClick={() => handleStatusChange(VendorStatus.Suspended)}
                className={`px-3 py-1 rounded-full transition-colors ${filters.status === VendorStatus.Suspended
                  ? 'bg-red-200 text-red-800'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
              >
                {stats.suspended} Suspended
              </button>
            </div>
          )}
        </div>

        <button
          onClick={clearAllFilters}
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}