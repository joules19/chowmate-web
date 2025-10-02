"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    CreditCardIcon,
    PlusIcon,
    UserIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import { UserForRoleSwitch } from '@/app/data/types/vendor';
import { WalletTransactionDto } from '@/app/data/types/payment';
import UserSearchModal from '@/app/components/admin/users/UserFundWalletModal';
import WalletTransactionsTable from '@/app/components/admin/payments/WalletTransactionsTable';
import TransactionDetailsModal from '@/app/components/admin/payments/TransactionDetailsModal';

// Dynamically import WalletFundingModal to prevent SSR issues
const WalletFundingModal = dynamic(
    () => import('@/app/components/admin/payments/WalletFundingModal'),
    { ssr: false }
);

export default function PaymentsPage() {
    const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
    const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserForRoleSwitch | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionDto | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleUserSelect = (user: UserForRoleSwitch) => {
        setSelectedUser(user);
        setIsFundingModalOpen(true);
    };

    const handleFundingComplete = () => {
        setIsFundingModalOpen(false);
        setSelectedUser(null);
        // You can add a toast notification here or refresh data
    };

    const handleFundingCancel = () => {
        setIsFundingModalOpen(false);
        setSelectedUser(null);
    };

    const handleTransactionSelect = (transaction: WalletTransactionDto) => {
        setSelectedTransaction(transaction);
        setIsTransactionDetailsOpen(true);
    };

    const handleTransactionDetailsClose = () => {
        setIsTransactionDetailsOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center flex-wrap">
                            <CreditCardIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary-600" />
                            <span className="break-words">Payments & Wallet Management</span>
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-text-secondary">
                            Manage user wallet funding and view payment transactions
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUserSearchOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-button font-medium transition-colors flex items-center shadow-soft text-sm sm:text-base whitespace-nowrap"
                    >
                        <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Fund User Wallet</span>
                        <span className="sm:hidden">Fund Wallet</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface-0 rounded-card p-4 sm:p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-success-100 rounded-button">
                            <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-success-600" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-text-tertiary">Total Funded Today</p>
                            <p className="text-xl sm:text-2xl font-bold text-text-primary">₦0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-0 rounded-card p-4 sm:p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-primary-100 rounded-button">
                            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-text-tertiary">Users Funded Today</p>
                            <p className="text-xl sm:text-2xl font-bold text-text-primary">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-0 rounded-card p-4 sm:p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-warning-100 rounded-button">
                            <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 text-warning-600" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm font-medium text-text-tertiary">Pending Transactions</p>
                            <p className="text-xl sm:text-2xl font-bold text-text-primary">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Transactions Table */}
            <WalletTransactionsTable onTransactionSelect={handleTransactionSelect} />

            {/* User Search Modal */}
            <UserSearchModal
                isOpen={isUserSearchOpen}
                onClose={() => setIsUserSearchOpen(false)}
                onUserSelect={handleUserSelect}
            />

            {/* Wallet Funding Modal */}
            {isMounted && selectedUser && (
                <WalletFundingModal
                    isOpen={isFundingModalOpen}
                    onClose={handleFundingCancel}
                    user={selectedUser}
                    onSuccess={handleFundingComplete}
                />
            )}

            {/* Transaction Details Modal */}
            <TransactionDetailsModal
                isOpen={isTransactionDetailsOpen}
                onClose={handleTransactionDetailsClose}
                transaction={selectedTransaction}
            />
        </div>
    );
}