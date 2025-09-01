"use client";

import { clsx } from "clsx";

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'white' | 'gray' | 'success' | 'danger' | 'warning';
    className?: string;
}

const Spinner = ({ size = 'md', color = 'primary', className }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    const colorClasses = {
        primary: 'border-primary-500',
        white: 'border-white',
        gray: 'border-gray-500',
        success: 'border-success-500',
        danger: 'border-danger-500',
        warning: 'border-warning-500'
    };

    return (
        <div
            className={clsx(
                'animate-spin rounded-full border-2 border-solid border-r-transparent',
                sizeClasses[size],
                colorClasses[color],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
export { Spinner };