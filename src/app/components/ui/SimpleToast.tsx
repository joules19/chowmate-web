'use client';

import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface SimpleToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: SimpleToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-success-50 border-success-200',
      iconColor: 'text-success-500',
      textColor: 'text-success-800'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-danger-50 border-danger-200',
      iconColor: 'text-danger-500',
      textColor: 'text-danger-800'
    }
  };

  const { icon: Icon, bgColor, iconColor, textColor } = config[type];

  return (
    <div className="fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-out"
         style={{ animation: 'slideInRight 0.3s ease-out' }}>
      <div className={clsx(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-card border shadow-soft-lg',
        bgColor
      )}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Icon className={clsx('h-5 w-5', iconColor)} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={clsx('text-sm font-medium break-words', textColor)}>
                {message}
              </p>
            </div>
            <div className="flex-shrink-0 ml-2">
              <button
                type="button"
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  iconColor,
                  'hover:bg-white hover:bg-opacity-20'
                )}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;