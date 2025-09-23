"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import {
    UserForRoleSwitch,
    RoleSwitchRequest,
    RoleSwitchResponse,
    UserRole
} from '@/app/data/types/vendor';
import { userService } from '@/app/lib/api/services/user-service';

interface Props {
    user: UserForRoleSwitch;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (result: RoleSwitchResponse) => void;
}

export default function RoleSwitchModal({ user, isOpen, onClose, onSuccess }: Props) {
    const [toRole, setToRole] = useState<UserRole>('Customer');
    const [reason, setReason] = useState('');
    const [notifyUser, setNotifyUser] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const availableRoles: UserRole[] = (['Customer', 'Vendor', 'Rider'] as UserRole[]).filter(
        role => role !== user.currentRole
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const request: RoleSwitchRequest = {
                fromRole: user.currentRole,
                toRole,
                reason,
                notifyUser
            };

            const result = await userService.switchUserRole(user.userId, request);
            onSuccess(result);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const showConfirmation = () => {
        return window.confirm(
            `Are you sure you want to switch ${user.name}'s role from ${user.currentRole} to ${toRole}?\n\n` +
            `This will:\n` +
            `• Remove all ${user.currentRole}-specific data\n` +
            `• Create a new ${toRole} profile\n` +
            `• Send them through ${toRole} onboarding if needed\n` +
            `• Log this action for audit purposes\n\n` +
            `This action cannot be easily undone.`
        );
    };

    const handleConfirmedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showConfirmation()) {
            handleSubmit(e);
        }
    };

    if (!isOpen) return null;

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
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-border-light">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-text-primary flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2" />
                                            Switch User Role
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
                                <div className="px-6 py-4">
                                    {/* User Info */}
                                    <div className="mb-6 p-4 bg-surface-50 rounded-card">
                                        <h3 className="font-medium text-text-primary mb-2">User Information</h3>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Name:</span> {user.name}</p>
                                            <p><span className="font-medium">Email:</span> {user.email}</p>
                                            <p><span className="font-medium">Phone:</span> {user.phone}</p>
                                            <p><span className="font-medium">Current Role:</span>
                                                <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                                    {user.currentRole}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Warning if user has active orders/deliveries */}
                                    {(user.hasActiveOrders || user.hasActiveDeliveries) && (
                                        <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-card">
                                            <div className="flex items-start">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-warning-800">
                                                    <p className="font-medium">Warning</p>
                                                    <p>This user has active {user.hasActiveOrders ? 'orders' : 'deliveries'}.
                                                        Role switching will fail until these are completed.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleConfirmedSubmit} className="space-y-4">
                                        {/* Role Selection */}
                                        <div>
                                            <label htmlFor="toRole" className="block text-sm font-medium text-text-secondary mb-2">
                                                Switch to Role:
                                            </label>
                                            <select
                                                id="toRole"
                                                value={toRole}
                                                onChange={(e) => setToRole(e.target.value as UserRole)}
                                                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                required
                                            >
                                                {availableRoles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Reason */}
                                        <div>
                                            <label htmlFor="reason" className="block text-sm font-medium text-text-secondary mb-2">
                                                Reason (optional):
                                            </label>
                                            <textarea
                                                id="reason"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Explain why this role change is needed..."
                                                maxLength={500}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-xs text-text-tertiary mt-1">{reason.length}/500 characters</p>
                                        </div>

                                        {/* Notify User */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="notifyUser"
                                                checked={notifyUser}
                                                onChange={(e) => setNotifyUser(e.target.checked)}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-light rounded"
                                            />
                                            <label htmlFor="notifyUser" className="ml-2 text-sm text-text-primary">
                                                Notify user via email
                                            </label>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-3 bg-danger-50 border border-danger-200 rounded-card">
                                                <p className="text-sm text-danger-800">{error}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isLoading}
                                                className="flex-1 px-4 py-2 text-text-primary bg-surface-100 hover:bg-surface-200 rounded-button transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || (user.hasActiveOrders || user.hasActiveDeliveries)}
                                                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Switching...' : `Switch to ${toRole}`}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}