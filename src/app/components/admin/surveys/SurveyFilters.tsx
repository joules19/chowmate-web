"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SurveyFilterDto, SurveyStatus } from '../../../lib/api/repositories/admin-survey-repository';

interface Props {
  filters: SurveyFilterDto;
  onFiltersChange: (filters: SurveyFilterDto) => void;
}

const SurveyFilters = ({ filters, onFiltersChange }: Props) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm, page: 1 });
  };

  const handleStatusChange = (status: SurveyStatus | undefined) => {
    onFiltersChange({ ...filters, status, page: 1 });
  };

  const handleDateRangeChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      pageSize: filters.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = filters.status || filters.searchTerm || filters.startDateFrom || filters.startDateTo || filters.endDateFrom || filters.endDateTo;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search surveys by title or description..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={filters.status?.toString() || ''}
            onChange={(e) => handleStatusChange(e.target.value ? parseInt(e.target.value) as SurveyStatus : undefined)}
            className="w-full px-3 py-2.5 bg-surface-50 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value={SurveyStatus.Draft.toString()}>Draft</option>
            <option value={SurveyStatus.Active.toString()}>Active</option>
            <option value={SurveyStatus.Paused.toString()}>Paused</option>
            <option value={SurveyStatus.Completed.toString()}>Completed</option>
            <option value={SurveyStatus.Archived.toString()}>Archived</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-50 border border-border-default rounded-button text-sm text-text-secondary hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <FunnelIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Advanced Filters</span>
          <span className="sm:hidden">Filters</span>
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 bg-danger-50 border border-danger-200 text-danger-700 rounded-button text-sm hover:bg-danger-100 focus:outline-none focus:ring-2 focus:ring-danger-500"
          >
            <XMarkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-surface-100 border border-border-default rounded-card p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date Range */}
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1">
                Start Date From
              </label>
              <input
                type="date"
                value={filters.startDateFrom || ''}
                onChange={(e) => handleDateRangeChange('startDateFrom', e.target.value)}
                className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1">
                Start Date To
              </label>
              <input
                type="date"
                value={filters.startDateTo || ''}
                onChange={(e) => handleDateRangeChange('startDateTo', e.target.value)}
                className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* End Date Range */}
            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1">
                End Date From
              </label>
              <input
                type="date"
                value={filters.endDateFrom || ''}
                onChange={(e) => handleDateRangeChange('endDateFrom', e.target.value)}
                className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-tertiary mb-1">
                End Date To
              </label>
              <input
                type="date"
                value={filters.endDateTo || ''}
                onChange={(e) => handleDateRangeChange('endDateTo', e.target.value)}
                className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-border-default">
              <div className="flex flex-wrap gap-2">
                {filters.status !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    Status: {SurveyStatus[filters.status]}
                    <button
                      onClick={() => handleStatusChange(undefined)}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    Search: "{filters.searchTerm}"
                    <button
                      onClick={() => handleSearchChange('')}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.startDateFrom && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    Start from: {filters.startDateFrom}
                    <button
                      onClick={() => handleDateRangeChange('startDateFrom', '')}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.startDateTo && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    Start to: {filters.startDateTo}
                    <button
                      onClick={() => handleDateRangeChange('startDateTo', '')}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.endDateFrom && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    End from: {filters.endDateFrom}
                    <button
                      onClick={() => handleDateRangeChange('endDateFrom', '')}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.endDateTo && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
                    End to: {filters.endDateTo}
                    <button
                      onClick={() => handleDateRangeChange('endDateTo', '')}
                      className="ml-1 hover:text-primary-900"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyFilters;