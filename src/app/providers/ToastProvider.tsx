"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/app/components/ui/SimpleToast';

type ToastType = 'success' | 'error';

interface ToastState {
    show: boolean;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: ToastType) => {
        setToast({ show: true, message, type });
    };

    const handleClose = () => {
        setToast({ ...toast, show: false });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleClose}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
