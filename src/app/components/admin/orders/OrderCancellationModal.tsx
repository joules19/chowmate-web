'use client';

import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { AllOrdersDto } from '@/app/data/types/order';
import { formatCurrency } from '@/app/lib/utils/currency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: AllOrdersDto | null;
  onCancel: (orderId: string, reason: string) => void;
  isLoading?: boolean;
}

export default function OrderCancellationModal({ isOpen, onClose, order, onCancel, isLoading = false }: Props) {
  const [cancellationReason, setCancellationReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleSubmit = () => {
    // Validate reason
    if (!cancellationReason.trim()) {
      setReasonError('Cancellation reason is required');
      return;
    }

    if (cancellationReason.length > 500) {
      setReasonError('Reason must be 500 characters or less');
      return;
    }

    if (order) {
      onCancel(order.id, cancellationReason.trim());
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCancellationReason('');
      setReasonError('');
      onClose();
    }
  };

  const handleReasonChange = (value: string) => {
    setCancellationReason(value);
    if (reasonError) {
      setReasonError('');
    }
  };

  if (!isOpen || !order) return null;

  // Check if order can be cancelled
  const canCancel = ['Pending', 'Preparing', 'RiderAssigned'].includes(order.statusText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Order
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {!canCancel ? (
            /* Cannot Cancel Message */
            <div className="mb-6">
              <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Cannot cancel this order</p>
                  <p>Orders with status "{order.statusText}" cannot be cancelled. Only orders with status "Pending", "Preparing", or "Rider Assigned" can be cancelled.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Order Information */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.statusText)}`}>
                      {order.statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-6">
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">This action cannot be undone</p>
                    <p>Cancelling this order will:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Refund the complete order amount to customer's wallet</li>
                      <li>Restore any used delivery credits</li>
                      <li>Send email notifications to customer and vendor</li>
                      <li>Update order status to "Cancelled"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="mb-6">
                <label htmlFor="cancellation-reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Reason *
                </label>
                <textarea
                  id="cancellation-reason"
                  rows={4}
                  value={cancellationReason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter the reason for cancelling this order (max 500 characters)"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 ${
                    reasonError ? 'border-red-300' : ''
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  <div>
                    {reasonError && (
                      <p className="text-sm text-red-600">{reasonError}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {cancellationReason.length}/500
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-button text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canCancel ? 'Cancel' : 'Close'}
            </button>
            {canCancel && (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !cancellationReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-button text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeColor(status: string): string {
  const statusConfig: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Preparing': 'bg-primary-100 text-primary-800',
    'RiderAssigned': 'bg-purple-100 text-purple-800',
    'RiderArrived': 'bg-indigo-100 text-indigo-800',
    'OutForDelivery': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  return statusConfig[status] || statusConfig['Pending'];
}