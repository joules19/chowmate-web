"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    CheckIcon,
    XCircleIcon,
    PauseIcon,
    ExclamationTriangleIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: Record<string, unknown>) => void;
    action: 'approve' | 'reject' | 'suspend';
    selectedCount: number;
    isLoading: boolean;
}

export default function BulkActionModal({ isOpen, onClose, onConfirm, action, selectedCount, isLoading }: Props) {
    const [reason, setReason] = useState('');
    const [notifyVendors, setNotifyVendors] = useState(true);
    const [autoAssignZone, setAutoAssignZone] = useState(false);
    const [allowReapplication, setAllowReapplication] = useState(true);
    const [suspensionEndDate, setSuspensionEndDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: Record<string, unknown> = {
            reason: reason.trim() || undefined,
            notifyVendors
        };

        switch (action) {
            case 'approve':
                data.autoAssignZone = autoAssignZone;
                break;
            case 'reject':
                data.allowReapplication = allowReapplication;
                break;
            case 'suspend':
                data.suspensionEndDate = suspensionEndDate || undefined;
                break;
        }

        await onConfirm(data);

        // Reset form
        setReason('');
        setNotifyVendors(true);
        setAutoAssignZone(false);
        setAllowReapplication(true);
        setSuspensionEndDate('');
    };

    const getActionConfig = () => {
        switch (action) {
            case 'approve':
                return {
                    title: 'Bulk Approve Vendors',
                    description: `This will approve ${selectedCount} vendor(s) and allow them to start accepting orders.`,
                    icon: <CheckIcon className="h-6 w-6 text-success-500" />,
                    color: 'success',
                    confirmText: `Approve ${selectedCount} Vendor(s)`,
                    requiresReason: false
                };
            case 'reject':
                return {
                    title: 'Bulk Reject Vendors',
                    description: `This will reject ${selectedCount} vendor application(s). Please provide a reason.`,
                    icon: <XCircleIcon className="h-6 w-6 text-danger-500" />,
                    color: 'danger',
                    confirmText: `Reject ${selectedCount} Vendor(s)`,
                    requiresReason: true
                };
            case 'suspend':
                return {
                    title: 'Bulk Suspend Vendors',
                    description: `This will temporarily suspend ${selectedCount} vendor(s). They will not be able to accept new orders.`,
                    icon: <PauseIcon className="h-6 w-6 text-warning-500" />,
                    color: 'warning',
                    confirmText: `Suspend ${selectedCount} Vendor(s)`,
                    requiresReason: true
                };
        }
    };

    const config = getActionConfig();

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
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-border-light">
                                        <div className="flex items-center space-x-3">
                                            {config.icon}
                                            <Dialog.Title className="text-lg font-semibold text-text-primary">
                                                {config.title}
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

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Selection Summary */}
                                        <div className="bg-surface-50 rounded-card p-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <UserGroupIcon className="h-8 w-8 text-primary-500" />
                                                <div>
                                                    <div className="font-medium text-text-primary">
                                                        {selectedCount} vendor(s) selected
                                                    </div>
                                                    <div className="text-sm text-text-tertiary">
                                                        This action will apply to all selected vendors
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Warning */}
                                        <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-card mb-6">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-yellow-800 font-medium">Confirm Bulk Action</p>
                                                <p className="text-sm text-yellow-700 mt-1">{config.description}</p>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            {/* Reason */}
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Reason {config.requiresReason && <span className="text-danger-500">*</span>}
                                                </label>
                                                <textarea
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder={`Enter reason for ${action}...`}
                                                    required={config.requiresReason}
                                                    rows={3}
                                                    className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary resize-none"
                                                />
                                            </div>

                                            {/* Suspension End Date */}
                                            {action === 'suspend' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Suspension End Date (Optional)
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={suspensionEndDate}
                                                        onChange={(e) => setSuspensionEndDate(e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                    />
                                                    <p className="text-xs text-text-tertiary mt-1">
                                                        Leave empty for indefinite suspension
                                                    </p>
                                                </div>
                                            )}

                                            {/* Auto Assign Zone */}
                                            {action === 'approve' && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="autoAssignZone"
                                                        checked={autoAssignZone}
                                                        onChange={(e) => setAutoAssignZone(e.target.checked)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                    />
                                                    <label htmlFor="autoAssignZone" className="ml-2 text-sm text-text-primary">
                                                        Auto-assign to nearest available zones
                                                    </label>
                                                </div>
                                            )}

                                            {/* Allow Reapplication */}
                                            {action === 'reject' && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="allowReapplication"
                                                        checked={allowReapplication}
                                                        onChange={(e) => setAllowReapplication(e.target.checked)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                    />
                                                    <label htmlFor="allowReapplication" className="ml-2 text-sm text-text-primary">
                                                        Allow vendors to reapply
                                                    </label>
                                                </div>
                                            )}

                                            {/* Notify Vendors */}
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="notifyVendors"
                                                    checked={notifyVendors}
                                                    onChange={(e) => setNotifyVendors(e.target.checked)}
                                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                />
                                                <label htmlFor="notifyVendors" className="ml-2 text-sm text-text-primary">
                                                    Send notifications to all affected vendors
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
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
                                            disabled={isLoading || (config.requiresReason && !reason.trim())}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-button focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.color === 'success'
                                                    ? 'bg-success-500 hover:bg-success-600 focus:ring-success-500'
                                                    : config.color === 'danger'
                                                        ? 'bg-danger-500 hover:bg-danger-600 focus:ring-danger-500'
                                                        : 'bg-warning-500 hover:bg-warning-600 focus:ring-warning-500'
                                                }`}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                config.confirmText
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