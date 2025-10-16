"use client";

import { useState } from 'react';
import { ClockIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ActivityFilters, ActivityLog } from '@/app/data/types/activities';
import { useRecentActivities } from '@/app/lib/hooks/api-hooks.ts/use-dashboard';
import ActivityModal from '../activities/ActivityModal';

interface Props {
  filters?: ActivityFilters;
}

const iconMap: Record<string, string> = {
  'UserPlusIcon': '👤',
  'CheckCircleIcon': '✅',
  'XCircleIcon': '❌',
  'ShoppingBagIcon': '🛍️',
  'TruckIcon': '🚲',
  'XMarkIcon': '❌',
  'UserIcon': '👤',
  'CreditCardIcon': '💳',
  'ExclamationTriangleIcon': '⚠️',
  'InformationCircleIcon': 'ℹ️',
};

// Helper function to convert dollar signs to naira
const convertCurrencyToNaira = (text: string): string => {
  return text.replace(/\$([0-9,]+\.?[0-9]*)/g, '₦$1');
};

export default function RecentActivities({ filters }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{
    type: 'user' | 'entity';
    userId?: string;
    userName?: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
  } | null>(null);

  const queryFilters = {
    ...filters,
    pageSize: 10, // Limit to 10 for dashboard display
  };

  const { data: activitiesData, isLoading, error, refetch } = useRecentActivities(queryFilters);

  const handleViewUserActivities = (userId: string, userName: string) => {
    setSelectedActivity({
      type: 'user',
      userId,
      userName,
    });
    setShowModal(true);
  };

  const handleViewEntityActivities = (entityType: string, entityId: string, entityName: string) => {
    setSelectedActivity({
      type: 'entity',
      entityType,
      entityId,
      entityName,
    });
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6 w-40"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
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
            <p className="text-red-600">Failed to load recent activities: {error.message}</p>
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

  const activities = activitiesData?.items || [];

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
        role="region"
        aria-label="Recent activities"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h3>
          <button
            className="text-sm text-blue-600 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 self-start sm:self-auto transition-colors"
            aria-label="View all activities"
          >
            View All
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
            <p className="text-gray-500">No recent activities</p>
          </div>
        ) : (
          <div
            className="space-y-3 sm:space-y-4"
            role="list"
            aria-label="Activity list"
          >
            {activities.map((activity: ActivityLog) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                role="listitem"
              >
                <div
                  className={`flex-shrink-0 ${activity.iconColor} p-1`}
                  role="img"
                  aria-label={`${activity.type} activity`}
                >
                  <span className="text-lg">{iconMap[activity.icon] || 'ℹ️'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {convertCurrencyToNaira(activity.description)}
                      </p>
                      <div className="flex items-center mt-1">
                        <ClockIcon className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" aria-hidden="true" />
                        <span
                          className="text-xs text-gray-500"
                          role="status"
                          aria-label={`Activity occurred ${activity.timeAgo}`}
                        >
                          {activity.timeAgo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Show user activities button if user info is available */}
                      {activity.userId && activity.userName && (
                        <button
                          onClick={() => handleViewUserActivities(activity.userId!, activity.userName!)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          title={`View ${activity.userName}'s activities`}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      {/* Show entity activities button only if user info is NOT available but entity info is */}
                      {!activity.userId && activity.entityId && activity.entityType && activity.entityName && (
                        <button
                          onClick={() => handleViewEntityActivities(
                            activity.entityType!,
                            activity.entityId!,
                            activity.entityName!
                          )}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          title={`View ${activity.entityName} audit trail`}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 rounded py-2 transition-colors"
            aria-label="Load more activities"
          >
            Load More Activities
          </button>
        </div>
      </div>

      {selectedActivity && (
        <ActivityModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type={selectedActivity.type}
          userId={selectedActivity.userId}
          userName={selectedActivity.userName}
          entityType={selectedActivity.entityType}
          entityId={selectedActivity.entityId}
          entityName={selectedActivity.entityName}
        />
      )}
    </>
  );
}