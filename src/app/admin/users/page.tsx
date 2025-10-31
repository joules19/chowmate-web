"use client";

import { useState } from "react";
import { UserGroupIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UserManagementTable from "@/app/components/admin/users/UserManagementTable";
import UserRoleSwitcher from "@/app/components/admin/users/UserRoleSwitcher";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import { GetAllUsersRequest, UserSummaryDto, RoleSwitchResponse } from "../../data/types/vendor";
import { Permission } from "../../data/types/permissions";
import { message } from 'antd';

export default function UsersPage() {
  const [filters, setFilters] = useState<GetAllUsersRequest>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    roles: ['Customer'] // Filter to show only customers
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSummaryDto | null>(null);
  const [lastSwitchResult, setLastSwitchResult] = useState<RoleSwitchResponse | null>(null);

  const handleUserSelect = (user: UserSummaryDto) => {
    setSelectedUser(user);
  };

  const handleRoleSwitchSuccess = (result: RoleSwitchResponse) => {
    setLastSwitchResult(result);
    message.success(`User role switched successfully from ${result.fromRole} to ${result.toRole}`);
  };

  const handleRoleSwitchError = (error: string) => {
    message.error(error || 'Failed to switch user role');
    console.error('Role switch failed:', error);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({
      ...prev,
      search: value,
      pageNumber: 1 // Reset to first page when searching
    }));
  };

  return (
    <PermissionGuard permission={Permission.VIEW_USERS}>
      <div className="space-y-6 p-6 bg-background-primary min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Customer Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage customer accounts and monitor their activity
            </p>
          </div>

          <UserRoleSwitcher
            onSuccess={handleRoleSwitchSuccess}
            onError={handleRoleSwitchError}
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
            </div>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {lastSwitchResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">Role Switch Successful</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>User {lastSwitchResult.userId} switched from {lastSwitchResult.fromRole} to {lastSwitchResult.toRole}</p>
                  <p className="text-xs text-green-600 mt-1">Switched at {new Date(lastSwitchResult.switchedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="ml-3 flex-shrink-0">
                <button
                  onClick={() => setLastSwitchResult(null)}
                  className="inline-flex text-green-400 hover:text-green-500 focus:outline-none"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <UserManagementTable
          filters={filters}
          onFiltersChange={setFilters}
          onUserSelect={handleUserSelect}
        />

        {selectedUser && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-primary-800">Selected User</h3>
                <p className="text-sm text-primary-700">
                  {selectedUser.fullName} ({selectedUser.email}) - {selectedUser.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-primary-600 hover:text-primary-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}