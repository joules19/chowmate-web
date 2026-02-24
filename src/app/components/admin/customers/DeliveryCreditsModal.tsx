"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { GiftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { message } from 'antd';
import { useGrantDeliveryCredits } from '@/app/lib/hooks/api-hooks.ts/use-customer';

interface DeliveryCreditsModalProps {
    userId: string;
    customerName: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeliveryCreditsModal({
    userId,
    customerName,
    isOpen,
    onClose,
}: DeliveryCreditsModalProps) {
    const [credits, setCredits] = useState('');
    const [expiryDays, setExpiryDays] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const grantMutation = useGrantDeliveryCredits();

    const handleClose = () => {
        setCredits('');
        setExpiryDays('');
        setReason('');
        setError('');
        onClose();
    };

    const handleSubmit = async () => {
        const creditsNum = parseInt(credits, 10);
        if (!credits || isNaN(creditsNum) || creditsNum < 1 || creditsNum > 1000) {
            setError('Credits must be a number between 1 and 1000.');
            return;
        }

        const expiryNum = expiryDays ? parseInt(expiryDays, 10) : undefined;
        if (expiryDays && (isNaN(expiryNum!) || expiryNum! < 1 || expiryNum! > 365)) {
            setError('Expiry days must be between 1 and 365.');
            return;
        }

        setError('');

        try {
            await grantMutation.mutateAsync({
                userIds: [userId],
                credits: creditsNum,
                reason: reason.trim() || undefined,
                expiryDays: expiryNum,
            });
            message.success(`Delivery credit(s) granted to ${customerName} successfully.`);
            handleClose();
        } catch {
            message.error('Failed to grant delivery credits. Please try again.');
            setError('Failed to grant delivery credits. Please try again.');
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
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
                            <Dialog.Panel className="w-full max-w-md bg-background-secondary rounded-lg shadow-xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-50 rounded-lg">
                                            <GiftIcon className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            Grant Delivery Credits
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500 p-1 rounded transition-colors"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-5">
                                    Granting free delivery credits to <strong className="text-gray-900">{customerName}</strong>.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Credits <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={1000}
                                            value={credits}
                                            onChange={(e) => setCredits(e.target.value)}
                                            placeholder="e.g. 3"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 placeholder-gray-400 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Days <span className="text-gray-400 font-normal">(optional — defaults to system config)</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={365}
                                            value={expiryDays}
                                            onChange={(e) => setExpiryDays(e.target.value)}
                                            placeholder="e.g. 30"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 placeholder-gray-400 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="e.g. Compensation for delayed order"
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 placeholder-gray-400 transition-colors resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-600">{error}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end space-x-3 mt-6">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-background-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={grantMutation.isPending}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {grantMutation.isPending ? 'Granting...' : 'Grant Credits'}
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
