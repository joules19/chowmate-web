'use client';

import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { AllOrdersDto } from '@/app/data/types/order';
import { formatCurrency } from '@/app/lib/utils/currency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: AllOrdersDto | null;
  onConfirm: (orderId: string) => void;
  isLoading?: boolean;
}

export default function OrderAcceptanceModal({ isOpen, onClose, order, onConfirm, isLoading = false }: Props) {
  const handleConfirm = () => {
    if (order) {
      onConfirm(order.id);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Accept Order
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
                <span className="text-sm text-gray-600">Vendor:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.vendor.businessName || `${order.vendor.firstName} ${order.vendor.lastName}`}
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {order.statusText}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mb-6">
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Accept this order on behalf of the vendor</p>
                <p>This action will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Change order status to "Preparing"</li>
                  <li>Make the order available for rider assignment</li>
                  <li>Send notifications to the customer</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-button text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-button text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Accepting...
                </>
              ) : (
                'Accept Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
