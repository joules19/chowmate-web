"use client";

import { useState, useEffect } from 'react';
import {
    EyeIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FunnelIcon
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
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const loadTransactions = async (page: number = 1) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await paymentService.getAllWalletTransactions(
                page,
                pagination.pageSize,
                selectedFilter || undefined
            );

            if (response.isSuccess) {
                setTransactions(response.data.items);
                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalCount: response.data.totalCount,
                    totalPages: response.data.totalPages,
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage
                });
            } else {
                setError(response.message || 'Failed to load transactions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions(1);
    }, [selectedFilter]);

    const handlePageChange = (newPage: number) => {
        loadTransactions(newPage);
    };

    const filteredTransactions = transactions.filter(transaction =>
        !searchQuery ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.narration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    return (
        <div className="bg-surface-0 rounded-card border border-border-light shadow-soft">
            {/* Header with Search and Filter */}
            <div className="px-4 sm:px-6 py-4 border-b border-border-light">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                        Wallet Transactions
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
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

                        {/* Filter Dropdown */}
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
                ) : filteredTransactions.length === 0 ? (
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-0 divide-y divide-border-light">
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-surface-50 transition-colors">
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
                                                    onClick={() => onTransactionSelect(transaction)}
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
                            {filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="bg-surface-50 border border-border-light rounded-card p-4 hover:bg-surface-100 transition-colors"
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
                                            onClick={() => onTransactionSelect(transaction)}
                                            className="p-2 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-button transition-colors"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
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
            {!isLoading && !error && pagination.totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-border-light bg-surface-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-text-secondary">
                            Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} to{' '}
                            {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of{' '}
                            {pagination.totalCount} transactions
                        </div>

                        {/* Mobile Pagination */}
                        <div className="flex sm:hidden items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="px-3 py-2 text-sm font-medium text-text-primary bg-surface-0 border border-border-light rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-2 text-sm text-text-primary">
                                {pagination.pageNumber} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-text-primary bg-surface-0 border border-border-light rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>

                        {/* Desktop Pagination */}
                        <div className="hidden sm:flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="px-3 py-2 text-sm font-medium text-text-primary bg-surface-0 border border-border-light rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.pageNumber <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.pageNumber >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.pageNumber - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-button transition-colors ${pageNum === pagination.pageNumber
                                                ? 'bg-primary-600 text-white'
                                                : 'text-text-primary bg-surface-0 border border-border-light hover:bg-surface-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-text-primary bg-surface-0 border border-border-light rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}