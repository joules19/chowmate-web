"use client";

export default function OrderStatusChart() {
  const statusData = [
    { status: 'Completed', count: 2850, color: 'bg-green-500', percentage: 65 },
    { status: 'Pending', count: 420, color: 'bg-yellow-500', percentage: 15 },
    { status: 'In Progress', count: 380, color: 'bg-primary-500', percentage: 12 },
    { status: 'Cancelled', count: 210, color: 'bg-red-500', percentage: 8 }
  ];

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div 
      className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4 sm:p-6"
      role="region"
      aria-label="Order status distribution"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-6">
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
              <span className="text-sm font-medium text-text-secondary truncate">
                {item.status}
              </span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div 
                className="flex-1 w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2"
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
              <span className="text-sm font-medium text-text-primary w-12 sm:w-16 text-right flex-shrink-0">
                {item.count.toLocaleString()}
              </span>
              <span className="text-xs text-text-tertiary w-8 sm:w-10 text-right flex-shrink-0">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border-light">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-tertiary">
            Total Orders
          </span>
          <span 
            className="text-lg font-bold text-text-primary"
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