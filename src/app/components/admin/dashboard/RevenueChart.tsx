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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '7d'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '30d'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="h-80">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-primary-500 rounded-t-sm transition-all duration-300 hover:bg-primary-600"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                  title={`${item.day}: $${item.revenue.toLocaleString()}`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Total Revenue: ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </span>
        <span className="text-green-600 dark:text-green-400 font-medium">
          +12.5% vs previous period
        </span>
      </div>
    </div>
  );
}