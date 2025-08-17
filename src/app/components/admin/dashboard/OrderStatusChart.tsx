"use client";

export default function OrderStatusChart() {
  const statusData = [
    { status: 'Completed', count: 2850, color: 'bg-green-500', percentage: 65 },
    { status: 'Pending', count: 420, color: 'bg-yellow-500', percentage: 15 },
    { status: 'In Progress', count: 380, color: 'bg-blue-500', percentage: 12 },
    { status: 'Cancelled', count: 210, color: 'bg-red-500', percentage: 8 }
  ];

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Order Status Distribution
      </h3>

      <div className="space-y-4">
        {statusData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.status}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                {item.count.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Orders
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}