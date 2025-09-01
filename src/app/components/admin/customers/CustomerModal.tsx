"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useCustomer, useCustomerOrders } from '@/app/lib/hooks/api-hooks.ts/use-customer';

interface CustomerModalProps {
    customerId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomerModal({ customerId, isOpen, onClose }: CustomerModalProps) {
    const { data: customer, isLoading: customerLoading, error: customerError } = useCustomer(customerId);
    const { data: ordersData, isLoading: ordersLoading } = useCustomerOrders(customerId, { pageSize: 5 });
    // const { data: activities, isLoading: activitiesLoading } = useCustomerActivities(customerId, 10);

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

        switch (status.toLowerCase()) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'suspended':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'inactive':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            case 'banned':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (customerLoading) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-4xl bg-background-secondary rounded-lg shadow-xl p-6">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                                    <div className="space-y-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                                        ))}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    if (customerError || !customer) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md bg-background-secondary rounded-lg shadow-xl p-6">
                                <div className="text-center">
                                    <p className="text-red-600">Failed to load customer details</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl bg-background-secondary rounded-lg shadow-xl overflow-hidden">
                                {/* Header */}
                                <div className="bg-background-tertiary px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                                            <span className="text-lg font-medium text-primary-700">
                                                {customer.firstName[0]}{customer.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                {customer.fullName}
                                            </Dialog.Title>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={getStatusBadge(customer.status)}>
                                                    {customer.status}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Customer since {customer.customerSince}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 p-2 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 max-h-96 overflow-y-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Customer Information */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                        <span className="text-sm text-gray-900">{customer.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                        <span className="text-sm text-gray-900">{customer.phoneNumber}</span>
                                                    </div>
                                                    {customer.address && (
                                                        <div className="flex items-start space-x-3">
                                                            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                            <span className="text-sm text-gray-900">
                                                                {customer.address}
                                                                {customer.city && `, ${customer.city}`}
                                                                {customer.state && `, ${customer.state}`}
                                                                {customer.postalCode && ` ${customer.postalCode}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {customer.dateOfBirth && (
                                                        <div className="flex items-center space-x-3">
                                                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                            <span className="text-sm text-gray-900">
                                                                {new Date(customer.dateOfBirth).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Statistics */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-background-primary p-4 rounded-lg">
                                                        <div className="text-2xl font-bold text-gray-900">{customer.totalOrders}</div>
                                                        <div className="text-sm text-gray-500">Total Orders</div>
                                                    </div>
                                                    <div className="bg-background-primary p-4 rounded-lg">
                                                        <div className="text-2xl font-bold text-gray-900">${customer.totalSpent.toLocaleString()}</div>
                                                        <div className="text-sm text-gray-500">Total Spent</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Orders & Activities */}
                                        <div className="space-y-6">
                                            {/* Recent Orders */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                                                {ordersLoading ? (
                                                    <div className="space-y-2">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                                        ))}
                                                    </div>
                                                ) : ordersData?.items && ordersData.items.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {ordersData.items.slice(0, 5).map((order: any) => (
                                                            <div key={order.orderId} className="border border-gray-200 rounded-lg p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {order.vendorName}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {new Date(order.orderDate).toLocaleDateString()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            ${order.totalAmount.toLocaleString()}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">{order.status}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No orders found</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-background-tertiary px-6 py-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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