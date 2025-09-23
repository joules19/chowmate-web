"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { GetAllUsersRequest } from '@/app/data/types/vendor';

interface Props {
  filters: GetAllUsersRequest;
  onFiltersChange: (filters: GetAllUsersRequest) => void;
}

export default function UserFilters({ filters, onFiltersChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof GetAllUsersRequest, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      pageNumber: 1 // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const roles = ['Customer', 'Vendor', 'Rider', 'Admin'];
  const statuses = ['Active', 'Suspended', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="bg-surface-0 rounded-card border border-border-light p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center px-3 py-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary border border-border-light rounded-button"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
            </div>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border-light">
            {/* Email Verified */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Verification
              </label>
              <select
                value={filters.isEmailVerified === undefined ? '' : filters.isEmailVerified.toString()}
                onChange={(e) => handleFilterChange('isEmailVerified', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            {/* Phone Verified */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Verification
              </label>
              <select
                value={filters.isPhoneVerified === undefined ? '' : filters.isPhoneVerified.toString()}
                onChange={(e) => handleFilterChange('isPhoneVerified', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Account Status
              </label>
              <select
                value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Items per page
              </label>
              <select
                value={filters.pageSize || 10}
                onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Created From
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Created To
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-505 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt">Created Date</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="lastLoginAt">Last Login</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}