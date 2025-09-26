"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    CreditCardIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    UserIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import { UserForRoleSwitch } from '@/app/data/types/vendor';
import UserSearchModal from '@/app/components/admin/users/UserSearchModal';

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

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary flex items-center">
                            <CreditCardIcon className="h-8 w-8 mr-3 text-primary-600" />
                            Payments & Wallet Management
                        </h1>
                        <p className="mt-2 text-text-secondary">
                            Manage user wallet funding and view payment transactions
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUserSearchOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-button font-medium transition-colors flex items-center shadow-soft"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Fund User Wallet
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-surface-0 rounded-card p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-3 bg-success-100 rounded-button">
                            <BanknotesIcon className="h-6 w-6 text-success-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-text-tertiary">Total Funded Today</p>
                            <p className="text-2xl font-bold text-text-primary">₦0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-0 rounded-card p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-3 bg-primary-100 rounded-button">
                            <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-text-tertiary">Users Funded Today</p>
                            <p className="text-2xl font-bold text-text-primary">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-0 rounded-card p-6 border border-border-light shadow-soft">
                    <div className="flex items-center">
                        <div className="p-3 bg-warning-100 rounded-button">
                            <CreditCardIcon className="h-6 w-6 text-warning-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-text-tertiary">Pending Transactions</p>
                            <p className="text-2xl font-bold text-text-primary">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-surface-0 rounded-card border border-border-light shadow-soft">
                <div className="px-6 py-4 border-b border-border-light">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-text-primary">
                            Recent Wallet Funding Transactions
                        </h2>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    className="pl-10 pr-4 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Empty State */}
                    <div className="text-center py-12">
                        <CreditCardIcon className="h-12 w-12 mx-auto text-text-tertiary opacity-50 mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                            No wallet funding transactions yet
                        </h3>
                        <p className="text-text-secondary mb-6">
                            Start by funding a user's wallet to see transaction history here.
                        </p>
                        <button
                            onClick={() => setIsUserSearchOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-button font-medium transition-colors inline-flex items-center"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Fund First Wallet
                        </button>
                    </div>
                </div>
            </div>

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
        </div>
    );
}