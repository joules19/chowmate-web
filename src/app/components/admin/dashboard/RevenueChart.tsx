"use client";

import { useState } from "react";

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState('7d');

  const mockData = {
    '7d': [
      { day: 'Mon', revenue: 15000 },
      { day: 'Tue', revenue: 18000 },
      { day: 'Wed', revenue: 12000 },
      { day: 'Thu', revenue: 22000 },
      { day: 'Fri', revenue: 28000 },
      { day: 'Sat', revenue: 35000 },
      { day: 'Sun', revenue: 31000 }
    ],
    '30d': [
      { day: 'Week 1', revenue: 125000 },
      { day: 'Week 2', revenue: 135000 },
      { day: 'Week 3', revenue: 145000 },
      { day: 'Week 4', revenue: 155000 }
    ]
  };

  const data = mockData[timeRange as keyof typeof mockData];
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div 
      className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6"
      role="region"
      aria-label="Revenue overview chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Revenue Overview
        </h3>
        <div 
          className="flex space-x-1 sm:space-x-2"
          role="tablist"
          aria-label="Time period selection"
        >
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:ring-2 focus:ring-primary-500 ${
              timeRange === '7d'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
            role="tab"
            aria-selected={timeRange === '7d'}
            aria-label="Show 7 days data"
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:ring-2 focus:ring-primary-500 ${
              timeRange === '30d'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-text-tertiary hover:text-text-secondary'
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
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-full bg-primary-500 rounded-t-sm transition-all duration-300 hover:bg-primary-600 group-focus-within:ring-2 group-focus-within:ring-primary-500"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                  title={`${item.day}: $${item.revenue.toLocaleString()}`}
                  role="img"
                  aria-label={`${item.day}: $${item.revenue.toLocaleString()}`}
                  tabIndex={0}
                />
                <span className="text-xs text-text-tertiary mt-2 truncate max-w-full">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <span className="text-text-tertiary">
          Total: ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </span>
        <span 
          className="text-green-600 dark:text-green-400 font-medium"
          role="status"
          aria-label="Revenue increased by 12.5% versus previous period"
        >
          +12.5% vs previous period
        </span>
      </div>
    </div>
  );
}