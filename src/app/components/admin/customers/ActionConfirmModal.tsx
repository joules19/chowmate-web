"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ActionConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason?: string) => void;
    action: 'suspend' | 'activate' | 'delete' | 'ban';
    itemName: string;
    itemType: string;
    requireReason?: boolean;
}

const actionConfig = {
    suspend: {
        title: 'Suspend',
        description: 'This will prevent the customer from placing new orders',
        confirmText: 'Suspend',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    activate: {
        title: 'Activate',
        description: 'This will allow the customer to place orders again',
        confirmText: 'Activate',
        buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    delete: {
        title: 'Delete',
        description: 'This will soft delete the customer. They can be restored later',
        confirmText: 'Delete',
        buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    ban: {
        title: 'Ban',
        description: 'This will permanently ban the customer from the platform',
        confirmText: 'Ban',
        buttonColor: 'bg-red-600 hover:bg-red-700',
    },
};

export default function ActionConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    action,
    itemName,
    itemType,
    requireReason = true,
}: ActionConfirmModalProps) {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const config = actionConfig[action];

    const handleConfirm = async () => {
        if (requireReason && !reason.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            await onConfirm(reason.trim() || undefined);
        } finally {
            setIsLoading(false);
            setReason('');
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                            <Dialog.Panel className="w-full max-w-md bg-background-secondary rounded-lg shadow-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                                        </div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            {config.title} {itemType}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500 p-1 rounded transition-colors"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Are you sure you want to {action} <strong>{itemName}</strong>?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {config.description}
                                    </p>
                                </div>

                                {requireReason && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason {action === 'activate' ? '(optional)' : '(required)'}
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder={`Enter reason for ${action}ing this ${itemType}...`}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-gray-900 placeholder-gray-500 transition-colors"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-end space-x-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-background-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isLoading || (requireReason && action !== 'activate' && !reason.trim())}
                                        className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
                                    >
                                        {isLoading ? 'Processing...' : config.confirmText}
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