'use client';

import { useState } from 'react';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Bike } from 'lucide-react';
import { usePendingOrdersAssignment } from '@/app/lib/hooks/api-hooks.ts/use-order-management';
import { Spinner } from '../../ui/Spinner';
import LoadingState from '../../ui/LoadingState';
import RiderAssignmentModal from './RiderAssignmentModal';
import { PendingOrderDto } from '@/app/data/types/order';
import { formatCurrency } from '@/app/lib/utils/currency';

export default function PendingOrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<PendingOrderDto | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const { data: pendingOrders, isLoading, error, refetch, isFetching: isRefreshing } = usePendingOrdersAssignment({ enabled: true });

  const handleAssignRider = (order: PendingOrderDto) => {
    setSelectedOrder(order);
    setShowAssignmentModal(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getStatusBadge = (statusText: string) => {
    const statusConfig = {
      'Preparing': { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' },
      'NoRiderFound': { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200' },
    };

    const config = statusConfig[statusText as keyof typeof statusConfig] || statusConfig['Preparing'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        {statusText === 'NoRiderFound' ? 'No Rider Found' : statusText}
      </span>
    );
  };

  if (isLoading) {
    return <LoadingState title="Loading pending orders..." />;
  }

  if (error) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="text-center">
          <div className="bg-danger-50 rounded-full p-3 inline-flex">
            <ClockIcon className="h-6 w-6 text-danger-600" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-text-primary">Failed to load orders</h3>
          <p className="mt-1 text-sm text-text-secondary">Unable to fetch pending orders. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-border-light">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h3 className="text-lg font-medium text-text-primary">
                Orders Awaiting Rider Assignment
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Orders currently preparing or without assigned riders
              </p>
            </div>
            <div className="flex items-center space-x-3">

              <button
                onClick={() => refetch()}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-button hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRefreshing ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {!pendingOrders || pendingOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bike className="mx-auto h-12 w-12 text-text-tertiary" />
            <h3 className="mt-2 text-sm font-medium text-text-primary">No pending orders</h3>
            <p className="mt-1 text-sm text-text-secondary">
              All orders currently have riders assigned or are not ready for assignment.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-border-light">
                {pendingOrders.map((order: PendingOrderDto) => (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Order #{order.orderId}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatTimeAgo(order.orderDate)}
                        </p>
                      </div>
                      {getStatusBadge(order.statusText)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {order.customerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {order.customerName}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-text-secondary">
                              {order.isDelivery ? 'Delivery' : 'Pickup'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Total:</span>
                        <span className="font-medium text-text-primary">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      {order.isDelivery && order.deliveryAddress && (
                        <div className="flex items-start space-x-2">
                          <MapPinIcon className="h-4 w-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-text-secondary leading-relaxed">
                            {order.deliveryAddress}
                          </span>
                        </div>
                      )}

                      {order.assignmentAttempts > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-warning-600">
                          <span>Assignment attempts: {order.assignmentAttempts}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAssignRider(order)}
                      className="w-full px-3 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                    >
                      Assign Rider
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light">
                <thead className="bg-surface-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Vendor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-0 divide-y divide-border-light">
                  {pendingOrders.map((order: PendingOrderDto) => (
                    <tr key={order.id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-text-primary">#{order.orderId}</div>
                          {order.isDelivery && order.deliveryAddress && (
                            <div className="text-xs text-text-secondary max-w-xs truncate">
                              {order.deliveryAddress}
                            </div>
                          )}
                          {order.assignmentAttempts > 0 && (
                            <div className="text-xs text-warning-600">
                              {order.assignmentAttempts} attempts
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {order.customerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-text-primary">{order.customerName}</div>
                            <div className="text-xs text-text-secondary">
                              {order.isDelivery ? 'Delivery' : 'Pickup'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">{order.vendorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.statusText)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">{formatTimeAgo(order.orderDate)}</div>
                        {order.lastAssignmentAttempt && (
                          <div className="text-xs text-text-secondary">
                            Last attempt: {formatTimeAgo(order.lastAssignmentAttempt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleAssignRider(order)}
                          className="px-3 py-1.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          Assign Rider
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rider Assignment Modal */}
      <RiderAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}