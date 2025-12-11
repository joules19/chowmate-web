"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { ToggleVendorTransferRequest } from '@/app/data/types/vendor';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (request: ToggleVendorTransferRequest) => Promise<void>;
    vendorName: string;
    currentStatus: boolean;
    isLoading?: boolean;
}

export default function ToggleTransferModal({
    isOpen,
    onClose,
    onConfirm,
    vendorName,
    currentStatus,
    isLoading = false
}: Props) {
    const [reason, setReason] = useState('');
    const [notifyVendor, setNotifyVendor] = useState(true);
    const newStatus = !currentStatus;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const request: ToggleVendorTransferRequest = {
            isTransferEnabled: newStatus,
            reason: reason.trim(),
            notifyVendor,
        };

        await onConfirm(request);
        setReason('');
        setNotifyVendor(true);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex items-center justify-between p-6 border-b border-border-light">
                                        <div className="flex items-center space-x-3">
                                            <ArrowsRightLeftIcon className={`h-6 w-6 ${newStatus ? 'text-success-500' : 'text-danger-500'}`} />
                                            <Dialog.Title className="text-lg font-semibold text-text-primary">
                                                {newStatus ? 'Enable' : 'Disable'} Transfer
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="p-1 hover:bg-surface-100 rounded transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-tertiary" />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-card mb-6">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-yellow-800 font-medium">Confirm Action</p>
                                                <p className="text-sm text-yellow-700 mt-1">
                                                    You are about to {newStatus ? 'enable' : 'disable'} transfers for <span className="font-semibold">{vendorName}</span>.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Reason <span className="text-danger-500">*</span>
                                                </label>
                                                <textarea
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder={`Enter reason for ${newStatus ? 'enabling' : 'disabling'} transfers...`}
                                                    required
                                                    rows={3}
                                                    className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary resize-none"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="notifyVendor"
                                                    checked={notifyVendor}
                                                    onChange={(e) => setNotifyVendor(e.target.checked)}
                                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                />
                                                <label htmlFor="notifyVendor" className="ml-2 text-sm text-text-secondary">
                                                    Notify vendor via email
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-surface-50">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-0 border border-border-default rounded-button hover:bg-surface-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !reason.trim()}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-button focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                newStatus
                                                    ? 'bg-success-600 hover:bg-success-700 focus:ring-success-500'
                                                    : 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500'
                                            }`}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                `Confirm ${newStatus ? 'Enable' : 'Disable'}`
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
