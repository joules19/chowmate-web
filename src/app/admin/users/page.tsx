"use client";

import { useState } from "react";
import UserManagementTable from "../../components/admin/users/UserManagementTable";
import UserFilters from "../../components/admin/users/UserFilters";
import { SearchFilters } from "../../data/types/api";

export default function UsersPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        {/* Action Button - Mobile Responsive */}
        <button 
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
          aria-label="Add new user"
        >
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <UserFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <UserManagementTable filters={filters} />
    </div>
  );
}