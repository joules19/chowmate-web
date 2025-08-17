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
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Rider Management
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage riders and track live locations
            </p>
          </div>
          
          {/* Add Rider Button - Mobile */}
          <button 
            className="w-full sm:w-auto px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium sm:hidden"
            aria-label="Add new rider"
          >
            Add Rider
          </button>
        </div>
        
        {/* View Mode Toggle & Add Button - Desktop */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
          <div 
            className="flex rounded-lg overflow-hidden border border-border-default w-full xs:w-auto"
            role="tablist"
            aria-label="View mode selection"
          >
            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 xs:flex-none px-3 sm:px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                viewMode === 'table' 
                  ? 'bg-primary-500 text-text-inverse' 
                  : 'bg-surface-0 text-text-secondary hover:bg-surface-50'
              }`}
              role="tab"
              aria-selected={viewMode === 'table'}
              aria-label="Switch to table view"
            >
              <span className="hidden sm:inline">Table View</span>
              <span className="sm:hidden">Table</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 xs:flex-none px-3 sm:px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                viewMode === 'map' 
                  ? 'bg-primary-500 text-text-inverse' 
                  : 'bg-surface-0 text-text-secondary hover:bg-surface-50'
              }`}
              role="tab"
              aria-selected={viewMode === 'map'}
              aria-label="Switch to map view"
            >
              <span className="hidden sm:inline">Map View</span>
              <span className="sm:hidden">Map</span>
            </button>
          </div>
          
          {/* Add Rider Button - Desktop */}
          <button 
            className="hidden sm:block px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
            aria-label="Add new rider"
          >
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