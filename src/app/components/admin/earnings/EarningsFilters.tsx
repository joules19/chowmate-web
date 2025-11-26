"use client";

import { useState } from "react";
import { GetOrderEarningsRequest, EarningsDistributionStatus } from "@/app/data/types/earnings";

interface EarningsFiltersProps {
  filters: GetOrderEarningsRequest;
  onFiltersChange: (filters: GetOrderEarningsRequest) => void;
}

export default function EarningsFilters({ filters, onFiltersChange }: EarningsFiltersProps) {
  const [localFilters, setLocalFilters] = useState<GetOrderEarningsRequest>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: GetOrderEarningsRequest = {
      distributionStatus: EarningsDistributionStatus.Completed,
      pageNumber: 1,
      pageSize: 20,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6">
      <h3 className="text-base font-medium text-text-primary mb-4">Filter Earnings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.fromDate || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, fromDate: e.target.value })}
            className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.toDate || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, toDate: e.target.value })}
            className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Distribution Status */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <select
            value={localFilters.distributionStatus ?? ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              distributionStatus: e.target.value ? parseInt(e.target.value) as EarningsDistributionStatus : undefined
            })}
            className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option value="">All Statuses</option>
            <option value={EarningsDistributionStatus.Pending}>Pending</option>
            <option value={EarningsDistributionStatus.Processing}>Processing</option>
            <option value={EarningsDistributionStatus.Completed}>Completed</option>
            <option value={EarningsDistributionStatus.Failed}>Failed</option>
            <option value={EarningsDistributionStatus.Refunding}>Refunding</option>
            <option value={EarningsDistributionStatus.Refunded}>Refunded</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
