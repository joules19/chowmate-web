'use client';

import { useState, useMemo } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { Bike } from 'lucide-react';
import { useAssignRiderToOrder, useReplaceOrderRider } from '@/app/lib/hooks/api-hooks.ts/use-order-management';
import { Spinner } from '../../ui/Spinner';
import { Toast } from '../../ui/SimpleToast';
import { AvailableRiderDto, AllOrdersDto } from '@/app/data/types/order';
import { useAvailableRiders } from '@/app/lib/hooks/api-hooks.ts/use-rider';
import { formatCurrency } from '@/app/lib/utils/currency';

interface RiderReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AllOrdersDto | null;
}

export default function RiderReplacementModal({ isOpen, onClose, order }: RiderReplacementModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRider, setSelectedRider] = useState<AvailableRiderDto | null>(null);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const { data: availableRiders, isLoading: ridersLoading, error: ridersError, refetch: refreshRiders, isFetching: isRefreshing } = useAvailableRiders();
  const assignRiderMutation = useReplaceOrderRider();

  const filteredRiders = useMemo(() => {
    if (!availableRiders) return [];
    
    // First, exclude the currently assigned rider from the list
    const ridersExcludingCurrent = availableRiders.filter((rider: AvailableRiderDto) => 
      rider.id !== order?.rider?.id
    );

    // Then apply search filter if searchQuery exists
    if (!searchQuery) return ridersExcludingCurrent;

    return ridersExcludingCurrent.filter((rider: AvailableRiderDto) =>
      rider.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.phoneNumber.includes(searchQuery)
    );
  }, [availableRiders, searchQuery, order?.rider?.id]);

  const handleReplaceRider = async () => {
    if (!order || !selectedRider) return;

    try {
      const result = await assignRiderMutation.mutateAsync({
        orderId: order.id,
        riderId: selectedRider.id,
        notes: notes || `Rider replacement: ${order.rider?.firstName} ${order.rider?.lastName} → ${selectedRider.fullName}`
      });

      if (result.success) {
        setToast({
          show: true,
          message: `Rider successfully replaced! ${selectedRider.fullName} is now assigned to order ${order.orderId}`,
          type: 'success'
        });

        setTimeout(() => {
          onClose();
          setSelectedRider(null);
          setNotes('');
          setSearchQuery('');
        }, 2000);
      } else {
        setToast({
          show: true,
          message: result.message || 'Failed to replace rider',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to replace rider. Please try again.',
        type: 'error'
      });
    }
  };

  const getRiderStatusBadge = (rider: AvailableRiderDto) => {
    const statusConfig = {
      [0]: { // PendingVerification
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
        label: 'Pending'
      },
      [1]: { // Available
        bg: 'bg-success-50',
        text: 'text-success-700',
        border: 'border-success-200',
        dot: 'bg-success-500',
        label: 'Available'
      },
      [2]: { // Busy
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        border: 'border-warning-200',
        dot: 'bg-warning-500',
        label: 'Busy'
      },
      [3]: { // Offline
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-400',
        label: 'Offline'
      },
      [4]: { // OnBreak
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'On Break'
      },
      [5]: { // Suspended
        bg: 'bg-danger-50',
        text: 'text-danger-700',
        border: 'border-danger-200',
        dot: 'bg-danger-500',
        label: 'Suspended'
      }
    };

    const config = statusConfig[rider.status as unknown as keyof typeof statusConfig] || statusConfig[3];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <div className={`w-2 h-2 rounded-full mr-1 ${config.dot}`} />
        {config.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-surface-0 rounded-card text-left overflow-hidden shadow-soft-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-surface-0 px-4 py-3 sm:px-6 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-text-primary" id="modal-title">
                  Replace Rider for Order
                </h3>
                {order && (
                  <>
                    <p className="text-sm text-text-secondary mt-1">
                      Order #{order.orderId} • {order.customer.firstName} {order.customer.lastName} • {formatCurrency(order.totalAmount)}
                    </p>
                    {order.rider && (
                      <div className="mt-2 p-3 bg-warning-50 border border-warning-200 rounded-button">
                        <p className="text-sm text-warning-800">
                          <strong>Current Rider:</strong> {order.rider.firstName} {order.rider.lastName} • {order.rider.phoneNumber}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <button
                type="button"
                className="bg-surface-0 rounded-button text-text-tertiary hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface-0 px-4 py-6 sm:px-6">
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="rider-search" className="block text-sm font-medium text-text-secondary mb-2">
                Search Available Riders
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="rider-search"
                  className="block w-full pl-10 pr-3 py-2 border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Search by name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Riders List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-text-secondary">Available Riders</h4>
                <button
                  onClick={() => refreshRiders()}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-button hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRefreshing ? (
                    <>
                      <Spinner size="sm" className="mr-1" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>

              {ridersLoading && (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="md" />
                  <span className="ml-2 text-sm text-text-secondary">Loading available riders...</span>
                </div>
              )}

              {ridersError && (
                <div className="bg-danger-50 border border-danger-200 rounded-button p-4">
                  <p className="text-sm text-danger-700">Failed to load available riders. Please try again.</p>
                </div>
              )}

              {!ridersLoading && !ridersError && (
                <div className="max-h-96 overflow-y-auto border border-border-light rounded-button">
                  {filteredRiders.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bike className="mx-auto h-12 w-12 text-text-tertiary" />
                      <p className="mt-2 text-sm text-text-secondary">
                        {searchQuery ? 'No riders found matching your search.' : 'No available riders at the moment.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-light">
                      {filteredRiders.map((rider: AvailableRiderDto) => (
                        <div
                          key={rider.id}
                          className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-surface-50 hover:shadow-sm ${selectedRider?.id === rider.id
                              ? 'bg-primary-50 border-l-4 border-l-primary-500 shadow-sm'
                              : ''
                            }`}
                          onClick={() => setSelectedRider(rider)}
                        >
                          <div className="flex items-start sm:items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start sm:items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-medium text-primary-700">
                                      {rider.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {rider.fullName}
                                  </p>
                                  <p className="text-xs text-text-secondary truncate">
                                    {rider.phoneNumber}
                                  </p>
                                  <p className="text-xs text-text-secondary truncate sm:hidden">
                                    {rider.statusText}
                                  </p>

                                  {/* Mobile Stats - Compact horizontal layout */}
                                  <div className="flex items-center space-x-3 mt-1 sm:hidden">
                                    <div className="flex items-center">
                                      <StarIcon className="h-3 w-3 text-warning-500 mr-1" />
                                      <span className="text-xs text-text-secondary">{rider.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-text-secondary">{rider.completedDeliveries} deliveries</span>
                                    <span className="text-xs text-text-secondary">{rider.acceptanceRate.toFixed(0)}% accept rate</span>
                                    {rider.activeAssignments > 0 && (
                                      <span className="text-xs text-warning-600 bg-warning-50 px-1 rounded">
                                        {rider.activeAssignments} active
                                      </span>
                                    )}
                                  </div>

                                  {/* Desktop Stats - Full layout */}
                                  <div className="hidden sm:flex items-center space-x-6 mt-1">
                                    <div className="flex items-center">
                                      <StarIcon className="h-4 w-4 text-warning-500 mr-1.5" />
                                      <span className="text-sm text-text-secondary font-medium">
                                        {rider.rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Bike className="h-4 w-4 text-text-tertiary mr-1.5" />
                                      <span className="text-sm text-text-secondary">
                                        {rider.completedDeliveries} deliveries
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-text-secondary">
                                        {rider.acceptanceRate.toFixed(0)}% accept rate
                                      </span>
                                    </div>
                                    {rider.activeAssignments > 0 && (
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                                        {rider.activeAssignments} active
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {getRiderStatusBadge(rider)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label htmlFor="replacement-notes" className="block text-sm font-medium text-text-secondary mb-2">
                Replacement Reason (Optional)
              </label>
              <textarea
                id="replacement-notes"
                rows={3}
                className="block w-full px-3 py-2 border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="Add any reason for the rider replacement..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Selected Rider Summary */}
            {selectedRider && (
              <div className="bg-primary-50 border border-primary-200 rounded-button p-4 mb-6">
                <h5 className="text-sm font-medium text-primary-800 mb-2">New Rider</h5>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-900">
                      {selectedRider.fullName}
                    </p>
                    <p className="text-xs text-primary-700">
                      {selectedRider.rating.toFixed(1)}★ • {selectedRider.completedDeliveries} deliveries • {selectedRider.acceptanceRate.toFixed(0)}% acceptance rate
                    </p>
                    {selectedRider.activeAssignments > 0 && (
                      <p className="text-xs text-warning-700">
                        Currently has {selectedRider.activeAssignments} active assignment(s)
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {getRiderStatusBadge(selectedRider)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-surface-50 px-4 py-3 sm:px-6 border-t border-border-light">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex justify-center rounded-button border border-border-default shadow-soft px-4 py-2 bg-surface-0 text-base font-medium text-text-secondary hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex justify-center rounded-button border border-transparent shadow-soft px-4 py-2 bg-warning-600 text-base font-medium text-text-inverse hover:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleReplaceRider}
                disabled={!selectedRider || assignRiderMutation.isPending}
              >
                {assignRiderMutation.isPending && <Spinner size="sm" className="mr-2" />}
                {assignRiderMutation.isPending ? 'Replacing...' : 'Replace Rider'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}