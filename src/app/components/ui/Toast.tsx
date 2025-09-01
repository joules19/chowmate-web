"use client";

import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastItemProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const toastConfig = {
    success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-success-50 border-success-200',
        iconColor: 'text-success-500',
        titleColor: 'text-success-800',
        messageColor: 'text-success-700'
    },
    error: {
        icon: XCircleIcon,
        bgColor: 'bg-danger-50 border-danger-200',
        iconColor: 'text-danger-500',
        titleColor: 'text-danger-800',
        messageColor: 'text-danger-700'
    },
    warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-warning-50 border-warning-200',
        iconColor: 'text-warning-500',
        titleColor: 'text-warning-800',
        messageColor: 'text-warning-700'
    },
    info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        messageColor: 'text-blue-700'
    }
};

function ToastItem({ toast, onClose }: ToastItemProps) {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    return (
        <Transition
            appear
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={clsx(
                'pointer-events-auto w-full max-w-sm overflow-hidden rounded-card border shadow-soft',
                config.bgColor
            )}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Icon className={clsx('h-5 w-5', config.iconColor)} />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className={clsx('text-sm font-medium', config.titleColor)}>
                                {toast.title}
                            </p>
                            {toast.message && (
                                <p className={clsx('mt-1 text-sm', config.messageColor)}>
                                    {toast.message}
                                </p>
                            )}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                type="button"
                                className={clsx(
                                    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                                    config.iconColor,
                                    'hover:bg-white hover:bg-opacity-20'
                                )}
                                onClick={() => onClose(toast.id)}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
}

export default ToastItem;