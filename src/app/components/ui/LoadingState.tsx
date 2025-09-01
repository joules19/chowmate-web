"use client";

import { clsx } from "clsx";
import Spinner from "./Spinner";

interface LoadingStateProps {
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showBackground?: boolean;
}

export default function LoadingState({
    title = "Loading...",
    description,
    size = 'md',
    className,
    showBackground = true
}: LoadingStateProps) {
    const containerSizes = {
        sm: 'py-4',
        md: 'py-8',
        lg: 'py-12'
    };

    const spinnerSizes = {
        sm: 'md' as const,
        md: 'lg' as const,
        lg: 'xl' as const
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div 
            className={clsx(
                'flex flex-col items-center justify-center text-center',
                showBackground && 'bg-surface-0 rounded-card shadow-soft border border-border-light',
                containerSizes[size],
                className
            )}
        >
            <div className="animate-pulse">
                <Spinner size={spinnerSizes[size]} color="primary" className="mx-auto mb-4" />
                <div className={clsx('font-medium text-text-primary mb-2', textSizes[size])}>
                    {title}
                </div>
                {description && (
                    <div className="text-sm text-text-secondary max-w-xs">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}