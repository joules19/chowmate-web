"use client";

import { OrderStatusFilters } from "@/app/lib/api/repositories/dashboard-repository";
import { useOrderStatusData } from "@/app/lib/hooks/api-hooks.ts/use-dashboard";

interface Props {
  filters?: OrderStatusFilters;
}

export default function OrderStatusChart({ filters }: Props) {
  const { data: statusData, isLoading, error, refetch } = useOrderStatusData(filters);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">Failed to load order status data: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statusData || statusData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-600">No order status data available</p>
        </div>
      </div>
    );
  }

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
      role="region"
      aria-label="Order status distribution"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Order Status Distribution
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {statusData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-3"
            role="group"
            aria-label={`${item.status}: ${item.count} orders, ${item.percentage}%`}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`}
                role="img"
                aria-label={`${item.status} indicator`}
              />
              <span className="text-sm font-medium text-gray-700 truncate">
                {item.status}
              </span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div
                className="flex-1 w-full sm:w-32 bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.percentage}% of orders`}
              >
                <div
                  className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 sm:w-16 text-right flex-shrink-0">
                {item.count.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 w-8 sm:w-10 text-right flex-shrink-0">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">
            Total Orders
          </span>
          <span
            className="text-lg font-bold text-gray-900"
            role="status"
            aria-label={`Total orders: ${total.toLocaleString()}`}
          >
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}