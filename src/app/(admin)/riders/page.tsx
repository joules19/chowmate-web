"use client";

import { useState } from "react";
import RiderManagementTable from "../../components/admin/riders/RiderManagementTable";
import RiderFilters from "../../components/admin/riders/RiderFilters";
import RiderMap from "../../components/admin/riders/RiderMap";
import { SearchFilters } from "../../data/types/api";

export default function RidersPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Rider Management
        </h1>
        <div className="flex space-x-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 ${viewMode === 'map' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Map View
            </button>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Add Rider
          </button>
        </div>
      </div>

      {viewMode === 'table' && (
        <>
          <RiderFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <RiderManagementTable filters={filters} />
        </>
      )}

      {viewMode === 'map' && <RiderMap />}
    </div>
  );
}