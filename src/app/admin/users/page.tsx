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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Add User
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