"use client";

import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
    XMarkIcon,
    CreditCardIcon,
    ClipboardDocumentIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { WalletTransactionDto } from '@/app/data/types/payment';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    transaction: WalletTransactionDto | null;
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: Props) {
    const [copiedField, setCopiedField] = useState<string>('');

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getTransactionTypeColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'credit':
            case 'funding':
                return 'bg-success-100 text-success-700 border-success-200';
            case 'debit':
                return 'bg-danger-100 text-danger-700 border-danger-200';
            case 'transfer':
                return 'bg-primary-100 text-primary-700 border-primary-200';
            case 'refund':
                return 'bg-warning-100 text-warning-700 border-warning-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'bg-success-100 text-success-700 border-success-200';
            case 'pending':
                return 'bg-warning-100 text-warning-700 border-warning-200';
            case 'failed':
            case 'cancelled':
                return 'bg-danger-100 text-danger-700 border-danger-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getRoleColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case 'customer':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'vendor':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'rider':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'admin':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!transaction) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-2xl mx-4 transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                {/* Header */}
                                <div className="px-4 sm:px-6 py-4 border-b border-border-light">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-text-primary flex items-center">
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            Transaction Details
                                        </h2>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-surface-100 rounded-full transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-4 sm:px-6 py-6">
                                    {/* User Information */}
                                    <div className="mb-6 bg-surface-50 p-4 rounded-card">
                                        <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                                            User Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                    Full Name
                                                </label>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {transaction.fullName || 'Unknown User'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                    User Role
                                                </label>
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(transaction.userRole)}`}>
                                                    {transaction.userRole || 'Unknown'}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                    Email Address
                                                </label>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-text-primary break-all flex-1">
                                                        {transaction.email || 'Not provided'}
                                                    </p>
                                                    {transaction.email && (
                                                        <button
                                                            onClick={() => copyToClipboard(transaction.email!, 'email')}
                                                            className="ml-2 p-1 text-text-tertiary hover:text-primary-600 transition-colors"
                                                            title="Copy Email"
                                                        >
                                                            {copiedField === 'email' ? (
                                                                <CheckIcon className="h-4 w-4 text-success-600" />
                                                            ) : (
                                                                <ClipboardDocumentIcon className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {transaction.phone && (
                                                <div>
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Phone Number
                                                    </label>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-text-primary">
                                                            {transaction.phone}
                                                        </p>
                                                        <button
                                                            onClick={() => copyToClipboard(transaction.phone!, 'phone')}
                                                            className="ml-2 p-1 text-text-tertiary hover:text-primary-600 transition-colors"
                                                            title="Copy Phone Number"
                                                        >
                                                            {copiedField === 'phone' ? (
                                                                <CheckIcon className="h-4 w-4 text-success-600" />
                                                            ) : (
                                                                <ClipboardDocumentIcon className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Transaction Overview */}
                                    <div className="mb-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-text-primary">
                                                    {transaction.reference || `TX-${transaction.id.slice(0, 8)}`}
                                                </h3>
                                                <p className="text-sm text-text-secondary mt-1">
                                                    {transaction.narration || 'No description provided'}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:items-end gap-2">
                                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getTransactionTypeColor(transaction.transactionType)}`}>
                                                    {transaction.transactionType || 'Unknown'}
                                                </span>
                                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Details Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Amount Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                                                Amount Information
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-card border border-primary-200">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Transaction Amount
                                                    </label>
                                                    <p className="text-xl font-bold text-text-primary">
                                                        {formatCurrency(transaction.amount)}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Wallet Balance Before
                                                    </label>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {formatCurrency(transaction.balanceBefore)}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Wallet Balance After
                                                    </label>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {formatCurrency(transaction.balanceAfter)}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Balance Change
                                                    </label>
                                                    <p className={`text-sm font-medium ${
                                                        transaction.balanceAfter > transaction.balanceBefore 
                                                            ? 'text-success-600' 
                                                            : transaction.balanceAfter < transaction.balanceBefore
                                                            ? 'text-danger-600'
                                                            : 'text-text-primary'
                                                    }`}>
                                                        {transaction.balanceAfter > transaction.balanceBefore ? '+' : ''}
                                                        {formatCurrency(transaction.balanceAfter - transaction.balanceBefore)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Transaction Information */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                                                Transaction Information
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Transaction ID
                                                    </label>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-mono text-text-primary break-all">
                                                            {transaction.id}
                                                        </p>
                                                        <button
                                                            onClick={() => copyToClipboard(transaction.id, 'id')}
                                                            className="ml-2 p-1 text-text-tertiary hover:text-primary-600 transition-colors"
                                                            title="Copy Transaction ID"
                                                        >
                                                            {copiedField === 'id' ? (
                                                                <CheckIcon className="h-4 w-4 text-success-600" />
                                                            ) : (
                                                                <ClipboardDocumentIcon className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Wallet Code
                                                    </label>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-mono text-text-primary break-all">
                                                            {transaction.walletCode}
                                                        </p>
                                                        <button
                                                            onClick={() => copyToClipboard(transaction.walletCode, 'walletCode')}
                                                            className="ml-2 p-1 text-text-tertiary hover:text-primary-600 transition-colors"
                                                            title="Copy Wallet Code"
                                                        >
                                                            {copiedField === 'walletCode' ? (
                                                                <CheckIcon className="h-4 w-4 text-success-600" />
                                                            ) : (
                                                                <ClipboardDocumentIcon className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {transaction.reference && (
                                                    <div className="bg-surface-50 p-4 rounded-card">
                                                        <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                            Reference
                                                        </label>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-mono text-text-primary break-all">
                                                                {transaction.reference}
                                                            </p>
                                                            <button
                                                                onClick={() => copyToClipboard(transaction.reference!, 'reference')}
                                                                className="ml-2 p-1 text-text-tertiary hover:text-primary-600 transition-colors"
                                                                title="Copy Reference"
                                                            >
                                                                {copiedField === 'reference' ? (
                                                                    <CheckIcon className="h-4 w-4 text-success-600" />
                                                                ) : (
                                                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="bg-surface-50 p-4 rounded-card">
                                                    <label className="block text-xs font-medium text-text-tertiary mb-1">
                                                        Created At
                                                    </label>
                                                    <p className="text-sm text-text-primary">
                                                        {formatDate(transaction.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-4 sm:px-6 py-4 border-t border-border-light bg-surface-50 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-0 border border-border-light rounded-button hover:bg-surface-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}