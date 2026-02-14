"use client";

import { useState, useEffect, useCallback } from 'react';
import {
    EyeIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FunnelIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { WalletTransactionDto, WalletTransactionType } from '@/app/data/types/payment';
import { paymentService } from '@/app/lib/api/services/payment-service';

interface Props {
    onTransactionSelect: (transaction: WalletTransactionDto) => void;
}

export default function WalletTransactionsTable({ onTransactionSelect }: Props) {
    const [transactions, setTransactions] = useState<WalletTransactionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<WalletTransactionType | ''>('');
    const [statusFilter, setStatusFilter] = useState<string>('completed'); // Default to 'completed'
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const loadTransactions = useCallback(async (page: number = 1, pageSize?: number) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await paymentService.getAllWalletTransactions(
                page,
                pageSize || pagination.pageSize,
                selectedFilter || undefined
            );

            if (response.isSuccess) {
                setTransactions(response.data.items);
                const paginationData = {
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalCount: response.data.totalCount,
                    totalPages: response.data.totalPages || Math.ceil(response.data.totalCount / response.data.pageSize),
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage
                };
                console.log('🔍 Pagination Data:', paginationData);
                setPagination(paginationData);
            } else {
                setError(response.message || 'Failed to load transactions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    }, [pagination.pageSize, selectedFilter]);

    useEffect(() => {
        loadTransactions(1);
    }, [loadTransactions, statusFilter]);

    const handlePageChange = (newPage: number) => {
        loadTransactions(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize
        }));
        loadTransactions(1, newPageSize);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        
        setSortConfig({ key, direction });
        // Note: In a real implementation, you'd pass sorting to the API
        // For now, we'll just do client-side sorting
    };

    const filteredAndSortedTransactions = transactions
        .filter(transaction => {
            // Status filter
            const statusMatch = statusFilter === '' || 
                transaction.status?.toLowerCase() === statusFilter.toLowerCase();
            
            // Search filter
            const searchMatch = !searchQuery ||
                transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.narration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.userRole?.toLowerCase().includes(searchQuery.toLowerCase());
            
            return statusMatch && searchMatch;
        })
        .sort((a, b) => {
            if (!sortConfig) return 0;
            
            const { key, direction } = sortConfig;
            let aValue = a[key as keyof WalletTransactionDto];
            let bValue = b[key as keyof WalletTransactionDto];
            
            // Handle different data types
            if (key === 'amount') {
                aValue = Number(aValue) || 0;
                bValue = Number(bValue) || 0;
            } else if (key === 'createdAt') {
                aValue = new Date(aValue as string).getTime();
                bValue = new Date(bValue as string).getTime();
            } else {
                aValue = String(aValue || '').toLowerCase();
                bValue = String(bValue || '').toLowerCase();
            }
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const getTransactionTypeColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'credit':
            case 'funding':
                return 'bg-success-100 text-success-700';
            case 'debit':
                return 'bg-danger-100 text-danger-700';
            case 'transfer':
                return 'bg-primary-100 text-primary-700';
            case 'refund':
                return 'bg-warning-100 text-warning-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'bg-success-100 text-success-700';
            case 'pending':
                return 'bg-warning-100 text-warning-700';
            case 'failed':
            case 'cancelled':
                return 'bg-danger-100 text-danger-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case 'customer':
                return 'bg-blue-100 text-blue-700';
            case 'vendor':
                return 'bg-green-100 text-green-700';
            case 'rider':
                return 'bg-purple-100 text-purple-700';
            case 'admin':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generatePaginationButtons = () => {
        const totalPages = pagination.totalPages;
        const currentPage = pagination.pageNumber;
        const buttons = [];
        
        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Always show first page
            buttons.push(1);
            
            if (currentPage <= 4) {
                // Show 1, 2, 3, 4, 5, ..., last
                for (let i = 2; i <= 5; i++) {
                    buttons.push(i);
                }
                buttons.push('...');
                buttons.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Show 1, ..., last-4, last-3, last-2, last-1, last
                buttons.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    buttons.push(i);
                }
            } else {
                // Show 1, ..., current-1, current, current+1, ..., last
                buttons.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    buttons.push(i);
                }
                buttons.push('...');
                buttons.push(totalPages);
            }
        }
        
        return buttons;
    };

    return (
        <div className="bg-surface-0 rounded-card border border-border-light shadow-soft">
            {/* Header with Search and Filter */}
            <div className="px-4 sm:px-6 py-4 border-b border-border-light">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                        Wallet Transactions
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 sm:flex-wrap">
                        {/* Search Input */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search by user, reference, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter Dropdown */}
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-48 pl-10 pr-8 py-2 text-sm border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                            >
                                <option value="">All Status</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Transaction Type Filter Dropdown */}
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value as WalletTransactionType | '')}
                                className="w-full sm:w-48 pl-10 pr-8 py-2 text-sm border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                            >
                                <option value="">All Types</option>
                                <option value={WalletTransactionType.Credit}>Credit</option>
                                <option value={WalletTransactionType.Debit}>Debit</option>
                                <option value={WalletTransactionType.Transfer}>Transfer</option>
                                <option value={WalletTransactionType.Refund}>Refund</option>
                                <option value={WalletTransactionType.Funding}>Funding</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-2 text-text-secondary">Loading transactions...</span>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center">
                        <div className="p-4 bg-danger-50 border border-danger-200 rounded-card">
                            <p className="text-sm text-danger-800">{error}</p>
                        </div>
                    </div>
                ) : filteredAndSortedTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <FunnelIcon className="h-12 w-12 mx-auto text-text-tertiary opacity-50 mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">
                            No transactions found
                        </h3>
                        <p className="text-sm sm:text-base text-text-secondary">
                            {searchQuery ? `No transactions match "${searchQuery}"` : 'No wallet transactions have been recorded yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block">
                            <table className="min-w-full">
                                <thead className="bg-surface-50">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('fullName')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>User</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'fullName' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'fullName' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('userRole')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Role</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'userRole' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'userRole' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('transactionType')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Type</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'transactionType' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'transactionType' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Status</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'status' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'status' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('amount')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Amount</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'amount' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'amount' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Date</span>
                                                <div className="flex flex-col">
                                                    <ChevronUpIcon 
                                                        className={`h-3 w-3 ${
                                                            sortConfig?.key === 'createdAt' && sortConfig?.direction === 'asc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                    <ChevronDownIcon 
                                                        className={`h-3 w-3 -mt-1 ${
                                                            sortConfig?.key === 'createdAt' && sortConfig?.direction === 'desc'
                                                                ? 'text-primary-500'
                                                                : 'text-text-quaternary'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-0 divide-y divide-border-light">
                                    {filteredAndSortedTransactions.map((transaction) => (
                                        <tr 
                                            key={transaction.id} 
                                            className="hover:bg-surface-50 transition-colors cursor-pointer"
                                            onClick={() => onTransactionSelect(transaction)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-text-primary">
                                                        {transaction.fullName || 'Unknown User'}
                                                    </div>
                                                    <div className="text-xs text-text-secondary">
                                                        {transaction.email}
                                                    </div>
                                                    {/* {transaction.narration && (
                                                        <div className="text-xs text-text-tertiary">
                                                            {transaction.narration}
                                                        </div>
                                                    )} */}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(transaction.userRole)}`}>
                                                    {transaction.userRole || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}>
                                                    {transaction.transactionType || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-text-primary">
                                                    {formatCurrency(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-text-primary">
                                                    {formatDate(transaction.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onTransactionSelect(transaction);
                                                    }}
                                                    className="p-2 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-button transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4 p-4">
                            {filteredAndSortedTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="bg-surface-50 border border-border-light rounded-card p-4 hover:bg-surface-100 transition-colors cursor-pointer"
                                    onClick={() => onTransactionSelect(transaction)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-text-primary mb-1">
                                                {transaction.fullName || 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-text-secondary mb-1">
                                                {transaction.email}
                                            </div>
                                            {transaction.phone && (
                                                <div className="text-xs text-text-tertiary">
                                                    {transaction.phone}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTransactionSelect(transaction);
                                            }}
                                            className="p-2 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-button transition-colors"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(transaction.userRole)}`}>
                                                {transaction.userRole || 'Unknown'}
                                            </span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}>
                                                {transaction.transactionType || 'Unknown'}
                                            </span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="text-lg font-semibold text-text-primary">
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        {/* <div className="text-xs text-text-tertiary">
                                            {transaction.reference || `TX-${transaction.id.slice(0, 8)}`}
                                        </div> */}
                                        <div className="text-sm text-text-secondary">
                                            {formatDate(transaction.createdAt)}
                                        </div>
                                    </div>

                                    {/* {transaction.narration && (
                                        <div className="mt-2 text-xs text-text-tertiary italic">
                                            "{transaction.narration}"
                                        </div>
                                    )} */}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && !error && pagination.totalCount > 0 && (
                <div className="bg-surface-0 px-4 py-3 border-t border-border-light sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Page Size Selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-text-secondary">Show</span>
                            <select
                                value={pagination.pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="border border-border-light rounded-button px-3 py-1 text-sm bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-sm text-text-secondary">items</span>
                        </div>

                        {/* Mobile Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className="relative inline-flex items-center px-4 py-2 border border-border-light text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-text-secondary self-center">
                                    Page {pagination.pageNumber} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="relative inline-flex items-center px-4 py-2 border border-border-light text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Desktop Info and Pagination */}
                        <div className="hidden sm:flex sm:items-center sm:justify-between sm:flex-1">
                            <div>
                                <p className="text-sm text-text-secondary">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {((pagination.pageNumber - 1) * pagination.pageSize) + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{pagination.totalCount}</span> transactions
                                </p>
                            </div>

                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(pagination.pageNumber - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    
                                    {generatePaginationButtons().map((page, index) => {
                                        if (page === '...') {
                                            return (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="relative inline-flex items-center px-4 py-2 border border-border-light bg-surface-0 text-sm font-medium text-text-tertiary"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page as number)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === pagination.pageNumber
                                                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                        : 'bg-surface-0 border-border-light text-text-tertiary hover:bg-surface-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => handlePageChange(pagination.pageNumber + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}