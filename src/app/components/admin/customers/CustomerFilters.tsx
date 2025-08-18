"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { CustomerFilters as CF } from "@/app/data/types/customer"

interface Props {
    filters: CF;
    onFiltersChange: (filters: CF) => void;
}

const customerStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Banned', label: 'Banned' },
];

export default function CustomerFilters({ filters, onFiltersChange }: Props) {
    const handleSearchChange = (search: string) => {
        onFiltersChange({ ...filters, search, pageNumber: 1 });
    };

    const handleStatusChange = (status: string) => {
        onFiltersChange({ ...filters, status: status || undefined, pageNumber: 1 });
    };

    const handleDateFromChange = (dateFrom: string) => {
        onFiltersChange({ ...filters, dateFrom: dateFrom || undefined, pageNumber: 1 });
    };

    const handleDateToChange = (dateTo: string) => {
        onFiltersChange({ ...filters, dateTo: dateTo || undefined, pageNumber: 1 });
    };

    const handleLimitChange = (limit: string) => {
        onFiltersChange({ ...filters, pageSize: parseInt(limit), pageNumber: 1 });
    };

    const clearFilters = () => {
        onFiltersChange({
            pageNumber: 1,
            pageSize: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length - 3; // Exclude pagination defaults

    return (
        <div className="bg-background-secondary rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Customers
                    </label>
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 placeholder-gray-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 transition-colors"
                    >
                        {customerStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date From */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => handleDateFromChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 transition-colors"
                    />
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => handleDateToChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 transition-colors"
                    />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {activeFiltersCount} filter(s) applied
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">
                            Show:
                        </label>
                        <select
                            value={filters.pageSize || 10}
                            onChange={(e) => handleLimitChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 transition-colors"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
}