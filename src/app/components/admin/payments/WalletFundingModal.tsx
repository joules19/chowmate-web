"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
    XMarkIcon,
    BanknotesIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { UserForRoleSwitch } from '@/app/data/types/vendor';
import { paymentService } from '@/app/lib/api/services/payment-service';

// Dynamically import PaystackButton to prevent SSR issues
const PaystackButton = dynamic(
    () => import('react-paystack').then(mod => ({ default: mod.PaystackButton })),
    { ssr: false }
);

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserForRoleSwitch;
    onSuccess: () => void;
}

interface PaystackConfig {
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
}

export default function WalletFundingModal({ isOpen, onClose, user, onSuccess }: Props) {
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [paymentReference, setPaymentReference] = useState<string>('');
    const [verificationData, setVerificationData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    // This should come from your environment variables
    const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getStatusText = (status: number): string => {
        switch (status) {
            case 0: return 'Pending';
            case 1: return 'Completed';
            case 2: return 'Failed';
            case 3: return 'Reversed';
            default: return 'Unknown';
        }
    };

    const handlePaymentSuccess = async (reference: any) => {
        console.log('Payment Success Callback:', reference);
        setPaymentStatus('processing');
        try {
            // Verify the payment with your backend
            const verificationResult = await paymentService.verifyWalletFundingForWeb(reference.reference, user.userId);
            console.log('Verification Result:', verificationResult);
            
            if (verificationResult.isSuccess && verificationResult.statusCode === 200) {
                // Check if the transaction status is Completed (1)
                if (verificationResult.data.status === 1) {
                    setVerificationData(verificationResult.data);
                    setPaymentStatus('success');
                    setTimeout(() => {
                        onSuccess();
                        resetForm();
                    }, 3000); // Increased timeout to show success message longer
                } else {
                    setPaymentStatus('failed');
                    setError(`Transaction status: ${getStatusText(verificationResult.data.status)}. Please contact support if this persists.`);
                }
            } else {
                setPaymentStatus('failed');
                setError(verificationResult.message || 'Payment verification failed. Please contact support.');
            }
        } catch (err) {
            console.error('Verification Error:', err);
            setPaymentStatus('failed');
            setError(err instanceof Error ? err.message : 'Payment verification failed');
        }
    };

    const handlePaymentClose = () => {
        console.log('Payment Closed');
        if (paymentStatus === 'processing') return; // Don't allow closing during verification
        setPaymentStatus('failed');
        setError('Payment was cancelled or failed');
    };

    const handleFundWallet = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (parseFloat(amount) < 100) {
            setError('Minimum funding amount is ₦100');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Initialize transaction with your backend
            const initResult = await paymentService.fundWallet({
                userId: user.userId,
                amount: parseFloat(amount),
                email: user.email
            });

            console.log('Initialize Result:', initResult);

            if (initResult.status) {
                setPaymentReference(initResult.data.reference);
                setIsLoading(false);
                // The PaystackButton will handle the payment
            } else {
                setError(initResult.message || 'Failed to initialize payment');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Initialize Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to initialize payment');
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setError('');
        setPaymentStatus('idle');
        setPaymentReference('');
        setVerificationData(null);
    };

    const handleClose = () => {
        if (paymentStatus === 'processing') return; // Don't allow closing during processing
        resetForm();
        onClose();
    };

    const formatAmount = (value: string) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }
        return numericValue;
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatAmount(e.target.value);
        setAmount(formatted);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-border-light">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-text-primary flex items-center">
                                            <BanknotesIcon className="h-5 w-5 mr-2" />
                                            Fund Wallet
                                        </h2>
                                        <button
                                            onClick={handleClose}
                                            disabled={paymentStatus === 'processing'}
                                            className="p-2 hover:bg-surface-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-4">
                                    {/* User Info */}
                                    <div className="bg-surface-50 rounded-card p-4 mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-text-primary">{user.name}</h3>
                                                <p className="text-sm text-text-secondary">{user.email}</p>
                                                <p className="text-sm text-text-tertiary">{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    {paymentStatus === 'success' && verificationData && (
                                        <div className="bg-success-50 border border-success-200 rounded-card p-4 mb-4">
                                            <div className="flex items-start">
                                                <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-success-800 font-medium mb-2">
                                                        Wallet funded successfully!
                                                    </p>
                                                    <div className="text-xs text-success-700 space-y-1">
                                                        <p>Amount funded: ₦{verificationData.amountFunded?.toLocaleString()}</p>
                                                        <p>New wallet balance: ₦{verificationData.walletBalance?.toLocaleString()}</p>
                                                        <p>Status: {getStatusText(verificationData.status)}</p>
                                                        <p>Transaction ID: {verificationData.transactionId}</p>
                                                        <p>Date: {new Date(verificationData.transactionDate).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentStatus === 'processing' && (
                                        <div className="bg-primary-50 border border-primary-200 rounded-card p-4 mb-4">
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
                                                <p className="text-sm text-primary-800">
                                                    Verifying payment... Please wait.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paymentStatus === 'failed' && error && (
                                        <div className="bg-danger-50 border border-danger-200 rounded-card p-4 mb-4">
                                            <div className="flex items-center">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-2" />
                                                <p className="text-sm text-danger-800">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    {paymentStatus === 'idle' && (
                                        <>
                                            {/* Amount Input */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-text-primary mb-2">
                                                    Amount to Fund (₦)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">₦</span>
                                                    <input
                                                        type="text"
                                                        value={amount}
                                                        onChange={handleAmountChange}
                                                        placeholder="0.00"
                                                        className="w-full pl-8 pr-4 py-3 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <p className="text-xs text-text-tertiary mt-1">
                                                    Minimum amount: ₦100
                                                </p>
                                            </div>

                                            {/* Quick Amount Buttons */}
                                            <div className="mb-6">
                                                <p className="text-sm font-medium text-text-primary mb-2">Quick amounts:</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['500', '1000', '2000', '5000', '10000', '20000'].map((quickAmount) => (
                                                        <button
                                                            key={quickAmount}
                                                            onClick={() => setAmount(quickAmount)}
                                                            className="py-2 px-3 text-sm border border-border-light rounded-button hover:bg-surface-100 transition-colors"
                                                            disabled={isLoading}
                                                        >
                                                            ₦{quickAmount}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="bg-danger-50 border border-danger-200 rounded-card p-4 mb-4">
                                                    <div className="flex items-center">
                                                        <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 mr-2" />
                                                        <p className="text-sm text-danger-800">{error}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Payment Info */}
                                            <div className="bg-primary-50 border border-primary-200 rounded-card p-4 mb-6">
                                                <p className="text-sm text-primary-800">
                                                    <strong>Note:</strong> You will be redirected to Paystack to complete the payment securely. 
                                                    The funds will be credited to the user's wallet immediately after successful payment.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Footer */}
                                {paymentStatus === 'idle' && (
                                    <div className="px-6 py-4 border-t border-border-light bg-surface-50">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleClose}
                                                disabled={isLoading}
                                                className="flex-1 py-3 px-4 border border-border-light rounded-button text-text-primary hover:bg-surface-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                            
                                            {!paymentReference ? (
                                                <button
                                                    onClick={handleFundWallet}
                                                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                                                    className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BanknotesIcon className="h-4 w-4 mr-2" />
                                                            Initialize Payment
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                isMounted ? (
                                                    <PaystackButton
                                                        reference={paymentReference}
                                                        email={user.email}
                                                        amount={Math.round(parseFloat(amount) * 100)} // Convert to kobo
                                                        publicKey={PAYSTACK_PUBLIC_KEY}
                                                        text="Pay with Paystack"
                                                        onSuccess={handlePaymentSuccess}
                                                        onClose={handlePaymentClose}
                                                        className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-button transition-colors flex items-center justify-center"
                                                    />
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="flex-1 py-3 px-4 bg-gray-400 text-white rounded-button transition-colors flex items-center justify-center cursor-not-allowed"
                                                    >
                                                        Loading Payment...
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}