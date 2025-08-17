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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activities
        </h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${activity.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <div className="flex items-center mt-1">
                  <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Load More Activities
        </button>
      </div>
    </div>
  );
}