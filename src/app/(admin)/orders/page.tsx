"use client";

import { useState } from "react";
import OrderManagementTable from "../../components/admin/orders/OrderManagementTable";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import OrderTrackingMap from "../../components/admin/orders/OrderTrackingMap";
import { SearchFilters } from "../../data/types/api";

export default function OrdersPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'orderDate',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState<'table' | 'tracking'>('table');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h1>
        <div className="flex space-x-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Order List
            </button>
            <button
              onClick={() => setViewMode('tracking')}
              className={`px-4 py-2 ${viewMode === 'tracking' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Live Tracking
            </button>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
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

      {viewMode === 'tracking' && <OrderTrackingMap />}
    </div>
  );
}