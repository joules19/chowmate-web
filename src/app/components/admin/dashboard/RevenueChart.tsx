"use client";

import { RevenueDataFilters } from "@/app/lib/api/repositories/dashboard-repository";
import { useRevenueData } from "@/app/lib/hooks/api-hooks.ts/use-dashboard";
import { useState } from "react";
import { formatCurrency } from "@/app/lib/utils/currency";

interface Props {
  filters?: RevenueDataFilters;
}

export default function RevenueChart({ filters: propFilters }: Props) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const filters = {
    ...propFilters,
    timeRange,
  };

  const { data, isLoading, error, refetch } = useRevenueData(filters);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6 w-40"></div>
          <div className="h-64 sm:h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">Failed to load revenue data: {error.message}</p>
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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-600">No revenue data available for the selected period</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
      role="region"
      aria-label="Revenue overview chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <div
          className="flex space-x-1 sm:space-x-2"
          role="tablist"
          aria-label="Time period selection"
        >
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${timeRange === '7d'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            role="tab"
            aria-selected={timeRange === '7d'}
            aria-label="Show 7 days data"
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${timeRange === '30d'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            role="tab"
            aria-selected={timeRange === '30d'}
            aria-label="Show 30 days data"
          >
            30 Days
          </button>
        </div>
      </div>

      <div
        className="h-64 sm:h-80"
        role="img"
        aria-label={`Revenue chart showing ${data.length} data points`}
      >
        <div className="flex items-end justify-between h-full space-x-1 sm:space-x-2">
          {data.map((item, index) => {
            const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 group-focus-within:ring-2 group-focus-within:ring-blue-500"
                  style={{ height: `${height}%`, minHeight: height > 0 ? '20px' : '0px' }}
                  title={`${item.day}: ${formatCurrency(item.revenue)}`}
                  role="img"
                  aria-label={`${item.day}: ${formatCurrency(item.revenue)}`}
                  tabIndex={0}
                />
                <span className="text-xs text-gray-500 mt-2 truncate max-w-full">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <span className="text-gray-500">
          Total: {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
        </span>
        <span
          className="text-green-600 font-medium"
          role="status"
          aria-label="Revenue trend"
        >
          {timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
        </span>
      </div>
    </div>
  );
}