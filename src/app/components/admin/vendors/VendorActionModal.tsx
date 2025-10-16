"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    CheckIcon,
    XCircleIcon,
    PauseIcon,
    PlayIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { VendorSummary, ApproveVendorRequest, RejectVendorRequest, SuspendVendorRequest, ActivateVendorRequest } from '@/app/data/types/vendor';
import { useAvailableZones } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import { message } from 'antd';

type VendorActionData = ApproveVendorRequest | RejectVendorRequest | SuspendVendorRequest | ActivateVendorRequest;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: VendorActionData) => void;
    action: 'approve' | 'reject' | 'suspend' | 'activate';
    vendor: VendorSummary;
}

export default function VendorActionModal({ isOpen, onClose, onConfirm, action, vendor }: Props) {
    const [reason, setReason] = useState('');
    const [notifyVendor, setNotifyVendor] = useState(true);
    const [autoAssignZone, setAutoAssignZone] = useState(false);
    const [selectedZoneId, setSelectedZoneId] = useState('');
    const [suspensionEndDate, setSuspensionEndDate] = useState('');
    const [allowReapplication, setAllowReapplication] = useState(true);
    const [sendWelcomePackage, setSendWelcomePackage] = useState(true);
    const [commissionRate, setCommissionRate] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch available zones for approval
    const { data: availableZones, isLoading: zonesLoading } = useAvailableZones();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let data: VendorActionData;

        switch (action) {
            case 'approve':
                data = {
                    reason: reason.trim() || undefined,
                    notifyVendor,
                    autoAssignZone,
                    zoneId: selectedZoneId || undefined,
                    sendWelcomePackage,
                    commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
                    deliveryFee: deliveryFee ? parseFloat(deliveryFee) : undefined
                } as ApproveVendorRequest;
                break;
            case 'reject':
                data = {
                    reason: reason.trim() || 'No reason provided',
                    notifyVendor,
                    allowReapplication
                } as RejectVendorRequest;
                break;
            case 'suspend':
                data = {
                    reason: reason.trim() || 'No reason provided',
                    notifyVendor,
                    suspensionEndDate: suspensionEndDate || undefined,
                    suspendOrders: true,
                    severity: 'Major'
                } as SuspendVendorRequest;
                break;
            case 'activate':
                data = {
                    reason: reason.trim() || undefined,
                    notifyVendor,
                    restoreZoneAssignments: true
                } as ActivateVendorRequest;
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        try {
            await onConfirm(data);
            
            // Show success notification
            const actionMessages = {
                approve: `${vendor.businessName} has been approved successfully and assigned to the selected zone!`,
                reject: `${vendor.businessName} application has been rejected.`,
                suspend: `${vendor.businessName} has been temporarily suspended.`,
                activate: `${vendor.businessName} has been reactivated and can now accept orders.`
            };

            message.success(actionMessages[action]);
            
            // Reset form
            setReason('');
            setNotifyVendor(true);
            setAutoAssignZone(false);
            setSelectedZoneId('');
            setSuspensionEndDate('');
            setAllowReapplication(true);
            setSendWelcomePackage(true);
            setCommissionRate('');
            setDeliveryFee('');
        } catch (err) {
            // Show error notification
            const errorMessages = {
                approve: 'Failed to approve vendor',
                reject: 'Failed to reject vendor',
                suspend: 'Failed to suspend vendor',
                activate: 'Failed to activate vendor'
            };
            
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            message.error(`${errorMessages[action]}: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getActionConfig = () => {
        switch (action) {
            case 'approve':
                return {
                    title: 'Approve Vendor',
                    description: 'This will approve the vendor and assign them to a delivery zone. They will be able to start accepting orders.',
                    icon: <CheckIcon className="h-6 w-6 text-success-500" />,
                    color: 'success',
                    confirmText: 'Approve Vendor',
                    requiresReason: false
                };
            case 'reject':
                return {
                    title: 'Reject Vendor',
                    description: 'This will reject the vendor application. Please provide a reason.',
                    icon: <XCircleIcon className="h-6 w-6 text-danger-500" />,
                    color: 'danger',
                    confirmText: 'Reject Vendor',
                    requiresReason: true
                };
            case 'suspend':
                return {
                    title: 'Suspend Vendor',
                    description: 'This will temporarily suspend the vendor. They will not be able to accept new orders.',
                    icon: <PauseIcon className="h-6 w-6 text-warning-500" />,
                    color: 'warning',
                    confirmText: 'Suspend Vendor',
                    requiresReason: true
                };
            case 'activate':
                return {
                    title: 'Activate Vendor',
                    description: 'This will reactivate the vendor and allow them to accept orders again.',
                    icon: <PlayIcon className="h-6 w-6 text-success-500" />,
                    color: 'success',
                    confirmText: 'Activate Vendor',
                    requiresReason: false
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
                                        {/* Vendor Info */}
                                        <div className="bg-surface-50 rounded-card p-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                                    {vendor.logoUrl ? (
                                                        <img
                                                            src={vendor.logoUrl}
                                                            alt={vendor.businessName}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-primary-700">
                                                            {vendor.businessName?.charAt(0) || vendor.fullName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-text-primary">{vendor.businessName}</div>
                                                    <div className="text-sm text-text-secondary">{vendor.fullName}</div>
                                                    <div className="text-sm text-text-tertiary">{vendor.email}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Warning */}
                                        <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-card mb-6">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-yellow-800 font-medium">Confirm Action</p>
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

                                            {/* Zone Assignment - Required for Approval */}
                                            {action === 'approve' && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                                            Assign to Zone <span className="text-danger-500">*</span>
                                                        </label>
                                                        {zonesLoading ? (
                                                            <div className="w-full border border-border-default rounded-input px-3 py-2 bg-surface-50 text-text-tertiary">
                                                                Loading zones...
                                                            </div>
                                                        ) : availableZones && availableZones.filter(zone => zone.isActive).length > 0 ? (
                                                            <select
                                                                value={selectedZoneId}
                                                                onChange={(e) => setSelectedZoneId(e.target.value)}
                                                                required
                                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                            >
                                                                <option value="">Select a delivery zone...</option>
                                                                {availableZones.filter(zone => zone.isActive).map((zone) => (
                                                                    <option key={zone.id} value={zone.id}>
                                                                        {zone.zoneName} 
                                                                        {zone.description && ` - ${zone.description}`}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <div className="w-full border border-border-default rounded-input px-3 py-2 bg-danger-50 text-danger-700 border-danger-300">
                                                                No active delivery zones available
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-text-tertiary mt-1">
                                                            Zone assignment is required for vendor approval
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                                Commission Rate (%)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={commissionRate}
                                                                onChange={(e) => setCommissionRate(e.target.value)}
                                                                placeholder="e.g., 15"
                                                                min="0"
                                                                max="100"
                                                                step="0.1"
                                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                            />
                                                            <p className="text-xs text-text-tertiary mt-1">
                                                                Platform commission percentage
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                                Delivery Fee (₦)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={deliveryFee}
                                                                onChange={(e) => setDeliveryFee(e.target.value)}
                                                                placeholder="e.g., 5.99"
                                                                min="0"
                                                                step="0.01"
                                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                            />
                                                            <p className="text-xs text-text-tertiary mt-1">
                                                                Base delivery fee amount
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="sendWelcomePackage"
                                                            checked={sendWelcomePackage}
                                                            onChange={(e) => setSendWelcomePackage(e.target.checked)}
                                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                        />
                                                        <label htmlFor="sendWelcomePackage" className="ml-2 text-sm text-text-primary">
                                                            Send welcome package
                                                        </label>
                                                    </div>
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
                                                        Allow vendor to reapply
                                                    </label>
                                                </div>
                                            )}

                                            {/* Notify Vendor */}
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="notifyVendor"
                                                    checked={notifyVendor}
                                                    onChange={(e) => setNotifyVendor(e.target.checked)}
                                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                />
                                                <label htmlFor="notifyVendor" className="ml-2 text-sm text-text-primary">
                                                    Send notification to vendor
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-surface-50">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-0 border border-border-default rounded-button hover:bg-surface-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || (config.requiresReason && !reason.trim()) || (action === 'approve' && (!selectedZoneId || (availableZones && availableZones.filter(zone => zone.isActive).length === 0)))}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-button focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.color === 'success'
                                                    ? 'bg-success-500 hover:bg-success-600 focus:ring-success-500'
                                                    : config.color === 'danger'
                                                        ? 'bg-danger-500 hover:bg-danger-600 focus:ring-danger-500'
                                                        : 'bg-warning-500 hover:bg-warning-600 focus:ring-warning-500'
                                                }`}
                                        >
                                            {isSubmitting ? (
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