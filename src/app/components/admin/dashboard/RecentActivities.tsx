"use client";

import { ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: 'vendor_approved',
      message: 'Vendor "Pizza Palace" has been approved',
      time: '2 minutes ago',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    },
    {
      id: 2,
      type: 'order_cancelled',
      message: 'Order #ORD-12345 was cancelled by customer',
      time: '5 minutes ago',
      icon: XCircleIcon,
      iconColor: 'text-red-500'
    },
    {
      id: 3,
      type: 'rider_registered',
      message: 'New rider "John Doe" registered and pending verification',
      time: '12 minutes ago',
      icon: ExclamationCircleIcon,
      iconColor: 'text-yellow-500'
    },
    {
      id: 4,
      type: 'vendor_suspended',
      message: 'Vendor "Burger Hub" has been suspended for policy violation',
      time: '25 minutes ago',
      icon: XCircleIcon,
      iconColor: 'text-red-500'
    },
    {
      id: 5,
      type: 'order_completed',
      message: 'Order #ORD-12340 completed successfully',
      time: '32 minutes ago',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    },
    {
      id: 6,
      type: 'user_registered',
      message: 'New user "Sarah Wilson" registered',
      time: '1 hour ago',
      icon: CheckCircleIcon,
      iconColor: 'text-blue-500'
    }
  ];

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
      role="region"
      aria-label="Recent activities"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activities
        </h3>
        <button 
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 self-start sm:self-auto"
          aria-label="View all activities"
        >
          View All
        </button>
      </div>

      <div 
        className="space-y-3 sm:space-y-4"
        role="list"
        aria-label="Activity list"
      >
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              role="listitem"
            >
              <div 
                className={`flex-shrink-0 ${activity.iconColor} p-1`}
                role="img"
                aria-label={`${activity.type} activity`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  {activity.message}
                </p>
                <div className="flex items-center mt-1">
                  <ClockIcon className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" aria-hidden="true" />
                  <span 
                    className="text-xs text-gray-500 dark:text-gray-400"
                    role="status"
                    aria-label={`Activity occurred ${activity.time}`}
                  >
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:ring-2 focus:ring-primary-500 rounded py-2 transition-colors"
          aria-label="Load more activities"
        >
          Load More Activities
        </button>
      </div>
    </div>
  );
}