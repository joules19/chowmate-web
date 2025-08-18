"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ActivityLog } from '@/app/data/types/activities';
import { useEntityActivities, useUserActivities } from '@/app/lib/hooks/api-hooks.ts/use-dashboard';

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'user' | 'entity';
    userId?: string;
    userName?: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
}

const iconMap: Record<string, string> = {
    'UserPlusIcon': '👤',
    'CheckCircleIcon': '✅',
    'XCircleIcon': '❌',
    'ShoppingBagIcon': '🛍️',
    'TruckIcon': '🚛',
    'XMarkIcon': '❌',
    'UserIcon': '👤',
    'CreditCardIcon': '💳',
    'ExclamationTriangleIcon': '⚠️',
    'InformationCircleIcon': 'ℹ️',
};

export default function ActivityModal({
    isOpen,
    onClose,
    type,
    userId,
    userName,
    entityType,
    entityId,
    entityName
}: ActivityModalProps) {
    const [limit, setLimit] = useState(20);

    const userQuery = useUserActivities(userId || '', limit);
    const entityQuery = useEntityActivities(entityType || '', entityId || '', limit);

    const { data: activities, isLoading, error } = type === 'user' ? userQuery : entityQuery;

    const title = type === 'user'
        ? `Activity History - ${userName || 'User'}`
        : `Activity History - ${entityName || `${entityType} ${entityId}`}`;

    const renderActivityItem = (activity: ActivityLog) => (
        <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <div className={`flex-shrink-0 ${activity.iconColor} p-1`}>
                <span className="text-lg">{iconMap[activity.icon] || 'ℹ️'}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${activity.severity === 'Success' ? 'bg-green-100 text-green-800' :
                            activity.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                activity.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                    activity.severity === 'Error' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                        }`}>
                        {activity.severity}
                    </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {activity.description}
                </p>
                <div className="flex items-center text-xs text-gray-400">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>{activity.timeAgo}</span>
                    {activity.additionalData && (
                        <span className="ml-2 text-gray-500">• Additional data available</span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="space-y-3">
                                            {[...Array(5)].map((_, index) => (
                                                <div key={index} className="animate-pulse">
                                                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                                                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                                        <div className="flex-1">
                                                            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : error ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-red-600 text-sm">Failed to load activities: {error.message}</p>
                                        </div>
                                    ) : !activities || activities.length === 0 ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                                            <p className="text-gray-500">No activities found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {activities.map(renderActivityItem)}
                                        </div>
                                    )}
                                </div>

                                {activities && activities.length > 0 && activities.length >= limit && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setLimit(prev => prev + 20)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Load More Activities
                                        </button>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}