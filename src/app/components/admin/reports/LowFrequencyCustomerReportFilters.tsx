"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LowFrequencyCustomerFilterDto } from "@/app/lib/api/repositories/report-repository";

interface LowFrequencyCustomerReportFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: LowFrequencyCustomerFilterDto) => void;
  initialFilters?: LowFrequencyCustomerFilterDto;
}

export default function LowFrequencyCustomerReportFilters({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: LowFrequencyCustomerReportFiltersProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [filters, setFilters] = useState<LowFrequencyCustomerFilterDto>({
    startMonth: initialFilters?.startMonth || 1,
    startYear: initialFilters?.startYear || currentYear,
    endMonth: initialFilters?.endMonth || currentMonth,
    endYear: initialFilters?.endYear || currentYear,
    minOrderCount: initialFilters?.minOrderCount ?? 1,
    maxOrderCount: initialFilters?.maxOrderCount ?? 2,
  });

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      startMonth: 1,
      startYear: currentYear,
      endMonth: currentMonth,
      endYear: currentYear,
      minOrderCount: 1,
      maxOrderCount: 2,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-2xl border border-border-light">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
                  Low Frequency Customer Report Filters
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  Configure date range and order count parameters
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-soft transition-colors focus:ring-2 focus:ring-primary-500"
                aria-label="Close filters"
              >
                <XMarkIcon className="h-5 w-5 text-text-tertiary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Date Range Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-text-primary">Date Range</h3>

                {/* Start Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Start Month
                    </label>
                    <select
                      value={filters.startMonth}
                      onChange={(e) => setFilters({ ...filters, startMonth: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Start Year
                    </label>
                    <select
                      value={filters.startYear}
                      onChange={(e) => setFilters({ ...filters, startYear: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      End Month
                    </label>
                    <select
                      value={filters.endMonth}
                      onChange={(e) => setFilters({ ...filters, endMonth: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      End Year
                    </label>
                    <select
                      value={filters.endYear}
                      onChange={(e) => setFilters({ ...filters, endYear: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Count Range Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-text-primary">Order Count Range</h3>
                <p className="text-xs text-text-tertiary">
                  Filter customers by the number of orders they placed during the selected period
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Minimum Order Count
                    </label>
                    <input
                      type="number"
                      value={filters.minOrderCount}
                      onChange={(e) => setFilters({ ...filters, minOrderCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="1"
                      min="1"
                      step="1"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Default: 1
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Maximum Order Count
                    </label>
                    <input
                      type="number"
                      value={filters.maxOrderCount}
                      onChange={(e) => setFilters({ ...filters, maxOrderCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="2"
                      min="1"
                      step="1"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Default: 2
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-info-50 rounded-soft border border-info-200">
                  <p className="text-xs text-info-700">
                    <strong>Tip:</strong> Set both values to the same number (e.g., both 1) to find customers with exactly that many orders.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 p-6 border-t border-border-light bg-surface-50">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
              >
                Reset to Defaults
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
