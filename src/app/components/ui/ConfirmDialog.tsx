"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Spinner from './Spinner';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
    disabled?: boolean;
}

const variantConfig = {
    danger: {
        iconColor: 'text-red-600',
        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        iconBg: 'bg-red-100'
    },
    warning: {
        iconColor: 'text-yellow-600',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        iconBg: 'bg-yellow-100'
    },
    info: {
        iconColor: 'text-blue-600',
        buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        iconBg: 'bg-blue-100'
    },
    success: {
        iconColor: 'text-green-600',
        buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        iconBg: 'bg-green-100'
    }
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
    disabled = false
}: ConfirmDialogProps) {
    const config = variantConfig[variant];

    const handleConfirm = () => {
        if (!disabled && !isLoading) {
            onConfirm();
        }
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-card bg-surface-0 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start">
                                    <div className={clsx('mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10', config.iconBg)}>
                                        <ExclamationTriangleIcon className={clsx('h-6 w-6', config.iconColor)} aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-text-primary">
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-text-secondary">
                                                {message}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="ml-4 rounded-md p-1 hover:bg-surface-100 transition-colors"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-5 w-5 text-text-tertiary" />
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="rounded-button border border-border-default bg-surface-0 px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        type="button"
                                        className={clsx(
                                            'inline-flex items-center justify-center rounded-button px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                                            config.buttonColor,
                                            (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
                                        )}
                                        onClick={handleConfirm}
                                        disabled={disabled || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner size="sm" color="white" className="mr-2" />
                                                {confirmText}...
                                            </>
                                        ) : (
                                            confirmText
                                        )}
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