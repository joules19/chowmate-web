"use client";

import { useState } from 'react';
import {
    EyeIcon,
    PauseIcon,
    PlayIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import { CustomerFilters, CustomerSummary } from "../../../data/types/customer";
import { useCustomers, useSuspendCustomer, useActivateCustomer, useDeleteCustomer } from '@/app/lib/hooks/api-hooks.ts/use-customer';
import ActionConfirmModal from './ActionConfirmModal';
import CustomerModal from './CustomerModal';

interface Props {
    filters: CustomerFilters;
    onFiltersChange: (filters: CustomerFilters) => void;
}

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

export default function CustomerTable({ filters, onFiltersChange }: Props) {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'suspend' | 'activate' | 'delete';
        customer: CustomerSummary;
    } | null>(null);

    const { data: customersData, isLoading, error, refetch } = useCustomers(filters);
    
    // Debug logging to see what data we're getting
    console.log('🔍 Customer Table Data:', {
        customersData,
        isLoading,
        error,
        customersArray: customersData?.items,
        customersCount: customersData?.items?.length
    });
    const suspendMutation = useSuspendCustomer();
    const activateMutation = useActivateCustomer();
    const deleteMutation = useDeleteCustomer();

    const handleSort = (sortBy: string) => {
        const currentOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
        onFiltersChange({
            ...filters,
            sortBy,
            sortOrder: currentOrder,
            pageNumber: 1,
        });
    };

    const handlePageChange = (page: number) => {
        onFiltersChange({ ...filters, pageNumber: page });
    };

    const handleViewCustomer = (customer: CustomerSummary) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleActionClick = (type: 'suspend' | 'activate' | 'delete', customer: CustomerSummary) => {
        setConfirmAction({ type, customer });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async (reason?: string) => {
        if (!confirmAction) return;

        const { type, customer } = confirmAction;

        try {
            switch (type) {
                case 'suspend':
                    await suspendMutation.mutateAsync({
                        customerId: customer.id,
                        request: { reason: reason || 'Administrative action', notifyCustomer: true }
                    });
                    break;
                case 'activate':
                    await activateMutation.mutateAsync({
                        customerId: customer.id,
                        request: { reason, notifyCustomer: true }
                    });
                    break;
                case 'delete':
                    await deleteMutation.mutateAsync({
                        customerId: customer.id,
                        request: { reason: reason || 'Administrative deletion', permanentDelete: false }
                    });
                    break;
            }
        } catch (error) {
            console.error(`Failed to ${type} customer:`, error);
        } finally {
            setConfirmAction(null);
            setShowConfirmModal(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
                    <div className="space-y-3">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-red-600">Failed to load customers: {error.message}</p>
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const customers = customersData?.items || [];
    const pagination = customersData ? {
        pageNumber: customersData.pageNumber,
        pageSize: customersData.pageSize,
        totalCount: customersData.totalCount,
        totalPages: Math.ceil(customersData.totalCount / customersData.pageSize),
        page: customersData.pageNumber, // Alias for compatibility
        limit: customersData.pageSize, // Alias for compatibility
        total: customersData.totalCount // Alias for compatibility
    } : null;

    const getSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortOrder === 'asc' ?
            <ChevronUpIcon className="h-4 w-4" /> :
            <ChevronDownIcon className="h-4 w-4" />;
    };

    return (
        <>
            <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-background-tertiary">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Customers ({pagination?.totalCount || 0})
                    </h3>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-background-tertiary">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-background-accent transition-colors"
                                    onClick={() => handleSort('firstName')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Customer</span>
                                        {getSortIcon('firstName')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-background-accent transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Status</span>
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-background-accent transition-colors"
                                    onClick={() => handleSort('totalOrders')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Orders</span>
                                        {getSortIcon('totalOrders')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-background-accent transition-colors"
                                    onClick={() => handleSort('totalSpent')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Total Spent</span>
                                        {getSortIcon('totalSpent')}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-background-accent transition-colors"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Joined</span>
                                        {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-background-secondary divide-y divide-gray-200">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <p className="text-lg font-medium">No customers found</p>
                                            <p className="text-sm mt-1">Try adjusting your search filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-background-accent transition-colors cursor-pointer"
                                        onClick={() => handleViewCustomer(customer)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-primary-700">
                                                            {customer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={getStatusBadge(customer.status)}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {customer.totalOrders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${customer.totalSpent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewCustomer(customer);
                                                    }}
                                                    className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>

                                                {customer.status === 'Active' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActionClick('suspend', customer);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-700 p-1 rounded transition-colors"
                                                        title="Suspend Customer"
                                                    >
                                                        <PauseIcon className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActionClick('activate', customer);
                                                        }}
                                                        className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                                                        title="Activate Customer"
                                                    >
                                                        <PlayIcon className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActionClick('delete', customer);
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                                                    title="Delete Customer"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="bg-background-tertiary px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-background-secondary hover:bg-background-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-background-secondary hover:bg-background-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>

                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {((pagination.page - 1) * pagination.limit) + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{pagination.total}</span>{' '}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-background-secondary text-sm font-medium text-gray-500 hover:bg-background-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const pageNum = Math.max(1, pagination.page - 2) + i;
                                        if (pageNum > pagination.totalPages) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${pageNum === pagination.page
                                                    ? 'z-10 bg-primary-500 border-primary-500 text-white'
                                                    : 'bg-background-secondary border-gray-300 text-gray-500 hover:bg-background-accent'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-background-secondary text-sm font-medium text-gray-500 hover:bg-background-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <CustomerModal
                    customerId={selectedCustomer.id}
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedCustomer(null);
                    }}
                />
            )}

            {/* Action Confirmation Modal */}
            {confirmAction && (
                <ActionConfirmModal
                    isOpen={showConfirmModal}
                    onClose={() => {
                        setShowConfirmModal(false);
                        setConfirmAction(null);
                    }}
                    onConfirm={handleConfirmAction}
                    action={confirmAction.type}
                    itemName={confirmAction.customer.fullName}
                    itemType="customer"
                    requireReason={confirmAction.type !== 'activate'}
                />
            )}
        </>
    );
}