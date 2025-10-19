"use client";

import { useState } from "react";
import OrderManagementTable from "../../components/admin/orders/OrderManagementTable";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import OrderTrackingMap from "../../components/admin/orders/OrderTrackingMap";
import PendingOrdersTable from "../../components/admin/orders/PendingOrdersTable";
import PermissionGuard from "../../components/admin/guards/PermissionGuard";
import { SearchFilters } from "../../data/types/api";
import { Permission } from "../../data/types/permissions";

export default function OrdersPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'orderDate',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState<'table' | 'tracking' | 'pending'>('table');

  return (
    <PermissionGuard permission={Permission.VIEW_ORDERS}>
      <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Order Management
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Track orders and manage deliveries
            </p>
          </div>
          
          {/* Export Button - Mobile */}
          <button 
            className="w-full sm:w-auto px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium sm:hidden"
            aria-label="Export orders"
          >
            Export
          </button>
        </div>
        
        {/* View Mode Toggle & Export Button - Desktop */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3">
          <div 
            className="flex rounded-lg overflow-hidden border border-border-default w-full xs:w-auto"
            role="tablist"
            aria-label="View mode selection"
          >
            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 xs:flex-none px-2 sm:px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                viewMode === 'table' 
                  ? 'bg-primary-500 text-text-inverse' 
                  : 'bg-surface-0 text-text-secondary hover:bg-surface-50'
              }`}
              role="tab"
              aria-selected={viewMode === 'table'}
              aria-label="Switch to order list view"
            >
              <span className="hidden sm:inline">Order List</span>
              <span className="sm:hidden">List</span>
            </button>
            <button
              onClick={() => setViewMode('pending')}
              className={`flex-1 xs:flex-none px-2 sm:px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                viewMode === 'pending' 
                  ? 'bg-primary-500 text-text-inverse' 
                  : 'bg-surface-0 text-text-secondary hover:bg-surface-50'
              }`}
              role="tab"
              aria-selected={viewMode === 'pending'}
              aria-label="Switch to pending assignment view"
            >
              <span className="hidden sm:inline">Pending Assignment</span>
              <span className="sm:hidden">Pending</span>
            </button>
            <button
              onClick={() => setViewMode('tracking')}
              className={`flex-1 xs:flex-none px-2 sm:px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                viewMode === 'tracking' 
                  ? 'bg-primary-500 text-text-inverse' 
                  : 'bg-surface-0 text-text-secondary hover:bg-surface-50'
              }`}
              role="tab"
              aria-selected={viewMode === 'tracking'}
              aria-label="Switch to live tracking view"
            >
              <span className="hidden sm:inline">Live Tracking</span>
              <span className="sm:hidden">Track</span>
            </button>
          </div>
          
          {/* Export Button - Desktop */}
          <button 
            className="hidden sm:block px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
            aria-label="Export orders"
          >
            Export Orders
          </button>
        </div>
      </div>

      {viewMode === 'table' && (
        <>
          <OrderFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          <OrderManagementTable filters={filters} />
        </>
      )}

      {viewMode === 'pending' && <PendingOrdersTable />}

      {viewMode === 'tracking' && <OrderTrackingMap />}
      </div>
    </PermissionGuard>
  );
}