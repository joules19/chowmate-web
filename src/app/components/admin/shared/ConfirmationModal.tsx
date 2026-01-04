"use client";

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
}

export default function ConfirmationModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 focus:ring-danger-500',
}: ConfirmationModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-sm text-text-secondary mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="w-full sm:w-auto px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`w-full sm:w-auto px-4 py-2.5 text-text-inverse rounded-button focus:ring-2 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
