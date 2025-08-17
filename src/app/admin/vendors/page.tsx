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
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Vendor Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage vendor applications and approvals
          </p>
        </div>
        
        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-2 lg:gap-3 flex-shrink-0">
          <button 
            className="w-full xs:w-auto px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
            aria-label="Bulk approve vendors"
          >
            <span className="hidden sm:inline">Bulk Approve</span>
            <span className="sm:hidden">Approve</span>
          </button>
          <button 
            className="w-full xs:w-auto px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
            aria-label="Add new vendor"
          >
            <span className="hidden sm:inline">Add Vendor</span>
            <span className="sm:hidden">Add</span>
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