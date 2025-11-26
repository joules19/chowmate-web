"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CustomerClassReportFilterDto } from "@/app/lib/api/repositories/report-repository";

interface CustomerClassReportFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CustomerClassReportFilterDto) => void;
  initialFilters?: CustomerClassReportFilterDto;
}

export default function CustomerClassReportFilters({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: CustomerClassReportFiltersProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [filters, setFilters] = useState<CustomerClassReportFilterDto>({
    startMonth: initialFilters?.startMonth || 1,
    startYear: initialFilters?.startYear || currentYear,
    endMonth: initialFilters?.endMonth || currentMonth,
    endYear: initialFilters?.endYear || currentYear,
    usePercentileClassification: initialFilters?.usePercentileClassification ?? true,
    firstClassThreshold: initialFilters?.firstClassThreshold || 1000,
    middleClassThreshold: initialFilters?.middleClassThreshold || 300,
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
      usePercentileClassification: true,
      firstClassThreshold: 1000,
      middleClassThreshold: 300,
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
                  Customer Class Report Filters
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  Configure report parameters and date range
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

              {/* Classification Method Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-text-primary">Classification Method</h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={filters.usePercentileClassification}
                      onChange={() => setFilters({ ...filters, usePercentileClassification: true })}
                      className="mt-1 h-4 w-4 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-text-primary">
                        Percentile-Based Classification
                      </span>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        Automatically categorizes customers based on spending distribution
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={!filters.usePercentileClassification}
                      onChange={() => setFilters({ ...filters, usePercentileClassification: false })}
                      className="mt-1 h-4 w-4 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-text-primary">
                        Fixed Threshold Classification
                      </span>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        Uses custom spending thresholds to categorize customers
                      </p>
                    </div>
                  </label>
                </div>

                {/* Fixed Thresholds (Only shown when Fixed Threshold is selected) */}
                {!filters.usePercentileClassification && (
                  <div className="mt-4 p-4 bg-surface-100 rounded-soft border border-border-default space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        First Class Threshold (₦)
                      </label>
                      <input
                        type="number"
                        value={filters.firstClassThreshold}
                        onChange={(e) => setFilters({ ...filters, firstClassThreshold: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="1000"
                        min="0"
                        step="100"
                      />
                      <p className="text-xs text-text-tertiary mt-1">
                        Customers spending above this amount
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Middle Class Threshold (₦)
                      </label>
                      <input
                        type="number"
                        value={filters.middleClassThreshold}
                        onChange={(e) => setFilters({ ...filters, middleClassThreshold: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="300"
                        min="0"
                        step="50"
                      />
                      <p className="text-xs text-text-tertiary mt-1">
                        Customers spending between this and first class threshold
                      </p>
                    </div>
                  </div>
                )}
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
