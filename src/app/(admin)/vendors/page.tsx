"use client";

import { useState } from "react";
import VendorManagementTable from "../../components/admin/vendors/VendorManagementTable";
import VendorFilters from "../../components/admin/vendors/VendorFilters";
import { SearchFilters } from "../../data/types/api";

export default function VendorsPage() {
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
          Vendor Management
        </h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Bulk Approve
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Add Vendor
          </button>
        </div>
      </div>

      <VendorFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <VendorManagementTable filters={filters} />
    </div>
  );
}